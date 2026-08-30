"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type LikeState = {
  count: number;
  liked: boolean;
};

type LikeButtonProps = {
  postId: string;
  labels: {
    like: string;
    unlike: string;
    unavailable: string;
  };
};

const SAVE_DELAY_MS = 500;

export function LikeButton({ postId, labels }: LikeButtonProps) {
  const [state, setState] = useState<LikeState>({ count: 0, liked: false });
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const desiredLiked = useRef(false);
  const acknowledgedLiked = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);

  const save = useCallback(async () => {
    if (saving.current || desiredLiked.current === acknowledgedLiked.current) {
      return;
    }

    saving.current = true;
    const likedToSave = desiredLiked.current;

    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: likedToSave }),
      });

      if (!response.ok) throw new Error("Failed to save like");

      const result = (await response.json()) as LikeState;
      acknowledgedLiked.current = result.liked;
      setState(() => ({
        count: result.count,
        liked: desiredLiked.current,
      }));
      setUnavailable(false);
    } catch {
      desiredLiked.current = acknowledgedLiked.current;
      setState((current) => ({
        count: current.count + (acknowledgedLiked.current ? 1 : 0) - (current.liked ? 1 : 0),
        liked: acknowledgedLiked.current,
      }));
      setUnavailable(true);
    } finally {
      saving.current = false;
      if (desiredLiked.current !== acknowledgedLiked.current) {
        void save();
      }
    }
  }, [postId]);

  const flushWithKeepalive = useCallback(() => {
    if (desiredLiked.current === acknowledgedLiked.current) return;

    void fetch(`/api/posts/${encodeURIComponent(postId)}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liked: desiredLiked.current }),
      keepalive: true,
    });
  }, [postId]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/like`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to load likes");

        const result = (await response.json()) as LikeState;
        desiredLiked.current = result.liked;
        acknowledgedLiked.current = result.liked;
        setState(result);
        setUnavailable(false);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setUnavailable(true);
        }
      } finally {
        setLoaded(true);
      }
    }

    void load();
    return () => controller.abort();
  }, [postId]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") flushWithKeepalive();
    }

    window.addEventListener("pagehide", flushWithKeepalive);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      window.removeEventListener("pagehide", flushWithKeepalive);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      flushWithKeepalive();
    };
  }, [flushWithKeepalive]);

  function toggleLike() {
    if (!loaded) return;

    const nextLiked = !desiredLiked.current;
    desiredLiked.current = nextLiked;
    setState((current) => ({
      liked: nextLiked,
      count: Math.max(0, current.count + (nextLiked ? 1 : -1)),
    }));
    setUnavailable(false);

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void save(), SAVE_DELAY_MS);
  }

  const label = state.liked ? labels.unlike : labels.like;

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={!loaded}
      aria-label={unavailable ? labels.unavailable : label}
      aria-pressed={state.liked}
      title={unavailable ? labels.unavailable : label}
      className="group inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-muted-foreground transition-colors hover:text-rose-500 disabled:cursor-wait disabled:opacity-50"
    >
      <Heart
        className={`h-6 w-6 transition-transform group-active:scale-90 ${
          state.liked ? "fill-rose-500 text-rose-500" : ""
        }`}
        aria-hidden
      />
      <span className="min-w-5 text-left font-mono text-sm tabular-nums">
        {loaded ? state.count : "—"}
      </span>
    </button>
  );
}

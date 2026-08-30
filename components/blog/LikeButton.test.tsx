import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LikeButton } from "@/components/blog/LikeButton";

const labels = {
  like: "この記事にいいねする",
  unlike: "いいねを取り消す",
  unavailable: "現在いいね機能を利用できません",
};

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: async () => body } as Response;
}

describe("LikeButton", () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    global.fetch = fetchMock;
  });

  it("loads and displays the current state", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ count: 12, liked: true }));

    render(<LikeButton postId="thai-travel" labels={labels} />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("—")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("12")).toBeInTheDocument());
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button")).toHaveAccessibleName(labels.unlike);
  });

  it("updates optimistically and saves only after the debounce", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ count: 10, liked: false }))
      .mockResolvedValueOnce(jsonResponse({ count: 11, liked: true }));

    render(<LikeButton postId="thai-travel" labels={labels} />);
    await waitFor(() => expect(screen.getByText("10")).toBeInTheDocument());
    jest.useFakeTimers();

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(499);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "PUT",
      body: JSON.stringify({ liked: true }),
    });
  });

  it("collapses rapid toggles into the final state", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ count: 4, liked: false }));

    render(<LikeButton postId="thai-travel" labels={labels} />);
    await waitFor(() => expect(screen.getByText("4")).toBeInTheDocument());
    jest.useFakeTimers();

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(500);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("rolls back the optimistic state when saving fails", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ count: 10, liked: false }))
      .mockResolvedValueOnce(jsonResponse({}, false));

    render(<LikeButton postId="thai-travel" labels={labels} />);
    await waitFor(() => expect(screen.getByText("10")).toBeInTheDocument());
    jest.useFakeTimers();
    fireEvent.click(screen.getByRole("button"));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(500);
    });

    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button")).toHaveAccessibleName(labels.unavailable);
    });
  });

  it("flushes an unsaved state with keepalive when the page is hidden", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ count: 1, liked: false }))
      .mockResolvedValueOnce(jsonResponse({ count: 2, liked: true }));

    render(<LikeButton postId="thai-travel" labels={labels} />);
    await waitFor(() => expect(screen.getByText("1")).toBeInTheDocument());
    jest.useFakeTimers();
    fireEvent.click(screen.getByRole("button"));
    fireEvent(window, new Event("pagehide"));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "PUT",
      keepalive: true,
      body: JSON.stringify({ liked: true }),
    });
  });

  it("keeps the article usable when the initial request fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    render(<LikeButton postId="thai-travel" labels={labels} />);

    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());
    expect(screen.getByRole("button")).toHaveAccessibleName(labels.unavailable);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

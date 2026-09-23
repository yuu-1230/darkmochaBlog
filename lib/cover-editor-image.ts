/** Match the existing Next Image allowlist; never widen production image permissions. */
export function validCoverImage(value: string) {
  if (!value) return true;
  try {
    const base = new URL(process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? 'https://images.darkmocha.dev');
    const url = new URL(value,base);
    return (value.startsWith('/images/') || value.startsWith(`${base.origin}/images/`)) && url.origin === base.origin && url.pathname.startsWith('/images/') && !url.search && !url.hash && !/\s/.test(value);
  } catch { return false; }
}

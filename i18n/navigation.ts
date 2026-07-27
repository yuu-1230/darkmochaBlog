import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * ロケールを意識した Link / router。
 * サイト内リンクは next/link ではなくこちらを使う（/en 配下でプレフィックスが維持される）。
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

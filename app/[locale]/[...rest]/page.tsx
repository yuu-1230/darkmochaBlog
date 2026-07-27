import { notFound } from "next/navigation";

/**
 * ロケール配下でどのルートにも一致しなかったパスを 404 に落とす。
 * ルートレイアウトが app/[locale] 配下にあるため、これが無いと
 * 未定義パスがレイアウト無しの素の 404 になってしまう。
 */
export default function CatchAllPage() {
  notFound();
}

import { validatePage, validatePhoto } from "./magazine-validation";

type Node = { type: string; name?: string; value?: string; attributes?: Attribute[]; children?: Node[] };
type Attribute = { type: string; name?: string; value?: string | null | {type:string;value:string} };
function props(node: Node): Record<string, unknown> {
  return Object.fromEntries((node.attributes ?? []).map(a => {
    if (a.type !== "mdxJsxAttribute" || !a.name) throw new Error(`${node.name}: 属性の展開は使わず個別に指定してください`);
    let value: unknown = a.value;
    if (value && typeof value === "object") {
      try { value = JSON.parse((value as {value:string}).value); } catch { throw new Error(`${node.name}.${a.name}: 文字列または数値を直接指定してください`); }
    }
    return [a.name, value];
  }));
}
const children = (node: Node) => (node.children ?? []).filter(n => !(n.type === "text" && !n.value?.trim()));
/** Validate literal authoring options before React rendering, preserving Markdown headings. */
export default function remarkMagazine() {
  return (tree: Node) => {
    const ids = new Set<string>();
    let pageCount = 0;
    const register = (id: unknown) => {
      if (typeof id !== "string" || !/^[a-z][a-z0-9-]*$/.test(id)) throw new Error("誌面id: 英小文字から始まる英数字・ハイフンで指定してください");
      if (ids.has(id)) throw new Error(`誌面idが重複しています: ${id}`);
      ids.add(id);
    };
    const visit = (node: Node, parent?: Node, page?: Record<string, unknown>) => {
      let currentPage = page;
      if (node.name === "Spread") {
        if (parent?.type !== "root") throw new Error("Spreadは本文の最上位に置いてください");
        const p = props(node); register(p.id);
        if (Object.keys(p).some(k => k !== "id")) throw new Error("Spreadの設定はidだけです");
        const sheets = children(node);
        if ((sheets.length < 1 || sheets.length > 2) || sheets.some(n => n.name !== "Page")) throw new Error(`Spread ${p.id}: Pageを1〜2つ配置してください`);
        sheets.forEach((sheet, i) => {
          if (!sheet.attributes?.some(a => a.name === "id")) (sheet.attributes ??= []).push({type:"mdxJsxAttribute",name:"id",value:`${p.id}-${i === 0 ? "left" : "right"}`});
        });
      }
      if (node.name === "Page") {
        if (parent?.name !== "Spread") throw new Error("PageはSpreadの直下に置いてください");
        currentPage = props(node); validatePage(currentPage);
        if (currentPage.template === "opening" && pageCount !== 0) throw new Error("openingは記事の最初のページにだけ使用できます");
        pageCount++; register(`page-${currentPage.id}`);
        const photos = children(node).filter(n => n.name === "Photo");
        const template = currentPage.template;
        if (template === "opening" && photos.length) throw new Error("openingの写真はimageで指定してください");
        if (["photo","spotlight"].includes(String(template)) && photos.length !== 1) throw new Error(`Page ${template}: Photoを1つ配置してください`);
        if (template === "gallery") {
          const count = currentPage.layout === "one-plus-two" ? 3 : 2;
          if (photos.length !== count) throw new Error(`Page gallery: このlayoutにはPhotoが${count}枚必要です`);
          if (children(node).some(n => n.name !== "Photo")) throw new Error("galleryの説明文はPhoto.captionに書いてください");
        }
        if (template === "editorial") {
          if (photos.filter(n => props(n).placement === "lead").length !== 1 || photos.filter(n => props(n).placement === "support").length > 1) throw new Error("editorial: lead写真を1枚、support写真を最大1枚指定してください");
        }
      }
      if (node.name === "Photo") {
        if (!currentPage || parent?.name !== "Page") throw new Error("PhotoはPageの直下に配置してください");
        validatePhoto(props(node), currentPage);
      }
      for (const child of node.children ?? []) visit(child, node, currentPage);
    };
    visit(tree);
  };
}

import {parseComposition} from './page-composition';
import { backgrounds, placements } from "./magazine";

type Values = Record<string, unknown>;
const choices = {
  background: backgrounds, placement: placements, tone: ["light", "dark"],
  overlay: ["none", "local"], focal: null,
};
function check(values: Values, allowed: Record<string, readonly unknown[] | null>, context: string) {
  for (const [key, value] of Object.entries(values)) {
    if (!(key in allowed)) throw new Error(`${context}: 未対応の設定「${key}」`);
    if (allowed[key] && !allowed[key]!.includes(value)) throw new Error(`${context}.${key}: ${allowed[key]!.join(" / ")} から選択してください`);
    if (!allowed[key] && typeof value !== "string") throw new Error(`${context}.${key}: 文字列で指定してください`);
  }
  if (values.focal && (!/^\d{1,3}(?:\.\d+)?% \d{1,3}(?:\.\d+)?%$/.test(String(values.focal)) || String(values.focal).split(" ").some(v => parseFloat(v) > 100))) throw new Error(`${context}.focal: 0%〜100%の横・縦位置を指定してください`);
}
export function validateCover(value: unknown, image?: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("cover: オブジェクトで指定してください");
  const c = value as Values;
  const ranges: Record<string, [number, number]> = {imageZoom:[100,250],titleFontSize:[16,64],subtitleFontSize:[10,28],labelFontSize:[10,24]};
  for (const [key,[min,max]] of Object.entries(ranges)) {
    if (key in c && (typeof c[key] !== "number" || !Number.isFinite(c[key]) || Number(c[key]) < min || Number(c[key]) > max)) throw new Error(`cover.${key}: ${min}〜${max}の数値で指定してください`);
  }
  check(Object.fromEntries(Object.entries(c).filter(([key])=>!(key in ranges))), { ...choices, mode: ["composed", "image"], template: ["overlay", "vertical", "split", "typographic"], image: null, title: null, subtitle: null, label: null, titleSize: ["small", "medium", "large"], textSide: ["top", "bottom"], imageFit: ["cover", "contain"] }, "cover");
  if ((c.mode === "image" || (c.template && c.template !== "typographic")) && !(c.image || image)) throw new Error("cover: この表紙には画像が必要です");
  if ((c.textSide || c.imageFit) && c.template !== "split") throw new Error("cover.textSide / imageFit: splitだけで使用できます");
}
export function validatePage(p: Values) {
  const template = p.template ?? "text";
  const allowed: Record<string, readonly unknown[] | null> = { id: null, template: ["opening", "photo", "editorial", "text", "gallery", "spotlight", "feature"], background: backgrounds };
  if (template === "opening") Object.assign(allowed, choices, {image:null,title:null,subtitle:null});
  if (template === "feature") {allowed.layout = ["portrait","landscape","pair","mosaic","data"];allowed.balance=["text","photo"];allowed.composition=null;}
  if (template === "text") {allowed.columns = [1, 2];allowed.composition=null;}
  if (template === "photo") allowed.layout = ["bleed", "inset"];
  if (template === "editorial") {allowed.layout = ["photo-left", "photo-right"];allowed.composition=null;}
  if (template === "gallery") allowed.layout = ["pair", "stack", "one-plus-two"];
  check(p, allowed, "Page");
  if(p.composition)parseComposition(String(p.composition));
  if (template === "opening" && (!p.image || !p.title)) throw new Error("Page opening: imageとtitleが必要です");
}
export function validatePhoto(p: Values, page: Values) {
  const template = page.template ?? "text";
  const positions = template === "editorial" ? ["lead", "support"] : template === "text" ? ["inline", "left", "right"] : template === "spotlight" ? placements : [];
  check(p, {assetId:null,src:null,alt:null,caption:null,credit:null,kind:['photo','diagram','screenshot'],shape:["rect","circle"],size:["small","medium","large"],fit:["contain","cover"],ratio:["original","square","portrait","landscape"],focal:null,placement:positions,wrap:["none","around"]}, "Photo");
  if(p.assetId!==undefined&&(typeof p.assetId!=='string'||!/^asset-[a-f0-9-]+$/.test(p.assetId)))throw new Error('画像IDが不正です');
  if (!p.src || typeof p.alt !== "string") throw new Error("Photo: srcとaltが必要です");
  if (p.wrap === "around" && (template !== "text" || page.columns === 2 || !["left","right"].includes(String(p.placement)))) throw new Error("Photo.wrap: 1段のtextページでleftまたはrightを指定してください");
  if (p.shape === "circle" && p.ratio && p.ratio !== "square" && p.ratio !== "original") throw new Error("Photo: circleにはsquareまたはoriginalを指定してください");
}

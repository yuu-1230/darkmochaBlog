import {templateCandidates} from './layout-registry';
import type { PlannedPage } from './remark-magazine-plan';
export type PhotoAsset={assetId?:string;src:string;width:number;height:number;alt?:string;caption?:string;credit?:string;kind?:'photo'|'diagram'|'screenshot'};
export type BlockInfo = {photos:PhotoAsset[];table:boolean;code?:boolean;characters?:number};
export type BlockCatalog = Record<string,BlockInfo>;
export function pagePhotos(page:PlannedPage,catalog:BlockCatalog){return page.blocks.flatMap(id=>catalog[id]?.photos??[]);}
export function layoutOptions(page:PlannedPage,catalog:BlockCatalog):string[]{return templateCandidates(page,catalog).filter(id=>id!=='text');}

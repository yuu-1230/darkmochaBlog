import { hasMagazinePages } from "./magazine";
import { expandMagazineText } from "./magazine-search-text";
import remarkMagazine from "./remark-magazine";
import {validateCover} from "./magazine-validation";

type Node = Parameters<ReturnType<typeof remarkMagazine>>[0];
const el = (name:string, values:Record<string,string|number>={}, children:Node[]=[]):Node => ({type:"mdxJsxFlowElement",name,attributes:Object.entries(values).map(([name,value])=>({type:"mdxJsxAttribute",name,value:typeof value === "number" ? {type:"mdxJsxAttributeValueExpression",value:String(value)} : value})),children});
const text:Node = {type:"paragraph",children:[{type:"text",value:"本文を失わない"}]};
const photo = (values:Record<string,string>={}) => el("Photo",{src:"/images/test.jpg",alt:"説明",...values});
const page = (values:Record<string,string|number>={}, children:Node[]=[text]) => el("Page",values,children);
const root = (...spreads:Node[]):Node => ({type:"root",children:spreads});
const spread = (a=page(),b=page(),id="chapter") => el("Spread",{id},[a,b]);
const validate = (tree:Node) => remarkMagazine()(tree);

describe("magazine authoring contract",()=>{
  it("assigns stable page anchors without changing Markdown content",()=>{
    const tree=root(spread()); validate(tree);
    const sheets=tree.children![0].children!;
    expect(sheets[0].attributes).toContainEqual({type:"mdxJsxAttribute",name:"id",value:"chapter-left"});
    expect(sheets[0].children![0]).toBe(text);
  });
  it("keeps explicitly assigned old page links",()=>{
    const sheet=page({id:"journey-03"});validate(root(spread(sheet)));
    expect(sheet.attributes).toContainEqual({type:"mdxJsxAttribute",name:"id",value:"journey-03"});
  });
  it("allows a final single page but rejects empty spreads and duplicate anchors",()=>{
    expect(()=>validate(root(el("Spread",{id:"one"},[page()])))).not.toThrow();
    expect(()=>validate(root(el("Spread",{id:"empty"},[])))).toThrow();
    expect(()=>validate(root(spread(),spread()))).toThrow("重複");
  });
  it("rejects unknown options and mismatched layouts",()=>{
    expect(()=>validate(root(spread(page({template:"text",layout:"bleed"}))))).toThrow("未対応");
    expect(()=>validate(root(spread(page({background:"red"}))))).toThrow("選択");
  });
  it("requires image and title for an opening, only at the beginning",()=>{
    expect(()=>validate(root(spread(page({template:"opening"}))))).toThrow("imageとtitle");
    expect(()=>validate(root(spread(page(),page({template:"opening",image:"/images/a.jpg",title:"扉"}))))).toThrow("最初");
  });
  it("validates editorial and gallery image roles/counts",()=>{
    expect(()=>validate(root(spread(page({template:"editorial"},[photo()]))))).toThrow("lead");
    expect(()=>validate(root(spread(page({template:"gallery",layout:"one-plus-two"},[photo(),photo()]))))).toThrow("3枚");
    expect(()=>validate(root(spread(page({template:"editorial"},[photo({placement:"lead"}),text,photo({placement:"support"})]))))).not.toThrow();
  });
  it("limits wrap to single-column text and requires alt",()=>{
    expect(()=>validate(root(spread(page({columns:2},[photo({wrap:"around",placement:"left"})]))))).toThrow("1段");
    expect(()=>validate(root(spread(page({},[photo({wrap:"around",placement:"left",shape:"circle"})]))))).not.toThrow();
    expect(()=>validate(root(spread(page({},[el("Photo",{src:"/images/a.jpg"})]))))).toThrow("alt");
  });
  it("does not interpret components inside fenced code as pages",()=>{
    expect(()=>validate(root({type:"code",value:'<Page template="unknown">'}))).not.toThrow();
  });
  it("validates cover choices and required source images",()=>{
    expect(()=>validateCover({template:"vertical",placement:"top-right"},"/images/a.jpg")).not.toThrow();
    expect(()=>validateCover({mode:"image"})).toThrow("画像");
    expect(()=>validateCover({template:"overlay",textSide:"top"},"/images/a.jpg")).toThrow("split");
    expect(()=>validateCover({focal:"200% 50%"})).toThrow("focal");
  });
});

 it("keeps displayed captions and titles in searchable text",()=>{
   const source = '<Page title="旅の始まり"><Photo src="/images/a.jpg" alt="写真" caption="父が勧めた旅 > 新しい経験" /></Page>';
   const text = expandMagazineText(source).replace(/<[^>]+>/g, "");
   expect(text).toContain("旅の始まり");
   expect(text).toContain("父が勧めた旅 > 新しい経験");
   expect(text).not.toContain("/images/");
   expect(text).not.toContain("caption=");
   expect(expandMagazineText('<Photo caption={"思い出\\n二行目"} />')).toContain("思い出\n二行目");
 });

it("keeps fenced Spread examples in the regular article reader",()=>{
  expect(hasMagazinePages('```mdx\n<Spread id="example">\n```')).toBe(false);
  expect(hasMagazinePages('<Spread id="example">')).toBe(true);
});

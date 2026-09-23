import matter from 'gray-matter';
export function writeReader(source:string,reader:unknown){
  const match=source.match(/^(---\r?\n)([\s\S]*?)(^---\s*$)/m);
  if(!match||match.index!==0)throw new Error('frontmatterがありません');
  const yaml=matter.stringify('',{reader}).replace(/^---\r?\n/,'').replace(/\r?\n---[\s\S]*$/,'')+'\n';
  const header=/^reader:/m.test(match[2])?match[2].replace(/^reader:[^\r\n]*(?:\r?\n[ \t]+[^\r\n]*)*/m,yaml.trimEnd()):match[2]+yaml;
  return match[1]+header+source.slice(match[1].length+match[2].length);
}

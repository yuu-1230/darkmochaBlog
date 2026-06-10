import { typographyComponents, C } from "./typography";
import { codeComponents } from "./code";
import { mediaComponents } from "./media";
import { calloutComponents, Tip } from "./callouts";
import { linkComponents } from "./links";

export const mdxComponents = {
  ...typographyComponents,
  ...codeComponents,
  ...mediaComponents,
  ...calloutComponents,
  ...linkComponents,
};

export { C, Tip };

export const SITE_URL = "https://www.darkmocha.dev";
export const SITE_NAME = "Darkmocha Blog";
export const AUTHOR_NAME = "Yuto Nagata";
export const AUTHOR_URL = SITE_URL;

export const CATEGORIES = ["Tech", "Unity", "Life"] as const;
export type Category = (typeof CATEGORIES)[number];

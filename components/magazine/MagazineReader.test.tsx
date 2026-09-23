import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MagazineReader } from "./MagazineReader";

jest.mock("next-intl", () => ({ useLocale: () => "ja" }));
jest.mock("@/i18n/navigation", () => ({ Link: (props: React.ComponentProps<"a">) => <a {...props} /> }));

const content = <>
  <section id="page-one" data-magazine-page="one"><div className="magazine-page-content"><h2 id="first">First section</h2></div></section>
  <section id="page-two" data-magazine-page="two"><div className="magazine-page-content">Second page</div></section>
  <section id="page-three" data-magazine-page="three"><div className="magazine-page-content"><h2 id="last">Last section</h2></div></section>
  <section id="page-four" data-magazine-page="four"><div className="magazine-page-content">The final paragraph</div></section>
</>;
const toc = [{ id: "last", text: "Last section", level: 2, numberLabel: "1" }];

beforeEach(() => {
  window.history.replaceState({}, "", "/blog/example");
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1536 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 1024 });
  window.ResizeObserver = class { observe() {} disconnect() {} unobserve() {} };
  Element.prototype.scrollIntoView = jest.fn();
});

test("turns spreads without removing the full article, and resolves history fragments", async () => {
  render(<MagazineReader toc={toc}>{content}</MagazineReader>);
  expect(screen.getByRole("button", { name: "前のページ" })).toBeDisabled();
  await waitFor(()=>expect(document.getElementById("page-three")).toHaveAttribute("hidden"));
  expect(document.getElementById("page-four")).toHaveTextContent("The final paragraph");
  await waitFor(()=>expect(screen.getByRole("button", { name: "次のページ →" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "次のページ →" }));
  expect(location.hash).toBe("#page-three");
  expect(document.getElementById("page-three")).not.toHaveAttribute("hidden");
  expect(screen.getByRole("button", { name: "次のページ →" })).toBeDisabled();
  window.history.replaceState({}, "", "#first");
  fireEvent.popState(window);
  await waitFor(() => expect(document.getElementById("page-one")).not.toHaveAttribute("hidden"));
});

test("opens a deep link and keeps paged reading on short desktop screens", async () => {
  window.history.replaceState({}, "", "#last");
  const { container } = render(<MagazineReader toc={toc}>{content}</MagazineReader>);
  expect(document.getElementById("page-three")).not.toHaveAttribute("hidden");
  await waitFor(()=>expect(document.getElementById("page-one")).toHaveAttribute("hidden"));
  Object.defineProperty(window, "innerHeight", { value: 500 });
  fireEvent.resize(window);
  await waitFor(()=>expect(screen.getByRole("button", {name:"前のページ"})).toBeEnabled());
  expect(container.querySelector(".magazine-reader")).toHaveAttribute("data-reader-mode", "spread");
  expect(document.getElementById("page-one")).toHaveAttribute("hidden");
});

test("native find switches to the complete readable document", async () => {
  const { container } = render(<MagazineReader toc={toc}>{content}</MagazineReader>);
  fireEvent.keyDown(document, { key: "f", metaKey: true });
  expect(container.querySelector(".magazine-reader")).toHaveAttribute("data-reader-mode", "flow");
  await waitFor(()=>expect(screen.getByText("The final paragraph")).toBeVisible());
});

test("paginates overset content instead of switching to scroll mode", async () => {
  const { container } = render(<MagazineReader toc={toc}>{content}</MagazineReader>);
  const page=document.getElementById('page-one')!;
  Object.defineProperty(page,'clientWidth',{configurable:true,value:656});
  const body=page.querySelector('.magazine-page-content')!;
  Object.defineProperties(body,{
    clientHeight:{configurable:true,value:700},scrollHeight:{configurable:true,value:820},
    clientWidth:{configurable:true,value:600},scrollWidth:{configurable:true,value:1256},
  });
  await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('01 — 02 / 5'));
  expect(container.querySelector('.magazine-reader')).toHaveAttribute('data-reader-mode','spread');
  expect(page).toHaveAttribute('data-continuation');
  expect(page.style.gridColumn).toBe('span 2');
  expect(document.getElementById('page-two')).toHaveAttribute('hidden');
  await waitFor(()=>expect(screen.getByRole('button',{name:'次のページ →'})).toBeEnabled());
 fireEvent.click(screen.getByRole('button',{name:'次のページ →'}));
  expect(document.getElementById('page-two')).not.toHaveAttribute('hidden');
  expect(document.getElementById('page-four')).toHaveTextContent('The final paragraph');
});

test("uses a single page on medium-width screens and keeps the reading position on resize",async()=>{
 const {container}=render(<MagazineReader toc={toc}>{content}</MagazineReader>);
 await waitFor(()=>expect(screen.getByRole('button',{name:'次のページ →'})).toBeEnabled());
 fireEvent.click(screen.getByRole('button',{name:'次のページ →'}));
 Object.defineProperty(window,'innerWidth',{value:1024});fireEvent.resize(window);
 expect(container.querySelector('.magazine-reader')).toHaveAttribute('data-single');
 expect(document.getElementById('page-three')).not.toHaveAttribute('hidden');
 await waitFor(()=>expect(document.getElementById('page-four')).toHaveAttribute('hidden'));
 await waitFor(()=>expect(screen.getByRole('button',{name:'次のページ →'})).toBeEnabled());
 fireEvent.click(screen.getByRole('button',{name:'次のページ →'}));
 expect(document.getElementById('page-four')).not.toHaveAttribute('hidden');
});

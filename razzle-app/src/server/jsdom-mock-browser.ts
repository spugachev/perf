import { JSDOM } from "jsdom";
import "raf/polyfill";

const { window } = new JSDOM("<!doctype html><html><head></head><body></body></html>");

// @ts-ignore
global.document = window.document;
// @ts-ignore
document.dispatchEvent = () => {};
// @ts-ignore
global.window = window;
// @ts-ignore
global.navigator = window.navigator;
// @ts-ignore
global.CustomEvent = (event, params) => {
  return {};
};

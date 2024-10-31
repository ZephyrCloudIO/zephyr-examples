const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/bootstrap-DA5ku1JN.js","assets/vite_mf_2_host__loadShare__react__loadShare__-BZWt6XwW.js","assets/_commonjsHelpers-BvryMGaU.js","assets/virtual_mf-REMOTE_ENTRY_ID-Ba-D59qW.js","assets/virtualExposes-Dff6wIYf.js","assets/bootstrap-Bv8auy69.css"])))=>i.map(i=>d[i]);
import { i as index_cjs, _ as __vitePreload } from "./virtual_mf-REMOTE_ENTRY_ID-Ba-D59qW.js";
import "./hostInit-CN6-YbaR.js";
import "./virtualExposes-Dff6wIYf.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
index_cjs.init({
  name: "vite-host",
  remotes: []
});
__vitePreload(() => import("./bootstrap-DA5ku1JN.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0);

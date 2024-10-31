const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__-CWRCkJvB.js","assets/_commonjsHelpers-BvryMGaU.js","assets/virtual_mf-REMOTE_ENTRY_ID-Ba-D59qW.js","assets/virtualExposes-Dff6wIYf.js","assets/vite_mf_2_host__loadRemote__vite_webpack_mf_1_Image__loadRemote__-D9wr2BHY.js","assets/vite_mf_2_host__loadRemote__vite_rspack_mf_1_Image__loadRemote__-CPpRNP0J.js"])))=>i.map(i=>d[i]);
import { r as require$$0$1, v as vite_mf_2_host__loadShare__react__loadShare__ } from "./vite_mf_2_host__loadShare__react__loadShare__-BZWt6XwW.js";
import { g as getDefaultExportFromCjs, a as getAugmentedNamespace } from "./_commonjsHelpers-BvryMGaU.js";
import { i as index_cjs, v as vite_mf_2_host__mf_v__runtimeInit__mf_v__, _ as __vitePreload } from "./virtual_mf-REMOTE_ENTRY_ID-Ba-D59qW.js";
import "./virtualExposes-Dff6wIYf.js";
function _mergeNamespaces(n2, m2) {
  for (var i = 0; i < m2.length; i++) {
    const e = m2[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k2 in e) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          if (d) {
            Object.defineProperty(n2, k2, d.get ? d : {
              enumerable: true,
              get: () => e[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = require$$0$1, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
const { loadShare } = index_cjs;
const { initPromise } = vite_mf_2_host__mf_v__runtimeInit__mf_v__;
const res = initPromise.then((_) => loadShare("react-dom", {
  customShareInfo: { shareConfig: {
    singleton: true,
    strictVersion: false,
    requiredVersion: "^18.3.1"
  } }
}));
const exportModule = await res.then((factory) => factory());
var vite_mf_2_host__loadShare__react_mf_2_dom__loadShare__$1 = exportModule;
const vite_mf_2_host__loadShare__react_mf_2_dom__loadShare__$2 = /* @__PURE__ */ getDefaultExportFromCjs(vite_mf_2_host__loadShare__react_mf_2_dom__loadShare__$1);
const vite_mf_2_host__loadShare__react_mf_2_dom__loadShare__ = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: vite_mf_2_host__loadShare__react_mf_2_dom__loadShare__$2
}, [vite_mf_2_host__loadShare__react_mf_2_dom__loadShare__$1]);
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(vite_mf_2_host__loadShare__react_mf_2_dom__loadShare__);
var createRoot;
var m = require$$0;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
const RemoteButton = vite_mf_2_host__loadShare__react__loadShare__.lazy(() => __vitePreload(() => import("./vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__-CWRCkJvB.js").then((n2) => n2.v), true ? __vite__mapDeps([0,1,2,3]) : void 0));
const WebpackImage = vite_mf_2_host__loadShare__react__loadShare__.lazy(() => __vitePreload(() => import("./vite_mf_2_host__loadRemote__vite_webpack_mf_1_Image__loadRemote__-D9wr2BHY.js").then((n2) => n2.v), true ? __vite__mapDeps([4,1,2,3]) : void 0));
const RspackImage = vite_mf_2_host__loadShare__react__loadShare__.lazy(() => __vitePreload(() => import("./vite_mf_2_host__loadRemote__vite_rspack_mf_1_Image__loadRemote__-CPpRNP0J.js").then((n2) => n2.v), true ? __vite__mapDeps([5,1,2,3]) : void 0));
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(vite_mf_2_host__loadShare__react__loadShare__.Suspense, { fallback: "Loading Button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RemoteButton, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(vite_mf_2_host__loadShare__react__loadShare__.Suspense, { fallback: "Loading Image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WebpackImage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(vite_mf_2_host__loadShare__react__loadShare__.Suspense, { fallback: "Loading Image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RspackImage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Vite + React" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Edit ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "src/App.tsx" }),
      " and save to test HMR"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "read-the-docs", children: "Click on the Vite and React logos to learn more" })
  ] });
}
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(vite_mf_2_host__loadShare__react__loadShare__.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);

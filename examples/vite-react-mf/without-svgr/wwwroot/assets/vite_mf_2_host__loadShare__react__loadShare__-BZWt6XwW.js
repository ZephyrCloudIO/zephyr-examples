import { g as getDefaultExportFromCjs, a as getAugmentedNamespace } from "./_commonjsHelpers-BvryMGaU.js";
import { i as index_cjs, v as vite_mf_2_host__mf_v__runtimeInit__mf_v__ } from "./virtual_mf-REMOTE_ENTRY_ID-Ba-D59qW.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
const { loadShare } = index_cjs;
const { initPromise } = vite_mf_2_host__mf_v__runtimeInit__mf_v__;
const res = initPromise.then((_) => loadShare("react", {
  customShareInfo: { shareConfig: {
    singleton: true,
    strictVersion: false,
    requiredVersion: "^18.3.1"
  } }
}));
const exportModule = await res.then((factory) => factory());
var vite_mf_2_host__loadShare__react__loadShare__$1 = exportModule;
const vite_mf_2_host__loadShare__react__loadShare__$2 = /* @__PURE__ */ getDefaultExportFromCjs(vite_mf_2_host__loadShare__react__loadShare__$1);
const vite_mf_2_host__loadShare__react__loadShare__ = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: vite_mf_2_host__loadShare__react__loadShare__$2
}, [vite_mf_2_host__loadShare__react__loadShare__$1]);
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(vite_mf_2_host__loadShare__react__loadShare__);
export {
  require$$0 as r,
  vite_mf_2_host__loadShare__react__loadShare__$1 as v
};

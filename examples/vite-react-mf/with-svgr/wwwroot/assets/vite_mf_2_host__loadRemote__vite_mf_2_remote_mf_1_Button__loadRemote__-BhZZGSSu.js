import { g as getDefaultExportFromCjs } from "./bootstrap-C1XG_0G-.js";
import { i as index_cjs, v as vite_mf_2_host__mf_v__runtimeInit__mf_v__ } from "./virtual_mf-REMOTE_ENTRY_ID-BSFIM8Mi.js";
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
const { loadRemote } = index_cjs;
const { initPromise } = vite_mf_2_host__mf_v__runtimeInit__mf_v__;
const res = initPromise.then((_) => loadRemote("vite-remote/Button"));
const exportModule = await initPromise.then((_) => res);
var vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__ = exportModule;
const vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__$1 = /* @__PURE__ */ getDefaultExportFromCjs(vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__);
const vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__$2 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__$1
}, [vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__]);
export {
  vite_mf_2_host__loadRemote__vite_mf_2_remote_mf_1_Button__loadRemote__$2 as v
};

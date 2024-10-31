import exposesMap from "./virtualExposes-Dff6wIYf.js";
var index_cjs$1 = {};
var polyfills_cjs$1 = {};
function _extends$1() {
  _extends$1 = Object.assign || function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
function _object_without_properties_loose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
polyfills_cjs$1._extends = _extends$1;
polyfills_cjs$1._object_without_properties_loose = _object_without_properties_loose;
var index_cjs = {};
var polyfills_cjs = {};
function _extends() {
  _extends = Object.assign || function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
polyfills_cjs._extends = _extends;
var define_process_env_default = {};
var polyfills$1 = polyfills_cjs;
const FederationModuleManifest = "federation-manifest.json";
const MANIFEST_EXT = ".json";
const BROWSER_LOG_KEY = "FEDERATION_DEBUG";
const BROWSER_LOG_VALUE = "1";
const NameTransformSymbol = {
  AT: "@",
  HYPHEN: "-",
  SLASH: "/"
};
const NameTransformMap = {
  [NameTransformSymbol.AT]: "scope_",
  [NameTransformSymbol.HYPHEN]: "_",
  [NameTransformSymbol.SLASH]: "__"
};
const EncodedNameTransformMap = {
  [NameTransformMap[NameTransformSymbol.AT]]: NameTransformSymbol.AT,
  [NameTransformMap[NameTransformSymbol.HYPHEN]]: NameTransformSymbol.HYPHEN,
  [NameTransformMap[NameTransformSymbol.SLASH]]: NameTransformSymbol.SLASH
};
const SEPARATOR = ":";
const ManifestFileName = "mf-manifest.json";
const StatsFileName = "mf-stats.json";
const MFModuleType = {
  NPM: "npm",
  APP: "app"
};
const MODULE_DEVTOOL_IDENTIFIER = "__MF_DEVTOOLS_MODULE_INFO__";
const ENCODE_NAME_PREFIX = "ENCODE_NAME_PREFIX";
const TEMP_DIR = ".federation";
const MFPrefetchCommon = {
  identifier: "MFDataPrefetch",
  globalKey: "__PREFETCH__",
  library: "mf-data-prefetch",
  exportsKey: "__PREFETCH_EXPORTS__",
  fileName: "bootstrap.js"
};
var ContainerPlugin = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
var ContainerReferencePlugin = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
var ModuleFederationPlugin = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
var SharePlugin = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
function isBrowserEnv() {
  return typeof window !== "undefined";
}
function isDebugMode() {
  if (typeof process !== "undefined" && define_process_env_default && define_process_env_default["FEDERATION_DEBUG"]) {
    return Boolean(define_process_env_default["FEDERATION_DEBUG"]);
  }
  return typeof FEDERATION_DEBUG !== "undefined" && Boolean(FEDERATION_DEBUG);
}
const getProcessEnv = function() {
  return typeof process !== "undefined" && define_process_env_default ? define_process_env_default : {};
};
const DEBUG_LOG = "[ FEDERATION DEBUG ]";
function safeToString$1(info) {
  try {
    return JSON.stringify(info, null, 2);
  } catch (e) {
    return "";
  }
}
function safeGetLocalStorageItem() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(BROWSER_LOG_KEY) === BROWSER_LOG_VALUE;
    }
  } catch (error2) {
    return typeof document !== "undefined";
  }
  return false;
}
let Logger = class Logger2 {
  info(msg, info) {
    if (this.enable) {
      const argsToString = safeToString$1(info) || "";
      if (isBrowserEnv()) {
        console.info(`%c ${this.identifier}: ${msg} ${argsToString}`, "color:#3300CC");
      } else {
        console.info("\x1B[34m%s", `${this.identifier}: ${msg} ${argsToString ? `
${argsToString}` : ""}`);
      }
    }
  }
  logOriginalInfo(...args) {
    if (this.enable) {
      if (isBrowserEnv()) {
        console.info(`%c ${this.identifier}: OriginalInfo`, "color:#3300CC");
        console.log(...args);
      } else {
        console.info(`%c ${this.identifier}: OriginalInfo`, "color:#3300CC");
        console.log(...args);
      }
    }
  }
  constructor(identifier) {
    this.enable = false;
    this.identifier = identifier || DEBUG_LOG;
    if (isBrowserEnv() && safeGetLocalStorageItem()) {
      this.enable = true;
    } else if (isDebugMode()) {
      this.enable = true;
    }
  }
};
const LOG_CATEGORY$1 = "[ Federation Runtime ]";
const parseEntry = (str, devVerOrUrl, separator = SEPARATOR) => {
  const strSplit = str.split(separator);
  const devVersionOrUrl = getProcessEnv()["NODE_ENV"] === "development" && devVerOrUrl;
  const defaultVersion = "*";
  const isEntry = (s) => s.startsWith("http") || s.includes(MANIFEST_EXT);
  if (strSplit.length >= 2) {
    let [name, ...versionOrEntryArr] = strSplit;
    if (str.startsWith(separator)) {
      versionOrEntryArr = [
        devVersionOrUrl || strSplit.slice(-1)[0]
      ];
      name = strSplit.slice(0, -1).join(separator);
    }
    let versionOrEntry = devVersionOrUrl || versionOrEntryArr.join(separator);
    if (isEntry(versionOrEntry)) {
      return {
        name,
        entry: versionOrEntry
      };
    } else {
      return {
        name,
        version: versionOrEntry || defaultVersion
      };
    }
  } else if (strSplit.length === 1) {
    const [name] = strSplit;
    if (devVersionOrUrl && isEntry(devVersionOrUrl)) {
      return {
        name,
        entry: devVersionOrUrl
      };
    }
    return {
      name,
      version: devVersionOrUrl || defaultVersion
    };
  } else {
    throw `Invalid entry value: ${str}`;
  }
};
const logger = new Logger();
const composeKeyWithSeparator = function(...args) {
  if (!args.length) {
    return "";
  }
  return args.reduce((sum, cur) => {
    if (!cur) {
      return sum;
    }
    if (!sum) {
      return cur;
    }
    return `${sum}${SEPARATOR}${cur}`;
  }, "");
};
const encodeName = function(name, prefix = "", withExt = false) {
  try {
    const ext = withExt ? ".js" : "";
    return `${prefix}${name.replace(new RegExp(`${NameTransformSymbol.AT}`, "g"), NameTransformMap[NameTransformSymbol.AT]).replace(new RegExp(`${NameTransformSymbol.HYPHEN}`, "g"), NameTransformMap[NameTransformSymbol.HYPHEN]).replace(new RegExp(`${NameTransformSymbol.SLASH}`, "g"), NameTransformMap[NameTransformSymbol.SLASH])}${ext}`;
  } catch (err) {
    throw err;
  }
};
const decodeName = function(name, prefix, withExt) {
  try {
    let decodedName = name;
    if (prefix) {
      if (!decodedName.startsWith(prefix)) {
        return decodedName;
      }
      decodedName = decodedName.replace(new RegExp(prefix, "g"), "");
    }
    decodedName = decodedName.replace(new RegExp(`${NameTransformMap[NameTransformSymbol.AT]}`, "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.AT]]).replace(new RegExp(`${NameTransformMap[NameTransformSymbol.SLASH]}`, "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.SLASH]]).replace(new RegExp(`${NameTransformMap[NameTransformSymbol.HYPHEN]}`, "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.HYPHEN]]);
    if (withExt) {
      decodedName = decodedName.replace(".js", "");
    }
    return decodedName;
  } catch (err) {
    throw err;
  }
};
const generateExposeFilename = (exposeName, withExt) => {
  if (!exposeName) {
    return "";
  }
  let expose = exposeName;
  if (expose === ".") {
    expose = "default_export";
  }
  if (expose.startsWith("./")) {
    expose = expose.replace("./", "");
  }
  return encodeName(expose, "__federation_expose_", withExt);
};
const generateShareFilename = (pkgName, withExt) => {
  if (!pkgName) {
    return "";
  }
  return encodeName(pkgName, "__federation_shared_", withExt);
};
const getResourceUrl = (module, sourceUrl) => {
  if ("getPublicPath" in module) {
    let publicPath;
    if (!module.getPublicPath.startsWith("function")) {
      publicPath = new Function(module.getPublicPath)();
    } else {
      publicPath = new Function("return " + module.getPublicPath)()();
    }
    return `${publicPath}${sourceUrl}`;
  } else if ("publicPath" in module) {
    return `${module.publicPath}${sourceUrl}`;
  } else {
    console.warn("Cannot get resource URL. If in debug mode, please ignore.", module, sourceUrl);
    return "";
  }
};
const assert$1 = (condition, msg) => {
  if (!condition) {
    error$1(msg);
  }
};
const error$1 = (msg) => {
  throw new Error(`${LOG_CATEGORY$1}: ${msg}`);
};
const warn$1 = (msg) => {
  console.warn(`${LOG_CATEGORY$1}: ${msg}`);
};
function safeToString(info) {
  try {
    return JSON.stringify(info, null, 2);
  } catch (e) {
    return "";
  }
}
const simpleJoinRemoteEntry = (rPath, rName) => {
  if (!rPath) {
    return rName;
  }
  const transformPath = (str) => {
    if (str === ".") {
      return "";
    }
    if (str.startsWith("./")) {
      return str.replace("./", "");
    }
    if (str.startsWith("/")) {
      const strWithoutSlash = str.slice(1);
      if (strWithoutSlash.endsWith("/")) {
        return strWithoutSlash.slice(0, -1);
      }
      return strWithoutSlash;
    }
    return str;
  };
  const transformedPath = transformPath(rPath);
  if (!transformedPath) {
    return rName;
  }
  if (transformedPath.endsWith("/")) {
    return `${transformedPath}${rName}`;
  }
  return `${transformedPath}/${rName}`;
};
function inferAutoPublicPath(url2) {
  return url2.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
}
function generateSnapshotFromManifest(manifest, options = {}) {
  var _manifest_metaData, _manifest_metaData1;
  const { remotes = {}, overrides = {}, version } = options;
  let remoteSnapshot;
  const getPublicPath = () => {
    if ("publicPath" in manifest.metaData) {
      if (manifest.metaData.publicPath === "auto" && version) {
        return inferAutoPublicPath(version);
      }
      return manifest.metaData.publicPath;
    } else {
      return manifest.metaData.getPublicPath;
    }
  };
  const overridesKeys = Object.keys(overrides);
  let remotesInfo = {};
  if (!Object.keys(remotes).length) {
    var _manifest_remotes;
    remotesInfo = ((_manifest_remotes = manifest.remotes) == null ? void 0 : _manifest_remotes.reduce((res2, next) => {
      let matchedVersion;
      const name = next.federationContainerName;
      if (overridesKeys.includes(name)) {
        matchedVersion = overrides[name];
      } else {
        if ("version" in next) {
          matchedVersion = next.version;
        } else {
          matchedVersion = next.entry;
        }
      }
      res2[name] = {
        matchedVersion
      };
      return res2;
    }, {})) || {};
  }
  Object.keys(remotes).forEach((key) => remotesInfo[key] = {
    // overrides will override dependencies
    matchedVersion: overridesKeys.includes(key) ? overrides[key] : remotes[key]
  });
  const { remoteEntry: { path: remoteEntryPath, name: remoteEntryName, type: remoteEntryType }, types: remoteTypes, buildInfo: { buildVersion }, globalName, ssrRemoteEntry } = manifest.metaData;
  const { exposes } = manifest;
  let basicRemoteSnapshot = {
    version: version ? version : "",
    buildVersion,
    globalName,
    remoteEntry: simpleJoinRemoteEntry(remoteEntryPath, remoteEntryName),
    remoteEntryType,
    remoteTypes: simpleJoinRemoteEntry(remoteTypes.path, remoteTypes.name),
    remoteTypesZip: remoteTypes.zip || "",
    remoteTypesAPI: remoteTypes.api || "",
    remotesInfo,
    shared: manifest == null ? void 0 : manifest.shared.map((item) => ({
      assets: item.assets,
      sharedName: item.name,
      version: item.version
    })),
    modules: exposes == null ? void 0 : exposes.map((expose) => ({
      moduleName: expose.name,
      modulePath: expose.path,
      assets: expose.assets
    }))
  };
  if ((_manifest_metaData = manifest.metaData) == null ? void 0 : _manifest_metaData.prefetchInterface) {
    const prefetchInterface = manifest.metaData.prefetchInterface;
    basicRemoteSnapshot = polyfills$1._extends({}, basicRemoteSnapshot, {
      prefetchInterface
    });
  }
  if ((_manifest_metaData1 = manifest.metaData) == null ? void 0 : _manifest_metaData1.prefetchEntry) {
    const { path: path2, name, type } = manifest.metaData.prefetchEntry;
    basicRemoteSnapshot = polyfills$1._extends({}, basicRemoteSnapshot, {
      prefetchEntry: simpleJoinRemoteEntry(path2, name),
      prefetchEntryType: type
    });
  }
  if ("publicPath" in manifest.metaData) {
    remoteSnapshot = polyfills$1._extends({}, basicRemoteSnapshot, {
      publicPath: getPublicPath()
    });
  } else {
    remoteSnapshot = polyfills$1._extends({}, basicRemoteSnapshot, {
      getPublicPath: getPublicPath()
    });
  }
  if (ssrRemoteEntry) {
    const fullSSRRemoteEntry = simpleJoinRemoteEntry(ssrRemoteEntry.path, ssrRemoteEntry.name);
    remoteSnapshot.ssrRemoteEntry = fullSSRRemoteEntry;
    remoteSnapshot.ssrRemoteEntryType = ssrRemoteEntry.type || "commonjs-module";
  }
  return remoteSnapshot;
}
function isManifestProvider(moduleInfo) {
  if ("remoteEntry" in moduleInfo && moduleInfo.remoteEntry.includes(MANIFEST_EXT)) {
    return true;
  } else {
    return false;
  }
}
async function safeWrapper(callback, disableWarn) {
  try {
    const res2 = await callback();
    return res2;
  } catch (e) {
    !disableWarn && warn$1(e);
    return;
  }
}
function isStaticResourcesEqual(url1, url2) {
  const REG_EXP = /^(https?:)?\/\//i;
  const relativeUrl1 = url1.replace(REG_EXP, "").replace(/\/$/, "");
  const relativeUrl2 = url2.replace(REG_EXP, "").replace(/\/$/, "");
  return relativeUrl1 === relativeUrl2;
}
function createScript(info) {
  let script2 = null;
  let needAttach = true;
  let timeout = 2e4;
  let timeoutId;
  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    const s = scripts[i];
    const scriptSrc = s.getAttribute("src");
    if (scriptSrc && isStaticResourcesEqual(scriptSrc, info.url)) {
      script2 = s;
      needAttach = false;
      break;
    }
  }
  if (!script2) {
    const attrs2 = info.attrs;
    script2 = document.createElement("script");
    script2.type = (attrs2 == null ? void 0 : attrs2["type"]) === "module" ? "module" : "text/javascript";
    script2.src = info.url;
    let createScriptRes = void 0;
    if (info.createScriptHook) {
      createScriptRes = info.createScriptHook(info.url, info.attrs);
      if (createScriptRes instanceof HTMLScriptElement) {
        script2 = createScriptRes;
      } else if (typeof createScriptRes === "object") {
        if ("script" in createScriptRes && createScriptRes.script) {
          script2 = createScriptRes.script;
        }
        if ("timeout" in createScriptRes && createScriptRes.timeout) {
          timeout = createScriptRes.timeout;
        }
      }
    }
    if (attrs2 && !createScriptRes) {
      Object.keys(attrs2).forEach((name) => {
        if (script2) {
          if (name === "async" || name === "defer") {
            script2[name] = attrs2[name];
          } else if (!script2.getAttribute(name)) {
            script2.setAttribute(name, attrs2[name]);
          }
        }
      });
    }
  }
  const onScriptComplete = async (prev, event) => {
    var _info_cb;
    clearTimeout(timeoutId);
    if (script2) {
      script2.onerror = null;
      script2.onload = null;
      safeWrapper(() => {
        const { needDeleteScript = true } = info;
        if (needDeleteScript) {
          (script2 == null ? void 0 : script2.parentNode) && script2.parentNode.removeChild(script2);
        }
      });
      if (prev && typeof prev === "function") {
        var _info_cb1;
        const result = prev(event);
        if (result instanceof Promise) {
          var _info_cb2;
          const res2 = await result;
          info == null ? void 0 : (_info_cb2 = info.cb) == null ? void 0 : _info_cb2.call(info);
          return res2;
        }
        info == null ? void 0 : (_info_cb1 = info.cb) == null ? void 0 : _info_cb1.call(info);
        return result;
      }
    }
    info == null ? void 0 : (_info_cb = info.cb) == null ? void 0 : _info_cb.call(info);
  };
  script2.onerror = onScriptComplete.bind(null, script2.onerror);
  script2.onload = onScriptComplete.bind(null, script2.onload);
  timeoutId = setTimeout(() => {
    onScriptComplete(null, new Error(`Remote script "${info.url}" time-outed.`));
  }, timeout);
  return {
    script: script2,
    needAttach
  };
}
function createLink(info) {
  let link = null;
  let needAttach = true;
  const links = document.getElementsByTagName("link");
  for (let i = 0; i < links.length; i++) {
    const l = links[i];
    const linkHref = l.getAttribute("href");
    const linkRef = l.getAttribute("ref");
    if (linkHref && isStaticResourcesEqual(linkHref, info.url) && linkRef === info.attrs["ref"]) {
      link = l;
      needAttach = false;
      break;
    }
  }
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("href", info.url);
    let createLinkRes = void 0;
    const attrs2 = info.attrs;
    if (info.createLinkHook) {
      createLinkRes = info.createLinkHook(info.url, attrs2);
      if (createLinkRes instanceof HTMLLinkElement) {
        link = createLinkRes;
      }
    }
    if (attrs2 && !createLinkRes) {
      Object.keys(attrs2).forEach((name) => {
        if (link && !link.getAttribute(name)) {
          link.setAttribute(name, attrs2[name]);
        }
      });
    }
  }
  const onLinkComplete = (prev, event) => {
    if (link) {
      link.onerror = null;
      link.onload = null;
      safeWrapper(() => {
        const { needDeleteLink = true } = info;
        if (needDeleteLink) {
          (link == null ? void 0 : link.parentNode) && link.parentNode.removeChild(link);
        }
      });
      if (prev) {
        const res2 = prev(event);
        info.cb();
        return res2;
      }
    }
    info.cb();
  };
  link.onerror = onLinkComplete.bind(null, link.onerror);
  link.onload = onLinkComplete.bind(null, link.onload);
  return {
    link,
    needAttach
  };
}
function loadScript(url2, info) {
  const { attrs: attrs2 = {}, createScriptHook: createScriptHook2 } = info;
  return new Promise((resolve, _reject) => {
    const { script: script2, needAttach } = createScript({
      url: url2,
      cb: resolve,
      attrs: polyfills$1._extends({
        fetchpriority: "high"
      }, attrs2),
      createScriptHook: createScriptHook2,
      needDeleteScript: true
    });
    needAttach && document.head.appendChild(script2);
  });
}
function importNodeModule(name) {
  if (!name) {
    throw new Error("import specifier is required");
  }
  const importModule = new Function("name", `return import(name)`);
  return importModule(name).then((res2) => res2).catch((error2) => {
    console.error(`Error importing module ${name}:`, error2);
    throw error2;
  });
}
const loadNodeFetch = async () => {
  const fetchModule = await importNodeModule("node-fetch");
  return fetchModule.default || fetchModule;
};
const lazyLoaderHookFetch = async (input, init2) => {
  const loaderHooks = __webpack_require__.federation.instance.loaderHook;
  const hook = (url2, init22) => {
    return loaderHooks.lifecycle.fetch.emit(url2, init22);
  };
  const res2 = await hook(input, init2 || {});
  if (!res2 || !(res2 instanceof Response)) {
    const fetchFunction = typeof fetch === "undefined" ? await loadNodeFetch() : fetch;
    return fetchFunction(input, init2 || {});
  }
  return res2;
};
function createScriptNode(url, cb, attrs, createScriptHook) {
  if (createScriptHook) {
    const hookResult = createScriptHook(url);
    if (hookResult && typeof hookResult === "object" && "url" in hookResult) {
      url = hookResult.url;
    }
  }
  let urlObj;
  try {
    urlObj = new URL(url);
  } catch (e) {
    console.error("Error constructing URL:", e);
    cb(new Error(`Invalid URL: ${e}`));
    return;
  }
  const getFetch = async () => {
    if (typeof __webpack_require__ !== "undefined") {
      try {
        const loaderHooks = __webpack_require__.federation.instance.loaderHook;
        if (loaderHooks.lifecycle.fetch) {
          return lazyLoaderHookFetch;
        }
      } catch (e) {
        console.warn("federation.instance.loaderHook.lifecycle.fetch failed:", e);
      }
    }
    return typeof fetch === "undefined" ? loadNodeFetch() : fetch;
  };
  const handleScriptFetch = async (f, urlObj) => {
    try {
      var _vm_constants;
      const res = await f(urlObj.href);
      const data = await res.text();
      const [path, vm] = await Promise.all([
        importNodeModule("path"),
        importNodeModule("vm")
      ]);
      const scriptContext = {
        exports: {},
        module: {
          exports: {}
        }
      };
      const urlDirname = urlObj.pathname.split("/").slice(0, -1).join("/");
      const filename = path.basename(urlObj.pathname);
      var _vm_constants_USE_MAIN_CONTEXT_DEFAULT_LOADER;
      const script = new vm.Script(`(function(exports, module, require, __dirname, __filename) {${data}
})`, {
        filename,
        importModuleDynamically: (_vm_constants_USE_MAIN_CONTEXT_DEFAULT_LOADER = (_vm_constants = vm.constants) == null ? void 0 : _vm_constants.USE_MAIN_CONTEXT_DEFAULT_LOADER) != null ? _vm_constants_USE_MAIN_CONTEXT_DEFAULT_LOADER : importNodeModule
      });
      script.runInThisContext()(scriptContext.exports, scriptContext.module, eval("require"), urlDirname, filename);
      const exportedInterface = scriptContext.module.exports || scriptContext.exports;
      if (attrs && exportedInterface && attrs["globalName"]) {
        const container = exportedInterface[attrs["globalName"]] || exportedInterface;
        cb(void 0, container);
        return;
      }
      cb(void 0, exportedInterface);
    } catch (e) {
      cb(e instanceof Error ? e : new Error(`Script execution error: ${e}`));
    }
  };
  getFetch().then(async (f2) => {
    if ((attrs == null ? void 0 : attrs["type"]) === "esm" || (attrs == null ? void 0 : attrs["type"]) === "module") {
      return loadModule(urlObj.href, {
        fetch: f2,
        vm: await importNodeModule("vm")
      }).then(async (module) => {
        await module.evaluate();
        cb(void 0, module.namespace);
      }).catch((e) => {
        cb(e instanceof Error ? e : new Error(`Script execution error: ${e}`));
      });
    }
    handleScriptFetch(f2, urlObj);
  }).catch((err) => {
    cb(err);
  });
}
function loadScriptNode(url2, info) {
  return new Promise((resolve, reject) => {
    createScriptNode(url2, (error2, scriptContext2) => {
      if (error2) {
        reject(error2);
      } else {
        var _info_attrs, _info_attrs1;
        const remoteEntryKey = (info == null ? void 0 : (_info_attrs = info.attrs) == null ? void 0 : _info_attrs["globalName"]) || `__FEDERATION_${info == null ? void 0 : (_info_attrs1 = info.attrs) == null ? void 0 : _info_attrs1["name"]}:custom__`;
        const entryExports = globalThis[remoteEntryKey] = scriptContext2;
        resolve(entryExports);
      }
    }, info.attrs, info.createScriptHook);
  });
}
async function loadModule(url2, options) {
  const { fetch: fetch1, vm: vm2 } = options;
  const response = await fetch1(url2);
  const code = await response.text();
  const module = new vm2.SourceTextModule(code, {
    // @ts-ignore
    importModuleDynamically: async (specifier, script2) => {
      const resolvedUrl = new URL(specifier, url2).href;
      return loadModule(resolvedUrl, options);
    }
  });
  await module.link(async (specifier) => {
    const resolvedUrl = new URL(specifier, url2).href;
    const module2 = await loadModule(resolvedUrl, options);
    return module2;
  });
  return module;
}
function normalizeOptions(enableDefault, defaultOptions, key) {
  return function(options) {
    if (options === false) {
      return false;
    }
    if (typeof options === "undefined") {
      if (enableDefault) {
        return defaultOptions;
      } else {
        return false;
      }
    }
    if (options === true) {
      return defaultOptions;
    }
    if (options && typeof options === "object") {
      return polyfills$1._extends({}, defaultOptions, options);
    }
    throw new Error(`Unexpected type for \`${key}\`, expect boolean/undefined/object, got: ${typeof options}`);
  };
}
index_cjs.BROWSER_LOG_KEY = BROWSER_LOG_KEY;
index_cjs.BROWSER_LOG_VALUE = BROWSER_LOG_VALUE;
index_cjs.ENCODE_NAME_PREFIX = ENCODE_NAME_PREFIX;
index_cjs.EncodedNameTransformMap = EncodedNameTransformMap;
index_cjs.FederationModuleManifest = FederationModuleManifest;
index_cjs.Logger = Logger;
index_cjs.MANIFEST_EXT = MANIFEST_EXT;
index_cjs.MFModuleType = MFModuleType;
index_cjs.MFPrefetchCommon = MFPrefetchCommon;
index_cjs.MODULE_DEVTOOL_IDENTIFIER = MODULE_DEVTOOL_IDENTIFIER;
index_cjs.ManifestFileName = ManifestFileName;
index_cjs.NameTransformMap = NameTransformMap;
index_cjs.NameTransformSymbol = NameTransformSymbol;
index_cjs.SEPARATOR = SEPARATOR;
index_cjs.StatsFileName = StatsFileName;
index_cjs.TEMP_DIR = TEMP_DIR;
index_cjs.assert = assert$1;
index_cjs.composeKeyWithSeparator = composeKeyWithSeparator;
index_cjs.containerPlugin = ContainerPlugin;
index_cjs.containerReferencePlugin = ContainerReferencePlugin;
index_cjs.createLink = createLink;
index_cjs.createScript = createScript;
index_cjs.createScriptNode = createScriptNode;
index_cjs.decodeName = decodeName;
index_cjs.encodeName = encodeName;
index_cjs.error = error$1;
index_cjs.generateExposeFilename = generateExposeFilename;
index_cjs.generateShareFilename = generateShareFilename;
index_cjs.generateSnapshotFromManifest = generateSnapshotFromManifest;
index_cjs.getProcessEnv = getProcessEnv;
index_cjs.getResourceUrl = getResourceUrl;
index_cjs.inferAutoPublicPath = inferAutoPublicPath;
index_cjs.isBrowserEnv = isBrowserEnv;
index_cjs.isDebugMode = isDebugMode;
index_cjs.isManifestProvider = isManifestProvider;
index_cjs.isStaticResourcesEqual = isStaticResourcesEqual;
index_cjs.loadScript = loadScript;
index_cjs.loadScriptNode = loadScriptNode;
index_cjs.logger = logger;
index_cjs.moduleFederationPlugin = ModuleFederationPlugin;
index_cjs.normalizeOptions = normalizeOptions;
index_cjs.parseEntry = parseEntry;
index_cjs.safeToString = safeToString;
index_cjs.safeWrapper = safeWrapper;
index_cjs.sharePlugin = SharePlugin;
index_cjs.simpleJoinRemoteEntry = simpleJoinRemoteEntry;
index_cjs.warn = warn$1;
var share_cjs = {};
var polyfills = polyfills_cjs$1;
var sdk = index_cjs;
function getBuilderId() {
  return typeof FEDERATION_BUILD_IDENTIFIER !== "undefined" ? FEDERATION_BUILD_IDENTIFIER : "";
}
const LOG_CATEGORY = "[ Federation Runtime ]";
function assert(condition, msg) {
  if (!condition) {
    error(msg);
  }
}
function error(msg) {
  if (msg instanceof Error) {
    msg.message = `${LOG_CATEGORY}: ${msg.message}`;
    throw msg;
  }
  throw new Error(`${LOG_CATEGORY}: ${msg}`);
}
function warn(msg) {
  if (msg instanceof Error) {
    msg.message = `${LOG_CATEGORY}: ${msg.message}`;
    console.warn(msg);
  } else {
    console.warn(`${LOG_CATEGORY}: ${msg}`);
  }
}
function addUniqueItem(arr, item) {
  if (arr.findIndex((name) => name === item) === -1) {
    arr.push(item);
  }
  return arr;
}
function getFMId(remoteInfo) {
  if ("version" in remoteInfo && remoteInfo.version) {
    return `${remoteInfo.name}:${remoteInfo.version}`;
  } else if ("entry" in remoteInfo && remoteInfo.entry) {
    return `${remoteInfo.name}:${remoteInfo.entry}`;
  } else {
    return `${remoteInfo.name}`;
  }
}
function isRemoteInfoWithEntry(remote) {
  return typeof remote.entry !== "undefined";
}
function isPureRemoteEntry(remote) {
  return !remote.entry.includes(".json") && remote.entry.includes(".js");
}
function isObject(val) {
  return val && typeof val === "object";
}
const objectToString = Object.prototype.toString;
function isPlainObject(val) {
  return objectToString.call(val) === "[object Object]";
}
function arrayOptions(options) {
  return Array.isArray(options) ? options : [
    options
  ];
}
function getRemoteEntryInfoFromSnapshot(snapshot) {
  const defaultRemoteEntryInfo = {
    url: "",
    type: "global",
    globalName: ""
  };
  if (sdk.isBrowserEnv()) {
    return "remoteEntry" in snapshot ? {
      url: snapshot.remoteEntry,
      type: snapshot.remoteEntryType,
      globalName: snapshot.globalName
    } : defaultRemoteEntryInfo;
  }
  if ("ssrRemoteEntry" in snapshot) {
    return {
      url: snapshot.ssrRemoteEntry || defaultRemoteEntryInfo.url,
      type: snapshot.ssrRemoteEntryType || defaultRemoteEntryInfo.type,
      globalName: snapshot.globalName
    };
  }
  return defaultRemoteEntryInfo;
}
const nativeGlobal = (() => {
  try {
    return new Function("return this")();
  } catch (e) {
    return globalThis;
  }
})();
const Global = nativeGlobal;
function definePropertyGlobalVal(target, key, val) {
  Object.defineProperty(target, key, {
    value: val,
    configurable: false,
    writable: true
  });
}
function includeOwnProperty(target, key) {
  return Object.hasOwnProperty.call(target, key);
}
if (!includeOwnProperty(globalThis, "__GLOBAL_LOADING_REMOTE_ENTRY__")) {
  definePropertyGlobalVal(globalThis, "__GLOBAL_LOADING_REMOTE_ENTRY__", {});
}
const globalLoading = globalThis.__GLOBAL_LOADING_REMOTE_ENTRY__;
function setGlobalDefaultVal(target) {
  var _target___FEDERATION__, _target___FEDERATION__1, _target___FEDERATION__2, _target___FEDERATION__3, _target___FEDERATION__4, _target___FEDERATION__5;
  if (includeOwnProperty(target, "__VMOK__") && !includeOwnProperty(target, "__FEDERATION__")) {
    definePropertyGlobalVal(target, "__FEDERATION__", target.__VMOK__);
  }
  if (!includeOwnProperty(target, "__FEDERATION__")) {
    definePropertyGlobalVal(target, "__FEDERATION__", {
      __GLOBAL_PLUGIN__: [],
      __INSTANCES__: [],
      moduleInfo: {},
      __SHARE__: {},
      __MANIFEST_LOADING__: {},
      __PRELOADED_MAP__: /* @__PURE__ */ new Map()
    });
    definePropertyGlobalVal(target, "__VMOK__", target.__FEDERATION__);
  }
  var ___GLOBAL_PLUGIN__;
  (___GLOBAL_PLUGIN__ = (_target___FEDERATION__ = target.__FEDERATION__).__GLOBAL_PLUGIN__) != null ? ___GLOBAL_PLUGIN__ : _target___FEDERATION__.__GLOBAL_PLUGIN__ = [];
  var ___INSTANCES__;
  (___INSTANCES__ = (_target___FEDERATION__1 = target.__FEDERATION__).__INSTANCES__) != null ? ___INSTANCES__ : _target___FEDERATION__1.__INSTANCES__ = [];
  var _moduleInfo;
  (_moduleInfo = (_target___FEDERATION__2 = target.__FEDERATION__).moduleInfo) != null ? _moduleInfo : _target___FEDERATION__2.moduleInfo = {};
  var ___SHARE__;
  (___SHARE__ = (_target___FEDERATION__3 = target.__FEDERATION__).__SHARE__) != null ? ___SHARE__ : _target___FEDERATION__3.__SHARE__ = {};
  var ___MANIFEST_LOADING__;
  (___MANIFEST_LOADING__ = (_target___FEDERATION__4 = target.__FEDERATION__).__MANIFEST_LOADING__) != null ? ___MANIFEST_LOADING__ : _target___FEDERATION__4.__MANIFEST_LOADING__ = {};
  var ___PRELOADED_MAP__;
  (___PRELOADED_MAP__ = (_target___FEDERATION__5 = target.__FEDERATION__).__PRELOADED_MAP__) != null ? ___PRELOADED_MAP__ : _target___FEDERATION__5.__PRELOADED_MAP__ = /* @__PURE__ */ new Map();
}
setGlobalDefaultVal(globalThis);
setGlobalDefaultVal(nativeGlobal);
function resetFederationGlobalInfo() {
  globalThis.__FEDERATION__.__GLOBAL_PLUGIN__ = [];
  globalThis.__FEDERATION__.__INSTANCES__ = [];
  globalThis.__FEDERATION__.moduleInfo = {};
  globalThis.__FEDERATION__.__SHARE__ = {};
  globalThis.__FEDERATION__.__MANIFEST_LOADING__ = {};
}
function getGlobalFederationInstance(name, version) {
  const buildId = getBuilderId();
  return globalThis.__FEDERATION__.__INSTANCES__.find((GMInstance) => {
    if (buildId && GMInstance.options.id === getBuilderId()) {
      return true;
    }
    if (GMInstance.options.name === name && !GMInstance.options.version && !version) {
      return true;
    }
    if (GMInstance.options.name === name && version && GMInstance.options.version === version) {
      return true;
    }
    return false;
  });
}
function setGlobalFederationInstance(FederationInstance) {
  globalThis.__FEDERATION__.__INSTANCES__.push(FederationInstance);
}
function getGlobalFederationConstructor() {
  return globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR__;
}
function setGlobalFederationConstructor(FederationConstructor, isDebug = sdk.isDebugMode()) {
  if (isDebug) {
    globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR__ = FederationConstructor;
    globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR_VERSION__ = "0.6.10";
  }
}
function getInfoWithoutType(target, key) {
  if (typeof key === "string") {
    const keyRes = target[key];
    if (keyRes) {
      return {
        value: target[key],
        key
      };
    } else {
      const targetKeys = Object.keys(target);
      for (const targetKey of targetKeys) {
        const [targetTypeOrName, _] = targetKey.split(":");
        const nKey = `${targetTypeOrName}:${key}`;
        const typeWithKeyRes = target[nKey];
        if (typeWithKeyRes) {
          return {
            value: typeWithKeyRes,
            key: nKey
          };
        }
      }
      return {
        value: void 0,
        key
      };
    }
  } else {
    throw new Error("key must be string");
  }
}
const getGlobalSnapshot = () => nativeGlobal.__FEDERATION__.moduleInfo;
const getTargetSnapshotInfoByModuleInfo = (moduleInfo, snapshot) => {
  const moduleKey = getFMId(moduleInfo);
  const getModuleInfo = getInfoWithoutType(snapshot, moduleKey).value;
  if (getModuleInfo && !getModuleInfo.version && "version" in moduleInfo && moduleInfo["version"]) {
    getModuleInfo.version = moduleInfo["version"];
  }
  if (getModuleInfo) {
    return getModuleInfo;
  }
  if ("version" in moduleInfo && moduleInfo["version"]) {
    const { version } = moduleInfo, resModuleInfo = polyfills._object_without_properties_loose(moduleInfo, [
      "version"
    ]);
    const moduleKeyWithoutVersion = getFMId(resModuleInfo);
    const getModuleInfoWithoutVersion = getInfoWithoutType(nativeGlobal.__FEDERATION__.moduleInfo, moduleKeyWithoutVersion).value;
    if ((getModuleInfoWithoutVersion == null ? void 0 : getModuleInfoWithoutVersion.version) === version) {
      return getModuleInfoWithoutVersion;
    }
  }
  return;
};
const getGlobalSnapshotInfoByModuleInfo = (moduleInfo) => getTargetSnapshotInfoByModuleInfo(moduleInfo, nativeGlobal.__FEDERATION__.moduleInfo);
const setGlobalSnapshotInfoByModuleInfo = (remoteInfo, moduleDetailInfo) => {
  const moduleKey = getFMId(remoteInfo);
  nativeGlobal.__FEDERATION__.moduleInfo[moduleKey] = moduleDetailInfo;
  return nativeGlobal.__FEDERATION__.moduleInfo;
};
const addGlobalSnapshot = (moduleInfos) => {
  nativeGlobal.__FEDERATION__.moduleInfo = polyfills._extends({}, nativeGlobal.__FEDERATION__.moduleInfo, moduleInfos);
  return () => {
    const keys = Object.keys(moduleInfos);
    for (const key of keys) {
      delete nativeGlobal.__FEDERATION__.moduleInfo[key];
    }
  };
};
const getRemoteEntryExports = (name, globalName) => {
  const remoteEntryKey = globalName || `__FEDERATION_${name}:custom__`;
  const entryExports = globalThis[remoteEntryKey];
  return {
    remoteEntryKey,
    entryExports
  };
};
const registerGlobalPlugins = (plugins) => {
  const { __GLOBAL_PLUGIN__ } = nativeGlobal.__FEDERATION__;
  plugins.forEach((plugin) => {
    if (__GLOBAL_PLUGIN__.findIndex((p) => p.name === plugin.name) === -1) {
      __GLOBAL_PLUGIN__.push(plugin);
    } else {
      warn(`The plugin ${plugin.name} has been registered.`);
    }
  });
};
const getGlobalHostPlugins = () => nativeGlobal.__FEDERATION__.__GLOBAL_PLUGIN__;
const getPreloaded = (id) => globalThis.__FEDERATION__.__PRELOADED_MAP__.get(id);
const setPreloaded = (id) => globalThis.__FEDERATION__.__PRELOADED_MAP__.set(id, true);
const DEFAULT_SCOPE = "default";
const DEFAULT_REMOTE_TYPE = "global";
const buildIdentifier = "[0-9A-Za-z-]+";
const build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`;
const numericIdentifier = "0|[1-9]\\d*";
const numericIdentifierLoose = "[0-9]+";
const nonNumericIdentifier = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
const preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`;
const preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`;
const preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`;
const preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`;
const xRangeIdentifier = `${numericIdentifier}|x|X|\\*`;
const xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`;
const hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`;
const mainVersionLoose = `(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`;
const loosePlain = `[v=\\s]*${mainVersionLoose}${preReleaseLoose}?${build}?`;
const gtlt = "((?:<|>)?=?)";
const comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`;
const loneTilde = "(?:~>?)";
const tildeTrim = `(\\s*)${loneTilde}\\s+`;
const loneCaret = "(?:\\^)";
const caretTrim = `(\\s*)${loneCaret}\\s+`;
const star = "(<|>)?=?\\s*\\*";
const caret = `^${loneCaret}${xRangePlain}$`;
const mainVersion = `(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`;
const fullPlain = `v?${mainVersion}${preRelease}?${build}?`;
const tilde = `^${loneTilde}${xRangePlain}$`;
const xRange = `^${gtlt}\\s*${xRangePlain}$`;
const comparator = `^${gtlt}\\s*(${fullPlain})$|^$`;
const gte0 = "^\\s*>=\\s*0.0.0\\s*$";
function parseRegex(source) {
  return new RegExp(source);
}
function isXVersion(version) {
  return !version || version.toLowerCase() === "x" || version === "*";
}
function pipe(...fns) {
  return (x) => fns.reduce((v, f2) => f2(v), x);
}
function extractComparator(comparatorString) {
  return comparatorString.match(parseRegex(comparator));
}
function combineVersion(major, minor, patch, preRelease2) {
  const mainVersion2 = `${major}.${minor}.${patch}`;
  if (preRelease2) {
    return `${mainVersion2}-${preRelease2}`;
  }
  return mainVersion2;
}
function parseHyphen(range) {
  return range.replace(parseRegex(hyphenRange), (_range, from, fromMajor, fromMinor, fromPatch, _fromPreRelease, _fromBuild, to, toMajor, toMinor, toPatch, toPreRelease) => {
    if (isXVersion(fromMajor)) {
      from = "";
    } else if (isXVersion(fromMinor)) {
      from = `>=${fromMajor}.0.0`;
    } else if (isXVersion(fromPatch)) {
      from = `>=${fromMajor}.${fromMinor}.0`;
    } else {
      from = `>=${from}`;
    }
    if (isXVersion(toMajor)) {
      to = "";
    } else if (isXVersion(toMinor)) {
      to = `<${Number(toMajor) + 1}.0.0-0`;
    } else if (isXVersion(toPatch)) {
      to = `<${toMajor}.${Number(toMinor) + 1}.0-0`;
    } else if (toPreRelease) {
      to = `<=${toMajor}.${toMinor}.${toPatch}-${toPreRelease}`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  });
}
function parseComparatorTrim(range) {
  return range.replace(parseRegex(comparatorTrim), "$1$2$3");
}
function parseTildeTrim(range) {
  return range.replace(parseRegex(tildeTrim), "$1~");
}
function parseCaretTrim(range) {
  return range.replace(parseRegex(caretTrim), "$1^");
}
function parseCarets(range) {
  return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace(parseRegex(caret), (_, major, minor, patch, preRelease2) => {
    if (isXVersion(major)) {
      return "";
    } else if (isXVersion(minor)) {
      return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
    } else if (isXVersion(patch)) {
      if (major === "0") {
        return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
      } else {
        return `>=${major}.${minor}.0 <${Number(major) + 1}.0.0-0`;
      }
    } else if (preRelease2) {
      if (major === "0") {
        if (minor === "0") {
          return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${minor}.${Number(patch) + 1}-0`;
        } else {
          return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${Number(minor) + 1}.0-0`;
        }
      } else {
        return `>=${major}.${minor}.${patch}-${preRelease2} <${Number(major) + 1}.0.0-0`;
      }
    } else {
      if (major === "0") {
        if (minor === "0") {
          return `>=${major}.${minor}.${patch} <${major}.${minor}.${Number(patch) + 1}-0`;
        } else {
          return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
        }
      }
      return `>=${major}.${minor}.${patch} <${Number(major) + 1}.0.0-0`;
    }
  })).join(" ");
}
function parseTildes(range) {
  return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace(parseRegex(tilde), (_, major, minor, patch, preRelease2) => {
    if (isXVersion(major)) {
      return "";
    } else if (isXVersion(minor)) {
      return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
    } else if (isXVersion(patch)) {
      return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
    } else if (preRelease2) {
      return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${Number(minor) + 1}.0-0`;
    }
    return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
  })).join(" ");
}
function parseXRanges(range) {
  return range.split(/\s+/).map((rangeVersion) => rangeVersion.trim().replace(parseRegex(xRange), (ret, gtlt2, major, minor, patch, preRelease2) => {
    const isXMajor = isXVersion(major);
    const isXMinor = isXMajor || isXVersion(minor);
    const isXPatch = isXMinor || isXVersion(patch);
    if (gtlt2 === "=" && isXPatch) {
      gtlt2 = "";
    }
    preRelease2 = "";
    if (isXMajor) {
      if (gtlt2 === ">" || gtlt2 === "<") {
        return "<0.0.0-0";
      } else {
        return "*";
      }
    } else if (gtlt2 && isXPatch) {
      if (isXMinor) {
        minor = 0;
      }
      patch = 0;
      if (gtlt2 === ">") {
        gtlt2 = ">=";
        if (isXMinor) {
          major = Number(major) + 1;
          minor = 0;
          patch = 0;
        } else {
          minor = Number(minor) + 1;
          patch = 0;
        }
      } else if (gtlt2 === "<=") {
        gtlt2 = "<";
        if (isXMinor) {
          major = Number(major) + 1;
        } else {
          minor = Number(minor) + 1;
        }
      }
      if (gtlt2 === "<") {
        preRelease2 = "-0";
      }
      return `${gtlt2 + major}.${minor}.${patch}${preRelease2}`;
    } else if (isXMinor) {
      return `>=${major}.0.0${preRelease2} <${Number(major) + 1}.0.0-0`;
    } else if (isXPatch) {
      return `>=${major}.${minor}.0${preRelease2} <${major}.${Number(minor) + 1}.0-0`;
    }
    return ret;
  })).join(" ");
}
function parseStar(range) {
  return range.trim().replace(parseRegex(star), "");
}
function parseGTE0(comparatorString) {
  return comparatorString.trim().replace(parseRegex(gte0), "");
}
function compareAtom(rangeAtom, versionAtom) {
  rangeAtom = Number(rangeAtom) || rangeAtom;
  versionAtom = Number(versionAtom) || versionAtom;
  if (rangeAtom > versionAtom) {
    return 1;
  }
  if (rangeAtom === versionAtom) {
    return 0;
  }
  return -1;
}
function comparePreRelease(rangeAtom, versionAtom) {
  const { preRelease: rangePreRelease } = rangeAtom;
  const { preRelease: versionPreRelease } = versionAtom;
  if (rangePreRelease === void 0 && Boolean(versionPreRelease)) {
    return 1;
  }
  if (Boolean(rangePreRelease) && versionPreRelease === void 0) {
    return -1;
  }
  if (rangePreRelease === void 0 && versionPreRelease === void 0) {
    return 0;
  }
  for (let i = 0, n = rangePreRelease.length; i <= n; i++) {
    const rangeElement = rangePreRelease[i];
    const versionElement = versionPreRelease[i];
    if (rangeElement === versionElement) {
      continue;
    }
    if (rangeElement === void 0 && versionElement === void 0) {
      return 0;
    }
    if (!rangeElement) {
      return 1;
    }
    if (!versionElement) {
      return -1;
    }
    return compareAtom(rangeElement, versionElement);
  }
  return 0;
}
function compareVersion(rangeAtom, versionAtom) {
  return compareAtom(rangeAtom.major, versionAtom.major) || compareAtom(rangeAtom.minor, versionAtom.minor) || compareAtom(rangeAtom.patch, versionAtom.patch) || comparePreRelease(rangeAtom, versionAtom);
}
function eq(rangeAtom, versionAtom) {
  return rangeAtom.version === versionAtom.version;
}
function compare(rangeAtom, versionAtom) {
  switch (rangeAtom.operator) {
    case "":
    case "=":
      return eq(rangeAtom, versionAtom);
    case ">":
      return compareVersion(rangeAtom, versionAtom) < 0;
    case ">=":
      return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) < 0;
    case "<":
      return compareVersion(rangeAtom, versionAtom) > 0;
    case "<=":
      return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) > 0;
    case void 0: {
      return true;
    }
    default:
      return false;
  }
}
function parseComparatorString(range) {
  return pipe(
    // handle caret
    // ^ --> * (any, kinda silly)
    // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
    // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
    // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
    // ^1.2.3 --> >=1.2.3 <2.0.0-0
    // ^1.2.0 --> >=1.2.0 <2.0.0-0
    parseCarets,
    // handle tilde
    // ~, ~> --> * (any, kinda silly)
    // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
    // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
    // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
    // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
    // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
    parseTildes,
    parseXRanges,
    parseStar
  )(range);
}
function parseRange(range) {
  return pipe(
    // handle hyphenRange
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    parseHyphen,
    // handle trim comparator
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    parseComparatorTrim,
    // handle trim tilde
    // `~ 1.2.3` => `~1.2.3`
    parseTildeTrim,
    // handle trim caret
    // `^ 1.2.3` => `^1.2.3`
    parseCaretTrim
  )(range.trim()).split(/\s+/).join(" ");
}
function satisfy(version, range) {
  if (!version) {
    return false;
  }
  const parsedRange = parseRange(range);
  const parsedComparator = parsedRange.split(" ").map((rangeVersion) => parseComparatorString(rangeVersion)).join(" ");
  const comparators = parsedComparator.split(/\s+/).map((comparator2) => parseGTE0(comparator2));
  const extractedVersion = extractComparator(version);
  if (!extractedVersion) {
    return false;
  }
  const [, versionOperator, , versionMajor, versionMinor, versionPatch, versionPreRelease] = extractedVersion;
  const versionAtom = {
    operator: versionOperator,
    version: combineVersion(versionMajor, versionMinor, versionPatch, versionPreRelease),
    major: versionMajor,
    minor: versionMinor,
    patch: versionPatch,
    preRelease: versionPreRelease == null ? void 0 : versionPreRelease.split(".")
  };
  for (const comparator2 of comparators) {
    const extractedComparator = extractComparator(comparator2);
    if (!extractedComparator) {
      return false;
    }
    const [, rangeOperator, , rangeMajor, rangeMinor, rangePatch, rangePreRelease] = extractedComparator;
    const rangeAtom = {
      operator: rangeOperator,
      version: combineVersion(rangeMajor, rangeMinor, rangePatch, rangePreRelease),
      major: rangeMajor,
      minor: rangeMinor,
      patch: rangePatch,
      preRelease: rangePreRelease == null ? void 0 : rangePreRelease.split(".")
    };
    if (!compare(rangeAtom, versionAtom)) {
      return false;
    }
  }
  return true;
}
function formatShare(shareArgs, from, name, shareStrategy) {
  let get;
  if ("get" in shareArgs) {
    get = shareArgs.get;
  } else if ("lib" in shareArgs) {
    get = () => Promise.resolve(shareArgs.lib);
  } else {
    get = () => Promise.resolve(() => {
      throw new Error(`Can not get shared '${name}'!`);
    });
  }
  if (shareArgs.strategy) {
    warn(`"shared.strategy is deprecated, please set in initOptions.shareStrategy instead!"`);
  }
  var _shareArgs_version, _shareArgs_scope, _shareArgs_strategy;
  return polyfills._extends({
    deps: [],
    useIn: [],
    from,
    loading: null
  }, shareArgs, {
    shareConfig: polyfills._extends({
      requiredVersion: `^${shareArgs.version}`,
      singleton: false,
      eager: false,
      strictVersion: false
    }, shareArgs.shareConfig),
    get,
    loaded: (shareArgs == null ? void 0 : shareArgs.loaded) || "lib" in shareArgs ? true : void 0,
    version: (_shareArgs_version = shareArgs.version) != null ? _shareArgs_version : "0",
    scope: Array.isArray(shareArgs.scope) ? shareArgs.scope : [
      (_shareArgs_scope = shareArgs.scope) != null ? _shareArgs_scope : "default"
    ],
    strategy: ((_shareArgs_strategy = shareArgs.strategy) != null ? _shareArgs_strategy : shareStrategy) || "version-first"
  });
}
function formatShareConfigs(globalOptions, userOptions) {
  const shareArgs = userOptions.shared || {};
  const from = userOptions.name;
  const shareInfos = Object.keys(shareArgs).reduce((res2, pkgName) => {
    const arrayShareArgs = arrayOptions(shareArgs[pkgName]);
    res2[pkgName] = res2[pkgName] || [];
    arrayShareArgs.forEach((shareConfig) => {
      res2[pkgName].push(formatShare(shareConfig, from, pkgName, userOptions.shareStrategy));
    });
    return res2;
  }, {});
  const shared = polyfills._extends({}, globalOptions.shared);
  Object.keys(shareInfos).forEach((shareKey) => {
    if (!shared[shareKey]) {
      shared[shareKey] = shareInfos[shareKey];
    } else {
      shareInfos[shareKey].forEach((newUserSharedOptions) => {
        const isSameVersion = shared[shareKey].find((sharedVal) => sharedVal.version === newUserSharedOptions.version);
        if (!isSameVersion) {
          shared[shareKey].push(newUserSharedOptions);
        }
      });
    }
  });
  return {
    shared,
    shareInfos
  };
}
function versionLt(a, b) {
  const transformInvalidVersion = (version) => {
    const isNumberVersion = !Number.isNaN(Number(version));
    if (isNumberVersion) {
      const splitArr = version.split(".");
      let validVersion = version;
      for (let i = 0; i < 3 - splitArr.length; i++) {
        validVersion += ".0";
      }
      return validVersion;
    }
    return version;
  };
  if (satisfy(transformInvalidVersion(a), `<=${transformInvalidVersion(b)}`)) {
    return true;
  } else {
    return false;
  }
}
const findVersion = (shareVersionMap, cb2) => {
  const callback = cb2 || function(prev, cur) {
    return versionLt(prev, cur);
  };
  return Object.keys(shareVersionMap).reduce((prev, cur) => {
    if (!prev) {
      return cur;
    }
    if (callback(prev, cur)) {
      return cur;
    }
    if (prev === "0") {
      return cur;
    }
    return prev;
  }, 0);
};
const isLoaded = (shared) => {
  return Boolean(shared.loaded) || typeof shared.lib === "function";
};
function findSingletonVersionOrderByVersion(shareScopeMap, scope, pkgName) {
  const versions = shareScopeMap[scope][pkgName];
  const callback = function(prev, cur) {
    return !isLoaded(versions[prev]) && versionLt(prev, cur);
  };
  return findVersion(shareScopeMap[scope][pkgName], callback);
}
function findSingletonVersionOrderByLoaded(shareScopeMap, scope, pkgName) {
  const versions = shareScopeMap[scope][pkgName];
  const callback = function(prev, cur) {
    if (isLoaded(versions[cur])) {
      if (isLoaded(versions[prev])) {
        return Boolean(versionLt(prev, cur));
      } else {
        return true;
      }
    }
    if (isLoaded(versions[prev])) {
      return false;
    }
    return versionLt(prev, cur);
  };
  return findVersion(shareScopeMap[scope][pkgName], callback);
}
function getFindShareFunction(strategy) {
  if (strategy === "loaded-first") {
    return findSingletonVersionOrderByLoaded;
  }
  return findSingletonVersionOrderByVersion;
}
function getRegisteredShare(localShareScopeMap, pkgName, shareInfo, resolveShare) {
  if (!localShareScopeMap) {
    return;
  }
  const { shareConfig, scope = DEFAULT_SCOPE, strategy } = shareInfo;
  const scopes = Array.isArray(scope) ? scope : [
    scope
  ];
  for (const sc of scopes) {
    if (shareConfig && localShareScopeMap[sc] && localShareScopeMap[sc][pkgName]) {
      const { requiredVersion } = shareConfig;
      const findShareFunction = getFindShareFunction(strategy);
      const maxOrSingletonVersion = findShareFunction(localShareScopeMap, sc, pkgName);
      const defaultResolver = () => {
        if (shareConfig.singleton) {
          if (typeof requiredVersion === "string" && !satisfy(maxOrSingletonVersion, requiredVersion)) {
            const msg = `Version ${maxOrSingletonVersion} from ${maxOrSingletonVersion && localShareScopeMap[sc][pkgName][maxOrSingletonVersion].from} of shared singleton module ${pkgName} does not satisfy the requirement of ${shareInfo.from} which needs ${requiredVersion})`;
            if (shareConfig.strictVersion) {
              error(msg);
            } else {
              warn(msg);
            }
          }
          return localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
        } else {
          if (requiredVersion === false || requiredVersion === "*") {
            return localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
          }
          if (satisfy(maxOrSingletonVersion, requiredVersion)) {
            return localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
          }
          for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])) {
            if (satisfy(versionKey, requiredVersion)) {
              return versionValue;
            }
          }
        }
      };
      const params = {
        shareScopeMap: localShareScopeMap,
        scope: sc,
        pkgName,
        version: maxOrSingletonVersion,
        GlobalFederation: Global.__FEDERATION__,
        resolver: defaultResolver
      };
      const resolveShared = resolveShare.emit(params) || params;
      return resolveShared.resolver();
    }
  }
}
function getGlobalShareScope() {
  return Global.__FEDERATION__.__SHARE__;
}
function getTargetSharedOptions(options) {
  const { pkgName, extraOptions, shareInfos } = options;
  const defaultResolver = (sharedOptions) => {
    if (!sharedOptions) {
      return void 0;
    }
    const shareVersionMap = {};
    sharedOptions.forEach((shared) => {
      shareVersionMap[shared.version] = shared;
    });
    const callback = function(prev, cur) {
      return !isLoaded(shareVersionMap[prev]) && versionLt(prev, cur);
    };
    const maxVersion = findVersion(shareVersionMap, callback);
    return shareVersionMap[maxVersion];
  };
  var _extraOptions_resolver;
  const resolver = (_extraOptions_resolver = extraOptions == null ? void 0 : extraOptions.resolver) != null ? _extraOptions_resolver : defaultResolver;
  return Object.assign({}, resolver(shareInfos[pkgName]), extraOptions == null ? void 0 : extraOptions.customShareInfo);
}
share_cjs.DEFAULT_REMOTE_TYPE = DEFAULT_REMOTE_TYPE;
share_cjs.DEFAULT_SCOPE = DEFAULT_SCOPE;
share_cjs.Global = Global;
share_cjs.addGlobalSnapshot = addGlobalSnapshot;
share_cjs.addUniqueItem = addUniqueItem;
share_cjs.arrayOptions = arrayOptions;
share_cjs.assert = assert;
share_cjs.error = error;
share_cjs.formatShareConfigs = formatShareConfigs;
share_cjs.getBuilderId = getBuilderId;
share_cjs.getFMId = getFMId;
share_cjs.getGlobalFederationConstructor = getGlobalFederationConstructor;
share_cjs.getGlobalFederationInstance = getGlobalFederationInstance;
share_cjs.getGlobalHostPlugins = getGlobalHostPlugins;
share_cjs.getGlobalShareScope = getGlobalShareScope;
share_cjs.getGlobalSnapshot = getGlobalSnapshot;
share_cjs.getGlobalSnapshotInfoByModuleInfo = getGlobalSnapshotInfoByModuleInfo;
share_cjs.getInfoWithoutType = getInfoWithoutType;
share_cjs.getPreloaded = getPreloaded;
share_cjs.getRegisteredShare = getRegisteredShare;
share_cjs.getRemoteEntryExports = getRemoteEntryExports;
share_cjs.getRemoteEntryInfoFromSnapshot = getRemoteEntryInfoFromSnapshot;
share_cjs.getTargetSharedOptions = getTargetSharedOptions;
share_cjs.getTargetSnapshotInfoByModuleInfo = getTargetSnapshotInfoByModuleInfo;
share_cjs.globalLoading = globalLoading;
share_cjs.isObject = isObject;
share_cjs.isPlainObject = isPlainObject;
share_cjs.isPureRemoteEntry = isPureRemoteEntry;
share_cjs.isRemoteInfoWithEntry = isRemoteInfoWithEntry;
share_cjs.nativeGlobal = nativeGlobal;
share_cjs.registerGlobalPlugins = registerGlobalPlugins;
share_cjs.resetFederationGlobalInfo = resetFederationGlobalInfo;
share_cjs.setGlobalFederationConstructor = setGlobalFederationConstructor;
share_cjs.setGlobalFederationInstance = setGlobalFederationInstance;
share_cjs.setGlobalSnapshotInfoByModuleInfo = setGlobalSnapshotInfoByModuleInfo;
share_cjs.setPreloaded = setPreloaded;
share_cjs.warn = warn;
(function(exports) {
  var polyfills2 = polyfills_cjs$1;
  var sdk2 = index_cjs;
  var share = share_cjs;
  function matchRemoteWithNameAndExpose(remotes, id) {
    for (const remote of remotes) {
      const isNameMatched = id.startsWith(remote.name);
      let expose = id.replace(remote.name, "");
      if (isNameMatched) {
        if (expose.startsWith("/")) {
          const pkgNameOrAlias = remote.name;
          expose = `.${expose}`;
          return {
            pkgNameOrAlias,
            expose,
            remote
          };
        } else if (expose === "") {
          return {
            pkgNameOrAlias: remote.name,
            expose: ".",
            remote
          };
        }
      }
      const isAliasMatched = remote.alias && id.startsWith(remote.alias);
      let exposeWithAlias = remote.alias && id.replace(remote.alias, "");
      if (remote.alias && isAliasMatched) {
        if (exposeWithAlias && exposeWithAlias.startsWith("/")) {
          const pkgNameOrAlias = remote.alias;
          exposeWithAlias = `.${exposeWithAlias}`;
          return {
            pkgNameOrAlias,
            expose: exposeWithAlias,
            remote
          };
        } else if (exposeWithAlias === "") {
          return {
            pkgNameOrAlias: remote.alias,
            expose: ".",
            remote
          };
        }
      }
    }
    return;
  }
  function matchRemote(remotes, nameOrAlias) {
    for (const remote of remotes) {
      const isNameMatched = nameOrAlias === remote.name;
      if (isNameMatched) {
        return remote;
      }
      const isAliasMatched = remote.alias && nameOrAlias === remote.alias;
      if (isAliasMatched) {
        return remote;
      }
    }
    return;
  }
  function registerPlugins$1(plugins, hookInstances) {
    const globalPlugins = share.getGlobalHostPlugins();
    if (globalPlugins.length > 0) {
      globalPlugins.forEach((plugin) => {
        if (plugins == null ? void 0 : plugins.find((item) => item.name !== plugin.name)) {
          plugins.push(plugin);
        }
      });
    }
    if (plugins && plugins.length > 0) {
      plugins.forEach((plugin) => {
        hookInstances.forEach((hookInstance) => {
          hookInstance.applyPlugin(plugin);
        });
      });
    }
    return plugins;
  }
  async function loadEsmEntry({ entry, remoteEntryExports }) {
    return new Promise((resolve, reject) => {
      try {
        if (!remoteEntryExports) {
          new Function("callbacks", `import("${entry}").then(callbacks[0]).catch(callbacks[1])`)([
            resolve,
            reject
          ]);
        } else {
          resolve(remoteEntryExports);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  async function loadSystemJsEntry({ entry, remoteEntryExports }) {
    return new Promise((resolve, reject) => {
      try {
        if (!remoteEntryExports) {
          new Function("callbacks", `System.import("${entry}").then(callbacks[0]).catch(callbacks[1])`)([
            resolve,
            reject
          ]);
        } else {
          resolve(remoteEntryExports);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  async function loadEntryScript({ name, globalName, entry, createScriptHook: createScriptHook2 }) {
    const { entryExports: remoteEntryExports } = share.getRemoteEntryExports(name, globalName);
    if (remoteEntryExports) {
      return remoteEntryExports;
    }
    return sdk2.loadScript(entry, {
      attrs: {},
      createScriptHook: (url2, attrs2) => {
        const res2 = createScriptHook2.emit({
          url: url2,
          attrs: attrs2
        });
        if (!res2) return;
        if (res2 instanceof HTMLScriptElement) {
          return res2;
        }
        if ("script" in res2 || "timeout" in res2) {
          return res2;
        }
        return;
      }
    }).then(() => {
      const { remoteEntryKey, entryExports } = share.getRemoteEntryExports(name, globalName);
      share.assert(entryExports, `
      Unable to use the ${name}'s '${entry}' URL with ${remoteEntryKey}'s globalName to get remoteEntry exports.
      Possible reasons could be:

      1. '${entry}' is not the correct URL, or the remoteEntry resource or name is incorrect.

      2. ${remoteEntryKey} cannot be used to get remoteEntry exports in the window object.
    `);
      return entryExports;
    }).catch((e) => {
      throw e;
    });
  }
  async function loadEntryDom({ remoteInfo, remoteEntryExports, createScriptHook: createScriptHook2 }) {
    const { entry, entryGlobalName: globalName, name, type } = remoteInfo;
    switch (type) {
      case "esm":
      case "module":
        return loadEsmEntry({
          entry,
          remoteEntryExports
        });
      case "system":
        return loadSystemJsEntry({
          entry,
          remoteEntryExports
        });
      default:
        return loadEntryScript({
          entry,
          globalName,
          name,
          createScriptHook: createScriptHook2
        });
    }
  }
  async function loadEntryNode({ remoteInfo, createScriptHook: createScriptHook2 }) {
    const { entry, entryGlobalName: globalName, name, type } = remoteInfo;
    const { entryExports: remoteEntryExports } = share.getRemoteEntryExports(name, globalName);
    if (remoteEntryExports) {
      return remoteEntryExports;
    }
    return sdk2.loadScriptNode(entry, {
      attrs: {
        name,
        globalName,
        type
      },
      createScriptHook: (url2, attrs2) => {
        const res2 = createScriptHook2.emit({
          url: url2,
          attrs: attrs2
        });
        if (!res2) return;
        if ("url" in res2) {
          return res2;
        }
        return;
      }
    }).then(() => {
      const { remoteEntryKey, entryExports } = share.getRemoteEntryExports(name, globalName);
      share.assert(entryExports, `
      Unable to use the ${name}'s '${entry}' URL with ${remoteEntryKey}'s globalName to get remoteEntry exports.
      Possible reasons could be:

      1. '${entry}' is not the correct URL, or the remoteEntry resource or name is incorrect.

      2. ${remoteEntryKey} cannot be used to get remoteEntry exports in the window object.
    `);
      return entryExports;
    }).catch((e) => {
      throw e;
    });
  }
  function getRemoteEntryUniqueKey(remoteInfo) {
    const { entry, name } = remoteInfo;
    return sdk2.composeKeyWithSeparator(name, entry);
  }
  async function getRemoteEntry({ origin, remoteEntryExports, remoteInfo }) {
    const uniqueKey = getRemoteEntryUniqueKey(remoteInfo);
    if (remoteEntryExports) {
      return remoteEntryExports;
    }
    if (!share.globalLoading[uniqueKey]) {
      const loadEntryHook = origin.remoteHandler.hooks.lifecycle.loadEntry;
      const createScriptHook2 = origin.loaderHook.lifecycle.createScript;
      share.globalLoading[uniqueKey] = loadEntryHook.emit({
        createScriptHook: createScriptHook2,
        remoteInfo,
        remoteEntryExports
      }).then((res2) => {
        if (res2) {
          return res2;
        }
        return sdk2.isBrowserEnv() ? loadEntryDom({
          remoteInfo,
          remoteEntryExports,
          createScriptHook: createScriptHook2
        }) : loadEntryNode({
          remoteInfo,
          createScriptHook: createScriptHook2
        });
      });
    }
    return share.globalLoading[uniqueKey];
  }
  function getRemoteInfo(remote) {
    return polyfills2._extends({}, remote, {
      entry: "entry" in remote ? remote.entry : "",
      type: remote.type || share.DEFAULT_REMOTE_TYPE,
      entryGlobalName: remote.entryGlobalName || remote.name,
      shareScope: remote.shareScope || share.DEFAULT_SCOPE
    });
  }
  let Module = class Module {
    async getEntry() {
      if (this.remoteEntryExports) {
        return this.remoteEntryExports;
      }
      const remoteEntryExports = await getRemoteEntry({
        origin: this.host,
        remoteInfo: this.remoteInfo,
        remoteEntryExports: this.remoteEntryExports
      });
      share.assert(remoteEntryExports, `remoteEntryExports is undefined 
 ${sdk2.safeToString(this.remoteInfo)}`);
      this.remoteEntryExports = remoteEntryExports;
      return this.remoteEntryExports;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async get(id, expose, options, remoteSnapshot) {
      const { loadFactory = true } = options || {
        loadFactory: true
      };
      const remoteEntryExports = await this.getEntry();
      if (!this.inited) {
        const localShareScopeMap = this.host.shareScopeMap;
        const remoteShareScope = this.remoteInfo.shareScope || "default";
        if (!localShareScopeMap[remoteShareScope]) {
          localShareScopeMap[remoteShareScope] = {};
        }
        const shareScope = localShareScopeMap[remoteShareScope];
        const initScope = [];
        const remoteEntryInitOptions = {
          version: this.remoteInfo.version || ""
        };
        Object.defineProperty(remoteEntryInitOptions, "shareScopeMap", {
          value: localShareScopeMap,
          // remoteEntryInitOptions will be traversed and assigned during container init, ,so this attribute is not allowed to be traversed
          enumerable: false
        });
        const initContainerOptions = await this.host.hooks.lifecycle.beforeInitContainer.emit({
          shareScope,
          // @ts-ignore shareScopeMap will be set by Object.defineProperty
          remoteEntryInitOptions,
          initScope,
          remoteInfo: this.remoteInfo,
          origin: this.host
        });
        if (typeof (remoteEntryExports == null ? void 0 : remoteEntryExports.init) === "undefined") {
          console.error('The remote entry interface does not contain "init"', "\n", "Ensure the name of this remote is not reserved or in use. Check if anything already exists on window[nameOfRemote]", "\n", "Ensure that window[nameOfRemote] is returning a {get,init} object.");
        }
        await remoteEntryExports.init(initContainerOptions.shareScope, initContainerOptions.initScope, initContainerOptions.remoteEntryInitOptions);
        await this.host.hooks.lifecycle.initContainer.emit(polyfills2._extends({}, initContainerOptions, {
          id,
          remoteSnapshot,
          remoteEntryExports
        }));
      }
      this.lib = remoteEntryExports;
      this.inited = true;
      const moduleFactory = await remoteEntryExports.get(expose);
      share.assert(moduleFactory, `${share.getFMId(this.remoteInfo)} remote don't export ${expose}.`);
      const wrapModuleFactory = this.wraperFactory(moduleFactory, id);
      if (!loadFactory) {
        return wrapModuleFactory;
      }
      const exposeContent = await wrapModuleFactory();
      return exposeContent;
    }
    wraperFactory(moduleFactory, id) {
      function defineModuleId(res2, id2) {
        if (res2 && typeof res2 === "object" && Object.isExtensible(res2) && !Object.getOwnPropertyDescriptor(res2, Symbol.for("mf_module_id"))) {
          Object.defineProperty(res2, Symbol.for("mf_module_id"), {
            value: id2,
            enumerable: false
          });
        }
      }
      if (moduleFactory instanceof Promise) {
        return async () => {
          const res2 = await moduleFactory();
          defineModuleId(res2, id);
          return res2;
        };
      } else {
        return () => {
          const res2 = moduleFactory();
          defineModuleId(res2, id);
          return res2;
        };
      }
    }
    constructor({ remoteInfo, host }) {
      this.inited = false;
      this.lib = void 0;
      this.remoteInfo = remoteInfo;
      this.host = host;
    }
  };
  class SyncHook {
    on(fn) {
      if (typeof fn === "function") {
        this.listeners.add(fn);
      }
    }
    once(fn) {
      const self = this;
      this.on(function wrapper(...args) {
        self.remove(wrapper);
        return fn.apply(null, args);
      });
    }
    emit(...data2) {
      let result;
      if (this.listeners.size > 0) {
        this.listeners.forEach((fn) => {
          result = fn(...data2);
        });
      }
      return result;
    }
    remove(fn) {
      this.listeners.delete(fn);
    }
    removeAll() {
      this.listeners.clear();
    }
    constructor(type) {
      this.type = "";
      this.listeners = /* @__PURE__ */ new Set();
      if (type) {
        this.type = type;
      }
    }
  }
  class AsyncHook extends SyncHook {
    emit(...data2) {
      let result;
      const ls = Array.from(this.listeners);
      if (ls.length > 0) {
        let i = 0;
        const call = (prev) => {
          if (prev === false) {
            return false;
          } else if (i < ls.length) {
            return Promise.resolve(ls[i++].apply(null, data2)).then(call);
          } else {
            return prev;
          }
        };
        result = call();
      }
      return Promise.resolve(result);
    }
  }
  function checkReturnData(originalData, returnedData) {
    if (!share.isObject(returnedData)) {
      return false;
    }
    if (originalData !== returnedData) {
      for (const key in originalData) {
        if (!(key in returnedData)) {
          return false;
        }
      }
    }
    return true;
  }
  class SyncWaterfallHook extends SyncHook {
    emit(data2) {
      if (!share.isObject(data2)) {
        share.error(`The data for the "${this.type}" hook should be an object.`);
      }
      for (const fn of this.listeners) {
        try {
          const tempData = fn(data2);
          if (checkReturnData(data2, tempData)) {
            data2 = tempData;
          } else {
            this.onerror(`A plugin returned an unacceptable value for the "${this.type}" type.`);
            break;
          }
        } catch (e) {
          share.warn(e);
          this.onerror(e);
        }
      }
      return data2;
    }
    constructor(type) {
      super(), this.onerror = share.error;
      this.type = type;
    }
  }
  class AsyncWaterfallHook extends SyncHook {
    emit(data2) {
      if (!share.isObject(data2)) {
        share.error(`The response data for the "${this.type}" hook must be an object.`);
      }
      const ls = Array.from(this.listeners);
      if (ls.length > 0) {
        let i = 0;
        const processError = (e) => {
          share.warn(e);
          this.onerror(e);
          return data2;
        };
        const call = (prevData) => {
          if (checkReturnData(data2, prevData)) {
            data2 = prevData;
            if (i < ls.length) {
              try {
                return Promise.resolve(ls[i++](data2)).then(call, processError);
              } catch (e) {
                return processError(e);
              }
            }
          } else {
            this.onerror(`A plugin returned an incorrect value for the "${this.type}" type.`);
          }
          return data2;
        };
        return Promise.resolve(call(data2));
      }
      return Promise.resolve(data2);
    }
    constructor(type) {
      super(), this.onerror = share.error;
      this.type = type;
    }
  }
  class PluginSystem {
    applyPlugin(plugin) {
      share.assert(share.isPlainObject(plugin), "Plugin configuration is invalid.");
      const pluginName = plugin.name;
      share.assert(pluginName, "A name must be provided by the plugin.");
      if (!this.registerPlugins[pluginName]) {
        this.registerPlugins[pluginName] = plugin;
        Object.keys(this.lifecycle).forEach((key) => {
          const pluginLife = plugin[key];
          if (pluginLife) {
            this.lifecycle[key].on(pluginLife);
          }
        });
      }
    }
    removePlugin(pluginName) {
      share.assert(pluginName, "A name is required.");
      const plugin = this.registerPlugins[pluginName];
      share.assert(plugin, `The plugin "${pluginName}" is not registered.`);
      Object.keys(plugin).forEach((key) => {
        if (key !== "name") {
          this.lifecycle[key].remove(plugin[key]);
        }
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    inherit({ lifecycle, registerPlugins: registerPlugins2 }) {
      Object.keys(lifecycle).forEach((hookName) => {
        share.assert(!this.lifecycle[hookName], `The hook "${hookName}" has a conflict and cannot be inherited.`);
        this.lifecycle[hookName] = lifecycle[hookName];
      });
      Object.keys(registerPlugins2).forEach((pluginName) => {
        share.assert(!this.registerPlugins[pluginName], `The plugin "${pluginName}" has a conflict and cannot be inherited.`);
        this.applyPlugin(registerPlugins2[pluginName]);
      });
    }
    constructor(lifecycle) {
      this.registerPlugins = {};
      this.lifecycle = lifecycle;
      this.lifecycleKeys = Object.keys(lifecycle);
    }
  }
  function defaultPreloadArgs(preloadConfig) {
    return polyfills2._extends({
      resourceCategory: "sync",
      share: true,
      depsRemote: true,
      prefetchInterface: false
    }, preloadConfig);
  }
  function formatPreloadArgs(remotes, preloadArgs) {
    return preloadArgs.map((args) => {
      const remoteInfo = matchRemote(remotes, args.nameOrAlias);
      share.assert(remoteInfo, `Unable to preload ${args.nameOrAlias} as it is not included in ${!remoteInfo && sdk2.safeToString({
        remoteInfo,
        remotes
      })}`);
      return {
        remote: remoteInfo,
        preloadConfig: defaultPreloadArgs(args)
      };
    });
  }
  function normalizePreloadExposes(exposes) {
    if (!exposes) {
      return [];
    }
    return exposes.map((expose) => {
      if (expose === ".") {
        return expose;
      }
      if (expose.startsWith("./")) {
        return expose.replace("./", "");
      }
      return expose;
    });
  }
  function preloadAssets(remoteInfo, host, assets, useLinkPreload = true) {
    const { cssAssets, jsAssetsWithoutEntry, entryAssets } = assets;
    if (host.options.inBrowser) {
      entryAssets.forEach((asset) => {
        const { moduleInfo } = asset;
        const module = host.moduleCache.get(remoteInfo.name);
        if (module) {
          getRemoteEntry({
            origin: host,
            remoteInfo: moduleInfo,
            remoteEntryExports: module.remoteEntryExports
          });
        } else {
          getRemoteEntry({
            origin: host,
            remoteInfo: moduleInfo,
            remoteEntryExports: void 0
          });
        }
      });
      if (useLinkPreload) {
        const defaultAttrs = {
          rel: "preload",
          as: "style"
        };
        cssAssets.forEach((cssUrl) => {
          const { link: cssEl, needAttach } = sdk2.createLink({
            url: cssUrl,
            cb: () => {
            },
            attrs: defaultAttrs,
            createLinkHook: (url2, attrs2) => {
              const res2 = host.loaderHook.lifecycle.createLink.emit({
                url: url2,
                attrs: attrs2
              });
              if (res2 instanceof HTMLLinkElement) {
                return res2;
              }
              return;
            }
          });
          needAttach && document.head.appendChild(cssEl);
        });
      } else {
        const defaultAttrs = {
          rel: "stylesheet",
          type: "text/css"
        };
        cssAssets.forEach((cssUrl) => {
          const { link: cssEl, needAttach } = sdk2.createLink({
            url: cssUrl,
            cb: () => {
            },
            attrs: defaultAttrs,
            createLinkHook: (url2, attrs2) => {
              const res2 = host.loaderHook.lifecycle.createLink.emit({
                url: url2,
                attrs: attrs2
              });
              if (res2 instanceof HTMLLinkElement) {
                return res2;
              }
              return;
            },
            needDeleteLink: false
          });
          needAttach && document.head.appendChild(cssEl);
        });
      }
      if (useLinkPreload) {
        const defaultAttrs = {
          rel: "preload",
          as: "script"
        };
        jsAssetsWithoutEntry.forEach((jsUrl) => {
          const { link: linkEl, needAttach } = sdk2.createLink({
            url: jsUrl,
            cb: () => {
            },
            attrs: defaultAttrs,
            createLinkHook: (url2, attrs2) => {
              const res2 = host.loaderHook.lifecycle.createLink.emit({
                url: url2,
                attrs: attrs2
              });
              if (res2 instanceof HTMLLinkElement) {
                return res2;
              }
              return;
            }
          });
          needAttach && document.head.appendChild(linkEl);
        });
      } else {
        const defaultAttrs = {
          fetchpriority: "high",
          type: (remoteInfo == null ? void 0 : remoteInfo.type) === "module" ? "module" : "text/javascript"
        };
        jsAssetsWithoutEntry.forEach((jsUrl) => {
          const { script: scriptEl, needAttach } = sdk2.createScript({
            url: jsUrl,
            cb: () => {
            },
            attrs: defaultAttrs,
            createScriptHook: (url2, attrs2) => {
              const res2 = host.loaderHook.lifecycle.createScript.emit({
                url: url2,
                attrs: attrs2
              });
              if (res2 instanceof HTMLScriptElement) {
                return res2;
              }
              return;
            },
            needDeleteScript: true
          });
          needAttach && document.head.appendChild(scriptEl);
        });
      }
    }
  }
  function assignRemoteInfo(remoteInfo, remoteSnapshot) {
    const remoteEntryInfo = share.getRemoteEntryInfoFromSnapshot(remoteSnapshot);
    if (!remoteEntryInfo.url) {
      share.error(`The attribute remoteEntry of ${remoteInfo.name} must not be undefined.`);
    }
    let entryUrl = sdk2.getResourceUrl(remoteSnapshot, remoteEntryInfo.url);
    if (!sdk2.isBrowserEnv() && !entryUrl.startsWith("http")) {
      entryUrl = `https:${entryUrl}`;
    }
    remoteInfo.type = remoteEntryInfo.type;
    remoteInfo.entryGlobalName = remoteEntryInfo.globalName;
    remoteInfo.entry = entryUrl;
    remoteInfo.version = remoteSnapshot.version;
    remoteInfo.buildVersion = remoteSnapshot.buildVersion;
  }
  function snapshotPlugin() {
    return {
      name: "snapshot-plugin",
      async afterResolve(args) {
        const { remote, pkgNameOrAlias, expose, origin, remoteInfo } = args;
        if (!share.isRemoteInfoWithEntry(remote) || !share.isPureRemoteEntry(remote)) {
          const { remoteSnapshot, globalSnapshot } = await origin.snapshotHandler.loadRemoteSnapshotInfo(remote);
          assignRemoteInfo(remoteInfo, remoteSnapshot);
          const preloadOptions = {
            remote,
            preloadConfig: {
              nameOrAlias: pkgNameOrAlias,
              exposes: [
                expose
              ],
              resourceCategory: "sync",
              share: false,
              depsRemote: false
            }
          };
          const assets = await origin.remoteHandler.hooks.lifecycle.generatePreloadAssets.emit({
            origin,
            preloadOptions,
            remoteInfo,
            remote,
            remoteSnapshot,
            globalSnapshot
          });
          if (assets) {
            preloadAssets(remoteInfo, origin, assets, false);
          }
          return polyfills2._extends({}, args, {
            remoteSnapshot
          });
        }
        return args;
      }
    };
  }
  function splitId(id) {
    const splitInfo = id.split(":");
    if (splitInfo.length === 1) {
      return {
        name: splitInfo[0],
        version: void 0
      };
    } else if (splitInfo.length === 2) {
      return {
        name: splitInfo[0],
        version: splitInfo[1]
      };
    } else {
      return {
        name: splitInfo[1],
        version: splitInfo[2]
      };
    }
  }
  function traverseModuleInfo(globalSnapshot, remoteInfo, traverse, isRoot, memo = {}, remoteSnapshot) {
    const id = share.getFMId(remoteInfo);
    const { value: snapshotValue } = share.getInfoWithoutType(globalSnapshot, id);
    const effectiveRemoteSnapshot = remoteSnapshot || snapshotValue;
    if (effectiveRemoteSnapshot && !sdk2.isManifestProvider(effectiveRemoteSnapshot)) {
      traverse(effectiveRemoteSnapshot, remoteInfo, isRoot);
      if (effectiveRemoteSnapshot.remotesInfo) {
        const remoteKeys = Object.keys(effectiveRemoteSnapshot.remotesInfo);
        for (const key of remoteKeys) {
          if (memo[key]) {
            continue;
          }
          memo[key] = true;
          const subRemoteInfo = splitId(key);
          const remoteValue = effectiveRemoteSnapshot.remotesInfo[key];
          traverseModuleInfo(globalSnapshot, {
            name: subRemoteInfo.name,
            version: remoteValue.matchedVersion
          }, traverse, false, memo, void 0);
        }
      }
    }
  }
  function generatePreloadAssets(origin, preloadOptions, remote, globalSnapshot, remoteSnapshot) {
    const cssAssets = [];
    const jsAssets = [];
    const entryAssets = [];
    const loadedSharedJsAssets = /* @__PURE__ */ new Set();
    const loadedSharedCssAssets = /* @__PURE__ */ new Set();
    const { options } = origin;
    const { preloadConfig: rootPreloadConfig } = preloadOptions;
    const { depsRemote } = rootPreloadConfig;
    const memo = {};
    traverseModuleInfo(globalSnapshot, remote, (moduleInfoSnapshot, remoteInfo, isRoot) => {
      let preloadConfig;
      if (isRoot) {
        preloadConfig = rootPreloadConfig;
      } else {
        if (Array.isArray(depsRemote)) {
          const findPreloadConfig = depsRemote.find((remoteConfig) => {
            if (remoteConfig.nameOrAlias === remoteInfo.name || remoteConfig.nameOrAlias === remoteInfo.alias) {
              return true;
            }
            return false;
          });
          if (!findPreloadConfig) {
            return;
          }
          preloadConfig = defaultPreloadArgs(findPreloadConfig);
        } else if (depsRemote === true) {
          preloadConfig = rootPreloadConfig;
        } else {
          return;
        }
      }
      const remoteEntryUrl = sdk2.getResourceUrl(moduleInfoSnapshot, share.getRemoteEntryInfoFromSnapshot(moduleInfoSnapshot).url);
      if (remoteEntryUrl) {
        entryAssets.push({
          name: remoteInfo.name,
          moduleInfo: {
            name: remoteInfo.name,
            entry: remoteEntryUrl,
            type: "remoteEntryType" in moduleInfoSnapshot ? moduleInfoSnapshot.remoteEntryType : "global",
            entryGlobalName: "globalName" in moduleInfoSnapshot ? moduleInfoSnapshot.globalName : remoteInfo.name,
            shareScope: "",
            version: "version" in moduleInfoSnapshot ? moduleInfoSnapshot.version : void 0
          },
          url: remoteEntryUrl
        });
      }
      let moduleAssetsInfo = "modules" in moduleInfoSnapshot ? moduleInfoSnapshot.modules : [];
      const normalizedPreloadExposes = normalizePreloadExposes(preloadConfig.exposes);
      if (normalizedPreloadExposes.length && "modules" in moduleInfoSnapshot) {
        var _moduleInfoSnapshot_modules;
        moduleAssetsInfo = moduleInfoSnapshot == null ? void 0 : (_moduleInfoSnapshot_modules = moduleInfoSnapshot.modules) == null ? void 0 : _moduleInfoSnapshot_modules.reduce((assets, moduleAssetInfo) => {
          if ((normalizedPreloadExposes == null ? void 0 : normalizedPreloadExposes.indexOf(moduleAssetInfo.moduleName)) !== -1) {
            assets.push(moduleAssetInfo);
          }
          return assets;
        }, []);
      }
      function handleAssets(assets) {
        const assetsRes = assets.map((asset) => sdk2.getResourceUrl(moduleInfoSnapshot, asset));
        if (preloadConfig.filter) {
          return assetsRes.filter(preloadConfig.filter);
        }
        return assetsRes;
      }
      if (moduleAssetsInfo) {
        const assetsLength = moduleAssetsInfo.length;
        for (let index = 0; index < assetsLength; index++) {
          const assetsInfo = moduleAssetsInfo[index];
          const exposeFullPath = `${remoteInfo.name}/${assetsInfo.moduleName}`;
          origin.remoteHandler.hooks.lifecycle.handlePreloadModule.emit({
            id: assetsInfo.moduleName === "." ? remoteInfo.name : exposeFullPath,
            name: remoteInfo.name,
            remoteSnapshot: moduleInfoSnapshot,
            preloadConfig,
            remote: remoteInfo,
            origin
          });
          const preloaded = share.getPreloaded(exposeFullPath);
          if (preloaded) {
            continue;
          }
          if (preloadConfig.resourceCategory === "all") {
            cssAssets.push(...handleAssets(assetsInfo.assets.css.async));
            cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
            jsAssets.push(...handleAssets(assetsInfo.assets.js.async));
            jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
          } else if (preloadConfig.resourceCategory = "sync") {
            cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
            jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
          }
          share.setPreloaded(exposeFullPath);
        }
      }
    }, true, memo, remoteSnapshot);
    if (remoteSnapshot.shared) {
      const collectSharedAssets = (shareInfo, snapshotShared) => {
        const registeredShared = share.getRegisteredShare(origin.shareScopeMap, snapshotShared.sharedName, shareInfo, origin.sharedHandler.hooks.lifecycle.resolveShare);
        if (registeredShared && typeof registeredShared.lib === "function") {
          snapshotShared.assets.js.sync.forEach((asset) => {
            loadedSharedJsAssets.add(asset);
          });
          snapshotShared.assets.css.sync.forEach((asset) => {
            loadedSharedCssAssets.add(asset);
          });
        }
      };
      remoteSnapshot.shared.forEach((shared) => {
        var _options_shared;
        const shareInfos = (_options_shared = options.shared) == null ? void 0 : _options_shared[shared.sharedName];
        if (!shareInfos) {
          return;
        }
        const sharedOptions = shared.version ? shareInfos.find((s) => s.version === shared.version) : shareInfos;
        if (!sharedOptions) {
          return;
        }
        const arrayShareInfo = share.arrayOptions(sharedOptions);
        arrayShareInfo.forEach((s) => {
          collectSharedAssets(s, shared);
        });
      });
    }
    const needPreloadJsAssets = jsAssets.filter((asset) => !loadedSharedJsAssets.has(asset));
    const needPreloadCssAssets = cssAssets.filter((asset) => !loadedSharedCssAssets.has(asset));
    return {
      cssAssets: needPreloadCssAssets,
      jsAssetsWithoutEntry: needPreloadJsAssets,
      entryAssets
    };
  }
  const generatePreloadAssetsPlugin = function() {
    return {
      name: "generate-preload-assets-plugin",
      async generatePreloadAssets(args) {
        const { origin, preloadOptions, remoteInfo, remote, globalSnapshot, remoteSnapshot } = args;
        if (share.isRemoteInfoWithEntry(remote) && share.isPureRemoteEntry(remote)) {
          return {
            cssAssets: [],
            jsAssetsWithoutEntry: [],
            entryAssets: [
              {
                name: remote.name,
                url: remote.entry,
                moduleInfo: {
                  name: remoteInfo.name,
                  entry: remote.entry,
                  type: remoteInfo.type || "global",
                  entryGlobalName: "",
                  shareScope: ""
                }
              }
            ]
          };
        }
        assignRemoteInfo(remoteInfo, remoteSnapshot);
        const assets = generatePreloadAssets(origin, preloadOptions, remoteInfo, globalSnapshot, remoteSnapshot);
        return assets;
      }
    };
  };
  function getGlobalRemoteInfo(moduleInfo, origin) {
    const hostGlobalSnapshot = share.getGlobalSnapshotInfoByModuleInfo({
      name: origin.options.name,
      version: origin.options.version
    });
    const globalRemoteInfo = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && share.getInfoWithoutType(hostGlobalSnapshot.remotesInfo, moduleInfo.name).value;
    if (globalRemoteInfo && globalRemoteInfo.matchedVersion) {
      return {
        hostGlobalSnapshot,
        globalSnapshot: share.getGlobalSnapshot(),
        remoteSnapshot: share.getGlobalSnapshotInfoByModuleInfo({
          name: moduleInfo.name,
          version: globalRemoteInfo.matchedVersion
        })
      };
    }
    return {
      hostGlobalSnapshot: void 0,
      globalSnapshot: share.getGlobalSnapshot(),
      remoteSnapshot: share.getGlobalSnapshotInfoByModuleInfo({
        name: moduleInfo.name,
        version: "version" in moduleInfo ? moduleInfo.version : void 0
      })
    };
  }
  class SnapshotHandler {
    async loadSnapshot(moduleInfo) {
      const { options } = this.HostInstance;
      const { hostGlobalSnapshot, remoteSnapshot, globalSnapshot } = this.getGlobalRemoteInfo(moduleInfo);
      const { remoteSnapshot: globalRemoteSnapshot, globalSnapshot: globalSnapshotRes } = await this.hooks.lifecycle.loadSnapshot.emit({
        options,
        moduleInfo,
        hostGlobalSnapshot,
        remoteSnapshot,
        globalSnapshot
      });
      return {
        remoteSnapshot: globalRemoteSnapshot,
        globalSnapshot: globalSnapshotRes
      };
    }
    // eslint-disable-next-line max-lines-per-function
    async loadRemoteSnapshotInfo(moduleInfo) {
      const { options } = this.HostInstance;
      await this.hooks.lifecycle.beforeLoadRemoteSnapshot.emit({
        options,
        moduleInfo
      });
      let hostSnapshot = share.getGlobalSnapshotInfoByModuleInfo({
        name: this.HostInstance.options.name,
        version: this.HostInstance.options.version
      });
      if (!hostSnapshot) {
        hostSnapshot = {
          version: this.HostInstance.options.version || "",
          remoteEntry: "",
          remotesInfo: {}
        };
        share.addGlobalSnapshot({
          [this.HostInstance.options.name]: hostSnapshot
        });
      }
      if (hostSnapshot && "remotesInfo" in hostSnapshot && !share.getInfoWithoutType(hostSnapshot.remotesInfo, moduleInfo.name).value) {
        if ("version" in moduleInfo || "entry" in moduleInfo) {
          hostSnapshot.remotesInfo = polyfills2._extends({}, hostSnapshot == null ? void 0 : hostSnapshot.remotesInfo, {
            [moduleInfo.name]: {
              matchedVersion: "version" in moduleInfo ? moduleInfo.version : moduleInfo.entry
            }
          });
        }
      }
      const { hostGlobalSnapshot, remoteSnapshot, globalSnapshot } = this.getGlobalRemoteInfo(moduleInfo);
      const { remoteSnapshot: globalRemoteSnapshot, globalSnapshot: globalSnapshotRes } = await this.hooks.lifecycle.loadSnapshot.emit({
        options,
        moduleInfo,
        hostGlobalSnapshot,
        remoteSnapshot,
        globalSnapshot
      });
      if (globalRemoteSnapshot) {
        if (sdk2.isManifestProvider(globalRemoteSnapshot)) {
          const remoteEntry = sdk2.isBrowserEnv() ? globalRemoteSnapshot.remoteEntry : globalRemoteSnapshot.ssrRemoteEntry || globalRemoteSnapshot.remoteEntry || "";
          const moduleSnapshot = await this.getManifestJson(remoteEntry, moduleInfo, {});
          const globalSnapshotRes2 = share.setGlobalSnapshotInfoByModuleInfo(polyfills2._extends({}, moduleInfo, {
            // The global remote may be overridden
            // Therefore, set the snapshot key to the global address of the actual request
            entry: remoteEntry
          }), moduleSnapshot);
          return {
            remoteSnapshot: moduleSnapshot,
            globalSnapshot: globalSnapshotRes2
          };
        } else {
          const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
            options: this.HostInstance.options,
            moduleInfo,
            remoteSnapshot: globalRemoteSnapshot,
            from: "global"
          });
          return {
            remoteSnapshot: remoteSnapshotRes,
            globalSnapshot: globalSnapshotRes
          };
        }
      } else {
        if (share.isRemoteInfoWithEntry(moduleInfo)) {
          const moduleSnapshot = await this.getManifestJson(moduleInfo.entry, moduleInfo, {});
          const globalSnapshotRes2 = share.setGlobalSnapshotInfoByModuleInfo(moduleInfo, moduleSnapshot);
          const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
            options: this.HostInstance.options,
            moduleInfo,
            remoteSnapshot: moduleSnapshot,
            from: "global"
          });
          return {
            remoteSnapshot: remoteSnapshotRes,
            globalSnapshot: globalSnapshotRes2
          };
        } else {
          share.error(`
          Cannot get remoteSnapshot with the name: '${moduleInfo.name}', version: '${moduleInfo.version}' from __FEDERATION__.moduleInfo. The following reasons may be causing the problem:

          1. The Deploy platform did not deliver the correct data. You can use __FEDERATION__.moduleInfo to check the remoteInfo.

          2. The remote '${moduleInfo.name}' version '${moduleInfo.version}' is not released.

          The transformed module info: ${JSON.stringify(globalSnapshotRes)}
        `);
        }
      }
    }
    getGlobalRemoteInfo(moduleInfo) {
      return getGlobalRemoteInfo(moduleInfo, this.HostInstance);
    }
    async getManifestJson(manifestUrl, moduleInfo, extraOptions) {
      const getManifest = async () => {
        let manifestJson = this.manifestCache.get(manifestUrl);
        if (manifestJson) {
          return manifestJson;
        }
        try {
          let res2 = await this.loaderHook.lifecycle.fetch.emit(manifestUrl, {});
          if (!res2 || !(res2 instanceof Response)) {
            res2 = await fetch(manifestUrl, {});
          }
          manifestJson = await res2.json();
          share.assert(manifestJson.metaData && manifestJson.exposes && manifestJson.shared, `${manifestUrl} is not a federation manifest`);
          this.manifestCache.set(manifestUrl, manifestJson);
          return manifestJson;
        } catch (err) {
          delete this.manifestLoading[manifestUrl];
          share.error(`Failed to get manifestJson for ${moduleInfo.name}. The manifest URL is ${manifestUrl}. Please ensure that the manifestUrl is accessible.
          
 Error message:
          
 ${err}`);
        }
      };
      const asyncLoadProcess = async () => {
        const manifestJson = await getManifest();
        const remoteSnapshot = sdk2.generateSnapshotFromManifest(manifestJson, {
          version: manifestUrl
        });
        const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
          options: this.HostInstance.options,
          moduleInfo,
          manifestJson,
          remoteSnapshot,
          manifestUrl,
          from: "manifest"
        });
        return remoteSnapshotRes;
      };
      if (!this.manifestLoading[manifestUrl]) {
        this.manifestLoading[manifestUrl] = asyncLoadProcess().then((res2) => res2);
      }
      return this.manifestLoading[manifestUrl];
    }
    constructor(HostInstance) {
      this.loadingHostSnapshot = null;
      this.manifestCache = /* @__PURE__ */ new Map();
      this.hooks = new PluginSystem({
        beforeLoadRemoteSnapshot: new AsyncHook("beforeLoadRemoteSnapshot"),
        loadSnapshot: new AsyncWaterfallHook("loadGlobalSnapshot"),
        loadRemoteSnapshot: new AsyncWaterfallHook("loadRemoteSnapshot")
      });
      this.manifestLoading = share.Global.__FEDERATION__.__MANIFEST_LOADING__;
      this.HostInstance = HostInstance;
      this.loaderHook = HostInstance.loaderHook;
    }
  }
  class SharedHandler {
    // register shared in shareScopeMap
    registerShared(globalOptions, userOptions) {
      const { shareInfos, shared } = share.formatShareConfigs(globalOptions, userOptions);
      const sharedKeys = Object.keys(shareInfos);
      sharedKeys.forEach((sharedKey) => {
        const sharedVals = shareInfos[sharedKey];
        sharedVals.forEach((sharedVal) => {
          const registeredShared = share.getRegisteredShare(this.shareScopeMap, sharedKey, sharedVal, this.hooks.lifecycle.resolveShare);
          if (!registeredShared && sharedVal && sharedVal.lib) {
            this.setShared({
              pkgName: sharedKey,
              lib: sharedVal.lib,
              get: sharedVal.get,
              loaded: true,
              shared: sharedVal,
              from: userOptions.name
            });
          }
        });
      });
      return {
        shareInfos,
        shared
      };
    }
    async loadShare(pkgName, extraOptions) {
      const { host } = this;
      const shareInfo = share.getTargetSharedOptions({
        pkgName,
        extraOptions,
        shareInfos: host.options.shared
      });
      if (shareInfo == null ? void 0 : shareInfo.scope) {
        await Promise.all(shareInfo.scope.map(async (shareScope) => {
          await Promise.all(this.initializeSharing(shareScope, {
            strategy: shareInfo.strategy
          }));
          return;
        }));
      }
      const loadShareRes = await this.hooks.lifecycle.beforeLoadShare.emit({
        pkgName,
        shareInfo,
        shared: host.options.shared,
        origin: host
      });
      const { shareInfo: shareInfoRes } = loadShareRes;
      share.assert(shareInfoRes, `Cannot find ${pkgName} Share in the ${host.options.name}. Please ensure that the ${pkgName} Share parameters have been injected`);
      const registeredShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfoRes, this.hooks.lifecycle.resolveShare);
      const addUseIn = (shared) => {
        if (!shared.useIn) {
          shared.useIn = [];
        }
        share.addUniqueItem(shared.useIn, host.options.name);
      };
      if (registeredShared && registeredShared.lib) {
        addUseIn(registeredShared);
        return registeredShared.lib;
      } else if (registeredShared && registeredShared.loading && !registeredShared.loaded) {
        const factory = await registeredShared.loading;
        registeredShared.loaded = true;
        if (!registeredShared.lib) {
          registeredShared.lib = factory;
        }
        addUseIn(registeredShared);
        return factory;
      } else if (registeredShared) {
        const asyncLoadProcess = async () => {
          const factory = await registeredShared.get();
          shareInfoRes.lib = factory;
          shareInfoRes.loaded = true;
          addUseIn(shareInfoRes);
          const gShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfoRes, this.hooks.lifecycle.resolveShare);
          if (gShared) {
            gShared.lib = factory;
            gShared.loaded = true;
          }
          return factory;
        };
        const loading = asyncLoadProcess();
        this.setShared({
          pkgName,
          loaded: false,
          shared: registeredShared,
          from: host.options.name,
          lib: null,
          loading
        });
        return loading;
      } else {
        if (extraOptions == null ? void 0 : extraOptions.customShareInfo) {
          return false;
        }
        const asyncLoadProcess = async () => {
          const factory = await shareInfoRes.get();
          shareInfoRes.lib = factory;
          shareInfoRes.loaded = true;
          addUseIn(shareInfoRes);
          const gShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfoRes, this.hooks.lifecycle.resolveShare);
          if (gShared) {
            gShared.lib = factory;
            gShared.loaded = true;
          }
          return factory;
        };
        const loading = asyncLoadProcess();
        this.setShared({
          pkgName,
          loaded: false,
          shared: shareInfoRes,
          from: host.options.name,
          lib: null,
          loading
        });
        return loading;
      }
    }
    /**
    * This function initializes the sharing sequence (executed only once per share scope).
    * It accepts one argument, the name of the share scope.
    * If the share scope does not exist, it creates one.
    */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    initializeSharing(shareScopeName = share.DEFAULT_SCOPE, extraOptions) {
      const { host } = this;
      const from = extraOptions == null ? void 0 : extraOptions.from;
      const strategy = extraOptions == null ? void 0 : extraOptions.strategy;
      let initScope = extraOptions == null ? void 0 : extraOptions.initScope;
      const promises = [];
      if (from !== "build") {
        const { initTokens } = this;
        if (!initScope) initScope = [];
        let initToken = initTokens[shareScopeName];
        if (!initToken) initToken = initTokens[shareScopeName] = {
          from: this.host.name
        };
        if (initScope.indexOf(initToken) >= 0) return promises;
        initScope.push(initToken);
      }
      const shareScope = this.shareScopeMap;
      const hostName = host.options.name;
      if (!shareScope[shareScopeName]) {
        shareScope[shareScopeName] = {};
      }
      const scope = shareScope[shareScopeName];
      const register = (name, shared) => {
        var _activeVersion_shareConfig;
        const { version, eager } = shared;
        scope[name] = scope[name] || {};
        const versions = scope[name];
        const activeVersion = versions[version];
        const activeVersionEager = Boolean(activeVersion && (activeVersion.eager || ((_activeVersion_shareConfig = activeVersion.shareConfig) == null ? void 0 : _activeVersion_shareConfig.eager)));
        if (!activeVersion || activeVersion.strategy !== "loaded-first" && !activeVersion.loaded && (Boolean(!eager) !== !activeVersionEager ? eager : hostName > activeVersion.from)) {
          versions[version] = shared;
        }
      };
      const initFn = (mod) => mod && mod.init && mod.init(shareScope[shareScopeName], initScope);
      const initRemoteModule = async (key) => {
        const { module } = await host.remoteHandler.getRemoteModuleAndOptions({
          id: key
        });
        if (module.getEntry) {
          let remoteEntryExports;
          try {
            remoteEntryExports = await module.getEntry();
          } catch (error2) {
            remoteEntryExports = await host.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
              id: key,
              error: error2,
              from: "runtime",
              lifecycle: "beforeLoadShare",
              origin: host
            });
          }
          if (!module.inited) {
            await initFn(remoteEntryExports);
            module.inited = true;
          }
        }
      };
      Object.keys(host.options.shared).forEach((shareName) => {
        const sharedArr = host.options.shared[shareName];
        sharedArr.forEach((shared) => {
          if (shared.scope.includes(shareScopeName)) {
            register(shareName, shared);
          }
        });
      });
      if (host.options.shareStrategy === "version-first" || strategy === "version-first") {
        host.options.remotes.forEach((remote) => {
          if (remote.shareScope === shareScopeName) {
            promises.push(initRemoteModule(remote.name));
          }
        });
      }
      return promises;
    }
    // The lib function will only be available if the shared set by eager or runtime init is set or the shared is successfully loaded.
    // 1. If the loaded shared already exists globally, then it will be reused
    // 2. If lib exists in local shared, it will be used directly
    // 3. If the local get returns something other than Promise, then it will be used directly
    loadShareSync(pkgName, extraOptions) {
      const { host } = this;
      const shareInfo = share.getTargetSharedOptions({
        pkgName,
        extraOptions,
        shareInfos: host.options.shared
      });
      if (shareInfo == null ? void 0 : shareInfo.scope) {
        shareInfo.scope.forEach((shareScope) => {
          this.initializeSharing(shareScope, {
            strategy: shareInfo.strategy
          });
        });
      }
      const registeredShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfo, this.hooks.lifecycle.resolveShare);
      const addUseIn = (shared) => {
        if (!shared.useIn) {
          shared.useIn = [];
        }
        share.addUniqueItem(shared.useIn, host.options.name);
      };
      if (registeredShared) {
        if (typeof registeredShared.lib === "function") {
          addUseIn(registeredShared);
          if (!registeredShared.loaded) {
            registeredShared.loaded = true;
            if (registeredShared.from === host.options.name) {
              shareInfo.loaded = true;
            }
          }
          return registeredShared.lib;
        }
        if (typeof registeredShared.get === "function") {
          const module = registeredShared.get();
          if (!(module instanceof Promise)) {
            addUseIn(registeredShared);
            this.setShared({
              pkgName,
              loaded: true,
              from: host.options.name,
              lib: module,
              shared: registeredShared
            });
            return module;
          }
        }
      }
      if (shareInfo.lib) {
        if (!shareInfo.loaded) {
          shareInfo.loaded = true;
        }
        return shareInfo.lib;
      }
      if (shareInfo.get) {
        const module = shareInfo.get();
        if (module instanceof Promise) {
          throw new Error(`
        The loadShareSync function was unable to load ${pkgName}. The ${pkgName} could not be found in ${host.options.name}.
        Possible reasons for failure: 

        1. The ${pkgName} share was registered with the 'get' attribute, but loadShare was not used beforehand.

        2. The ${pkgName} share was not registered with the 'lib' attribute.

      `);
        }
        shareInfo.lib = module;
        this.setShared({
          pkgName,
          loaded: true,
          from: host.options.name,
          lib: shareInfo.lib,
          shared: shareInfo
        });
        return shareInfo.lib;
      }
      throw new Error(`
        The loadShareSync function was unable to load ${pkgName}. The ${pkgName} could not be found in ${host.options.name}.
        Possible reasons for failure: 

        1. The ${pkgName} share was registered with the 'get' attribute, but loadShare was not used beforehand.

        2. The ${pkgName} share was not registered with the 'lib' attribute.

      `);
    }
    initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
      const { host } = this;
      this.shareScopeMap[scopeName] = shareScope;
      this.hooks.lifecycle.initContainerShareScopeMap.emit({
        shareScope,
        options: host.options,
        origin: host,
        scopeName,
        hostShareScopeMap: extraOptions.hostShareScopeMap
      });
    }
    setShared({ pkgName, shared, from, lib, loading, loaded, get }) {
      const { version, scope = "default" } = shared, shareInfo = polyfills2._object_without_properties_loose(shared, [
        "version",
        "scope"
      ]);
      const scopes = Array.isArray(scope) ? scope : [
        scope
      ];
      scopes.forEach((sc) => {
        if (!this.shareScopeMap[sc]) {
          this.shareScopeMap[sc] = {};
        }
        if (!this.shareScopeMap[sc][pkgName]) {
          this.shareScopeMap[sc][pkgName] = {};
        }
        if (!this.shareScopeMap[sc][pkgName][version]) {
          this.shareScopeMap[sc][pkgName][version] = polyfills2._extends({
            version,
            scope: [
              "default"
            ]
          }, shareInfo, {
            lib,
            loaded,
            loading
          });
          if (get) {
            this.shareScopeMap[sc][pkgName][version].get = get;
          }
          return;
        }
        const registeredShared = this.shareScopeMap[sc][pkgName][version];
        if (loading && !registeredShared.loading) {
          registeredShared.loading = loading;
        }
      });
    }
    _setGlobalShareScopeMap(hostOptions) {
      const globalShareScopeMap = share.getGlobalShareScope();
      const identifier = hostOptions.id || hostOptions.name;
      if (identifier && !globalShareScopeMap[identifier]) {
        globalShareScopeMap[identifier] = this.shareScopeMap;
      }
    }
    constructor(host) {
      this.hooks = new PluginSystem({
        afterResolve: new AsyncWaterfallHook("afterResolve"),
        beforeLoadShare: new AsyncWaterfallHook("beforeLoadShare"),
        // not used yet
        loadShare: new AsyncHook(),
        resolveShare: new SyncWaterfallHook("resolveShare"),
        // maybe will change, temporarily for internal use only
        initContainerShareScopeMap: new SyncWaterfallHook("initContainerShareScopeMap")
      });
      this.host = host;
      this.shareScopeMap = {};
      this.initTokens = {};
      this._setGlobalShareScopeMap(host.options);
    }
  }
  class RemoteHandler {
    formatAndRegisterRemote(globalOptions, userOptions) {
      const userRemotes = userOptions.remotes || [];
      return userRemotes.reduce((res2, remote) => {
        this.registerRemote(remote, res2, {
          force: false
        });
        return res2;
      }, globalOptions.remotes);
    }
    setIdToRemoteMap(id, remoteMatchInfo) {
      const { remote, expose } = remoteMatchInfo;
      const { name, alias } = remote;
      this.idToRemoteMap[id] = {
        name: remote.name,
        expose
      };
      if (alias && id.startsWith(name)) {
        const idWithAlias = id.replace(name, alias);
        this.idToRemoteMap[idWithAlias] = {
          name: remote.name,
          expose
        };
        return;
      }
      if (alias && id.startsWith(alias)) {
        const idWithName = id.replace(alias, name);
        this.idToRemoteMap[idWithName] = {
          name: remote.name,
          expose
        };
      }
    }
    // eslint-disable-next-line max-lines-per-function
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async loadRemote(id, options) {
      const { host } = this;
      try {
        const { loadFactory = true } = options || {
          loadFactory: true
        };
        const { module, moduleOptions, remoteMatchInfo } = await this.getRemoteModuleAndOptions({
          id
        });
        const { pkgNameOrAlias, remote, expose, id: idRes, remoteSnapshot } = remoteMatchInfo;
        const moduleOrFactory = await module.get(idRes, expose, options, remoteSnapshot);
        const moduleWrapper = await this.hooks.lifecycle.onLoad.emit({
          id: idRes,
          pkgNameOrAlias,
          expose,
          exposeModule: loadFactory ? moduleOrFactory : void 0,
          exposeModuleFactory: loadFactory ? void 0 : moduleOrFactory,
          remote,
          options: moduleOptions,
          moduleInstance: module,
          origin: host
        });
        this.setIdToRemoteMap(id, remoteMatchInfo);
        if (typeof moduleWrapper === "function") {
          return moduleWrapper;
        }
        return moduleOrFactory;
      } catch (error2) {
        const { from = "runtime" } = options || {
          from: "runtime"
        };
        const failOver = await this.hooks.lifecycle.errorLoadRemote.emit({
          id,
          error: error2,
          from,
          lifecycle: "onLoad",
          origin: host
        });
        if (!failOver) {
          throw error2;
        }
        return failOver;
      }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async preloadRemote(preloadOptions) {
      const { host } = this;
      await this.hooks.lifecycle.beforePreloadRemote.emit({
        preloadOps: preloadOptions,
        options: host.options,
        origin: host
      });
      const preloadOps = formatPreloadArgs(host.options.remotes, preloadOptions);
      await Promise.all(preloadOps.map(async (ops) => {
        const { remote } = ops;
        const remoteInfo = getRemoteInfo(remote);
        const { globalSnapshot, remoteSnapshot } = await host.snapshotHandler.loadRemoteSnapshotInfo(remote);
        const assets = await this.hooks.lifecycle.generatePreloadAssets.emit({
          origin: host,
          preloadOptions: ops,
          remote,
          remoteInfo,
          globalSnapshot,
          remoteSnapshot
        });
        if (!assets) {
          return;
        }
        preloadAssets(remoteInfo, host, assets);
      }));
    }
    registerRemotes(remotes, options) {
      const { host } = this;
      remotes.forEach((remote) => {
        this.registerRemote(remote, host.options.remotes, {
          force: options == null ? void 0 : options.force
        });
      });
    }
    async getRemoteModuleAndOptions(options) {
      const { host } = this;
      const { id } = options;
      let loadRemoteArgs;
      try {
        loadRemoteArgs = await this.hooks.lifecycle.beforeRequest.emit({
          id,
          options: host.options,
          origin: host
        });
      } catch (error2) {
        loadRemoteArgs = await this.hooks.lifecycle.errorLoadRemote.emit({
          id,
          options: host.options,
          origin: host,
          from: "runtime",
          error: error2,
          lifecycle: "beforeRequest"
        });
        if (!loadRemoteArgs) {
          throw error2;
        }
      }
      const { id: idRes } = loadRemoteArgs;
      const remoteSplitInfo = matchRemoteWithNameAndExpose(host.options.remotes, idRes);
      share.assert(remoteSplitInfo, `
        Unable to locate ${idRes} in ${host.options.name}. Potential reasons for failure include:

        1. ${idRes} was not included in the 'remotes' parameter of ${host.options.name || "the host"}.

        2. ${idRes} could not be found in the 'remotes' of ${host.options.name} with either 'name' or 'alias' attributes.
        3. ${idRes} is not online, injected, or loaded.
        4. ${idRes}  cannot be accessed on the expected.
        5. The 'beforeRequest' hook was provided but did not return the correct 'remoteInfo' when attempting to load ${idRes}.
      `);
      const { remote: rawRemote } = remoteSplitInfo;
      const remoteInfo = getRemoteInfo(rawRemote);
      const matchInfo = await host.sharedHandler.hooks.lifecycle.afterResolve.emit(polyfills2._extends({
        id: idRes
      }, remoteSplitInfo, {
        options: host.options,
        origin: host,
        remoteInfo
      }));
      const { remote, expose } = matchInfo;
      share.assert(remote && expose, `The 'beforeRequest' hook was executed, but it failed to return the correct 'remote' and 'expose' values while loading ${idRes}.`);
      let module = host.moduleCache.get(remote.name);
      const moduleOptions = {
        host,
        remoteInfo
      };
      if (!module) {
        module = new Module(moduleOptions);
        host.moduleCache.set(remote.name, module);
      }
      return {
        module,
        moduleOptions,
        remoteMatchInfo: matchInfo
      };
    }
    registerRemote(remote, targetRemotes, options) {
      const { host } = this;
      const normalizeRemote = () => {
        if (remote.alias) {
          const findEqual = targetRemotes.find((item) => {
            var _item_alias;
            return remote.alias && (item.name.startsWith(remote.alias) || ((_item_alias = item.alias) == null ? void 0 : _item_alias.startsWith(remote.alias)));
          });
          share.assert(!findEqual, `The alias ${remote.alias} of remote ${remote.name} is not allowed to be the prefix of ${findEqual && findEqual.name} name or alias`);
        }
        if ("entry" in remote) {
          if (sdk2.isBrowserEnv() && !remote.entry.startsWith("http")) {
            remote.entry = new URL(remote.entry, window.location.origin).href;
          }
        }
        if (!remote.shareScope) {
          remote.shareScope = share.DEFAULT_SCOPE;
        }
        if (!remote.type) {
          remote.type = share.DEFAULT_REMOTE_TYPE;
        }
      };
      this.hooks.lifecycle.beforeRegisterRemote.emit({
        remote,
        origin: host
      });
      const registeredRemote = targetRemotes.find((item) => item.name === remote.name);
      if (!registeredRemote) {
        normalizeRemote();
        targetRemotes.push(remote);
        this.hooks.lifecycle.registerRemote.emit({
          remote,
          origin: host
        });
      } else {
        const messages = [
          `The remote "${remote.name}" is already registered.`,
          (options == null ? void 0 : options.force) ? "Hope you have known that OVERRIDE it may have some unexpected errors" : 'If you want to merge the remote, you can set "force: true".'
        ];
        if (options == null ? void 0 : options.force) {
          this.removeRemote(registeredRemote);
          normalizeRemote();
          targetRemotes.push(remote);
          this.hooks.lifecycle.registerRemote.emit({
            remote,
            origin: host
          });
        }
        sdk2.warn(messages.join(" "));
      }
    }
    removeRemote(remote) {
      try {
        const { host } = this;
        const { name } = remote;
        const remoteIndex = host.options.remotes.findIndex((item) => item.name === name);
        if (remoteIndex !== -1) {
          host.options.remotes.splice(remoteIndex, 1);
        }
        const loadedModule = host.moduleCache.get(remote.name);
        if (loadedModule) {
          const remoteInfo = loadedModule.remoteInfo;
          const key = remoteInfo.entryGlobalName;
          if (globalThis[key]) {
            var _Object_getOwnPropertyDescriptor;
            if ((_Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor(globalThis, key)) == null ? void 0 : _Object_getOwnPropertyDescriptor.configurable) {
              delete globalThis[key];
            } else {
              globalThis[key] = void 0;
            }
          }
          const remoteEntryUniqueKey = getRemoteEntryUniqueKey(loadedModule.remoteInfo);
          if (share.globalLoading[remoteEntryUniqueKey]) {
            delete share.globalLoading[remoteEntryUniqueKey];
          }
          host.snapshotHandler.manifestCache.delete(remoteInfo.entry);
          let remoteInsId = remoteInfo.buildVersion ? sdk2.composeKeyWithSeparator(remoteInfo.name, remoteInfo.buildVersion) : remoteInfo.name;
          const remoteInsIndex = globalThis.__FEDERATION__.__INSTANCES__.findIndex((ins) => {
            if (remoteInfo.buildVersion) {
              return ins.options.id === remoteInsId;
            } else {
              return ins.name === remoteInsId;
            }
          });
          if (remoteInsIndex !== -1) {
            const remoteIns = globalThis.__FEDERATION__.__INSTANCES__[remoteInsIndex];
            remoteInsId = remoteIns.options.id || remoteInsId;
            const globalShareScopeMap = share.getGlobalShareScope();
            let isAllSharedNotUsed = true;
            const needDeleteKeys = [];
            Object.keys(globalShareScopeMap).forEach((instId) => {
              const shareScopeMap = globalShareScopeMap[instId];
              shareScopeMap && Object.keys(shareScopeMap).forEach((shareScope) => {
                const shareScopeVal = shareScopeMap[shareScope];
                shareScopeVal && Object.keys(shareScopeVal).forEach((shareName) => {
                  const sharedPkgs = shareScopeVal[shareName];
                  sharedPkgs && Object.keys(sharedPkgs).forEach((shareVersion) => {
                    const shared = sharedPkgs[shareVersion];
                    if (shared && typeof shared === "object" && shared.from === remoteInfo.name) {
                      if (shared.loaded || shared.loading) {
                        shared.useIn = shared.useIn.filter((usedHostName) => usedHostName !== remoteInfo.name);
                        if (shared.useIn.length) {
                          isAllSharedNotUsed = false;
                        } else {
                          needDeleteKeys.push([
                            instId,
                            shareScope,
                            shareName,
                            shareVersion
                          ]);
                        }
                      } else {
                        needDeleteKeys.push([
                          instId,
                          shareScope,
                          shareName,
                          shareVersion
                        ]);
                      }
                    }
                  });
                });
              });
            });
            if (isAllSharedNotUsed) {
              remoteIns.shareScopeMap = {};
              delete globalShareScopeMap[remoteInsId];
            }
            needDeleteKeys.forEach(([insId, shareScope, shareName, shareVersion]) => {
              var _globalShareScopeMap_insId_shareScope_shareName, _globalShareScopeMap_insId_shareScope, _globalShareScopeMap_insId;
              (_globalShareScopeMap_insId = globalShareScopeMap[insId]) == null ? true : (_globalShareScopeMap_insId_shareScope = _globalShareScopeMap_insId[shareScope]) == null ? true : (_globalShareScopeMap_insId_shareScope_shareName = _globalShareScopeMap_insId_shareScope[shareName]) == null ? true : delete _globalShareScopeMap_insId_shareScope_shareName[shareVersion];
            });
            globalThis.__FEDERATION__.__INSTANCES__.splice(remoteInsIndex, 1);
          }
          const { hostGlobalSnapshot } = getGlobalRemoteInfo(remote, host);
          if (hostGlobalSnapshot) {
            const remoteKey = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && share.getInfoWithoutType(hostGlobalSnapshot.remotesInfo, remote.name).key;
            if (remoteKey) {
              delete hostGlobalSnapshot.remotesInfo[remoteKey];
              if (
                //eslint-disable-next-line no-extra-boolean-cast
                Boolean(share.Global.__FEDERATION__.__MANIFEST_LOADING__[remoteKey])
              ) {
                delete share.Global.__FEDERATION__.__MANIFEST_LOADING__[remoteKey];
              }
            }
          }
          host.moduleCache.delete(remote.name);
        }
      } catch (err) {
        console.log("removeRemote fail: ", err);
      }
    }
    constructor(host) {
      this.hooks = new PluginSystem({
        beforeRegisterRemote: new SyncWaterfallHook("beforeRegisterRemote"),
        registerRemote: new SyncWaterfallHook("registerRemote"),
        beforeRequest: new AsyncWaterfallHook("beforeRequest"),
        onLoad: new AsyncHook("onLoad"),
        handlePreloadModule: new SyncHook("handlePreloadModule"),
        errorLoadRemote: new AsyncHook("errorLoadRemote"),
        beforePreloadRemote: new AsyncHook("beforePreloadRemote"),
        generatePreloadAssets: new AsyncHook("generatePreloadAssets"),
        // not used yet
        afterPreloadRemote: new AsyncHook(),
        loadEntry: new AsyncHook()
      });
      this.host = host;
      this.idToRemoteMap = {};
    }
  }
  class FederationHost {
    initOptions(userOptions) {
      this.registerPlugins(userOptions.plugins);
      const options = this.formatOptions(this.options, userOptions);
      this.options = options;
      return options;
    }
    async loadShare(pkgName, extraOptions) {
      return this.sharedHandler.loadShare(pkgName, extraOptions);
    }
    // The lib function will only be available if the shared set by eager or runtime init is set or the shared is successfully loaded.
    // 1. If the loaded shared already exists globally, then it will be reused
    // 2. If lib exists in local shared, it will be used directly
    // 3. If the local get returns something other than Promise, then it will be used directly
    loadShareSync(pkgName, extraOptions) {
      return this.sharedHandler.loadShareSync(pkgName, extraOptions);
    }
    initializeSharing(shareScopeName = share.DEFAULT_SCOPE, extraOptions) {
      return this.sharedHandler.initializeSharing(shareScopeName, extraOptions);
    }
    initRawContainer(name, url2, container) {
      const remoteInfo = getRemoteInfo({
        name,
        entry: url2
      });
      const module = new Module({
        host: this,
        remoteInfo
      });
      module.remoteEntryExports = container;
      this.moduleCache.set(name, module);
      return module;
    }
    // eslint-disable-next-line max-lines-per-function
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async loadRemote(id, options) {
      return this.remoteHandler.loadRemote(id, options);
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async preloadRemote(preloadOptions) {
      return this.remoteHandler.preloadRemote(preloadOptions);
    }
    initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
      this.sharedHandler.initShareScopeMap(scopeName, shareScope, extraOptions);
    }
    formatOptions(globalOptions, userOptions) {
      const { shared } = share.formatShareConfigs(globalOptions, userOptions);
      const { userOptions: userOptionsRes, options: globalOptionsRes } = this.hooks.lifecycle.beforeInit.emit({
        origin: this,
        userOptions,
        options: globalOptions,
        shareInfo: shared
      });
      const remotes = this.remoteHandler.formatAndRegisterRemote(globalOptionsRes, userOptionsRes);
      const { shared: handledShared } = this.sharedHandler.registerShared(globalOptionsRes, userOptionsRes);
      const plugins = [
        ...globalOptionsRes.plugins
      ];
      if (userOptionsRes.plugins) {
        userOptionsRes.plugins.forEach((plugin) => {
          if (!plugins.includes(plugin)) {
            plugins.push(plugin);
          }
        });
      }
      const optionsRes = polyfills2._extends({}, globalOptions, userOptions, {
        plugins,
        remotes,
        shared: handledShared
      });
      this.hooks.lifecycle.init.emit({
        origin: this,
        options: optionsRes
      });
      return optionsRes;
    }
    registerPlugins(plugins) {
      const pluginRes = registerPlugins$1(plugins, [
        this.hooks,
        this.remoteHandler.hooks,
        this.sharedHandler.hooks,
        this.snapshotHandler.hooks,
        this.loaderHook
      ]);
      this.options.plugins = this.options.plugins.reduce((res2, plugin) => {
        if (!plugin) return res2;
        if (res2 && !res2.find((item) => item.name === plugin.name)) {
          res2.push(plugin);
        }
        return res2;
      }, pluginRes || []);
    }
    registerRemotes(remotes, options) {
      return this.remoteHandler.registerRemotes(remotes, options);
    }
    constructor(userOptions) {
      this.hooks = new PluginSystem({
        beforeInit: new SyncWaterfallHook("beforeInit"),
        init: new SyncHook(),
        // maybe will change, temporarily for internal use only
        beforeInitContainer: new AsyncWaterfallHook("beforeInitContainer"),
        // maybe will change, temporarily for internal use only
        initContainer: new AsyncWaterfallHook("initContainer")
      });
      this.version = "0.6.10";
      this.moduleCache = /* @__PURE__ */ new Map();
      this.loaderHook = new PluginSystem({
        // FIXME: may not be suitable , not open to the public yet
        getModuleInfo: new SyncHook(),
        createScript: new SyncHook(),
        createLink: new SyncHook(),
        // only work for manifest , so not open to the public yet
        fetch: new AsyncHook()
      });
      const defaultOptions = {
        id: share.getBuilderId(),
        name: userOptions.name,
        plugins: [
          snapshotPlugin(),
          generatePreloadAssetsPlugin()
        ],
        remotes: [],
        shared: {},
        inBrowser: sdk2.isBrowserEnv()
      };
      this.name = userOptions.name;
      this.options = defaultOptions;
      this.snapshotHandler = new SnapshotHandler(this);
      this.sharedHandler = new SharedHandler(this);
      this.remoteHandler = new RemoteHandler(this);
      this.shareScopeMap = this.sharedHandler.shareScopeMap;
      this.registerPlugins([
        ...defaultOptions.plugins,
        ...userOptions.plugins || []
      ]);
      this.options = this.formatOptions(defaultOptions, userOptions);
    }
  }
  let FederationInstance = null;
  function init2(options) {
    const instance = share.getGlobalFederationInstance(options.name, options.version);
    if (!instance) {
      const FederationConstructor = share.getGlobalFederationConstructor() || FederationHost;
      FederationInstance = new FederationConstructor(options);
      share.setGlobalFederationInstance(FederationInstance);
      return FederationInstance;
    } else {
      instance.initOptions(options);
      if (!FederationInstance) {
        FederationInstance = instance;
      }
      return instance;
    }
  }
  function loadRemote(...args) {
    share.assert(FederationInstance, "Please call init first");
    const loadRemote1 = FederationInstance.loadRemote;
    return loadRemote1.apply(FederationInstance, args);
  }
  function loadShare(...args) {
    share.assert(FederationInstance, "Please call init first");
    const loadShare1 = FederationInstance.loadShare;
    return loadShare1.apply(FederationInstance, args);
  }
  function loadShareSync(...args) {
    share.assert(FederationInstance, "Please call init first");
    const loadShareSync1 = FederationInstance.loadShareSync;
    return loadShareSync1.apply(FederationInstance, args);
  }
  function preloadRemote(...args) {
    share.assert(FederationInstance, "Please call init first");
    return FederationInstance.preloadRemote.apply(FederationInstance, args);
  }
  function registerRemotes(...args) {
    share.assert(FederationInstance, "Please call init first");
    return FederationInstance.registerRemotes.apply(FederationInstance, args);
  }
  function registerPlugins(...args) {
    share.assert(FederationInstance, "Please call init first");
    return FederationInstance.registerPlugins.apply(FederationInstance, args);
  }
  function getInstance() {
    return FederationInstance;
  }
  share.setGlobalFederationConstructor(FederationHost);
  Object.defineProperty(exports, "loadScript", {
    enumerable: true,
    get: function() {
      return sdk2.loadScript;
    }
  });
  Object.defineProperty(exports, "loadScriptNode", {
    enumerable: true,
    get: function() {
      return sdk2.loadScriptNode;
    }
  });
  exports.registerGlobalPlugins = share.registerGlobalPlugins;
  exports.FederationHost = FederationHost;
  exports.Module = Module;
  exports.getInstance = getInstance;
  exports.getRemoteEntry = getRemoteEntry;
  exports.getRemoteInfo = getRemoteInfo;
  exports.init = init2;
  exports.loadRemote = loadRemote;
  exports.loadShare = loadShare;
  exports.loadShareSync = loadShareSync;
  exports.preloadRemote = preloadRemote;
  exports.registerPlugins = registerPlugins;
  exports.registerRemotes = registerRemotes;
})(index_cjs$1);
const importMap = {};
const usedShared = {};
const usedRemotes = [];
let initResolve, initReject;
const initPromise = new Promise((re, rj) => {
  initResolve = re;
  initReject = rj;
});
var vite_mf_2_host__mf_v__runtimeInit__mf_v__ = {
  initPromise,
  initResolve,
  initReject
};
async function init(shared = {}) {
  const initRes = index_cjs$1.init({
    name: "vite-host",
    remotes: usedRemotes,
    shared: usedShared,
    plugins: [],
    shareStrategy: "version-first"
  });
  initRes.initShareScopeMap("default", shared);
  try {
    await Promise.all(await initRes.initializeSharing("default", { strategy: "version-first" }));
  } catch (e) {
    console.error(e);
  }
  vite_mf_2_host__mf_v__runtimeInit__mf_v__.initResolve(initRes);
  return initRes;
}
function getExposes(moduleName) {
  if (!(moduleName in exposesMap)) throw new Error(`Module ${moduleName} does not exist in container.`);
  return exposesMap[moduleName]().then((res2) => () => res2);
}
export {
  init as a,
  getExposes as g,
  index_cjs$1 as i,
  vite_mf_2_host__mf_v__runtimeInit__mf_v__ as v
};

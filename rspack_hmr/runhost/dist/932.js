"use strict";
(self['webpackChunkrunhost1'] = self['webpackChunkrunhost1'] || []).push([["932"], {
"487": (function (__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));

var runtime = __webpack_require__(350);



Object.keys(runtime).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return runtime[k]; }
	});
});


}),
"751": (function (__unused_webpack_module, exports, __webpack_require__) {


var m = __webpack_require__(773);
if (true) {
  exports.createRoot = m.createRoot;
  exports.hydrateRoot = m.hydrateRoot;
} else { var i }


}),
"193": (function (__unused_webpack_module, exports, __webpack_require__) {
var __webpack_unused_export__;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=__webpack_require__(456),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}__webpack_unused_export__=l;exports.jsx=q;exports.jsxs=q;


}),
"676": (function (module, __unused_webpack_exports, __webpack_require__) {


if (true) {
  module.exports = __webpack_require__(193);
} else {}


}),
"930": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);
/* harmony import */var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(811);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(175);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */var _module_federation_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(350);




//@ts-ignore
const Hello = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_2__.lazy)(()=>(0,_module_federation_runtime__WEBPACK_IMPORTED_MODULE_3__.loadRemote)('a2/Hello').then((module)=>({
            default: module.Hello
        })));
function App() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "App max-w-[1200px] w-full flex items-center  h-[400px]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "container mx-auto border w-full p-20 flex flex-col gap-10 rounded-lg border-white border-[0.2px]",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                    children: "Runhost :)"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                    children: [
                        "This is currently in the ",
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", {
                            children: "runhost"
                        }),
                        " app.",
                        ' ',
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", {
                                    children: "Directory name: runhost"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", {
                                    children: "package.json name: @rspack-hmr/rspack-runhost"
                                })
                            ]
                        }),
                        ' ',
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}),
                        " We are taking the ",
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", {
                            children: "'Hello'"
                        }),
                        "module from App_02"
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react__WEBPACK_IMPORTED_MODULE_2__.Suspense, {
                    fallback: "Loading Hello",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Hello, {
                        name: 'bob?'
                    })
                })
            ]
        })
    });
}
/* harmony default export */ __webpack_exports__.Z = (App);


}),
"162": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  renderApp: function() { return renderApp; }
});
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(175);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(751);
/* harmony import */var _App_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(930);
/* harmony import */var _index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(872);
/* harmony import */var _module_federation_enhanced_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(412);
/* harmony import */var _module_federation_enhanced_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_module_federation_enhanced_runtime__WEBPACK_IMPORTED_MODULE_5__);






const runtimePlugin = function() {
    return {
        name: 'my-runtime-plugin',
        beforeInit (args) {
            console.log('beforeInit: ', args);
            return args;
        },
        beforeRequest (args) {
            console.log('beforeRequest: ', args);
            return args;
        },
        // loadRemoteSnapshot(args) {
        //   console.log("loadRemoteSnapshot: ", args);
        // if (args.manifestJson && (args.manifestJson.metaData as any).publicPath.includes("placeholder")) {
        //   (args.manifestJson.metaData as any).publicPath = (args.manifestJson.metaData as any).publicPath.replace(
        //     "placeholder",
        //     args.manifestUrl?.split("/")[2].split(":")[0],
        //   );
        // }
        // if ((args.remoteSnapshot as any).publicPath.includes("placeholder")) {
        //   (args.remoteSnapshot as any).publicPath = (args.remoteSnapshot as any).publicPath.replace(
        //     "placeholder",
        //     args.manifestUrl?.split("/")[2].split(":")[0],
        //   );
        // }
        //   return args;
        //},
        afterResolve (args) {
            console.log('afterResolve', args);
            return args;
        },
        onLoad (args) {
            console.log('onLoad: ', args);
            return args;
        },
        async loadShare (args) {
            console.log('loadShare:', args);
            return args;
        },
        async beforeLoadShare (args) {
            console.log('beforeloadShare:', args);
            return args;
        }
    };
};
async function renderApp() {
    (0,_module_federation_enhanced_runtime__WEBPACK_IMPORTED_MODULE_5__.init)({
        name: 'runhost',
        remotes: [
            {
                name: '@app_02',
                entry: 'http://localhost:3001/mf-manifest.json',
                alias: 'a2'
            }
        ],
        plugins: [
            runtimePlugin()
        ]
    });
    (0,_module_federation_enhanced_runtime__WEBPACK_IMPORTED_MODULE_5__.loadRemote)('a2/pi').then((module)=>{
        console.log('results from pi in app02: ', module.default());
    });
    react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot(document.getElementById('root')).render(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react__WEBPACK_IMPORTED_MODULE_1___default().StrictMode), {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_App_tsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */.Z, {})
    }));
}


}),
"811": (function (module, __unused_webpack_exports, __webpack_require__) {
module.exports = {};


}),
"872": (function (module, __unused_webpack_exports, __webpack_require__) {
module.exports = {};


}),
"412": (function (__unused_webpack_module, exports, __webpack_require__) {

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(487), exports);
//# sourceMappingURL=runtime.js.map

}),

}]);
//# sourceMappingURL=932.js.map
"use strict";
(self['webpackChunkapp_011'] = self['webpackChunkapp_011'] || []).push([["932"], {
"751": (function (__unused_webpack_module, exports, __webpack_require__) {


var m = __webpack_require__(220);
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
var f=__webpack_require__(565),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
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
/* harmony import */var app_02_Hello__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(534);
/* harmony import */var app_02_Hello__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(app_02_Hello__WEBPACK_IMPORTED_MODULE_2__);



function App() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "App max-w-[1200px] w-full flex items-center  h-[400px]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "container mx-auto border w-full p-20 flex flex-col gap-10 rounded-lg border-white border-[0.2px]",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                    children: "Host :)"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                    children: [
                        "This is currently in a host app.",
                        ' ',
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", {
                                    children: "Directory name: host"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", {
                                    children: "package.json name: @rspack-hmr/rspack-host"
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
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "logo",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
                        className: "w-10 just",
                        src: "https://cdn.builder.io/api/v1/image/assets%2Fea8c8e416fd64171bc2ef9ac5ac226e6%2Fa079d11fa8c944439878233232acc4b5"
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(app_02_Hello__WEBPACK_IMPORTED_MODULE_2__.Hello, {
                    name: 'bobzz'
                })
            ]
        })
    });
}
/* harmony default export */ __webpack_exports__.Z = (App);


}),
"162": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(969);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(751);
/* harmony import */var _App_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(930);
/* harmony import */var _index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(872);





react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot(document.getElementById('root')).render(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react__WEBPACK_IMPORTED_MODULE_1___default().StrictMode), {
    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_App_tsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */.Z, {})
}));


}),
"811": (function (module, __unused_webpack_exports, __webpack_require__) {
module.exports = {};


}),
"872": (function (module, __unused_webpack_exports, __webpack_require__) {
module.exports = {};


}),

}]);
//# sourceMappingURL=932.js.map
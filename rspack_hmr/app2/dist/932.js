"use strict";
(self['webpackChunkapp_021'] = self['webpackChunkapp_021'] || []).push([["932"], {
"930": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);
/* harmony import */var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(811);
/* harmony import */var _Hello__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(175);



function App() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "App max-w-[1200px] w-full flex items-center  h-[400px]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "container mx-auto border w-full p-20 flex flex-col gap-10 rounded-lg border-white border-[0.2px]",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                    children: "App_02 :)"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                    children: [
                        "This is currently in app2 ",
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}),
                        " while we are using the",
                        ' ',
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", {
                            children: "'Hello'"
                        }),
                        "module ourselves, we are also exposing it and providing it to other applications."
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Hello__WEBPACK_IMPORTED_MODULE_2__.Hello, {
                    name: "Frank!!!"
                })
            ]
        })
    });
}
/* harmony default export */ __webpack_exports__.Z = (App);


}),
"175": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Hello: function() { return Hello; }
});
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);

const Hello = (param)=>{
    let { name } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "relative  h-40  w-full",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("code", {
                className: "absolute z-10 top-4 left-6 bg-gray-700 p-2 rounded-lg",
                children: [
                    '<Hello name="',
                    name,
                    '"> from app2'
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "border z-0 border-1 absolute top-10 w-full border-red-400 rounded-lg px-4 py-8",
                children: [
                    "Hello, from app_02, ",
                    name,
                    "!"
                ]
            })
        ]
    });
};


}),
"162": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(271);
/* harmony import */var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(751);
/* harmony import */var _App_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(930);
/* harmony import */var _index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(872);





react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot(document.getElementById('root')).render(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react__WEBPACK_IMPORTED_MODULE_1__.StrictMode, {
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
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import svgr from "@svgr/rollup";
import postcss from "rollup-plugin-postcss";
import { withZephyr } from "rollup-plugin-zephyr";

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: "src/index.tsx",
    output: {
      file: "dist/index.js",
      format: "es",
      globals: {
        "react/jsx-runtime": "jsxRuntime",
        "react-dom/client": "ReactDOM",
        react: "React",
      },
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
      resolve(),
      commonjs(),
      typescript(),
      html(),
      svgr(),
      postcss({ extensions: [".css"] }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [["@babel/preset-react", { runtime: "automatic" }]],
      }),
      withZephyr(),
    ],
  },
];

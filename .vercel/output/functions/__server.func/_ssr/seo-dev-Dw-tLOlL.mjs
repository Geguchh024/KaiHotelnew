import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function SeoDevPanel() {
  const [activeTab, setActiveTab] = reactExports.useState("pages");
  const [activePage, setActivePage] = reactExports.useState(0);
  {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-sm", children: "SEO Dev Panel is only available in development mode." });
  }
}
export {
  SeoDevPanel as component
};

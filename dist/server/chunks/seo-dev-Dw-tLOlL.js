import { jsx } from "react/jsx-runtime";
import { useState } from "react";
function SeoDevPanel() {
  const [activeTab, setActiveTab] = useState("pages");
  const [activePage, setActivePage] = useState(0);
  {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-sm", children: "SEO Dev Panel is only available in development mode." });
  }
}
export {
  SeoDevPanel as component
};

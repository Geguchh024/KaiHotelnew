import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as api } from "./api-B4qLQuEf.mjs";
import { a as Route$2, b as useAdminAuth } from "./router-cXXbqms1.mjs";
import { d as useAction } from "../_libs/convex.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
function LoginPage() {
  const {
    redirect
  } = Route$2.useSearch();
  const {
    login
  } = useAdminAuth();
  const navigate = useNavigate();
  const loginAction = useAction(api.authNode.login);
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const {
        token
      } = await loginAction({
        username,
        password
      });
      login(token);
      void navigate({
        to: redirect ?? "/admin"
      });
    } catch {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-surface-container-low flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/30 p-6 sm:p-10 w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8 sm:mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[EB_Garamond] text-[30px] sm:text-[36px] leading-[1.2] text-primary mb-1", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70", children: "Admin Panel" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "username", className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true, autoComplete: "username", className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50", placeholder: "Enter username" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password", className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50", placeholder: "Enter password" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { role: "alert", className: "font-[Hanken_Grotesk] text-[13px] text-error text-center", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: isLoading, className: "mt-2 bg-primary text-on-primary px-6 py-3 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px] animate-spin", "aria-hidden": "true", children: "progress_activity" }),
        "Signing in..."
      ] }) : "Sign In" })
    ] })
  ] }) });
}
export {
  LoginPage as component
};

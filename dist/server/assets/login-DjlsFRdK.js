import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { a as api } from "./api-B4qLQuEf.js";
import { a as Route, b as useAdminAuth } from "./router-BPQh_9EZ.js";
import "convex/server";
import "zod";
function LoginPage() {
  const {
    redirect
  } = Route.useSearch();
  const {
    login
  } = useAdminAuth();
  const navigate = useNavigate();
  const loginAction = useAction(api.authNode.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-surface-container-low flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/30 p-10 w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-[EB_Garamond] text-[36px] leading-[1.2] text-primary mb-1", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70", children: "Admin Panel" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "username", className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: "Username" }),
        /* @__PURE__ */ jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true, autoComplete: "username", className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50", placeholder: "Enter username" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: "Password" }),
        /* @__PURE__ */ jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password", className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50", placeholder: "Enter password" })
      ] }),
      error && /* @__PURE__ */ jsx("p", { role: "alert", className: "font-[Hanken_Grotesk] text-[13px] text-error text-center", children: error }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: isLoading, className: "mt-2 bg-primary text-on-primary px-6 py-3 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[18px] animate-spin", "aria-hidden": "true", children: "progress_activity" }),
        "Signing in..."
      ] }) : "Sign In" })
    ] })
  ] }) });
}
export {
  LoginPage as component
};

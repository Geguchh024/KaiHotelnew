import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useI18n } from "./router-cXXbqms1.mjs";
import { a as api } from "./api-B4qLQuEf.mjs";
import { u as useQuery } from "../_libs/convex.mjs";
const Navbar = reactExports.memo(function Navbar2() {
  const { t, locale, setLocale } = useI18n();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = reactExports.useState(false);
  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/rooms", label: t("nav.rooms") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/contact", label: t("nav.contact") }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex justify-between items-center px-4 sm:px-6 py-4 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-[EB_Garamond] text-[22px] sm:text-[24px] leading-[1.3] text-primary font-medium", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center gap-8", children: navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: link.to,
          className: `font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-300 ${location.pathname === link.to ? "text-primary border-b border-primary pb-0.5" : "text-secondary hover:text-primary"}`,
          children: link.label
        },
        link.to
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setLocale(locale === "ka" ? "en" : "ka"),
            className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2 sm:px-2.5 py-1.5 rounded-sm",
            children: locale === "ka" ? "EN" : "ქარ"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/reservations",
            className: "hidden sm:inline-block bg-primary text-on-primary px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity",
            children: t("nav.bookNow")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMobileMenuOpen(!mobileMenuOpen),
            className: "md:hidden flex items-center justify-center w-9 h-9 text-primary",
            "aria-label": "Toggle menu",
            "aria-expanded": mobileMenuOpen,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[24px]", children: mobileMenuOpen ? "close" : "menu" })
          }
        )
      ] })
    ] }),
    mobileMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden border-t border-outline-variant/20 bg-background/95 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col px-6 py-4 gap-1", children: [
      navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: link.to,
          onClick: () => setMobileMenuOpen(false),
          className: `font-[Hanken_Grotesk] text-[13px] font-semibold uppercase tracking-[0.05em] py-3 border-b border-outline-variant/10 transition-colors ${location.pathname === link.to ? "text-primary" : "text-secondary hover:text-primary"}`,
          children: link.label
        },
        link.to
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/reservations",
          onClick: () => setMobileMenuOpen(false),
          className: "mt-3 bg-primary text-on-primary px-5 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity text-center",
          children: t("nav.bookNow")
        }
      )
    ] }) })
  ] });
});
const Footer = reactExports.memo(function Footer2() {
  const { t, locale } = useI18n();
  const siteSettings = useQuery(api.siteSettings.get);
  const sponsors = useQuery(api.sponsors.list) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "w-full border-t border-outline-variant/20 bg-surface-container-lowest", children: [
    sponsors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 border-b border-outline-variant/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[EB_Garamond] text-[18px] text-primary text-center mb-6", children: t("footer.partners") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center gap-8 flex-wrap", children: sponsors.map((sponsor) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: sponsor.websiteUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-2 font-[Hanken_Grotesk] text-[13px] text-secondary hover:text-primary transition-colors",
          children: [
            sponsor.logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sponsor.logoUrl, alt: sponsor.name, className: "h-5 w-auto object-contain", loading: "lazy", decoding: "async" }),
            sponsor.name
          ]
        },
        sponsor._id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-10 sm:py-12 px-4 sm:px-6 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-[EB_Garamond] text-[20px] font-medium text-primary block mb-3", children: "Kai Hotel Bar" }),
          locale === "ka" && siteSettings?.aboutKa && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] text-secondary leading-[1.6]", children: siteSettings.aboutKa }),
          locale === "en" && siteSettings?.aboutEn && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] text-secondary leading-[1.6]", children: siteSettings.aboutEn })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-primary mb-4", children: t("nav.contact") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "call" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `tel:${siteSettings?.phone ?? "+995511222028"}`,
                  className: "font-[Hanken_Grotesk] text-[13px] hover:text-primary transition-colors",
                  children: siteSettings?.phone ?? t("footer.phone")
                }
              )
            ] }),
            siteSettings?.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "mail" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${siteSettings.email}`, className: "font-[Hanken_Grotesk] text-[13px] hover:text-primary transition-colors", children: siteSettings.email })
            ] }),
            (siteSettings?.addressKa || siteSettings?.addressEn) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "location_on" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px]", children: locale === "ka" ? siteSettings?.addressKa : siteSettings?.addressEn })
            ] }),
            siteSettings?.facebookUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                className: "flex items-center gap-2 text-secondary hover:text-primary transition-colors mt-1",
                href: siteSettings.facebookUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 fill-current", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px]", children: "Facebook" })
                ]
              }
            ),
            siteSettings?.instagramUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                className: "flex items-center gap-2 text-secondary hover:text-primary transition-colors",
                href: siteSettings.instagramUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "photo_camera" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px]", children: "Instagram" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 pt-6 border-t border-outline-variant/20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] text-secondary/60", children: t("footer.copyright") }) })
    ] })
  ] });
});
export {
  Footer as F,
  Navbar as N
};

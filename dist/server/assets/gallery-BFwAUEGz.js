import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "convex/react";
import { a as api } from "./api-B4qLQuEf.js";
import { u as useI18n } from "./router-BPQh_9EZ.js";
import { B as BlurhashImage } from "./BlurhashImage-CfDtp30u.js";
import { N as Navbar, F as Footer } from "./Footer-B-hn7Oto.js";
import "convex/server";
import "@tanstack/react-router";
import "zod";
import "blurhash";
function getSpan(index) {
  const patterns = [
    "row-span-2",
    // tall
    "",
    // square
    "col-span-2",
    // wide
    "",
    // square
    "",
    // square
    "row-span-2",
    // tall
    "",
    // square
    "col-span-2 row-span-2",
    // big
    "",
    // square
    ""
    // square
  ];
  return patterns[index % patterns.length];
}
function GalleryPage() {
  const {
    locale
  } = useI18n();
  const galleryImages = useQuery(api.gallery.list) ?? [];
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const prev = () => setLightboxIndex((i) => i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null);
  const next = () => setLightboxIndex((i) => i !== null ? (i + 1) % galleryImages.length : null);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsxs("section", { className: "pt-32 pb-10 px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20", children: [
        /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-3", children: locale === "ka" ? "პერსპექტივა" : "Perspective" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "font-[EB_Garamond] text-[40px] md:text-[52px] leading-[1.1] text-primary", children: locale === "ka" ? "ვიზუალური პოეზია" : "Visual Poetry" }),
          galleryImages.length > 0 && /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[12px] text-secondary pb-2 shrink-0", children: [
            galleryImages.length,
            " ",
            locale === "ka" ? "სურათი" : "images"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-10 px-4 md:px-8 max-w-[1280px] mx-auto", children: galleryImages.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 md:hidden", children: galleryImages.map((img) => /* @__PURE__ */ jsxs("div", { className: "aspect-square overflow-hidden cursor-pointer group relative", onClick: () => setLightboxIndex(galleryImages.indexOf(img)), children: [
          /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: img.imageUrl, alt: img.altText, blurhash: img.blurhash }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-white text-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: "zoom_in" }) })
        ] }, img._id)) }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:grid gap-2", style: {
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "180px"
        }, children: galleryImages.map((img, idx) => {
          const span = getSpan(idx);
          return /* @__PURE__ */ jsxs("div", { className: `overflow-hidden cursor-pointer group relative ${span}`, onClick: () => setLightboxIndex(idx), children: [
            /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: img.imageUrl, alt: img.altText, blurhash: img.blurhash }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-white text-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: "zoom_in" }) })
          ] }, img._id);
        }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "py-24 text-center border border-outline-variant/20 bg-surface-container-low", children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[40px] text-secondary/30 block mb-5", children: "photo_library" }),
        /* @__PURE__ */ jsx("p", { className: "font-[EB_Garamond] text-[22px] text-primary mb-2", children: locale === "ka" ? "გალერეა მალე დაემატება" : "Gallery Coming Soon" }),
        /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] text-secondary max-w-xs mx-auto", children: locale === "ka" ? "ჩვენ ვმუშაობთ სურათების დამატებაზე. მალე დაბრუნდით." : "We are curating our gallery. Check back soon." })
      ] }) })
    ] }),
    lightboxIndex !== null && galleryImages[lightboxIndex] && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] bg-black/92 flex items-center justify-center", onClick: () => setLightboxIndex(null), children: [
      /* @__PURE__ */ jsx("button", { className: "absolute top-5 right-5 text-white/60 hover:text-white transition-colors", onClick: () => setLightboxIndex(null), "aria-label": "Close", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[28px]", children: "close" }) }),
      galleryImages.length > 1 && /* @__PURE__ */ jsx("button", { className: "absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors", onClick: (e) => {
        e.stopPropagation();
        prev();
      }, "aria-label": "Previous", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[36px]", children: "chevron_left" }) }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-[88vw] max-h-[88vh]", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsx("img", { src: galleryImages[lightboxIndex].imageUrl, alt: galleryImages[lightboxIndex].altText, className: "max-w-full max-h-[88vh] object-contain" }),
        galleryImages[lightboxIndex].altText && /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] text-white/50 mt-3 text-center", children: galleryImages[lightboxIndex].altText })
      ] }),
      galleryImages.length > 1 && /* @__PURE__ */ jsx("button", { className: "absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors", onClick: (e) => {
        e.stopPropagation();
        next();
      }, "aria-label": "Next", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[36px]", children: "chevron_right" }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-5 left-1/2 -translate-x-1/2 font-[Hanken_Grotesk] text-[11px] text-white/40 tracking-widest", children: [
        lightboxIndex + 1,
        " / ",
        galleryImages.length
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  GalleryPage as component
};

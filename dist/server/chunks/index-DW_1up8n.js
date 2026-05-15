import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { a as api } from "./api-B4qLQuEf.js";
import { u as useI18n } from "./router-cXXbqms1.js";
import { D as DatePicker, C as CustomSelect } from "./custom-select-BPjJfbMk.js";
import { B as BlurhashImage } from "./BlurhashImage-Ep8mXU4M.js";
import { N as Navbar, F as Footer } from "./Footer-BZMoXUax.js";
import { addDays, format } from "date-fns";
import "convex/server";
import "zod";
import "date-fns/locale";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "blurhash";
function Home() {
  const {
    t,
    locale
  } = useI18n();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState("2");
  const rooms = useQuery(api.rooms.list) ?? [];
  const galleryImages = useQuery(api.gallery.list) ?? [];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsxs("section", { className: "relative h-[75vh] sm:h-[80vh] md:h-[85vh] flex items-center justify-center overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
          /* @__PURE__ */ jsx(BlurhashImage, { src: "https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1258&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Kai Hotel", blurhash: "LkH^woxCI=sn}ls,R.sm^LoIR-n%", className: "w-full h-full", priority: true, sizes: "100vw" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/65" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-4 sm:px-6 max-w-3xl", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 block mb-3 sm:mb-4", children: t("hero.welcome") }),
          /* @__PURE__ */ jsx("h1", { className: "font-[EB_Garamond] text-[28px] sm:text-[36px] md:text-[48px] leading-[1.15] tracking-[-0.01em] text-white mb-3 sm:mb-4", children: t("hero.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] sm:text-[15px] leading-[1.5] text-white/80 max-w-xl mx-auto mb-6 sm:mb-8", children: t("hero.subtitle") }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsx(Link, { to: "/rooms", className: "bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:bg-white/20 transition-all", children: t("hero.exploreRooms") }),
            /* @__PURE__ */ jsx(Link, { to: "/contact", className: "bg-white text-primary px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all", children: t("nav.contact") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "relative z-20 -mt-12 px-4 sm:px-6 max-w-[1080px] mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-6 md:p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[18px] font-medium text-primary mb-5", children: t("booking.title") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-5 items-end", children: [
          /* @__PURE__ */ jsx(DatePicker, { value: checkIn, onChange: (date) => {
            setCheckIn(date);
            if (checkOut && date >= checkOut) {
              setCheckOut(null);
            }
          }, placeholder: t("booking.selectDate"), locale, icon: "calendar_today", label: t("booking.checkin"), minDate: /* @__PURE__ */ new Date(), rangeStart: checkIn, rangeEnd: checkOut }),
          /* @__PURE__ */ jsx(DatePicker, { value: checkOut, onChange: setCheckOut, placeholder: t("booking.selectDate"), locale, icon: "calendar_month", minDate: checkIn ? addDays(checkIn, 1) : /* @__PURE__ */ new Date(), label: t("booking.checkout"), rangeStart: checkIn, rangeEnd: checkOut }),
          /* @__PURE__ */ jsx(CustomSelect, { value: guests, onChange: setGuests, icon: "person", label: t("booking.guests"), options: [{
            value: "1",
            label: locale === "ka" ? "1 სტუმარი" : "1 Guest"
          }, {
            value: "2",
            label: locale === "ka" ? "2 სტუმარი" : "2 Guests"
          }, {
            value: "3",
            label: locale === "ka" ? "3 სტუმარი" : "3 Guests"
          }, {
            value: "4",
            label: locale === "ka" ? "4 სტუმარი" : "4 Guests"
          }, {
            value: "5",
            label: locale === "ka" ? "5+ სტუმარი" : "5+ Guests"
          }] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block opacity-0", children: " " }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              const search = {};
              if (checkIn) search.checkIn = format(checkIn, "yyyy-MM-dd");
              if (checkOut) search.checkOut = format(checkOut, "yyyy-MM-dd");
              if (guests !== "2") search.guests = guests;
              void navigate({
                to: "/reservations",
                search
              });
            }, className: "flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all text-center w-full", children: t("nav.bookNow") })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1280px] mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2", children: t("rooms.label") }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary", children: t("rooms.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto", children: t("rooms.description") })
        ] }),
        rooms.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", children: rooms.slice(0, 3).map((room) => /* @__PURE__ */ jsxs("div", { className: "group cursor-pointer", children: [
            /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] overflow-hidden mb-4 relative", children: /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: room.imageUrl, alt: locale === "ka" ? room.nameKa : room.nameEn, blurhash: room.blurhash }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1", children: locale === "ka" ? room.nameKa : room.nameEn }),
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary", children: locale === "ka" ? room.descriptionKa : room.descriptionEn }),
            /* @__PURE__ */ jsxs("p", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold text-primary mt-2", children: [
              "$",
              Math.round(room.pricePerNight),
              " / ",
              locale === "ka" ? "ღამე" : "night",
              " · ",
              room.capacity,
              " ",
              locale === "ka" ? "სტუმარი" : "guests"
            ] })
          ] }, room._id)) }),
          rooms.length > 3 && /* @__PURE__ */ jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsx(Link, { to: "/rooms", className: "font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border border-primary px-6 py-2.5 hover:bg-primary/5 transition-colors", children: t("rooms.viewAll") }) })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[48px] text-secondary/40 block mb-4", children: "bed" }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[15px] text-secondary", children: locale === "ka" ? "ნომრები მალე დაემატება" : "Rooms coming soon" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-12 sm:py-16 md:py-20 bg-surface-container-low", children: /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-6 max-w-[1280px] mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2", children: t("amenities.label") }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary", children: t("amenities.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto", children: t("amenities.description") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-6", children: [{
          icon: "wifi",
          label: t("amenities.wifi")
        }, {
          icon: "airport_shuttle",
          label: t("amenities.shuttle")
        }, {
          icon: "local_parking",
          label: t("amenities.parking")
        }, {
          icon: "family_restroom",
          label: t("amenities.family")
        }, {
          icon: "smoke_free",
          label: t("amenities.nonSmoking")
        }, {
          icon: "concierge",
          label: t("amenities.reception")
        }, {
          icon: "deck",
          label: t("amenities.terrace")
        }, {
          icon: "yard",
          label: t("amenities.garden")
        }].map((amenity) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2.5 p-5 bg-surface-container-lowest border border-outline-variant/20 hover:shadow-sm transition-shadow", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[28px]", children: amenity.icon }),
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold text-primary text-center", children: amenity.label })
        ] }, amenity.icon)) })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1280px] mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2", children: t("reviews.label") }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary", children: t("reviews.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto", children: t("reviews.description") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6", children: [{
          nameKey: "reviews.review1.name",
          countryKey: "reviews.review1.country",
          textKey: "reviews.review1.text"
        }, {
          nameKey: "reviews.review2.name",
          countryKey: "reviews.review2.country",
          textKey: "reviews.review2.text"
        }, {
          nameKey: "reviews.review3.name",
          countryKey: "reviews.review3.country",
          textKey: "reviews.review3.text"
        }].map((review, i) => /* @__PURE__ */ jsxs("div", { className: "p-6 bg-surface-container-lowest border border-outline-variant/20", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[18px]", children: "person" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-[Hanken_Grotesk] text-[13px] font-semibold text-primary", children: t(review.nameKey) }),
              /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary", children: t(review.countryKey) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-[Hanken_Grotesk] text-[13px] leading-[1.6] text-secondary", children: [
            '"',
            t(review.textKey),
            '"'
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-0.5 mt-3", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[16px] text-amber-500", style: {
            fontVariationSettings: "'FILL' 1"
          }, children: "star" }, star)) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "py-12 sm:py-16 md:py-20 bg-surface-container-low overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-6 max-w-[1280px] mx-auto mb-6 sm:mb-8 flex items-end justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2", children: locale === "ka" ? "გალერეა" : "Gallery" }),
            /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[24px] sm:text-[28px] md:text-[36px] leading-[1.2] text-primary", children: "Kai Hotel" })
          ] }),
          galleryImages.length > 0 && /* @__PURE__ */ jsx(Link, { to: "/gallery", className: "font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border border-primary px-3 sm:px-5 py-2 hover:bg-primary/5 transition-colors shrink-0", children: locale === "ka" ? "სრული გალერეა" : "View All" })
        ] }),
        galleryImages.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-6 max-w-[1280px] mx-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 md:hidden", children: galleryImages.slice(0, 4).map((img) => /* @__PURE__ */ jsx("div", { className: "aspect-square overflow-hidden", children: /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: img.imageUrl, alt: img.altText, blurhash: img.blurhash }) }, img._id)) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:grid gap-2", style: {
            gridTemplateColumns: "2fr 1fr 1fr",
            gridTemplateRows: "220px 220px"
          }, children: [
            /* @__PURE__ */ jsx("div", { className: "row-span-2 overflow-hidden", children: galleryImages[0] && /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: galleryImages[0].imageUrl, alt: galleryImages[0].altText, blurhash: galleryImages[0].blurhash }) }),
            /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: galleryImages[1] && /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: galleryImages[1].imageUrl, alt: galleryImages[1].altText, blurhash: galleryImages[1].blurhash }) }),
            /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: galleryImages[2] && /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: galleryImages[2].imageUrl, alt: galleryImages[2].altText, blurhash: galleryImages[2].blurhash }) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2 overflow-hidden", children: galleryImages[3] && /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: galleryImages[3].imageUrl, alt: galleryImages[3].altText, blurhash: galleryImages[3].blurhash }) })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-6 max-w-[1280px] mx-auto text-center py-12", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[48px] text-secondary/40 block mb-4", children: "photo_library" }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[15px] text-secondary", children: locale === "ka" ? "გალერეა მალე დაემატება" : "Gallery coming soon" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Home as component
};

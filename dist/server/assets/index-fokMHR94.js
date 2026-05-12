import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { u as useI18n } from "./router-BarC2zVj.js";
import { D as DatePicker, C as CustomSelect } from "./custom-select-BjcfJf54.js";
import { addDays } from "date-fns";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
const unavailableDates = [addDays(/* @__PURE__ */ new Date(), 3), addDays(/* @__PURE__ */ new Date(), 4), addDays(/* @__PURE__ */ new Date(), 10), addDays(/* @__PURE__ */ new Date(), 11), addDays(/* @__PURE__ */ new Date(), 12), addDays(/* @__PURE__ */ new Date(), 18), addDays(/* @__PURE__ */ new Date(), 25), addDays(/* @__PURE__ */ new Date(), 26)];
function Home() {
  const {
    t,
    locale,
    setLocale
  } = useI18n();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState("2");
  const [roomType, setRoomType] = useState("standard");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80", children: /* @__PURE__ */ jsxs("nav", { className: "flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "font-[EB_Garamond] text-[24px] leading-[1.3] text-primary font-medium", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-8", children: [
        /* @__PURE__ */ jsx("a", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border-b border-primary pb-0.5", href: "#rooms", children: t("nav.rooms") }),
        /* @__PURE__ */ jsx("a", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors duration-300", href: "#amenities", children: t("nav.amenities") }),
        /* @__PURE__ */ jsx("a", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors duration-300", href: "#reviews", children: t("nav.reviews") }),
        /* @__PURE__ */ jsx("a", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors duration-300", href: "#contact", children: t("nav.contact") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setLocale(locale === "ka" ? "en" : "ka"), className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2.5 py-1.5 rounded-sm", children: locale === "ka" ? "EN" : "ქარ" }),
        /* @__PURE__ */ jsx(Link, { to: "/reservations", className: "bg-primary text-on-primary px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity", children: t("nav.bookNow") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsxs("section", { className: "relative h-[85vh] flex items-center justify-center overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
          /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9QA6hdujx9v5PKnWGRYe9QZHD82dOu2rzlpL-yfp13_NTFUA1Cx8HAQ4MgmKdFyEayOJGAXT6YJUgB54roBl7EW3A67I-BsGG8t4dQioJ7D16Uv9cH3c8PeWlWIuk_dbc_eMHCBTSVnmcEgIqokO9O6bJdpAI562Msej8LrzMfutunkGo96mY5yNdQ0hMkapfrKBP9lYQ8mxosI3S9HzTwFL0BTxxn4evm6ql1yhJvOMRQ7bf59EdU35ZppXeWsIn8rzQS1x-A", alt: "Kai Hotel" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary/30 backdrop-brightness-75" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-6 max-w-3xl", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 block mb-4", children: t("hero.welcome") }),
          /* @__PURE__ */ jsx("h1", { className: "font-[EB_Garamond] text-[32px] md:text-[48px] leading-[1.15] tracking-[-0.01em] text-white mb-4 font-georgian", children: t("hero.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[15px] leading-[1.5] text-white/80 max-w-xl mx-auto mb-8 font-georgian", children: t("hero.subtitle") }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsx("a", { href: "#rooms", className: "bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:bg-white/20 transition-all font-georgian", children: t("hero.exploreRooms") }),
            /* @__PURE__ */ jsx("a", { href: "#amenities", className: "bg-white text-primary px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian", children: t("hero.viewAmenities") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "relative z-20 -mt-12 px-6 max-w-[1080px] mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/30 p-6 md:p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[18px] font-medium text-primary mb-5 font-georgian", children: t("booking.title") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-5 items-end", children: [
          /* @__PURE__ */ jsx(DatePicker, { value: checkIn, onChange: (date) => {
            setCheckIn(date);
            if (checkOut && date >= checkOut) {
              setCheckOut(null);
            }
          }, placeholder: t("booking.selectDate"), locale, icon: "calendar_today", disabledDates: unavailableDates, label: t("booking.checkin"), rangeStart: checkIn, rangeEnd: checkOut }),
          /* @__PURE__ */ jsx(DatePicker, { value: checkOut, onChange: setCheckOut, placeholder: t("booking.selectDate"), locale, icon: "calendar_month", disabledDates: unavailableDates, minDate: checkIn ? addDays(checkIn, 1) : /* @__PURE__ */ new Date(), label: t("booking.checkout"), rangeStart: checkIn, rangeEnd: checkOut }),
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
          /* @__PURE__ */ jsx(CustomSelect, { value: roomType, onChange: setRoomType, icon: "bed", label: t("booking.roomType"), options: [{
            value: "standard",
            label: "Standard"
          }, {
            value: "deluxe",
            label: "Deluxe"
          }, {
            value: "family",
            label: locale === "ka" ? "საოჯახო" : "Family Suite"
          }] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block opacity-0", children: " " }),
            /* @__PURE__ */ jsxs("a", { href: "https://www.booking.com/Share-WUttkr", target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all text-center font-georgian w-full", children: [
              /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[14px]", children: "open_in_new" }),
              t("booking.bookOnBooking")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] text-secondary mt-4 font-georgian", children: t("booking.untilAvailable") })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { id: "rooms", className: "py-20 px-6 max-w-[1280px] mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2 font-georgian", children: t("rooms.label") }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary font-georgian", children: t("rooms.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto font-georgian", children: t("rooms.description") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "group cursor-pointer", children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] overflow-hidden mb-4 relative", children: [
              /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNaQ2CxjWnz-SqNgtseplFra2Yklt2cRdneNh2Zcqdn7QTDTiRrIvURULn-c6VRACpvXxfGIZ6RC874Iqn5LyHDRBjb2sQxPbtXcuhwtEJgawbyUhL5rjh03Lv643X4-vnKWmCO13_NUz23A0aRZ3Gm5J5L76njpViRN6W25QoNjsGEVZ8W7mz1wfyoQndVnz7Lb0EAg3LHVts5IFQdz3VY6Uteu0ATIboZvb4WFmgP5Ksdn8RO6czc4RihFArthaaThRjX1mx6w", alt: "Standard Room" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.05em]", children: t("rooms.viewAll") }) })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1", children: "Standard Room" }),
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary", children: "კომფორტული ნომერი ყველა საჭირო კეთილმოწყობით" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "group cursor-pointer", children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] overflow-hidden mb-4 relative", children: [
              /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdYLOCkbl4imubXOzryG3zZTarGntdjsdo_zIJBMXRQyL_1veF5CnAeOO2xqMsB6h2HIJmOEFAGIkviXG77q5DFO7tw5P4Fi8DynZeTLIUOm8M6Nwaq-safFuZ2gHra-Q45432Kye9ZiawpZV1MEOtxtaV-WKrzzV14Q9rWGICfLKR4ZWvD1YpNhuc8W7WqzLMt5Xc_t9GGc8b0x573ugqlhg-KYLlWxYUXoydOOTAUpugGpE6vlAsr0RLWpIqeC43WEgs5wKKoQ", alt: "Deluxe Room" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.05em]", children: t("rooms.viewAll") }) })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1", children: "Deluxe Room" }),
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary", children: "გაფართოებული ნომერი ტერასით და ბაღის ხედით" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "group cursor-pointer", children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] overflow-hidden mb-4 relative", children: [
              /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXBHloncPNvIKTxdi_NpTFbcW72yA7Kmr4lPP32yovsRnqCmu2XmPehBmHkunI0E5sM4azooCY3hjOTzUOOFZ5M_XSHXfDrSjkyeCQhr53KxQJskol41bUtnFCPShUQ8lzoGLwXehhdj8jHmpPzbrrUPH5nCQJwmjkY6YORD3SLvYziYkjc3MjtG-KxJ439SN9BhDzknY5Ltk-8Dv36MdgjPMdzBPzE3KmQYLn8WfMMrqFr5UJIsz1Bu2N8go_an_uyh43llMMLQ", alt: "Family Suite" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.05em]", children: t("rooms.viewAll") }) })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1", children: "Family Suite" }),
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary", children: "ფართო საოჯახო ნომერი ყველა კომფორტით" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { id: "amenities", className: "py-20 bg-surface-container-low", children: /* @__PURE__ */ jsxs("div", { className: "px-6 max-w-[1280px] mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2 font-georgian", children: t("amenities.label") }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary font-georgian", children: t("amenities.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto font-georgian", children: t("amenities.description") })
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
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold text-primary text-center font-georgian", children: amenity.label })
        ] }, amenity.icon)) })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { id: "reviews", className: "py-20 px-6 max-w-[1280px] mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2 font-georgian", children: t("reviews.label") }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary font-georgian", children: t("reviews.title") }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto font-georgian", children: t("reviews.description") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [{
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
              /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary font-georgian", children: t(review.countryKey) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-[Hanken_Grotesk] text-[13px] leading-[1.6] text-secondary font-georgian", children: [
            '"',
            t(review.textKey),
            '"'
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-0.5 mt-3", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[16px] text-amber-500", style: {
            fontVariationSettings: "'FILL' 1"
          }, children: "star" }, star)) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "py-20 bg-surface-container-low overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "px-6 max-w-[1280px] mx-auto mb-10", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2", children: "გალერეა" }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary", children: "Kai Hotel" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2 px-2 h-[400px]", children: [
          /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz8Bhtu4ra6R2aYKcVUSE8MqOqBX7gJ14ihQGtscSrJnbCYYA6V4Aef4Ho6-smBWkD9QO-MN5BjWyCWbugSNYcdP_W9M-6PB6lT8cAhhhFu8yDobWWxTBJNy6HBsn96xZh7O3AkLKUrFwmsuC7VHLn-9pP4j80WFxsZ1HOCLyD8PbMm3qqzZITqu07gXtVbTHNzkQhllTWe6Dz6ExnBneyfzy3Qj3VEPlcW_rMgf5r8K6mYXHOLI8wOBrAJdpeBq19L5FgkkKXrg", alt: "Kai Hotel interior" }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-rows-2 gap-2 h-full", children: [
            /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqG7x2mzYA0kVVM6pOxKwaONl3S1donLNQGTZWYMRFi_CHOudZgpkZwtcIfOmcIyzZLvHHTakv5MYCG2ZoI6aE-qkpnwdpD2cdgz567SW6mEogsB2GtQKzlKJXfMNRz7cD_FNiVIWgC75f1_FTGUm3LTx1kmvj2TA0hmPkp1cCayNx_fGhfIWufvnlVRk-IIUyAgqV4UnM2_tVnrzghOZULiB4q0CyIKuMM2KVFQA2zCFS0ImStwDrcJeyQv8OM78a1I7UuHuf_Q", alt: "Hotel view" }),
            /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZSOPLDJr4PvQxqQGy6FL2JTOMELhffHKoiOreRMhkag9QwcjjnQSIPal3GIo6WyB6uzsrRSUuMRdc_cYp29_FCjY_t0eSX8Y4ae1i2m50YWumCfwf8OQgO5k_7NMZAhMCnXREnvDN1LHJ3ldbnbDsjVtv9Wp-PdbfUjHxTXFkYjv4gWvdV9UTjf0eapNyDZlSyx1ol2nsG2N1dxh0ZoyJ6tIJoFlzTVgpClhebz8OR9sClL2cEMA709098Q1LZh1wS9O9DzNEsw", alt: "Hotel exterior" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnDfcr8nrtI5WpGUgBk5-08vv-qJdP7tXPphJ7K1HcnMdhJpAIM21Hyy3fzpfWaBlPSZ-slyE5YwuEPZKIEqqHwTI5vjHJn5iOxqSe8TFA1zlRM5tjBEiT6l0ujim-dQS19QzXTWVk9fxx5fhcoAH1wCPnmAwIl0xdaMk9W9RrZTbwH90ymEW8lhQUlnogYFhTbIix8kZ06Ieal15zTOIM1oyQBac5FgaJTvdd7eUiClXtwb--YcU5cHT9LXr29eer4_FPsDDwwg", alt: "Surroundings" }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-rows-2 gap-2 h-full", children: [
            /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEFdd1t5xWL4nQ5c0IBQ8-AWu4ob11nO7V2N3V9QoEOaSJG2cGEnzAXZzr61KhkpXvi81FEgO1yQO5K3cahlyGztY3sg9jEPHyK6M1mQbGWgs2xh80AIcTBEKCYWTJg2cqwTKbtFZGnu4ZSkKDIywJ_bjGAgqdJLAQpcXNnwPEH6cSioL6SeALV29f3fEBFkKVIY5CssgIq8LlVpfQpnddlaAzgzRMv-Z3PpQsMUNlUyIX34MuF_9uXwwV1dq4N9KbOg90MJUBg", alt: "Restaurant" }),
            /* @__PURE__ */ jsx("img", { className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuABgVywaGP5P1KvCNVhlBSrFozsUMCnsLD16wE9BsKWlFTYmQ7wfpifdJMFR7oHKZheO9nWljPpyqYtLdJva95vVRKnBZkw_IY-LnDFjkn_n3zmukacg1sfrTiDg3tLXDiOqI3sVHzYDNF8jeLUxHWLxebFIweKHTgMXPRVIvHHuAxP2m9JFWfx3rMpb8qkC22rAufuGui7IP0UhI5lsRJDfbB6LYkO5ESRxL4ck2qdmPi2z2ZL5rQ6UShbOEmbeY_mWE7M4m2vNw", alt: "Garden" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "py-14 px-6 max-w-[1280px] mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "text-center mb-8", children: /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[20px] text-primary font-georgian", children: t("footer.partners") }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-10 flex-wrap", children: [
          /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com/people/Chalet-Kazbegi/100057144592308/", target: "_blank", rel: "noopener noreferrer", className: "font-[Hanken_Grotesk] text-[13px] text-secondary hover:text-primary transition-colors border border-outline-variant px-4 py-2", children: "Chalet Kazbegi" }),
          /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com/BabaneurisMarani/", target: "_blank", rel: "noopener noreferrer", className: "font-[Hanken_Grotesk] text-[13px] text-secondary hover:text-primary transition-colors border border-outline-variant px-4 py-2", children: "ბაბანეურის მარანი" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { id: "contact", className: "w-full py-12 border-t border-outline-variant/20 bg-surface-container-lowest", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 px-6 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "font-[EB_Garamond] text-[20px] font-medium text-primary", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-secondary", children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[16px]", children: "call" }),
        /* @__PURE__ */ jsx("a", { href: "tel:+995511222028", className: "font-[Hanken_Grotesk] text-[13px] hover:text-primary transition-colors", children: t("footer.phone") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx("a", { className: "text-secondary hover:text-primary transition-colors", href: "https://www.facebook.com", target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[20px]", children: "public" }) }),
        /* @__PURE__ */ jsx("a", { className: "text-secondary hover:text-primary transition-colors", href: "mailto:info@kai.com.ge", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[20px]", children: "mail" }) }),
        /* @__PURE__ */ jsx("a", { className: "text-secondary hover:text-primary transition-colors", href: "tel:+995511222028", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[20px]", children: "call" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] text-secondary/60 font-georgian", children: t("footer.copyright") })
    ] }) })
  ] });
}
export {
  Home as component
};

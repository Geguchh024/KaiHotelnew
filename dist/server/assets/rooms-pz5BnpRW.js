import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { a as api } from "./api-B4qLQuEf.js";
import { u as useI18n } from "./router-BPQh_9EZ.js";
import { B as BlurhashImage } from "./BlurhashImage-CfDtp30u.js";
import { N as Navbar, F as Footer } from "./Footer-B-hn7Oto.js";
import "convex/server";
import "zod";
import "blurhash";
function RoomModal({
  room,
  onClose,
  locale
}) {
  return createPortal(/* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50", onClick: onClose, "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-surface-container-lowest border border-outline-variant/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "aspect-[16/9] overflow-hidden relative", children: [
        /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: room.imageUrl, alt: locale === "ka" ? room.nameKa : room.nameEn, blurhash: room.blurhash }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white transition-colors p-1.5", "aria-label": "Close", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[20px]", children: "close" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 mb-5", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[28px] leading-[1.2] text-primary", children: locale === "ka" ? room.nameKa : room.nameEn }),
          /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-[Hanken_Grotesk] text-[15px] font-semibold text-primary", children: [
              "$",
              room.pricePerNight
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary", children: locale === "ka" ? "/ ღამე" : "/ night" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] leading-[1.7] text-secondary mb-6", children: locale === "ka" ? room.descriptionKa : room.descriptionEn }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-6 pb-6 border-b border-outline-variant/20 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-secondary", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[18px]", children: "person" }),
          /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[13px]", children: [
            room.capacity,
            " ",
            locale === "ka" ? "სტუმარი" : "guests"
          ] })
        ] }) }),
        room.amenities.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-3", children: locale === "ka" ? "სერვისები" : "Amenities" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: room.amenities.map((amenity) => /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[12px] text-on-surface border border-outline-variant/40 px-3 py-1.5", children: amenity }, amenity)) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 flex-wrap", children: /* @__PURE__ */ jsx(Link, { to: "/reservations", className: "bg-primary text-on-primary px-8 py-2.5 font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity", onClick: onClose, children: locale === "ka" ? "დაჯავშნე" : "Book Now" }) })
      ] })
    ] })
  ] }), document.body);
}
function RoomsPage() {
  const {
    t,
    locale
  } = useI18n();
  const rooms = useQuery(api.rooms.list) ?? [];
  const [selectedRoom, setSelectedRoom] = useState(null);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsxs("section", { className: "pt-32 pb-10 px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20", children: [
        /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-3", children: t("rooms.label") }),
        /* @__PURE__ */ jsx("h1", { className: "font-[EB_Garamond] text-[40px] md:text-[52px] leading-[1.1] text-primary", children: locale === "ka" ? "ჩვენი ნომრები" : "The Suite Collection" })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-10 px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20", children: /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[15px] leading-[1.7] text-secondary max-w-2xl", children: t("rooms.description") }) }),
      /* @__PURE__ */ jsx("section", { className: "py-16 px-8 max-w-[1280px] mx-auto", children: rooms.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: rooms.map((room) => /* @__PURE__ */ jsxs("div", { className: "group cursor-pointer", onClick: () => setSelectedRoom(room), children: [
        /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] overflow-hidden mb-5 relative", children: [
          /* @__PURE__ */ jsx(BlurhashImage, { className: "w-full h-full", src: room.imageUrl, alt: locale === "ka" ? room.nameKa : room.nameEn, blurhash: room.blurhash }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-end p-5", children: /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: locale === "ka" ? "დეტალების ნახვა" : "View Details" }) })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[20px] leading-[1.3] text-primary mb-1.5", children: locale === "ka" ? room.nameKa : room.nameEn }),
        /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] leading-[1.6] text-secondary mb-4 line-clamp-2", children: locale === "ka" ? room.descriptionKa : room.descriptionEn }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-t border-outline-variant/30 pt-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[13px] font-semibold text-primary", children: [
            "$",
            room.pricePerNight,
            /* @__PURE__ */ jsxs("span", { className: "font-normal text-secondary ml-1", children: [
              "/ ",
              locale === "ka" ? "ღამე" : "night"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-secondary", children: [
            /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[15px]", children: "person" }),
            /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[12px]", children: room.capacity })
          ] })
        ] })
      ] }, room._id)) }) : /* @__PURE__ */ jsxs("div", { className: "py-24 text-center border border-outline-variant/20 bg-surface-container-low", children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[40px] text-secondary/30 block mb-5", children: "bed" }),
        /* @__PURE__ */ jsx("p", { className: "font-[EB_Garamond] text-[22px] text-primary mb-2", children: locale === "ka" ? "ნომრები მალე დაემატება" : "Rooms Coming Soon" }),
        /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] text-secondary max-w-xs mx-auto", children: locale === "ka" ? "ჩვენ ვმუშაობთ ნომრების დამატებაზე. მალე დაბრუნდით." : "We are working on adding our rooms. Check back soon." })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-14 bg-surface-container-low border-y border-outline-variant/20", children: /* @__PURE__ */ jsx("div", { className: "px-8 max-w-[1280px] mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-56 shrink-0", children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2", children: t("amenities.label") }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[26px] leading-[1.2] text-primary", children: t("amenities.title") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4", children: [{
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
        }].map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[18px]", children: a.icon }),
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[12px] text-on-surface", children: a.label })
        ] }, a.icon)) })
      ] }) }) }),
      /* @__PURE__ */ jsxs("section", { className: "py-20 px-8 max-w-[1280px] mx-auto text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-4", children: locale === "ka" ? "დაჯავშნეთ" : "Reserve" }),
        /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[32px] md:text-[40px] text-primary mb-6", children: locale === "ka" ? "მოამზადეთ თქვენი ვიზიტი" : "Plan Your Stay" }),
        /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] text-secondary max-w-md mx-auto mb-8", children: locale === "ka" ? "დაჯავშნეთ ნომერი პირდაპირ ჩვენს საიტზე საუკეთესო ფასად." : "Book directly with us for the best rate." }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-4 flex-wrap", children: /* @__PURE__ */ jsx(Link, { to: "/reservations", className: "bg-primary text-on-primary px-10 py-3 font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity", children: t("nav.bookNow") }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    selectedRoom && /* @__PURE__ */ jsx(RoomModal, { room: selectedRoom, onClose: () => setSelectedRoom(null), locale })
  ] });
}
export {
  RoomsPage as component
};

import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as api } from "./api-B4qLQuEf.mjs";
import { d as Route, u as useI18n } from "./router-cXXbqms1.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { u as useQuery } from "../_libs/convex.mjs";
import { f as format, k as ka, e as enUS } from "../_libs/date-fns.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function ConfirmationPage() {
  const {
    referenceCode
  } = Route.useParams();
  const {
    t,
    locale
  } = useI18n();
  const dateLocale = locale === "ka" ? ka : enUS;
  const reservation = useQuery(api.reservations.getByReferenceCode, {
    referenceCode
  });
  const rooms = useQuery(api.rooms.list);
  if (reservation === void 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-primary text-[32px] animate-spin", children: "progress_activity" }) });
  }
  if (reservation === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex justify-between items-center px-4 sm:px-6 py-4 max-w-[1280px] mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-[EB_Garamond] text-[20px] sm:text-[24px] leading-[1.3] text-primary font-medium hover:opacity-80 transition-opacity", children: "Kai Hotel Bar" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "pt-[72px] min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-14 px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-error text-[28px]", children: "search_off" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[EB_Garamond] text-[22px] text-primary mb-2 font-georgian", children: locale === "ka" ? "რეზერვაცია ვერ მოიძებნა" : "Reservation not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] text-secondary mb-6 font-georgian", children: locale === "ka" ? "მითითებული კოდით რეზერვაცია არ არსებობს." : "No reservation exists with the provided reference code." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 px-5 py-2 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[13px]", children: "home" }),
          t("res.backToHome")
        ] })
      ] }) })
    ] });
  }
  const room = rooms?.find((r) => r._id === reservation.roomId);
  const roomName = room ? locale === "ka" ? room.nameKa : room.nameEn : locale === "ka" ? "ნომერი" : "Room";
  const MS_PER_DAY = 864e5;
  const nights = Math.round((reservation.checkOutDate - reservation.checkInDate) / MS_PER_DAY);
  const checkInDate = new Date(reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOutDate);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex justify-between items-center px-4 sm:px-6 py-4 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-[EB_Garamond] text-[20px] sm:text-[24px] leading-[1.3] text-primary font-medium hover:opacity-80 transition-opacity", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors", children: t("res.backToHome") })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "pt-[72px] min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary py-8 sm:py-10 px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1080px] mx-auto text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 sm:w-14 h-12 sm:h-14 bg-on-primary/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-on-primary text-[24px] sm:text-[28px]", style: {
          fontVariationSettings: "'FILL' 1"
        }, children: "check_circle" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[EB_Garamond] text-[22px] sm:text-[26px] md:text-[34px] leading-[1.2] text-on-primary mb-2 font-georgian", children: t("res.success") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] leading-[1.5] text-on-primary/70 max-w-lg mx-auto font-georgian", children: t("res.successDesc") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/20 p-4 sm:p-5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-1 font-georgian", children: locale === "ka" ? "საცნობარო კოდი" : "Reference Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[22px] sm:text-[28px] font-bold text-primary tracking-[0.1em]", children: reservation.referenceCode })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface-container-lowest border border-outline-variant/20 p-4 sm:p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian", children: t("res.roomDetails") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: locale === "ka" ? "ნომერი" : "Room" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: roomName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: t("booking.checkin") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: format(checkInDate, "dd MMM yyyy", {
                  locale: dateLocale
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: t("booking.checkout") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: format(checkOutDate, "dd MMM yyyy", {
                  locale: dateLocale
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: t("res.nights") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: nights })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-outline-variant/20 pt-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold font-georgian", children: t("res.total") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold text-[14px]", children: [
                  "₾",
                  Math.round(reservation.totalPrice)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian", children: t("res.guestDetails") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: locale === "ka" ? "სრული სახელი" : "Full Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: reservation.guestFullName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: t("res.email") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: reservation.guestEmail })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: t("res.phone") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: reservation.guestPhone })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian", children: t("booking.guests") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: reservation.guestCount })
              ] }),
              reservation.specialRequests && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-outline-variant/20 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-georgian block mb-0.5", children: t("res.specialRequests") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-[10px]", children: reservation.specialRequests })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/20 p-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary font-georgian", children: locale === "ka" ? "სტატუსი" : "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: reservation.status, locale })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-container-low border border-outline-variant/20 p-4 flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-primary text-[18px] mt-0.5", children: "info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold text-primary font-georgian", children: t("res.payAtHotel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary mt-0.5 font-georgian", children: t("res.payAtHotelDesc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 px-5 py-2 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[13px]", children: "home" }),
          t("res.backToHome")
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "w-full py-6 border-t border-outline-variant/20 bg-surface-container-lowest", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 px-4 sm:px-6 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[EB_Garamond] text-[16px] font-medium text-primary", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-secondary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[13px]", children: "call" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+995511222028", className: "font-[Hanken_Grotesk] text-[11px] hover:text-primary transition-colors", children: t("footer.phone") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[10px] text-secondary/60 font-georgian", children: t("footer.copyright") })
    ] }) })
  ] });
}
function StatusPill({
  status,
  locale
}) {
  const labels = {
    pending: {
      ka: "მოლოდინში",
      en: "Pending"
    },
    confirmed: {
      ka: "დადასტურებული",
      en: "Confirmed"
    },
    checkedIn: {
      ka: "შესული",
      en: "Checked In"
    },
    checkedOut: {
      ka: "გასული",
      en: "Checked Out"
    },
    cancelled: {
      ka: "გაუქმებული",
      en: "Cancelled"
    },
    noShow: {
      ka: "არ გამოცხადდა",
      en: "No Show"
    }
  };
  const colors = {
    pending: "bg-surface-container-high text-on-surface-variant",
    confirmed: "bg-primary/10 text-primary",
    checkedIn: "bg-primary/10 text-primary",
    checkedOut: "bg-green-100 text-green-800",
    cancelled: "bg-error/10 text-error",
    noShow: "bg-amber-100 text-amber-800"
  };
  const label = labels[status]?.[locale] ?? status;
  const color = colors[status] ?? "bg-surface-container-high text-on-surface-variant";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.03em] px-2.5 py-1 rounded-sm", color), children: label });
}
export {
  ConfirmationPage as component
};

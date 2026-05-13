import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useMatches, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { a as api } from "./api-B4qLQuEf.js";
import { u as useI18n, R as Route } from "./router-BPQh_9EZ.js";
import { D as DatePicker, C as CustomSelect } from "./custom-select-BPjJfbMk.js";
import { B as BlurhashImage } from "./BlurhashImage-CfDtp30u.js";
import { addDays, differenceInDays, format } from "date-fns";
import { ka, enUS } from "date-fns/locale";
import { c as cn } from "./utils-H80jjgLf.js";
import "convex/server";
import "zod";
import "blurhash";
import "clsx";
import "tailwind-merge";
function ReservationsLayout() {
  const matches = useMatches();
  const hasChildRoute = matches.some((m) => m.id.includes("/confirmation/"));
  if (hasChildRoute) {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsx(Reservations, {});
}
function toUtcMidnight(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}
function Reservations() {
  const {
    t,
    locale,
    setLocale
  } = useI18n();
  const navigate = useNavigate();
  const dateLocale = locale === "ka" ? ka : enUS;
  const search = Route.useSearch();
  const initialCheckIn = search.checkIn ? new Date(search.checkIn) : null;
  const initialCheckOut = search.checkOut ? new Date(search.checkOut) : null;
  const initialGuests = search.guests || "2";
  const rooms = useQuery(api.rooms.list);
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const today = /* @__PURE__ */ new Date();
  const fromDate = toUtcMidnight(today);
  const throughDate = toUtcMidnight(addDays(today, 90));
  const nightCount = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const guestCount = parseInt(guests, 10);
  const selectedRoomsData = rooms?.filter((r) => selectedRooms.includes(r._id)) ?? [];
  const totalCapacity = selectedRoomsData.reduce((sum, r) => sum + r.capacity, 0);
  const totalPrice = selectedRoomsData.reduce((sum, r) => sum + r.pricePerNight * nightCount, 0);
  const capacityMet = totalCapacity >= guestCount;
  const canProceedStep1 = checkIn && checkOut && selectedRooms.length > 0 && nightCount > 0 && capacityMet;
  const canProceedStep2 = fullName && email && phone;
  const toggleRoom = (roomId) => {
    setSelectedRooms((prev) => prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]);
  };
  const removeRoom = (roomId) => {
    setSelectedRooms((prev) => prev.filter((id) => id !== roomId));
  };
  const createReservation = useMutation(api.reservations.create);
  const handleConfirm = async () => {
    if (selectedRooms.length === 0 || !checkIn || !checkOut) return;
    setError(null);
    setSubmitting(true);
    try {
      let lastReferenceCode = "";
      let remainingGuests = guestCount;
      for (let i = 0; i < selectedRooms.length; i++) {
        const roomId = selectedRooms[i];
        const roomData = rooms?.find((r) => r._id === roomId);
        const roomGuestCount = i < selectedRooms.length - 1 ? Math.min(remainingGuests, roomData?.capacity ?? remainingGuests) : remainingGuests;
        remainingGuests -= roomGuestCount;
        const result = await createReservation({
          roomId,
          guestFullName: fullName.trim(),
          guestEmail: email.trim(),
          guestPhone: phone.trim(),
          guestCount: Math.max(1, roomGuestCount),
          checkInDate: toUtcMidnight(checkIn),
          checkOutDate: toUtcMidnight(checkOut),
          specialRequests: specialRequests.trim() || void 0
        });
        lastReferenceCode = result.referenceCode;
      }
      void navigate({
        to: "/reservations/confirmation/$referenceCode",
        params: {
          referenceCode: lastReferenceCode
        }
      });
    } catch (err) {
      if (err instanceof ConvexError) {
        setError(err.data);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80", children: /* @__PURE__ */ jsxs("nav", { className: "flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-[EB_Garamond] text-[24px] leading-[1.3] text-primary font-medium hover:opacity-80 transition-opacity", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setLocale(locale === "ka" ? "en" : "ka"), className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2.5 py-1.5 rounded-sm", children: locale === "ka" ? "EN" : "ქარ" }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors", children: t("res.backToHome") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "pt-[72px] min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-primary py-10 px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1080px] mx-auto text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-[EB_Garamond] text-[26px] md:text-[34px] leading-[1.2] text-on-primary mb-2 font-georgian", children: t("res.title") }),
        /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] leading-[1.5] text-on-primary/70 max-w-lg mx-auto font-georgian", children: t("res.subtitle") })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "border-b border-outline-variant/30 bg-surface-container-lowest", children: /* @__PURE__ */ jsx("div", { className: "max-w-[1080px] mx-auto px-6 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2 md:gap-6", children: [{
        num: 1,
        label: t("res.step1")
      }, {
        num: 2,
        label: t("res.step2")
      }, {
        num: 3,
        label: t("res.step3")
      }].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3", children: [
        i > 0 && /* @__PURE__ */ jsx("div", { className: "w-6 md:w-10 h-px bg-outline-variant/50" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors", step >= s.num ? "bg-primary text-on-primary" : "bg-surface-container-high text-secondary"), children: step > s.num ? /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "check" }) : s.num }),
          /* @__PURE__ */ jsx("span", { className: cn("font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.03em] hidden md:block font-georgian", step >= s.num ? "text-primary" : "text-secondary"), children: s.label })
        ] })
      ] }, s.num)) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-[1080px] mx-auto px-6 py-8", children: [
        step === 1 && /* @__PURE__ */ jsx(Step1, { rooms, checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests, selectedRooms, toggleRoom, removeRoom, nightCount, totalPrice, totalCapacity, guestCount, capacityMet, canProceedStep1: !!canProceedStep1, setStep, locale, t, fromDate, throughDate }),
        step === 2 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/20 p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[16px] font-medium text-primary mb-5 font-georgian", children: t("res.guestInfo") }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian", children: [
                  locale === "ka" ? "სრული სახელი" : "Full Name",
                  " *"
                ] }),
                /* @__PURE__ */ jsx("input", { type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("label", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian", children: [
                  t("res.email"),
                  " *"
                ] }),
                /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("label", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian", children: [
                  t("res.phone"),
                  " *"
                ] }),
                /* @__PURE__ */ jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+995 5XX XXX XXX", className: "w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors placeholder:text-outline" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
                /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian", children: t("res.specialRequests") }),
                /* @__PURE__ */ jsx("textarea", { value: specialRequests, onChange: (e) => setSpecialRequests(e.target.value), placeholder: t("res.specialRequestsPlaceholder"), rows: 2, className: "w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors resize-none placeholder:text-outline" })
              ] })
            ] })
          ] }),
          selectedRoomsData.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low border border-outline-variant/20 p-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-2 font-georgian", children: t("res.summary") }),
            selectedRoomsData.map((room) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 last:mb-0", children: [
              /* @__PURE__ */ jsx(BlurhashImage, { src: room.imageUrl, alt: locale === "ka" ? room.nameKa : room.nameEn, blurhash: room.blurhash, className: "w-12 h-12" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold text-primary", children: locale === "ka" ? room.nameKa : room.nameEn }),
                /* @__PURE__ */ jsxs("p", { className: "font-[Hanken_Grotesk] text-[10px] text-secondary", children: [
                  checkIn && format(checkIn, "d MMM", {
                    locale: dateLocale
                  }),
                  " — ",
                  checkOut && format(checkOut, "d MMM", {
                    locale: dateLocale
                  }),
                  " · ",
                  nightCount,
                  " ",
                  t("res.nights")
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[14px] font-bold text-primary", children: [
                "₾",
                room.pricePerNight * nightCount
              ] })
            ] }, room._id)),
            selectedRoomsData.length > 1 && /* @__PURE__ */ jsxs("div", { className: "border-t border-outline-variant/20 mt-2 pt-2 flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold text-primary font-georgian", children: t("res.total") }),
              /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[14px] font-bold text-primary", children: [
                "₾",
                totalPrice
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-outline-variant/20", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => setStep(1), className: "flex items-center gap-1.5 px-4 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant font-georgian", children: [
              /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[13px]", children: "arrow_back" }),
              t("res.back")
            ] }),
            /* @__PURE__ */ jsxs("button", { disabled: !canProceedStep2, onClick: () => setStep(3), className: cn("flex items-center gap-2 px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] transition-all font-georgian", canProceedStep2 ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-high text-secondary cursor-not-allowed"), children: [
              t("res.next"),
              /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[13px]", children: "arrow_forward" })
            ] })
          ] })
        ] }),
        step === 3 && selectedRoomsData.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/20 p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[16px] font-medium text-primary mb-5 font-georgian", children: t("res.summary") }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian", children: t("res.roomDetails") }),
                selectedRoomsData.map((room) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-3", children: [
                  /* @__PURE__ */ jsx(BlurhashImage, { src: room.imageUrl, alt: locale === "ka" ? room.nameKa : room.nameEn, blurhash: room.blurhash, className: "w-20 h-16" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-[EB_Garamond] text-[14px] font-medium text-primary", children: locale === "ka" ? room.nameKa : room.nameEn }),
                    /* @__PURE__ */ jsxs("p", { className: "font-[Hanken_Grotesk] text-[10px] text-secondary mt-0.5", children: [
                      t("res.capacity"),
                      ": ",
                      room.capacity,
                      " · ₾",
                      room.pricePerNight * nightCount
                    ] })
                  ] })
                ] }, room._id)),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-[11px]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian", children: t("booking.checkin") }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: checkIn && format(checkIn, "dd MMM yyyy", {
                      locale: dateLocale
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian", children: t("booking.checkout") }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: checkOut && format(checkOut, "dd MMM yyyy", {
                      locale: dateLocale
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian", children: t("res.nights") }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: nightCount })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian", children: t("booking.guests") }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: guests })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-outline-variant/20 pt-1.5 mt-1.5", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold font-georgian", children: t("res.total") }),
                    /* @__PURE__ */ jsxs("span", { className: "text-primary font-bold text-[14px]", children: [
                      "₾",
                      totalPrice
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian", children: t("res.guestDetails") }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-[11px]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian", children: locale === "ka" ? "სრული სახელი" : "Full Name" }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: fullName })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian", children: t("res.email") }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: email })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian", children: t("res.phone") }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: phone })
                  ] }),
                  specialRequests && /* @__PURE__ */ jsxs("div", { className: "pt-1.5 border-t border-outline-variant/20 mt-1.5", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-secondary font-georgian block mb-0.5", children: t("res.specialRequests") }),
                    /* @__PURE__ */ jsx("span", { className: "text-primary text-[10px]", children: specialRequests })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low border border-outline-variant/20 p-4 flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[18px] mt-0.5", children: "info" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold text-primary font-georgian", children: t("res.payAtHotel") }),
              /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary mt-0.5 font-georgian", children: t("res.payAtHotelDesc") })
            ] })
          ] }),
          error && /* @__PURE__ */ jsxs("div", { className: "bg-error/10 border border-error/30 p-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-error text-[16px]", children: "error" }),
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[12px] text-error", children: error })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-outline-variant/20", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => setStep(2), className: "flex items-center gap-1.5 px-4 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant font-georgian", children: [
              /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[13px]", children: "arrow_back" }),
              t("res.back")
            ] }),
            /* @__PURE__ */ jsxs("button", { disabled: submitting, onClick: handleConfirm, className: cn("flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian", submitting && "opacity-60 cursor-not-allowed"), children: [
              /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[13px]", children: "lock" }),
              submitting ? locale === "ka" ? "იგზავნება..." : "Submitting..." : t("res.confirm")
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "w-full py-6 border-t border-outline-variant/20 bg-surface-container-lowest", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 px-6 max-w-[1280px] mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "font-[EB_Garamond] text-[16px] font-medium text-primary", children: "Kai Hotel Bar" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-secondary", children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[13px]", children: "call" }),
        /* @__PURE__ */ jsx("a", { href: "tel:+995511222028", className: "font-[Hanken_Grotesk] text-[11px] hover:text-primary transition-colors", children: t("footer.phone") })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[10px] text-secondary/60 font-georgian", children: t("footer.copyright") })
    ] }) })
  ] });
}
function Step1({
  rooms,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  selectedRooms,
  toggleRoom,
  removeRoom,
  nightCount,
  totalPrice,
  totalCapacity,
  guestCount,
  capacityMet,
  canProceedStep1,
  setStep,
  locale,
  t,
  fromDate,
  throughDate
}) {
  const room0 = selectedRooms[0] ?? null;
  const room1 = selectedRooms[1] ?? null;
  const room2 = selectedRooms[2] ?? null;
  const room3 = selectedRooms[3] ?? null;
  const blocked0 = useQuery(api.reservations.getBlockedDatesForRoom, room0 ? {
    roomId: room0,
    fromDate,
    throughDate
  } : "skip");
  const blocked1 = useQuery(api.reservations.getBlockedDatesForRoom, room1 ? {
    roomId: room1,
    fromDate,
    throughDate
  } : "skip");
  const blocked2 = useQuery(api.reservations.getBlockedDatesForRoom, room2 ? {
    roomId: room2,
    fromDate,
    throughDate
  } : "skip");
  const blocked3 = useQuery(api.reservations.getBlockedDatesForRoom, room3 ? {
    roomId: room3,
    fromDate,
    throughDate
  } : "skip");
  const disabledDates = (() => {
    if (selectedRooms.length === 0) return [];
    const allBlocked = [blocked0, blocked1, blocked2, blocked3].slice(0, selectedRooms.length);
    if (allBlocked.some((b) => b === void 0)) return [];
    const union = /* @__PURE__ */ new Set();
    for (const dates of allBlocked) {
      for (const ts of dates ?? []) {
        union.add(ts);
      }
    }
    return Array.from(union).map((ts) => new Date(ts));
  })();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/20 p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[16px] font-medium text-primary mb-4 font-georgian", children: t("res.dates") }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsx(DatePicker, { value: checkIn, onChange: (date) => {
          setCheckIn(date);
          if (checkOut && date >= checkOut) setCheckOut(null);
        }, placeholder: t("booking.selectDate"), locale, icon: "calendar_today", label: t("booking.checkin"), minDate: /* @__PURE__ */ new Date(), disabledDates, rangeStart: checkIn, rangeEnd: checkOut }),
        /* @__PURE__ */ jsx(DatePicker, { value: checkOut, onChange: setCheckOut, placeholder: t("booking.selectDate"), locale, icon: "calendar_month", minDate: checkIn ? addDays(checkIn, 1) : /* @__PURE__ */ new Date(), disabledDates, label: t("booking.checkout"), rangeStart: checkIn, rangeEnd: checkOut }),
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
          label: locale === "ka" ? "5 სტუმარი" : "5 Guests"
        }, {
          value: "6",
          label: locale === "ka" ? "6 სტუმარი" : "6 Guests"
        }, {
          value: "7",
          label: locale === "ka" ? "7 სტუმარი" : "7 Guests"
        }, {
          value: "8",
          label: locale === "ka" ? "8 სტუმარი" : "8 Guests"
        }, {
          value: "9",
          label: locale === "ka" ? "9 სტუმარი" : "9 Guests"
        }, {
          value: "10",
          label: locale === "ka" ? "10+ სტუმარი" : "10+ Guests"
        }] })
      ] }),
      nightCount > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[14px]", children: "dark_mode" }),
        /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold", children: [
          nightCount,
          " ",
          t("res.nights")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[16px] font-medium text-primary mb-4 font-georgian", children: t("res.selectRoom") }),
      !rooms ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[24px] animate-spin", children: "progress_activity" }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: rooms.map((room) => /* @__PURE__ */ jsx(RoomCard, { room, selectedRooms, toggleRoom, removeRoom, checkIn, checkOut, locale, t, fromDate, throughDate }, room._id)) })
    ] }),
    selectedRooms.length > 0 && /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-2 p-3 border rounded-sm", capacityMet ? "border-primary/30 bg-primary/5" : "border-amber-300 bg-amber-50"), children: [
      /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[16px]", style: {
        color: capacityMet ? "var(--color-primary)" : "#d97706"
      }, children: capacityMet ? "check_circle" : "warning" }),
      /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[11px] font-georgian", style: {
        color: capacityMet ? "var(--color-primary)" : "#d97706"
      }, children: [
        locale === "ka" ? `არჩეული ტევადობა: ${totalCapacity} / საჭირო: ${guestCount} სტუმარი` : `Selected capacity: ${totalCapacity} / Need: ${guestCount} guests`,
        !capacityMet && (locale === "ka" ? " — აირჩიეთ მეტი ნომერი" : " — select more rooms")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-outline-variant/20", children: [
      /* @__PURE__ */ jsx("div", { children: selectedRooms.length > 0 && nightCount > 0 && /* @__PURE__ */ jsxs("div", { className: "font-[Hanken_Grotesk] text-[12px] text-secondary font-georgian", children: [
        t("res.total"),
        ": ",
        /* @__PURE__ */ jsxs("span", { className: "text-primary font-bold text-[15px]", children: [
          "₾",
          totalPrice
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] ml-1", children: [
          "(",
          nightCount,
          " ",
          t("res.nights"),
          " · ",
          selectedRooms.length,
          " ",
          locale === "ka" ? "ნომერი" : selectedRooms.length === 1 ? "room" : "rooms",
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("button", { disabled: !canProceedStep1, onClick: () => setStep(2), className: cn("flex items-center gap-2 px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] transition-all font-georgian", canProceedStep1 ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-high text-secondary cursor-not-allowed"), children: [
        t("res.next"),
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[13px]", children: "arrow_forward" })
      ] })
    ] })
  ] });
}
function RoomCard({
  room,
  selectedRooms,
  toggleRoom,
  removeRoom,
  checkIn,
  checkOut,
  locale,
  t,
  fromDate,
  throughDate
}) {
  const blockedDates = useQuery(api.reservations.getBlockedDatesForRoom, {
    roomId: room._id,
    fromDate,
    throughDate
  });
  const isUnavailable = (() => {
    if (!checkIn || !checkOut || !blockedDates) return false;
    const ciMs = toUtcMidnight(checkIn);
    const coMs = toUtcMidnight(checkOut);
    return blockedDates.some((d) => d >= ciMs && d < coMs);
  })();
  const isSelected = selectedRooms.includes(room._id);
  useEffect(() => {
    if (isSelected && isUnavailable) {
      removeRoom(room._id);
    }
  }, [isSelected, isUnavailable, removeRoom, room._id]);
  const roomName = locale === "ka" ? room.nameKa : room.nameEn;
  const roomDesc = locale === "ka" ? room.descriptionKa : room.descriptionEn;
  return /* @__PURE__ */ jsx("div", { onClick: () => !isUnavailable && toggleRoom(room._id), className: cn("border bg-surface-container-lowest overflow-hidden transition-all cursor-pointer", isSelected ? "border-primary ring-1 ring-primary/20" : "border-outline-variant/20 hover:border-outline-variant/50", isUnavailable && "opacity-50 cursor-not-allowed"), children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row", children: [
    /* @__PURE__ */ jsxs("div", { className: "sm:w-[160px] h-[120px] sm:h-auto flex-shrink-0 overflow-hidden relative", children: [
      /* @__PURE__ */ jsx(BlurhashImage, { src: room.imageUrl, alt: roomName, blurhash: room.blurhash, className: "w-full h-full" }),
      isUnavailable && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/60 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] font-semibold uppercase text-error font-georgian", children: t("res.unavailable") }) }),
      isSelected && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-on-primary text-[12px]", children: "check" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-1.5", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-[EB_Garamond] text-[15px] font-medium text-primary", children: roomName }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[14px] font-bold text-primary", children: [
            "₾",
            room.pricePerNight
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[9px] text-secondary block", children: t("res.perNight") })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] leading-[1.5] text-secondary mb-2.5 font-georgian", children: roomDesc }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 text-[10px] text-on-surface-variant mb-2", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "person" }),
        room.capacity
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
        room.amenities.slice(0, 4).map((a) => /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[9px] bg-surface-container px-1.5 py-0.5 text-secondary", children: a }, a)),
        room.amenities.length > 4 && /* @__PURE__ */ jsxs("span", { className: "font-[Hanken_Grotesk] text-[9px] text-primary font-semibold px-1 py-0.5", children: [
          "+",
          room.amenities.length - 4
        ] })
      ] })
    ] })
  ] }) });
}
export {
  ReservationsLayout as component
};

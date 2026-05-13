import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, addDays, subMonths, format, addMonths, isSameDay, isSameMonth, isBefore, isAfter } from "date-fns";
import { ka, enUS } from "date-fns/locale";
import { c as cn } from "./utils-H80jjgLf.js";
function Calendar({
  selected,
  onSelect,
  locale = "ka",
  disabledDates = [],
  minDate,
  rangeStart,
  rangeEnd
}) {
  const [currentMonth, setCurrentMonth] = useState(selected || /* @__PURE__ */ new Date());
  const dateLocale = locale === "ka" ? ka : enUS;
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const today = startOfDay(/* @__PURE__ */ new Date());
  const days = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }
  const weekDays = locale === "ka" ? ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const isDisabled = (date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (isBefore(date, today)) return true;
    return disabledDates.some((d) => isSameDay(d, date));
  };
  const isInRange = (date) => {
    if (!rangeStart || !rangeEnd) return false;
    return isAfter(date, rangeStart) && isBefore(date, rangeEnd);
  };
  const isCancelled = (date) => {
    return disabledDates.some((d) => isSameDay(d, date));
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-[280px] bg-surface-container-lowest border border-outline-variant/30 shadow-lg p-4 select-none", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setCurrentMonth(subMonths(currentMonth, 1)),
          className: "w-7 h-7 flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container rounded-sm transition-colors",
          children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[16px]", children: "chevron_left" })
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] font-semibold text-primary capitalize", children: format(currentMonth, "LLLL yyyy", { locale: dateLocale }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setCurrentMonth(addMonths(currentMonth, 1)),
          className: "w-7 h-7 flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container rounded-sm transition-colors",
          children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[16px]", children: "chevron_right" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 mb-1", children: weekDays.map((wd) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "text-center font-[Hanken_Grotesk] text-[10px] font-semibold text-on-surface-variant uppercase py-1",
        children: wd
      },
      wd
    )) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", children: days.map((d, i) => {
      const disabled = isDisabled(d);
      const isSelected = selected && isSameDay(d, selected);
      const isToday = isSameDay(d, today);
      const inCurrentMonth = isSameMonth(d, currentMonth);
      const inRange = isInRange(d);
      const cancelled = isCancelled(d);
      const isRangeStart = rangeStart && isSameDay(d, rangeStart);
      const isRangeEnd = rangeEnd && isSameDay(d, rangeEnd);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          disabled,
          onClick: () => !disabled && onSelect(d),
          className: cn(
            "relative w-9 h-9 flex items-center justify-center font-[Hanken_Grotesk] text-[12px] transition-all rounded-sm",
            !inCurrentMonth && "text-outline/40",
            inCurrentMonth && !disabled && "text-on-surface hover:bg-primary/10",
            disabled && !cancelled && "text-outline/30 cursor-not-allowed",
            cancelled && "text-error/60 cursor-not-allowed",
            isToday && !isSelected && "font-bold ring-1 ring-primary/30",
            isSelected && "bg-primary text-on-primary font-semibold",
            isRangeStart && "bg-primary text-on-primary font-semibold rounded-r-none",
            isRangeEnd && "bg-primary text-on-primary font-semibold rounded-l-none",
            inRange && !isRangeStart && !isRangeEnd && "bg-primary/10 rounded-none"
          ),
          children: [
            format(d, "d"),
            cancelled && inCurrentMonth && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "w-5 h-[1.5px] bg-error/50 rotate-[-45deg] absolute" }) })
          ]
        },
        i
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-3 pt-3 border-t border-outline-variant/20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 bg-primary rounded-sm" }),
        /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] text-secondary", children: locale === "ka" ? "არჩეული" : "Selected" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "relative w-3 h-3 border border-error/50 rounded-sm flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "w-2 h-[1px] bg-error/50 rotate-[-45deg] absolute" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] text-secondary", children: locale === "ka" ? "მიუწვდომელი" : "Unavailable" })
      ] })
    ] })
  ] });
}
function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  locale = "ka",
  icon = "calendar_today",
  disabledDates = [],
  minDate,
  rangeStart,
  rangeEnd,
  label
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dateLocale = locale === "ka" ? ka : enUS;
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", ref, children: [
    label && /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOpen(!open),
          className: cn(
            "flex items-center gap-2 w-full border-b border-outline py-2 text-left transition-colors hover:border-primary",
            open && "border-primary"
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[16px]", children: icon }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "font-[Hanken_Grotesk] text-[13px] leading-[1.5]",
                  value ? "text-on-surface" : "text-outline"
                ),
                children: value ? format(value, "d MMM, yyyy", { locale: dateLocale }) : placeholder
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-secondary text-[14px] ml-auto", children: "expand_more" })
          ]
        }
      ),
      open && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200", children: /* @__PURE__ */ jsx(
        Calendar,
        {
          selected: value,
          onSelect: (date) => {
            onChange(date);
            setOpen(false);
          },
          locale,
          disabledDates,
          minDate,
          rangeStart,
          rangeEnd
        }
      ) })
    ] })
  ] });
}
function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  icon,
  label
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedOption = options.find((o) => o.value === value);
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", ref, children: [
    label && /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOpen(!open),
          className: cn(
            "flex items-center gap-2 w-full border-b border-outline py-2 text-left transition-colors hover:border-primary",
            open && "border-primary"
          ),
          children: [
            icon && /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[16px]", children: icon }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "font-[Hanken_Grotesk] text-[13px] leading-[1.5] flex-1",
                  selectedOption ? "text-on-surface" : "text-outline"
                ),
                children: selectedOption?.label || placeholder
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "material-symbols-outlined text-secondary text-[14px] transition-transform duration-200",
                  open && "rotate-180"
                ),
                children: "expand_more"
              }
            )
          ]
        }
      ),
      open && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-2 z-50 bg-surface-container-lowest border border-outline-variant/30 shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-200", children: options.map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: option.disabled,
          onClick: () => {
            if (!option.disabled) {
              onChange(option.value);
              setOpen(false);
            }
          },
          className: cn(
            "w-full text-left px-3 py-2 font-[Hanken_Grotesk] text-[12px] transition-colors",
            option.value === value ? "bg-primary/5 text-primary font-semibold" : "text-on-surface hover:bg-surface-container",
            option.disabled && "text-outline/40 cursor-not-allowed hover:bg-transparent"
          ),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: option.label }),
            option.value === value && /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[14px]", children: "check" })
          ] })
        },
        option.value
      )) })
    ] })
  ] });
}
export {
  CustomSelect as C,
  DatePicker as D
};

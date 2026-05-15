import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate } from "./_libs/tanstack__react-router.mjs";
import { c as Route$1, b as useAdminAuth, u as useI18n } from "./_ssr/router-cXXbqms1.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { a as api } from "./_ssr/api-B4qLQuEf.mjs";
import { r as reactDomExports } from "./_libs/react-dom.mjs";
import { S } from "./_libs/blurhash.mjs";
import { B as BlurhashImage } from "./_ssr/BlurhashImage-Ep8mXU4M.mjs";
import { C as CustomSelect, D as DatePicker } from "./_ssr/custom-select-BPjJfbMk.mjs";
import { u as useQuery, b as useMutation, c as ConvexError, d as useAction, v } from "./_libs/convex.mjs";
import { f as format, k as ka, e as enUS } from "./_libs/date-fns.mjs";
import { o as object, _ as _enum } from "./_libs/zod.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/isbot.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
const navItems = [
  { icon: "analytics", tab: "analytics", labelKey: "admin.sidebar.analytics" },
  { icon: "bed", tab: "rooms", labelKey: "admin.sidebar.rooms" },
  { icon: "event_available", tab: "reservations", labelKey: "admin.sidebar.reservations" },
  { icon: "photo_library", tab: "gallery", labelKey: "admin.sidebar.gallery" },
  { icon: "handshake", tab: "sponsors", labelKey: "admin.sidebar.sponsors" },
  { icon: "mail", tab: "messages", labelKey: "admin.sidebar.messages" },
  { icon: "settings", tab: "settings", labelKey: "admin.sidebar.settings" }
];
class AuthErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    const isUnauthorized = error instanceof ConvexError && String(error.data).includes("Unauthorized") || error instanceof Error && error.message.includes("Unauthorized");
    if (isUnauthorized) {
      this.props.onUnauthorized();
    }
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
function AdminSidebar({ activeTab, isOpen, onClose }) {
  const { logout } = useAdminAuth();
  const handleUnauthorized = () => {
    localStorage.removeItem("adminSessionToken");
    logout();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthErrorBoundary, { onUnauthorized: handleUnauthorized, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebarInner, { activeTab, isOpen, onClose }) });
}
function AdminSidebarInner({ activeTab, isOpen, onClose }) {
  const { locale, setLocale, t } = useI18n();
  const { logout, sessionToken } = useAdminAuth();
  const navigate = useNavigate();
  const logoutMutation = useMutation(api.auth.logout);
  const unreadCount = useQuery(api.messages.unreadCount) ?? 0;
  const pendingReservations = useQuery(
    api.reservations.pendingCount,
    sessionToken ? { sessionToken } : "skip"
  ) ?? 0;
  const handleTabClick = (tab) => {
    void navigate({ to: "/admin", search: (prev) => ({ ...prev, tab }) });
    onClose();
  };
  const handleLogout = async () => {
    if (sessionToken) {
      await logoutMutation({ sessionToken });
    }
    logout();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/40 z-40 lg:hidden",
        onClick: onClose,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: cn(
          "h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/50 flex flex-col p-6 z-50 transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[EB_Garamond] text-[24px] leading-[1.4] font-medium text-primary mb-1", children: t("admin.sidebar.title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70", children: "Botanical Suite" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setLocale(locale === "ka" ? "en" : "ka"),
                className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2 py-1 rounded-sm mt-1",
                "aria-label": "Toggle language",
                children: locale === "ka" ? "EN" : "ქარ"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 flex flex-col gap-1.5 overflow-y-auto", "aria-label": "Admin navigation", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handleTabClick(item.tab),
              className: cn(
                "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 text-left",
                activeTab === item.tab ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"
              ),
              "aria-current": activeTab === item.tab ? "page" : void 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[20px]", children: item.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] font-semibold flex-1", children: t(item.labelKey) }),
                item.tab === "messages" && unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-error text-on-error text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center", children: unreadCount }),
                item.tab === "reservations" && pendingReservations > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-error text-on-error text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center", children: pendingReservations })
              ]
            },
            item.tab
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-6 border-t border-outline-variant/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => void handleLogout(),
              className: "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 rounded-full text-left w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] font-semibold", children: t("admin.sidebar.logout") })
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
function AdminHeader() {
  const { locale } = useI18n();
  const [now, setNow] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const interval = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(interval);
  }, []);
  const timeStr = now.toLocaleTimeString(locale === "ka" ? "ka-GE" : "en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const dateStr = now.toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "mt-4 sm:mt-6 lg:mt-0 mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[EB_Garamond] text-[28px] sm:text-[36px] md:text-[48px] leading-[1.2] text-primary mb-1 sm:mb-2", children: locale === "ka" ? "გამარჯობა, ადმინისტრატორ" : "Welcome back, Administrator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4 text-secondary/80 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[12px] sm:text-[13px] font-semibold flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px] sm:text-[18px]", "aria-hidden": "true", children: "schedule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("time", { children: timeStr })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 bg-outline-variant rounded-full hidden sm:block", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("time", { dateTime: now.toISOString(), children: dateStr }) })
    ] })
  ] }) });
}
function AnalyticsTab() {
  const { locale, t } = useI18n();
  const rooms = useQuery(api.rooms.list) ?? [];
  const galleryImages = useQuery(api.gallery.list) ?? [];
  const sponsors = useQuery(api.sponsors.list) ?? [];
  const unreadMessages = useQuery(api.messages.unreadCount) ?? 0;
  const stats = [
    {
      labelKey: "admin.analytics.rooms",
      value: rooms?.length ?? 0,
      supportingKey: "admin.analytics.roomsSupporting",
      icon: "bed"
    },
    {
      labelKey: "admin.analytics.gallery",
      value: galleryImages?.length ?? 0,
      supportingKey: "admin.analytics.gallerySupporting",
      icon: "photo_library"
    },
    {
      labelKey: "admin.analytics.sponsors",
      value: sponsors?.length ?? 0,
      supportingKey: "admin.analytics.sponsorsSupporting",
      icon: "handshake"
    },
    {
      labelKey: "admin.analytics.unreadMessages",
      value: unreadMessages ?? 0,
      supportingKey: "admin.analytics.unreadMessagesSupporting",
      icon: "mail"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6", children: stats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-surface-container-lowest border border-outline-variant/30 p-5 sm:p-8 flex flex-col justify-between min-h-[140px] sm:min-h-[180px] group hover:border-primary/30 transition-all duration-300",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[12px] font-semibold text-secondary uppercase tracking-[0.1em]", children: t(stat.labelKey) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-inverse-primary text-[22px]", "aria-hidden": "true", children: stat.icon })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[EB_Garamond] text-[40px] sm:text-[56px] leading-none text-primary", children: stat.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] sm:text-[14px] text-on-surface-variant mt-2", children: t(stat.supportingKey) })
        ] })
      ]
    },
    stat.labelKey
  )) });
}
function ConfirmationDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  cancelLabel = "Cancel"
}) {
  reactExports.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);
  if (!isOpen) return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "dialog-title",
        "aria-describedby": "dialog-description",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/40",
              onClick: onCancel,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-surface-container-lowest border border-outline-variant/30 p-8 w-full max-w-md mx-4 shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                id: "dialog-title",
                className: "font-[EB_Garamond] text-[24px] leading-[1.3] text-primary mb-3",
                children: title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "dialog-description",
                className: "font-[Hanken_Grotesk] text-[14px] text-on-surface-variant mb-8 leading-relaxed",
                children: description
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onCancel,
                  className: "px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors",
                  children: cancelLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onConfirm,
                  className: "px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold bg-error text-on-error hover:opacity-90 transition-opacity",
                  children: confirmLabel
                }
              )
            ] })
          ] })
        ]
      }
    ),
    document.body
  );
}
function RoomCard({ room, onEdit }) {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = reactExports.useState(false);
  const removeRoom = useMutation(api.rooms.remove);
  const handleDelete = async () => {
    await removeRoom({ sessionToken, id: room._id });
    setIsDeleteDialogOpen(false);
  };
  const roomName = locale === "ka" ? room.nameKa : room.nameEn;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/30 overflow-hidden group hover:border-primary/30 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-surface-container-high overflow-hidden", children: room.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: room.imageUrl,
          alt: roomName,
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[48px] text-on-surface-variant/30", children: "bed" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[EB_Garamond] text-[20px] text-primary mb-2", children: roomName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "payments" }),
            "$",
            Math.round(room.pricePerNight),
            "/",
            locale === "ka" ? "ღამე" : "night"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "group" }),
            room.capacity,
            " ",
            locale === "ka" ? "სტუმარი" : "guests"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: onEdit,
              className: "flex-1 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high px-4 py-2 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "edit" }),
                t("admin.common.edit")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setIsDeleteDialogOpen(true),
              className: "flex-1 border border-error/30 text-error hover:bg-error/10 px-4 py-2 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "delete" }),
                t("admin.common.delete")
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationDialog,
      {
        isOpen: isDeleteDialogOpen,
        title: t("admin.rooms.deleteTitle"),
        description: locale === "ka" ? `დარწმუნებული ხართ, რომ გსურთ "${roomName}" წაშლა? ეს მოქმედება შეუქცევადია.` : `Are you sure you want to delete "${roomName}"? This action cannot be undone.`,
        onConfirm: handleDelete,
        onCancel: () => setIsDeleteDialogOpen(false),
        confirmLabel: t("admin.common.delete"),
        cancelLabel: t("admin.common.cancel")
      }
    )
  ] });
}
async function generateBlurhash(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);
        const hash = S(imageData.data, size, size, 4, 3);
        resolve(hash);
      } catch {
        resolve(null);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
function useB2Upload() {
  const { sessionToken } = useAdminAuth();
  const uploadFile = useAction(api.b2.uploadFile);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const upload = async (file) => {
    if (!sessionToken) {
      setError("Image upload failed. Please try again.");
      return null;
    }
    setError(null);
    setIsUploading(true);
    try {
      const blurhash = await generateBlurhash(file);
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const result = await uploadFile({
        sessionToken,
        fileName: file.name,
        contentType: file.type,
        fileData: base64,
        blurhash: blurhash ?? void 0
      });
      return {
        publicUrl: result.publicUrl,
        blurhash: result.blurhash
      };
    } catch (err) {
      console.error("B2 upload error:", err);
      setError("Image upload failed. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  return { upload, isUploading, error };
}
function validateRequired(value) {
  if (!value || value.trim().length === 0) {
    return "This field is required";
  }
  return null;
}
function validateUrl(value) {
  if (!value || value.trim().length === 0) {
    return "This field is required";
  }
  try {
    new URL(value);
    return null;
  } catch {
    return "Please enter a valid URL (e.g. https://example.com)";
  }
}
const ALLOWED_TYPES = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
function validateImageFile(file) {
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_SIZE_BYTES) {
    return "File must be JPEG, PNG, or WebP and under 10 MB";
  }
  return null;
}
function RoomFormDialog({ isOpen, room, onClose }) {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const { upload, isUploading, error: uploadError } = useB2Upload();
  const createRoom = useMutation(api.rooms.create);
  const updateRoom = useMutation(api.rooms.update);
  const [nameKa, setNameKa] = reactExports.useState("");
  const [nameEn, setNameEn] = reactExports.useState("");
  const [descriptionKa, setDescriptionKa] = reactExports.useState("");
  const [descriptionEn, setDescriptionEn] = reactExports.useState("");
  const [pricePerNight, setPricePerNight] = reactExports.useState("");
  const [capacity, setCapacity] = reactExports.useState("");
  const [amenities, setAmenities] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [imageBlurhash, setImageBlurhash] = reactExports.useState(void 0);
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (room) {
      setNameKa(room.nameKa);
      setNameEn(room.nameEn);
      setDescriptionKa(room.descriptionKa);
      setDescriptionEn(room.descriptionEn);
      setPricePerNight(String(room.pricePerNight));
      setCapacity(String(room.capacity));
      setAmenities(room.amenities.join(", "));
      setImageUrl(room.imageUrl);
    } else {
      setNameKa("");
      setNameEn("");
      setDescriptionKa("");
      setDescriptionEn("");
      setPricePerNight("");
      setCapacity("");
      setAmenities("");
      setImageUrl("");
    }
    setErrors({});
  }, [room, isOpen]);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setErrors((prev) => ({ ...prev, imageUrl: validationError }));
      return;
    }
    const result = await upload(file);
    if (result) {
      setImageUrl(result.publicUrl);
      setImageBlurhash(result.blurhash ?? void 0);
      setErrors((prev) => ({ ...prev, imageUrl: void 0 }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const nameKaError = validateRequired(nameKa);
    const nameEnError = validateRequired(nameEn);
    const priceError = validateRequired(pricePerNight);
    const capacityError = validateRequired(capacity);
    if (nameKaError) newErrors.nameKa = nameKaError;
    if (nameEnError) newErrors.nameEn = nameEnError;
    if (priceError) newErrors.pricePerNight = priceError;
    if (capacityError) newErrors.capacity = capacityError;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      if (room) {
        await updateRoom({
          sessionToken,
          id: room._id,
          nameKa,
          nameEn,
          descriptionKa,
          descriptionEn,
          pricePerNight: Number(pricePerNight),
          capacity: Number(capacity),
          amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
          imageUrl,
          blurhash: imageBlurhash
        });
      } else {
        await createRoom({
          sessionToken,
          nameKa,
          nameEn,
          descriptionKa,
          descriptionEn,
          pricePerNight: Number(pricePerNight),
          capacity: Number(capacity),
          amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
          imageUrl,
          blurhash: imageBlurhash
        });
      }
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;
  const isEditing = room !== null;
  const title = isEditing ? t("admin.rooms.editRoom") : t("admin.rooms.addRoom");
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": title,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose, "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-surface-container-lowest border border-outline-variant/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl mx-2 sm:mx-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 sm:p-8 border-b border-outline-variant/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[EB_Garamond] text-[22px] sm:text-[28px] text-primary", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  className: "text-on-surface-variant hover:text-on-surface transition-colors",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", children: "close" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-4 sm:p-8 flex flex-col gap-5 sm:gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.nameKa") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: nameKa,
                      onChange: (e) => setNameKa(e.target.value),
                      className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                    }
                  ),
                  errors.nameKa && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.nameKa })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.nameEn") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: nameEn,
                      onChange: (e) => setNameEn(e.target.value),
                      className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                    }
                  ),
                  errors.nameEn && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.nameEn })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.descriptionKa") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: descriptionKa,
                      onChange: (e) => setDescriptionKa(e.target.value),
                      rows: 3,
                      className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors resize-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.descriptionEn") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: descriptionEn,
                      onChange: (e) => setDescriptionEn(e.target.value),
                      rows: 3,
                      className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors resize-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.pricePerNight") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: pricePerNight,
                      onChange: (e) => setPricePerNight(e.target.value),
                      className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                    }
                  ),
                  errors.pricePerNight && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.pricePerNight })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.capacity") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "1",
                      step: "1",
                      value: capacity,
                      onChange: (e) => setCapacity(e.target.value),
                      className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                    }
                  ),
                  errors.capacity && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.capacity })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.amenities") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: amenities,
                    onChange: (e) => setAmenities(e.target.value),
                    placeholder: locale === "ka" ? "Wi-Fi, კონდიცი, სეიფი" : "Wi-Fi, Air conditioning, Safe",
                    className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.rooms.image") }),
                imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "Room preview", className: "w-full h-40 object-cover rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer border border-dashed border-outline-variant p-4 text-center hover:border-primary transition-colors rounded", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      accept: "image/jpeg,image/png,image/webp",
                      onChange: handleImageChange,
                      className: "sr-only",
                      disabled: isUploading
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[32px] text-on-surface-variant/50 block mb-1", children: "upload" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant", children: isUploading ? t("admin.common.uploading") : t("admin.common.uploadImage") })
                ] }),
                (errors.imageUrl || uploadError) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.imageUrl || uploadError })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors",
                    children: t("admin.common.cancel")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isSubmitting || isUploading,
                    className: "px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2",
                    children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px] animate-spin", children: "progress_activity" }),
                      t("admin.common.saving")
                    ] }) : isEditing ? t("admin.common.update") : t("admin.rooms.addRoom")
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ),
    document.body
  );
}
function RoomsTab() {
  const { locale, t } = useI18n();
  const [isAddDialogOpen, setIsAddDialogOpen] = reactExports.useState(false);
  const [editingRoom, setEditingRoom] = reactExports.useState(null);
  const rooms = useQuery(api.rooms.list) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary", children: t("admin.rooms.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setIsAddDialogOpen(true),
          className: "bg-primary text-on-primary px-5 sm:px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] sm:text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: "add" }),
            t("admin.rooms.addRoom")
          ]
        }
      )
    ] }),
    rooms.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[48px] mb-4 block opacity-40", children: "bed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("admin.rooms.noRooms") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: rooms.map((room) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      RoomCard,
      {
        room,
        onEdit: () => setEditingRoom(room)
      },
      room._id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RoomFormDialog,
      {
        isOpen: isAddDialogOpen || editingRoom !== null,
        room: editingRoom,
        onClose: () => {
          setIsAddDialogOpen(false);
          setEditingRoom(null);
        }
      }
    )
  ] });
}
function GalleryImageCard({ image }) {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = reactExports.useState(false);
  const removeImage = useMutation(api.gallery.remove);
  const handleDelete = async () => {
    await removeImage({ sessionToken, id: image._id });
    setIsDeleteDialogOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/30 overflow-hidden group hover:border-primary/30 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-surface-container-high overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        BlurhashImage,
        {
          src: image.imageUrl,
          alt: image.altText,
          blurhash: image.blurhash,
          className: "w-full h-full"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant mb-3 truncate",
            title: image.altText,
            children: image.altText
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[11px] text-on-surface-variant/60 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[14px]", children: "sort" }),
            locale === "ka" ? "თანმიმდევრობა" : "Order",
            ": ",
            image.displayOrder
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setIsDeleteDialogOpen(true),
              className: "border border-error/30 text-error hover:bg-error/10 px-3 py-1.5 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold transition-colors flex items-center gap-1",
              "aria-label": locale === "ka" ? "სურათის წაშლა" : "Delete image",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[14px]", children: "delete" }),
                t("admin.common.delete")
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationDialog,
      {
        isOpen: isDeleteDialogOpen,
        title: t("admin.gallery.deleteTitle"),
        description: locale === "ka" ? "დარწმუნებული ხართ, რომ გსურთ სურათის წაშლა? ეს მოქმედება შეუქცევადია." : "Are you sure you want to delete this image? This action cannot be undone.",
        onConfirm: handleDelete,
        onCancel: () => setIsDeleteDialogOpen(false),
        confirmLabel: t("admin.common.delete"),
        cancelLabel: t("admin.common.cancel")
      }
    )
  ] });
}
function ImageUploadDialog({ isOpen, onClose }) {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const { upload } = useB2Upload();
  const createGalleryImage = useMutation(api.gallery.create);
  const existingImages = useQuery(api.gallery.list) ?? [];
  const [entries, setEntries] = reactExports.useState([]);
  const [isRunning, setIsRunning] = reactExports.useState(false);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isOpen) {
      setEntries((prev) => {
        prev.forEach((e) => URL.revokeObjectURL(e.previewUrl));
        return [];
      });
      setIsRunning(false);
    }
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape" && !isRunning) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, isRunning, onClose]);
  const addFiles = reactExports.useCallback((files) => {
    const arr = Array.from(files);
    const valid = [];
    arr.forEach((file) => {
      if (validateImageFile(file)) return;
      valid.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        altText: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        status: "pending"
      });
    });
    setEntries((prev) => [...prev, ...valid]);
  }, []);
  const handleFileInput = (e) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };
  const removeEntry = (id) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((e) => e.id !== id);
    });
  };
  const updateAltText = (id, value) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, altText: value } : e));
  };
  const handleUploadAll = async () => {
    const pending = entries.filter((e) => e.status === "pending");
    if (pending.length === 0) return;
    setIsRunning(true);
    const baseOrder = existingImages.length;
    await Promise.all(
      pending.map(async (entry, idx) => {
        setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: "uploading" } : e));
        try {
          const result = await upload(entry.file);
          if (!result) throw new Error("Upload failed");
          await createGalleryImage({
            sessionToken,
            imageUrl: result.publicUrl,
            altText: entry.altText.trim() || entry.file.name,
            displayOrder: baseOrder + idx,
            blurhash: result.blurhash ?? void 0
          });
          setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: "done" } : e));
        } catch (err) {
          setEntries((prev) => prev.map(
            (e) => e.id === entry.id ? { ...e, status: "error", errorMsg: locale === "ka" ? "შეცდომა" : "Failed" } : e
          ));
        }
      })
    );
    setIsRunning(false);
  };
  const allDone = entries.length > 0 && entries.every((e) => e.status === "done");
  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const uploadingCount = entries.filter((e) => e.status === "uploading").length;
  const errorCount = entries.filter((e) => e.status === "error").length;
  if (!isOpen) return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/40",
              onClick: () => {
                if (!isRunning) onClose();
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-surface-container-lowest border border-outline-variant/30 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl mx-2 sm:mx-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-outline-variant/20 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[EB_Garamond] text-[26px] text-primary", children: locale === "ka" ? "სურათების ატვირთვა" : "Upload Images" }),
                entries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-[Hanken_Grotesk] text-[12px] text-secondary mt-0.5", children: [
                  entries.length,
                  " ",
                  locale === "ka" ? "სურათი" : "images selected",
                  errorCount > 0 && ` · ${errorCount} ${locale === "ka" ? "შეცდომა" : "failed"}`
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  disabled: isRunning,
                  className: "text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-40",
                  "aria-label": t("admin.common.close"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", children: "close" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `mx-4 sm:mx-8 mt-4 sm:mt-6 shrink-0 border-2 border-dashed transition-colors cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary"}`,
                onDragOver: (e) => {
                  e.preventDefault();
                  setIsDragging(true);
                },
                onDragLeave: () => setIsDragging(false),
                onDrop: handleDrop,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col items-center gap-2 py-6 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      accept: "image/jpeg,image/png,image/webp",
                      multiple: true,
                      onChange: handleFileInput,
                      className: "sr-only",
                      disabled: isRunning
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[32px] text-secondary/50", children: isDragging ? "file_download" : "add_photo_alternate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] text-secondary text-center", children: locale === "ka" ? "გადმოიტანეთ სურათები ან დააჭირეთ ასარჩევად" : "Drop images here or click to select" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary/60", children: [
                    "JPEG, PNG, WebP · ",
                    locale === "ka" ? "მრავალი ფაილი" : "multiple files supported"
                  ] })
                ] })
              }
            ),
            entries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 sm:px-8 py-4 flex flex-col gap-3 min-h-0", children: entries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-center gap-4 p-3 border transition-colors ${entry.status === "done" ? "border-primary/20 bg-primary/5" : entry.status === "error" ? "border-error/20 bg-error/5" : "border-outline-variant/30"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: entry.previewUrl,
                      alt: "",
                      className: "w-14 h-14 object-cover shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        value: entry.altText,
                        onChange: (e) => updateAltText(entry.id, e.target.value),
                        disabled: entry.status !== "pending",
                        placeholder: locale === "ka" ? "სურათის აღწერა" : "Image description",
                        className: "w-full bg-transparent border-b border-outline-variant/40 pb-1 font-[Hanken_Grotesk] text-[13px] text-on-surface outline-none focus:border-primary transition-colors disabled:opacity-60 truncate"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] text-secondary/60 mt-1 truncate", children: entry.file.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 w-7 flex items-center justify-center", children: [
                    entry.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => removeEntry(entry.id),
                        className: "text-secondary/50 hover:text-error transition-colors",
                        "aria-label": "Remove",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: "close" })
                      }
                    ),
                    entry.status === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px] text-primary animate-spin", children: "progress_activity" }),
                    entry.status === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px] text-primary", style: { fontVariationSettings: "'FILL' 1" }, children: "check_circle" }),
                    entry.status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px] text-error", title: entry.errorMsg, children: "error" })
                  ] })
                ]
              },
              entry.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-8 py-4 sm:py-5 border-t border-outline-variant/20 flex items-center justify-between gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  disabled: isRunning,
                  className: "px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  children: allDone ? t("admin.common.close") : t("admin.common.cancel")
                }
              ),
              !allDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleUploadAll,
                  disabled: isRunning || pendingCount === 0,
                  className: "px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2",
                  children: isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px] animate-spin", children: "progress_activity" }),
                    uploadingCount > 0 ? `${locale === "ka" ? "იტვირთება" : "Uploading"} ${uploadingCount}…` : t("admin.common.uploading")
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: "upload" }),
                    pendingCount > 1 ? `${locale === "ka" ? "ყველას ატვირთვა" : "Upload All"} (${pendingCount})` : locale === "ka" ? "ატვირთვა" : "Upload"
                  ] })
                }
              )
            ] })
          ] })
        ]
      }
    ),
    document.body
  );
}
function GalleryTab() {
  const { locale, t } = useI18n();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = reactExports.useState(false);
  const images = useQuery(api.gallery.list) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary", children: t("admin.gallery.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setIsUploadDialogOpen(true),
          className: "bg-primary text-on-primary px-5 sm:px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] sm:text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: "upload" }),
            t("admin.gallery.uploadImage")
          ]
        }
      )
    ] }),
    images.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[48px] mb-4 block opacity-40", children: "photo_library" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("admin.gallery.noImages") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4", children: images.map((image) => /* @__PURE__ */ jsxRuntimeExports.jsx(GalleryImageCard, { image }, image._id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageUploadDialog,
      {
        isOpen: isUploadDialogOpen,
        onClose: () => setIsUploadDialogOpen(false)
      }
    )
  ] });
}
function SponsorRow({ sponsor, onEdit }) {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = reactExports.useState(false);
  const removeSponsor = useMutation(api.sponsors.remove);
  const handleDelete = async () => {
    await removeSponsor({ sessionToken, id: sponsor._id });
    setIsDeleteDialogOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/30 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-surface-container-high overflow-hidden flex items-center justify-center", children: sponsor.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: sponsor.logoUrl,
            alt: sponsor.name,
            className: "w-full h-full object-contain"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[24px] sm:text-[28px] text-on-surface-variant/30", children: "image" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[EB_Garamond] text-[16px] sm:text-[18px] text-primary truncate", children: sponsor.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: sponsor.websiteUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "font-[Hanken_Grotesk] text-[12px] sm:text-[13px] text-secondary hover:underline truncate block",
              children: sponsor.websiteUrl
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 text-center px-3 hidden md:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-0.5", children: locale === "ka" ? "რიგი" : "Order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[16px] font-semibold text-on-surface", children: sponsor.displayOrder })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 sm:ml-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "md:hidden font-[Hanken_Grotesk] text-[11px] text-on-surface-variant mr-auto", children: [
          "#",
          sponsor.displayOrder
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onEdit,
            className: "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold transition-colors flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[14px] sm:text-[16px]", children: "edit" }),
              t("admin.common.edit")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setIsDeleteDialogOpen(true),
            className: "border border-error/30 text-error hover:bg-error/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold transition-colors flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[14px] sm:text-[16px]", children: "delete" }),
              t("admin.common.delete")
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationDialog,
      {
        isOpen: isDeleteDialogOpen,
        title: t("admin.sponsors.deleteTitle"),
        description: locale === "ka" ? `დარწმუნებული ხართ, რომ გსურთ "${sponsor.name}" წაშლა? ეს მოქმედება შეუქცევადია.` : `Are you sure you want to delete "${sponsor.name}"? This action cannot be undone.`,
        onConfirm: handleDelete,
        onCancel: () => setIsDeleteDialogOpen(false),
        confirmLabel: t("admin.common.delete"),
        cancelLabel: t("admin.common.cancel")
      }
    )
  ] });
}
function SponsorFormDialog({ isOpen, sponsor, onClose }) {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const { upload, isUploading, error: uploadError } = useB2Upload();
  const createSponsor = useMutation(api.sponsors.create);
  const updateSponsor = useMutation(api.sponsors.update);
  const [name, setName] = reactExports.useState("");
  const [websiteUrl, setWebsiteUrl] = reactExports.useState("");
  const [displayOrder, setDisplayOrder] = reactExports.useState("");
  const [logoUrl, setLogoUrl] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (sponsor) {
      setName(sponsor.name);
      setWebsiteUrl(sponsor.websiteUrl);
      setDisplayOrder(String(sponsor.displayOrder));
      setLogoUrl(sponsor.logoUrl);
    } else {
      setName("");
      setWebsiteUrl("");
      setDisplayOrder("");
      setLogoUrl("");
    }
    setErrors({});
  }, [sponsor, isOpen]);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setErrors((prev) => ({ ...prev, logoUrl: validationError }));
      return;
    }
    const result = await upload(file);
    if (result) {
      setLogoUrl(result.publicUrl);
      setErrors((prev) => ({ ...prev, logoUrl: void 0 }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const nameError = validateRequired(name);
    const websiteUrlError = validateUrl(websiteUrl);
    const displayOrderError = validateRequired(displayOrder);
    if (nameError) newErrors.name = nameError;
    if (websiteUrlError) newErrors.websiteUrl = websiteUrlError;
    if (displayOrderError) {
      newErrors.displayOrder = displayOrderError;
    } else if (!Number.isInteger(Number(displayOrder)) || Number(displayOrder) < 0) {
      newErrors.displayOrder = locale === "ka" ? "გთხოვთ შეიყვანოთ არაუარყოფითი მთელი რიცხვი" : "Please enter a non-negative integer";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      if (sponsor) {
        await updateSponsor({
          sessionToken,
          id: sponsor._id,
          name,
          websiteUrl,
          displayOrder: Number(displayOrder),
          logoUrl
        });
      } else {
        await createSponsor({
          sessionToken,
          name,
          websiteUrl,
          displayOrder: Number(displayOrder),
          logoUrl
        });
      }
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;
  const isEditing = sponsor !== null;
  const title = isEditing ? t("admin.sponsors.editSponsor") : t("admin.sponsors.addSponsor");
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": title,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose, "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-8 border-b border-outline-variant/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[EB_Garamond] text-[28px] text-primary", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  className: "text-on-surface-variant hover:text-on-surface transition-colors",
                  "aria-label": t("admin.common.close"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined", children: "close" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-8 flex flex-col gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.sponsors.name") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                  }
                ),
                errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.sponsors.websiteUrl") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "url",
                    value: websiteUrl,
                    onChange: (e) => setWebsiteUrl(e.target.value),
                    placeholder: "https://example.com",
                    className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                  }
                ),
                errors.websiteUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.websiteUrl })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.sponsors.displayOrder") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    step: "1",
                    value: displayOrder,
                    onChange: (e) => setDisplayOrder(e.target.value),
                    className: "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
                  }
                ),
                errors.displayOrder && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.displayOrder })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: t("admin.sponsors.logo") }),
                logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-surface-container-high flex items-center justify-center overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoUrl, alt: "Logo preview", className: "w-full h-full object-contain" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer border border-dashed border-outline-variant p-4 text-center hover:border-primary transition-colors rounded", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      accept: "image/jpeg,image/png,image/webp",
                      onChange: handleLogoChange,
                      className: "sr-only",
                      disabled: isUploading
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[32px] text-on-surface-variant/50 block mb-1", children: "upload" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant", children: isUploading ? t("admin.common.uploading") : locale === "ka" ? "ლოგოს ატვირთვა" : "Upload logo" })
                ] }),
                (errors.logoUrl || uploadError) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-[12px] font-[Hanken_Grotesk]", children: errors.logoUrl || uploadError })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors",
                    children: t("admin.common.cancel")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isSubmitting || isUploading,
                    className: "px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2",
                    children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px] animate-spin", children: "progress_activity" }),
                      t("admin.common.saving")
                    ] }) : isEditing ? t("admin.common.update") : t("admin.sponsors.addSponsor")
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ),
    document.body
  );
}
function SponsorsTab() {
  const { locale, t } = useI18n();
  const [isAddDialogOpen, setIsAddDialogOpen] = reactExports.useState(false);
  const [editingSponsor, setEditingSponsor] = reactExports.useState(null);
  const sponsors = useQuery(api.sponsors.list) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary", children: t("admin.sponsors.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setIsAddDialogOpen(true),
          className: "bg-primary text-on-primary px-5 sm:px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] sm:text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: "add" }),
            t("admin.sponsors.addSponsor")
          ]
        }
      )
    ] }),
    sponsors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[48px] mb-4 block opacity-40", children: "handshake" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("admin.sponsors.noSponsors") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: sponsors.map((sponsor) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      SponsorRow,
      {
        sponsor,
        onEdit: () => setEditingSponsor(sponsor)
      },
      sponsor._id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SponsorFormDialog,
      {
        isOpen: isAddDialogOpen || editingSponsor !== null,
        sponsor: editingSponsor,
        onClose: () => {
          setIsAddDialogOpen(false);
          setEditingSponsor(null);
        }
      }
    )
  ] });
}
function formatDate$1(timestamp, locale) {
  return new Date(timestamp).toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function MessageRow({ message, isSelected, onSelect }) {
  const { locale } = useI18n();
  const { sessionToken } = useAdminAuth();
  const markReadMutation = useMutation(api.messages.markRead);
  const handleClick = async () => {
    onSelect(message);
    if (!message.isRead) {
      await markReadMutation({ sessionToken, id: message._id });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: handleClick,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void handleClick();
        }
      },
      className: [
        "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border-b border-outline-variant/30 cursor-pointer transition-all duration-200",
        "hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/30",
        isSelected ? "bg-primary-container/20 border-l-2 border-l-primary" : message.isRead ? "bg-surface-container-lowest" : "bg-secondary-container/10"
      ].join(" "),
      "aria-selected": isSelected,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4 flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: [
                "material-symbols-outlined flex-shrink-0 text-[20px] sm:text-[22px]",
                message.isRead ? "text-on-surface-variant/50" : "text-primary"
              ].join(" "),
              style: message.isRead ? { fontVariationSettings: "'FILL' 0" } : { fontVariationSettings: "'FILL' 1" },
              "aria-label": message.isRead ? locale === "ka" ? "წაკითხული" : "Read" : locale === "ka" ? "წაუკითხავი" : "Unread",
              children: "mail"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: [
                    "font-[Hanken_Grotesk] text-[13px] sm:text-[14px] truncate",
                    message.isRead ? "font-normal text-on-surface" : "font-semibold text-on-surface"
                  ].join(" "),
                  children: message.senderName
                }
              ),
              !message.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 w-2 h-2 rounded-full bg-primary", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] sm:text-[12px] text-on-surface-variant truncate block", children: message.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 pl-8 sm:pl-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary bg-secondary-container/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full", children: message.inquiryType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant whitespace-nowrap ml-auto sm:ml-0", children: formatDate$1(message.submittedAt, locale) })
        ] })
      ]
    }
  );
}
function formatDate(timestamp, locale) {
  return new Date(timestamp).toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function MessageDetailPanel({ message, onClose }) {
  const { locale } = useI18n();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-outline-variant/40 bg-surface-container-lowest rounded-sm mt-1 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/30 bg-surface-container-low", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[EB_Garamond] text-[18px] sm:text-[20px] text-primary", children: locale === "ka" ? "შეტყობინების დეტალები" : "Message Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          "aria-label": locale === "ka" ? "დახურვა" : "Close",
          className: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full p-1.5 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[20px]", children: "close" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: locale === "ka" ? "გამგზავნი" : "Sender" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface font-medium", children: message.senderName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: locale === "ka" ? "ელ-ფოსტა" : "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `mailto:${message.email}`,
              className: "font-[Hanken_Grotesk] text-[15px] text-secondary hover:underline",
              children: message.email
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: locale === "ka" ? "მოთხოვნის ტიპი" : "Inquiry Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary bg-secondary-container/30 px-2.5 py-1 rounded-full inline-block", children: message.inquiryType })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: locale === "ka" ? "გაგზავნის თარიღი" : "Submitted At" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface", children: formatDate(message.submittedAt, locale) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-2", children: locale === "ka" ? "შეტყობინება" : "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface-container-high rounded-sm p-4 border border-outline-variant/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface leading-relaxed whitespace-pre-wrap", children: message.body }) })
      ] })
    ] })
  ] });
}
function MessagesTab() {
  const { locale, t } = useI18n();
  const [selectedMessage, setSelectedMessage] = reactExports.useState(null);
  const messages = useQuery(api.messages.list) ?? [];
  const handleSelectMessage = (message) => {
    if (selectedMessage?._id === message._id) {
      setSelectedMessage(null);
    } else {
      setSelectedMessage(message);
    }
  };
  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary", children: t("admin.messages.title") }),
      messages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant", children: [
        messages.filter((m) => !m.isRead).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-error text-on-error text-[11px] font-semibold px-2 py-0.5 rounded-full mr-2", children: messages.filter((m) => !m.isRead).length }),
        locale === "ka" ? `სულ ${messages.length} შეტყობინება` : `${messages.length} total`
      ] })
    ] }),
    messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[48px] mb-4 block opacity-40", children: "mail" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("admin.messages.noMessages") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-outline-variant/30 rounded-sm overflow-hidden", children: messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MessageRow,
        {
          message,
          isSelected: selectedMessage?._id === message._id,
          onSelect: handleSelectMessage
        }
      ),
      selectedMessage?._id === message._id && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MessageDetailPanel,
        {
          message: selectedMessage,
          onClose: handleCloseDetail
        }
      )
    ] }, message._id)) })
  ] });
}
function SettingsTab() {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const settings = useQuery(api.siteSettings.get);
  const upsertSettings = useMutation(api.siteSettings.upsert);
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [addressKa, setAddressKa] = reactExports.useState("");
  const [addressEn, setAddressEn] = reactExports.useState("");
  const [instagramUrl, setInstagramUrl] = reactExports.useState("");
  const [facebookUrl, setFacebookUrl] = reactExports.useState("");
  const [aboutKa, setAboutKa] = reactExports.useState("");
  const [aboutEn, setAboutEn] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [submitStatus, setSubmitStatus] = reactExports.useState("idle");
  reactExports.useEffect(() => {
    if (settings) {
      setPhone(settings.phone);
      setEmail(settings.email);
      setAddressKa(settings.addressKa);
      setAddressEn(settings.addressEn);
      setInstagramUrl(settings.instagramUrl);
      setFacebookUrl(settings.facebookUrl);
      setAboutKa(settings.aboutKa);
      setAboutEn(settings.aboutEn);
    }
  }, [settings]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("idle");
    const newErrors = {};
    const phoneError = validateRequired(phone);
    const emailError = validateRequired(email);
    if (phoneError) newErrors.phone = phoneError;
    if (emailError) newErrors.email = emailError;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await upsertSettings({
        sessionToken,
        phone,
        email,
        addressKa,
        addressEn,
        instagramUrl,
        facebookUrl,
        aboutKa,
        aboutEn
      });
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const labelClass = "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary";
  const inputClass = "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50";
  const textareaClass = "bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors resize-none placeholder:text-on-surface-variant/50";
  const errorClass = "text-error text-[12px] font-[Hanken_Grotesk]";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[EB_Garamond] text-[28px] text-primary", children: t("admin.settings.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant mt-1", children: t("admin.settings.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "flex flex-col gap-8 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70 mb-4 pb-2 border-b border-outline-variant/30", children: t("admin.settings.contactInfo") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-phone", className: labelClass, children: t("admin.settings.phone") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "settings-phone",
                type: "tel",
                value: phone,
                onChange: (e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: void 0 }));
                },
                placeholder: "+995 511 222 028",
                className: inputClass,
                "aria-required": "true",
                "aria-describedby": errors.phone ? "settings-phone-error" : void 0
              }
            ),
            errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "settings-phone-error", role: "alert", className: errorClass, children: errors.phone })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-email", className: labelClass, children: locale === "ka" ? "ელ-ფოსტა *" : "Email *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "settings-email",
                type: "email",
                value: email,
                onChange: (e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: void 0 }));
                },
                placeholder: "info@kaihotel.ge",
                className: inputClass,
                "aria-required": "true",
                "aria-describedby": errors.email ? "settings-email-error" : void 0
              }
            ),
            errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "settings-email-error", role: "alert", className: errorClass, children: errors.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-address-ka", className: labelClass, children: t("admin.settings.addressKa") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "settings-address-ka",
                  type: "text",
                  value: addressKa,
                  onChange: (e) => setAddressKa(e.target.value),
                  placeholder: locale === "ka" ? "ქ. ბათუმი, ..." : "Batumi, ...",
                  className: inputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-address-en", className: labelClass, children: t("admin.settings.addressEn") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "settings-address-en",
                  type: "text",
                  value: addressEn,
                  onChange: (e) => setAddressEn(e.target.value),
                  placeholder: "Batumi, ...",
                  className: inputClass
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70 mb-4 pb-2 border-b border-outline-variant/30", children: t("admin.settings.socialMedia") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-instagram", className: labelClass, children: locale === "ka" ? "Instagram URL" : "Instagram URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "settings-instagram",
                type: "url",
                value: instagramUrl,
                onChange: (e) => setInstagramUrl(e.target.value),
                placeholder: "https://instagram.com/kaihotelbar",
                className: inputClass
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-facebook", className: labelClass, children: locale === "ka" ? "Facebook URL" : "Facebook URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "settings-facebook",
                type: "url",
                value: facebookUrl,
                onChange: (e) => setFacebookUrl(e.target.value),
                placeholder: "https://facebook.com/kaihotelbar",
                className: inputClass
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70 mb-4 pb-2 border-b border-outline-variant/30", children: t("admin.settings.about") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-about-ka", className: labelClass, children: t("admin.settings.aboutKa") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "settings-about-ka",
                value: aboutKa,
                onChange: (e) => setAboutKa(e.target.value),
                rows: 5,
                placeholder: locale === "ka" ? "სასტუმროს შესახებ ქართულად..." : "About the hotel in Georgian...",
                className: textareaClass
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "settings-about-en", className: labelClass, children: t("admin.settings.aboutEn") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "settings-about-en",
                value: aboutEn,
                onChange: (e) => setAboutEn(e.target.value),
                rows: 5,
                placeholder: "About the hotel in English...",
                className: textareaClass
              }
            )
          ] })
        ] })
      ] }),
      submitStatus === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          role: "status",
          className: "font-[Hanken_Grotesk] text-[13px] text-primary flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", "aria-hidden": "true", children: "check_circle" }),
            locale === "ka" ? "პარამეტრები წარმატებით შეინახა" : "Settings saved successfully"
          ]
        }
      ),
      submitStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          role: "alert",
          className: "font-[Hanken_Grotesk] text-[13px] text-error flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", "aria-hidden": "true", children: "error" }),
            locale === "ka" ? "შეცდომა. გთხოვთ სცადოთ თავიდან." : "Something went wrong. Please try again."
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: isSubmitting,
          className: "bg-primary text-on-primary px-8 py-3 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2",
          children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "material-symbols-outlined text-[18px] animate-spin",
                "aria-hidden": "true",
                children: "progress_activity"
              }
            ),
            locale === "ka" ? "შენახვა..." : "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", "aria-hidden": "true", children: "save" }),
            locale === "ka" ? "შენახვა" : "Save Settings"
          ] })
        }
      ) })
    ] })
  ] });
}
const STATUS_STYLES = {
  pending: "bg-on-surface/10 text-on-surface-variant",
  confirmed: "bg-primary-container text-on-primary-container",
  checkedIn: "bg-primary-container text-on-primary-container",
  checkedOut: "bg-green-100 text-green-800",
  cancelled: "bg-error-container text-on-error-container",
  noShow: "bg-amber-100 text-amber-800"
};
function StatusBadge({ status }) {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: [
        "inline-block font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full whitespace-nowrap",
        STATUS_STYLES[status]
      ].join(" "),
      children: t(`admin.reservations.status.${status}`)
    }
  );
}
v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("checkedIn"),
  v.literal("checkedOut"),
  v.literal("cancelled"),
  v.literal("noShow")
);
v.union(
  v.literal("confirm"),
  v.literal("cancel"),
  v.literal("checkIn"),
  v.literal("checkOut"),
  v.literal("markNoShow")
);
const MS_PER_DAY = 864e5;
function nightCount(ci, co) {
  return Math.round((co - ci) / MS_PER_DAY);
}
const TRANSITIONS = {
  pending: { confirm: "confirmed", cancel: "cancelled" },
  confirmed: { checkIn: "checkedIn", cancel: "cancelled", markNoShow: "noShow" },
  checkedIn: { checkOut: "checkedOut" },
  checkedOut: {},
  cancelled: {},
  noShow: {}
};
function allowedTransitions(current) {
  return Object.keys(TRANSITIONS[current]);
}
const TRANSITION_ICONS$1 = {
  confirm: "check_circle",
  cancel: "cancel",
  checkIn: "login",
  checkOut: "logout",
  markNoShow: "person_off"
};
function ReservationRow({
  reservation,
  roomName,
  isSelected,
  onSelect,
  onTransition
}) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "ka" ? ka : enUS;
  const nights = nightCount(reservation.checkInDate, reservation.checkOutDate);
  const transitions = allowedTransitions(reservation.status);
  const handleClick = () => {
    onSelect(reservation);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: handleClick,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      },
      className: [
        "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border-b border-outline-variant/30 cursor-pointer transition-all duration-200",
        "hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/30",
        isSelected ? "bg-primary-container/20 border-l-2 border-l-primary" : "bg-surface-container-lowest"
      ].join(" "),
      "aria-selected": isSelected,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:contents", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-auto sm:w-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-mono font-semibold text-primary", children: reservation.referenceCode }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] sm:text-[14px] text-on-surface font-medium truncate block", children: reservation.guestFullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] sm:text-[12px] text-on-surface-variant truncate block", children: roomName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 hidden md:block text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[12px] text-on-surface whitespace-nowrap", children: [
              format(new Date(reservation.checkInDate), "d MMM", { locale: dateLocale }),
              " – ",
              format(new Date(reservation.checkOutDate), "d MMM", { locale: dateLocale })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[11px] text-on-surface-variant block", children: [
              nights,
              " ",
              t("admin.reservations.nights")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 hidden sm:block w-20 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface", children: [
            "$",
            Math.round(reservation.totalPrice)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: reservation.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 hidden sm:flex items-center gap-1", onClick: (e) => e.stopPropagation(), children: transitions.map((tr) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onTransition(reservation._id, tr);
              },
              title: t(`admin.reservations.action.${tr}`),
              className: "p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: TRANSITION_ICONS$1[tr] })
            },
            tr
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:hidden", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[11px] text-on-surface-variant", children: [
            format(new Date(reservation.checkInDate), "d MMM", { locale: dateLocale }),
            " – ",
            format(new Date(reservation.checkOutDate), "d MMM", { locale: dateLocale }),
            " · ",
            nights,
            " ",
            t("admin.reservations.nights")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold text-on-surface ml-auto", children: [
            "$",
            Math.round(reservation.totalPrice)
          ] }),
          transitions.map((tr) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onTransition(reservation._id, tr);
              },
              title: t(`admin.reservations.action.${tr}`),
              className: "p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px]", children: TRANSITION_ICONS$1[tr] })
            },
            tr
          ))
        ] })
      ]
    }
  );
}
const TRANSITION_ICONS = {
  confirm: "check_circle",
  cancel: "cancel",
  checkIn: "login",
  checkOut: "logout",
  markNoShow: "person_off"
};
function ReservationDetailPanel({
  reservation,
  roomName,
  onClose
}) {
  const { locale, t } = useI18n();
  const { sessionToken } = useAdminAuth();
  const transitionMutation = useMutation(api.reservations.transitionStatus);
  const dateLocale = locale === "ka" ? ka : enUS;
  const [cancelDialogOpen, setCancelDialogOpen] = reactExports.useState(false);
  const nights = nightCount(reservation.checkInDate, reservation.checkOutDate);
  const transitions = allowedTransitions(reservation.status);
  const handleTransition = async (transition) => {
    if (!sessionToken) return;
    if (transition === "cancel") {
      setCancelDialogOpen(true);
      return;
    }
    await transitionMutation({
      sessionToken,
      id: reservation._id,
      transition
    });
  };
  const handleConfirmCancel = async () => {
    if (!sessionToken) return;
    await transitionMutation({
      sessionToken,
      id: reservation._id,
      transition: "cancel"
    });
    setCancelDialogOpen(false);
  };
  function formatTimestamp(ts) {
    if (!ts) return "—";
    return format(new Date(ts), "d MMM yyyy, HH:mm", { locale: dateLocale });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-outline-variant/40 bg-surface-container-lowest rounded-sm mt-1 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/30 bg-surface-container-low", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[EB_Garamond] text-[18px] sm:text-[20px] text-primary", children: reservation.referenceCode }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: reservation.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          "aria-label": t("admin.common.close"),
          className: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full p-1.5 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[20px]", children: "close" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.guest") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface font-medium", children: reservation.guestFullName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.messages.email") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `mailto:${reservation.guestEmail}`,
              className: "font-[Hanken_Grotesk] text-[15px] text-secondary hover:underline",
              children: reservation.guestEmail
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("res.phone") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface", children: reservation.guestPhone })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.room") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface font-medium", children: roomName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.dates") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface", children: [
            format(new Date(reservation.checkInDate), "d MMM yyyy", { locale: dateLocale }),
            " – ",
            format(new Date(reservation.checkOutDate), "d MMM yyyy", { locale: dateLocale })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.nights") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface", children: nights })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.total") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface font-semibold", children: [
            "$",
            Math.round(reservation.totalPrice)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.guestCount") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface", children: reservation.guestCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.referenceCode") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[15px] text-on-surface font-mono", children: reservation.referenceCode })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.createdAt") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface", children: formatTimestamp(reservation.createdAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.checkedInAt") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface", children: formatTimestamp(reservation.checkedInAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.checkedOutAt") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface", children: formatTimestamp(reservation.checkedOutAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1", children: t("admin.reservations.cancelledAt") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface", children: formatTimestamp(reservation.cancelledAt) })
        ] })
      ] }),
      reservation.specialRequests && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-2", children: t("admin.reservations.specialRequests") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface-container-high rounded-sm p-4 border border-outline-variant/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface leading-relaxed whitespace-pre-wrap", children: reservation.specialRequests }) })
      ] }),
      transitions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 sm:gap-3 pt-3 border-t border-outline-variant/30 flex-wrap", children: transitions.map((tr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => void handleTransition(tr),
          className: [
            "flex items-center gap-2 px-4 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold transition-all duration-200",
            tr === "cancel" ? "border border-error text-error hover:bg-error/10" : "bg-primary text-on-primary hover:opacity-90"
          ].join(" "),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: TRANSITION_ICONS[tr] }),
            t(`admin.reservations.action.${tr}`)
          ]
        },
        tr
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationDialog,
      {
        isOpen: cancelDialogOpen,
        title: t("admin.reservations.confirmCancelTitle"),
        description: t("admin.reservations.confirmCancelDescription"),
        onConfirm: () => void handleConfirmCancel(),
        onCancel: () => setCancelDialogOpen(false),
        confirmLabel: t("admin.reservations.action.cancel"),
        cancelLabel: t("admin.common.cancel")
      }
    )
  ] });
}
const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "checkedIn",
  "checkedOut",
  "cancelled",
  "noShow"
];
function ReservationFilters({ criteria, onChange, rooms }) {
  const { locale, t } = useI18n();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const activeCount = [
    criteria.status !== "all",
    criteria.roomId !== null,
    criteria.checkInFrom !== null,
    criteria.checkInTo !== null,
    criteria.search !== ""
  ].filter(Boolean).length;
  const statusOptions = STATUS_OPTIONS.map((s) => ({
    value: s,
    label: s === "all" ? t("admin.reservations.filter.all") : t(`admin.reservations.status.${s}`)
  }));
  const roomOptions = [
    { value: "__all__", label: t("admin.reservations.filter.all") },
    ...rooms.map((r) => ({
      value: r._id,
      label: locale === "ka" ? r.nameKa : r.nameEn
    }))
  ];
  const handleClear = () => {
    onChange({
      status: "all",
      roomId: null,
      checkInFrom: null,
      checkInTo: null,
      search: ""
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-2 px-4 py-2.5 border border-outline-variant/40 hover:border-primary/40 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: "filter_list" }),
          locale === "ka" ? "ფილტრები" : "Filters",
          activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary text-on-primary text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center", children: activeCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px] ml-1 transition-transform duration-200", style: { transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }, children: "expand_more" })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-4 sm:p-5 border border-outline-variant/30 bg-surface-container-low rounded-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomSelect,
          {
            value: criteria.status,
            onChange: (val) => onChange({ ...criteria, status: val }),
            icon: "filter_list",
            label: t("admin.reservations.filter.status"),
            options: statusOptions
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomSelect,
          {
            value: criteria.roomId ?? "__all__",
            onChange: (val) => onChange({ ...criteria, roomId: val === "__all__" ? null : val }),
            icon: "bed",
            label: t("admin.reservations.filter.room"),
            options: roomOptions
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DatePicker,
          {
            value: criteria.checkInFrom ? new Date(criteria.checkInFrom) : null,
            onChange: (date) => onChange({ ...criteria, checkInFrom: date.getTime() }),
            placeholder: t("admin.reservations.filter.checkInFrom"),
            locale,
            icon: "calendar_today",
            label: t("admin.reservations.filter.checkInFrom")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DatePicker,
          {
            value: criteria.checkInTo ? new Date(criteria.checkInTo) : null,
            onChange: (date) => onChange({ ...criteria, checkInTo: date.getTime() }),
            placeholder: t("admin.reservations.filter.checkInTo"),
            locale,
            icon: "calendar_today",
            label: t("admin.reservations.filter.checkInTo")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block", children: t("admin.reservations.filter.search") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-primary text-[16px] absolute left-0 top-1/2 -translate-y-1/2", children: "search" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: criteria.search,
                onChange: (e) => onChange({ ...criteria, search: e.target.value }),
                placeholder: t("admin.reservations.filter.search"),
                className: "w-full pl-6 border-b border-outline py-2 font-[Hanken_Grotesk] text-[13px] text-on-surface bg-transparent focus:border-primary focus:outline-none transition-colors"
              }
            )
          ] })
        ] })
      ] }),
      activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-3 border-t border-outline-variant/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleClear,
          className: "flex items-center gap-1.5 font-[Hanken_Grotesk] text-[11px] font-semibold text-secondary hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[14px]", children: "close" }),
            locale === "ka" ? "ფილტრების გასუფთავება" : "Clear all filters"
          ]
        }
      ) })
    ] })
  ] });
}
function filterReservations(list, criteria) {
  return list.filter((r) => {
    if (criteria.status !== "all" && r.status !== criteria.status) return false;
    if (criteria.roomId && r.roomId !== criteria.roomId) return false;
    if (criteria.checkInFrom != null && r.checkInDate < criteria.checkInFrom)
      return false;
    if (criteria.checkInTo != null && r.checkInDate > criteria.checkInTo)
      return false;
    if (criteria.search) {
      const q = criteria.search.toLowerCase();
      const matches = r.guestFullName.toLowerCase().includes(q) || r.guestEmail.toLowerCase().includes(q) || r.referenceCode.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}
const ACTIVE_STATUSES = /* @__PURE__ */ new Set(["pending", "confirmed", "checkedIn"]);
const ARCHIVE_STATUSES = /* @__PURE__ */ new Set(["checkedOut", "cancelled", "noShow"]);
function ReservationsTab() {
  const { t, locale } = useI18n();
  const { sessionToken } = useAdminAuth();
  const [viewTab, setViewTab] = reactExports.useState("active");
  const [selectedReservation, setSelectedReservation] = reactExports.useState(null);
  const [criteria, setCriteria] = reactExports.useState({
    status: "all",
    roomId: null,
    checkInFrom: null,
    checkInTo: null,
    search: ""
  });
  const [cancelTarget, setCancelTarget] = reactExports.useState(null);
  const [calendarMonth, setCalendarMonth] = reactExports.useState(() => {
    const now = /* @__PURE__ */ new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const result = useQuery(
    api.reservations.listPaginated,
    sessionToken ? { sessionToken, paginationOpts: { numItems: 100, cursor: null } } : "skip"
  );
  const rooms = useQuery(api.rooms.list) ?? [];
  const transitionMutation = useMutation(api.reservations.transitionStatus);
  const reservations = result?.page ?? [];
  const roomNameMap = {};
  for (const room of rooms) {
    roomNameMap[room._id] = locale === "ka" ? room.nameKa : room.nameEn;
  }
  const activeReservations = reactExports.useMemo(
    () => reservations.filter((r) => ACTIVE_STATUSES.has(r.status)),
    [reservations]
  );
  const archiveReservations = reactExports.useMemo(
    () => reservations.filter((r) => ARCHIVE_STATUSES.has(r.status)),
    [reservations]
  );
  const currentList = viewTab === "active" ? activeReservations : archiveReservations;
  const filtered = filterReservations(currentList, criteria);
  const analytics = reactExports.useMemo(() => {
    const thisMonthStart = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).getTime();
    const lastMonthStart = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() - 1, 1).getTime();
    const completedStatuses = /* @__PURE__ */ new Set(["checkedOut", "confirmed", "checkedIn"]);
    const revenueReservations = reservations.filter((r) => completedStatuses.has(r.status));
    const totalRevenue = revenueReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const thisMonthRevenue = revenueReservations.filter((r) => r.createdAt >= thisMonthStart).reduce((sum, r) => sum + r.totalPrice, 0);
    const lastMonthRevenue = revenueReservations.filter((r) => r.createdAt >= lastMonthStart && r.createdAt < thisMonthStart).reduce((sum, r) => sum + r.totalPrice, 0);
    const totalBookings = reservations.length;
    const activeBookings = activeReservations.length;
    const completedBookings = reservations.filter((r) => r.status === "checkedOut").length;
    const cancelledBookings = reservations.filter((r) => r.status === "cancelled").length;
    const noShowBookings = reservations.filter((r) => r.status === "noShow").length;
    const avgBookingValue = revenueReservations.length > 0 ? totalRevenue / revenueReservations.length : 0;
    const occupancyNights = revenueReservations.reduce((sum, r) => sum + Math.round((r.checkOutDate - r.checkInDate) / 864e5), 0);
    const cancellationRate = totalBookings > 0 ? Math.round(cancelledBookings / totalBookings * 100) : 0;
    return { totalRevenue, thisMonthRevenue, lastMonthRevenue, totalBookings, activeBookings, completedBookings, cancelledBookings, noShowBookings, avgBookingValue: Math.round(avgBookingValue), occupancyNights, cancellationRate };
  }, [reservations, activeReservations]);
  const calendarData = reactExports.useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayMs = Date.UTC(year, month, d);
      const dayReservations = reservations.filter((r) => {
        return r.checkInDate <= dayMs && r.checkOutDate > dayMs;
      });
      days.push({ date: d, reservations: dayReservations });
    }
    return { days, firstDayOfWeek, year, month, daysInMonth };
  }, [calendarMonth, reservations]);
  const handleSelectReservation = (reservation) => {
    setSelectedReservation(selectedReservation?._id === reservation._id ? null : reservation);
  };
  const handleCloseDetail = () => setSelectedReservation(null);
  const handleTransition = async (id, transition) => {
    if (!sessionToken) return;
    if (transition === "cancel") {
      setCancelTarget(id);
      return;
    }
    await transitionMutation({ sessionToken, id, transition });
  };
  const handleConfirmCancel = async () => {
    if (!sessionToken || !cancelTarget) return;
    await transitionMutation({ sessionToken, id: cancelTarget, transition: "cancel" });
    setCancelTarget(null);
  };
  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  const monthLabel = calendarMonth.toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US", { month: "long", year: "numeric" });
  const weekDays = locale === "ka" ? ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary", children: t("admin.reservations.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] text-on-surface-variant", children: locale === "ka" ? `სულ ${reservations.length} რეზერვაცია` : `${reservations.length} total reservations` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-6 border-b border-outline-variant/30", children: [
      { key: "active", icon: "event_available", label: locale === "ka" ? "აქტიური" : "Active", count: activeReservations.length },
      { key: "archive", icon: "inventory_2", label: locale === "ka" ? "არქივი" : "Archive", count: archiveReservations.length },
      { key: "calendar", icon: "calendar_month", label: locale === "ka" ? "კალენდარი" : "Calendar", count: null }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setViewTab(tab.key),
        className: [
          "flex items-center gap-1.5 px-3 sm:px-4 py-3 font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold transition-colors border-b-2 -mb-px",
          viewTab === tab.key ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30"
        ].join(" "),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: tab.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: tab.label }),
          tab.count !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center", children: tab.count })
        ]
      },
      tab.key
    )) }),
    (viewTab === "active" || viewTab === "archive") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationFilters, { criteria, onChange: setCriteria, rooms }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[48px] mb-4 block opacity-40", children: viewTab === "active" ? "event_available" : "inventory_2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: viewTab === "active" ? locale === "ka" ? "აქტიური რეზერვაციები არ არის" : "No active reservations" : locale === "ka" ? "არქივი ცარიელია" : "No archived reservations" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-outline-variant/30 rounded-sm overflow-hidden", children: filtered.map((reservation) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReservationRow,
          {
            reservation,
            roomName: roomNameMap[reservation.roomId] ?? "—",
            isSelected: selectedReservation?._id === reservation._id,
            onSelect: handleSelectReservation,
            onTransition: (id, tr) => void handleTransition(id, tr)
          }
        ),
        selectedReservation?._id === reservation._id && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReservationDetailPanel,
          {
            reservation: selectedReservation,
            roomName: roomNameMap[reservation.roomId] ?? "—",
            onClose: handleCloseDetail
          }
        )
      ] }, reservation._id)) })
    ] }),
    viewTab === "calendar" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-outline-variant/30 rounded-sm overflow-hidden bg-surface-container-lowest", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 sm:px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: prevMonth, className: "p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors", "aria-label": "Previous month", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[20px]", children: "chevron_left" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[Hanken_Grotesk] text-[14px] sm:text-[16px] font-semibold text-primary capitalize", children: monthLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: nextMonth, className: "p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors", "aria-label": "Next month", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[20px]", children: "chevron_right" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 border-b border-outline-variant/20", children: weekDays.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2 text-center font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant", children: day }, day)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7", children: [
        Array.from({ length: calendarData.firstDayOfWeek }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60px] sm:min-h-[80px] border-b border-r border-outline-variant/10 bg-surface-container-low/30" }, `empty-${i}`)),
        calendarData.days.map(({ date, reservations: dayRes }) => {
          const isToday = (() => {
            const now = /* @__PURE__ */ new Date();
            return date === now.getDate() && calendarData.month === now.getMonth() && calendarData.year === now.getFullYear();
          })();
          const isPast = (() => {
            const dayMs = Date.UTC(calendarData.year, calendarData.month, date);
            return dayMs < Date.UTC((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), (/* @__PURE__ */ new Date()).getDate());
          })();
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: ["min-h-[60px] sm:min-h-[80px] p-1 sm:p-1.5 border-b border-r border-outline-variant/10 relative", isToday ? "bg-primary/5" : isPast ? "bg-surface-container-low/20" : ""].join(" "), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: ["font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold block mb-0.5", isToday ? "text-primary" : isPast ? "text-on-surface-variant/50" : "text-on-surface-variant"].join(" "), children: date }),
            dayRes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              dayRes.slice(0, 3).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: ["text-[7px] sm:text-[9px] font-[Hanken_Grotesk] font-semibold px-1 py-0.5 rounded-sm truncate", getStatusColor(r.status)].join(" "), title: `${r.guestFullName} - ${roomNameMap[r.roomId] ?? ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: r.guestFullName.split(" ")[0] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: r.guestFullName.charAt(0) })
              ] }, r._id)),
              dayRes.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-[Hanken_Grotesk] text-on-surface-variant font-semibold px-1", children: [
                "+",
                dayRes.length - 3
              ] })
            ] })
          ] }, date);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 py-3 border-t border-outline-variant/20 flex flex-wrap items-center gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-sm bg-amber-100 border border-amber-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant", children: locale === "ka" ? "მოლოდინში" : "Pending" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-sm bg-blue-100 border border-blue-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant", children: locale === "ka" ? "დადასტურებული" : "Confirmed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-sm bg-green-100 border border-green-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant", children: locale === "ka" ? "შესული" : "Checked In" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-sm bg-slate-100 border border-slate-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant", children: locale === "ka" ? "გასული" : "Checked Out" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-sm bg-red-100 border border-red-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant", children: locale === "ka" ? "გაუქმებული" : "Cancelled" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 pt-8 border-t border-outline-variant/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-[EB_Garamond] text-[20px] sm:text-[24px] text-primary mb-5", children: locale === "ka" ? "შემოსავლები და ანალიტიკა" : "Revenue & Analytics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "payments", label: locale === "ka" ? "მთლიანი შემოსავალი" : "Total Revenue", value: `₾${Math.round(analytics.totalRevenue).toLocaleString()}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "calendar_month", label: locale === "ka" ? "ამ თვის შემოსავალი" : "This Month", value: `₾${Math.round(analytics.thisMonthRevenue).toLocaleString()}`, subtext: analytics.lastMonthRevenue > 0 ? `${locale === "ka" ? "წინა თვე" : "Last month"}: ₾${Math.round(analytics.lastMonthRevenue).toLocaleString()}` : void 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "avg_pace", label: locale === "ka" ? "საშუალო ღირებულება" : "Avg. Booking Value", value: `₾${analytics.avgBookingValue.toLocaleString()}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "dark_mode", label: locale === "ka" ? "სულ ღამეები" : "Total Nights Sold", value: String(analytics.occupancyNights) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "book_online", label: locale === "ka" ? "სულ ჯავშნები" : "Total Bookings", value: String(analytics.totalBookings) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "event_available", label: locale === "ka" ? "აქტიური" : "Active", value: String(analytics.activeBookings) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "check_circle", label: locale === "ka" ? "დასრულებული" : "Completed", value: String(analytics.completedBookings) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "cancel", label: locale === "ka" ? "გაუქმებული" : "Cancelled", value: String(analytics.cancelledBookings), subtext: `${analytics.cancellationRate}% ${locale === "ka" ? "გაუქმების მაჩვენებელი" : "cancellation rate"}` })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationDialog,
      {
        isOpen: cancelTarget !== null,
        title: t("admin.reservations.confirmCancelTitle"),
        description: t("admin.reservations.confirmCancelDescription"),
        onConfirm: () => void handleConfirmCancel(),
        onCancel: () => setCancelTarget(null),
        confirmLabel: t("admin.reservations.action.cancel"),
        cancelLabel: t("admin.common.cancel")
      }
    )
  ] });
}
function getStatusColor(status) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "checkedIn":
      return "bg-green-100 text-green-800";
    case "checkedOut":
      return "bg-slate-100 text-slate-600";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "noShow":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}
function StatCard({ icon, label, value, subtext }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-container-lowest border border-outline-variant/30 p-3 sm:p-4 flex flex-col gap-1.5 hover:border-primary/30 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[16px] text-secondary", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant truncate", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[EB_Garamond] text-[22px] sm:text-[28px] leading-none text-primary", children: value }),
    subtext && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant", children: subtext })
  ] });
}
object({
  tab: _enum(["analytics", "rooms", "reservations", "gallery", "sponsors", "messages", "settings"]).default("analytics")
});
class AdminErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-24 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[48px] text-error/60", children: "error" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[EB_Garamond] text-[24px] text-primary", children: "Something went wrong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface-variant", children: this.state.error?.message ?? "An unexpected error occurred." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => this.setState({
          hasError: false,
          error: null
        }), className: "bg-primary text-on-primary px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity", children: "Try Again" })
      ] });
    }
    return this.props.children;
  }
}
const TAB_COMPONENTS = {
  analytics: AnalyticsTab,
  rooms: RoomsTab,
  reservations: ReservationsTab,
  gallery: GalleryTab,
  sponsors: SponsorsTab,
  messages: MessagesTab,
  settings: SettingsTab
};
function AdminLayoutComponent() {
  const {
    tab
  } = Route$1.useSearch();
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = reactExports.useState(null);
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const token = localStorage.getItem("adminSessionToken");
    if (!token) {
      setIsAuthed(false);
      void navigate({
        to: "/admin/login",
        search: {
          redirect: window.location.pathname + window.location.search
        }
      });
    } else {
      setIsAuthed(true);
    }
  }, [navigate]);
  if (!isAuthed) return null;
  const TabComponent = TAB_COMPONENTS[tab];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { activeTab: tab, isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed top-0 left-0 right-0 z-30 lg:hidden bg-surface-container-low border-b border-outline-variant/50 px-4 py-3 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarOpen(true), className: "p-1.5 text-primary hover:bg-surface-container-high rounded-full transition-colors", "aria-label": "Open menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[24px]", children: "menu" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[EB_Garamond] text-[20px] leading-[1.4] font-medium text-primary", children: "Kai Admin" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "lg:ml-64 flex-1 min-h-screen px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pt-16 lg:pt-10 max-w-[1280px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabComponent, {}) })
    ] })
  ] });
}
export {
  AdminLayoutComponent as component
};

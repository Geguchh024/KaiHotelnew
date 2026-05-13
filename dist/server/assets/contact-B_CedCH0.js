import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { a as api } from "./api-B4qLQuEf.js";
import { u as useI18n } from "./router-BPQh_9EZ.js";
import { N as Navbar, F as Footer } from "./Footer-B-hn7Oto.js";
import "convex/server";
import "@tanstack/react-router";
import "zod";
function ContactPage() {
  const {
    locale
  } = useI18n();
  const siteSettings = useQuery(api.siteSettings.get);
  const submitMessage = useMutation(api.messages.submit);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("general");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !body.trim()) {
      setError(locale === "ka" ? "გთხოვთ შეავსოთ ყველა სავალდებულო ველი" : "Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitMessage({
        senderName: name.trim(),
        email: email.trim(),
        inquiryType,
        body: body.trim()
      });
      setIsSuccess(true);
      setName("");
      setEmail("");
      setInquiryType("general");
      setBody("");
    } catch {
      setError(locale === "ka" ? "შეცდომა. გთხოვთ სცადოთ თავიდან." : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const inquiryOptions = [{
    value: "general",
    label: locale === "ka" ? "ზოგადი კითხვა" : "General Inquiry"
  }, {
    value: "reservation",
    label: locale === "ka" ? "ნომრის ხელმისაწვდომობა" : "Room Availability & Special Requests"
  }, {
    value: "feedback",
    label: locale === "ka" ? "უკუკავშირი" : "Feedback"
  }, {
    value: "complaint",
    label: locale === "ka" ? "საჩივარი" : "Complaint"
  }, {
    value: "other",
    label: locale === "ka" ? "სხვა" : "Other"
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsxs("section", { className: "pt-32 pb-10 px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20", children: [
        /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-3", children: locale === "ka" ? "მოთხოვნა" : "Inquiry" }),
        /* @__PURE__ */ jsx("h1", { className: "font-[EB_Garamond] text-[40px] md:text-[52px] leading-[1.1] text-primary", children: locale === "ka" ? "კონსიერჟთან დაკავშირება" : "Connect with the Concierge" })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "border-b border-outline-variant/20 bg-surface-container-low", children: /* @__PURE__ */ jsxs("div", { className: "px-8 max-w-[1280px] mx-auto py-10 grid grid-cols-1 sm:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border border-outline-variant/40 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[20px]", children: "call" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-1", children: locale === "ka" ? "ტელეფონი" : "Phone" }),
            /* @__PURE__ */ jsx("a", { href: `tel:${siteSettings?.phone ?? "+995511222028"}`, className: "font-[Hanken_Grotesk] text-[14px] text-on-surface hover:text-primary transition-colors", children: siteSettings?.phone ?? "+995 511 222 028" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border border-outline-variant/40 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[20px]", children: "mail" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-1", children: locale === "ka" ? "ელ-ფოსტა" : "Email" }),
            /* @__PURE__ */ jsx("a", { href: `mailto:${siteSettings?.email ?? "info@kai.com.ge"}`, className: "font-[Hanken_Grotesk] text-[14px] text-on-surface hover:text-primary transition-colors", children: siteSettings?.email ?? "info@kai.com.ge" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border border-outline-variant/40 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-primary text-[20px]", children: "location_on" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-1", children: locale === "ka" ? "მისამართი" : "Address" }),
            /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[14px] text-on-surface", children: locale === "ka" ? siteSettings?.addressKa ?? "საქართველო" : siteSettings?.addressEn ?? "Georgia" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20 px-8 max-w-[1280px] mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-20 items-start", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-4", children: locale === "ka" ? "შეტყობინება" : "Message" }),
          /* @__PURE__ */ jsx("h2", { className: "font-[EB_Garamond] text-[36px] md:text-[44px] leading-[1.15] text-primary mb-6", children: locale === "ka" ? "გვიამბეთ თქვენი სურვილების შესახებ" : "Tell Us How We Can Help" }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[15px] leading-[1.7] text-secondary mb-10", children: locale === "ka" ? "გაქვთ შეკითხვა ნომრების, ღონისძიებების ან სპეციალური მოთხოვნების შესახებ? ჩვენი გუნდი მზადაა დაგეხმაროთ." : "Whether you have questions about rooms, events, or special requests — our team is ready to assist you with every detail of your stay." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
            siteSettings?.facebookUrl && /* @__PURE__ */ jsxs("a", { href: siteSettings.facebookUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-3 text-secondary hover:text-primary transition-colors group", children: [
              /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[20px]", children: "public" }),
              /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] group-hover:underline underline-offset-2", children: "Facebook" })
            ] }),
            siteSettings?.instagramUrl && /* @__PURE__ */ jsxs("a", { href: siteSettings.instagramUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-3 text-secondary hover:text-primary transition-colors group", children: [
              /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[20px]", children: "photo_camera" }),
              /* @__PURE__ */ jsx("span", { className: "font-[Hanken_Grotesk] text-[13px] group-hover:underline underline-offset-2", children: "Instagram" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { children: isSuccess ? /* @__PURE__ */ jsxs("div", { className: "border border-outline-variant/30 bg-surface-container-low p-12 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[48px] text-primary block mb-5", style: {
            fontVariationSettings: "'FILL' 1"
          }, children: "check_circle" }),
          /* @__PURE__ */ jsx("h3", { className: "font-[EB_Garamond] text-[28px] text-primary mb-3", children: locale === "ka" ? "შეტყობინება გაიგზავნა" : "Message Sent" }),
          /* @__PURE__ */ jsx("p", { className: "font-[Hanken_Grotesk] text-[14px] text-secondary mb-8 leading-[1.6]", children: locale === "ka" ? "მადლობა. ჩვენი გუნდი მალე დაგიკავშირდებათ." : "Thank you for reaching out. Our team will be in touch with you shortly." }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsSuccess(false), className: "font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border border-primary px-8 py-2.5 hover:bg-primary/5 transition-colors", children: locale === "ka" ? "ახალი შეტყობინება" : "Send Another" })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: locale === "ka" ? "სახელი" : "Name" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-secondary/40", placeholder: locale === "ka" ? "თქვენი სახელი" : "Your full name", disabled: isSubmitting })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: locale === "ka" ? "ელ-ფოსტა" : "Email" }),
            /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-secondary/40", placeholder: "your@email.com", disabled: isSubmitting })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: locale === "ka" ? "მოთხოვნის ტიპი" : "Nature of Inquiry" }),
            /* @__PURE__ */ jsx("select", { value: inquiryType, onChange: (e) => setInquiryType(e.target.value), className: "bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors appearance-none cursor-pointer", disabled: isSubmitting, children: inquiryOptions.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("label", { className: "font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary", children: locale === "ka" ? "შეტყობინება" : "Message" }),
            /* @__PURE__ */ jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), rows: 5, className: "bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors resize-none placeholder:text-secondary/40", placeholder: locale === "ka" ? "როგორ შეგვიძლია დაგეხმაროთ?" : "How can we assist in your decompression?", disabled: isSubmitting })
          ] }),
          error && /* @__PURE__ */ jsx("p", { className: "md:col-span-2 font-[Hanken_Grotesk] text-[12px] text-error", children: error }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2 pt-4", children: /* @__PURE__ */ jsxs("button", { type: "submit", disabled: isSubmitting, className: "bg-primary text-on-primary px-12 py-3.5 font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2", children: [
            isSubmitting && /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[16px] animate-spin", children: "progress_activity" }),
            isSubmitting ? locale === "ka" ? "იგზავნება..." : "Sending..." : locale === "ka" ? "შეტყობინების გაგზავნა" : "Send Inquiry"
          ] }) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  ContactPage as component
};

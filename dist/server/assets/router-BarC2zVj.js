import { createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, createContext, useContext } from "react";
const translations = {
  ka: {
    // Nav
    "nav.rooms": "ნომრები",
    "nav.amenities": "სერვისები",
    "nav.reviews": "შეფასებები",
    "nav.contact": "კონტაქტი",
    "nav.bookNow": "დაჯავშნე",
    // Hero
    "hero.welcome": "kai hotel bar",
    "hero.title": "აღმოაჩინეთ ფუფუნების, კომფორტისა და ღირებულების სრულყოფილი ბალანსი",
    "hero.subtitle": "თქვენი სახლი სახლიდან მოშორებით.",
    "hero.exploreRooms": "ნომრების ნახვა",
    "hero.viewAmenities": "სერვისების ნახვა",
    // Booking
    "booking.title": "სწრაფი დაჯავშნა",
    "booking.checkin": "შესვლა",
    "booking.checkout": "გასვლა",
    "booking.guests": "სტუმრები",
    "booking.roomType": "ნომრის ტიპი",
    "booking.selectDate": "აირჩიეთ თარიღი",
    "booking.checkAvailability": "ხელმისაწვდომობის შემოწმება",
    "booking.notAvailable": "ვებსაიტზე ჯავშანი ჯერ არ არის ხელმისაწვდომი",
    "booking.bookOnBooking": "დაჯავშნეთ Booking.com-ზე",
    "booking.untilAvailable": "სანამ ხელმისაწვდომი გახდება, შეგიძლიათ დაჯავშნოთ booking.com-ზე",
    // Rooms
    "rooms.label": "ჩვენი ნომრები",
    "rooms.title": "ჩვენი ნომრები",
    "rooms.description": "ყოველი ნომერი შექმნილია ჩვენი სტუმრებისთვის სრულყოფილი დასვენების უზრუნველსაყოფად.",
    "rooms.viewAll": "ყველას ნახვა",
    // Amenities
    "amenities.label": "სერვისები",
    "amenities.title": "სასტუმროს სერვისები",
    "amenities.description": "აღმოაჩინეთ განსაკუთრებული სერვისები, რომლებიც თქვენს ყოფნას Kai Hotel-ში დაუვიწყარს გახდის.",
    "amenities.wifi": "Wi-Fi",
    "amenities.shuttle": "აეროპორტის ტრანსფერი",
    "amenities.parking": "კერძო პარკინგი",
    "amenities.family": "საოჯახო ნომრები",
    "amenities.nonSmoking": "არამწეველთა ნომრები",
    "amenities.reception": "24-საათიანი რეცეფცია",
    "amenities.terrace": "ტერასა",
    "amenities.garden": "ბაღი",
    // Reviews
    "reviews.label": "შეფასებები",
    "reviews.title": "სტუმრების შეფასებები",
    "reviews.description": "ნახეთ რას ამბობენ ჩვენი სტუმრები Kai Hotel-ში გატარებულ გამოცდილებაზე.",
    "reviews.review1.name": "გიორგი გიორგობიანი",
    "reviews.review1.country": "საქართველო",
    "reviews.review1.text": "ძალიან კარგი სერვისი, გარემო და კომფორტი. საუკეთესო თანამშრომლები. წარმატებები",
    "reviews.review2.name": "Suzanne Jordan",
    "reviews.review2.country": "შოტლანდია",
    "reviews.review2.text": "მიყვარს ეს სასტუმრო, შესანიშნავი პერსონალი, ძალიან მეგობრული და დამხმარე! შესანიშნავი ლოკაცია და ძალიან ახლოს მატარებლის სადგურთან!",
    "reviews.review3.name": "John Reid",
    "reviews.review3.country": "აშშ",
    "reviews.review3.text": "მშვენიერი სასტუმრო შესანიშნავ ლოკაციაზე. ნომრები უმწიკვლოდ სუფთაა, საუზმე უხვია. პერსონალი ძალიან დამხმარეა.",
    // Reservation Page
    "res.title": "ნომრის დაჯავშნა",
    "res.subtitle": "აირჩიეთ თარიღები, ნომრის ტიპი და შეავსეთ თქვენი ინფორმაცია რეზერვაციის დასასრულებლად.",
    "res.step1": "თარიღები და ნომერი",
    "res.step2": "სტუმრის ინფორმაცია",
    "res.step3": "დადასტურება",
    "res.dates": "აირჩიეთ თარიღები",
    "res.selectRoom": "აირჩიეთ ნომერი",
    "res.available": "ხელმისაწვდომი",
    "res.unavailable": "მიუწვდომელი",
    "res.perNight": "/ ღამე",
    "res.nights": "ღამე",
    "res.total": "ჯამი",
    "res.guestInfo": "სტუმრის ინფორმაცია",
    "res.firstName": "სახელი",
    "res.lastName": "გვარი",
    "res.email": "ელ-ფოსტა",
    "res.phone": "ტელეფონი",
    "res.country": "ქვეყანა",
    "res.specialRequests": "სპეციალური მოთხოვნები",
    "res.specialRequestsPlaceholder": "ნებისმიერი სპეციალური მოთხოვნა ან შენიშვნა...",
    "res.next": "შემდეგი",
    "res.back": "უკან",
    "res.confirm": "რეზერვაციის დადასტურება",
    "res.summary": "ჯავშნის შეჯამება",
    "res.roomDetails": "ნომრის დეტალები",
    "res.guestDetails": "სტუმრის დეტალები",
    "res.payAtHotel": "გადახდა სასტუმროში",
    "res.payAtHotelDesc": "გადახდა ხდება ჩასვლისას. გაუქმება უფასოა 24 საათით ადრე.",
    "res.success": "რეზერვაცია წარმატებით დასრულდა!",
    "res.successDesc": "დადასტურების ელ-ფოსტა გამოგეგზავნებათ მალე.",
    "res.backToHome": "მთავარ გვერდზე დაბრუნება",
    "res.capacity": "ტევადობა",
    "res.size": "ფართობი",
    "res.amenitiesIncluded": "შეიცავს",
    "res.selected": "არჩეული",
    "res.select": "არჩევა",
    // Footer
    "footer.phone": "+995 511 222 028",
    "footer.copyright": "© 2025 Kai Hotel. ყველა უფლება დაცულია.",
    "footer.partners": "ჩვენი პარტნიორები"
  },
  en: {
    // Nav
    "nav.rooms": "Rooms",
    "nav.amenities": "Amenities",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",
    "nav.bookNow": "Book Now",
    // Hero
    "hero.welcome": "kai hotel bar",
    "hero.title": "Discover the perfect balance of luxury, comfort, and value",
    "hero.subtitle": "Your home away from home.",
    "hero.exploreRooms": "Explore Rooms",
    "hero.viewAmenities": "View Amenities",
    // Booking
    "booking.title": "Quick Booking",
    "booking.checkin": "Check-in",
    "booking.checkout": "Check-out",
    "booking.guests": "Guests",
    "booking.roomType": "Room Type",
    "booking.selectDate": "Select Date",
    "booking.checkAvailability": "Check Availability",
    "booking.notAvailable": "Booking on website is not available yet",
    "booking.bookOnBooking": "Book on Booking.com",
    "booking.untilAvailable": "Until it's available, you can book on booking.com",
    // Rooms
    "rooms.label": "Our Rooms",
    "rooms.title": "Our Rooms",
    "rooms.description": "Each room is designed to provide the perfect stay for our guests.",
    "rooms.viewAll": "View All",
    // Amenities
    "amenities.label": "Amenities",
    "amenities.title": "Hotel Amenities",
    "amenities.description": "Discover the exceptional amenities and services that make your stay at Kai Hotel an unforgettable experience.",
    "amenities.wifi": "Wi-Fi",
    "amenities.shuttle": "Airport Shuttle",
    "amenities.parking": "Private Parking",
    "amenities.family": "Family Rooms",
    "amenities.nonSmoking": "Non-Smoking Rooms",
    "amenities.reception": "24-Hour Reception",
    "amenities.terrace": "Terrace",
    "amenities.garden": "Garden",
    // Reviews
    "reviews.label": "Reviews",
    "reviews.title": "Guest Reviews",
    "reviews.description": "See what our guests have to say about their experience at Kai Hotel.",
    "reviews.review1.name": "გიორგი გიორგობიანი",
    "reviews.review1.country": "Georgia",
    "reviews.review1.text": "ძალიან კარგი სერვისი, გარემო და კომფორტი. საუკეთესო თანამშრომლები. წარმატებები",
    "reviews.review2.name": "Suzanne Jordan",
    "reviews.review2.country": "Scotland",
    "reviews.review2.text": "Love this hotel, great staff service, very friendly and helpful! Great location and very close from the train station! Will be back in a near future!",
    "reviews.review3.name": "John Reid",
    "reviews.review3.country": "United States",
    "reviews.review3.text": "Lovely hotel in an excellent location. Rooms are spotless & cleaned daily, breakfast is plentiful. Staff are very helpful.",
    // Reservation Page
    "res.title": "Reserve a Room",
    "res.subtitle": "Select your dates, choose a room type, and fill in your details to complete the reservation.",
    "res.step1": "Dates & Room",
    "res.step2": "Guest Information",
    "res.step3": "Confirmation",
    "res.dates": "Select Dates",
    "res.selectRoom": "Select a Room",
    "res.available": "Available",
    "res.unavailable": "Unavailable",
    "res.perNight": "/ night",
    "res.nights": "nights",
    "res.total": "Total",
    "res.guestInfo": "Guest Information",
    "res.firstName": "First Name",
    "res.lastName": "Last Name",
    "res.email": "Email",
    "res.phone": "Phone",
    "res.country": "Country",
    "res.specialRequests": "Special Requests",
    "res.specialRequestsPlaceholder": "Any special requests or notes...",
    "res.next": "Next",
    "res.back": "Back",
    "res.confirm": "Confirm Reservation",
    "res.summary": "Booking Summary",
    "res.roomDetails": "Room Details",
    "res.guestDetails": "Guest Details",
    "res.payAtHotel": "Pay at Hotel",
    "res.payAtHotelDesc": "Payment is collected upon arrival. Free cancellation up to 24 hours before.",
    "res.success": "Reservation Confirmed!",
    "res.successDesc": "A confirmation email will be sent to you shortly.",
    "res.backToHome": "Back to Home",
    "res.capacity": "Capacity",
    "res.size": "Size",
    "res.amenitiesIncluded": "Includes",
    "res.selected": "Selected",
    "res.select": "Select",
    // Footer
    "footer.phone": "+995 511 222 028",
    "footer.copyright": "© 2025 Kai Hotel. All rights reserved.",
    "footer.partners": "Our Partners"
  }
};
const I18nContext = createContext(null);
function I18nProvider({ children }) {
  const [locale, setLocale] = useState("ka");
  const t = (key) => {
    return translations[locale][key] || key;
  };
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value: { locale, setLocale, t }, children });
}
function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
const Route$2 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Kai Hotel Bar | ბოტანიკური სიმშვიდე"
      }
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Hanken+Grotesk:wght@400;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      }
    ]
  }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "ka", className: "scroll-smooth", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "bg-background text-on-surface", children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$1 = () => import("./reservations-BSKCbP6l.js");
const Route$1 = createFileRoute("/reservations")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-fokMHR94.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ReservationsRoute = Route$1.update({
  id: "/reservations",
  path: "/reservations",
  getParentRoute: () => Route$2
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2
});
const rootRouteChildren = {
  IndexRoute,
  ReservationsRoute
};
const routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  useI18n as u
};

import { createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState, createContext, useContext, useCallback } from "react";
import { z } from "zod";
const translations = {
  ka: {
    // Nav
    "nav.home": "მთავარი",
    "nav.rooms": "ნომრები",
    "nav.gallery": "გალერეა",
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
    "res.successDesc": "შეინახეთ საცნობარო კოდი — ის დაგჭირდებათ ჩასვლისას.",
    "res.backToHome": "მთავარ გვერდზე დაბრუნება",
    "res.capacity": "ტევადობა",
    "res.size": "ფართობი",
    "res.amenitiesIncluded": "შეიცავს",
    "res.selected": "არჩეული",
    "res.select": "არჩევა",
    // Footer
    "footer.phone": "+995 511 222 028",
    "footer.copyright": "© 2025 Kai Hotel. ყველა უფლება დაცულია.",
    "footer.partners": "ჩვენი პარტნიორები",
    // Admin Panel
    // Admin — Sidebar
    "admin.sidebar.title": "Kai ადმინი",
    "admin.sidebar.subtitle": "Botanical Suite",
    "admin.sidebar.analytics": "ანალიტიკა",
    "admin.sidebar.rooms": "ნომრები",
    "admin.sidebar.gallery": "გალერეა",
    "admin.sidebar.sponsors": "სპონსორები",
    "admin.sidebar.messages": "შეტყობინებები",
    "admin.sidebar.settings": "პარამეტრები",
    "admin.sidebar.logout": "გასვლა",
    "admin.sidebar.toggleLanguage": "ენის შეცვლა",
    // Admin — Login
    "admin.login.title": "Kai Hotel Bar",
    "admin.login.subtitle": "Admin Panel",
    "admin.login.username": "მომხმარებელი",
    "admin.login.password": "პაროლი",
    "admin.login.submit": "შესვლა",
    "admin.login.submitting": "შესვლა...",
    "admin.login.error": "არასწორი მონაცემები",
    // Admin — Header
    "admin.header.welcome": "გამარჯობა, ადმინისტრატორ",
    // Admin — Analytics
    "admin.analytics.rooms": "ნომრები",
    "admin.analytics.roomsSupporting": "სულ ნომრები",
    "admin.analytics.gallery": "გალერეა",
    "admin.analytics.gallerySupporting": "სულ სურათები",
    "admin.analytics.sponsors": "სპონსორები",
    "admin.analytics.sponsorsSupporting": "სულ სპონსორები",
    "admin.analytics.unreadMessages": "წაუკითხავი შეტყობინებები",
    "admin.analytics.unreadMessagesSupporting": "ახალი შეტყობინებები",
    // Admin — Rooms
    "admin.rooms.title": "ნომრები",
    "admin.rooms.addRoom": "ნომრის დამატება",
    "admin.rooms.editRoom": "ნომრის რედაქტირება",
    "admin.rooms.noRooms": "ნომრები არ არის",
    "admin.rooms.deleteTitle": "ნომრის წაშლა",
    "admin.rooms.nameKa": "სახელი (ქართული)",
    "admin.rooms.nameEn": "სახელი (ინგლისური)",
    "admin.rooms.descriptionKa": "აღწერა (ქართული)",
    "admin.rooms.descriptionEn": "აღწერა (ინგლისური)",
    "admin.rooms.pricePerNight": "ფასი ღამეში ($)",
    "admin.rooms.capacity": "ტევადობა (სტუმრები)",
    "admin.rooms.amenities": "სერვისები (მძიმით გამოყოფილი)",
    "admin.rooms.image": "სურათი",
    // Admin — Gallery
    "admin.gallery.title": "გალერეა",
    "admin.gallery.uploadImage": "სურათის ატვირთვა",
    "admin.gallery.noImages": "სურათები არ არის",
    "admin.gallery.altText": "Alt ტექსტი",
    "admin.gallery.displayOrder": "ჩვენების თანმიმდევრობა",
    "admin.gallery.deleteTitle": "სურათის წაშლა",
    // Admin — Sponsors
    "admin.sponsors.title": "სპონსორები",
    "admin.sponsors.addSponsor": "სპონსორის დამატება",
    "admin.sponsors.editSponsor": "სპონსორის რედაქტირება",
    "admin.sponsors.noSponsors": "სპონსორები არ არის",
    "admin.sponsors.name": "სახელი",
    "admin.sponsors.websiteUrl": "ვებსაიტი",
    "admin.sponsors.displayOrder": "ჩვენების რიგი",
    "admin.sponsors.logo": "ლოგო",
    "admin.sponsors.deleteTitle": "სპონსორის წაშლა",
    // Admin — Messages
    "admin.messages.title": "შეტყობინებები",
    "admin.messages.noMessages": "შეტყობინებები არ არის",
    "admin.messages.sender": "გამგზავნი",
    "admin.messages.email": "ელ-ფოსტა",
    "admin.messages.inquiryType": "მოთხოვნის ტიპი",
    "admin.messages.submittedAt": "გაგზავნის თარიღი",
    "admin.messages.message": "შეტყობინება",
    "admin.messages.details": "შეტყობინების დეტალები",
    // Admin — Settings
    "admin.settings.title": "საიტის პარამეტრები",
    "admin.settings.subtitle": "განაახლეთ სასტუმროს საკონტაქტო ინფორმაცია და სოციალური ქსელები",
    "admin.settings.contactInfo": "საკონტაქტო ინფორმაცია",
    "admin.settings.phone": "ტელეფონი *",
    "admin.settings.email": "ელ-ფოსტა *",
    "admin.settings.addressKa": "მისამართი (ქართული)",
    "admin.settings.addressEn": "მისამართი (ინგლისური)",
    "admin.settings.socialMedia": "სოციალური ქსელები",
    "admin.settings.instagramUrl": "Instagram URL",
    "admin.settings.facebookUrl": "Facebook URL",
    "admin.settings.about": "სასტუმროს შესახებ",
    "admin.settings.aboutKa": "შესახებ (ქართული)",
    "admin.settings.aboutEn": "შესახებ (ინგლისური)",
    "admin.settings.save": "შენახვა",
    "admin.settings.saving": "შენახვა...",
    "admin.settings.saveSuccess": "პარამეტრები წარმატებით შეინახა",
    "admin.settings.saveError": "შეცდომა. გთხოვთ სცადოთ თავიდან.",
    // Admin — Common
    "admin.common.edit": "რედაქტირება",
    "admin.common.delete": "წაშლა",
    "admin.common.cancel": "გაუქმება",
    "admin.common.save": "შენახვა",
    "admin.common.add": "დამატება",
    "admin.common.update": "განახლება",
    "admin.common.close": "დახურვა",
    "admin.common.uploading": "იტვირთება...",
    "admin.common.saving": "შენახვა...",
    "admin.common.required": "ეს ველი სავალდებულოა",
    "admin.common.deleteConfirmDescription": "ეს მოქმედება შეუქცევადია.",
    "admin.common.uploadImage": "სურათის ატვირთვა",
    "admin.common.imageValidation": "ფაილი უნდა იყოს JPEG, PNG ან WebP და 10 MB-ზე ნაკლები",
    "admin.common.uploadError": "სურათის ატვირთვა ვერ მოხერხდა. სცადეთ თავიდან.",
    // Admin — Reservations
    "admin.sidebar.reservations": "რეზერვაციები",
    "admin.reservations.title": "რეზერვაციები",
    "admin.reservations.noReservations": "რეზერვაციები არ არის",
    "admin.reservations.referenceCode": "საცნობარო კოდი",
    "admin.reservations.guest": "სტუმარი",
    "admin.reservations.room": "ნომერი",
    "admin.reservations.dates": "თარიღები",
    "admin.reservations.nights": "ღამეები",
    "admin.reservations.guestCount": "სტუმრების რაოდენობა",
    "admin.reservations.total": "ჯამი",
    "admin.reservations.status": "სტატუსი",
    "admin.reservations.createdAt": "შექმნის თარიღი",
    "admin.reservations.checkedInAt": "შესვლის თარიღი",
    "admin.reservations.checkedOutAt": "გასვლის თარიღი",
    "admin.reservations.cancelledAt": "გაუქმების თარიღი",
    "admin.reservations.specialRequests": "სპეციალური მოთხოვნები",
    "admin.reservations.status.pending": "მოლოდინში",
    "admin.reservations.status.confirmed": "დადასტურებული",
    "admin.reservations.status.checkedIn": "შესული",
    "admin.reservations.status.checkedOut": "გასული",
    "admin.reservations.status.cancelled": "გაუქმებული",
    "admin.reservations.status.noShow": "არ გამოცხადდა",
    "admin.reservations.action.confirm": "დადასტურება",
    "admin.reservations.action.cancel": "გაუქმება",
    "admin.reservations.action.checkIn": "შესვლა",
    "admin.reservations.action.checkOut": "გასვლა",
    "admin.reservations.action.markNoShow": "არ გამოცხადდა",
    "admin.reservations.filter.all": "ყველა",
    "admin.reservations.filter.status": "სტატუსი",
    "admin.reservations.filter.room": "ნომერი",
    "admin.reservations.filter.search": "ძიება",
    "admin.reservations.filter.checkInFrom": "შესვლა (დან)",
    "admin.reservations.filter.checkInTo": "შესვლა (მდე)",
    "admin.reservations.confirmCancelTitle": "რეზერვაციის გაუქმება",
    "admin.reservations.confirmCancelDescription": "ნამდვილად გსურთ ამ რეზერვაციის გაუქმება? ეს მოქმედება შეუქცევადია.",
    // Public reservation flow
    "res.referenceCode": "საცნობარო კოდი",
    "res.errorConflict": "ნომერი მიუწვდომელია ამ თარიღებისთვის",
    "res.errorValidation": "გთხოვთ შეამოწმოთ შეყვანილი მონაცემები",
    "res.lookupTitle": "რეზერვაციის ძიება",
    "res.lookupNotFound": "რეზერვაცია ვერ მოიძებნა"
  },
  en: {
    // Nav
    "nav.home": "Home",
    "nav.rooms": "Rooms",
    "nav.gallery": "Gallery",
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
    "res.successDesc": "Save your reference code — you will need it at check-in.",
    "res.backToHome": "Back to Home",
    "res.capacity": "Capacity",
    "res.size": "Size",
    "res.amenitiesIncluded": "Includes",
    "res.selected": "Selected",
    "res.select": "Select",
    // Footer
    "footer.phone": "+995 511 222 028",
    "footer.copyright": "© 2025 Kai Hotel. All rights reserved.",
    "footer.partners": "Our Partners",
    // Admin Panel
    // Admin — Sidebar
    "admin.sidebar.title": "Kai Admin",
    "admin.sidebar.subtitle": "Botanical Suite",
    "admin.sidebar.analytics": "Analytics",
    "admin.sidebar.rooms": "Rooms",
    "admin.sidebar.gallery": "Gallery",
    "admin.sidebar.sponsors": "Sponsors",
    "admin.sidebar.messages": "Messages",
    "admin.sidebar.settings": "Settings",
    "admin.sidebar.logout": "Logout",
    "admin.sidebar.toggleLanguage": "Toggle language",
    // Admin — Login
    "admin.login.title": "Kai Hotel Bar",
    "admin.login.subtitle": "Admin Panel",
    "admin.login.username": "Username",
    "admin.login.password": "Password",
    "admin.login.submit": "Sign In",
    "admin.login.submitting": "Signing in...",
    "admin.login.error": "Invalid credentials",
    // Admin — Header
    "admin.header.welcome": "Welcome back, Administrator",
    // Admin — Analytics
    "admin.analytics.rooms": "Rooms",
    "admin.analytics.roomsSupporting": "Total rooms",
    "admin.analytics.gallery": "Gallery",
    "admin.analytics.gallerySupporting": "Total images",
    "admin.analytics.sponsors": "Sponsors",
    "admin.analytics.sponsorsSupporting": "Total sponsors",
    "admin.analytics.unreadMessages": "Unread Messages",
    "admin.analytics.unreadMessagesSupporting": "New messages",
    // Admin — Rooms
    "admin.rooms.title": "Rooms",
    "admin.rooms.addRoom": "Add Room",
    "admin.rooms.editRoom": "Edit Room",
    "admin.rooms.noRooms": "No rooms yet",
    "admin.rooms.deleteTitle": "Delete Room",
    "admin.rooms.nameKa": "Name (Georgian)",
    "admin.rooms.nameEn": "Name (English)",
    "admin.rooms.descriptionKa": "Description (Georgian)",
    "admin.rooms.descriptionEn": "Description (English)",
    "admin.rooms.pricePerNight": "Price per Night ($)",
    "admin.rooms.capacity": "Capacity (Guests)",
    "admin.rooms.amenities": "Amenities (comma-separated)",
    "admin.rooms.image": "Image",
    // Admin — Gallery
    "admin.gallery.title": "Gallery",
    "admin.gallery.uploadImage": "Upload Image",
    "admin.gallery.noImages": "No images yet",
    "admin.gallery.altText": "Alt Text",
    "admin.gallery.displayOrder": "Display Order",
    "admin.gallery.deleteTitle": "Delete Image",
    // Admin — Sponsors
    "admin.sponsors.title": "Sponsors",
    "admin.sponsors.addSponsor": "Add Sponsor",
    "admin.sponsors.editSponsor": "Edit Sponsor",
    "admin.sponsors.noSponsors": "No sponsors yet",
    "admin.sponsors.name": "Name",
    "admin.sponsors.websiteUrl": "Website URL",
    "admin.sponsors.displayOrder": "Display Order",
    "admin.sponsors.logo": "Logo",
    "admin.sponsors.deleteTitle": "Delete Sponsor",
    // Admin — Messages
    "admin.messages.title": "Messages",
    "admin.messages.noMessages": "No messages yet",
    "admin.messages.sender": "Sender",
    "admin.messages.email": "Email",
    "admin.messages.inquiryType": "Inquiry Type",
    "admin.messages.submittedAt": "Submitted At",
    "admin.messages.message": "Message",
    "admin.messages.details": "Message Details",
    // Admin — Settings
    "admin.settings.title": "Site Settings",
    "admin.settings.subtitle": "Update hotel contact information and social media links",
    "admin.settings.contactInfo": "Contact Information",
    "admin.settings.phone": "Phone *",
    "admin.settings.email": "Email *",
    "admin.settings.addressKa": "Address (Georgian)",
    "admin.settings.addressEn": "Address (English)",
    "admin.settings.socialMedia": "Social Media",
    "admin.settings.instagramUrl": "Instagram URL",
    "admin.settings.facebookUrl": "Facebook URL",
    "admin.settings.about": "About the Hotel",
    "admin.settings.aboutKa": "About (Georgian)",
    "admin.settings.aboutEn": "About (English)",
    "admin.settings.save": "Save Settings",
    "admin.settings.saving": "Saving...",
    "admin.settings.saveSuccess": "Settings saved successfully",
    "admin.settings.saveError": "Something went wrong. Please try again.",
    // Admin — Common
    "admin.common.edit": "Edit",
    "admin.common.delete": "Delete",
    "admin.common.cancel": "Cancel",
    "admin.common.save": "Save",
    "admin.common.add": "Add",
    "admin.common.update": "Update",
    "admin.common.close": "Close",
    "admin.common.uploading": "Uploading...",
    "admin.common.saving": "Saving...",
    "admin.common.required": "This field is required",
    "admin.common.deleteConfirmDescription": "This action cannot be undone.",
    "admin.common.uploadImage": "Upload image",
    "admin.common.imageValidation": "File must be JPEG, PNG, or WebP and under 10 MB",
    "admin.common.uploadError": "Image upload failed. Please try again.",
    // Admin — Reservations
    "admin.sidebar.reservations": "Reservations",
    "admin.reservations.title": "Reservations",
    "admin.reservations.noReservations": "No reservations yet",
    "admin.reservations.referenceCode": "Reference Code",
    "admin.reservations.guest": "Guest",
    "admin.reservations.room": "Room",
    "admin.reservations.dates": "Dates",
    "admin.reservations.nights": "Nights",
    "admin.reservations.guestCount": "Guest Count",
    "admin.reservations.total": "Total",
    "admin.reservations.status": "Status",
    "admin.reservations.createdAt": "Created At",
    "admin.reservations.checkedInAt": "Checked In At",
    "admin.reservations.checkedOutAt": "Checked Out At",
    "admin.reservations.cancelledAt": "Cancelled At",
    "admin.reservations.specialRequests": "Special Requests",
    "admin.reservations.status.pending": "Pending",
    "admin.reservations.status.confirmed": "Confirmed",
    "admin.reservations.status.checkedIn": "Checked In",
    "admin.reservations.status.checkedOut": "Checked Out",
    "admin.reservations.status.cancelled": "Cancelled",
    "admin.reservations.status.noShow": "No Show",
    "admin.reservations.action.confirm": "Confirm",
    "admin.reservations.action.cancel": "Cancel",
    "admin.reservations.action.checkIn": "Check In",
    "admin.reservations.action.checkOut": "Check Out",
    "admin.reservations.action.markNoShow": "Mark No Show",
    "admin.reservations.filter.all": "All",
    "admin.reservations.filter.status": "Status",
    "admin.reservations.filter.room": "Room",
    "admin.reservations.filter.search": "Search",
    "admin.reservations.filter.checkInFrom": "Check-in From",
    "admin.reservations.filter.checkInTo": "Check-in To",
    "admin.reservations.confirmCancelTitle": "Cancel Reservation",
    "admin.reservations.confirmCancelDescription": "Are you sure you want to cancel this reservation? This action cannot be undone.",
    // Public reservation flow
    "res.referenceCode": "Reference Code",
    "res.errorConflict": "Room is not available for those dates",
    "res.errorValidation": "Please check your input",
    "res.lookupTitle": "Look Up Reservation",
    "res.lookupNotFound": "Reservation not found"
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
const AdminAuthContext = createContext(null);
function AdminAuthProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminSessionToken");
    }
    return null;
  });
  const login = useCallback((token) => {
    localStorage.setItem("adminSessionToken", token);
    setSessionToken(token);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem("adminSessionToken");
    setSessionToken(null);
    window.location.href = "/admin/login";
  }, []);
  return /* @__PURE__ */ jsx(AdminAuthContext.Provider, { value: { sessionToken, login, logout }, children });
}
function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
const convex = new ConvexReactClient("https://zealous-leopard-584.eu-west-1.convex.cloud");
const SITE_NAME = "Kai Hotel Bar";
const SITE_URL = "https://hotel.kai.com.ge";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop";
const Route$9 = createRootRoute({
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
        title: "Kai Hotel Bar | სასტუმრო თბილისში — Hotel & Bar in Tbilisi, Georgia"
      },
      {
        name: "description",
        content: "Kai Hotel Bar — სასტუმრო თბილისში, 24 სამტრედიის ქ., დიდუბე. ნომრები ₾33-დან, უფასო Wi-Fi, პარკინგი, ტერასა, ბალკონი. უფასო გაუქმება. Hotel in Tbilisi from ₾33/night. Free cancellation."
      },
      // SEO essentials
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      },
      {
        name: "googlebot",
        content: "index, follow"
      },
      {
        name: "author",
        content: "Kai Hotel Bar"
      },
      {
        name: "geo.region",
        content: "GE-TB"
      },
      {
        name: "geo.placename",
        content: "Tbilisi"
      },
      {
        name: "geo.position",
        content: "41.742438;44.775813"
      },
      {
        name: "ICBM",
        content: "41.742438, 44.775813"
      },
      // Language alternates
      {
        name: "language",
        content: "Georgian, English"
      },
      // Open Graph (Facebook, Google Ads display)
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:site_name",
        content: SITE_NAME
      },
      {
        property: "og:title",
        content: "Kai Hotel Bar Tbilisi — Rooms from ₾33/night | Free Cancellation"
      },
      {
        property: "og:description",
        content: "Hotel & Bar in Tbilisi, Didube. Economy, Twin, Deluxe & Dorm rooms. Free Wi-Fi, AC, terrace, balcony. No credit card needed. Book direct for best rate."
      },
      {
        property: "og:image",
        content: DEFAULT_OG_IMAGE
      },
      {
        property: "og:image:width",
        content: "1200"
      },
      {
        property: "og:image:height",
        content: "630"
      },
      {
        property: "og:url",
        content: SITE_URL
      },
      {
        property: "og:locale",
        content: "ka_GE"
      },
      {
        property: "og:locale:alternate",
        content: "en_US"
      },
      // Twitter Card
      {
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        name: "twitter:title",
        content: "Kai Hotel Bar Tbilisi — From ₾33/night | Free Cancellation"
      },
      {
        name: "twitter:description",
        content: "Hotel & Bar in Tbilisi, Didube. Free Wi-Fi, AC, terrace, balcony. No credit card needed. Book direct."
      },
      {
        name: "twitter:image",
        content: DEFAULT_OG_IMAGE
      }
      // Google Ads conversion tracking placeholder
      // Replace with your actual Google Ads tag ID
      // { name: 'google-site-verification', content: 'YOUR_VERIFICATION_CODE' },
    ],
    links: [
      // Canonical URL
      {
        rel: "canonical",
        href: SITE_URL
      },
      // Hreflang for bilingual SEO (Georgian primary, English alternate)
      {
        rel: "alternate",
        hrefLang: "ka",
        href: SITE_URL
      },
      {
        rel: "alternate",
        hrefLang: "en",
        href: SITE_URL
      },
      {
        rel: "alternate",
        hrefLang: "x-default",
        href: SITE_URL
      },
      // DNS prefetch for external origins (B2 CDN, Unsplash, Convex)
      {
        rel: "dns-prefetch",
        href: "https://s3.eu-central-003.backblazeb2.com"
      },
      {
        rel: "dns-prefetch",
        href: "https://images.unsplash.com"
      },
      {
        rel: "dns-prefetch",
        href: "https://www.googletagmanager.com"
      },
      // Preconnect to font origins
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      // Preconnect to image CDN for faster first image load
      {
        rel: "preconnect",
        href: "https://s3.eu-central-003.backblazeb2.com"
      },
      // Font stylesheets with display=swap for non-blocking rendering
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
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(ConvexProvider, { client: convex, children: /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsx(AdminAuthProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) }) }) });
}
function RootDocument({ children }) {
  const hotelJsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "Kai Hotel Bar",
    description: "Hotel & Bar in Tbilisi, Georgia. Rooms from ₾33/night — Economy Double, Twin with Terrace, Deluxe Double, Triple, and Dorm. Free Wi-Fi, AC, balcony, terrace. Free cancellation, no credit card needed. Book directly for the best rate.",
    url: "https://hotel.kai.com.ge",
    telephone: "+995511222028",
    email: "info@kai.com.ge",
    address: {
      "@type": "PostalAddress",
      streetAddress: "24 Samtredia Street",
      addressLocality: "Tbilisi",
      addressRegion: "Didube",
      postalCode: "0119",
      addressCountry: "GE"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.742438",
      longitude: "44.775813"
    },
    image: [
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop"
    ],
    priceRange: "₾33 - ₾113",
    currenciesAccepted: "GEL",
    paymentAccepted: "Cash — Pay at property, No credit card needed",
    starRating: {
      "@type": "Rating",
      ratingValue: "4"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "3.4",
      reviewCount: "35",
      bestRating: "5",
      worstRating: "1",
      description: "Google rating"
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Balcony", value: true },
      { "@type": "LocationFeatureSpecification", name: "Terrace", value: true },
      { "@type": "LocationFeatureSpecification", name: "Flat-screen TV", value: true },
      { "@type": "LocationFeatureSpecification", name: "Airport Shuttle", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "24-Hour Reception", value: true },
      { "@type": "LocationFeatureSpecification", name: "Non-Smoking Rooms", value: true },
      { "@type": "LocationFeatureSpecification", name: "Family Rooms", value: true },
      { "@type": "LocationFeatureSpecification", name: "Bar", value: true },
      { "@type": "LocationFeatureSpecification", name: "Washing Machine", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Toiletries", value: true },
      { "@type": "LocationFeatureSpecification", name: "Soundproofing", value: true }
    ],
    checkinTime: "12:00",
    checkoutTime: "12:00",
    petsAllowed: false,
    availableLanguage: [
      { "@type": "Language", name: "Georgian" },
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "Russian" }
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://hotel.kai.com.ge/reservations",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      result: {
        "@type": "LodgingReservation",
        name: "Book a Room"
      }
    },
    sameAs: [
      "https://www.booking.com/hotel/ge/kai-t-39-bilisi1.en-gb.html"
    ]
  };
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Kai Hotel Bar",
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop",
    "@id": "https://hotel.kai.com.ge",
    url: "https://hotel.kai.com.ge",
    telephone: "+995511222028",
    address: {
      "@type": "PostalAddress",
      streetAddress: "24 Samtredia Street",
      addressLocality: "Tbilisi",
      addressRegion: "Didube",
      postalCode: "0119",
      addressCountry: "GE"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.742438,
      longitude: 44.775813
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59"
    },
    priceRange: "₾33 - ₾113"
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hotel.kai.com.ge/" },
      { "@type": "ListItem", position: 2, name: "Rooms", item: "https://hotel.kai.com.ge/rooms" },
      { "@type": "ListItem", position: 3, name: "Book Now", item: "https://hotel.kai.com.ge/reservations" },
      { "@type": "ListItem", position: 4, name: "Gallery", item: "https://hotel.kai.com.ge/gallery" },
      { "@type": "ListItem", position: 5, name: "Contact", item: "https://hotel.kai.com.ge/contact" }
    ]
  };
  return /* @__PURE__ */ jsxs("html", { lang: "ka", className: "scroll-smooth", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(HeadContent, {}),
      /* @__PURE__ */ jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(hotelJsonLd) }
        }
      ),
      /* @__PURE__ */ jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(localBusinessJsonLd) }
        }
      ),
      /* @__PURE__ */ jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(breadcrumbJsonLd) }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "bg-background text-on-surface", children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$8 = () => import("./seo-dev-Dw-tLOlL.js");
const Route$8 = createFileRoute("/seo-dev")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./rooms-CNQirxbS.js");
const Route$7 = createFileRoute("/rooms")({
  head: () => ({
    meta: [{
      title: "ნომრები — Rooms | Kai Hotel Bar Tbilisi | From ₾33/night"
    }, {
      name: "description",
      content: "Kai Hotel Bar Tbilisi rooms from ₾33/night. Economy ₾82, Twin ₾96, Deluxe ₾90, Triple ₾94, Dorm ₾33. AC, Free Wi-Fi, balcony, flat-screen TV in all rooms."
    }, {
      name: "keywords",
      content: "Kai Hotel rooms Tbilisi, hotel rooms Tbilisi, ნომრები თბილისი, economy room Tbilisi, twin room Tbilisi, dorm Tbilisi, cheap room Tbilisi Georgia"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./reservations-XFY_81D3.js");
const reservationSearchSchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.string().optional()
});
const Route$6 = createFileRoute("/reservations")({
  validateSearch: reservationSearchSchema,
  head: () => ({
    meta: [{
      title: "დაჯავშნე — Book | Kai Hotel Bar Tbilisi | Free Cancellation"
    }, {
      name: "description",
      content: "Book Kai Hotel Bar Tbilisi from ₾33/night. Free cancellation, no credit card, pay at property. Economy, Twin, Deluxe, Triple & Dorm rooms. Best rate guaranteed."
    }, {
      name: "keywords",
      content: "book hotel Tbilisi, Kai Hotel reservation, დაჯავშნე თბილისი, free cancellation hotel Tbilisi, no prepayment hotel Georgia, hotel booking Tbilisi"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./gallery-D7YboFJ_.js");
const Route$5 = createFileRoute("/gallery")({
  head: () => ({
    meta: [{
      title: "გალერეა — Gallery | Kai Hotel Bar"
    }, {
      name: "description",
      content: "View photos of Kai Hotel Bar Tbilisi — rooms, terrace, balcony, garden, and hotel facilities. Economy, Twin, Deluxe, Triple & Dorm rooms. See what awaits you."
    }, {
      name: "keywords",
      content: "Kai Hotel photos, hotel gallery, სასტუმრო ფოტოები, hotel images Georgia"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./contact-CVdWtuwI.js");
const Route$4 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "კონტაქტი — Contact | Kai Hotel Bar Tbilisi"
    }, {
      name: "description",
      content: "Contact Kai Hotel Bar — 24 Samtredia Street, Didube, Tbilisi 0119. Phone: +995 511 222 028. Near metro station. Send us a message for reservations or inquiries."
    }, {
      name: "keywords",
      content: "Kai Hotel contact, hotel Tbilisi phone, სასტუმრო კონტაქტი თბილისი, 24 Samtredia Street Tbilisi, Kai Hotel address"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-DW_1up8n.js");
const Route$3 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Kai Hotel Bar Tbilisi | სასტუმრო თბილისში — From ₾33/night"
    }, {
      name: "description",
      content: "Kai Hotel Bar Tbilisi, Didube — from ₾33/night. Economy, Twin, Deluxe, Triple & Dorm. Free Wi-Fi, AC, terrace, balcony. Free cancellation, pay at property."
    }, {
      name: "keywords",
      content: "Kai Hotel Tbilisi, Kai Hotel Bar, hotel Tbilisi, სასტუმრო თბილისი, hotel Didube Tbilisi, cheap hotel Tbilisi, hotel near metro Tbilisi, accommodation Tbilisi Georgia, hostel Tbilisi"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./login-D-Lz0VXR.js");
const loginSearchSchema = z.object({
  redirect: z.string().optional()
});
const Route$2 = createFileRoute("/admin/login")({
  validateSearch: loginSearchSchema,
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./_layout-DGv58QJd.js");
const adminSearchSchema = z.object({
  tab: z.enum(["analytics", "rooms", "reservations", "gallery", "sponsors", "messages", "settings"]).default("analytics")
});
const Route$1 = createFileRoute("/admin/_layout")({
  validateSearch: adminSearchSchema,
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./reservations.confirmation._referenceCode-CeW_Cxb0.js");
const Route = createFileRoute("/reservations/confirmation/$referenceCode")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SeoDevRoute = Route$8.update({
  id: "/seo-dev",
  path: "/seo-dev",
  getParentRoute: () => Route$9
});
const RoomsRoute = Route$7.update({
  id: "/rooms",
  path: "/rooms",
  getParentRoute: () => Route$9
});
const ReservationsRoute = Route$6.update({
  id: "/reservations",
  path: "/reservations",
  getParentRoute: () => Route$9
});
const GalleryRoute = Route$5.update({
  id: "/gallery",
  path: "/gallery",
  getParentRoute: () => Route$9
});
const ContactRoute = Route$4.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$9
});
const IndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const AdminLoginRoute = Route$2.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$9
});
const AdminLayoutRoute = Route$1.update({
  id: "/admin/_layout",
  path: "/admin",
  getParentRoute: () => Route$9
});
const ReservationsConfirmationReferenceCodeRoute = Route.update({
  id: "/confirmation/$referenceCode",
  path: "/confirmation/$referenceCode",
  getParentRoute: () => ReservationsRoute
});
const ReservationsRouteChildren = {
  ReservationsConfirmationReferenceCodeRoute
};
const ReservationsRouteWithChildren = ReservationsRoute._addFileChildren(
  ReservationsRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  ContactRoute,
  GalleryRoute,
  ReservationsRoute: ReservationsRouteWithChildren,
  RoomsRoute,
  SeoDevRoute,
  AdminLayoutRoute,
  AdminLoginRoute
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
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
  Route$6 as R,
  Route$2 as a,
  useAdminAuth as b,
  Route$1 as c,
  Route as d,
  router as r,
  useI18n as u
};

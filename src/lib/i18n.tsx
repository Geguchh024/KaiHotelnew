import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRouterState } from '@tanstack/react-router'

export type Locale = 'ka' | 'en' | 'ru'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const translations: Record<Locale, Record<string, string>> = {
  ka: {
    // Nav
    'nav.home': 'მთავარი',
    'nav.rooms': 'ნომრები',
    'nav.gallery': 'გალერეა',
    'nav.amenities': 'სერვისები',
    'nav.reviews': 'შეფასებები',
    'nav.contact': 'კონტაქტი',
    'nav.bookNow': 'დაჯავშნე',

    // Hero
    'hero.welcome': 'kai hotel bar',
    'hero.title': 'აღმოაჩინეთ ფუფუნების, კომფორტისა და ღირებულების სრულყოფილი ბალანსი',
    'hero.subtitle': 'თქვენი სახლი სახლიდან მოშორებით.',
    'hero.exploreRooms': 'ნომრების ნახვა',
    'hero.viewAmenities': 'სერვისების ნახვა',

    // Booking
    'booking.title': 'სწრაფი დაჯავშნა',
    'booking.checkin': 'შესვლა',
    'booking.checkout': 'გასვლა',
    'booking.guests': 'სტუმრები',
    'booking.roomType': 'ნომრის ტიპი',
    'booking.selectDate': 'აირჩიეთ თარიღი',
    'booking.checkAvailability': 'ხელმისაწვდომობის შემოწმება',

    // Rooms
    'rooms.label': 'ჩვენი ნომრები',
    'rooms.title': 'ჩვენი ნომრები',
    'rooms.description': 'ყოველი ნომერი შექმნილია ჩვენი სტუმრებისთვის სრულყოფილი დასვენების უზრუნველსაყოფად.',
    'rooms.viewAll': 'ყველას ნახვა',

    // Amenities
    'amenities.label': 'სერვისები',
    'amenities.title': 'სასტუმროს სერვისები',
    'amenities.description': 'აღმოაჩინეთ განსაკუთრებული სერვისები, რომლებიც თქვენს ყოფნას Kai Hotel-ში დაუვიწყარს გახდის.',
    'amenities.wifi': 'Wi-Fi',
    'amenities.shuttle': 'აეროპორტის ტრანსფერი',
    'amenities.parking': 'კერძო პარკინგი',
    'amenities.family': 'საოჯახო ნომრები',
    'amenities.nonSmoking': 'არამწეველთა ნომრები',
    'amenities.reception': '24-საათიანი რეცეფცია',
    'amenities.terrace': 'ტერასა',
    'amenities.garden': 'ბაღი',

    // Reviews
    'reviews.label': 'შეფასებები',
    'reviews.title': 'სტუმრების შეფასებები',
    'reviews.description': 'ნახეთ რას ამბობენ ჩვენი სტუმრები Kai Hotel-ში გატარებულ გამოცდილებაზე.',
    'reviews.review1.name': 'გიორგი გიორგობიანი',
    'reviews.review1.country': 'საქართველო',
    'reviews.review1.text': 'ძალიან კარგი სერვისი, გარემო და კომფორტი. საუკეთესო თანამშრომლები. წარმატებები',
    'reviews.review2.name': 'Suzanne Jordan',
    'reviews.review2.country': 'შოტლანდია',
    'reviews.review2.text': 'მიყვარს ეს სასტუმრო, შესანიშნავი პერსონალი, ძალიან მეგობრული და დამხმარე! შესანიშნავი ლოკაცია და ძალიან ახლოს მატარებლის სადგურთან!',
    'reviews.review3.name': 'John Reid',
    'reviews.review3.country': 'აშშ',
    'reviews.review3.text': 'მშვენიერი სასტუმრო შესანიშნავ ლოკაციაზე. ნომრები უმწიკვლოდ სუფთაა, საუზმე უხვია. პერსონალი ძალიან დამხმარეა.',

    // Reservation Page
    'res.title': 'ნომრის დაჯავშნა',
    'res.subtitle': 'აირჩიეთ თარიღები, ნომრის ტიპი და შეავსეთ თქვენი ინფორმაცია რეზერვაციის დასასრულებლად.',
    'res.step1': 'თარიღები და ნომერი',
    'res.step2': 'სტუმრის ინფორმაცია',
    'res.step3': 'დადასტურება',
    'res.dates': 'აირჩიეთ თარიღები',
    'res.selectRoom': 'აირჩიეთ ნომერი',
    'res.available': 'ხელმისაწვდომი',
    'res.unavailable': 'მიუწვდომელი',
    'res.perNight': '/ ღამე',
    'res.nights': 'ღამე',
    'res.total': 'ჯამი',
    'res.guestInfo': 'სტუმრის ინფორმაცია',
    'res.firstName': 'სახელი',
    'res.lastName': 'გვარი',
    'res.email': 'ელ-ფოსტა',
    'res.phone': 'ტელეფონი',
    'res.country': 'ქვეყანა',
    'res.specialRequests': 'სპეციალური მოთხოვნები',
    'res.specialRequestsPlaceholder': 'ნებისმიერი სპეციალური მოთხოვნა ან შენიშვნა...',
    'res.next': 'შემდეგი',
    'res.back': 'უკან',
    'res.confirm': 'რეზერვაციის დადასტურება',
    'res.summary': 'ჯავშნის შეჯამება',
    'res.roomDetails': 'ნომრის დეტალები',
    'res.guestDetails': 'სტუმრის დეტალები',
    'res.payAtHotel': 'გადახდა სასტუმროში',
    'res.payAtHotelDesc': 'გადახდა ხდება ჩასვლისას. გაუქმება უფასოა 24 საათით ადრე.',
    'res.success': 'რეზერვაცია წარმატებით დასრულდა!',
    'res.successDesc': 'შეინახეთ საცნობარო კოდი — ის დაგჭირდებათ ჩასვლისას.',
    'res.backToHome': 'მთავარ გვერდზე დაბრუნება',
    'res.capacity': 'ტევადობა',
    'res.size': 'ფართობი',
    'res.amenitiesIncluded': 'შეიცავს',
    'res.selected': 'არჩეული',
    'res.select': 'არჩევა',

    // Footer
    'footer.phone': '+995 511 222 028',
    'footer.copyright': '© 2025 Kai Hotel. ყველა უფლება დაცულია.',
    'footer.partners': 'ჩვენი პარტნიორები',

    // Admin Panel

    // Admin — Sidebar
    'admin.sidebar.title': 'Kai ადმინი',
    'admin.sidebar.subtitle': 'Botanical Suite',
    'admin.sidebar.analytics': 'ანალიტიკა',
    'admin.sidebar.rooms': 'ნომრები',
    'admin.sidebar.gallery': 'გალერეა',
    'admin.sidebar.sponsors': 'სპონსორები',
    'admin.sidebar.messages': 'შეტყობინებები',
    'admin.sidebar.settings': 'პარამეტრები',
    'admin.sidebar.logout': 'გასვლა',
    'admin.sidebar.toggleLanguage': 'ენის შეცვლა',

    // Admin — Login
    'admin.login.title': 'Kai Hotel Bar',
    'admin.login.subtitle': 'Admin Panel',
    'admin.login.username': 'მომხმარებელი',
    'admin.login.password': 'პაროლი',
    'admin.login.submit': 'შესვლა',
    'admin.login.submitting': 'შესვლა...',
    'admin.login.error': 'არასწორი მონაცემები',

    // Admin — Header
    'admin.header.welcome': 'გამარჯობა, ადმინისტრატორ',

    // Admin — Analytics
    'admin.analytics.rooms': 'ნომრები',
    'admin.analytics.roomsSupporting': 'სულ ნომრები',
    'admin.analytics.gallery': 'გალერეა',
    'admin.analytics.gallerySupporting': 'სულ სურათები',
    'admin.analytics.sponsors': 'სპონსორები',
    'admin.analytics.sponsorsSupporting': 'სულ სპონსორები',
    'admin.analytics.unreadMessages': 'წაუკითხავი შეტყობინებები',
    'admin.analytics.unreadMessagesSupporting': 'ახალი შეტყობინებები',

    // Admin — Rooms
    'admin.rooms.title': 'ნომრები',
    'admin.rooms.addRoom': 'ნომრის დამატება',
    'admin.rooms.editRoom': 'ნომრის რედაქტირება',
    'admin.rooms.noRooms': 'ნომრები არ არის',
    'admin.rooms.deleteTitle': 'ნომრის წაშლა',
    'admin.rooms.nameKa': 'სახელი (ქართული)',
    'admin.rooms.nameEn': 'სახელი (ინგლისური)',
    'admin.rooms.descriptionKa': 'აღწერა (ქართული)',
    'admin.rooms.descriptionEn': 'აღწერა (ინგლისური)',
    'admin.rooms.pricePerNight': 'ფასი ღამეში ($)',
    'admin.rooms.capacity': 'ტევადობა (სტუმრები)',
    'admin.rooms.amenities': 'სერვისები (მძიმით გამოყოფილი)',
    'admin.rooms.image': 'სურათი',

    // Admin — Gallery
    'admin.gallery.title': 'გალერეა',
    'admin.gallery.uploadImage': 'სურათის ატვირთვა',
    'admin.gallery.noImages': 'სურათები არ არის',
    'admin.gallery.altText': 'Alt ტექსტი',
    'admin.gallery.displayOrder': 'ჩვენების თანმიმდევრობა',
    'admin.gallery.deleteTitle': 'სურათის წაშლა',

    // Admin — Sponsors
    'admin.sponsors.title': 'სპონსორები',
    'admin.sponsors.addSponsor': 'სპონსორის დამატება',
    'admin.sponsors.editSponsor': 'სპონსორის რედაქტირება',
    'admin.sponsors.noSponsors': 'სპონსორები არ არის',
    'admin.sponsors.name': 'სახელი',
    'admin.sponsors.websiteUrl': 'ვებსაიტი',
    'admin.sponsors.displayOrder': 'ჩვენების რიგი',
    'admin.sponsors.logo': 'ლოგო',
    'admin.sponsors.deleteTitle': 'სპონსორის წაშლა',

    // Admin — Messages
    'admin.messages.title': 'შეტყობინებები',
    'admin.messages.noMessages': 'შეტყობინებები არ არის',
    'admin.messages.sender': 'გამგზავნი',
    'admin.messages.email': 'ელ-ფოსტა',
    'admin.messages.inquiryType': 'მოთხოვნის ტიპი',
    'admin.messages.submittedAt': 'გაგზავნის თარიღი',
    'admin.messages.message': 'შეტყობინება',
    'admin.messages.details': 'შეტყობინების დეტალები',

    // Admin — Settings
    'admin.settings.title': 'საიტის პარამეტრები',
    'admin.settings.subtitle': 'განაახლეთ სასტუმროს საკონტაქტო ინფორმაცია და სოციალური ქსელები',
    'admin.settings.contactInfo': 'საკონტაქტო ინფორმაცია',
    'admin.settings.phone': 'ტელეფონი *',
    'admin.settings.email': 'ელ-ფოსტა *',
    'admin.settings.adminEmail': 'ადმინისტრატორის ელ-ფოსტა (შეტყობინებებისთვის)',
    'admin.settings.addressKa': 'მისამართი (ქართული)',
    'admin.settings.addressEn': 'მისამართი (ინგლისური)',
    'admin.settings.socialMedia': 'სოციალური ქსელები',
    'admin.settings.instagramUrl': 'Instagram URL',
    'admin.settings.facebookUrl': 'Facebook URL',
    'admin.settings.about': 'სასტუმროს შესახებ',
    'admin.settings.aboutKa': 'შესახებ (ქართული)',
    'admin.settings.aboutEn': 'შესახებ (ინგლისური)',
    'admin.settings.save': 'შენახვა',
    'admin.settings.saving': 'შენახვა...',
    'admin.settings.saveSuccess': 'პარამეტრები წარმატებით შეინახა',
    'admin.settings.saveError': 'შეცდომა. გთხოვთ სცადოთ თავიდან.',

    // Admin — Common
    'admin.common.edit': 'რედაქტირება',
    'admin.common.delete': 'წაშლა',
    'admin.common.cancel': 'გაუქმება',
    'admin.common.save': 'შენახვა',
    'admin.common.add': 'დამატება',
    'admin.common.update': 'განახლება',
    'admin.common.close': 'დახურვა',
    'admin.common.uploading': 'იტვირთება...',
    'admin.common.saving': 'შენახვა...',
    'admin.common.required': 'ეს ველი სავალდებულოა',
    'admin.common.deleteConfirmDescription': 'ეს მოქმედება შეუქცევადია.',
    'admin.common.uploadImage': 'სურათის ატვირთვა',
    'admin.common.imageValidation': 'ფაილი უნდა იყოს JPEG, PNG ან WebP და 10 MB-ზე ნაკლები',
    'admin.common.uploadError': 'სურათის ატვირთვა ვერ მოხერხდა. სცადეთ თავიდან.',

    // Admin — Reservations
    'admin.sidebar.reservations': 'რეზერვაციები',
    'admin.reservations.title': 'რეზერვაციები',
    'admin.reservations.noReservations': 'რეზერვაციები არ არის',
    'admin.reservations.referenceCode': 'საცნობარო კოდი',
    'admin.reservations.guest': 'სტუმარი',
    'admin.reservations.room': 'ნომერი',
    'admin.reservations.dates': 'თარიღები',
    'admin.reservations.nights': 'ღამეები',
    'admin.reservations.guestCount': 'სტუმრების რაოდენობა',
    'admin.reservations.total': 'ჯამი',
    'admin.reservations.status': 'სტატუსი',
    'admin.reservations.createdAt': 'შექმნის თარიღი',
    'admin.reservations.checkedInAt': 'შესვლის თარიღი',
    'admin.reservations.checkedOutAt': 'გასვლის თარიღი',
    'admin.reservations.cancelledAt': 'გაუქმების თარიღი',
    'admin.reservations.specialRequests': 'სპეციალური მოთხოვნები',
    'admin.reservations.status.pending': 'მოლოდინში',
    'admin.reservations.status.confirmed': 'დადასტურებული',
    'admin.reservations.status.checkedIn': 'შესული',
    'admin.reservations.status.checkedOut': 'გასული',
    'admin.reservations.status.cancelled': 'გაუქმებული',
    'admin.reservations.status.noShow': 'არ გამოცხადდა',
    'admin.reservations.action.confirm': 'დადასტურება',
    'admin.reservations.action.cancel': 'გაუქმება',
    'admin.reservations.action.checkIn': 'შესვლა',
    'admin.reservations.action.checkOut': 'გასვლა',
    'admin.reservations.action.markNoShow': 'არ გამოცხადდა',
    'admin.reservations.filter.all': 'ყველა',
    'admin.reservations.filter.status': 'სტატუსი',
    'admin.reservations.filter.room': 'ნომერი',
    'admin.reservations.filter.search': 'ძიება',
    'admin.reservations.filter.checkInFrom': 'შესვლა (დან)',
    'admin.reservations.filter.checkInTo': 'შესვლა (მდე)',
    'admin.reservations.confirmCancelTitle': 'რეზერვაციის გაუქმება',
    'admin.reservations.confirmCancelDescription': 'ნამდვილად გსურთ ამ რეზერვაციის გაუქმება? ეს მოქმედება შეუქცევადია.',

    // Public reservation flow
    'res.referenceCode': 'საცნობარო კოდი',
    'res.errorConflict': 'ნომერი მიუწვდომელია ამ თარიღებისთვის',
    'res.errorValidation': 'გთხოვთ შეამოწმოთ შეყვანილი მონაცემები',
    'res.lookupTitle': 'რეზერვაციის ძიება',
    'res.lookupNotFound': 'რეზერვაცია ვერ მოიძებნა',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.rooms': 'Rooms',
    'nav.gallery': 'Gallery',
    'nav.amenities': 'Amenities',
    'nav.reviews': 'Reviews',
    'nav.contact': 'Contact',
    'nav.bookNow': 'Book Now',

    // Hero
    'hero.welcome': 'kai hotel bar',
    'hero.title': 'Discover the perfect balance of luxury, comfort, and value',
    'hero.subtitle': 'Your home away from home.',
    'hero.exploreRooms': 'Explore Rooms',
    'hero.viewAmenities': 'View Amenities',

    // Booking
    'booking.title': 'Quick Booking',
    'booking.checkin': 'Check-in',
    'booking.checkout': 'Check-out',
    'booking.guests': 'Guests',
    'booking.roomType': 'Room Type',
    'booking.selectDate': 'Select Date',
    'booking.checkAvailability': 'Check Availability',

    // Rooms
    'rooms.label': 'Our Rooms',
    'rooms.title': 'Our Rooms',
    'rooms.description': 'Each room is designed to provide the perfect stay for our guests.',
    'rooms.viewAll': 'View All',

    // Amenities
    'amenities.label': 'Amenities',
    'amenities.title': 'Hotel Amenities',
    'amenities.description': 'Discover the exceptional amenities and services that make your stay at Kai Hotel an unforgettable experience.',
    'amenities.wifi': 'Wi-Fi',
    'amenities.shuttle': 'Airport Shuttle',
    'amenities.parking': 'Private Parking',
    'amenities.family': 'Family Rooms',
    'amenities.nonSmoking': 'Non-Smoking Rooms',
    'amenities.reception': '24-Hour Reception',
    'amenities.terrace': 'Terrace',
    'amenities.garden': 'Garden',

    // Reviews
    'reviews.label': 'Reviews',
    'reviews.title': 'Guest Reviews',
    'reviews.description': "See what our guests have to say about their experience at Kai Hotel.",
    'reviews.review1.name': 'გიორგი გიორგობიანი',
    'reviews.review1.country': 'Georgia',
    'reviews.review1.text': 'ძალიან კარგი სერვისი, გარემო და კომფორტი. საუკეთესო თანამშრომლები. წარმატებები',
    'reviews.review2.name': 'Suzanne Jordan',
    'reviews.review2.country': 'Scotland',
    'reviews.review2.text': 'Love this hotel, great staff service, very friendly and helpful! Great location and very close from the train station! Will be back in a near future!',
    'reviews.review3.name': 'John Reid',
    'reviews.review3.country': 'United States',
    'reviews.review3.text': 'Lovely hotel in an excellent location. Rooms are spotless & cleaned daily, breakfast is plentiful. Staff are very helpful.',

    // Reservation Page
    'res.title': 'Reserve a Room',
    'res.subtitle': 'Select your dates, choose a room type, and fill in your details to complete the reservation.',
    'res.step1': 'Dates & Room',
    'res.step2': 'Guest Information',
    'res.step3': 'Confirmation',
    'res.dates': 'Select Dates',
    'res.selectRoom': 'Select a Room',
    'res.available': 'Available',
    'res.unavailable': 'Unavailable',
    'res.perNight': '/ night',
    'res.nights': 'nights',
    'res.total': 'Total',
    'res.guestInfo': 'Guest Information',
    'res.firstName': 'First Name',
    'res.lastName': 'Last Name',
    'res.email': 'Email',
    'res.phone': 'Phone',
    'res.country': 'Country',
    'res.specialRequests': 'Special Requests',
    'res.specialRequestsPlaceholder': 'Any special requests or notes...',
    'res.next': 'Next',
    'res.back': 'Back',
    'res.confirm': 'Confirm Reservation',
    'res.summary': 'Booking Summary',
    'res.roomDetails': 'Room Details',
    'res.guestDetails': 'Guest Details',
    'res.payAtHotel': 'Pay at Hotel',
    'res.payAtHotelDesc': 'Payment is collected upon arrival. Free cancellation up to 24 hours before.',
    'res.success': 'Reservation Confirmed!',
    'res.successDesc': 'Save your reference code — you will need it at check-in.',
    'res.backToHome': 'Back to Home',
    'res.capacity': 'Capacity',
    'res.size': 'Size',
    'res.amenitiesIncluded': 'Includes',
    'res.selected': 'Selected',
    'res.select': 'Select',

    // Footer
    'footer.phone': '+995 511 222 028',
    'footer.copyright': '© 2025 Kai Hotel. All rights reserved.',
    'footer.partners': 'Our Partners',

    // Admin Panel

    // Admin — Sidebar
    'admin.sidebar.title': 'Kai Admin',
    'admin.sidebar.subtitle': 'Botanical Suite',
    'admin.sidebar.analytics': 'Analytics',
    'admin.sidebar.rooms': 'Rooms',
    'admin.sidebar.gallery': 'Gallery',
    'admin.sidebar.sponsors': 'Sponsors',
    'admin.sidebar.messages': 'Messages',
    'admin.sidebar.settings': 'Settings',
    'admin.sidebar.logout': 'Logout',
    'admin.sidebar.toggleLanguage': 'Toggle language',

    // Admin — Login
    'admin.login.title': 'Kai Hotel Bar',
    'admin.login.subtitle': 'Admin Panel',
    'admin.login.username': 'Username',
    'admin.login.password': 'Password',
    'admin.login.submit': 'Sign In',
    'admin.login.submitting': 'Signing in...',
    'admin.login.error': 'Invalid credentials',

    // Admin — Header
    'admin.header.welcome': 'Welcome back, Administrator',

    // Admin — Analytics
    'admin.analytics.rooms': 'Rooms',
    'admin.analytics.roomsSupporting': 'Total rooms',
    'admin.analytics.gallery': 'Gallery',
    'admin.analytics.gallerySupporting': 'Total images',
    'admin.analytics.sponsors': 'Sponsors',
    'admin.analytics.sponsorsSupporting': 'Total sponsors',
    'admin.analytics.unreadMessages': 'Unread Messages',
    'admin.analytics.unreadMessagesSupporting': 'New messages',

    // Admin — Rooms
    'admin.rooms.title': 'Rooms',
    'admin.rooms.addRoom': 'Add Room',
    'admin.rooms.editRoom': 'Edit Room',
    'admin.rooms.noRooms': 'No rooms yet',
    'admin.rooms.deleteTitle': 'Delete Room',
    'admin.rooms.nameKa': 'Name (Georgian)',
    'admin.rooms.nameEn': 'Name (English)',
    'admin.rooms.descriptionKa': 'Description (Georgian)',
    'admin.rooms.descriptionEn': 'Description (English)',
    'admin.rooms.pricePerNight': 'Price per Night ($)',
    'admin.rooms.capacity': 'Capacity (Guests)',
    'admin.rooms.amenities': 'Amenities (comma-separated)',
    'admin.rooms.image': 'Image',

    // Admin — Gallery
    'admin.gallery.title': 'Gallery',
    'admin.gallery.uploadImage': 'Upload Image',
    'admin.gallery.noImages': 'No images yet',
    'admin.gallery.altText': 'Alt Text',
    'admin.gallery.displayOrder': 'Display Order',
    'admin.gallery.deleteTitle': 'Delete Image',

    // Admin — Sponsors
    'admin.sponsors.title': 'Sponsors',
    'admin.sponsors.addSponsor': 'Add Sponsor',
    'admin.sponsors.editSponsor': 'Edit Sponsor',
    'admin.sponsors.noSponsors': 'No sponsors yet',
    'admin.sponsors.name': 'Name',
    'admin.sponsors.websiteUrl': 'Website URL',
    'admin.sponsors.displayOrder': 'Display Order',
    'admin.sponsors.logo': 'Logo',
    'admin.sponsors.deleteTitle': 'Delete Sponsor',

    // Admin — Messages
    'admin.messages.title': 'Messages',
    'admin.messages.noMessages': 'No messages yet',
    'admin.messages.sender': 'Sender',
    'admin.messages.email': 'Email',
    'admin.messages.inquiryType': 'Inquiry Type',
    'admin.messages.submittedAt': 'Submitted At',
    'admin.messages.message': 'Message',
    'admin.messages.details': 'Message Details',

    // Admin — Settings
    'admin.settings.title': 'Site Settings',
    'admin.settings.subtitle': 'Update hotel contact information and social media links',
    'admin.settings.contactInfo': 'Contact Information',
    'admin.settings.phone': 'Phone *',
    'admin.settings.email': 'Email *',
    'admin.settings.adminEmail': 'Admin Notification Email',
    'admin.settings.addressKa': 'Address (Georgian)',
    'admin.settings.addressEn': 'Address (English)',
    'admin.settings.socialMedia': 'Social Media',
    'admin.settings.instagramUrl': 'Instagram URL',
    'admin.settings.facebookUrl': 'Facebook URL',
    'admin.settings.about': 'About the Hotel',
    'admin.settings.aboutKa': 'About (Georgian)',
    'admin.settings.aboutEn': 'About (English)',
    'admin.settings.save': 'Save Settings',
    'admin.settings.saving': 'Saving...',
    'admin.settings.saveSuccess': 'Settings saved successfully',
    'admin.settings.saveError': 'Something went wrong. Please try again.',

    // Admin — Common
    'admin.common.edit': 'Edit',
    'admin.common.delete': 'Delete',
    'admin.common.cancel': 'Cancel',
    'admin.common.save': 'Save',
    'admin.common.add': 'Add',
    'admin.common.update': 'Update',
    'admin.common.close': 'Close',
    'admin.common.uploading': 'Uploading...',
    'admin.common.saving': 'Saving...',
    'admin.common.required': 'This field is required',
    'admin.common.deleteConfirmDescription': 'This action cannot be undone.',
    'admin.common.uploadImage': 'Upload image',
    'admin.common.imageValidation': 'File must be JPEG, PNG, or WebP and under 10 MB',
    'admin.common.uploadError': 'Image upload failed. Please try again.',

    // Admin — Reservations
    'admin.sidebar.reservations': 'Reservations',
    'admin.reservations.title': 'Reservations',
    'admin.reservations.noReservations': 'No reservations yet',
    'admin.reservations.referenceCode': 'Reference Code',
    'admin.reservations.guest': 'Guest',
    'admin.reservations.room': 'Room',
    'admin.reservations.dates': 'Dates',
    'admin.reservations.nights': 'Nights',
    'admin.reservations.guestCount': 'Guest Count',
    'admin.reservations.total': 'Total',
    'admin.reservations.status': 'Status',
    'admin.reservations.createdAt': 'Created At',
    'admin.reservations.checkedInAt': 'Checked In At',
    'admin.reservations.checkedOutAt': 'Checked Out At',
    'admin.reservations.cancelledAt': 'Cancelled At',
    'admin.reservations.specialRequests': 'Special Requests',
    'admin.reservations.status.pending': 'Pending',
    'admin.reservations.status.confirmed': 'Confirmed',
    'admin.reservations.status.checkedIn': 'Checked In',
    'admin.reservations.status.checkedOut': 'Checked Out',
    'admin.reservations.status.cancelled': 'Cancelled',
    'admin.reservations.status.noShow': 'No Show',
    'admin.reservations.action.confirm': 'Confirm',
    'admin.reservations.action.cancel': 'Cancel',
    'admin.reservations.action.checkIn': 'Check In',
    'admin.reservations.action.checkOut': 'Check Out',
    'admin.reservations.action.markNoShow': 'Mark No Show',
    'admin.reservations.filter.all': 'All',
    'admin.reservations.filter.status': 'Status',
    'admin.reservations.filter.room': 'Room',
    'admin.reservations.filter.search': 'Search',
    'admin.reservations.filter.checkInFrom': 'Check-in From',
    'admin.reservations.filter.checkInTo': 'Check-in To',
    'admin.reservations.confirmCancelTitle': 'Cancel Reservation',
    'admin.reservations.confirmCancelDescription': 'Are you sure you want to cancel this reservation? This action cannot be undone.',

    // Public reservation flow
    'res.referenceCode': 'Reference Code',
    'res.errorConflict': 'Room is not available for those dates',
    'res.errorValidation': 'Please check your input',
    'res.lookupTitle': 'Look Up Reservation',
    'res.lookupNotFound': 'Reservation not found',
  },
  ru: {
    // Nav
    'nav.home': 'Главная',
    'nav.rooms': 'Номера',
    'nav.gallery': 'Галерея',
    'nav.amenities': 'Удобства',
    'nav.reviews': 'Отзывы',
    'nav.contact': 'Контакты',
    'nav.bookNow': 'Забронировать',

    // Hero
    'hero.welcome': 'kai hotel bar',
    'hero.title': 'Откройте для себя идеальный баланс роскоши, комфорта и доступности',
    'hero.subtitle': 'Ваш дом вдали от дома.',
    'hero.exploreRooms': 'Посмотреть номера',
    'hero.viewAmenities': 'Удобства отеля',

    // Booking
    'booking.title': 'Быстрое бронирование',
    'booking.checkin': 'Заезд',
    'booking.checkout': 'Выезд',
    'booking.guests': 'Гости',
    'booking.roomType': 'Тип номера',
    'booking.selectDate': 'Выберите дату',
    'booking.checkAvailability': 'Проверить доступность',

    // Rooms
    'rooms.label': 'Наши номера',
    'rooms.title': 'Наши номера',
    'rooms.description': 'Каждый номер спроектирован так, чтобы обеспечить идеальный отдых для наших гостей.',
    'rooms.viewAll': 'Показать все',

    // Amenities
    'amenities.label': 'Удобства',
    'amenities.title': 'Удобства отеля',
    'amenities.description': 'Откройте для себя исключительные удобства и услуги, которые сделают ваше пребывание в отеле Kai незабываемым.',
    'amenities.wifi': 'Wi-Fi',
    'amenities.shuttle': 'Трансфер от/до аэропорта',
    'amenities.parking': 'Частная парковка',
    'amenities.family': 'Семейные номера',
    'amenities.nonSmoking': 'Номера для некурящих',
    'amenities.reception': 'Круглосуточная стойка регистрации',
    'amenities.terrace': 'Терраса',
    'amenities.garden': 'Сад',

    // Reviews
    'reviews.label': 'Отзывы',
    'reviews.title': 'Отзывы гостей',
    'reviews.description': 'Посмотрите, что наши гости говорят о своем пребывании в отеле Kai.',
    'reviews.review1.name': 'Гиорги Гиоргобиани',
    'reviews.review1.country': 'Грузия',
    'reviews.review1.text': 'Очень хороший сервис, атмосфера и комфорт. Отличный персонал. Успехов вам',
    'reviews.review2.name': 'Сюзанна Джордан',
    'reviews.review2.country': 'Шотландия',
    'reviews.review2.text': 'Обожаю этот отель! Отличный персонал, очень дружелюбный и отзывчивый. Прекрасное расположение, совсем рядом с вокзалом. Обязательно вернусь!',
    'reviews.review3.name': 'Джон Рид',
    'reviews.review3.country': 'США',
    'reviews.review3.text': 'Прекрасный отель в отличном месте. Номера безупречно чистые, уборка каждый день, сытный завтрак. Персонал очень любезен.',

    // Reservation Page
    'res.title': 'Забронировать номер',
    'res.subtitle': 'Выберите даты, тип номера и заполните свои данные для завершения бронирования.',
    'res.step1': 'Даты и номер',
    'res.step2': 'Информация о гостях',
    'res.step3': 'Подтверждение',
    'res.dates': 'Выберите даты',
    'res.selectRoom': 'Выберите номер',
    'res.available': 'Доступно',
    'res.unavailable': 'Недоступно',
    'res.perNight': '/ ночь',
    'res.nights': 'ночей',
    'res.total': 'Итого',
    'res.guestInfo': 'Информация о гостях',
    'res.firstName': 'Имя',
    'res.lastName': 'Фамилия',
    'res.email': 'Эл. почта',
    'res.phone': 'Телефон',
    'res.country': 'Страна',
    'res.specialRequests': 'Особые пожелания',
    'res.specialRequestsPlaceholder': 'Любые особые пожелания или комментарии...',
    'res.next': 'Далее',
    'res.back': 'Назад',
    'res.confirm': 'Подтвердить бронирование',
    'res.summary': 'Детали бронирования',
    'res.roomDetails': 'Информация о номере',
    'res.guestDetails': 'Информация о гостях',
    'res.payAtHotel': 'Оплата в отеле',
    'res.payAtHotelDesc': 'Оплата производится при заселении. Бесплатная отмена за 24 часа до заезда.',
    'res.success': 'Бронирование подтверждено!',
    'res.successDesc': 'Сохраните справочный код — он понадобится при заселении.',
    'res.backToHome': 'На главную',
    'res.capacity': 'Вместимость',
    'res.size': 'Площадь',
    'res.amenitiesIncluded': 'Включено',
    'res.selected': 'Выбрано',
    'res.select': 'Выбрать',

    // Footer
    'footer.phone': '+995 511 222 028',
    'footer.copyright': '© 2025 Kai Hotel. Все права защищены.',
    'footer.partners': 'Наши партнеры',

    // Admin Panel

    // Admin — Sidebar
    'admin.sidebar.title': 'Панель Kai',
    'admin.sidebar.subtitle': 'Botanical Suite',
    'admin.sidebar.analytics': 'Аналитика',
    'admin.sidebar.rooms': 'Номера',
    'admin.sidebar.gallery': 'Галерея',
    'admin.sidebar.sponsors': 'Партнеры',
    'admin.sidebar.messages': 'Сообщения',
    'admin.sidebar.settings': 'Настройки',
    'admin.sidebar.logout': 'Выйти',
    'admin.sidebar.toggleLanguage': 'Сменить язык',

    // Admin — Login
    'admin.login.title': 'Kai Hotel Bar',
    'admin.login.subtitle': 'Панель управления',
    'admin.login.username': 'Имя пользователя',
    'admin.login.password': 'Пароль',
    'admin.login.submit': 'Войти',
    'admin.login.submitting': 'Вход...',
    'admin.login.error': 'Неверные данные для входа',

    // Admin — Header
    'admin.header.welcome': 'Добро пожаловать, администратор',

    // Admin — Analytics
    'admin.analytics.rooms': 'Номера',
    'admin.analytics.roomsSupporting': 'Всего номеров',
    'admin.analytics.gallery': 'Галерея',
    'admin.analytics.gallerySupporting': 'Всего изображений',
    'admin.analytics.sponsors': 'Партнеры',
    'admin.analytics.sponsorsSupporting': 'Всего партнеров',
    'admin.analytics.unreadMessages': 'Непрочитанные сообщения',
    'admin.analytics.unreadMessagesSupporting': 'Новые сообщения',

    // Admin — Rooms
    'admin.rooms.title': 'Номера',
    'admin.rooms.addRoom': 'Добавить номер',
    'admin.rooms.editRoom': 'Редактировать номер',
    'admin.rooms.noRooms': 'Номера еще не добавлены',
    'admin.rooms.deleteTitle': 'Удалить номер',
    'admin.rooms.nameKa': 'Название (грузинский)',
    'admin.rooms.nameEn': 'Название (английский)',
    'admin.rooms.descriptionKa': 'Описание (грузинский)',
    'admin.rooms.descriptionEn': 'Описание (английский)',
    'admin.rooms.pricePerNight': 'Цена за ночь ($)',
    'admin.rooms.capacity': 'Вместимость (гостей)',
    'admin.rooms.amenities': 'Удобства (через запятую)',
    'admin.rooms.image': 'Изображение',

    // Admin — Gallery
    'admin.gallery.title': 'Галерея',
    'admin.gallery.uploadImage': 'Загрузить изображение',
    'admin.gallery.noImages': 'Изображений пока нет',
    'admin.gallery.altText': 'Альтернативный текст (alt)',
    'admin.gallery.displayOrder': 'Порядок отображения',
    'admin.gallery.deleteTitle': 'Удалить изображение',

    // Admin — Sponsors
    'admin.sponsors.title': 'Партнеры',
    'admin.sponsors.addSponsor': 'Добавить партнера',
    'admin.sponsors.editSponsor': 'Редактировать партнера',
    'admin.sponsors.noSponsors': 'Партнеров пока нет',
    'admin.sponsors.name': 'Название',
    'admin.sponsors.websiteUrl': 'Ссылка на сайт',
    'admin.sponsors.displayOrder': 'Порядок отображения',
    'admin.sponsors.logo': 'Логотип',
    'admin.sponsors.deleteTitle': 'Удалить партнера',

    // Admin — Messages
    'admin.messages.title': 'Сообщения',
    'admin.messages.noMessages': 'Сообщений пока нет',
    'admin.messages.sender': 'Отправитель',
    'admin.messages.email': 'Эл. почта',
    'admin.messages.inquiryType': 'Тип запроса',
    'admin.messages.submittedAt': 'Отправлено',
    'admin.messages.message': 'Сообщение',
    'admin.messages.details': 'Детали сообщения',

    // Admin — Settings
    'admin.settings.title': 'Настройки сайта',
    'admin.settings.subtitle': 'Обновите контактную информацию отеля и ссылки на соцсети',
    'admin.settings.contactInfo': 'Контактная информация',
    'admin.settings.phone': 'Телефон *',
    'admin.settings.email': 'Эл. почта *',
    'admin.settings.adminEmail': 'Эл. почта для уведомлений админа',
    'admin.settings.addressKa': 'Адрес (грузинский)',
    'admin.settings.addressEn': 'Адрес (английский)',
    'admin.settings.socialMedia': 'Социальные сети',
    'admin.settings.instagramUrl': 'Ссылка Instagram',
    'admin.settings.facebookUrl': 'Ссылка Facebook',
    'admin.settings.about': 'Об отеле',
    'admin.settings.aboutKa': 'Описание (грузинский)',
    'admin.settings.aboutEn': 'Описание (английский)',
    'admin.settings.save': 'Сохранить настройки',
    'admin.settings.saving': 'Сохранение...',
    'admin.settings.saveSuccess': 'Настройки успешно сохранены',
    'admin.settings.saveError': 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',

    // Admin — Common
    'admin.common.edit': 'Редактировать',
    'admin.common.delete': 'Удалить',
    'admin.common.cancel': 'Отмена',
    'admin.common.save': 'Сохранить',
    'admin.common.add': 'Добавить',
    'admin.common.update': 'Обновить',
    'admin.common.close': 'Закрыть',
    'admin.common.uploading': 'Загрузка...',
    'admin.common.saving': 'Сохранение...',
    'admin.common.required': 'Это поле обязательно для заполнения',
    'admin.common.deleteConfirmDescription': 'Это действие невозможно отменить.',
    'admin.common.uploadImage': 'Загрузить изображение',
    'admin.common.imageValidation': 'Файл должен быть в формате JPEG, PNG или WebP и не превышать 10 МБ',
    'admin.common.uploadError': 'Не удалось загрузить изображение. Пожалуйста, попробуйте снова.',

    // Admin — Reservations
    'admin.sidebar.reservations': 'Бронирования',
    'admin.reservations.title': 'Бронирования',
    'admin.reservations.noReservations': 'Бронирований пока нет',
    'admin.reservations.referenceCode': 'Справочный код',
    'admin.reservations.guest': 'Гость',
    'admin.reservations.room': 'Номер',
    'admin.reservations.dates': 'Даты',
    'admin.reservations.nights': 'Ночи',
    'admin.reservations.guestCount': 'Кол-во гостей',
    'admin.reservations.total': 'Итого',
    'admin.reservations.status': 'Статус',
    'admin.reservations.createdAt': 'Создано',
    'admin.reservations.checkedInAt': 'Заселение в',
    'admin.reservations.checkedOutAt': 'Выселение в',
    'admin.reservations.cancelledAt': 'Отменено в',
    'admin.reservations.specialRequests': 'Особые пожелания',
    'admin.reservations.status.pending': 'В ожидании',
    'admin.reservations.status.confirmed': 'Подтверждено',
    'admin.reservations.status.checkedIn': 'Заселен',
    'admin.reservations.status.checkedOut': 'Выселен',
    'admin.reservations.status.cancelled': 'Отменено',
    'admin.reservations.status.noShow': 'Неявка',
    'admin.reservations.action.confirm': 'Подтвердить',
    'admin.reservations.action.cancel': 'Отменить',
    'admin.reservations.action.checkIn': 'Заселить',
    'admin.reservations.action.checkOut': 'Выселить',
    'admin.reservations.action.markNoShow': 'Отметить неявку',
    'admin.reservations.filter.all': 'Все',
    'admin.reservations.filter.status': 'Статус',
    'admin.reservations.filter.room': 'Номер',
    'admin.reservations.filter.search': 'Поиск',
    'admin.reservations.filter.checkInFrom': 'Заезд с',
    'admin.reservations.filter.checkInTo': 'Заезд по',
    'admin.reservations.confirmCancelTitle': 'Отмена бронирования',
    'admin.reservations.confirmCancelDescription': 'Вы уверены, что хотите отменить это бронирование? Это действие невозможно отменить.',

    // Public reservation flow
    'res.referenceCode': 'Справочный код',
    'res.errorConflict': 'Номер занят на выбранные даты',
    'res.errorValidation': 'Пожалуйста, проверьте введенные данные',
    'res.lookupTitle': 'Найти бронирование',
    'res.lookupNotFound': 'Бронирование не найдено',
  },
}

const I18nContext = createContext<I18nContextType | null>(null)

export const PUBLIC_LOCALE_STORAGE_KEY = 'kai_locale'
export const ADMIN_LOCALE_STORAGE_KEY = 'kai_admin_locale'

function readStoredLocale(storageKey: string, fallback: Locale): Locale {
  if (typeof window === 'undefined') return fallback
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'ka' || saved === 'en' || saved === 'ru') return saved
  } catch {
    // localStorage unavailable (SSR / private mode)
  }
  return fallback
}

function useLocaleScope() {
  const isAdmin = useRouterState({
    select: (state) => state.location.pathname.startsWith('/admin'),
  })

  return {
    storageKey: isAdmin ? ADMIN_LOCALE_STORAGE_KEY : PUBLIC_LOCALE_STORAGE_KEY,
    defaultLocale: (isAdmin ? 'ru' : 'ka') as Locale,
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { storageKey, defaultLocale } = useLocaleScope()
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  // SSR renders the route default; client restores the cached preference after mount.
  useEffect(() => {
    setLocaleState(readStoredLocale(storageKey, defaultLocale))
  }, [storageKey, defaultLocale])

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next)
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        // ignore
      }
    },
    [storageKey],
  )

  const t = useCallback(
    (key: string): string => translations[locale][key] ?? key,
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}


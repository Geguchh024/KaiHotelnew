import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendReservationEmails = action({
  args: {
    guestFullName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    checkInDate: v.string(),
    checkOutDate: v.string(),
    roomNames: v.string(),
    totalPrice: v.number(),
    referenceCode: v.string(),
    specialRequests: v.optional(v.string()),
    adminEmail: v.string(),
    locale: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not configured on the Convex backend. Skipping email delivery.");
      return null;
    }

    const {
      guestFullName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      roomNames,
      totalPrice,
      referenceCode,
      specialRequests,
      adminEmail,
      locale,
    } = args;

    // Localized content for the guest confirmation email
    const locales = {
      ka: {
        subject: `ჯავშნის მოთხოვნა მიღებულია - კოდი: ${referenceCode}`,
        title: "ჯავშნის დადასტურება",
        greeting: `ძვირფასო ${guestFullName},`,
        intro: "გმადლობთ, რომ აირჩიეთ კაი სასტუმრო ბარი. თქვენი ჯავშანი წარმატებით არის მიღებული და ამჟამად იმყოფება დადასტურების მოლოდინში.",
        detailsTitle: "ჯავშნის დეტალები",
        refCode: "საიდენტიფიკაციო კოდი:",
        rooms: "დაჯავშნილი ნომრები:",
        checkIn: "შესვლის თარიღი:",
        checkOut: "გასვლის თარიღი:",
        totalPrice: "ჯამური ფასი:",
        specialRequests: "სპეციალური მოთხოვნები:",
        footerIntro: "ჩვენი პერსონალი განიხილავს თქვენს ჯავშანს და მალე განაახლებს მის სტატუსს. თუ გსურთ ცვლილებების შეტანა ან გაქვთ შეკითხვები, გთხოვთ დაგვიკავშირდეთ:",
        footerAddress: "კაი სასტუმრო ბარი · სამტრედიის ქ. 24, დიდუბე, თბილისი, საქართველო"
      },
      en: {
        subject: `Booking Request Received - Ref: ${referenceCode}`,
        title: "Booking Confirmation",
        greeting: `Dear ${guestFullName},`,
        intro: "Thank you for choosing Kai Hotel Bar. Your reservation has been successfully received and is currently pending confirmation.",
        detailsTitle: "Reservation Details",
        refCode: "Reference Code:",
        rooms: "Rooms Booked:",
        checkIn: "Check-in Date:",
        checkOut: "Check-out Date:",
        totalPrice: "Total Price:",
        specialRequests: "Special Requests:",
        footerIntro: "Our staff will review your booking and update its status shortly. If you need to make changes or have questions, please feel free to reach out to us:",
        footerAddress: "Kai Hotel Bar · 24 Samtredia Street, Didube, Tbilisi, Georgia"
      },
      ru: {
        subject: `Запрос на бронирование получен - Код: ${referenceCode}`,
        title: "Подтверждение бронирования",
        greeting: `Уважаемый(ая) ${guestFullName},`,
        intro: "Спасибо, что выбрали Kai Hotel Bar. Ваше бронирование было успешно получено и в настоящее время ожидает подтверждения.",
        detailsTitle: "Детали бронирования",
        refCode: "Код бронирования:",
        rooms: "Забронированные номера:",
        checkIn: "Дата заезда:",
        checkOut: "Дата выезда:",
        totalPrice: "Итоговая стоимость:",
        specialRequests: "Специальные пожелания:",
        footerIntro: "Наш персонал рассмотрит ваше бронирование и вскоре обновит его статус. Если вам нужно внести изменения или у вас возникли вопросы, пожалуйста, свяжитесь с нами:",
        footerAddress: "Kai Hotel Bar · Грузия, Тбилиси, Дидубе, ул. Самтредиа, 24"
      }
    };

    const activeLocale = locale === "ka" ? "ka" : locale === "ru" ? "ru" : "en";
    const guestText = locales[activeLocale];

    // Create the guest confirmation email body
    const guestHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 26px; color: #1a365d; font-family: Georgia, serif; margin: 0;">Kai Hotel Bar</h1>
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #718096; margin: 4px 0 0 0;">Tbilisi, Georgia</p>
        </div>
        <h2 style="font-size: 20px; color: #2b6cb0; border-bottom: 1px solid #edf2f7; padding-bottom: 12px; margin-top: 0; font-weight: 500;">${guestText.title}</h2>
        <p>${guestText.greeting}</p>
        <p>${guestText.intro}</p>
        
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #edf2f7;">
          <h3 style="margin-top: 0; margin-bottom: 16px; color: #2d3748; font-size: 16px;">${guestText.detailsTitle}</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 8px 0; color: #718096;">${guestText.refCode}</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${referenceCode}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 8px 0; color: #718096;">${guestText.rooms}</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${roomNames}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 8px 0; color: #718096;">${guestText.checkIn}</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${checkInDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 8px 0; color: #718096;">${guestText.checkOut}</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${checkOutDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">${guestText.totalPrice}</td>
              <td style="padding: 8px 0; font-weight: bold; color: #2b6cb0; text-align: right; font-size: 16px;">₾${totalPrice}</td>
            </tr>
            ${
              specialRequests
                ? `
            <tr style="border-top: 1px solid #edf2f7;">
              <td style="padding: 8px 0; color: #718096; vertical-align: top;">${guestText.specialRequests}</td>
              <td style="padding: 8px 0; font-style: italic; text-align: right; word-break: break-word;">${specialRequests}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>
        
        <p>${guestText.footerIntro}</p>
        <p style="margin: 0; padding-left: 10px; border-left: 3px solid #cbd5e0;">
          Email: <a href="mailto:info@kai.com.ge" style="color: #2b6cb0; text-decoration: none;">info@kai.com.ge</a><br>
          Phone: <a href="tel:+995511222028" style="color: #2b6cb0; text-decoration: none;">+995 511 222 028</a>
        </p>
        <p style="margin-top: 30px; font-size: 11px; color: #a0aec0; text-align: center; border-top: 1px solid #edf2f7; padding-top: 16px;">
          ${guestText.footerAddress}
        </p>
      </div>
    `;

    // Create the admin notification email body (bilingual Georgian/English)
    const adminHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #feebc8; border-radius: 12px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 26px; color: #dd6b20; font-family: Georgia, serif; margin: 0;">Kai Hotel Bar</h1>
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #718096; margin: 4px 0 0 0;">Admin Console</p>
        </div>
        <h2 style="font-size: 20px; color: #dd6b20; border-bottom: 1px solid #feebc8; padding-bottom: 12px; margin-top: 0; font-weight: 500;">ახალი ჯავშნის შეტყობინება (New Booking)</h2>
        <p>სისტემაში შემოვიდა ახალი ჯავშანი ვებ-გვერდიდან და საჭიროებს განხილვას.</p>
        
        <div style="background-color: #fffaf0; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #feebc8;">
          <h3 style="margin-top: 0; margin-bottom: 16px; color: #2d3748; font-size: 16px;">დეტალები / Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096;">სტუმრის სახელი (Guest Name):</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${guestFullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096;">ელ-ფოსტა (Email):</td>
              <td style="padding: 8px 0; text-align: right;"><a href="mailto:${guestEmail}" style="color: #2b6cb0; text-decoration: none;">${guestEmail}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096;">ტელეფონი (Phone):</td>
              <td style="padding: 8px 0; text-align: right;"><a href="tel:${guestPhone}" style="color: #2b6cb0; text-decoration: none;">${guestPhone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096;">კოდი (Ref Code):</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #dd6b20;">${referenceCode}</td>
            </tr>
            <tr style="border-bottom: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096;">ნომრები (Rooms):</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${roomNames}</td>
            </tr>
            <tr style="border-bottom: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096;">შესვლა (Check-in):</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${checkInDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096;">გასვლა (Check-out):</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${checkOutDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">ფასი (Total Price):</td>
              <td style="padding: 8px 0; font-weight: bold; color: #c05621; text-align: right; font-size: 16px;">₾${totalPrice}</td>
            </tr>
            ${
              specialRequests
                ? `
            <tr style="border-top: 1px solid #feebc8;">
              <td style="padding: 8px 0; color: #718096; vertical-align: top;">სპეციალური მოთხოვნა (Special Requests):</td>
              <td style="padding: 8px 0; font-style: italic; text-align: right; word-break: break-word;">${specialRequests}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>
        
        <p>სამართავად გთხოვთ შებრძანდეთ ადმინისტრატორის პანელში (Please log in to the admin console to manage this booking).</p>
      </div>
    `;

    // 1. Send guest confirmation email
    const guestEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: guestEmail,
        subject: guestText.subject,
        html: guestHtml,
      }),
    });

    // 2. Send admin alert notification email
    const adminEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: adminEmail,
        subject: `[ახალი ჯავშანი] Ref: ${referenceCode} - ${guestFullName}`,
        html: adminHtml,
      }),
    });

    try {
      const [guestRes, adminRes] = await Promise.all([guestEmailPromise, adminEmailPromise]);
      if (!guestRes.ok) {
        console.error("Resend Guest Email Error:", await guestRes.text());
      }
      if (!adminRes.ok) {
        console.error("Resend Admin Email Error:", await adminRes.text());
      }
    } catch (err) {
      console.error("Failed to send Resend emails:", err);
    }

    return null;
  },
});

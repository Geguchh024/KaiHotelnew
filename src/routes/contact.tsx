import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useI18n } from '@/lib/i18n'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      {
        title: 'კონტაქტი — Contact | Kai Hotel Bar Tbilisi',
      },
      {
        name: 'description',
        content: 'Contact Kai Hotel Bar — 24 Samtredia Street, Didube, Tbilisi 0119. Phone: +995 511 222 028. Near metro station. Send us a message for reservations or inquiries.',
      },
      {
        name: 'keywords',
        content: 'Kai Hotel contact, hotel Tbilisi phone, სასტუმრო კონტაქტი თბილისი, 24 Samtredia Street Tbilisi, Kai Hotel address',
      },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const { locale } = useI18n()
  const siteSettings = useQuery(api.siteSettings.get)
  const submitMessage = useMutation(api.messages.submit)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [inquiryType, setInquiryType] = useState('general')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !body.trim()) {
      setError(
        locale === 'ka'
          ? 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი'
          : 'Please fill in all required fields',
      )
      return
    }

    setIsSubmitting(true)
    try {
      await submitMessage({
        senderName: name.trim(),
        email: email.trim(),
        inquiryType,
        body: body.trim(),
      })
      setIsSuccess(true)
      setName('')
      setEmail('')
      setInquiryType('general')
      setBody('')
    } catch {
      setError(
        locale === 'ka'
          ? 'შეცდომა. გთხოვთ სცადოთ თავიდან.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inquiryOptions = [
    { value: 'general', label: locale === 'ka' ? 'ზოგადი კითხვა' : 'General Inquiry' },
    { value: 'reservation', label: locale === 'ka' ? 'ნომრის ხელმისაწვდომობა' : 'Room Availability & Special Requests' },
    { value: 'feedback', label: locale === 'ka' ? 'უკუკავშირი' : 'Feedback' },
    { value: 'complaint', label: locale === 'ka' ? 'საჩივარი' : 'Complaint' },
    { value: 'other', label: locale === 'ka' ? 'სხვა' : 'Other' },
  ]

  return (
    <>
      <Navbar />

      <main>
        {/* Page Header */}
        <section className="pt-24 sm:pt-32 pb-8 sm:pb-10 px-4 sm:px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20">
          <Reveal>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-3">
              {locale === 'ka' ? 'მოთხოვნა' : 'Inquiry'}
            </span>
            <h1 className="font-[EB_Garamond] text-[30px] sm:text-[40px] md:text-[52px] leading-[1.1] text-primary">
              {locale === 'ka' ? 'კონსიერჟთან დაკავშირება' : 'Connect with the Concierge'}
            </h1>
          </Reveal>
        </section>

        {/* Contact info strip */}
        <section className="border-b border-outline-variant/20 bg-surface-container-low">
          <div className="px-4 sm:px-8 max-w-[1280px] mx-auto py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Phone */}
            <Reveal delay={1} className="flex items-start gap-4">
              <div className="w-10 h-10 border border-outline-variant/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">call</span>
              </div>
              <div>
                <p className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-1">
                  {locale === 'ka' ? 'ტელეფონი' : 'Phone'}
                </p>
                <a
                  href={`tel:${siteSettings?.phone ?? '+995511222028'}`}
                  className="font-[Hanken_Grotesk] text-[14px] text-on-surface hover:text-primary transition-colors"
                >
                  {siteSettings?.phone ?? '+995 511 222 028'}
                </a>
              </div>
            </Reveal>

            {/* Email */}
            <Reveal delay={2} className="flex items-start gap-4">
              <div className="w-10 h-10 border border-outline-variant/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
              </div>
              <div>
                <p className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-1">
                  {locale === 'ka' ? 'ელ-ფოსტა' : 'Email'}
                </p>
                <a
                  href={`mailto:${siteSettings?.email ?? 'info@kai.com.ge'}`}
                  className="font-[Hanken_Grotesk] text-[14px] text-on-surface hover:text-primary transition-colors"
                >
                  {siteSettings?.email ?? 'info@kai.com.ge'}
                </a>
              </div>
            </Reveal>

            {/* Address */}
            <Reveal delay={3} className="flex items-start gap-4">
              <div className="w-10 h-10 border border-outline-variant/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              </div>
              <div>
                <p className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-1">
                  {locale === 'ka' ? 'მისამართი' : 'Address'}
                </p>
                <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">
                  {locale === 'ka'
                    ? (siteSettings?.addressKa ?? 'საქართველო')
                    : (siteSettings?.addressEn ?? 'Georgia')}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Form section */}
        <section className="py-12 sm:py-20 px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

            {/* Left — editorial copy */}
            <Reveal>
              <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-4">
                {locale === 'ka' ? 'შეტყობინება' : 'Message'}
              </span>
              <h2 className="font-[EB_Garamond] text-[28px] sm:text-[36px] md:text-[44px] leading-[1.15] text-primary mb-4 sm:mb-6">
                {locale === 'ka'
                  ? 'გვიამბეთ თქვენი სურვილების შესახებ'
                  : 'Tell Us How We Can Help'}
              </h2>
              <p className="font-[Hanken_Grotesk] text-[15px] leading-[1.7] text-secondary mb-10">
                {locale === 'ka'
                  ? 'გაქვთ შეკითხვა ნომრების, ღონისძიებების ან სპეციალური მოთხოვნების შესახებ? ჩვენი გუნდი მზადაა დაგეხმაროთ.'
                  : 'Whether you have questions about rooms, events, or special requests — our team is ready to assist you with every detail of your stay.'}
              </p>

              {/* Social links */}
              <div className="flex flex-col gap-4">
                {siteSettings?.facebookUrl && (
                  <a
                    href={siteSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-secondary hover:text-primary transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[20px]">public</span>
                    <span className="font-[Hanken_Grotesk] text-[13px] group-hover:underline underline-offset-2">
                      Facebook
                    </span>
                  </a>
                )}
                {siteSettings?.instagramUrl && (
                  <a
                    href={siteSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-secondary hover:text-primary transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    <span className="font-[Hanken_Grotesk] text-[13px] group-hover:underline underline-offset-2">
                      Instagram
                    </span>
                  </a>
                )}
              </div>
            </Reveal>

            {/* Right — form */}
            <Reveal delay={2}>
              {isSuccess ? (
                <div className="border border-outline-variant/30 bg-surface-container-low p-12 text-center">
                  <span
                    className="material-symbols-outlined text-[48px] text-primary block mb-5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <h3 className="font-[EB_Garamond] text-[28px] text-primary mb-3">
                    {locale === 'ka' ? 'შეტყობინება გაიგზავნა' : 'Message Sent'}
                  </h3>
                  <p className="font-[Hanken_Grotesk] text-[14px] text-secondary mb-8 leading-[1.6]">
                    {locale === 'ka'
                      ? 'მადლობა. ჩვენი გუნდი მალე დაგიკავშირდებათ.'
                      : "Thank you for reaching out. Our team will be in touch with you shortly."}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border border-primary px-8 py-2.5 hover:bg-primary/5 transition-colors"
                  >
                    {locale === 'ka' ? 'ახალი შეტყობინება' : 'Send Another'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                      {locale === 'ka' ? 'სახელი' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-secondary/40"
                      placeholder={locale === 'ka' ? 'თქვენი სახელი' : 'Your full name'}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                      {locale === 'ka' ? 'ელ-ფოსტა' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-secondary/40"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Inquiry type — full width */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                      {locale === 'ka' ? 'მოთხოვნის ტიპი' : 'Nature of Inquiry'}
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {inquiryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message — full width */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                      {locale === 'ka' ? 'შეტყობინება' : 'Message'}
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={5}
                      className="bg-transparent border-b border-outline-variant pb-3 font-[Hanken_Grotesk] text-[15px] text-on-surface outline-none focus:border-primary transition-colors resize-none placeholder:text-secondary/40"
                      placeholder={
                        locale === 'ka'
                          ? 'როგორ შეგვიძლია დაგეხმაროთ?'
                          : 'How can we assist in your decompression?'
                      }
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="md:col-span-2 font-[Hanken_Grotesk] text-[12px] text-error">{error}</p>
                  )}

                  {/* Submit */}
                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-on-primary px-12 py-3.5 font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting && (
                        <span className="material-symbols-outlined text-[16px] animate-spin">
                          progress_activity
                        </span>
                      )}
                      {isSubmitting
                        ? (locale === 'ka' ? 'იგზავნება...' : 'Sending...')
                        : (locale === 'ka' ? 'შეტყობინების გაგზავნა' : 'Send Inquiry')}
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

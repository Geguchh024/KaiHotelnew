import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { validateRequired } from '@/utils/formValidation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

interface FormErrors {
  phone?: string
  email?: string
}

type SubmitStatus = 'idle' | 'success' | 'error'

export function SettingsTab() {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()

  const settings = useQuery(api.siteSettings.get)
  const upsertSettings = useMutation(api.siteSettings.upsert)

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [addressKa, setAddressKa] = useState('')
  const [addressEn, setAddressEn] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [aboutKa, setAboutKa] = useState('')
  const [aboutEn, setAboutEn] = useState('')

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  // Pre-populate form when settings load
  useEffect(() => {
    if (settings) {
      setPhone(settings.phone)
      setEmail(settings.email)
      setAddressKa(settings.addressKa)
      setAddressEn(settings.addressEn)
      setInstagramUrl(settings.instagramUrl)
      setFacebookUrl(settings.facebookUrl)
      setAboutKa(settings.aboutKa)
      setAboutEn(settings.aboutEn)
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')

    // Validate required fields
    const newErrors: FormErrors = {}
    const phoneError = validateRequired(phone)
    const emailError = validateRequired(email)
    if (phoneError) newErrors.phone = phoneError
    if (emailError) newErrors.email = emailError

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await upsertSettings({
        sessionToken: sessionToken!,
        phone,
        email,
        addressKa,
        addressEn,
        instagramUrl,
        facebookUrl,
        aboutKa,
        aboutEn,
      })
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const labelClass =
    'font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary'
  const inputClass =
    'bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50'
  const textareaClass =
    'bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors resize-none placeholder:text-on-surface-variant/50'
  const errorClass = 'text-error text-[12px] font-[Hanken_Grotesk]'

  return (
    <div>
      <div className="mb-8">
        <h3 className="font-[EB_Garamond] text-[28px] text-primary">
          {t('admin.settings.title')}
        </h3>
        <p className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant mt-1">
          {t('admin.settings.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 max-w-3xl">
        {/* Contact Information */}
        <section>
          <h4 className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70 mb-4 pb-2 border-b border-outline-variant/30">
            {t('admin.settings.contactInfo')}
          </h4>

          <div className="flex flex-col gap-6">
            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="settings-phone" className={labelClass}>
                {t('admin.settings.phone')}
              </label>
              <input
                id="settings-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                }}
                placeholder="+995 511 222 028"
                className={inputClass}
                aria-required="true"
                aria-describedby={errors.phone ? 'settings-phone-error' : undefined}
              />
              {errors.phone && (
                <p id="settings-phone-error" role="alert" className={errorClass}>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="settings-email" className={labelClass}>
                {locale === 'ka' ? 'ელ-ფოსტა *' : 'Email *'}
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="info@kaihotel.ge"
                className={inputClass}
                aria-required="true"
                aria-describedby={errors.email ? 'settings-email-error' : undefined}
              />
              {errors.email && (
                <p id="settings-email-error" role="alert" className={errorClass}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Address � bilingual side-by-side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="settings-address-ka" className={labelClass}>
                  {t('admin.settings.addressKa')}
                </label>
                <input
                  id="settings-address-ka"
                  type="text"
                  value={addressKa}
                  onChange={(e) => setAddressKa(e.target.value)}
                  placeholder={locale === 'ka' ? 'ქ. ბათუმი, ...' : 'Batumi, ...'}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="settings-address-en" className={labelClass}>
                  {t('admin.settings.addressEn')}
                </label>
                <input
                  id="settings-address-en"
                  type="text"
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  placeholder="Batumi, ..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section>
          <h4 className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70 mb-4 pb-2 border-b border-outline-variant/30">
            {t('admin.settings.socialMedia')}
          </h4>

          <div className="flex flex-col gap-6">
            {/* Instagram URL */}
            <div className="flex flex-col gap-1">
              <label htmlFor="settings-instagram" className={labelClass}>
                {locale === 'ka' ? 'Instagram URL' : 'Instagram URL'}
              </label>
              <input
                id="settings-instagram"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/kaihotelbar"
                className={inputClass}
              />
            </div>

            {/* Facebook URL */}
            <div className="flex flex-col gap-1">
              <label htmlFor="settings-facebook" className={labelClass}>
                {locale === 'ka' ? 'Facebook URL' : 'Facebook URL'}
              </label>
              <input
                id="settings-facebook"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/kaihotelbar"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* About � bilingual side-by-side */}
        <section>
          <h4 className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70 mb-4 pb-2 border-b border-outline-variant/30">
            {t('admin.settings.about')}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="settings-about-ka" className={labelClass}>
                {t('admin.settings.aboutKa')}
              </label>
              <textarea
                id="settings-about-ka"
                value={aboutKa}
                onChange={(e) => setAboutKa(e.target.value)}
                rows={5}
                placeholder={
                  locale === 'ka'
                    ? 'სასტუმროს შესახებ ქართულად...'
                    : 'About the hotel in Georgian...'
                }
                className={textareaClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="settings-about-en" className={labelClass}>
                {t('admin.settings.aboutEn')}
              </label>
              <textarea
                id="settings-about-en"
                value={aboutEn}
                onChange={(e) => setAboutEn(e.target.value)}
                rows={5}
                placeholder="About the hotel in English..."
                className={textareaClass}
              />
            </div>
          </div>
        </section>

        {/* Submit feedback */}
        {submitStatus === 'success' && (
          <p
            role="status"
            className="font-[Hanken_Grotesk] text-[13px] text-primary flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              check_circle
            </span>
            {locale === 'ka'
              ? 'პარამეტრები წარმატებით შეინახა'
              : 'Settings saved successfully'}
          </p>
        )}
        {submitStatus === 'error' && (
          <p
            role="alert"
            className="font-[Hanken_Grotesk] text-[13px] text-error flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              error
            </span>
            {locale === 'ka'
              ? 'შეცდომა. გთხოვთ სცადოთ თავიდან.'
              : 'Something went wrong. Please try again.'}
          </p>
        )}

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-on-primary px-8 py-3 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span
                  className="material-symbols-outlined text-[18px] animate-spin"
                  aria-hidden="true"
                >
                  progress_activity
                </span>
                {locale === 'ka' ? 'შენახვა...' : 'Saving...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  save
                </span>
                {locale === 'ka' ? 'შენახვა' : 'Save Settings'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}



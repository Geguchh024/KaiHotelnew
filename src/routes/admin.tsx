import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

const stats = [
  {
    label: { ka: 'დატვირთვის მაჩვენებელი', en: 'Occupancy Rate' },
    value: '84',
    suffix: '%',
    change: { ka: '+4.2% გასული კვირიდან', en: '+4.2% from last week' },
    icon: 'trending_up',
  },
  {
    label: { ka: 'წმინდა შემოსავალი', en: 'Net Revenue' },
    value: '$14.2',
    suffix: 'k',
    change: { ka: 'დღიური საშუალო $2,400', en: 'Daily average $2,400' },
    icon: 'payments',
  },
  {
    label: { ka: 'ახალი რეზერვაციები', en: 'New Reservations' },
    value: '28',
    suffix: '',
    change: { ka: 'დადასტურების მოლოდინში: 4', en: 'Pending confirmation: 4' },
    icon: 'book_online',
  },
]

const recentReservations = [
  {
    guest: 'Evelyn Thorne',
    id: '#RE-4402',
    roomType: { ka: 'ბოტანიკური ლუქსი', en: 'Botanical Suite' },
    checkIn: 'Oct 26, 2024',
    status: 'confirmed',
  },
  {
    guest: 'Marcus Sterling',
    id: '#RE-4405',
    roomType: { ka: 'ბაღის ტერასა', en: 'Garden Terrace' },
    checkIn: 'Oct 27, 2024',
    status: 'pending',
  },
  {
    guest: 'Julianne Moss',
    id: '#RE-4409',
    roomType: { ka: 'ხეხილის ხედი', en: 'Orchard View' },
    checkIn: 'Oct 29, 2024',
    status: 'confirmed',
  },
]

const navItems = [
  { icon: 'analytics', label: { ka: 'ანალიტიკა', en: 'Analytics' }, active: true },
  { icon: 'calendar_today', label: { ka: 'რეზერვაციები', en: 'Reservations' }, active: false },
  { icon: 'bed', label: { ka: 'ნომრები', en: 'Rooms' }, active: false },
  { icon: 'photo_library', label: { ka: 'გალერეა', en: 'Gallery' }, active: false },
  { icon: 'handshake', label: { ka: 'სპონსორები', en: 'Sponsors' }, active: false },
  { icon: 'mail', label: { ka: 'შეტყობინებები', en: 'Messages' }, active: false },
]

const barLegend = [
  { icon: 'eco', label: { ka: 'ახალი მწვანილი', en: 'Fresh Herbs' }, value: { ka: '92% მარაგი', en: '92% Supply' } },
  { icon: 'local_bar', label: { ka: 'ყვავილოვანი სპირტი', en: 'Floral Spirits' }, value: { ka: '45 ერთეული', en: '45 units' } },
  { icon: 'water_drop', label: { ka: 'ესენციები', en: 'Essences' }, value: { ka: 'ოპტიმალური', en: 'Optimal' } },
]

function AdminDashboard() {
  const { t, locale, setLocale } = useI18n()
  const [activeNav, setActiveNav] = useState('Analytics')

  const currentDate = new Date()
  const timeStr = currentDate.toLocaleTimeString(locale === 'ka' ? 'ka-GE' : 'en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr = currentDate.toLocaleDateString(locale === 'ka' ? 'ka-GE' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/50 flex flex-col p-6 z-50">
        <div className="mb-10">
          <h1 className="font-[EB_Garamond] text-[24px] leading-[1.4] font-medium text-primary mb-1">
            {locale === 'ka' ? 'Kai ადმინი' : 'Kai Admin'}
          </h1>
          <p className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70">
            Botanical Suite
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.icon}
              onClick={() => setActiveNav(item.label.en)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 text-left',
                activeNav === item.label.en
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              )}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-[Hanken_Grotesk] text-[13px] font-semibold">{item.label[locale]}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant/30 flex flex-col gap-1.5">
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 rounded-full text-left">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="font-[Hanken_Grotesk] text-[13px] font-semibold">{locale === 'ka' ? 'პარამეტრები' : 'Settings'}</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 rounded-full"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-[Hanken_Grotesk] text-[13px] font-semibold">{locale === 'ka' ? 'გასვლა' : 'Logout'}</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen px-8 py-10 max-w-[1280px]">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLocale(locale === 'ka' ? 'en' : 'ka')}
            className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2.5 py-1.5 rounded-sm"
          >
            {locale === 'ka' ? 'EN' : 'ქარ'}
          </button>
        </div>

        {/* Welcome Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-[EB_Garamond] text-[36px] md:text-[48px] leading-[1.2] text-primary mb-2">
              {locale === 'ka' ? 'გამარჯობა, ადმინისტრატორ' : 'Welcome back, Administrator'}
            </h2>
            <div className="flex items-center gap-4 text-secondary/80">
              <span className="font-[Hanken_Grotesk] text-[13px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                {timeStr}
              </span>
              <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
              <span className="font-[Hanken_Grotesk] text-[13px] font-semibold uppercase tracking-[0.1em]">{dateStr}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-surface-container-high px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold hover:bg-surface-variant transition-colors">
              {locale === 'ka' ? 'ანგარიშის გენერაცია' : 'Generate Report'}
            </button>
            <Link
              to="/reservations"
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold hover:opacity-90 transition-opacity"
            >
              {locale === 'ka' ? 'ახალი ჯავშანი' : 'New Booking'}
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label.en}
              className="bg-surface-container-lowest border border-outline-variant/30 p-8 flex flex-col justify-between min-h-[180px] group hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <span className="font-[Hanken_Grotesk] text-[12px] font-semibold text-secondary uppercase tracking-[0.1em]">
                  {stat.label[locale]}
                </span>
                <span className="material-symbols-outlined text-inverse-primary text-[22px]">{stat.icon}</span>
              </div>
              <div>
                <h3 className="font-[EB_Garamond] text-[44px] md:text-[56px] leading-none text-primary">
                  {stat.value}
                  {stat.suffix && <span className="text-[0.5em]">{stat.suffix}</span>}
                </h3>
                <p className="font-[Hanken_Grotesk] text-[14px] text-on-surface-variant mt-2">{stat.change[locale]}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Reservations Table */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-[EB_Garamond] text-[24px] leading-[1.4] font-medium text-primary">
                {locale === 'ka' ? 'ბოლო რეზერვაციები' : 'Recent Reservations'}
              </h4>
              <Link
                to="/reservations"
                className="font-[Hanken_Grotesk] text-[13px] font-semibold text-primary border-b border-primary/20 pb-0.5 hover:border-primary transition-all"
              >
                {locale === 'ka' ? 'ყველას ნახვა' : 'View All'}
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="py-4 font-[Hanken_Grotesk] text-[11px] font-semibold text-secondary uppercase tracking-[0.1em]">
                      {locale === 'ka' ? 'სტუმარი' : 'Guest'}
                    </th>
                    <th className="py-4 font-[Hanken_Grotesk] text-[11px] font-semibold text-secondary uppercase tracking-[0.1em]">
                      {locale === 'ka' ? 'ნომრის ტიპი' : 'Room Type'}
                    </th>
                    <th className="py-4 font-[Hanken_Grotesk] text-[11px] font-semibold text-secondary uppercase tracking-[0.1em]">
                      {locale === 'ka' ? 'შესვლა' : 'Check-In'}
                    </th>
                    <th className="py-4 font-[Hanken_Grotesk] text-[11px] font-semibold text-secondary uppercase tracking-[0.1em]">
                      {locale === 'ka' ? 'სტატუსი' : 'Status'}
                    </th>
                    <th className="py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {recentReservations.map((res) => (
                    <tr key={res.id}>
                      <td className="py-6">
                        <div className="font-[Hanken_Grotesk] text-[14px] font-bold text-on-surface">{res.guest}</div>
                        <div className="font-[Hanken_Grotesk] text-[11px] text-secondary">ID: {res.id}</div>
                      </td>
                      <td className="py-6 font-[Hanken_Grotesk] text-[14px] text-on-surface-variant">{res.roomType[locale]}</td>
                      <td className="py-6 font-[Hanken_Grotesk] text-[14px] text-on-surface-variant">{res.checkIn}</td>
                      <td className="py-6">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-[11px] font-semibold',
                            res.status === 'confirmed'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-tertiary-container/20 text-tertiary',
                          )}
                        >
                          {res.status === 'confirmed'
                            ? (locale === 'ka' ? 'დადასტურებული' : 'Confirmed')
                            : (locale === 'ka' ? 'მოლოდინში' : 'Pending')}
                        </span>
                      </td>
                      <td className="py-6 text-right">
                        <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors text-[20px]">
                          more_vert
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Highlights */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Manager's Note Card */}
            <div className="bg-primary p-8 text-on-primary overflow-hidden relative min-h-[250px] flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40"></div>
              <div className="relative z-10">
                <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80 mb-2 block">
                  {locale === 'ka' ? 'მენეჯერის შენიშვნა' : "Manager's Note"}
                </span>
                <h5 className="font-[EB_Garamond] text-[22px] leading-[1.3] mb-4">
                  {locale === 'ka' ? 'საღამოს ღონისძიება: ბოტანიკური ინფუზიის ღამე' : 'Evening Event: Botanical Infusion Night'}
                </h5>
                <p className="font-[Hanken_Grotesk] text-[13px] opacity-90 leading-relaxed mb-6">
                  {locale === 'ka'
                    ? 'პერსონალის ბრიფინგი 5:00 PM-ზე კონსერვატორიის ბარში.'
                    : 'Staff briefing at 5:00 PM in the Conservatory Bar. Ensure herbal legends are updated.'}
                </p>
                <button className="px-5 py-2 border border-on-primary/30 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold hover:bg-on-primary hover:text-primary transition-all">
                  {locale === 'ka' ? 'დეტალები' : 'Details'}
                </button>
              </div>
            </div>

            {/* Bar Legend Status */}
            <div className="bg-surface-container-high p-8 border border-outline-variant/30">
              <h5 className="font-[Hanken_Grotesk] text-[11px] font-semibold text-primary uppercase tracking-[0.15em] mb-6">
                {locale === 'ka' ? 'ბარის ლეგენდის სტატუსი' : 'Bar Legend Status'}
              </h5>
              <div className="space-y-4">
                {barLegend.map((item) => (
                  <div key={item.icon} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                      <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">{item.label[locale]}</span>
                    </div>
                    <span className="font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant">{item.value[locale]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

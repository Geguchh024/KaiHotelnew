import type { Transition } from '../../../convex/availability'
import type { Locale } from '@/lib/i18n'

type Tone = 'destructive' | 'primary'

export interface TransitionPrompt {
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  tone: Tone
  icon: string
}

/**
 * Localized confirmation copy for every status transition. Shared between the
 * row action buttons and the detail panel so the prompt stays consistent
 * regardless of which surface initiated the action.
 *
 * Tones:
 *  - `cancel` is destructive (red confirm button).
 *  - everything else uses the brand primary tone.
 */
export function transitionPrompt(
  transition: Transition,
  locale: Locale,
  context?: { guestName?: string; roomName?: string },
): TransitionPrompt {
  const ka = locale === 'ka'
  const ru = locale === 'ru'
  const guest = context?.guestName ? ` (${context.guestName})` : ''

  switch (transition) {
    case 'confirm':
      return {
        title: ka ? 'რეზერვაციის დადასტურება' : ru ? 'Подтвердить бронирование' : 'Confirm reservation',
        description: ka
          ? `დარწმუნებული ხართ, რომ გსურთ ამ რეზერვაციის${guest} დადასტურება? სტუმარს ეცნობება, რომ ჯავშანი დასტურდა.`
          : ru
          ? `Вы уверены, что хотите подтвердить это бронирование${guest}? Гость будет ожидать заселения.`
          : `Mark this reservation${guest} as confirmed? The guest is treated as expected to arrive.`,
        confirmLabel: ka ? 'დადასტურება' : ru ? 'Подтвердить' : 'Confirm',
        cancelLabel: ka ? 'არა, უკან' : ru ? 'Нет, назад' : 'No, go back',
        tone: 'primary',
        icon: 'check_circle',
      }
    case 'checkIn':
      return {
        title: ka ? 'სტუმრის შესვლა' : ru ? 'Заселить гостя' : 'Check guest in',
        description: ka
          ? `დარწმუნებული ხართ, რომ გსურთ${guest ? ` ${context?.guestName}-ის` : ' ამ სტუმრის'} შესვლა? სტატუსი შეიცვლება „შესული"-ად.`
          : ru
          ? `Заселить этого гостя${guest} сейчас? Статус изменится на «Заселен».`
          : `Check this guest${guest} in now? Their status will change to Checked In.`,
        confirmLabel: ka ? 'შესვლა' : ru ? 'Заселить' : 'Check in',
        cancelLabel: ka ? 'არა, უკან' : ru ? 'Нет, назад' : 'No, go back',
        tone: 'primary',
        icon: 'login',
      }
    case 'checkOut':
      return {
        title: ka ? 'სტუმრის გასვლა' : ru ? 'Выселить гостя' : 'Check guest out',
        description: ka
          ? `დარწმუნებული ხართ, რომ გსურთ${guest ? ` ${context?.guestName}-ის` : ' ამ სტუმრის'} გასვლა? სტატუსი შეიცვლება „გასული"-ად და ნომერი გათავისუფლდება.`
          : ru
          ? `Выселить этого гостя${guest} сейчас? Номер освободится, а статус изменится на «Выселен».`
          : `Check this guest${guest} out now? The room will be released and marked Checked Out.`,
        confirmLabel: ka ? 'გასვლა' : ru ? 'Выселить' : 'Check out',
        cancelLabel: ka ? 'არა, უკან' : ru ? 'Нет, назад' : 'No, go back',
        tone: 'primary',
        icon: 'logout',
      }
    case 'markNoShow':
      return {
        title: ka ? 'არ გამოცხადდა' : ru ? 'Отметить неявку' : 'Mark as no-show',
        description: ka
          ? `დარწმუნებული ხართ, რომ ამ სტუმარი${guest} არ გამოცხადდა? რეზერვაცია არქივში გადავა.`
          : ru
          ? `Отметить бронирование${guest} как неявку? Оно будет перемещено в архив.`
          : `Mark this reservation${guest} as a no-show? It will move to the archive.`,
        confirmLabel: ka ? 'მონიშვნა' : ru ? 'Отметить неявку' : 'Mark no-show',
        cancelLabel: ka ? 'არა, უკან' : ru ? 'Нет, назад' : 'No, go back',
        tone: 'primary',
        icon: 'person_off',
      }
    case 'cancel':
      return {
        title: ka ? 'რეზერვაციის გაუქმება' : ru ? 'Отменить бронирование' : 'Cancel reservation',
        description: ka
          ? `ნამდვილად გსურთ ამ რეზერვაციის${guest} გაუქმება? ეს მოქმედება შეუქცევადია — თარიღები დაუყოვნებლივ გათავისუფლდება.`
          : ru
          ? `Отменить это бронирование${guest}? Это действие невозможно отменить — даты освободятся немедленно.`
          : `Cancel this reservation${guest}? This cannot be undone — the dates will be released immediately.`,
        confirmLabel: ka ? 'დიახ, გაუქმება' : ru ? 'Да, отменить' : 'Yes, cancel',
        cancelLabel: ka ? 'არა, უკან' : ru ? 'Нет, назад' : 'No, go back',
        tone: 'destructive',
        icon: 'cancel',
      }
  }
}

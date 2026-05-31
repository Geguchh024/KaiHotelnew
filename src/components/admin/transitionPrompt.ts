import type { Transition } from '../../../convex/availability'

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
  locale: 'ka' | 'en',
  context?: { guestName?: string; roomName?: string },
): TransitionPrompt {
  const ka = locale === 'ka'
  const guest = context?.guestName ? ` (${context.guestName})` : ''

  switch (transition) {
    case 'confirm':
      return {
        title: ka ? 'რეზერვაციის დადასტურება' : 'Confirm reservation',
        description: ka
          ? `დარწმუნებული ხართ, რომ გსურთ ამ რეზერვაციის${guest} დადასტურება? სტუმარს ეცნობება, რომ ჯავშანი დასტურდა.`
          : `Mark this reservation${guest} as confirmed? The guest is treated as expected to arrive.`,
        confirmLabel: ka ? 'დადასტურება' : 'Confirm',
        cancelLabel: ka ? 'არა, უკან' : 'No, go back',
        tone: 'primary',
        icon: 'check_circle',
      }
    case 'checkIn':
      return {
        title: ka ? 'სტუმრის შესვლა' : 'Check guest in',
        description: ka
          ? `დარწმუნებული ხართ, რომ გსურთ${guest ? ` ${context?.guestName}-ის` : ' ამ სტუმრის'} შესვლა? სტატუსი შეიცვლება „შესული"-ად.`
          : `Check this guest${guest} in now? Their status will change to Checked In.`,
        confirmLabel: ka ? 'შესვლა' : 'Check in',
        cancelLabel: ka ? 'არა, უკან' : 'No, go back',
        tone: 'primary',
        icon: 'login',
      }
    case 'checkOut':
      return {
        title: ka ? 'სტუმრის გასვლა' : 'Check guest out',
        description: ka
          ? `დარწმუნებული ხართ, რომ გსურთ${guest ? ` ${context?.guestName}-ის` : ' ამ სტუმრის'} გასვლა? სტატუსი შეიცვლება „გასული"-ად და ნომერი გათავისუფლდება.`
          : `Check this guest${guest} out now? The room will be released and marked Checked Out.`,
        confirmLabel: ka ? 'გასვლა' : 'Check out',
        cancelLabel: ka ? 'არა, უკან' : 'No, go back',
        tone: 'primary',
        icon: 'logout',
      }
    case 'markNoShow':
      return {
        title: ka ? 'არ გამოცხადდა' : 'Mark as no-show',
        description: ka
          ? `დარწმუნებული ხართ, რომ ამ სტუმარი${guest} არ გამოცხადდა? რეზერვაცია არქივში გადავა.`
          : `Mark this reservation${guest} as a no-show? It will move to the archive.`,
        confirmLabel: ka ? 'მონიშვნა' : 'Mark no-show',
        cancelLabel: ka ? 'არა, უკან' : 'No, go back',
        tone: 'primary',
        icon: 'person_off',
      }
    case 'cancel':
      return {
        title: ka ? 'რეზერვაციის გაუქმება' : 'Cancel reservation',
        description: ka
          ? `ნამდვილად გსურთ ამ რეზერვაციის${guest} გაუქმება? ეს მოქმედება შეუქცევადია — თარიღები დაუყოვნებლივ გათავისუფლდება.`
          : `Cancel this reservation${guest}? This cannot be undone — the dates will be released immediately.`,
        confirmLabel: ka ? 'დიახ, გაუქმება' : 'Yes, cancel',
        cancelLabel: ka ? 'არა, უკან' : 'No, go back',
        tone: 'destructive',
        icon: 'cancel',
      }
  }
}

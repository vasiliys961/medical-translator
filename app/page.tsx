'use client'

import { useState } from 'react'
import RealtimeTranslatorPanel from '@/components/RealtimeTranslator'
import { DEFAULT_LOCALE, LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/config'

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <label className="mb-4 block text-sm font-medium text-slate-700">
        Interface
        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value as Locale)}
          className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {SUPPORTED_LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </label>
      <RealtimeTranslatorPanel locale={locale} />
    </main>
  )
}

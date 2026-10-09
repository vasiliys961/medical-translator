'use client'

import { useState } from 'react'
import AccessGate from '@/components/AccessGate'
import RealtimeTranslatorPanel from '@/components/RealtimeTranslator'
import { DEFAULT_LOCALE, INTERFACE_LANGUAGE_LABEL, LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/config'
import { translatorUi } from '@/lib/i18n/translator-ui'

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)
  const copy = translatorUi[locale]

  return (
    <div className="min-h-screen">
      <header className="bg-primary-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <a
              href="https://doctor-opus-global.vercel.app"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-primary-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-base" aria-hidden>🩺</span>
              Doctor Opus
            </a>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary-200">{copy.title}</p>
          </div>
          <label className="text-xs font-semibold text-primary-100">
            {INTERFACE_LANGUAGE_LABEL[locale]}
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              className="mt-1 block rounded-lg border border-white/20 bg-white px-3 py-2 text-sm font-medium text-primary-900"
            >
              {SUPPORTED_LOCALES.map((code) => (
                <option key={code} value={code}>
                  {LOCALE_LABELS[code]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <a
          href="https://vrachirf.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center rounded-xl border border-primary-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md"
        >
          <img src="/vrachirf-logo.png" alt="Врачи РФ" className="h-8 w-auto" />
        </a>
        <AccessGate locale={locale}>
          <RealtimeTranslatorPanel locale={locale} />
        </AccessGate>
      </main>
    </div>
  )
}

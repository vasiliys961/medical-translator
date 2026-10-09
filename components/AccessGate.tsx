'use client'

import { FormEvent, useEffect, useState, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/config'

const GATE = {
  en: {
    loading: 'Loading…',
    title: 'Sign in',
    intro: 'Specialized medical translator. Real-time voice for the visit, across 18 languages, with automatic language detection.',
    sameAccount: 'Use the same email and password as Doctor Opus.',
    email: 'Email',
    password: 'Password',
    failed: 'Sign-in failed',
    pending: 'Signing in…',
    submit: 'Sign in',
    signOut: 'Sign out',
  },
  ru: {
    loading: 'Загрузка…',
    title: 'Вход',
    intro: 'Специализированный медицинский переводчик. Голос в реальном времени на приёме, 18 языков, с автоматическим определением языка.',
    sameAccount: 'Используйте тот же адрес и пароль, что и в Doctor Opus.',
    email: 'Эл. почта',
    password: 'Пароль',
    failed: 'Не удалось войти',
    pending: 'Вход…',
    submit: 'Войти',
    signOut: 'Выйти',
  },
} as const

export default function AccessGate({ locale = 'en', children }: { locale?: Locale; children: ReactNode }) {
  const copy = locale === 'ru' ? GATE.ru : GATE.en
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [draftEmail, setDraftEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((body) => {
        if (!cancelled) setEmail(typeof body?.email === 'string' ? body.email : null)
      })
      .catch(() => {
        if (!cancelled) setEmail(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function signIn(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: draftEmail, password }),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(typeof body?.error === 'string' ? body.error : copy.failed)
        return
      }
      setPassword('')
      setEmail(typeof body?.email === 'string' ? body.email : draftEmail.trim().toLowerCase())
    } catch {
      setError(copy.failed)
    } finally {
      setPending(false)
    }
  }

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setEmail(null)
  }

  if (!ready) {
    return <p className="text-sm text-slate-500">{copy.loading}</p>
  }

  if (!email) {
    return (
      <form onSubmit={signIn} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-lg">
        <h1 className="text-lg font-semibold text-primary-900">{copy.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {copy.intro}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          <a
            href="https://doctor-opus-global.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-800 hover:underline"
          >
            doctor-opus-global.vercel.app
          </a>
        </p>
        <p className="mt-2 text-sm text-slate-600">{copy.sameAccount}</p>
        <label className="mt-4 block text-sm font-medium text-primary-900">
          {copy.email}
          <input
            type="email"
            autoComplete="username"
            value={draftEmail}
            onChange={(event) => setDraftEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-primary-200 px-3 py-2 text-base"
            required
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-primary-900">
          {copy.password}
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-primary-200 px-3 py-2 text-base"
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? copy.pending : copy.submit}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          <a href="mailto:vasily61@inbox.ru" className="font-semibold text-primary-800 hover:underline">
            vasily61@inbox.ru
          </a>
        </p>
      </form>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-600">
        <span>{email}</span>
        <button type="button" onClick={signOut} className="font-semibold text-primary-800 hover:underline">
          {copy.signOut}
        </button>
      </div>
      {children}
    </div>
  )
}

export type PassPrompt = {
  answer: string
  answered: string
}

const PROMPTS: Record<string, PassPrompt> = {
  ru: { answer: 'Отвечаю', answered: 'Я ответил. Жду ответа' },
  en: { answer: 'I answer', answered: 'I answered. Waiting for an answer' },
  es: { answer: 'Respondo', answered: 'Ya respondí. Espero la respuesta' },
  fr: { answer: 'Je réponds', answered: 'J’ai répondu. J’attends la réponse' },
  de: { answer: 'Ich antworte', answered: 'Ich habe geantwortet. Ich warte' },
  it: { answer: 'Rispondo', answered: 'Ho risposto. Aspetto la risposta' },
  pt: { answer: 'Respondo', answered: 'Já respondi. Espero a resposta' },
  zh: { answer: '我来回答', answered: '我说完了。等回答' },
  ja: { answer: '答えます', answered: '答えました。返事を待ちます' },
  ko: { answer: '답합니다', answered: '답했습니다. 답을 기다립니다' },
  hi: { answer: 'मैं जवाब दूँ', answered: 'मैंने जवाब दिया। इंतज़ार है' },
  id: { answer: 'Saya jawab', answered: 'Saya sudah jawab. Menunggu' },
  vi: { answer: 'Tôi trả lời', answered: 'Tôi đã trả lời. Đang chờ' },
  ar: { answer: 'أجيب', answered: 'أجبت. أنتظر الإجابة' },
  tr: { answer: 'Cevaplıyorum', answered: 'Cevapladım. Bekliyorum' },
  uk: { answer: 'Відповідаю', answered: 'Я відповів. Чекаю відповіді' },
  ms: { answer: 'Saya jawab', answered: 'Saya sudah jawab. Menunggu' },
  pl: { answer: 'Odpowiadam', answered: 'Odpowiedziałem. Czekam' },
}

const FALLBACK = PROMPTS.en

export function passPrompt(languageCode: string): PassPrompt {
  return PROMPTS[languageCode] ?? FALLBACK
}

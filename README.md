# Medical Translator

Live speech translation for a doctor–patient visit. This project is a copy of the translator section from Doctor Opus, so the speech flow can be changed here without touching the clinic app.

The doctor’s language and the patient’s language stay fixed. **Now the patient** passes the microphone to the patient. **Now the doctor** passes it back. **End** closes the session.

Sign-in, the database, and credit charges stay in Doctor Opus. This app does not deduct a balance.

## Run

```bash
cp .env.example .env.local
```

Put `OPENAI_API_KEY` in `.env.local`, then:

```bash
npm install
npm run dev
```

Open http://localhost:3001

## Tests

```bash
npm test
```

import { useEffect, useState } from 'react'
import { Grid2X2, Languages, ChevronDown, Moon, Sun } from 'lucide-react'
import type { Dictionary, Language } from '../dictionary'

type Props = {
  text: Dictionary
  language: Language
  onLanguageChange: (language: Language) => void
}

export function EditorHeader({ text, language, onLanguageChange }: Props) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])
  return (
    <header>
      <div className="brand">
        <Grid2X2 aria-hidden="true" />
        Block Blast Placement
      </div>
      <div className="settings">
        <label className="language">
          <Languages />
          <select
            aria-label={text.language}
            value={language}
            onChange={(e) =>
              onLanguageChange(e.target.value === 'en' ? 'en' : 'id')
            }
          >
            <option value="id" aria-label={text.indonesian}>
              ID
            </option>
            <option value="en" aria-label={text.english}>
              EN
            </option>
          </select>
          <ChevronDown />
        </label>
        <button
          type="button"
          className="theme-switch"
          role="switch"
          aria-label={text.darkMode}
          aria-checked={dark}
          onClick={() => setDark((value) => !value)}
        >
          <Sun aria-hidden="true" />
          <Moon aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

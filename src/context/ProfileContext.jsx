import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultProfile } from '../data/profile.js'

const STORAGE_KEY = 'profile-website:data:v1'

const ProfileContext = createContext(null)

function mergeWithDefaults(parsed) {
  return {
    ...defaultProfile,
    ...parsed,
    labels: { ...defaultProfile.labels, ...(parsed?.labels || {}) },
    sections: { ...defaultProfile.sections, ...(parsed?.sections || {}) },
  }
}

function loadFromStorage() {
  if (typeof window === 'undefined') return defaultProfile
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProfile
    const parsed = JSON.parse(raw)
    return mergeWithDefaults(parsed)
  } catch {
    return defaultProfile
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadFromStorage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // ignore quota / private-mode errors
    }
  }, [profile])

  const resetProfile = useCallback(() => setProfile(defaultProfile), [])

  const importProfile = useCallback((data) => {
    if (!data || typeof data !== 'object') {
      throw new Error('Imported file is not a valid profile object.')
    }
    setProfile(mergeWithDefaults(data))
  }, [])

  const exportProfile = useCallback(() => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const slug =
      (profile.name || 'profile')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'profile'
    a.href = url
    a.download = `${slug}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [profile])

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      resetProfile,
      importProfile,
      exportProfile,
    }),
    [profile, resetProfile, importProfile, exportProfile],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) {
    throw new Error('useProfile must be used inside a ProfileProvider')
  }
  return ctx
}

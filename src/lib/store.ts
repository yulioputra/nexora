import { create } from 'zustand'

export type Section = 'overview' | 'explore' | 'missions' | 'collection' | 'space' | 'apps' | 'settings'

interface NexoraState {
  section: Section
  theme: 'dark' | 'light'
  xp: number
  level: number
  completedMissions: string[]
  setSection: (section: Section) => void
  toggleTheme: () => void
  completeMission: (id: string, reward: number) => void
}

const savedSettings = JSON.parse(localStorage.getItem('nexora-settings') || '{}')
const savedProgress = JSON.parse(localStorage.getItem('nexora-progress') || '{}')

export const useNexora = create<NexoraState>((set, get) => ({
  section: 'overview',
  theme: savedSettings.theme === 'light' ? 'light' : 'dark',
  xp: Number(savedProgress.xp || 0),
  level: Number(savedProgress.level || 1),
  completedMissions: Array.isArray(savedProgress.completedMissions) ? savedProgress.completedMissions : [],
  setSection: (section) => set({ section }),
  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('nexora-settings', JSON.stringify({ ...savedSettings, theme }))
    set({ theme })
  },
  completeMission: (id, reward) => {
    const current = get()
    if (current.completedMissions.includes(id)) return
    const xp = current.xp + reward
    const level = Math.floor(xp / 500) + 1
    const completedMissions = [...current.completedMissions, id]
    const progress = { xp, level, completedMissions }
    localStorage.setItem('nexora-progress', JSON.stringify(progress))
    set({ xp, level, completedMissions })
  },
}))

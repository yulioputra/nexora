import Dexie, { type Table } from 'dexie'

export interface Artifact {
  id: string
  name: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  description: string
  discoveredAt: number
}

export interface JournalEntry {
  id: string
  title: string
  body: string
  createdAt: number
}

class NexoraDatabase extends Dexie {
  artifacts!: Table<Artifact, string>
  journal!: Table<JournalEntry, string>

  constructor() {
    super('nexora-local')
    this.version(1).stores({
      artifacts: 'id, name, rarity, discoveredAt',
      journal: 'id, title, createdAt',
    })
  }
}

export const db = new NexoraDatabase()

export async function seedLocalData() {
  const count = await db.artifacts.count()
  if (count === 0) {
    await db.artifacts.bulkAdd([
      { id: 'quantum-core', name: 'Quantum Core', rarity: 'RARE', description: 'Inti energi dari reruntuhan stasiun tua.', discoveredAt: Date.now() },
      { id: 'nebula-shard', name: 'Nebula Shard', rarity: 'EPIC', description: 'Pecahan kristal yang menyimpan cahaya nebula.', discoveredAt: Date.now() },
      { id: 'origin-seal', name: 'Origin Seal', rarity: 'LEGENDARY', description: 'Artefak misterius dari dunia pertama.', discoveredAt: Date.now() },
    ])
  }
}

export async function exportBackup() {
  const payload = {
    app: 'NEXORA',
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: JSON.parse(localStorage.getItem('nexora-profile') || '{}'),
    settings: JSON.parse(localStorage.getItem('nexora-settings') || '{}'),
    progress: JSON.parse(localStorage.getItem('nexora-progress') || '{}'),
    artifacts: await db.artifacts.toArray(),
    journal: await db.journal.toArray(),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nexora-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file: File) {
  const parsed = JSON.parse(await file.text())
  if (parsed?.app !== 'NEXORA' || parsed?.version !== 1) {
    throw new Error('File backup bukan format NEXORA yang didukung.')
  }
  if (parsed.profile) localStorage.setItem('nexora-profile', JSON.stringify(parsed.profile))
  if (parsed.settings) localStorage.setItem('nexora-settings', JSON.stringify(parsed.settings))
  if (parsed.progress) localStorage.setItem('nexora-progress', JSON.stringify(parsed.progress))
  if (Array.isArray(parsed.artifacts)) {
    await db.transaction('rw', db.artifacts, async () => {
      await db.artifacts.clear()
      await db.artifacts.bulkPut(parsed.artifacts)
    })
  }
  if (Array.isArray(parsed.journal)) {
    await db.transaction('rw', db.journal, async () => {
      await db.journal.clear()
      await db.journal.bulkPut(parsed.journal)
    })
  }
}

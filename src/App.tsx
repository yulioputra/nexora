import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, ArrowUpRight, Atom, Award, Bell, ChevronRight, Compass, Database,
  Gamepad2, Globe2, Grid2X2, Home, Layers3, Moon, Package, Settings,
  ShieldCheck, Sparkles, Sun, Trophy, UserRound, WandSparkles, Zap,
} from 'lucide-react'
import Universe from './components/Universe'
import { db, exportBackup, importBackup, seedLocalData, type Artifact } from './lib/db'
import { useNexora, type Section } from './lib/store'

const navItems: { id: Section; label: string; icon: typeof Home }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'explore', label: 'Universe Explorer', icon: Compass },
  { id: 'missions', label: 'Missions', icon: Gamepad2 },
  { id: 'collection', label: 'Collection', icon: Package },
  { id: 'space', label: 'Personal Space', icon: Layers3 },
  { id: 'apps', label: 'Mini Apps', icon: Grid2X2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const missions = [
  { id: 'first-signal', title: 'First Contact', desc: 'Buka dashboard NEXORA untuk menerima sinyal pertamamu.', reward: 100, tag: 'BEGINNER' },
  { id: 'deep-scan', title: 'Deep Space Scan', desc: 'Jelajahi tampilan Universe Explorer dan amati planet.', reward: 150, tag: 'EXPLORATION' },
  { id: 'archive', title: 'Archive Keeper', desc: 'Periksa artefak yang tersimpan di koleksimu.', reward: 200, tag: 'DISCOVERY' },
]

function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.85 }}>
      <div className="intro-stars" />
      <motion.div className="intro-orb" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
        <div className="orb-core" />
      </motion.div>
      <motion.div className="intro-copy" initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55, duration: 0.8 }}>
        <div className="eyebrow"><span className="pulse-dot" /> SYSTEM ONLINE · LOCAL MODE</div>
        <h1>NEXORA<span>.</span></h1>
        <p>YOUR PERSONAL DIGITAL UNIVERSE</p>
        <button className="primary-button intro-button" onClick={onEnter}>Enter the universe <ArrowUpRight size={17} /></button>
        <small>NO ACCOUNT REQUIRED · YOUR DATA STAYS ON THIS DEVICE</small>
      </motion.div>
      <div className="intro-bottom">NEXORA OS <span>BUILD 01.00.01</span></div>
    </motion.div>
  )
}

function App() {
  const [intro, setIntro] = useState(!sessionStorage.getItem('nexora-entered'))
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [profileName, setProfileName] = useState(localStorage.getItem('nexora-name') || 'Explorer')
  const [novaOpen, setNovaOpen] = useState(false)
  const { section, setSection, theme, toggleTheme, xp, level, completedMissions, completeMission } = useNexora()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('nexora-name', profileName)
  }, [theme, profileName])

  useEffect(() => {
    seedLocalData().then(() => db.artifacts.toArray()).then(setArtifacts).catch(console.error)
  }, [])

  const nextLevel = useMemo(() => Math.max(0, Math.min(100, (xp % 500) / 5)), [xp])

  const title = navItems.find(item => item.id === section)?.label || 'Overview'

  const finishIntro = () => {
    sessionStorage.setItem('nexora-entered', '1')
    setIntro(false)
  }

  const handleImport = async (file?: File) => {
    if (!file) return
    try {
      await importBackup(file)
      const next = await db.artifacts.toArray()
      setArtifacts(next)
      alert('Backup NEXORA berhasil dipulihkan.')
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Backup gagal dibaca.')
    }
  }

  return (
    <div className="app-shell">
      <AnimatePresence>{intro && <Intro onEnter={finishIntro} />}</AnimatePresence>
      <aside className="sidebar">
        <button className="brand" onClick={() => setSection('overview')} aria-label="NEXORA home">
          <span className="brand-mark"><Atom size={21} /></span><span>NEXORA<small>DIGITAL UNIVERSE</small></span>
        </button>
        <div className="side-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon
            return <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
              <Icon size={17} /><span>{item.label}</span>{section === item.id && <ChevronRight size={15} className="nav-arrow" />}
            </button>
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-card"><ShieldCheck size={17} /><div><b>Local-first</b><span>Data stays on device</span></div><span className="online-dot" /></div>
          <div className="profile-mini"><div className="avatar"><UserRound size={18} /></div><div className="profile-meta"><b>{profileName}</b><span>Level {level} Explorer</span></div><button className="icon-button" onClick={() => setSection('settings')} aria-label="Profile settings"><Settings size={16} /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><b>{title}</b></div>
          <div className="top-actions">
            <div className="system-status"><span className="online-dot" /> LOCAL SYSTEM ACTIVE</div>
            <button className="icon-button" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="icon-button" aria-label="Notifications" onClick={() => setNovaOpen(!novaOpen)}><Bell size={18} /></button>
            <div className="top-avatar">{profileName.slice(0, 1).toUpperCase()}</div>
          </div>
        </header>

        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: 0.22 }}>
              {section === 'overview' && <section>
                <div className="welcome-row">
                  <div><div className="eyebrow">THURSDAY, YOUR UNIVERSE AWAITS</div><h2>Welcome back, {profileName}<span>.</span></h2><p className="muted">A new signal is waiting beyond the horizon.</p></div>
                  <div className="date-chip"><Activity size={15} /> EXPLORER SESSION</div>
                </div>
                <div className="hero-panel">
                  <div className="hero-copy"><div className="hero-kicker"><Sparkles size={14} /> YOUR NEXT DISCOVERY</div><h3>The universe<br />is yours to explore.</h3><p>Temukan dunia baru, kumpulkan artefak misterius, dan bangun jejak penjelajahanmu sendiri.</p><button className="primary-button" onClick={() => setSection('explore')}>Explore universe <ArrowUpRight size={16} /></button></div>
                  <Universe />
                  <div className="hero-coordinate">SECTOR 07 <span>·</span> NEXORA PRIME</div>
                </div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-icon purple"><Zap size={18} /></div><span>TOTAL EXPERIENCE</span><strong>{xp.toLocaleString('id-ID')} <small>XP</small></strong><div className="stat-foot">Level {level} explorer</div></div>
                  <div className="stat-card"><div className="stat-icon cyan"><Globe2 size={18} /></div><span>WORLDS DISCOVERED</span><strong>01 <small>/ 04</small></strong><div className="stat-foot">Your journey begins</div></div>
                  <div className="stat-card"><div className="stat-icon pink"><Award size={18} /></div><span>MISSIONS COMPLETED</span><strong>{completedMissions.length.toString().padStart(2, '0')} <small>/ 03</small></strong><div className="stat-foot">Keep moving forward</div></div>
                  <div className="stat-card"><div className="stat-icon gold"><Package size={18} /></div><span>ARTIFACTS COLLECTED</span><strong>{artifacts.length.toString().padStart(2, '0')}</strong><div className="stat-foot">Stored in local archive</div></div>
                </div>
                <div className="content-grid">
                  <div className="panel progress-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR PROGRESS</span><h3>Explorer status</h3></div><Trophy size={20} /></div><div className="level-row"><div className="level-badge">LVL<br /><b>{level}</b></div><div className="level-info"><b>Cosmic Explorer</b><span>{xp % 500} / 500 XP to level {level + 1}</span></div></div><div className="progress-track"><div style={{ width: `${nextLevel}%` }} /></div><p className="tiny-muted">Complete missions to earn XP and unlock new milestones.</p></div>
                  <div className="panel nova-panel"><div className="nova-orb-small"><Sparkles size={19} /></div><div><span className="eyebrow">NEXORA INTELLIGENCE</span><h3>Meet NOVA</h3><p>Your local guide to the universe. No cloud connection required.</p><button className="text-button" onClick={() => setNovaOpen(!novaOpen)}>Talk to NOVA <ChevronRight size={15} /></button></div></div>
                </div>
              </section>}

              {section === 'explore' && <section><div className="section-heading"><div><div className="eyebrow">DISCOVER THE UNKNOWN</div><h2>Universe Explorer<span>.</span></h2><p className="muted">Pilih tujuan berikutnya dan temukan rahasia di dalamnya.</p></div><span className="pill"><span className="online-dot" /> 4 WORLDS AVAILABLE</span></div><div className="world-grid">{[
                ['01','NEXORA PRIME','The origin sector','UNLOCKED','world-one'],
                ['02','MYSTIC NEBULA','A forgotten constellation','COMING SOON','world-two'],
                ['03','CYBER EDEN','The city beyond time','COMING SOON','world-three'],
                ['04','ABYSSAL-9','Secrets beneath the ice','COMING SOON','world-four'],
              ].map((world, i) => <div className={`world-card world-${i + 1}`} key={world[0]}><div className="world-number">SECTOR {world[0]}</div><div className="world-card-bottom"><span>{world[3]}</span><h3>{world[1]}</h3><p>{world[2]}</p><button className="round-arrow" disabled={i !== 0} onClick={() => setSection('missions')}><ArrowUpRight size={18} /></button></div></div>)}</div><div className="panel explorer-note"><Compass size={19} /><div><b>Exploration protocol</b><p>Versi awal membuka NEXORA PRIME sebagai area pengenalan. Sektor lain akan diaktifkan pada pembaruan berikutnya.</p></div></div></section>}

              {section === 'missions' && <section><div className="section-heading"><div><div className="eyebrow">CHALLENGES & DISCOVERIES</div><h2>Mission Control<span>.</span></h2><p className="muted">Selesaikan misi untuk mengumpulkan experience.</p></div><div className="pill"><Zap size={14} /> {completedMissions.length} COMPLETED</div></div><div className="mission-list">{missions.map((mission, i) => { const done = completedMissions.includes(mission.id); return <div className="mission-card" key={mission.id}><div className="mission-index">0{i + 1}</div><div className="mission-main"><span className="eyebrow">{mission.tag}</span><h3>{mission.title}</h3><p>{mission.desc}</p></div><div className="mission-reward"><b>+{mission.reward}</b><span>XP REWARD</span></div><button className={done ? 'complete-button done' : 'complete-button'} disabled={done} onClick={() => completeMission(mission.id, mission.reward)}>{done ? 'COMPLETED' : 'Claim mission'}</button></div> })}</div></section>}

              {section === 'collection' && <section><div className="section-heading"><div><div className="eyebrow">YOUR DISCOVERIES</div><h2>Artifact Archive<span>.</span></h2><p className="muted">Semua penemuan disimpan di database lokal browser.</p></div><div className="pill"><Package size={14} /> {artifacts.length} ITEMS</div></div><div className="artifact-grid">{artifacts.map((artifact, i) => <div className="artifact-card" key={artifact.id}><div className={`artifact-visual artifact-${i % 3}`}><Atom size={42} /></div><div className="artifact-info"><span className={`rarity ${artifact.rarity.toLowerCase()}`}>{artifact.rarity}</span><h3>{artifact.name}</h3><p>{artifact.description}</p></div></div>)}</div></section>}

              {section === 'space' && <section><div className="section-heading"><div><div className="eyebrow">MAKE IT YOURS</div><h2>Personal Space<span>.</span></h2><p className="muted">Ruang digital untuk menampilkan identitas dan pencapaianmu.</p></div></div><div className="personal-space"><div className="space-stars" /><div className="space-content"><div className="space-avatar"><UserRound size={34} /></div><h3>{profileName.toUpperCase()}'S SPACE</h3><p>Cosmic Explorer · Level {level}</p><div className="space-items"><span><Award size={15} /> {completedMissions.length} achievements</span><span><Package size={15} /> {artifacts.length} artifacts</span></div></div></div><div className="panel"><h3>Space customization</h3><p className="muted">Personalisasi dekorasi dan tema ruang akan hadir pada tahap pengembangan berikutnya.</p></div></section>}

              {section === 'apps' && <section><div className="section-heading"><div><div className="eyebrow">TOOLS FOR YOUR JOURNEY</div><h2>Mini Applications<span>.</span></h2><p className="muted">Peralatan digital kecil yang berjalan langsung di browser.</p></div></div><div className="miniapp-grid"><button className="miniapp-card" onClick={() => setNovaOpen(true)}><WandSparkles /><b>NOVA Guide</b><span>Panduan fitur NEXORA</span></button><button className="miniapp-card" onClick={() => setSection('missions')}><Gamepad2 /><b>Mission Tracker</b><span>Pantau progres misi</span></button><button className="miniapp-card" onClick={() => setSection('collection')}><Package /><b>Artifact Archive</b><span>Lihat koleksi artefak</span></button><button className="miniapp-card" onClick={() => setSection('settings')}><Database /><b>Data Manager</b><span>Backup dan restore data</span></button></div></section>}

              {section === 'settings' && <section><div className="section-heading"><div><div className="eyebrow">PERSONALIZE YOUR EXPERIENCE</div><h2>System Settings<span>.</span></h2><p className="muted">Atur identitas dan kelola data lokalmu.</p></div></div><div className="settings-layout"><div className="panel settings-panel"><h3>Profile identity</h3><label className="field-label" htmlFor="display-name">Display name</label><div className="input-row"><input id="display-name" value={profileName} maxLength={24} onChange={e => setProfileName(e.target.value)} /><span>{profileName.length}/24</span></div><p className="tiny-muted">Nama ini hanya disimpan di browser perangkat ini.</p><div className="setting-line"><div><b>Interface theme</b><span>Switch between dark and light appearance.</span></div><button className="secondary-button" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button></div></div><div className="panel settings-panel"><h3>Local data manager</h3><p className="muted">Buat backup agar progres bisa dipindahkan ke browser atau perangkat lain.</p><button className="secondary-button full-button" onClick={() => void exportBackup()}><Database size={16} /> Export backup (.json)</button><label className="secondary-button full-button upload-label"><ArrowUpRight size={16} /> Import backup (.json)<input type="file" accept="application/json,.json" onChange={e => void handleImport(e.target.files?.[0])} /></label><button className="danger-button" onClick={() => { if (confirm('Hapus seluruh progres NEXORA dari perangkat ini? Buat backup terlebih dahulu jika diperlukan.')) { localStorage.clear(); void db.delete().then(() => window.location.reload()) } }}>Reset all local data</button></div></div></section>}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer className="footer"><span>© 2026 NEXORA DIGITAL UNIVERSE</span><span><span className="online-dot" /> ALL SYSTEMS LOCAL</span></footer>
      </main>

      <AnimatePresence>{novaOpen && <motion.div className="nova-drawer" initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }}><div className="drawer-head"><div className="nova-orb-small"><Sparkles size={18} /></div><div><b>NOVA</b><span>LOCAL INTELLIGENCE</span></div><button className="icon-button" onClick={() => setNovaOpen(false)}>×</button></div><div className="nova-message"><span className="eyebrow">SYSTEM GUIDE</span><h3>Hello, Explorer.</h3><p>Aku NOVA, pemandu lokalmu. Aku bisa membantumu menemukan bagian-bagian NEXORA.</p><div className="nova-suggestions">{navItems.slice(1).map(item => <button key={item.id} onClick={() => { setSection(item.id); setNovaOpen(false) }}>{item.label}<ChevronRight size={14} /></button>)}</div><p className="tiny-muted">NOVA versi ini menggunakan panduan bawaan dan tidak mengirim data ke layanan AI online.</p></div></motion.div>}</AnimatePresence>
    </div>
  )
}

export default App

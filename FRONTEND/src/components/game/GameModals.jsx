import { formatScore } from '../../game/scores.js'

export function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-auto rounded-3xl border border-white/10 bg-[#0b172b] p-6 shadow-2xl shadow-black/50 sm:p-8`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-300">BlindMaze</p>
            <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="grid size-9 place-items-center rounded-full border border-white/10 text-xl text-slate-400 transition hover:border-white/30 hover:text-white">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function GameNoticeModal({ notice, onContinue }) {
  const isSuccess = notice.type === 'success'

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md" role="alertdialog" aria-modal="true" aria-labelledby="game-notice-title" aria-describedby="game-notice-message">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b172b] shadow-2xl shadow-black/60">
        <div className={`h-1.5 ${isSuccess ? 'bg-cyan-300' : 'bg-rose-300'}`} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className={`grid size-14 shrink-0 place-items-center rounded-2xl text-2xl font-black ${isSuccess ? 'bg-cyan-300/15 text-cyan-200' : 'bg-rose-300/15 text-rose-200'}`} aria-hidden="true">
              {isSuccess ? '✦' : '!'}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-[.24em] ${isSuccess ? 'text-cyan-300' : 'text-rose-300'}`}>{notice.eyebrow}</p>
              <h2 id="game-notice-title" className="mt-2 text-2xl font-black text-white">{notice.title}</h2>
            </div>
          </div>

          <p id="game-notice-message" className="mt-6 text-sm leading-6 text-slate-300">{notice.message}</p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-400">{notice.detail}</div>

          <button type="button" autoFocus onClick={onContinue} className={`mt-6 w-full rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-[.14em] text-slate-950 transition ${isSuccess ? 'bg-cyan-300 hover:bg-cyan-200' : 'bg-rose-300 hover:bg-rose-200'}`}>
            {notice.actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function InstructionsModal({ onClose }) {
  return (
    <Modal title="How to play" onClose={onClose}>
      <div className="space-y-4 text-sm leading-6 text-slate-300">
        <p>Setiap stage membuat maze 10×10 baru dengan titik mulai di sisi kiri dan finish di sisi kanan.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <InstructionItem icon="01" title="Memorize · 10 detik" text="Hafalkan tembok abu-abu dan rute menuju finish. Pemain belum bisa bergerak." />
          <InstructionItem icon="02" title="Move · 20 detik" text="Tembok menghilang. Gunakan Arrow keys, W A S D, atau tombol arah." />
          <InstructionItem icon="03" title="Hit wall / timeout" text="Kehilangan 1 HP dan stage diulang dengan maze baru." />
          <InstructionItem icon="04" title="Hint · 1× per stage" text="Tampilkan semua tembok selama satu detik saat Move Time." />
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-amber-100"><strong className="text-amber-200">Goal:</strong> capai ✦ sebelum HP habis. Setiap stage menambah score berdasarkan stage, waktu, dan HP tersisa.</div>
      </div>
    </Modal>
  )
}

function InstructionItem({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <span className="text-xs font-black text-cyan-300">{icon}</span>
      <h3 className="mt-2 font-bold text-white">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  )
}

export function LeaderboardModal({ scores, loading, onClose }) {
  return (
    <Modal title="Leaderboard" onClose={onClose} wide>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[2rem_1fr_4rem_6rem] gap-3 bg-white/[0.06] px-4 py-3 text-[10px] font-black uppercase tracking-[.15em] text-slate-500">
          <span>#</span><span>Player</span><span>Stage</span><span className="text-right">Score</span>
        </div>
        {loading ? <p className="p-6 text-center text-sm text-slate-500">Loading scores...</p> : scores.length === 0 ? <p className="p-6 text-center text-sm text-slate-500">Belum ada score. Jadilah yang pertama!</p> : scores.map((entry, index) => (
          <div key={`${entry.id || entry.username}-${entry.score}-${index}`} className="grid grid-cols-[2rem_1fr_4rem_6rem] items-center gap-3 border-t border-white/5 px-4 py-3 text-sm">
            <span className={`font-black ${index < 3 ? 'text-amber-300' : 'text-slate-600'}`}>{String(index + 1).padStart(2, '0')}</span>
            <span className="truncate font-bold text-slate-200">{entry.username}</span>
            <span className="text-slate-400">{entry.stage}</span>
            <span className="text-right font-black text-cyan-200">{formatScore(entry.score)}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export function GameOverModal({ username, stage, score, saving, saved, onSave, onMenu, onLeaderboard }) {
  return (
    <Modal title="Game over" onClose={onMenu}>
      <div className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-300/10 text-3xl text-rose-200">☠</div>
        <p className="mt-5 text-sm text-slate-400">Nice run, <span className="font-bold text-white">{username}</span>.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs uppercase tracking-[.18em] text-slate-500">Stage</p><p className="mt-1 text-2xl font-black text-white">{stage}</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs uppercase tracking-[.18em] text-slate-500">Score</p><p className="mt-1 text-2xl font-black text-cyan-200">{formatScore(score)}</p></div>
        </div>
        <div className="mt-6 space-y-2">
          <button type="button" onClick={onSave} disabled={saving || saved} className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black uppercase tracking-[.15em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">{saved ? 'Score saved ✓' : saving ? 'Saving...' : 'Save score'}</button>
          <button type="button" onClick={onLeaderboard} className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-amber-300/40 hover:text-amber-200">View leaderboard</button>
          <button type="button" onClick={onMenu} className="w-full px-4 py-2 text-xs font-bold text-slate-500 transition hover:text-white">Back to menu</button>
        </div>
      </div>
    </Modal>
  )
}


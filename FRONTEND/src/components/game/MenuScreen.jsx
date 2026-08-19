import { BrandMark, FeaturePill } from '../ui/Visuals.jsx'

export default function MenuScreen({ username, setUsername, onStart, onInstructions, onLeaderboard }) {
  return (
    <main className="menu-main relative flex min-h-screen items-start justify-center overflow-hidden px-4 py-4 sm:items-center sm:py-8">
      <div className="pointer-events-none absolute left-[-10rem] top-[-12rem] size-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-16rem] right-[-8rem] size-[32rem] rounded-full bg-violet-500/15 blur-3xl" />

      <div className="menu-shell relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-cyan-950/30 backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="menu-hero order-1 relative flex min-h-0 flex-col justify-between overflow-hidden p-5 sm:min-h-[34rem] sm:p-10 lg:order-1">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,.16),transparent_35%),linear-gradient(145deg,rgba(9,25,48,.95),rgba(6,12,27,.9))]" />

          <div className="relative">
            <div className="menu-hero-header mb-6 flex items-center gap-3 sm:mb-10">
              <BrandMark />
              <div>
                <p className="text-xs font-bold uppercase tracking-[.32em] text-cyan-300">BLINDMAZE ARCADE</p>
                <p className="mt-1 text-xs text-slate-400">Memory Maze · The Hidden Path</p>
              </div>
            </div>

            <p className="menu-eyebrow mb-2 text-sm font-semibold uppercase tracking-[.4em] text-amber-300 sm:mb-3">Enter the maze</p>
            <h1 className="max-w-xl text-5xl font-black leading-[.95] tracking-[-.06em] text-white sm:text-7xl">
              BLIND<span className="text-cyan-300">MAZE</span>
            </h1>
            <p className="menu-description mt-4 max-w-md text-base leading-7 text-slate-300 sm:mt-6">
              Hafalkan jalan, gerakkan pemain, dan temukan pintu keluar sebelum waktu habis.
            </p>
          </div>

          <div className="menu-features relative mt-6 grid grid-cols-3 gap-3 text-xs text-slate-300 sm:mt-10">
            <FeaturePill icon="10×10" label="Grid maze" />
            <FeaturePill icon="5 HP" label="Lives" />
            <FeaturePill icon="∞" label="Stages" />
          </div>
        </section>

        <section className="menu-form order-2 flex flex-col justify-center bg-slate-950/70 p-5 sm:p-10 lg:order-2">
          <div className="menu-form-brand mb-6 items-center gap-3">
            <BrandMark small />
            <div>
              <p className="text-sm font-black tracking-[.18em] text-white">BLINDMAZE ARCADE</p>
              <p className="text-xs text-slate-500">Find the hidden path</p>
            </div>
          </div>

          <div className="menu-form-lead mb-6 sm:mb-8">
            <p className="text-sm font-bold uppercase tracking-[.25em] text-slate-500">Welcome, player</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Ready to get lost?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Masukkan username untuk menyimpan perjalananmu di leaderboard.</p>
          </div>

          <form onSubmit={onStart} className="space-y-4">
            <label className="block text-sm font-semibold text-slate-200" htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Contoh: MazeRunner"
              maxLength={40}
              autoComplete="nickname"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 text-base text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-300/70 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
            />
            <button
              type="submit"
              disabled={!username.trim()}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black uppercase tracking-[.2em] text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Play Game <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={onInstructions} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200">How to play</button>
            <button type="button" onClick={onLeaderboard} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-amber-300/40 hover:text-amber-200">Leaderboard</button>
          </div>

          <p className="menu-form-note mt-8 text-center text-xs leading-5 text-slate-600">Mobile &amp; tablet friendly · Keyboard + touch controls</p>
        </section>
      </div>
    </main>
  )
}


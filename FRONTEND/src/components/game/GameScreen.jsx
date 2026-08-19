import { GAME_PHASES, GRID_SIZE, STARTING_LIVES } from '../../game/constants.js'
import { getCellKey } from '../../game/maze.js'
import { getPhaseLabel, formatScore } from '../../game/scores.js'
import { BrandMark, StatBadge } from '../ui/Visuals.jsx'
import { ControlButton, MobileActionBar } from './GameControls.jsx'

export default function GameScreen({
  username,
  stage,
  lives,
  score,
  maze,
  player,
  phase,
  timeLeft,
  hintUsed,
  hintVisible,
  onMove,
  onHint,
  onQuit,
  onInstructions,
}) {
  const showWalls = phase === GAME_PHASES.MEMORIZE || hintVisible
  const timerWarning = timeLeft <= 5

  return (
    <main className="game-main mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-36 pt-4 sm:px-6 sm:py-4 lg:px-8">
      <header className="game-header mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 shadow-xl shadow-slate-950/20 backdrop-blur sm:px-5 sm:py-3">
        <div className="flex items-center gap-3">
          <BrandMark small />
          <div>
            <p className="text-sm font-black tracking-[.18em] text-white">BLINDMAZE</p>
            <p className="text-xs text-slate-500">Player: <span className="text-slate-300">{username}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-center">
          <StatBadge label="STAGE" value={stage} />
          <StatBadge label="SCORE" value={formatScore(score)} />
          <div className={`min-w-20 rounded-xl border px-3 py-2 ${timerWarning ? 'border-rose-400/50 bg-rose-400/10 text-rose-200' : 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200'}`}>
            <p className="text-[10px] font-bold tracking-[.18em] opacity-70">TIME</p>
            <p className="text-xl font-black tabular-nums">{String(timeLeft).padStart(2, '0')}s</p>
          </div>
          <div className="hidden rounded-xl border border-rose-300/20 bg-rose-300/10 px-3 py-2 sm:block">
            <p className="text-[10px] font-bold tracking-[.18em] text-rose-200/70">HP</p>
            <p className="text-lg tracking-[.12em] text-rose-200" aria-label={`${lives} lives`}>
              {'♥'.repeat(lives)}<span className="text-slate-700">{'♥'.repeat(STARTING_LIVES - lives)}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-3 gap-2 sm:hidden">
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
          <p className="text-[10px] font-bold tracking-[.14em] text-slate-500">STAGE</p>
          <p className="mt-0.5 text-lg font-black text-white">{stage}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
          <p className="text-[10px] font-bold tracking-[.14em] text-slate-500">SCORE</p>
          <p className="mt-0.5 truncate text-lg font-black text-cyan-200">{formatScore(score)}</p>
        </div>
        <div className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-3 py-2.5">
          <p className="text-[10px] font-bold tracking-[.14em] text-rose-200/70">HP</p>
          <p className="mt-0.5 text-lg font-black text-rose-200">{lives}/{STARTING_LIVES}</p>
        </div>
      </div>

      <div className="game-phase mb-4 flex flex-col items-start gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-slate-500">Current phase</p>
          <p className={`mt-1 text-lg font-black ${phase === GAME_PHASES.MEMORIZE ? 'text-amber-300' : 'text-cyan-300'}`}>
            {getPhaseLabel(phase)}
          </p>
        </div>
        <p className="max-w-xs text-left text-xs leading-5 text-slate-400 sm:text-right sm:text-sm">
          {phase === GAME_PHASES.MEMORIZE
            ? 'Hafalkan posisi dinding dan rute keluar.'
            : hintVisible
              ? 'Hint aktif — dinding terlihat sebentar.'
              : 'Dinding menghilang. Gunakan tombol panah atau keyboard.'}
        </p>
      </div>

      <div className="game-content grid flex-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="game-board-panel flex min-h-0 items-center justify-center rounded-3xl border border-white/10 bg-[#0a172a] p-3 shadow-2xl shadow-cyan-950/20 sm:p-5">
          <div className="game-board maze-board w-full max-w-[min(70vh,680px)]" role="grid" aria-label="BlindMaze 10 by 10 gameboard">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
              const row = Math.floor(index / GRID_SIZE)
              const column = index % GRID_SIZE
              const key = getCellKey(row, column)
              const isWallVisible = showWalls && maze?.walls.includes(key)
              const isStart = maze?.start.row === row && maze?.start.column === column
              const isFinish = maze?.finish.row === row && maze?.finish.column === column
              const isPlayer = player?.row === row && player?.column === column

              return (
                <div
                  key={key}
                  role="gridcell"
                  aria-label={isPlayer ? 'Player' : isFinish ? 'Finish' : isWallVisible ? 'Wall' : 'Path'}
                  className={`maze-cell ${isWallVisible ? 'maze-wall' : 'maze-path'} ${isStart ? 'maze-start' : ''} ${isFinish ? 'maze-finish' : ''} ${isPlayer ? 'maze-player' : ''}`}
                >
                  {isPlayer ? '▲' : isFinish ? '✦' : isStart ? 'S' : ''}
                </div>
              )
            })}
          </div>
        </section>

        <aside className="game-sidebar space-y-4">
          <div className="game-lives hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:block">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-slate-500">Lives remaining</p>
              <span className="text-sm font-black text-rose-200">{lives}/{STARTING_LIVES}</span>
            </div>
            <div className="mt-3 flex gap-2" aria-hidden="true">
              {Array.from({ length: STARTING_LIVES }, (_, index) => (
                <span key={index} className={`h-2 flex-1 rounded-full ${index < lives ? 'bg-rose-300' : 'bg-slate-800'}`} />
              ))}
            </div>
          </div>

          <div className="hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:block">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-slate-500">Controls</p>
            <div className="mx-auto mt-4 grid max-w-[15rem] grid-cols-3 gap-2 sm:mx-0 sm:max-w-[12rem]">
              <div />
              <ControlButton label="Move up" icon="↑" onClick={() => onMove(-1, 0)} />
              <div />
              <ControlButton label="Move left" icon="←" onClick={() => onMove(0, -1)} />
              <ControlButton label="Move down" icon="↓" onClick={() => onMove(1, 0)} />
              <ControlButton label="Move right" icon="→" onClick={() => onMove(0, 1)} />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Keyboard: Arrow keys atau W A S D</p>
          </div>

          <button type="button" onClick={onHint} disabled={phase !== GAME_PHASES.MOVE || hintUsed} className="hidden w-full items-center justify-between rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-4 text-left transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40 sm:flex">
            <span>
              <span className="block text-sm font-black text-amber-200">Use Hint</span>
              <span className="block text-xs text-amber-100/50">{hintUsed ? 'Sudah digunakan di stage ini' : 'Reveal walls for 1 second'}</span>
            </span>
            <span className="rounded-full bg-amber-300/20 px-3 py-1 text-xs font-black text-amber-200">{hintUsed ? 'USED' : '1×'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={onInstructions} className="rounded-xl border border-white/10 px-3 py-3 text-xs font-bold text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200">Instructions</button>
            <button type="button" onClick={onQuit} className="rounded-xl border border-white/10 px-3 py-3 text-xs font-bold text-slate-400 transition hover:border-rose-300/30 hover:text-rose-200">Quit game</button>
          </div>
        </aside>
      </div>

      <MobileActionBar phase={phase} hintUsed={hintUsed} onMove={onMove} onHint={onHint} />
    </main>
  )
}


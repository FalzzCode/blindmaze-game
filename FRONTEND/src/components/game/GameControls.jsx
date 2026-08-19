export function ControlButton({ label, icon, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid aspect-square touch-manipulation select-none place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-xl font-black text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 active:scale-95"
    >
      {icon}
    </button>
  )
}

export function MobileActionBar({ phase, hintUsed, onMove, onHint }) {
  const movementDisabled = phase !== 'move'

  return (
    <div className="fixed inset-x-3 bottom-3 z-30 sm:hidden">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0b172b]/95 p-2.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="grid w-[7.25rem] shrink-0 grid-cols-3 gap-1.5">
          <span />
          <MobileMoveButton label="Move up" icon="↑" disabled={movementDisabled} onClick={() => onMove(-1, 0)} />
          <span />
          <MobileMoveButton label="Move left" icon="←" disabled={movementDisabled} onClick={() => onMove(0, -1)} />
          <MobileMoveButton label="Move down" icon="↓" disabled={movementDisabled} onClick={() => onMove(1, 0)} />
          <MobileMoveButton label="Move right" icon="→" disabled={movementDisabled} onClick={() => onMove(0, 1)} />
        </div>
        <button
          type="button"
          onClick={onHint}
          disabled={movementDisabled || hintUsed}
          className="flex min-w-0 flex-1 items-center justify-between rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-3 text-left transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-black uppercase tracking-[.12em] text-amber-200">Use Hint</span>
            <span className="mt-0.5 block truncate text-[10px] text-amber-100/55">
              {hintUsed ? 'Sudah digunakan' : movementDisabled ? 'Aktif saat Move' : 'Reveal 1 detik'}
            </span>
          </span>
          <span className="ml-2 shrink-0 rounded-full bg-amber-300/20 px-2 py-1 text-[10px] font-black text-amber-200">
            {hintUsed ? 'USED' : '1×'}
          </span>
        </button>
      </div>
    </div>
  )
}

function MobileMoveButton({ label, icon, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid aspect-square touch-manipulation select-none place-items-center rounded-lg border border-white/10 bg-white/[0.07] text-lg font-black text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {icon}
    </button>
  )
}


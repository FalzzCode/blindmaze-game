export function BrandMark({ small = false }) {
  return (
    <div className={`${small ? 'size-9 rounded-xl' : 'size-12 rounded-2xl'} grid grid-cols-3 gap-0.5 border border-cyan-200/20 bg-cyan-300/10 p-1`} aria-hidden="true">
      <span className="rounded-sm bg-cyan-300" /><span /><span className="rounded-sm bg-amber-300" />
      <span className="rounded-sm bg-violet-300" /><span className="rounded-sm bg-cyan-200" /><span />
      <span /><span className="rounded-sm bg-amber-200" /><span className="rounded-sm bg-cyan-300" />
    </div>
  )
}

export function FeaturePill({ icon, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="font-black text-cyan-200">{icon}</p>
      <p className="mt-1 text-slate-500">{label}</p>
    </div>
  )
}

export function StatBadge({ label, value }) {
  return (
    <div className="hidden min-w-16 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:block">
      <p className="text-[10px] font-bold tracking-[.18em] text-slate-500">{label}</p>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  )
}


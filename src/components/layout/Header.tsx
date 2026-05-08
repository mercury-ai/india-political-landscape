import { getMaxLastUpdated } from '@/lib/dataLoader'

const lastUpdated = getMaxLastUpdated()

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-[54px] bg-neutral-950 border-b border-neutral-800 flex items-center px-4 gap-3">
      <h1 className="text-base font-bold text-white tracking-tight">
        India Political Landscape
      </h1>
      {lastUpdated && (
        <span className="ml-auto text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
          Updated {lastUpdated}
        </span>
      )}
    </header>
  )
}

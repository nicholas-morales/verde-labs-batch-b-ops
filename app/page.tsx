import Link from "next/link";
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald">Verde Labs · Batch B HITL</p>
      <h1 className="mt-4 font-serif text-4xl text-cream">Empower the worker. Approve before send.</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link className="border border-line bg-card p-5 text-cream" href="/labs/studio-ops/continuity-look-sync">Continuity Look Sync</Link>
        <Link className="border border-line bg-card p-5 text-cream" href="/labs/studio-ops/standup-digest">Daily Standup Digest</Link>
        <Link className="border border-line bg-card p-5 text-cream" href="/labs/media-logistics/deliverable-board">Deliverable Status Board</Link>
      </div>
    </div>
  );
}

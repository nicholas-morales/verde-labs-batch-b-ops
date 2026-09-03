"use client";

import { useEffect, useMemo, useState } from "react";
import { AuditLog } from "@/components/audit-log";
import { EmpowermentBanner } from "@/components/empowerment-banner";
import { GateStamp } from "@/components/gate-stamp";
import { loadAudit, recordContinuityNote, recordGateEvent } from "@/lib/actions";
import {
  flagMismatches,
  loadLookBible,
  loadSceneStills,
  loadWardrobeNotes,
} from "@/lib/continuity";
import { sortTrail } from "@/lib/trail";
import type { AuditEvent, ContinuityFlag, GateDecision } from "@/lib/types";

export function ContinuityDemo() {
  const bible = useMemo(() => loadLookBible(), []);
  const stills = useMemo(() => loadSceneStills(), []);
  const notes = useMemo(() => loadWardrobeNotes(), []);
  const flags = useMemo(() => flagMismatches(stills, notes, bible), [stills, notes, bible]);
  const [selectedId, setSelectedId] = useState(
    flags.find((row) => row.mismatch)?.id ?? flags[0]?.id ?? "",
  );
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [decision, setDecision] = useState<GateDecision>("pending");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [flash, setFlash] = useState(
    "Accept writes continuity_log only. Look bible stays locked. sent stays false.",
  );
  const [busy, setBusy] = useState(false);

  const selected = flags.find((row) => row.id === selectedId) ?? flags[0];

  useEffect(() => {
    void loadAudit("continuity-look-sync").then((rows) => setEvents(sortTrail(rows)));
  }, []);

  async function acceptNote(flag: ContinuityFlag) {
    setBusy(true);
    try {
      const event = await recordContinuityNote({
        demo: "continuity-look-sync",
        summary: `${flag.id} accepted to continuity_log. Look bible unchanged. wroteLookBible: false.`,
        detail: {
          flagId: flag.id,
          stillId: flag.stillId,
          noteId: flag.noteId,
          lookId: flag.lookId,
          wroteLookBible: false,
          bibleLocked: true,
          sent: false,
        },
      });
      setAccepted((current) => ({ ...current, [flag.id]: true }));
      setDecision("approved");
      setEvents((current) =>
        sortTrail([...current.filter((row) => row.id !== event.id), event]),
      );
      setFlash(
        `${flag.id} logged. Script supervisor note is on the trail. The look bible was not rewritten.`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function rejectFlag(flag: ContinuityFlag) {
    setBusy(true);
    try {
      const event = await recordGateEvent({
        demo: "continuity-look-sync",
        decision: "rejected",
        summary: `${flag.id} rejected. continuity_log not updated. Look bible unchanged.`,
        detail: {
          flagId: flag.id,
          wroteLookBible: false,
          before: "flagged",
          after: "rejected",
          gateState: "rejected",
        },
      });
      setDecision("rejected");
      setEvents((current) =>
        sortTrail([...current.filter((row) => row.id !== event.id), event]),
      );
      setFlash(`${flag.id} rejected. Nothing wrote the bible. sent: false.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="border border-amber/50 bg-card px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-amber">
        DEMO pack · Harbor Night Day 13 · CL-01…07 · look bible locked
      </div>
      <EmpowermentBanner>
        Script supervisors decide what is actually off. Scene stills are stubs. Accepting a note
        appends <code>continuity_log</code> only — the look bible does not auto-change.
      </EmpowermentBanner>

      <section className="border border-line bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
              fixtures/continuity-look-sync/look-bible.json
            </p>
            <h2 className="mt-1 font-serif text-2xl text-cream">Look bible · locked</h2>
            <p className="mt-1 text-sm text-muted">{bible.locked_note}</p>
          </div>
          <GateStamp
            decision={decision}
            extra="wroteLookBible: false · bible does not auto-change"
          />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {bible.looks.map((look) => (
            <article key={look.id} className="border border-line bg-raised p-4">
              <p className="font-mono text-[11px] text-amber">{look.id}</p>
              <h3 className="mt-1 font-serif text-xl text-cream">{look.character}</h3>
              <p className="mt-2 text-sm text-muted">{look.wardrobe}</p>
              <p className="mt-1 text-sm text-muted">{look.hair}</p>
              <p className="mt-2 text-xs text-faint">{look.notes}</p>
            </article>
          ))}
        </div>
        <button className="btn mt-4" type="button" disabled>
          Push accepted notes to look bible (disabled)
        </button>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border border-line bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            fixtures/continuity-look-sync/scene-stills.json
          </p>
          <h2 className="mt-1 font-serif text-2xl text-cream">Scene still stubs</h2>
          <ul className="mt-4 space-y-3">
            {stills.map((still) => (
              <li key={still.id} className="border border-line bg-raised p-3">
                <p className="font-mono text-[11px] text-amber">
                  {still.id} · sc {still.scene}
                  {still.setup}
                </p>
                <p className="mt-1 text-sm text-cream">{still.label}</p>
                <div className="mt-3 flex h-20 items-center justify-center border border-dashed border-line bg-[#0d110c] font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  still stub · no photo
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">{still.stub}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="border border-line bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            fixtures/continuity-look-sync/wardrobe-notes.json
          </p>
          <h2 className="mt-1 font-serif text-2xl text-cream">Wardrobe / hair / props notes</h2>
          <ul className="mt-4 space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="border border-line bg-raised p-3">
                <p className="font-mono text-[11px] text-amber">
                  {note.id} · {note.dept} · sc {note.scene}
                </p>
                <p className="mt-1 text-sm text-cream">{note.body}</p>
                <p className="mt-1 text-xs text-faint">{note.author}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border border-line bg-card p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
          Heuristic flags
        </p>
        <h2 className="mt-1 font-serif text-2xl text-cream">CL-01…07 mismatch board</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="pb-2 pr-3">ID</th>
                <th className="pb-2 pr-3">Field</th>
                <th className="pb-2 pr-3">Still stub</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((row) => (
                <tr
                  key={row.id}
                  className={`cursor-pointer border-t border-line ${
                    row.id === selected?.id ? "bg-emerald/10" : row.mismatch ? "bg-rose/10" : "bg-emerald/5"
                  }`}
                  onClick={() => setSelectedId(row.id)}
                >
                  <td className="py-2 pr-3 font-mono text-[11px] text-amber">
                    {row.id}
                    <span className="ml-2 text-faint">{row.severity}</span>
                  </td>
                  <td className="py-2 pr-3 text-cream">{row.field}</td>
                  <td className="py-2 pr-3 text-muted">{row.still}</td>
                  <td className="py-2 font-mono text-[11px] uppercase text-amber">
                    {accepted[row.id] ? "logged" : row.mismatch ? "mismatch" : "match"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected ? (
          <div className="mt-6 border border-line bg-raised p-4">
            <p className="font-mono text-[11px] text-amber">{selected.id}</p>
            <p className="mt-1 text-sm text-cream">
              {selected.field} · {selected.stillId} vs {selected.noteId} / {selected.lookId}
            </p>
            <p className="mt-2 text-xs text-muted">{selected.expected}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="btn btn-emerald"
                disabled={busy || !selected.mismatch || accepted[selected.id]}
                onClick={() => void acceptNote(selected)}
              >
                Accept note to continuity_log
              </button>
              <button
                className="btn btn-rose"
                disabled={busy}
                onClick={() => void rejectFlag(selected)}
              >
                Reject flag
              </button>
            </div>
          </div>
        ) : null}
        <p className="mt-3 text-sm text-muted" role="status">
          {flash}
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-cream">Audit / event trail</h2>
        <p className="mt-1 mb-4 text-sm text-faint">
          Append-only · synthetic · <code>data/continuity-look-sync.jsonl</code> · wroteLookBible
          stays false
        </p>
        <AuditLog events={events} />
      </section>
    </div>
  );
}

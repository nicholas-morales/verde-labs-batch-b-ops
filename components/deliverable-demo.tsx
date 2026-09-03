"use client";

import { useEffect, useMemo, useState } from "react";
import { AuditLog } from "@/components/audit-log";
import { EmpowermentBanner } from "@/components/empowerment-banner";
import { GateStamp } from "@/components/gate-stamp";
import { loadAudit, recordStatusAttest } from "@/lib/actions";
import { BOARD_COLUMNS, cardsInColumn, loadDeliverableBoard, staleFlags } from "@/lib/deliverable";
import { sortTrail } from "@/lib/trail";
import type { AuditEvent, DeliverableCard, GateDecision } from "@/lib/types";

export function DeliverableDemo() {
  const board = useMemo(() => loadDeliverableBoard(), []);
  const stale = useMemo(() => staleFlags(board), [board]);
  const [selectedId, setSelectedId] = useState(stale[0]?.id ?? board.cards[0]?.id ?? "");
  const [attested, setAttested] = useState<Record<string, string>>({});
  const [decision, setDecision] = useState<GateDecision>("pending");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [flash, setFlash] = useState(
    "Human status attest only. Columns do not auto-move. No distributor email.",
  );
  const [busy, setBusy] = useState(false);

  const selected = board.cards.find((card) => card.id === selectedId) ?? board.cards[0];

  useEffect(() => {
    void loadAudit("deliverable-board").then((rows) => setEvents(sortTrail(rows)));
  }, []);

  async function attest(card: DeliverableCard, nextStatus: DeliverableCard["status"]) {
    setBusy(true);
    try {
      const event = await recordStatusAttest({
        demo: "deliverable-board",
        summary: `${card.id} attested as ${nextStatus}. Column stays ${card.column}. emailedDistributor: false.`,
        detail: {
          cardId: card.id,
          column: card.column,
          previousStatus: card.status,
          attestedStatus: nextStatus,
          autoMoved: false,
          emailedDistributor: false,
          sent: false,
        },
      });
      setAttested((current) => ({ ...current, [card.id]: nextStatus }));
      setDecision("approved");
      setEvents((current) =>
        sortTrail([...current.filter((row) => row.id !== event.id), event]),
      );
      setFlash(
        `${card.id} attested as ${nextStatus}. Kanban column unchanged. The mock did not email the lab.`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="border border-amber/50 bg-card px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-amber">
        DEMO pack · {board.cut} · DS-01…08 · no distributor mail
      </div>
      <EmpowermentBanner>
        Post supervisors attest status. AI only raises stale flags. The board does not auto-move
        columns and never emails a lab or distributor.
      </EmpowermentBanner>

      <section className="border border-line bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
              fixtures/deliverable-board/board.json
            </p>
            <h2 className="mt-1 font-serif text-2xl text-cream">
              {board.production} · {board.cut}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {stale.length} stale flags. Attest writes the trail. sent stays false.
            </p>
          </div>
          <GateStamp decision={decision} extra="autoMoved: false · emailedDistributor: false" />
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-4">
        {BOARD_COLUMNS.map((column) => (
          <article key={column.id} className="border border-line bg-card p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
              {column.label}
            </p>
            <ul className="mt-3 space-y-3">
              {cardsInColumn(column.id, board).map((card) => {
                const status = attested[card.id] ?? card.status;
                return (
                  <li key={card.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(card.id)}
                      className={`w-full border p-3 text-left ${
                        card.id === selected?.id ? "border-emerald bg-emerald/10" : "border-line bg-raised"
                      }`}
                    >
                      <p className="font-mono text-[11px] text-amber">
                        {card.id}
                        {card.stale ? <span className="ml-2 text-rose">stale</span> : null}
                      </p>
                      <p className="mt-1 text-sm text-cream">{card.title}</p>
                      <p className="mt-1 text-xs text-faint">{card.owner}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {status}
                        {card.flag ? ` · ${card.flag}` : ""}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </section>

      {selected ? (
        <section className="border border-line bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
            Human attest
          </p>
          <h2 className="mt-1 font-serif text-2xl text-cream">
            {selected.id} · {selected.title}
          </h2>
          <p className="mt-2 text-sm text-muted">{selected.note}</p>
          <p className="mt-2 text-xs text-faint">
            Last touch {selected.lastTouch} · column {selected.column} stays put
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {(["ready", "in-progress", "waiting", "blocked"] as const).map((status) => (
              <button
                key={status}
                className={`btn ${status === "ready" ? "btn-emerald" : ""}`}
                disabled={busy}
                onClick={() => void attest(selected, status)}
              >
                Attest {status}
              </button>
            ))}
            <button className="btn" type="button" disabled>
              Move column (disabled)
            </button>
            <button className="btn btn-ghost" type="button" disabled>
              Email lab (disabled)
            </button>
          </div>
          <p className="mt-3 text-sm text-muted" role="status">
            {flash}
          </p>
        </section>
      ) : null}

      <section>
        <h2 className="font-serif text-2xl text-cream">Audit / event trail</h2>
        <p className="mt-1 mb-4 text-sm text-faint">
          Append-only · synthetic · <code>data/deliverable-board.jsonl</code> · emailedDistributor
          stays false
        </p>
        <AuditLog events={events} />
      </section>
    </div>
  );
}

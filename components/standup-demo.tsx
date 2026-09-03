"use client";

import { useEffect, useMemo, useState } from "react";
import { AuditLog } from "@/components/audit-log";
import { EmpowermentBanner } from "@/components/empowerment-banner";
import { GateStamp } from "@/components/gate-stamp";
import { HeldDigestPreview } from "@/components/held-digest-preview";
import { loadAudit, recordGateEvent } from "@/lib/actions";
import { draftDigest, loadStandupPack } from "@/lib/standup";
import { sortTrail } from "@/lib/trail";
import type { AuditEvent, GateDecision } from "@/lib/types";

export function StandupDemo() {
  const pack = useMemo(() => loadStandupPack(), []);
  const drafted = useMemo(() => draftDigest(pack), [pack]);
  const [decision, setDecision] = useState<GateDecision>("pending");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [flash, setFlash] = useState("Send stays disabled until a human approves. No live Slack.");
  const [busy, setBusy] = useState(false);
  const [sendHeld, setSendHeld] = useState(false);

  useEffect(() => {
    void loadAudit("standup-digest").then((rows) => setEvents(sortTrail(rows)));
  }, []);

  async function decide(next: Exclude<GateDecision, "pending">) {
    setBusy(true);
    try {
      const event = await recordGateEvent({
        demo: "standup-digest",
        decision: next,
        summary:
          next === "approved"
            ? "Day 13 standup digest approved. Slack/email preview unlocked. No live send."
            : "Day 13 standup digest rejected. Departments are not notified.",
        detail: {
          ids: drafted.bullets.map((row) => row.id),
          location: pack.location,
          before: decision,
          after: next,
          gateState: next,
        },
      });
      setDecision(next);
      setSendHeld(false);
      setEvents((current) =>
        sortTrail([...current.filter((row) => row.id !== event.id), event]),
      );
      setFlash(
        next === "approved"
          ? "Approved. Rendered fake Slack/email preview body is below. Send preview stays a no-op."
          : "Rejected. Send remains locked. Preview body stays hidden. Nothing left the box.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function attemptSend(channel: "slack-preview" | "standup-email-preview") {
    if (decision !== "approved") {
      setFlash("Send is disabled until Approve. The AD keeps the standup.");
      return;
    }
    const event = await recordGateEvent({
      demo: "standup-digest",
      decision: "approved",
      summary:
        channel === "slack-preview"
          ? "Slack preview clicked. Held — no live Slack. sent remains false."
          : "Email preview clicked. Held — no SMTP. sent remains false.",
      detail: {
        channel,
        delivered: false,
        sent: false,
        before: "approved",
        after: "approved",
        gateState: "approved",
      },
    });
    setSendHeld(true);
    setEvents((current) =>
      sortTrail([...current.filter((row) => row.id !== event.id), event]),
    );
    setFlash("Preview only. No live Slack or SMTP. The mock logged the attempt as held — sent remains false.");
  }

  return (
    <div className="space-y-8">
      <div className="border border-amber/50 bg-card px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-amber">
        DEMO pack · Harbor Night Day 13 standup · SD-01…06 · no live Slack
      </div>
      <EmpowermentBanner>
        The AD keeps the standup. Multi-dept stubs draft a digest. Nobody gets Slack or email
        until a human stamps Approve — and even then the adapters stay off.
      </EmpowermentBanner>

      <section className="border border-line bg-card p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          fixtures/standup-digest/departments.json
        </p>
        <h2 className="mt-1 font-serif text-2xl text-cream">Department stubs</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {pack.departments.map((dept) => (
            <article key={dept.id} className="border border-line bg-raised p-4">
              <p className="font-mono text-[11px] text-amber">{dept.id}</p>
              <h3 className="mt-1 font-serif text-xl text-cream">{dept.dept}</h3>
              <p className="mt-1 text-xs text-faint">{dept.author}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {dept.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-line bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
              Heuristic draft
            </p>
            <h2 className="mt-1 font-serif text-2xl text-cream">{drafted.headline}</h2>
            <p className="mt-1 text-sm text-muted">
              {pack.location} · {pack.date} · planted SD-01…06
            </p>
          </div>
          <GateStamp decision={decision} extra="No live Slack. Send disabled until Approve." />
        </div>
        <ul className="mt-6 space-y-2">
          {drafted.bullets.map((row) => (
            <li key={row.id} className="border border-line bg-raised px-3 py-2 text-sm">
              <span className="font-mono text-[11px] text-amber">{row.id}</span>
              <span className="ml-2 text-faint">{row.dept}</span>
              <p className="mt-1 text-cream">{row.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn btn-emerald" disabled={busy} onClick={() => void decide("approved")}>
            Approve
          </button>
          <button className="btn btn-rose" disabled={busy} onClick={() => void decide("rejected")}>
            Reject
          </button>
          <button
            className="btn"
            disabled={decision !== "approved"}
            onClick={() => void attemptSend("slack-preview")}
          >
            Slack preview (off)
          </button>
          <button
            className="btn btn-ghost"
            disabled={decision !== "approved"}
            onClick={() => void attemptSend("standup-email-preview")}
          >
            Email preview (off)
          </button>
        </div>
        <p className="mt-3 text-sm text-muted" role="status">
          {flash}
        </p>
      </section>

      <HeldDigestPreview
        unlocked={decision === "approved"}
        preview={drafted.preview}
        sendHeld={sendHeld}
      />

      <section>
        <h2 className="font-serif text-2xl text-cream">Audit / event trail</h2>
        <p className="mt-1 mb-4 text-sm text-faint">
          Append-only · synthetic · <code>data/standup-digest.jsonl</code> · sent stays false
        </p>
        <AuditLog events={events} />
      </section>
    </div>
  );
}

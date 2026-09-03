import type { DigestPreview } from "@/lib/types";

export function HeldDigestPreview({
  unlocked,
  preview,
  sendHeld = false,
}: {
  unlocked: boolean;
  preview: DigestPreview;
  sendHeld?: boolean;
}) {
  if (!unlocked) {
    return (
      <section
        className="border border-dashed border-line bg-raised px-4 py-6"
        data-testid="held-digest-locked"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          Fake Slack / email preview body
        </p>
        <p className="mt-2 text-sm text-muted">
          Approve to render the fake Slack and email preview body. Send stays locked until then.
          No live Slack. No SMTP.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4" data-testid="held-digest-unlocked">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
            After Approve · rendered preview body
          </p>
          <h3 className="mt-1 font-serif text-2xl text-cream">Fake Slack / email</h3>
        </div>
        <p className="font-mono text-[11px] text-ok">
          sent: false · {sendHeld ? "Send preview held — no Slack" : "Slack off"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="border border-line bg-raised p-4" data-testid="slack-preview-body">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            Slack preview · {preview.slackChannel}
          </p>
          <div className="mt-4 border border-line bg-[#0c100b] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              held · not posted
            </p>
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-cream">
              {preview.slackBody}
            </pre>
            <p className="mt-3 font-mono text-[10px] text-ok">sent: false</p>
          </div>
        </article>

        <article className="border border-line bg-raised p-4" data-testid="standup-email-preview-body">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            Email preview · held
          </p>
          <div className="mt-4 border border-line bg-card">
            <dl className="divide-y divide-line text-sm">
              <div className="grid grid-cols-[5.5rem_1fr] gap-2 px-3 py-2">
                <dt className="font-mono text-[11px] text-faint">From</dt>
                <dd className="text-cream">{preview.emailFrom}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-2 px-3 py-2">
                <dt className="font-mono text-[11px] text-faint">To</dt>
                <dd className="text-cream">{preview.emailTo}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-2 px-3 py-2">
                <dt className="font-mono text-[11px] text-faint">Subject</dt>
                <dd className="text-cream">{preview.emailSubject}</dd>
              </div>
            </dl>
            <pre
              className="whitespace-pre-wrap border-t border-line bg-[#0d110c] px-3 py-3 text-xs leading-5 text-cream"
              data-testid="standup-email-preview-copy"
            >
              {preview.emailBody}
            </pre>
            <p className="border-t border-line px-3 py-2 font-mono text-[11px] text-ok">
              sent: false · no live SMTP
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

import { PageShell } from "@/components/page-shell";
import { StandupDemo } from "@/components/standup-demo";

export const metadata = {
  title: "Daily Standup Digest",
};

export default function StandupDigestPage() {
  return (
    <PageShell
      kicker="Studio Ops · Batch B"
      title="Daily Standup Digest"
      deck="Multi-dept stubs draft a Day 13 standup. Planted SD-01…06. Approve unlocks a rendered fake Slack and email preview body. Send stays off — no live Slack, no SMTP."
    >
      <StandupDemo />
    </PageShell>
  );
}

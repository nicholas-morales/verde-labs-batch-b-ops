import { ContinuityDemo } from "@/components/continuity-demo";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "Continuity Look Sync",
};

export default function ContinuityLookSyncPage() {
  return (
    <PageShell
      kicker="Studio Ops · Batch B"
      title="Continuity Look Sync"
      deck="Harbor Night Day 13 scene still stubs vs wardrobe notes. Planted flags CL-01…07. Accept writes a synthetic continuity_log row. The look bible stays locked — the copilot never auto-changes it."
    >
      <ContinuityDemo />
    </PageShell>
  );
}

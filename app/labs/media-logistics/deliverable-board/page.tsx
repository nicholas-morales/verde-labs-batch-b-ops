import { DeliverableDemo } from "@/components/deliverable-demo";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "Deliverable Status Board",
};

export default function DeliverableBoardPage() {
  return (
    <PageShell
      kicker="Media Logistics · Batch B"
      title="Deliverable Status Board"
      deck="Kanban for picture lock, M&E, legal, and deliverables. Planted stale flags DS-01…08. Human status attest only — columns do not auto-move and the mock never emails a distributor."
    >
      <DeliverableDemo />
    </PageShell>
  );
}

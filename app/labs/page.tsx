import { LabCard } from "@/components/lab-card";
import { PageShell } from "@/components/page-shell";
import { LABS } from "@/lib/catalog";
export default function LabsPage() {
  return (
    <PageShell kicker="Index" title="All labs" deck="Batch B HITL demos. Synthetic only.">
      <div className="grid gap-4 md:grid-cols-2">
        {LABS.filter((lab) => lab.status === "batch-b").map((lab) => (
          <LabCard key={lab.slug} lab={lab} />
        ))}
      </div>
    </PageShell>
  );
}

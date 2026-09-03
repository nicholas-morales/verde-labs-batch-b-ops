import departmentsPack from "@/fixtures/standup-digest/departments.json";
import type { DigestPreview, StandupPack } from "@/lib/types";

export function loadStandupPack(): StandupPack {
  return departmentsPack as StandupPack;
}

export function plantedStandupIds(): string[] {
  return ["SD-01", "SD-02", "SD-03", "SD-04", "SD-05", "SD-06"];
}

export function draftDigest(pack: StandupPack = loadStandupPack()): {
  headline: string;
  bullets: { id: string; dept: string; text: string }[];
  preview: DigestPreview;
} {
  const bullets = pack.departments.flatMap((dept) =>
    dept.items
      .filter((item) => /SD-\d{2}/.test(item))
      .map((item) => ({
        id: item.match(/SD-\d{2}/)?.[0] ?? dept.id,
        dept: dept.dept,
        text: item,
      })),
  );

  const slackBody = [
    `*${pack.production} ${pack.day_label}*`,
    `_${pack.location} · ${pack.date}_`,
    "",
    ...pack.departments.map((dept) => `• *${dept.dept}* — ${dept.items[0]}`),
    "",
    `_Held draft. SD-01…SD-06. No live Slack._`,
  ].join("\n");

  const emailBody = [
    "Desk,",
    "",
    `Draft standup for ${pack.production} ${pack.day_label} at ${pack.location}.`,
    "",
    ...pack.departments.flatMap((dept) => [`${dept.dept} (${dept.author})`, ...dept.items.map((item) => `  - ${item}`), ""]),
    "This preview is held. Slack and SMTP stay off until a human stamps Approve — and even then the mock does not send.",
    "",
    "— Harbor Night AD desk (demo)",
  ].join("\n");

  return {
    headline: `${pack.production} ${pack.day_label}`,
    bullets,
    preview: {
      slackChannel: pack.channel,
      slackBody,
      emailFrom: "ad-desk@harbor-night.example",
      emailTo: pack.emailTo,
      emailSubject: `${pack.production} ${pack.day_label} — held digest`,
      emailBody,
      held: true,
      sent: false,
    },
  };
}

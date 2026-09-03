import lookBiblePack from "@/fixtures/continuity-look-sync/look-bible.json";
import sceneStillsPack from "@/fixtures/continuity-look-sync/scene-stills.json";
import wardrobeNotesPack from "@/fixtures/continuity-look-sync/wardrobe-notes.json";
import type { ContinuityFlag, LookBible, SceneStill, WardrobeNote } from "@/lib/types";

const PLANTED: Array<Omit<ContinuityFlag, "still" | "expected"> & { stillHint: string; expectedHint: string }> = [
  {
    id: "CL-01",
    stillId: "ST-61A",
    noteId: "WN-01",
    lookId: "LB-ADA",
    field: "Coat color",
    stillHint: "Navy wool coat",
    expectedHint: "Charcoal wool coat",
    severity: "HIGH",
    mismatch: true,
  },
  {
    id: "CL-02",
    stillId: "ST-61A",
    noteId: "WN-02",
    lookId: "LB-ADA",
    field: "Cufflinks",
    stillHint: "gold cufflinks",
    expectedHint: "silver cufflinks",
    severity: "HIGH",
    mismatch: true,
  },
  {
    id: "CL-03",
    stillId: "ST-61A",
    noteId: "WN-03",
    lookId: "LB-ADA",
    field: "Hair length",
    stillHint: "hair past collarbone",
    expectedHint: "Shoulder-length blunt, dry",
    severity: "MED",
    mismatch: true,
  },
  {
    id: "CL-04",
    stillId: "ST-61A",
    noteId: "WN-04",
    lookId: "LB-ADA",
    field: "Watch wrist",
    stillHint: "watch on LEFT wrist",
    expectedHint: "silver watch on right wrist",
    severity: "MED",
    mismatch: true,
  },
  {
    id: "CL-05",
    stillId: "ST-61B",
    noteId: "WN-05",
    lookId: "LB-ADA",
    field: "Scarf",
    stillHint: "no scarf",
    expectedHint: "navy silk scarf",
    severity: "HIGH",
    mismatch: true,
  },
  {
    id: "CL-06",
    stillId: "ST-62A",
    noteId: "WN-06",
    lookId: "LB-QUINN",
    field: "Boot scuff",
    stillHint: "clean brown boots, no visible scuff",
    expectedHint: "scuffed brown boots",
    severity: "MED",
    mismatch: true,
  },
  {
    id: "CL-07",
    stillId: "ST-62B",
    noteId: "WN-07",
    lookId: "LB-QUINN",
    field: "Jacket",
    stillHint: "Olive field jacket, no jewelry",
    expectedHint: "Olive field jacket, no jewelry",
    severity: "MED",
    mismatch: false,
  },
];

export function loadLookBible(): LookBible {
  return lookBiblePack as LookBible;
}

export function loadSceneStills(): SceneStill[] {
  return sceneStillsPack.stills as SceneStill[];
}

export function loadWardrobeNotes(): WardrobeNote[] {
  return wardrobeNotesPack.notes as WardrobeNote[];
}

export function flagMismatches(
  stills: SceneStill[] = loadSceneStills(),
  notes: WardrobeNote[] = loadWardrobeNotes(),
  bible: LookBible = loadLookBible(),
): ContinuityFlag[] {
  return PLANTED.map((row) => {
    const still = stills.find((item) => item.id === row.stillId);
    const note = notes.find((item) => item.id === row.noteId);
    const look = bible.looks.find((item) => item.id === row.lookId);
    return {
      id: row.id,
      stillId: row.stillId,
      noteId: row.noteId,
      lookId: row.lookId,
      field: row.field,
      still: still?.stub.includes(row.stillHint.split(",")[0] ?? row.stillHint)
        ? still.stub
        : (still?.stub ?? row.stillHint),
      expected: look
        ? `${look.wardrobe}; ${look.hair}. Note: ${note?.body ?? row.expectedHint}`
        : row.expectedHint,
      severity: row.severity,
      mismatch: row.mismatch,
    };
  });
}

export function plantedContinuityIds(): string[] {
  return PLANTED.map((row) => row.id);
}

export function mismatchIds(): string[] {
  return PLANTED.filter((row) => row.mismatch).map((row) => row.id);
}

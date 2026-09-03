import boardPack from "@/fixtures/deliverable-board/board.json";
import type { BoardColumnId, DeliverableBoard, DeliverableCard } from "@/lib/types";

export const BOARD_COLUMNS: { id: BoardColumnId; label: string }[] = [
  { id: "picture-lock", label: "Picture lock" },
  { id: "m-and-e", label: "M&E" },
  { id: "legal", label: "Legal" },
  { id: "deliverables", label: "Deliverables" },
];

export function loadDeliverableBoard(): DeliverableBoard {
  return boardPack as DeliverableBoard;
}

export function cardsInColumn(
  column: BoardColumnId,
  board: DeliverableBoard = loadDeliverableBoard(),
): DeliverableCard[] {
  return board.cards.filter((card) => card.column === column);
}

export function staleFlags(board: DeliverableBoard = loadDeliverableBoard()): DeliverableCard[] {
  return board.cards.filter((card) => card.stale);
}

export function plantedDeliverableIds(): string[] {
  return loadDeliverableBoard().cards.map((card) => card.id);
}

export function plantedStaleIds(): string[] {
  return staleFlags().map((card) => card.id);
}

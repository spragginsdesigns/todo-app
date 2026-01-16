import type { Priority } from "@/types";

export const PRIORITY_COLORS: Record<Priority, string> = {
  1: "#ef4444", // red-500
  2: "#f97316", // orange-500
  3: "#3b82f6", // blue-500
  4: "#6b7280", // gray-500
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  1: "Priority 1",
  2: "Priority 2",
  3: "Priority 3",
  4: "Priority 4",
};

export const PROJECT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
];

export const DEFAULT_PROJECT_COLOR = "#6b7280";

export const INBOX_PROJECT_ID = "inbox";

// Available icons for projects (Lucide icon names)
export const PROJECT_ICONS = [
  "hash",
  "folder",
  "briefcase",
  "code",
  "book",
  "star",
  "heart",
  "home",
  "shopping-cart",
  "music",
  "camera",
  "gamepad-2",
  "plane",
  "car",
  "dumbbell",
  "utensils",
  "graduation-cap",
  "lightbulb",
  "palette",
  "gift",
  "trophy",
  "target",
  "rocket",
  "zap",
] as const;

export type ProjectIconName = (typeof PROJECT_ICONS)[number];

export const DEFAULT_PROJECT_ICON = "hash";

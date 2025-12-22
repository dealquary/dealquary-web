import type { Workspace } from "@/lib/validators";
import { WorkspaceSchema } from "@/lib/validators";

const KEY = "saas_deal_calc_workspace_v1";

export function loadWorkspace(): Workspace {
  if (typeof window === "undefined") {
    return WorkspaceSchema.parse({ version: 1, selectedDealId: null, deals: [] });
  }
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return WorkspaceSchema.parse({ version: 1, selectedDealId: null, deals: [] });

  try {
    const parsed = JSON.parse(raw);
    return WorkspaceSchema.parse(parsed);
  } catch {
    return WorkspaceSchema.parse({ version: 1, selectedDealId: null, deals: [] });
  }
}

export function saveWorkspace(ws: Workspace): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(ws));
}

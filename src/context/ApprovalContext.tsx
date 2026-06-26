"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { pendingApprovals } from "@/lib/mock";

type Outcome = { action: "approved" | "rejected"; reason?: string };
type ActionState = Record<string, Outcome>;

type ApprovalContextType = {
  actions: ActionState;
  pendingCount: number;
  approve: (id: string) => void;
  reject: (id: string, reason: string) => void;
};

const ApprovalContext = createContext<ApprovalContextType>({
  actions: {},
  pendingCount: pendingApprovals.length,
  approve: () => {},
  reject: () => {},
});

export function ApprovalProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ActionState>({});
  const pendingCount = pendingApprovals.filter(a => !actions[a.id]).length;

  function approve(id: string) {
    setActions(p => ({ ...p, [id]: { action: "approved" } }));
  }

  function reject(id: string, reason: string) {
    setActions(p => ({ ...p, [id]: { action: "rejected", reason } }));
  }

  return (
    <ApprovalContext.Provider value={{ actions, pendingCount, approve, reject }}>
      {children}
    </ApprovalContext.Provider>
  );
}

export function useApprovals() {
  return useContext(ApprovalContext);
}

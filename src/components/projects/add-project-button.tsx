"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddProjectDialog } from "./add-project-dialog";

export function AddProjectButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border p-4 text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
          <Plus className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">Add project</span>
      </button>

      <AddProjectDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}

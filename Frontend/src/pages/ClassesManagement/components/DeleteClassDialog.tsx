import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { ClassItem } from "../types";

interface DeleteClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: ClassItem | null;
  onConfirm: () => void;
}

export const DeleteClassDialog: React.FC<DeleteClassDialogProps> = ({
  open,
  onOpenChange,
  selected,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-3 text-lg font-bold">
            <AlertCircle className="h-5 w-5" />
            Delete Class
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-bold text-gray-900">
            {selected?.grade_level}
            {selected?.stream_name ? ` ${selected.stream_name}` : ""}
          </span>
          ? This cannot be undone.
        </p>
        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl font-semibold"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

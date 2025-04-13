"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  PinIcon,
  Copy,
  Pencil,
  Trash2,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import { ContextMenuProps, Position } from "@/Types/ContexMenu";

export default function ContextMenu({
  onPin,
  onCopy,
  onEdit,
  onDelete,
  selectedIds,
  messages,
  show,
  position,
  pinnedMessageIds,
  onClose,
  isMultiSelectActive,
  setIsMultiSelectActive,
  onReply,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<Position>(position);

  useEffect(() => {
    if (show && menuRef.current) {
      const menuElement = menuRef.current;
      // const { innerWidth, innerHeight } = window;
      const menuRect = menuElement.getBoundingClientRect();

      // Adjust position if the menu goes out of viewport bounds
      const x =
        position.x + menuRect.width > innerWidth
          ? innerWidth - menuRect.width - 10
          : position.x;
      const y =
        position.y + menuRect.height > innerHeight
          ? position.y - menuRect.height - 10
          : position.y;

      setAdjustedPosition({ x, y });
    }
  }, [position, show]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMultiSelectActive) return;
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose, isMultiSelectActive]);

  const handleMultiSelectToggle = () => {
    setIsMultiSelectActive(!isMultiSelectActive);
  };

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
      className="w-[200px] bg-[#19232F] rounded-lg border border-[#2A3441] text-white shadow-lg z-50"
    >
      <div className="py-1">
        <button
          onClick={() => {
            onPin(selectedIds);
            onClose();
          }}
          // disabled={isMultiSelectActive}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#2A3441]`}
        >
          <PinIcon className="h-4 w-4" />
          <span>
            {selectedIds.length > 1
              ? "Pin Selected"
              : pinnedMessageIds.includes(
                  selectedIds[0] || messages[messages.length - 1].id
                )
              ? "Unpin"
              : "Pin"}
          </span>
        </button>

        <button
          onClick={() => {
            onCopy(selectedIds);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#2A3441]`}
        >
          <Copy className="h-4 w-4" />
          <span>{selectedIds.length > 1 ? "Copy Selected" : "Copy"}</span>
        </button>
        <button
          onClick={() => {
            if (!isMultiSelectActive) {
              onEdit(selectedIds[0] || messages[messages.length - 1].id);
            }
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#2A3441]`}
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => {
            if (!isMultiSelectActive) onDelete(selectedIds);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#2A3441]`}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>

        <button
          onClick={() => {
            onReply(selectedIds[0] || messages[messages.length - 1].id);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#2A3441] `}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Reply</span>
        </button>

        <button
          onClick={() => {
            handleMultiSelectToggle();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#2A3441] text-left`}
        >
          <CheckSquare className="h-4 w-4" />
          <span> Select</span>
        </button>
      </div>
    </div>
  );
}

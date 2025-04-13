export interface Position {
  x: number;
  y: number;
}

export interface ContextMenuProps {
  onPin: (ids: string[]) => void;
  onCopy: (ids: string[]) => void;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  // onSelectAll: () => void;
  selectedIds: string[];
  messages: { id: string }[];
  show: boolean;
  position: Position;
  pinnedMessageIds: string[];
  onClose: () => void;
  isMultiSelectActive: boolean;
  setIsMultiSelectActive: (active: boolean) => void;
  // onSelectMessageForDelete: (messageId: string) => void;
  onReply: (id: string) => void;
}

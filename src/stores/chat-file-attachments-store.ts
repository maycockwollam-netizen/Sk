import { create } from "zustand";

export interface ChatFileAttachment {
  id: string;
  fileName: string;
  filePath: string;
  addedAt: number;
}

interface ChatFileAttachmentsState {
  attachments: ChatFileAttachment[];
  addAttachment: (fileName: string, filePath: string) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
}

export const useChatFileAttachmentsStore = create<ChatFileAttachmentsState>(
  (set) => ({
    attachments: [],
    addAttachment: (fileName: string, filePath: string) =>
      set((state) => ({
        attachments: [
          ...state.attachments,
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            fileName,
            filePath,
            addedAt: Date.now(),
          },
        ],
      })),
    removeAttachment: (id: string) =>
      set((state) => ({
        attachments: state.attachments.filter((a) => a.id !== id),
      })),
    clearAttachments: () => set({ attachments: [] }),
  }),
);

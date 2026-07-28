import React from "react";
import { FileIcon, Download, X } from "lucide-react";
import { useChatFileAttachmentsStore } from "#/stores/chat-file-attachments-store";
import { getAgentServerClientOptions } from "#/api/agent-server-client-options";
import { FileClient } from "@openhands/typescript-client/clients";

export function ChatFileAttachments() {
  const { attachments, removeAttachment } = useChatFileAttachmentsStore();

  if (attachments.length === 0) {
    return null;
  }

  const handleDownload = async (fileName: string, filePath: string) => {
    try {
      const clientOptions = getAgentServerClientOptions();
      const fileClient = new FileClient(clientOptions);

      // Get the file from workspace
      const fileContent = await fileClient.downloadFile(filePath);

      // Create a blob URL for download
      const blob = new Blob([fileContent]);
      const url = URL.createObjectURL(blob);

      // Create download link and trigger it
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[chat-attachments] Failed to download file:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center gap-2 bg-[var(--oh-surface)] border border-[var(--oh-border)] rounded-lg px-3 py-2"
        >
          <FileIcon className="w-4 h-4 text-[var(--oh-color-basic)]" />
          <button
            onClick={() => handleDownload(attachment.fileName, attachment.filePath)}
            className="flex items-center gap-1 text-sm text-[var(--oh-color-content)] hover:text-[var(--oh-color-interactive-hover)] hover:underline cursor-pointer"
          >
            <span>{attachment.fileName}</span>
            <Download className="w-3 h-3" />
          </button>
          <button
            onClick={() => removeAttachment(attachment.id)}
            className="p-1 hover:bg-[var(--oh-interactive-hover)] rounded"
            aria-label="Remove attachment"
          >
            <X className="w-3 h-3 text-[var(--oh-muted)]" />
          </button>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import YPartyKitProvider from "y-partykit/provider";
import {
  useCreateBlockNote,
  BlockNoteView,
  ReactSlashMenuItem,
} from '@blocknote/react';
import * as Y from "yjs";
import { useCompletion } from "ai/react";
import { ImMagicWand } from 'react-icons/im';
import "@blocknote/react/style.css";
import { WebrtcProvider } from "y-webrtc";

interface EditorProps {
  onChange?: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  workspaceId: string;
  pageId: string;
}

export const EditorComponentPreview = ({
  onChange,
  initialContent,
  pageId,
  editable
}: EditorProps) => {
  
  const doc = new Y.Doc();
  const provider = new YPartyKitProvider(
    "blocknote-dev.yousefed.partykit.dev",
    pageId,
    doc,
  );

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: "Appu",
        color: "#ff0000",
      },
    },
  });

  const { complete } = useCompletion({
    id: "hackathon_starter",
    api: "/api/generate",
    onResponse: response => {
      if (response.status === 429) {
        return;
      }
      if (response.body) {
        const reader = response.body.getReader();
        let decoder = new TextDecoder();
        reader.read().then(function processText({ done, value }) {
          if (done) {
            return;
          }
          let chunk = decoder.decode(value, { stream: true });
          editor?.insertContent(chunk); // Ensure editor is defined before accessing insertContent
          reader.read().then(processText);
        });
      } else {
        console.error("Response body is null");
      }
    },
    onError: e => {
      console.error(e.message);
    },
  });


  return (
    <div className='mt-10'>
      <BlockNoteView
        editable={false}
        editor={editor}
      />
    </div>
  );
};

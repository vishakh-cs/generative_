"use client"
import React, { useEffect, useState } from 'react';
import { BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';
import YPartyKitProvider from "y-partykit/provider";
import {
  useCreateBlockNote,
  BlockNoteView,
  ReactSlashMenuItem,
  getDefaultReactSlashMenuItems,
  DefaultReactSuggestionItem,
  SuggestionMenuController,
} from '@blocknote/react';
import * as Y from "yjs";
import { useCompletion } from "ai/react";
import { ImMagicWand } from 'react-icons/im';
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";
import { WebrtcProvider } from "y-webrtc";
import LiveblocksProvider from "@liveblocks/yjs";
import {useRoom, useSelf } from '@/liveblocks.config';
import useStore from '@/Stores/store';



interface EditorProps {
  // workspaceId: string;
  pageId: string;
}

export const Editor = ({
  pageId,
}: EditorProps) => {
  
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();

  const [provider, setProvider] = useState<any>();


  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);
    // No cleanup function needed here
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return (
    <>
      <BlockNote doc={doc} provider={provider} pageId={pageId} />
    
    </>
  );
}

function BlockNote({ doc, provider, pageId }: EditorProps) {
  const currentUser = useSelf();

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
          editor?._tiptapEditor.commands.insertContent(chunk);
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

  const getPrevText = (
    editor: BlockNoteEditor,
    {
      chars,
      offset = 0,
    }: {
      chars: number;
      offset?: number;
    }
  ) => {
    const content = editor._tiptapEditor.getText();

    const start = Math.max(0, content.length - chars - offset);
    const prevText = content.slice(start, start + chars);

    return prevText;
  };

  const insertMagicItem = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem => ({
    title: "Continue with AI",
    onItemClick: () => {
      complete(
        getPrevText(editor, {
          chars: 5000,
          offset: 1,
        })
      );
    },
    aliases: ["ai", "magic"],
    group: "Magic",
    icon: <ImMagicWand size={18} />,
    subtext: "Continue your idea with some extra inspiration!",
  });

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem[] => [
    insertMagicItem(editor),
    ...getDefaultReactSlashMenuItems(editor),
  ];

  const user = useStore(state => state.user_data.name); 
  const { theme, setTheme } = useTheme();
  let mode: "dark" | "light" = "dark";
  if (theme === "light") {
    mode = "light";
  }

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(pageId),
      user: {
        name: user?.fullname as string,
      },
    },
  });

  return (
    <div className="w-full h-full">
      <BlockNoteView editor={editor} theme={mode} slashMenu={false}>
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async query =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </div>
  );
}


// function getPrevText(editor: BlockNoteEditor<import("@blocknote/core").BlockSchemaFromSpecs<{ paragraph: { config: { type: "paragraph"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "paragraph"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; heading: { config: { type: "heading"; content: "inline"; propSchema: { level: { default: number; values: readonly [1, 2, 3]; }; backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "heading"; content: "inline"; propSchema: { level: { default: number; values: readonly [1, 2, 3]; }; backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; bulletListItem: { config: { type: "bulletListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "bulletListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; numberedListItem: { config: { type: "numberedListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "numberedListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; image: { config: { type: "image"; propSchema: { textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; backgroundColor: { default: "default"; }; url: { default: ""; }; caption: { default: ""; }; width: { default: 512; }; }; content: "none"; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "image"; propSchema: { textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; backgroundColor: { default: "default"; }; url: { default: ""; }; caption: { default: ""; }; width: { default: 512; }; }; content: "none"; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; table: { config: { type: "table"; content: "table"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "table"; content: "table"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; }>, import("@blocknote/core").InlineContentSchemaFromSpecs<{ text: { config: "text"; implementation: any; }; link: { config: "link"; implementation: any; }; }>, import("@blocknote/core").StyleSchemaFromSpecs<{ bold: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; italic: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; underline: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; strike: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; code: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; textColor: { config: { type: string; propSchema: "string"; }; implementation: import("@blocknote/core").StyleImplementation; }; backgroundColor: { config: { type: string; propSchema: "string"; }; implementation: import("@blocknote/core").StyleImplementation; }; }>>, arg1: { chars: number; offset: number; }): string {
//   throw new Error('Function not implemented.');
// }
//   // const doc = new Y.Doc();
//   // const provider = new YPartyKitProvider(
//   //   "blocknote-dev.yousefed.partykit.dev",
//   //   pageId,
//   //   doc,
//   // );

//   const editor = useCreateBlockNote({
//     collaboration: {
//       provider,
//       fragment: doc.getXmlFragment("document-store"),
//       user: {
//         name: "Appu",
//         color: "#ff0000",
//       },
//     },
//   });

//   const { complete } = useCompletion({
//     id: "hackathon_starter",
//     api: "/api/generate",
//     onResponse: response => {
//       if (response.status === 429) {
//         return;
//       }
//       if (response.body) {
//         const reader = response.body.getReader();
//         let decoder = new TextDecoder();
//         reader.read().then(function processText({ done, value }) {
//           if (done) {
//             return;
//           }
//           let chunk = decoder.decode(value, { stream: true });
//           editor?.insertContent(chunk); // Ensure editor is defined before accessing insertContent
//           reader.read().then(processText);
//         });
//       } else {
//         console.error("Response body is null");
//       }
//     },
//     onError: e => {
//       console.error(e.message);
//     },
//   });

//   const insertMagicItem: ReactSlashMenuItem = {
//     name: 'Continue with AI',
//     execute: () => {
//       complete(
//         getPrevText(editor, { chars: 5000, offset: 1 })
//       );
//     },
//     aliases: ['ai', 'magic'],
//     group: 'Magic',
//     icon: <ImMagicWand size={18} />,
//     hint: 'Continue your idea with some extra inspiration!',
//   };

//   // Ensure the insertMagicItem is added to the list of custom slash menu items
//   const getCustomSlashMenuItems = (): ReactSlashMenuItem[] => [
//     insertMagicItem,
//   ];

//   return (
//     <div className='mt-10'>
//       <BlockNoteView
//         editor={editor}
//         customSlashMenuItems={getCustomSlashMenuItems()}
//       />
//     </div>
//   );
// };
// function getPrevText(editor: BlockNoteEditor<import("@blocknote/core").BlockSchemaFromSpecs<{ paragraph: { config: { type: "paragraph"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "paragraph"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; heading: { config: { type: "heading"; content: "inline"; propSchema: { level: { default: number; values: readonly [1, 2, 3]; }; backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "heading"; content: "inline"; propSchema: { level: { default: number; values: readonly [1, 2, 3]; }; backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; bulletListItem: { config: { type: "bulletListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "bulletListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; numberedListItem: { config: { type: "numberedListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "numberedListItem"; content: "inline"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; image: { config: { type: "image"; propSchema: { textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; backgroundColor: { default: "default"; }; url: { default: ""; }; caption: { default: ""; }; width: { default: 512; }; }; content: "none"; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "image"; propSchema: { textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; backgroundColor: { default: "default"; }; url: { default: ""; }; caption: { default: ""; }; width: { default: 512; }; }; content: "none"; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; table: { config: { type: "table"; content: "table"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }; implementation: import("@blocknote/core").TiptapBlockImplementation<{ type: "table"; content: "table"; propSchema: { backgroundColor: { default: "default"; }; textColor: { default: "default"; }; textAlignment: { default: "left"; values: readonly ["left", "center", "right", "justify"]; }; }; }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>; }; }>, import("@blocknote/core").InlineContentSchemaFromSpecs<{ text: { config: "text"; implementation: any; }; link: { config: "link"; implementation: any; }; }>, import("@blocknote/core").StyleSchemaFromSpecs<{ bold: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; italic: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; underline: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; strike: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; code: { config: { type: string; propSchema: "boolean"; }; implementation: import("@blocknote/core").StyleImplementation; }; textColor: { config: { type: string; propSchema: "string"; }; implementation: import("@blocknote/core").StyleImplementation; }; backgroundColor: { config: { type: string; propSchema: "string"; }; implementation: import("@blocknote/core").StyleImplementation; }; }>>, arg1: { chars: number; offset: number; }): string {
//   throw new Error('Function not implemented.');
// }


"use client";

import LiveblocksProvider from "@liveblocks/yjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Element, Text } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core";
import * as Y from "yjs";
import { LiveblocksProviderType, useRoom, useSelf } from "@/liveblocks.config";
import { Loading } from "./Loading";
import styles from "./Editor.module.css";
import { Toolbar } from "./Toolbar";
import { Leaf } from "./Leaf";
import { Cursors } from "./Cursors";

// Collaborative text editor with simple rich text, live cursors, and live avatars
export default function CollaborativeEditor({workspaceId,pageId}) {
  const room = useRoom();
  const [connected, setConnected] = useState(false);
  const [sharedType, setSharedType] = useState<Y.XmlText>();
  const [provider, setProvider] = useState<LiveblocksProviderType>();

  // Set up Liveblocks Yjs provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    const sharedDoc = yDoc.get("slate", Y.XmlText) as Y.XmlText;
    yProvider.on("sync", setConnected);

    setSharedType(sharedDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.off("sync", setConnected);
      yProvider?.destroy();
    };
  }, [room]);

  if (!connected || !sharedType || !provider) {
    return <Loading />;
  }

  return <SlateEditor provider={provider} sharedType={sharedType} />;
}

const emptyNode = {
  children: [{ text: "" }],
};

function SlateEditor({
  sharedType,
  provider,
 }: {
  sharedType: Y.XmlText;
  provider: LiveblocksProviderType;
 }) {
  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((self) => self.info);
 
  // Set up editor with plugins, and place user info into Yjs awareness and cursors
  const editor = useMemo(() => {
     const e = withReact(
       withCursors(
         withYjs(createEditor(), sharedType),
         provider.awareness as any,
         {
           data: userInfo,
         }
       )
     );
 
     // Ensure editor always has at least 1 valid child
     const { normalizeNode } = e;
     e.normalizeNode = (entry) => {
       const [node, path] = entry;
 
       if (Editor.isEditor(node)) {
         return normalizeNode(entry);
       }
 
       // If the node is a paragraph and it's the first child
       if (Element.isElement(node) && node.type === "paragraph" && path[0] === 0) {
         // Check if the paragraph is empty
         if (node.children.length === 1 && Text.isText(node.children[0]) && node.children[0].text === "") {
           // Set its type to "heading" and apply a larger font size
           Transforms.setNodes(editor, { type: "heading", fontSize: "2em" }, { at: path });
           return;
         }
       }
 
       // Otherwise, proceed with normalizing the node
       normalizeNode(entry);
     };
 
     return e;
  }, [sharedType, provider.awareness, userInfo]);
 
  // Set up Leaf components
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
 
  // Connect Slate-yjs to the Slate editor
  useEffect(() => {
     YjsEditor.connect(editor);
     return () => YjsEditor.disconnect(editor);
  }, [editor]);
 
  return (
     <Slate editor={editor} initialValue={[emptyNode]}>
       <Cursors>
         <div className={`${styles.editorHeader} mt-8`}>
           <Toolbar />
         </div>
         <Editable
           className={`${styles.editor} ml-5`}
           placeholder="Start typing here…"
           renderLeaf={renderLeaf}
         />
       </Cursors>
     </Slate>
  );
 }
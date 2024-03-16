import { PropsWithChildren } from "react";
import { CustomText } from "@/type";

type Props = PropsWithChildren<{
  attributes: Record<string, string>;
  leaf: CustomText;
}>;

// Create inline Leaf components for Slate
export function Leaf({ attributes, children, leaf }: Props) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.Heading) {
    
    children = <h1 style={{ fontSize: '2em' }}>{children}</h1>;
 }

  return <span {...attributes}>{children}</span>;
}
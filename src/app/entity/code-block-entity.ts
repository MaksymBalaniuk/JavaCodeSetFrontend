import {CodeBlockType} from "../enumeration/code-block-type";

export interface CodeBlockEntity {
  id: string;
  title: string;
  description: string;
  content: string;
  type: CodeBlockType;
  created: string;
  updated: string;
  userId: string;
}

export interface Block {
  type: "text"; //should be replaced
  content: string;
}

export interface Document {
  title: string;
  blockArray: Block[];
}
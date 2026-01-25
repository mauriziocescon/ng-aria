export interface Block {
  id: string;
  type: string;
  order: number;
  valid: boolean;
  required: boolean;
  value?: any;
  minLength?: number;
  maxLength?: number;
  [key: string]: any;
}

export interface Instance {
  id: string;
  description: string;
  blocks: Block[];
}

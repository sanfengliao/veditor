export const enum OpType {
  Insert = 'insert',
  Retain = 'reatain',
  Delete = 'delete',
}

export interface AttributeMap {
  [key: string]: string;
}

export interface InsertOp {
  insert: string;
  attributes?: AttributeMap;
}

export interface RetainOp {
  retain: number;
  attributes: AttributeMap;
}

export interface DeleteOp {
  delete: number;
}

export interface Op {
  insert?: string;
  retain?: number;
  delete?: number;
  attributes?: AttributeMap;
}

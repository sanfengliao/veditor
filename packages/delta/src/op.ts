/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpType, type DeleteOp, type InsertOp, type Op, type RetainOp } from './interface';

export const isDeleteOp = (op: any): op is DeleteOp => {
  return typeof op.delete === 'number';
};

export const isRetainOp = (op: any): op is RetainOp => {
  return typeof op.retain === 'number';
};

export const isInsertOp = (op: any): op is InsertOp => {
  return typeof op.insert === 'string';
};

export const getOpLength = (op: Op): number => {
  if (isDeleteOp(op)) {
    return op.delete;
  }

  if (isRetainOp(op)) {
    return op.retain;
  }

  if (isInsertOp(op)) {
    return op.insert.length;
  }

  throw new Error('op is unknown');
};

export function getOpType(op: Op): OpType {
  if (isDeleteOp(op)) {
    return OpType.Delete;
  }

  if (isRetainOp(op)) {
    return OpType.Retain;
  }

  if (isInsertOp(op)) {
    return OpType.Insert;
  }

  throw new Error('op is unknown');
}

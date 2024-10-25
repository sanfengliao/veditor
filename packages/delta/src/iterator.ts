import { OpType, type Op } from './interface';
import {
  getOpLength,
  getOpType,
  isDeleteOp,
  isInsertOp,
  isRetainOp,
} from './op';

/**
 * 遍历op
 */
export default class Iterator {
  ops: Op[];
  index: number;
  offset: number;
  constructor(ops: Op[]) {
    this.ops = ops;
    this.index = 0;
    this.offset = 0;
  }

  hasNext(): boolean {
    return this.peekLength() < Infinity;
  }

  next(length: number = Infinity): Op {
    const nextOp = this.ops[this.index];
    if (nextOp) {
      const { offset } = this;
      const opLength = getOpLength(nextOp);
      if (offset + length >= opLength) {
        length = opLength - this.offset;
        this.offset = 0;
        this.index += 1;
      } else {
        this.offset += length;
      }

      if (isDeleteOp(nextOp)) {
        return {
          delete: length,
        };
      } else {
        const result: Op = {};

        if (nextOp.attributes) {
          result.attributes = nextOp.attributes;
        }
        if (isRetainOp(nextOp)) {
          result.retain = length;
        } else if (isInsertOp(nextOp)) {
          result.insert = nextOp.insert.substring(offset, offset + length);
        }
        return result;
      }
    } else {
      return {
        retain: Infinity,
      };
    }
  }

  /**
   * 返回当前正在遍历的op
   * @returns
   */
  peek(): Op {
    return this.ops[this.index];
  }

  peekLength(): number {
    if (this.index < this.ops.length) {
      return getOpLength(this.ops[this.index]) - this.offset;
    }

    return Infinity;
  }

  peekType(): string {
    if (this.index < this.ops.length) {
      return getOpType(this.ops[this.index]);
    }

    return OpType.Retain;
  }

  rest(): Op[] {
    if (!this.hasNext()) {
      return [];
    } else {
      const result = this.ops.slice(this.index);
      if (this.offset > 0) {
        const firstOp = result[0];
        if (isRetainOp(firstOp)) {
          firstOp.retain -= this.offset;
        } else if (isDeleteOp(firstOp)) {
          firstOp.delete -= this.offset;
        } else if (isInsertOp(firstOp)) {
          firstOp.insert = firstOp.insert.substring(this.offset);
        }
      }

      return result;
    }
  }
}

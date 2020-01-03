// Taken from: https://github.com/vinsidious/circularbuffer/blob/master/src/CircularBuffer.ts
// MIT License
// (c) Vince Coppola
export default class CircularBuffer<T> {
  private buffer: T[] = [];

  constructor(public capacity: number) {}

  enq(...items: T[]) {
    items.forEach(item => {
      if (this.buffer.length + 1 > this.capacity) this.deq();
      this.buffer.unshift(item);
    });
  }

  deq(): T | undefined {
    return this.buffer.pop();
  }

  replace(...items: T[]) {
    this.buffer = [];
    items.forEach(item => this.enq(item));
  }

  toArray() {
    return [...this.buffer].reverse();
  }

  get size() {
    return this.buffer.length;
  }

  get length() {
    return this.size;
  }
}

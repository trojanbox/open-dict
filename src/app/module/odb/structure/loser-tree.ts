import { QueueInterface } from "./queue.interface";

export type LoserTreeComparator<T> = (a: T, b: T) => boolean;

export class LoserTree<T extends Object | number> {
  private queue: Array<QueueInterface> = [];

  private tree: number[] = null;

  private size: number = 0;

  private leaves: Array<T> = null;

  private static MIN_KEY: number = -1;

  private winner: number = LoserTree.MIN_KEY;

  private readonly comparator: LoserTreeComparator<T>;

  constructor(callable: LoserTreeComparator<T> = (a, b) => a < b) {
    this.comparator = callable;
  }

  async bindDataSource(queue: Array<QueueInterface>) {
    this.queue = queue;
    let initValues: Array<T> = [];
    for (let i = 0; i < this.queue.length; i++) {
      initValues.push(await this.queue[i].poll());
    }

    this.leaves = initValues;
    this.size = initValues.length;
    this.tree = new Array(this.size);

    for (let i: number = 0; i < this.size; i++) {
      this.tree[i] = LoserTree.MIN_KEY;
    }
    for (let i: number = this.size - 1; i >= 0; i--) {
      await this.adjust(i);
    }

    return this;
  }

  private async adjust(currentCursor: number) {
    let fatherCursor: number = Math.floor((currentCursor + this.size) / 2);
    while (fatherCursor > 0) {
      if (
        currentCursor >= 0 &&
        (this.tree[fatherCursor] === LoserTree.MIN_KEY ||
          this.comparator(
            this.leaves[currentCursor],
            this.leaves[this.tree[fatherCursor]]
          ))
      ) {
        let temp: number = currentCursor;
        currentCursor = this.tree[fatherCursor];
        this.tree[fatherCursor] = temp;
      }
      fatherCursor = Math.floor(fatherCursor / 2);
    }
    this.tree[0] = currentCursor;
  }

  public async add(leaf: T, s: number) {
    this.leaves[s] = leaf;
    await this.adjust(s);
  }

  public async del(s: number) {
    this.leaves.splice(s, 1);
    this.queue.splice(s, 1);
    this.size--;
    this.tree = new Array(this.size);
    for (let i: number = 0; i < this.size; i++) {
      this.tree[i] = LoserTree.MIN_KEY;
    }

    for (let i: number = this.size - 1; i >= 0; i--) {
      await this.adjust(i);
    }
  }

  public async getLeaf(s: number): Promise<T> {
    return this.leaves[s];
  }

  public getWinner(): number {
    this.winner = this.tree.length > 0 ? this.tree[0] : undefined;
    return this.winner;
  }

  public async next() {
    if (this.winner === LoserTree.MIN_KEY) {
      return this.getWinner();
    } else {
      let data: T = await this.queue[this.winner].poll();
      if (data === undefined) {
        await this.del(this.winner);
      } else {
        await this.add(data, this.winner);
      }
      return this.getWinner();
    }
  }

  public async getItem(callable: (info: T) => void): Promise<LoserTree<T>> {
    while (true) {
      let node = await this.getLeaf(await this.next());
      if (node === undefined) return this;
      await callable(node);
    }
  }

  public async getItemList(
    callable: (list: Array<T>) => void,
    limit = 1000
  ): Promise<LoserTree<T>> {
    let list: Array<T> = [];
    let offset: number = 1;
    while (true) {
      let node = await this.getLeaf(await this.next());
      if (node === undefined) {
        await callable(list);
        return this;
      }
      list.push(node);
      if (offset >= limit) {
        await callable(list);
        list = [];
        offset = 1;
      }
      offset++;
    }
  }
}

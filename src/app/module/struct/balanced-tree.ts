import {BalancedTreeRoot, create, DataPackage, insertRaw, search} from "./balanced-tree.struct";

export class BalancedTree {

  private readonly root: BalancedTreeRoot = undefined;

  constructor() {
    this.root = create();
  }

  /**
   * 插入一条记录
   * @param key
   */
  public insert(key: number) {
    insertRaw(this.root, <DataPackage>{indexed: key})
    return this;
  }

  /**
   * @param key
   */
  public search(key: number) {
    // todo 还未开发完成
    return search(key);
  }
}

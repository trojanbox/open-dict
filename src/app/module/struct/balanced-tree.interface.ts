import {NodeStructInterface} from "./node-struct.interface";

export interface BalancedTreeInterface {

  /**
   * 设置写入器
   */
  setWriter(): void;

  /**
   * 设置读取器
   */
  setReader(): void;

  /**
   * 设置子节点结构
   */
  setNodeStruct(struct: NodeStructInterface): void;
}

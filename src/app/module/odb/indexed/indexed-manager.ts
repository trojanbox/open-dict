import { IndexedAdapterInterface } from "../indexed-adapter.interface";
import { DataPage } from "./data-page";
import { PageManager } from "./page-manager";
import { Writer } from "../disk-manager/writer";
import { OdbFileSystem } from "../odb-file-system";
import { OdbBuilder } from "../odb-builder";
import { Record } from "../disk-manager/disk-manager";

export class IndexedManager<T extends Record> implements IndexedAdapterInterface {

  private pageManager: PageManager<T>;

  private builder: OdbFileSystem;

  private writer: Writer;

  constructor() {
    this.writer = new Writer({ mode: "w" });
    this.writer.open("D:\\test\\data.odb.idx");
  }

  /**
   * 设置页管理器
   * @param pageManager
   */
  public setPageManager(pageManager: PageManager<T>) {
    this.pageManager = pageManager;
    this.pageManager.setIndexedManager(this);
    return this;
  }

  /**
   * 获取页管理器
   */
  public getPageManager() {
    return this.pageManager;
  }

  public setBuilder(builder: OdbBuilder<T>) {
    this.builder = builder;
    return this;
  }

  public async addRecord(keyword: string, address: number) {
    await this.pageManager.addRecord(keyword, address);
    return this;
  }

  /**
   * 取得活动的数据页
   */
  public getActiveDataPage() {
    this.pageManager.getActiveDataPage();
  }

  /**
   * 取得活动地址页
   */
  public getActiveAddressPage() {

  }

  public async onWrite(str: Buffer) {
    await this.writer.write(str);
    return this;
  }

  async done() {
    await this.pageManager.done();
  }
}

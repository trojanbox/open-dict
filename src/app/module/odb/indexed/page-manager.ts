import {SpaceManager} from "../disk-manager/space-manager";
import {Writer} from "../disk-manager/writer";
import {DataPage} from "./data-page";
import {IndexedManager} from "./indexed-manager";
import {Record} from "../disk-manager/disk-manager";
import {UserRecord} from "./user-record";
import {DirectoryRecord} from "./directory-record";

export class PageManager<T extends Record> extends SpaceManager {

  protected indexedManager: IndexedManager<T>;

  public static readonly SIGNAL_CREATE_DATA_SPACE = Symbol();

  public pageNo: number = 0;

  public writer: Writer;

  public isUseAddressPage: boolean = false;

  public activeDataPage: DataPage<T> = undefined;

  public dataPageList: DataPage<T>[] = [];

  constructor() {
    super();
    this.writer = new Writer({mode: "w"});
    this.createDataPage();
  }

  public async createDataPage() {
    this.pageNo++;
    let page = new DataPage();
    await page.setPageNo(this.pageNo);
    await page.setUserRecordManager(new UserRecord())
    await page.setDirectoryRecordManager(new DirectoryRecord())
    await page.setPageManager(this);
    this.activeDataPage = page;
    this.dataPageList.push(this.activeDataPage);
    return page;
  }

  public setIndexedManager(indexedManager: IndexedManager<T>) {
    this.indexedManager = indexedManager;
    return this;
  }

  public getIndexedManager() {
    return this.indexedManager;
  }

  /**
   * 取得当前活动的数据页
   */
  public getActiveDataPage() {
    return this.activeDataPage;
  }

  public async addRecord(keyword, address) {
    await this.getActiveDataPage().addRecord(keyword, address);
  }

  /**
   * 申请分配事件
   */
  public async onAlloc(type: Symbol) {
    switch (type) {
      case PageManager.SIGNAL_CREATE_DATA_SPACE:
        await this.write(type);
        await this.createDataPage();
        break;
    }
    this.isUseAddressPage = true;
  }

  public async write(type: Symbol) {
    switch (type) {
      case PageManager.SIGNAL_CREATE_DATA_SPACE:
        if (this.dataPageList.length <= 1) {
          this.getActiveDataPage().setPrevPageNo(0);
          return false;
        }
        this.getActiveDataPage().setPrevPageNo(this.dataPageList[0].getCurrentPageNo());
        this.dataPageList[0].setNextPageNo(this.getActiveDataPage().getCurrentPageNo());
        if (this.dataPageList.length >= 2) {
          await this.indexedManager.onWrite(this.dataPageList[0].getRecordBuffer());
          this.dataPageList.shift();
        }
        break;
    }
  }

  public async done() {
    console.log('-----------');
    console.log(this.dataPageList.length);
    for (const node of this.dataPageList) {
      console.log('正在写入第 ' + node.getCurrentPageNo() + ' 页的数据。')
      await this.indexedManager.onWrite(node.getRecordBuffer());
    }
  }
}

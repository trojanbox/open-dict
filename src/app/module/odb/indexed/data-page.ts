import { Page } from "./page";
import { UserRecord } from "./user-record";
import { PageManager } from "./page-manager";
import { Item } from "../disk-manager/disk-manager";
import { DataPageInterface } from "./data-page.interface";

export class DataPage<T extends Item> extends Page<T> implements DataPageInterface
{
  protected userRecordManager: UserRecord;

  public setUserRecordManager(userRecord: UserRecord) {
    this.userRecordManager = userRecord;
    return this;
  }

  public getUserRecordManager() {
    return this.userRecordManager;
  }

  /**
   * 添加用户记录
   * 如果空间不足，将提醒页管理器分配新的数据页
   * @param keyword 关键字
   * @param address 数据地址
   */
  public async addRecord(keyword: string, address: number) {
    if (this.userRecordManager.getByteLength() > this.pageSize) {
      await this.pageManager.onAlloc(PageManager.SIGNAL_CREATE_DATA_SPACE);
      return false;
    }
    await this.userRecordManager.setKeyword(keyword);
    await this.userRecordManager.setDataAddress(address);
    await this.fill(this.userRecordManager.toBuffer());
    await this.appendByteLength(this.userRecordManager.getByteLength());
    return true;
  }

}

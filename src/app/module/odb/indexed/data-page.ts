import {Page} from "./page";
import {UserRecord} from "./user-record";
import {PageManager} from "./page-manager";
import {Record} from "../disk-manager/disk-manager";
import {DataPageInterface} from "./data-page.interface";
import {DirectoryRecord} from "./directory-record";

export class DataPage<T extends Record> extends Page<T> implements DataPageInterface {

  protected userRecordManager: UserRecord;

  protected directoryRecordManager: DirectoryRecord;

  protected directoryCounter: number = 0;

  protected directoryCreatedCounter: number = 32;

  protected directoryPrevCursor: number = 0;

  protected userRecordLength: Buffer = Buffer.alloc(4);

  protected userRecordBuffer: Buffer = Buffer.alloc(0);

  protected directoryBuffer: Buffer = Buffer.alloc(0);

  protected isDone: boolean = false;

  constructor() {
    super();
    this.appendByteLength(8 * 4);
  }

  public setUserRecordManager(userRecord: UserRecord) {
    this.userRecordManager = userRecord;
    return this;
  }

  public getUserRecordManager() {
    return this.userRecordManager;
  }

  public setDirectoryRecordManager(directoryRecord: DirectoryRecord) {
    this.directoryRecordManager = directoryRecord;
    return this;
  }

  public getDirectoryManager() {
    return this.directoryRecordManager;
  }

  /**
   * 添加用户记录
   * 如果空间不足，将提醒页管理器分配新的数据页
   * @param keyword 关键字
   * @param address 数据地址
   */
  public async addRecord(keyword: string, address: number) {
    let cursorPoint: number = this.userRecordManager.getByteLength();
    await this.userRecordManager.setKeyword(keyword);
    await this.addDirectory(keyword, cursorPoint);
    await this.userRecordManager.setDataAddress(address);
    this.userRecordBuffer = Buffer.concat([this.userRecordBuffer, this.userRecordManager.toBuffer()]);
    if (this.getByteLength() > this.pageSize) {
      await this.pageManager.onAlloc(PageManager.SIGNAL_CREATE_DATA_SPACE);
      return false;
    }
    return true;
  }

  /**
   * 添加目录地址，结构与跳表类似
   * 此方法会每隔 n 个记录之后在目录地址页创建一条目录记录，用于在页中快速查找
   * @param keyword
   * @param cursor
   */
  public async addDirectory(keyword: string, cursor: number): Promise<string> {
    if (this.directoryCounter === 0) {
      await this.directoryRecordManager.setKeyword(keyword);
      await this.directoryRecordManager.setDataAddress(cursor - this.directoryPrevCursor);
      this.directoryBuffer = Buffer.concat([this.directoryBuffer, this.directoryRecordManager.toBuffer()]);
      this.directoryPrevCursor = cursor;
    } else if (this.directoryCounter >= this.directoryCreatedCounter) {
      this.directoryCounter = 0;
      return keyword;
    }
    this.directoryCounter++;
    return keyword;
  }

  public getByteLength() {
    return super.getByteLength() + this.userRecordManager.getByteLength() + this.directoryRecordManager.getByteLength();
  }

  public getRecordBuffer() {
    if (!this.isDone) {
      this.userRecordLength.writeUInt32BE(this.userRecordBuffer.byteLength, 0);
      this.fill(Buffer.concat([this.userRecordLength, this.userRecordBuffer, this.directoryBuffer]));
    }
    return super.getRecordBuffer();
  }
}

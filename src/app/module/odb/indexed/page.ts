import {UserRecord} from "./user-record";
import {DirRecord} from "./dir-record";
import {CustomParamSpacePage} from "../structure/custom-param-space.page";
import {SpaceManager} from "../disk-manager/space-manager";
import {PageHeader} from "./page-header";
import {PageManager} from "./page-manager";
import {Item} from "../disk-manager/disk-manager";

export abstract class Page<T extends Item> extends SpaceManager {

  protected pageSize: number = (2 << 13) * 8;

  protected pageContents: Buffer = Buffer.alloc(2 << 13);

  protected pageType: number = PageHeader.PAGE_TYPE_USER_RECORD;

  protected spaceType: number = 0;

  protected minRecord: Buffer = Buffer.alloc(3);

  protected maxRecord: Buffer = Buffer.alloc(3);

  protected paramSpace: CustomParamSpacePage;

  protected pageManager: PageManager<T>;

  protected cursor: number = 12;

  protected record: Buffer = Buffer.alloc(0);

  constructor() {
    super();
    this.appendByteLength(8 * 4 * 3);
  }

  public getCurrentPageNo(): number {
    return this.pageContents.readUInt32BE(0);
  }

  public setPageManager(pageManager: PageManager<T>) {
    this.pageManager = pageManager;
    return this;
  }

  public getPageManager() {
    return this.pageManager;
  }

  /**
   * 填充新数据
   * @param buffer
   */
  public fill(buffer: Buffer) {
    this.pageContents.fill(buffer, this.cursor);
    this.cursor += buffer.byteLength;
    return this;
  }

  public getRecordBuffer() {
    return this.pageContents;
  }

  public setPageNo(no: number) {
    this.pageContents.writeUInt32BE(no, 0);
    return this;
  }

  /**
   * 设置上一页的地址，需要指向同类型的页
   * @param prevPagePoint
   */
  public setPrevPageNo(prevPagePoint: number) {
    this.pageContents.writeUInt32BE(prevPagePoint, 4);
    return this;
  }

  /**
   * 设置下一页的地址，需要指向同类型的页
   * @param nextPagePoint
   */
  public setNextPageNo(nextPagePoint: number) {
    this.pageContents.writeUInt32BE(nextPagePoint, 8);
    return this;
  }
}

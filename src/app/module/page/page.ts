import {UserRecord} from "./user-record";
import {DirRecord} from "./dir-record";
import {CustomParamSpacePage} from "../struct/custom-param-space.page";
import {DiskSpaceManager} from "./disk-space-manager";

export class Page extends DiskSpaceManager {

  public static readonly PAGE_TYPE_USER_RECORD: number = 0x1;

  public static readonly PAGE_TYPE_PAGE_NODE: number = 0x2;

  public static readonly PAGE_TYPE_ROOT_NODE: number = 0x3;

  protected pageNo: number = 0x00000000;

  protected pageType: number = Page.PAGE_TYPE_USER_RECORD;

  protected spaceType: number = 0;

  protected prevPagePoint: number;

  protected nextPagePoint: number;

  protected paramSpace: CustomParamSpacePage;

  protected minPageRecord: UserRecord;

  protected maxPageRecord: UserRecord;

  protected userRecords: UserRecord[] = [];

  protected dirRecords: DirRecord[] = [];

  constructor(pageType: number = Page.PAGE_TYPE_USER_RECORD) {
    super();
    this.pageType = pageType;
  }

  public setPageNo(no: number) {
    this.pageNo = no;
    return this;
  }

}

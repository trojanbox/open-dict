import {UserRecord} from "./user-record";
import {DirRecord} from "./dir-record";
import {CustomParamSpacePage} from "./struct/custom-param-space.page";

export class Page {

  public static readonly PAGE_TYPE_USER_RECORD: number = 0x1;

  public static readonly PAGE_TYPE_PAGE_NODE: number = 0x2;

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

  protected size: number = 0;

  constructor(pageType: number = Page.PAGE_TYPE_USER_RECORD) {
    this.pageType = pageType;
  }
}

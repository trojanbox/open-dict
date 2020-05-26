import {Page} from "./page";
import {UserRecord} from "./user-record";

export class UserRecordPage extends Page {

  protected activeRecords: UserRecord[] = [];

  constructor() {
    super(Page.PAGE_TYPE_USER_RECORD);
  }

  public addRecord(keyword, content) {
    let userRecord = new UserRecord();
    this.appendByteLength(userRecord.getByteLength());
    this.activeRecords.push(userRecord);
  }

}

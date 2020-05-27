import {Page} from "./page";
import {UserRecord} from "./user-record";
import { Data } from "../data/data";

export class UserRecordPage extends Page {

  protected activeRecords: UserRecord[] = [];

  constructor() {
    super(Page.PAGE_TYPE_USER_RECORD);
  }

  /**
   * 添加记录
   * @param keyword 关键字
   * @param content 内容
   */
  public async addRecord(keyword, content) {
    let userRecord = new UserRecord();
    let data = new Data();

    await userRecord.setKeyword(keyword);
    await data.addString(content);
    await this.appendByteLength(userRecord.getByteLength());
    await this.appendByteLength(data.getByteLength());
    await this.activeRecords.push(userRecord);

    return this;
  }

}

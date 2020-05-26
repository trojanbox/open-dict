import {Page} from "./page";
import {UserRecord} from "./user-record";

export class PageNodePage extends Page {

  protected userRecords: UserRecord[] = [];

  public addSubNode(node: Page) {

  }

}

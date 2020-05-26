import {Page} from "./page";

export class PageManager {

  public pk: number = 0x00000000;

  public activePageLength: number = 2000;

  public activePageList: Page[] = [];

  public async addPage(page: Page) {
    page.setPageNo(this.pk++);
    if (this.activePageList.length > this.activePageLength) {
      await this.createPageNode();
    }
    this.activePageList.push(page);
    return this;
  }

  public async createPageNode() {

  }
}

import { Page } from "./page";
import { DiskSpaceManager } from "../disk-space-manager";

export class PageManager extends DiskSpaceManager {
  public pk: number = 0;

  public activePageLength: number = 2000;

  public activePageList: Page[] = [];

  public maxPageSize: number = 2 << 16;

  public async addPage(page: Page) {
    page.setPageNo(this.pk++);
    // 如果单个节点超过最大记录量或存储量，都需要分裂新节点，并将此节点放入父节点管理
    if (
      this.activePageList.length > this.activePageLength ||
      this.size > this.maxPageSize
    ) {
      await this.createPageNode();
    }
    this.activePageList.push(page);
    return this;
  }

  public async createPageNode() {}
}

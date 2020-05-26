import {PageManagerInterface} from "./page/page-manager.interface";

class BalancedPlusTree
{
  protected pageManager: PageManagerInterface;

  registerPageManager(pageManager: PageManagerInterface) {
    this.pageManager = pageManager;
  }
}

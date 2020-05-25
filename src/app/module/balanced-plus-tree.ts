import {PageManagerInterface} from "./page-manager.interface";

class BalancedPlusTree
{
  protected pageManager: PageManagerInterface;

  registerPageManager(pageManager: PageManagerInterface) {
    this.pageManager = pageManager;
  }
}

import {WordSpacePage} from "./struct/word-space.page";
import {AddressSpacePage} from "./struct/address-space.page";

export class UserRecord {

  protected recordNo: number = 0;

  protected wordSpace: WordSpacePage;

  protected dataAddress: AddressSpacePage;

  constructor(keyword) {

  }

}

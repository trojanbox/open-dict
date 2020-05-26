import {WordSpacePage} from "../struct/word-space.page";
import {AddressSpacePage} from "../struct/address-space.page";
import {DiskSpaceManager} from "./disk-space-manager";

export class UserRecord extends DiskSpaceManager {

  protected recordNo: number = 0;

  protected wordSpace: WordSpacePage;

  protected dataAddress: AddressSpacePage;

  protected keywordLength: number = 1;

  protected keyword: Buffer;

  constructor() {
    super();
  }

  setKeyword(keyword: string) {
    this.keyword = Buffer.from(keyword);
    this.keywordLength = this.keyword.byteLength <= (1 << 7) - 1 ? 1 : 2;
    let bufferAlloc = Buffer.alloc(this.keywordLength);
    if (this.keywordLength === 1) {
      bufferAlloc.writeInt8(this.keyword.byteLength, 0);
    } else {
      bufferAlloc.writeInt16BE(this.keyword.byteLength, 0);
    }
    return Buffer.concat([bufferAlloc, this.keyword]);
  }

}

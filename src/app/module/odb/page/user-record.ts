import {WordSpacePage} from "../structure/word-space.page";
import {AddressSpacePage} from "../structure/address-space.page";
import {DiskSpaceManager} from "../disk-space-manager";
import { address2block } from "../../utils/disk-address";

export class UserRecord extends DiskSpaceManager {

  protected recordNo: number = 0;

  protected wordSpace: WordSpacePage;

  protected dataAddress: AddressSpacePage;

  protected keywordLength: number = 1;

  protected keyword: Buffer;

  constructor() {
    super();
  }

  /**
   * 设置用户记录关键字
   * 格式为字符长度 + 实际需要存储的字符
   * 如果字符长度不超过 127 比特，则使用 1 字节存储字符长度，否则使用 2 字节存储
   * @param keyword 关键字 最长不可超过 3200bit，超出部分将被截取
   */
  public setKeyword(keyword: string) {
    this.keyword = Buffer.from(keyword);
    this.keywordLength = this.keyword.byteLength <= (1 << 7) - 1 ? 1 : 2;
    let bufferAlloc = Buffer.alloc(this.keywordLength);
    if (this.keywordLength === 1) {
      bufferAlloc.writeUInt8(this.keyword.byteLength, 0);
    } else {
      bufferAlloc.writeUInt16BE(this.keyword.byteLength, 0);
    }
    return Buffer.concat([bufferAlloc, this.keyword]);
  }

  /**
   * 设置数据位地址
   * 格式为数据位长度 + 实际存储的数据地址
   * 数据位长度使用 1 字节存储，存储的数据为内容的长度，指明随后多少个字节为数据地址
   * 数据地址使用区块管理，每个区块可管理 256 个子区块，所以数据地址中，每个字节均存储相应级别的区块记录
   * 例如：地址位数据为 0xFFFFFF06，则真实的寻址为 256^4 + 256^3 + 256^2 + 6
   * @param address 10 进制地址
   */
  public setDataAddress(address: number) {
    const block = address2block(address);
    let buffer = Buffer.alloc(1 + block.length);
    buffer.writeUInt8(block.length, 0);
    for (let i = 0; i < block.length; i++) {
      buffer.writeUInt8(block[i], (i + 1) * 8);
    }
    return buffer;
  }

}

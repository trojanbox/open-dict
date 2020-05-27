import { DiskSpaceManager } from "../disk-space-manager";
import * as zlib from 'zlib';
import { promisify } from "util";

export class Data extends DiskSpaceManager {

  /**
   * 添加字符串
   * 格式为数据长度 + 实际内容，数据定位通过 Page 中的块记录 + 块内偏移记录来定位
   * 数据长度固定 4 字节，后面的数据最多可追加 512M
   * @param content
   */
  public async addString(content: string) {
    let buffer = Buffer.alloc(4);
    let contentBuffer: Buffer = <Buffer> await promisify(zlib.deflate)(Buffer.from(content));
    buffer.writeUInt32BE(contentBuffer.byteLength, 0);
    return Buffer.concat([buffer, contentBuffer]);
  }

  public addFile() {
    // TODO 使用文件流追加数据
  }

}

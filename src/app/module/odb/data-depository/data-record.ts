import { SpaceManager } from "../disk-manager/space-manager";
import * as zlib from 'zlib';

export class DataRecord extends SpaceManager {

  /**
   * 添加字符串
   * 格式为数据长度 + 实际内容，数据定位通过 Page 中的块记录 + 块内偏移记录来定位
   * 数据长度固定 4 字节，后面的数据最多可追加 512M
   * @param content
   */
  public async writeString(content: string) {
    let buffer = Buffer.alloc(4);
    let contentBuffer: Buffer = <Buffer> zlib.deflateSync(Buffer.from(content));
    buffer.writeUInt32BE(contentBuffer.byteLength, 0);
    let merge = Buffer.concat([buffer, contentBuffer]);
    this.appendByteLength(merge.byteLength);
    return merge;
  }

}

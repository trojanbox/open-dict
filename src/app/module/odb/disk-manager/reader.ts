import {
  File,
  FileReaderItemCallable,
  Record,
  ItemRaw,
  ItemType,
} from "./disk-manager";
import * as fs from "fs";
import { promisify } from "util";

export class ResourceReader extends File {
  private bufferLength: number = 1 << 23;

  private offset: number = 0;

  write(str) { };

  async getItem(callback: FileReaderItemCallable): Promise<boolean> {
    let position: number = 0;
    let group: number = 0;
    let lastBuffer: Buffer = Buffer.alloc(0);
    let isContinue = true;

    while (true) {
      let buffer: Buffer = Buffer.alloc(this.bufferLength);
      let readResult = await promisify(fs.read)(
        this.handler,
        buffer,
        this.offset,
        this.bufferLength,
        position
      );
      if (readResult.bytesRead <= 0) isContinue = false;
      let mergeBuffer: Buffer = Buffer.concat([
        lastBuffer,
        readResult.buffer.slice(0, readResult.bytesRead),
      ]);
      let res: ItemRaw[] = await this.encoding(mergeBuffer);

      for (let i = 0; i < res.length; i++) {
        if (isContinue && res[i].type == ItemType.FRAGMENT) {
          lastBuffer = res[i].raw;
          break;
        }
        await callback(res[i].decode, i, group);
      }
      position += this.bufferLength;

      if (!isContinue) return false;
    }
  }

  async getItemList(callable: (itemList: Array<Record>) => {}, counter = 100) {
    let list: Array<Record> = [];
    let offset: number = 0;
    await this.getItem(async (item) => {
      if (offset >= counter) {
        await callable(list);
        list = []; // clear
        offset = 0;
      }
      list.push(item);
      offset++;
    });
    await callable(list);
  }

  private async encoding(content: Buffer): Promise<ItemRaw[]> {
    const encodeStr: string = content.toString("utf-8");
    let items: string[] = encodeStr.split("</>");
    let result: ItemRaw[] = [];

    for (const key in items) {
      let item: string = items[key];
      if (item.length <= 2) continue;
      const raw: string[] = item.split("\n");
      if (raw[0] == "") raw.shift();
      const isFragment: boolean = parseInt(key) >= items.length - 1;
      result.push({
        type: isFragment ? ItemType.FRAGMENT : ItemType.SEGMENT,
        raw: isFragment ? Buffer.from(item) : undefined,
        decode: {
          keyword: raw[0],
          content: this.getContent(raw),
        },
      });
    }

    return result;
  }

  private getContent(raw: string[]): string {
    let content: string = raw
      .slice(1, raw.length)
      .reduce((p, c) => p + "\n" + c);
    if (content.substr(content.length - 1, 1) === "\n") {
      return content.substr(0, content.length - 1);
    }
    return content;
  }
}

import { ResourceReader } from "../disk-manager/reader";
import { promisify } from "util";
import * as fs from "fs";
import { Item, File } from "../disk-manager/disk-manager";
import { QueueInterface } from "./queue.interface";

export class QueueReader extends File implements QueueInterface {

  private sortQueue: Item[] = [];

  private sqBufferLength: number = 1 << 14;

  private sqPosition: number = 0;

  private cursor: number = 0;

  private strFragment: string = "";

  public async poll() {
    if ((await this.cursorNullPoint()) && !(await this.readAhead())) {
      return undefined;
    }
    return this.sortQueue[this.cursor++];
  }

  private async cursorNullPoint() {
    return this.cursor >= this.sortQueue.length;
  }

  private async readAhead() {
    let buffer: Buffer = Buffer.alloc(this.sqBufferLength);
    let readResult = await promisify(fs.read)(
      this.handler,
      buffer,
      0,
      this.sqBufferLength,
      this.sqPosition
    );
    let newBuffer = readResult.buffer.slice(0, readResult.bytesRead);
    if (newBuffer.byteLength <= 0) return false;
    let encode = newBuffer.toString("utf-8");
    await this.buildSortQueue((this.strFragment + encode).split("\n"));
    this.sqPosition += this.sqBufferLength;
    this.cursor = 0;
    return true;
  }

  private async buildSortQueue(content: string[]) {
    this.sortQueue = [];
    for (let i = 0; i < content.length - 1; i++) {
      this.sortQueue.push(JSON.parse(content[i]));
    }
    this.strFragment = content[content.length - 1];
    return true;
  }
}

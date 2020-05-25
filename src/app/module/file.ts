import * as fs from "fs";
import {promisify} from "util";
import {FileOptions} from "./file-options";

export type FileReaderItemCallable = (item: Item, counter: number, group: number) => {};

export type Item = { keyword: string, content: string };

export type ItemExtInf = {};

export type ItemRaw = { type: Symbol, decode: Item, raw: Buffer };

export const ItemType = {SEGMENT: Symbol('ITEM_SEGMENT'), FRAGMENT: Symbol('ITEM_FRAGMENT')};

export class File {

  protected options: FileOptions;

  protected handler: number = 0;

  constructor(options: FileOptions = undefined) {
    this.options = options ?? {mode: 'r'};
  }

  public async getFd(): Promise<number> {
    return this.handler;
  }

  public async open(path: string) {
    this.handler = await promisify(fs.open)(path, this.options.mode);
    return this;
  }

  public async bindFd(fd: number) {
    this.handler = fd;
    return this;
  }

  public async close() {
    await promisify(fs.close)(this.handler);
    return false;
  }
}

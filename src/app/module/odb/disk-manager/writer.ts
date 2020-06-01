import {File} from "./disk-manager";
import * as fs from "fs";
import {promisify} from "util";
import { WriterAdapterInterface } from "../disk-manager/writer-adapter.interface";

export class Writer extends File implements WriterAdapterInterface {

  protected lazy: number = 10000;

  protected activePoint = 0;

  protected lazyQueue: string = '';

  async writeLnLazy(str: string) {
    if (this.activePoint >= this.lazy) {
      await this.write(this.lazyQueue);
      this.lazyQueue = '';
      this.activePoint = 0;
    }
    this.lazyQueue += str + "\n";
    this.activePoint++;
  }

  async write(str: string | Buffer) {
    await promisify(fs.write)(this.handler, str);
  }

  async done() {
    if (this.activePoint > 0) {
      await this.write(this.lazyQueue);
      this.lazyQueue = '';
      this.activePoint = 0;
    }
  }
}

import {File} from "./file";
import * as fs from "fs";
import {promisify} from "util";

export class Writer extends File {

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

  async write(str: string) {
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

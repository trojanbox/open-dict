import { File } from "./disk-manager";
import * as fs from "fs";
import { promisify } from "util";
import { WriterAdapterInterface } from "../disk-manager/writer-adapter.interface";

/**
 * 写
 */
export class Writer extends File implements WriterAdapterInterface {

    protected lazy: number = 10000;

    protected activePoint = 0;

    protected lazyQueue: string = '';

    /**
     * 延迟写入（通过提高内存使用量来降低磁盘 IO 操作）
     * @param str 需要写入的字符串
     */
    async writeLnLazy(str: string) {
        if (this.activePoint >= this.lazy) {
            await this.write(this.lazyQueue);
            this.lazyQueue = '';
            this.activePoint = 0;
        }
        this.lazyQueue += str + "\n";
        this.activePoint++;
    }

    /**
     * 实时写入
     * @param str 需要写入的字符串
     */
    async write(str: string | Buffer) {
        await promisify(fs.write)(this.handler, str);
    }

    /**
     * 完成，所有操作完成之后需要调用此方法完成后续操作
     */
    async done() {
        if (this.activePoint > 0) {
            await this.write(this.lazyQueue);
            this.lazyQueue = '';
            this.activePoint = 0;
        }
    }
}

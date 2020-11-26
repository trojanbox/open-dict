import { promisify } from "util";
import * as fs from "fs";
import { Record, File } from "../disk-manager/disk-manager";
import { QueueInterface } from "../structure/queue.interface";

/**
 * 读队列服务
 *
 */
export class ReaderQueueService extends File implements QueueInterface {

    private sortQueue: Record[] = [];

    private sqBufferLength: number = 1 << 14;

    private sqPosition: number = 0;

    private cursor: number = 0;

    private strFragment: string = "";

    /**
     * 轮询获取最新一条记录
     * @returns 如果没有最新数据则返回 undefined
     */
    public async poll() {
        if ((await this.cursorNullPoint()) && !(await this.readAhead())) {
            return undefined;
        }
        return this.sortQueue[this.cursor++];
    }

    /**
     * 游标到空指针
     */
    private async cursorNullPoint() {
        return this.cursor >= this.sortQueue.length;
    }

    /**
     * 取得A头
     */
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

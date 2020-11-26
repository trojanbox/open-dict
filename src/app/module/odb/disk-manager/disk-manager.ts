import * as fs from "fs";
import { promisify } from "util";
import { FileOptions } from "./file-options";

export type FileReaderItemCallable = (
    item: Record,
    counter: number,
    group: number
) => {};

export type Record = { keyword: string; content: string };

export type ItemExtInf = {};

export type ItemRaw = { type: Symbol; decode: Record; raw: Buffer };

export const ItemType = {
    SEGMENT: Symbol("ITEM_SEGMENT"),
    FRAGMENT: Symbol("ITEM_FRAGMENT"),
};

/**
 * 文件操作
 */
export abstract class File {

    /**
     * 文件操作描述
     */
    protected options: FileOptions;

    /**
     * 操作句柄
     */
    protected handler: number = 0;

    constructor(options: FileOptions = undefined) {
        this.options = options ?? { mode: "r" };
    }

    /**
     * 获取文件描述符
     */
    public async getFd(): Promise<number> {
        return this.handler;
    }

    /**
     * 打开一个文件
     * @param path
     */
    public async open(path: string) {
        this.handler = await promisify(fs.open)(path, this.options.mode);
        return this;
    }

    /**
     * 绑定文件描述符
     * @param fd
     */
    public async bindFd(fd: number) {
        this.handler = fd;
        return this;
    }

    /**
     * 关闭文件
     */
    public async close() {
        await promisify(fs.close)(this.handler);
        return false;
    }
}

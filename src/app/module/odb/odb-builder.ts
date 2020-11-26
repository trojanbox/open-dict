import { ResourceReader } from "./disk-manager/reader";
import { Writer } from "./disk-manager/writer";
import { QuickSort } from "./structure/quick-sort.struct";
import { Record } from "./disk-manager/disk-manager";
import { join } from "path";
import { LoserTree } from "./structure/loser-tree";
import { OdbFileSystem } from "./odb-file-system";
import { ReaderQueueService } from "./service/reader-queue.service";

export class OdbBuilder<T extends Record> extends OdbFileSystem {
    /**
     * 临时目录
     */
    protected tmpDir: string = (() => process.env.TEMP)();

    /**
     * 输入文件地址
     */
    protected inputFile: string = "";

    /**
     * 输出文件地址
     */
    protected outputFile: string = "";

    /**
     * 带合并文件列表
     */
    protected mergeFileList: Array<string> = [];

    /**
     * 设置源文件
     * @param resource
     */
    public setInputFile(resource: string) {
        this.inputFile = resource;
        return this;
    }

    /**
     * 设置输出文件
     * @param resource
     */
    public setOutputFile(resource: string) {
        this.outputFile = resource;
        return this;
    }

    /**
     * 切割文件到临时目录
     * @description 将源文件按照指定大小切割成数个小文件，并临时存储在临时目录中，等待进一步处理，
     * 这些被切割的文件在生成小文件之前，会对小文件先进行双指针快排，以确保数据都是有序排序的
     */
    protected async split() {
        const reader = new ResourceReader({ mode: "r" });
        await reader.open(this.inputFile);
        await reader.getItemList(async (list) => {
            const sort = new QuickSort<Record>((a, b) => a.keyword < b.keyword).sort(list);
            let fileFullName = join(this.tmpDir, Math.random() * 1e20 + ".odb.tmp");
            let writer = new Writer({ mode: "w" });
            this.mergeFileList.push(fileFullName);
            await writer.open(fileFullName);
            for (const item of sort) {
                await writer.writeLnLazy(JSON.stringify(item));
            }
            await writer.done();
        }, 10000);
        return this;
    }

    /**
     * 磁盘文件合并
     * @description 对分割的小文件进行合并，合并主要使用败者树完成，具体流程是
     * 1. ReaderQueueService 用于构建至少 5 个通道用于进行败者树排序
     * 2. LoserTree 用于绑定多个 ReaderQueueService 服务来按需读取数据
     */
    protected async merge() {
        let totalReaders: ReaderQueueService[] = [];
        for (let i in this.mergeFileList) {
            if (this.mergeFileList.hasOwnProperty(i)) {
                totalReaders.push(await new ReaderQueueService({ mode: "r+" }).open(this.mergeFileList[i]));
            }
        }
        let writer = new Writer({ mode: "w" });
        await writer.open(this.outputFile);
        let lt = await new LoserTree<Record>((a, b) => a.keyword > b.keyword);
        await lt.bindDataSource(totalReaders);
        await lt.transferItem(async (item: T) => await this.itemHandler(item));
        await this.indexedAdapter.done();
        await writer.done();
        return this;
    }

    /**
     * 记录处理函数
     * @param item
     */
    protected async itemHandler(item: T) {
        await this.dataDepositoryAdapter.writeString(item.content);
        let address: number = this.dataDepositoryAdapter.getLastRecordCursor();
        await this.indexedAdapter.addRecord(item.keyword, address);
    }

    /**
     * 构建
     */
    public async build() {
        await this.split();
        await this.merge();
        return this;
    }

    protected pack() {
    }
}

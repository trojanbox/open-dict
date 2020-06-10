import { SpaceManager } from "../disk-manager/space-manager";
import { DataRecord } from "./data-record";
import * as zlib from "zlib";
import { FileOperationInterface } from "../disk-manager/file-operation.interface";
import { DataDepositoryAdapterInterface } from "../data-depository-adapter.interface";
import { OdbBuilder } from "../odb-builder";
import { Record } from "../disk-manager/disk-manager";
import { OdbFileSystem } from "../odb-file-system";
import { Writer } from "../disk-manager/writer";

export class DataDepositoryManager<T extends Record> extends SpaceManager
  implements DataDepositoryAdapterInterface {
  private builder: OdbFileSystem;

  protected readCursor: number = 0;

  protected lastRecordLength: number = 0;

  protected fileOperationHandler: FileOperationInterface;

  protected writer: Writer;

  constructor() {
    super();
    this.writer = new Writer({ mode: "w" });
    this.writer.open("D:\\test\\data.odb.res");
  }

  public setBuilder<T extends Record>(builder: OdbBuilder<T>) {
    this.builder = builder;
    return this;
  }

  /**
   * 设置文件操作句柄
   * @param fileOperationHandler
   */
  public async setFileOperationHandler(
    fileOperationHandler: FileOperationInterface
  ) {
    this.fileOperationHandler = fileOperationHandler;
    return this;
  }

  /**
   * 添加字符串
   * 格式为数据长度 + 实际内容，数据定位通过 Page 中的块记录 + 块内偏移记录来定位
   * 数据长度固定 4 字节，后面的数据最多可追加 512M
   * @param content
   */
  public async writeString(content: string) {
    const dataRecord = new DataRecord();
    const result = await dataRecord.writeString(content);
    this.lastRecordLength = dataRecord.getByteLength();
    this.appendByteLength(dataRecord.getByteLength());
    this.appendSize(1);
    this.writer.write(result);
    return result;
  }

  /**
   * 取得最后一条记录的起始偏移量
   */
  public getLastRecordCursor(): number {
    return this.getByteLength() - this.lastRecordLength;
  }

  /**
   * 设置游标
   * @param cursor 游标
   */
  public async setCursor(cursor: number = 0) {
    this.readCursor = cursor;
    return this;
  }

  /**
   * 将当前游标向指定方向移动 n 位
   * @param cursor 游标
   */
  public async moveCursor(cursor: number = 0) {
    this.readCursor += cursor;
    return this;
  }

  /**
   * 读取一条记录
   * @param buffer
   * @param offset
   */
  public async readString(buffer: Buffer, offset = 0) {
    let zlibBuffer = zlib.inflateSync(
      buffer.slice(4, buffer.readUInt32BE(0) + 4)
    );
    this.moveCursor(buffer.byteLength);
    return zlibBuffer;
  }
}

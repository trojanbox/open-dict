import * as fs from 'fs';
import {promisify} from "util";
import * as zlib from 'zlib';

export class Writer {

  private bufferLength: number = 4;

  /**
   * 初始化写入器
   * @param bufferLength 缓冲区长度
   */
  constructor(bufferLength: number = 1 << 8) {
    this.bufferLength = bufferLength;
  }

  public async open() {

    let openP = promisify(fs.open);
    let readP = promisify(fs.read);
    let writeP = promisify(fs.write);
    let existsP = promisify(fs.exists);

    let path: string = 'D:\\test\\test.txt';
    let fileExist: boolean = await existsP(path);
    if (fileExist) {
      console.log('文件存在.');
    }

    let fd = await openP(path, 'ax+');
    let buffer: Buffer = Buffer.alloc(this.bufferLength, 0, 'binary');

    buffer.write("中文试试");
    buffer = zlib.deflateRawSync(buffer);

    let result = await writeP(fd, buffer.toString('binary'), 0, 'binary');

    fs.closeSync(fd);
  }

}

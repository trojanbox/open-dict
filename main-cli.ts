import * as zlib from "zlib";
import {promisify} from "util";
import {cursorTo} from "readline";

async function main() {

  let diskAddress: string[] = [];
  let endCursor = 255 + 255‬;

  console.log(endCursor);

  let dataBlock = 0;
  let cursor = endCursor;
  do {
    if (cursor < 256) {
      let str = '0x';
      for (let i = 0; i < dataBlock; i++) str += 'FF';
      str = str + (endCursor % 256).toString('16').toUpperCase().padStart(2, '0');
      console.log('Resource Address: ', endCursor);
      console.log('Data Address:', str);
      break;
    }
    dataBlock++;
    cursor = Math.ceil(cursor / 256);
    diskAddress.unshift(cursor.toString('16'));
  } while (true);

  console.log(diskAddress);1

  process.exit();

  //
  // let endCursor = 255 + 255‬;
  //
  // console.log(endCursor);
  //
  // let dataBlock = 0;
  // let cursor = endCursor;
  // do {
  //   if (cursor < 256) {
  //     let str = '0x';
  //     for (let i = 0; i < dataBlock; i++) str += 'FF';
  //     str = str + (endCursor % 256).toString('16').toUpperCase().padStart(2, '0');
  //     console.log('Resource Address: ', endCursor);
  //     console.log('Data Address:', str);
  //     break;
  //   }
  //   dataBlock++;
  //   cursor = Math.ceil(cursor / 256);
  // } while (true);
  //
  // process.exit();
  //
  // // 关键字二进制文件
  // let addrOffset = 32;
  // let content = Buffer.from(addrOffset.toString('16'));
  // let bufferAlloc = Buffer.alloc(1);
  // bufferAlloc.writeInt8(content.byteLength, 0);
  //
  // console.log(Buffer.concat([bufferAlloc, content]));
}

main().then(() => {});

/**
 * Don't delete
 */
// async function main2() {
//
//   console.log('start...');
//
//   let fileList: Array<string> = [];
//
//   // 文件拆分
//   const reader = new Reader({mode: 'r'});
//   await reader.open('D:\\test\\dict-source.txt');
//   await reader.getItemList(async list => {
//     let sort = qsort<Item>(list, (a, b) => a.keyword < b.keyword);
//     let fileName = Math.random() * 1e20;
//     let fileFullName = 'D:\\test\\temp\\' + fileName + '.tmp';
//     let writer = new Writer({mode: 'w'});
//
//     fileList.push(fileFullName);
//     await writer.open(fileFullName);
//     for (const item of sort) {
//       await writer.writeLnLazy(JSON.stringify(item));
//     }
//     await writer.done();
//   }, 10000);
//
//   // 配置多个需要归并的文件地址
//   let totalReaders: QueueReader[] = [];
//   for (let i in fileList) if (fileList.hasOwnProperty(i)) {
//     totalReaders.push(await new QueueReader({mode: 'r+'}).open(fileList[i]));
//   }
//
//   // 磁盘多路归并
//   let fileName = 'merge_file';
//   let writer = new Writer({mode: 'w'});
//   await writer.open('D:\\test\\temp\\' + fileName + '.tmp');
//   let lt = await new LoserTree<Item>((a, b) => parseInt(a.keyword) > parseInt(b.keyword));
//   await lt.bindDataSource(totalReaders);
//   await lt.getItem(async item => await writer.writeLnLazy(JSON.stringify(item)));
//   await writer.done();
// }
//
// main2().then(() => {
// })

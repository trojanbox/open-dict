import {Reader} from "./src/app/module/reader";
import {qsort} from "./src/app/module/qsort";
import {Writer} from "./src/app/module/writer";
import {Item} from "./src/app/module/file";
import {LoserTree} from "./src/app/module/loser-tree";
import {QueueReader} from "./src/app/module/queue-reader";

async function main() {

  console.log('start...');

  let fileList: Array<string> = [];

  // 文件拆分
  const reader = new Reader({mode: 'r'});
  await reader.open('D:\\test\\dict-source.txt');
  await reader.getItemList(async list => {
    let sort = qsort<Item>(list, (a, b) => a.keyword < b.keyword);
    let fileName = Math.random() * 1e20;
    let fileFullName = 'D:\\test\\temp\\' + fileName + '.tmp';
    let writer = new Writer({mode: 'w'});

    fileList.push(fileFullName);
    await writer.open(fileFullName);
    for (const item of sort) {
      await writer.writeLnLazy(JSON.stringify(item));
    }
    await writer.done();
  }, 10000);

  // 配置多个需要归并的文件地址
  let totalReaders: QueueReader[] = [];
  for (let i in fileList) if (fileList.hasOwnProperty(i)) {
    totalReaders.push(await new QueueReader({mode: 'r+'}).open(fileList[i]));
  }

  // 磁盘多路归并
  let fileName = 'merge_file';
  let writer = new Writer({mode: 'w'});
  await writer.open('D:\\test\\temp\\' + fileName + '.tmp');
  let lt = await new LoserTree<Item>((a, b) => parseInt(a.keyword) > parseInt(b.keyword));
  await lt.bindDataSource(totalReaders);
  await lt.getItem(async item => await writer.writeLnLazy(JSON.stringify(item)));
  await writer.done();
}

main().then(() => {
})

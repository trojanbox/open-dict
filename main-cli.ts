import { OdbBuilder } from "./src/app/module/odb/odb-builder";
import { Writer } from "./src/app/module/odb/disk-manager/writer";
import { IndexedManager } from "./src/app/module/odb/indexed/indexed-manager";
import { DataDepositoryManager } from "./src/app/module/odb/data-depository/data-depository-manager";
import { PageManager } from "./src/app/module/odb/indexed/page-manager";

async function main() {

  try {
    const odbBuilder = new OdbBuilder();
    await odbBuilder
      .setWriterAdapter(new Writer())
      .setDataDepositoryAdapter(new DataDepositoryManager())
      .setIndexedAdapter(new IndexedManager().setPageManager(new PageManager()))
      // .setMediaAdapter(adapter)
      .setInputFile("D:\\test\\dict-source.txt")
      .setOutputFile("D:\\test\\output.dat")
      .build();
  } catch (e) {
    console.log(e);
  }
  return null;
}

main().then(() => {});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { OdbBuilder } from "../app/module/odb/odb-builder";
import { Writer } from "../app/module/odb/disk-manager/writer";
import { DataDepositoryManager } from "../app/module/odb/data-depository/data-depository-manager";

describe("Test", () => {
  it("should render title in a h1 tag", async(async () => {
    const odbBuilder = new OdbBuilder();
    await odbBuilder
      .setWriterAdapter(new Writer())
      .setDataDepositoryAdapter(new DataDepositoryManager())
      .setOutputFile("D:\\test\\output.dat")
      .setResourceFile("D:\\test\\dict-source.txt")
      .build();
  }));
});

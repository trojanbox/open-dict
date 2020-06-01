import { OdbAdapterInterface } from "./odb-adapter.interface";

export interface DataDepositoryAdapterInterface extends OdbAdapterInterface {
  setCursor(cursor: number);
  writeString(content: string);
  getLastRecordCursor(): number;
}

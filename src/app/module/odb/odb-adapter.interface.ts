import { OdbBuilder } from "./odb-builder";
import { Item } from "./disk-manager/disk-manager";
import { OdbFileSystem } from "./odb-file-system";

export interface OdbAdapterInterface {

  setBuilder(builder: OdbFileSystem);

}

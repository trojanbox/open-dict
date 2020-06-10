import { OdbBuilder } from "./odb-builder";
import { Record } from "./disk-manager/disk-manager";
import { OdbFileSystem } from "./odb-file-system";

export interface OdbAdapterInterface {

  setBuilder(builder: OdbFileSystem);

}

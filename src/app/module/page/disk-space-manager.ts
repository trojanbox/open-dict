export class DiskSpaceManager {

  protected size: number = 0;

  protected byteLength: number = 0;

  public appendSize(size: number = 1) {
    this.size += size;
    return this;
  }

  public appendByteLength(byteLength: number = 0) {
    this.byteLength += byteLength;
    return this;
  }

  public getSize() {
    return this.size;
  }

  public getByteLength() {
    return this.byteLength;
  }


}

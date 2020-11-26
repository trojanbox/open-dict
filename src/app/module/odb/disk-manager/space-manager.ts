export class SpaceManager {
    protected size: number = 0;

    protected byteLength: number = 0;

    /**
     * 追加空间长度
     * @param size 空间长度
     */
    public appendSize(size: number = 1) {
        this.size += size;
        return this;
    }

    /**
     * 追加字节长度
     * @param byteLength
     */
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

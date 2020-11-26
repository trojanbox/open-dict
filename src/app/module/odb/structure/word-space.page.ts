export class WordSpacePage {

    protected blockLength: number = 0;

    protected spaceLength: number = 0;

    protected contentLength: number = 0;

    constructor(content: string) {
        let bufferContent: Buffer = Buffer.from(content);
        this.contentLength = bufferContent.byteLength;
        this.blockLength = Math.floor(this.contentLength / (0xFF * 4));
        this.spaceLength = this.contentLength;
    }

}

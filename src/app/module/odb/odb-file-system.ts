import { IndexedAdapterInterface } from "./indexed-adapter.interface";
import { DataDepositoryAdapterInterface } from "./data-depository-adapter.interface";
import { MediaAdapterInterface } from "./media-adapter.interface";
import { WriterAdapterInterface } from "./disk-manager/writer-adapter.interface";
import { ReaderAdapterInterface } from "./disk-manager/reader-adapter.interface";

export class OdbFileSystem {

    /** 写适配器 */
    protected writerAdapter: WriterAdapterInterface;

    /** 读适配器 */
    protected readerAdapter: ReaderAdapterInterface;

    /** 索引适配器 */
    protected indexedAdapter: IndexedAdapterInterface;

    /** 数据仓库适配器 */
    protected dataDepositoryAdapter: DataDepositoryAdapterInterface;

    /** 媒体适配器 */
    protected mediaAdapter: MediaAdapterInterface;

    /**
     * 设置索引适配器
     * @param adapter
     */
    public setIndexedAdapter(adapter: IndexedAdapterInterface) {
        this.indexedAdapter = adapter;
        this.dataDepositoryAdapter.setBuilder(this);
        return this;
    }

    /**
     * 获取索引适配器
     */
    public getIndexedAdapter() {
        return this.indexedAdapter;
    }

    /**
     * 设置数据仓库适配器
     * @param adapter
     */
    public setDataDepositoryAdapter(adapter: DataDepositoryAdapterInterface) {
        this.dataDepositoryAdapter = adapter;
        this.dataDepositoryAdapter.setBuilder(this);
        return this;
    }

    /**
     * 获取数据仓库适配器
     */
    public getDataDepositoryAdapter() {
        return this.dataDepositoryAdapter;
    }

    /**
     * 设置媒体适配器
     * @param adapter
     */
    public setMediaAdapter(adapter: MediaAdapterInterface) {
        this.mediaAdapter = adapter;
        return this;
    }

    /**
     * 获取媒体适配器
     */
    public getMediaAdapter() {
        return this.mediaAdapter;
    }

    /**
     * 设置读适配器
     * @param adapter
     */
    public setReaderAdapter(adapter: ReaderAdapterInterface) {
        this.readerAdapter = adapter;
        return this;
    }

    /**
     * 获取读适配器
     */
    public getReaderAdapter() {
        return this.readerAdapter;
    }

    /**
     * 设置写适配器
     * @param adapter
     */
    public setWriterAdapter(adapter: WriterAdapterInterface) {
        this.writerAdapter = adapter;
        return this;
    }

    /**
     * 获取写适配器
     */
    public getWriterAdapter() {
        return this.writerAdapter;
    }

}

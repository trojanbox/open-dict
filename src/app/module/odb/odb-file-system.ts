import { IndexedAdapterInterface } from "./indexed-adapter.interface";
import { DataDepositoryAdapterInterface } from "./data-depository-adapter.interface";
import { MediaAdapterInterface } from "./media-adapter.interface";
import { WriterAdapterInterface } from "./disk-manager/writer-adapter.interface";
import { ReaderAdapterInterface } from "./disk-manager/reader-adapter.interface";

export class OdbFileSystem {

  protected writerAdapter: WriterAdapterInterface;

  protected readerAdapter: ReaderAdapterInterface;

  protected indexedAdapter: IndexedAdapterInterface;

  protected dataDepositoryAdapter: DataDepositoryAdapterInterface;

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

  public getWriterAdapter() {
    return this.writerAdapter;
  }

}

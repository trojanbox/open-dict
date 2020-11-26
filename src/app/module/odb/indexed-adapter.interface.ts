export interface IndexedAdapterInterface {

    /**
     * 添加记录
     * @param keyword
     * @param address
     */
    addRecord(keyword: string, address: number);

    /**
     * 完成
     */
    done();
}

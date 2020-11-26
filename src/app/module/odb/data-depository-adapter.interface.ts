import { OdbAdapterInterface } from "./odb-adapter.interface";

export interface DataDepositoryAdapterInterface extends OdbAdapterInterface {

    /**
     * 设置游标地址
     * @param cursor
     */
    setCursor(cursor: number);

    /**
     * 写入数据
     * @param content
     */
    writeString(content: string);

    /**
     * 获取最后记录游标地址
     */
    getLastRecordCursor(): number;
}

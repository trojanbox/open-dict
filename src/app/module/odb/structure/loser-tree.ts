import { QueueInterface } from "./queue.interface";

/**
 * 败者树比较器
 */
export type LoserTreeComparator<T> = (a: T, b: T) => boolean;

/**
 * 败者树
 */
export class LoserTree<T extends Object | number> {

    /**
     * 队列服务数组
     */
    private queue: Array<QueueInterface> = [];

    private tree: number[] = null;

    private size: number = 0;

    private leaves: Array<T> = null;

    private static MIN_KEY: number = -1;

    private winner: number = LoserTree.MIN_KEY;

    /**
     * 败者树比较器
     */
    private readonly comparator: LoserTreeComparator<T>;

    /**
     * 初始化败者树
     * @param callable 设置比较器
     */
    constructor(callable: LoserTreeComparator<T> = (a, b) => a < b) {
        this.comparator = callable;
    }

    /**
     * 绑定数据源
     * @param queue 配置队列数据，允许败者树通过 poll 等方法获取最新数据
     */
    async bindDataSource(queue: Array<QueueInterface>) {
        this.queue = queue;
        let initValues: Array<T> = [];
        for (let i = 0; i < this.queue.length; i++) {
            initValues.push(await this.queue[i].poll());
        }

        this.leaves = initValues;
        this.size = initValues.length;
        this.tree = new Array(this.size);

        for (let i: number = 0; i < this.size; i++) {
            this.tree[i] = LoserTree.MIN_KEY;
        }
        for (let i: number = this.size - 1; i >= 0; i--) {
            await this.adjust(i);
        }

        return this;
    }

    /**
     * 对数据的结构进行调整
     * @param currentCursor
     */
    private async adjust(currentCursor: number) {
        let fatherCursor: number = Math.floor((currentCursor + this.size) / 2);
        while (fatherCursor > 0) {
            if (
                currentCursor >= 0 &&
                (this.tree[fatherCursor] === LoserTree.MIN_KEY ||
                    this.comparator(
                        this.leaves[currentCursor],
                        this.leaves[this.tree[fatherCursor]]
                    ))
            ) {
                let temp: number = currentCursor;
                currentCursor = this.tree[fatherCursor];
                this.tree[fatherCursor] = temp;
            }
            fatherCursor = Math.floor(fatherCursor / 2);
        }
        this.tree[0] = currentCursor;
    }

    /**
     * 添加
     * @param leaf
     * @param s
     */
    public async add(leaf: T, s: number) {
        this.leaves[s] = leaf;
        await this.adjust(s);
    }

    /**
     * 删除
     * @param s
     */
    public async del(s: number) {
        this.leaves.splice(s, 1);
        this.queue.splice(s, 1);
        this.size--;
        this.tree = new Array(this.size);
        for (let i: number = 0; i < this.size; i++) {
            this.tree[i] = LoserTree.MIN_KEY;
        }

        for (let i: number = this.size - 1; i >= 0; i--) {
            await this.adjust(i);
        }
    }

    /**
     * 获得叶子节点
     * @param s
     */
    public async getLeaf(s: number): Promise<T> {
        return this.leaves[s];
    }

    /**
     * 获得胜者
     */
    public getWinner(): number {
        this.winner = this.tree.length > 0 ? this.tree[0] : undefined;
        return this.winner;
    }

    /**
     * 下一次
     */
    public async next() {
        if (this.winner === LoserTree.MIN_KEY) {
            return this.getWinner();
        } else {
            let data: T = await this.queue[this.winner].poll();
            if (data === undefined) {
                await this.del(this.winner);
            } else {
                await this.add(data, this.winner);
            }
            return this.getWinner();
        }
    }

    /**
     * 调用数据，可以交由第三方实现其他功能，每排序一条记录均会调用一次
     * @param callable
     */
    public async transferItem(callable: (info: T) => void): Promise<LoserTree<T>> {
        while (true) {
            let node = await this.getLeaf(await this.next());
            if (node === undefined) return this;
            await callable(node);
        }
    }

    /**
     * 调用数据，可以交由第三方实现其他功能，是 transferItem 方法升级版，可以指定处理多少次数据后集中调用
     * @param callable
     * @param limit
     */
    public async transferItemList(
        callable: (list: Array<T>) => void,
        limit = 1000
    ): Promise<LoserTree<T>> {
        let list: Array<T> = [];
        let offset: number = 1;
        while (true) {
            let node = await this.getLeaf(await this.next());
            if (node === undefined) {
                await callable(list);
                return this;
            }
            list.push(node);
            if (offset >= limit) {
                await callable(list);
                list = [];
                offset = 1;
            }
            offset++;
        }
    }
}

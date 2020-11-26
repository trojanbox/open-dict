export type SortBasis<T> = T extends Array<infer E> ? E : any;

export type QuickSortComparator<T> = (a: T, b: T) => boolean;

export class QuickSort<T> {
    private readonly comparator: QuickSortComparator<T>;

    constructor(callable: QuickSortComparator<T> = (a, b) => a < b) {
        this.comparator = callable;
    }

    public sort(
        arr,
        leftPoint: number = undefined,
        rightPoint: number = undefined
    ) {
        let len = arr.length,
            partitionIndex,
            left = typeof leftPoint !== "number" ? 0 : leftPoint,
            right = typeof rightPoint !== "number" ? len - 1 : rightPoint;

        if (left < right) {
            partitionIndex = this.partition(arr, left, right);
            this.sort(arr, left, partitionIndex - 1);
            this.sort(arr, partitionIndex + 1, right);
        }

        return arr;
    }

    protected partition(
        arr: T[],
        left: number = undefined,
        right: number = undefined
    ) {
        let pivot = left,
            index = pivot + 1;
        for (let i = index; i <= right; i++) {
            if (this.comparator(arr[i], arr[pivot])) {
                this.swap(arr, i, index);
                index++;
            }
        }
        this.swap(arr, pivot, index - 1);
        return index - 1;
    }

    protected swap<T>(arr: T[], i: number = undefined, j: number = undefined) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

export type SortBasis<T> = T extends Array<infer E> ? E : any;

export function qsort<T>(arr: T[], basis: (a: T, b: T) => {}, leftPoint: number = undefined, rightPoint: number = undefined) {

  let len = arr.length, partitionIndex,
    left = typeof leftPoint !== 'number' ? 0 : leftPoint,
    right = typeof rightPoint !== 'number' ? len - 1 : rightPoint;

  if (left < right) {
    partitionIndex = partition(arr, basis, left, right);
    qsort(arr, basis, left, partitionIndex - 1);
    qsort(arr, basis, partitionIndex + 1, right);
  }

  return arr;
}

function partition<T>(arr: T[], basis: (a: T, b: T) => {}, left: number = undefined, right: number = undefined) {
  let pivot = left, index = pivot + 1;
  for (let i = index; i <= right; i++) {
    if (basis(arr[i], arr[pivot])) {
      swap(arr, i, index);
      index++;
    }
  }
  swap(arr, pivot, index - 1);
  return index - 1;
}

function swap<T>(arr: T[], i: number = undefined, j: number = undefined) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

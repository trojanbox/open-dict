class BPTreeNode {
    n: number = 0;
    h: number = 4;
    key: number[] = [];
    c: BPTreeNode[] = [];
    k: any[] = [];
    leaf: boolean = false;
}

type BTree = {
    root: BPTreeNode
};

let t: number = 3

let BPTreeCreate = function (T: BTree) {
    let x = new BPTreeNode()
    x.leaf = true
    T.root = x
    return T
}


let BPTreeSplitChild = function (x: BPTreeNode, i: number) {
    let rightNode = new BPTreeNode()
    let leftNode = x.c[i]
    rightNode.leaf = leftNode.leaf
    rightNode.n = t - 1

    rightNode.key = leftNode.key.slice(0, t - 1)
    leftNode.key = leftNode.key.slice(t - 1, leftNode.key.length)
    if (!leftNode.leaf) {
        for (let j = 0; j < t; j++) {
            rightNode.c[i] = leftNode.c[j + t]
        }
    }
    leftNode.n = t - 1
    for (let j = x.n + 1; j > i + 1; j--) {
        x.key[j + 1] = x.key[j]
    }
    x.c.splice(i, 0, rightNode)
    for (let j = x.n; j > i; j--) {
        x.key[j + 1] = x.key[i]
    }
    x.key[i] = leftNode.key[0]
    leftNode.key.shift()
    x.n = x.n + 1
    return false
}

let BPTreeInsert = function (T: BTree, k) {
    let r = T.root
    if (r.n == 2 * t - 1) {
        let s = new BPTreeNode()
        T.root = s
        s.leaf = false
        s.n = 0
        s.c[0] = r
        BPTreeSplitChild(s, 0)
        BPTreeInsertNonFull(s, k)
    } else {
        BPTreeInsertNonFull(r, k)
    }
}

let BPTreeInsertNonFull = function (x: BPTreeNode, k) {
    let i = x.n
    if (x.leaf) {
        let insert = false
        for (let i2 = 0; i2 < x.n; i2++) if (k <= x.key[i2]) {
            x.key.splice(i2, 0, k)
            insert = true
            break
        }
        if (!insert) x.key.push(k)
        x.n = x.n + 1
    } else {
        i = 0;
        for (let i3 = 0; i3 <= x.key.length; i3++) {
            if (k >= x.key[i3]) {
                i = i3 + 1;
                break;
            }
        }
        if (x.c[i].n == 2 * t - 1) {
            BPTreeSplitChild(x, i)
            if (k > x.key[i]) {
                i = i + 1
            }
        }
        BPTreeInsertNonFull(x.c[i], k)
    }
}

let BTreeObject: BTree = {root: null}
BPTreeCreate(BTreeObject)
for (let i = 0; i <= 10; i++) {
    BPTreeInsert(BTreeObject, i)
}

console.log(BTreeObject)
var BPTreeNode = /** @class */ (function () {
    function BPTreeNode() {
        this.n = 0;
        this.h = 4;
        this.key = [];
        this.c = [];
        this.k = [];
        this.leaf = false;
    }
    return BPTreeNode;
}());
var t = 3;
var BPTreeCreate = function (T) {
    var x = new BPTreeNode();
    x.leaf = true;
    T.root = x;
    return T;
};
var BPTreeSplitChild = function (x, i) {
    var rightNode = new BPTreeNode();
    var leftNode = x.c[i];
    rightNode.leaf = leftNode.leaf;
    rightNode.n = t - 1;
    rightNode.key = leftNode.key.slice(0, t - 1);
    leftNode.key = leftNode.key.slice(t - 1, leftNode.key.length);
    if (!leftNode.leaf) {
        for (var j = 0; j < t; j++) {
            rightNode.c[i] = leftNode.c[j + t];
        }
    }
    leftNode.n = t - 1;
    for (var j = x.n + 1; j > i + 1; j--) {
        x.key[j + 1] = x.key[j];
    }
    x.c.splice(i, 0, rightNode);
    for (var j = x.n; j > i; j--) {
        x.key[j + 1] = x.key[i];
    }
    x.key[i] = leftNode.key[0];
    leftNode.key.shift();
    x.n = x.n + 1;
    return false;
};
var BPTreeInsert = function (T, k) {
    var r = T.root;
    if (r.n == 2 * t - 1) {
        var s = new BPTreeNode();
        T.root = s;
        s.leaf = false;
        s.n = 0;
        s.c[0] = r;
        BPTreeSplitChild(s, 0);
        BPTreeInsertNonFull(s, k);
    }
    else {
        BPTreeInsertNonFull(r, k);
    }
};
var BPTreeInsertNonFull = function (x, k) {
    var i = x.n;
    if (x.leaf) {
        var insert = false;
        for (var i2 = 0; i2 < x.n; i2++)
            if (k <= x.key[i2]) {
                x.key.splice(i2, 0, k);
                insert = true;
                break;
            }
        if (!insert)
            x.key.push(k);
        x.n = x.n + 1;
    }
    else {
        i = 0;
        for (var i3 = 0; i3 <= x.key.length; i3++) {
            if (k >= x.key[i3]) {
                i = i3 + 1;
                break;
            }
        }
        if (x.c[i].n == 2 * t - 1) {
            BPTreeSplitChild(x, i);
            if (k > x.key[i]) {
                i = i + 1;
            }
        }
        BPTreeInsertNonFull(x.c[i], k);
    }
};
var BTreeObject = { root: null };
BPTreeCreate(BTreeObject);
for (var i = 0; i <= 10; i++) {
    BPTreeInsert(BTreeObject, i);
}
console.log(BTreeObject);

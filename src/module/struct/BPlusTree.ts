// type FilePage = {
//     block: number
// };
//
// let treeExtPack = new WeakMap()
//
// ///////////////////////////

type Key = number;

type TreeNode = {
    number: number,
    key: Key[],
    container: TreeNode[],
    leaf: boolean
}

type TreeRoot = { root: TreeNode };

let volume: number = 1000;

export let create = function (): TreeRoot {
    return {root: createNode()} as TreeRoot;
}

let createNode = function (): TreeNode {
    return {
        number: 0,
        key: [],
        container: [],
        leaf: true
    }
}

export let insert = function (treeRoot: TreeRoot, key: Key) {
    let root = treeRoot.root;
    if (root.number == 2 * volume - 1) {
        let node = createNode();
        treeRoot.root = node;
        node.leaf = false;
        node.number = 0;
        node.container[0] = root;
        split(node, 0);
        insertNotFull(node, key)
    } else {
        insertNotFull(root, key)
    }
}

let insertNotFull = function (target: TreeNode, key: Key) {
    if (target.leaf) {
        let insert = false;
        for (let i2 = 0; i2 < target.number; i2++) if (key <= target.key[i2]) {
            target.key.splice(i2, 0, key);
            insert = true;
            break;
        }
        if (!insert) target.key.push(key);
        target.number = target.number + 1;
    } else {
        let cursor = target.key.length;
        for (let i = target.key.length; i >= 0; i--) {
            if (key >= target.key[i]) {
                cursor = i + 1;
                break;
            }
        }
        if (target.container[cursor].number == 2 * volume - 1) {
            split(target, cursor);
            if (key > target.key[cursor]) {
                cursor = cursor + 1;
            }
        }
        insertNotFull(target.container[cursor], key);
    }
}

let split = function (target: TreeNode, i: number) {
    let rn = createNode();
    let ln = target.container[i];
    rn.leaf = ln.leaf;
    rn.number = volume - 1;

    rn.key = ln.key.slice(0, volume - 1);
    ln.key = ln.key.slice(volume - 1, ln.key.length);
    if (!ln.leaf) {
        rn.container = ln.container.slice(0, volume);
        ln.container = ln.container.slice(volume, ln.container.length);
    }
    ln.number = volume - 1;
    for (let j = target.number + 1; j > i + 1; j--) {
        target.key[j + 1] = target.key[j];
    }
    target.container.splice(i, 0, rn);
    for (let j = target.number; j > i; j--) {
        target.key[j + 1] = target.key[i];
    }
    target.key[i] = ln.key[0];
    ln.key.shift();
    target.number = target.number + 1;
    return false;
}

export let search = function<T extends Object>(node: T extends TreeRoot ? TreeRoot : TreeNode, key: Key) {
    let root = node as TreeRoot ? (node as TreeRoot).root : node;
    let cursor = 0;
    while (cursor < root.number && key > root.key[cursor]) {
        cursor++;
    }
    if (cursor <= root.number && key == root.key[cursor]) {
        return root;
    } else if (root.leaf) {
        return undefined;
    } else {
        return search<TreeNode>(root.container[cursor], key);
    }
}

let tree = create();
for (let i = 0; i <= 18000; i++) {
    insert(tree, i);
}
console.log(tree);
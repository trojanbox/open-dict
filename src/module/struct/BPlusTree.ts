// type FilePage = {
//     block: number
// };
//
//
// ///////////////////////////

// Tree Config

type TreeConfig = { blockCursor: 0 };

// Tree Package

type TreeExt = any;

let createPackage = function (): TreeExt {
    return {};
}

// B Tree

type DataPackage = { indexed: number };

type TreeNode = {
    size: number,
    data: DataPackage[],
    children: TreeNode[],
    leaf: boolean,
    config: TreeConfig,
    pack: TreeExt
}

type TreeRoot = { root: TreeNode };

let volume: number = 3;

let create = function (): TreeRoot {
    return {root: createNode({ blockCursor: 0 } as TreeConfig) } as TreeRoot;
}

let createNode = function (config: TreeConfig, ext?: TreeExt): TreeNode {
    let node = {
        size: 0,
        data: [],
        children: [],
        leaf: true,
        config: config,
        pack: { ...ext, block: config.blockCursor }
    }
    config.blockCursor++;
    return node;
}

let insertRaw = function (treeRoot: TreeRoot, key: DataPackage) {
    let root = treeRoot.root;
    if (root.size == 2 * volume - 1) {
        let node = createNode(root.config);
        treeRoot.root = node;
        node.leaf = false;
        node.size = 0;
        node.children[0] = root;
        split(node, 0);
        insertNotFull(node, key);
    } else {
        insertNotFull(root, key);
    }
}

let insertNotFull = function (target: TreeNode, key: DataPackage) {
    if (target.leaf) {
        let insert = false;
        for (let i = 0; i < target.size; i++) if (key.indexed <= target.data[i].indexed) {
            target.data.splice(i, 0, key);
            insert = true;
            break;
        }
        if (!insert) target.data.push(key);
        target.size = target.size + 1;
    } else {
        let cursor = target.data.length;
        for (let i = target.data.length; i >= 0; i--) {
            if (target.data[i] && key.indexed >= target.data[i].indexed) {
                cursor = i + 1;
                break;
            }
        }
        if (target.children[cursor].size == 2 * volume - 1) {
            split(target, cursor);
            if (key.indexed > target.data[cursor].indexed) {
                cursor = cursor + 1;
            }
        }
        insertNotFull(target.children[cursor], key);
    }
}

let split = function (target: TreeNode, i: number) {
    let rn = createNode(target.config);
    let ln = target.children[i];
    rn.leaf = ln.leaf;
    rn.size = volume - 1;

    rn.data = ln.data.slice(0, volume - 1);
    ln.data = ln.data.slice(volume - 1, ln.data.length);
    if (!ln.leaf) {
        rn.children = ln.children.slice(0, volume);
        ln.children = ln.children.slice(volume, ln.children.length);
    }
    ln.size = volume - 1;
    for (let j = target.size + 1; j > i + 1; j--) {
        target.data[j + 1] = target.data[j];
    }
    target.children.splice(i, 0, rn);
    for (let j = target.size; j > i; j--) {
        target.data[j + 1] = target.data[i];
    }
    target.data[i] = ln.data[0];
    ln.data.shift();
    target.size = target.size + 1;
    return false;
}

let search = function<T>(node: any, key: DataPackage) {
    let root = (node as TreeRoot).root ? (node as TreeRoot).root : node;
    let cursor = 0;
    while (cursor < root.size && key.indexed > root.data[cursor].indexed) {
        cursor++;
    }
    if (cursor <= root.size && key.indexed == root.data[cursor].indexed) {
        return root;
    } else if (root.leaf) {
        return undefined;
    } else {
        return search<TreeNode>(root.children[cursor], key);
    }
}

let tree = create();

let arr = [
    'apple',
    'bee',
    '亚洲',
    '非洲'
];

arr.forEach((item) => {
    for (let point of item) {
        insertRaw(tree, { indexed: point.codePointAt(0) } as DataPackage);
    }
});

console.log(tree)
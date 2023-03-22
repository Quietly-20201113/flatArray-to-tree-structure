/**
 * 数组转树结构
 * @param {原始数据} data 
 * @param {父id的属性名} id 
 * @param {排序属性} sorting 
 * @returns [树结构]
 */
export function toTree(data, id, sorting) {
    let _data = JSON.parse(JSON.stringify(data));
    ///可指定pid字段名
    let pId = id || 'pId'
    // 空数组
    let result = [];
    // 判断不是数组  直接返回
    if (!Array.isArray(_data)) {
        return result
    }
    // 遍历  删除  children 属性  做初始化操作
    _data.forEach(item => {
        if (item?.children) delete item.children;

    });
    //  空对象
    let map = {};
    _data.forEach(item => {
        map[item.id] = item;
    });
    /**
     * map对象的 键: 是每个id  值：对应的item
     * 1: {id: 1, pId: 0, name: "body"}
     * 2: {id: 2, pId: 1, name: "title"}
     * 3: {id: 3, pId: 2, name: "div"}
     */
    _data.forEach(item => {
        // item.pid 为0时 返回underfined'
        item.key = item.id;
        item.text = item.text || item.name;
        let parent = map[item[pId]];
        item._level = reverseTree(map, item.id, pId).length - 1; //层级结构
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
            if (sorting) {
                parent.children.sort((a, b) => a[sorting] - b[sorting]);
            }
        } else {
            // 这里push的item是pid为0的数据
            result.push(item);
        }
    });
    return result;
}

const _levelFun = (map, item, pId, index = 0) => {
    const parent = map.find(c => c.id == item[pId]);
    if (parent) {
        _levelFun(map, parent, index + 1);
    }
    return index;
}

/**
 * 
 * @param {原始数据} originalData 
 * @param {关键字} keyword 
 * @param {搜索对应的属性名} label 
 * @summary 根据条件生成树结构[包含父节点以上递归与子节点以下递归]
 */
export function reverseData(originalData, keyword, label, pid) {
    let _list = _reverseData(toTree(originalData, pid), originalData, keyword, label, pid, false);

    return _list;
}

function _reverseData(treeData, originalData, keyword, label, pid, flag) {
    let _pId = pid || "pId"
    let _data = JSON.parse(JSON.stringify(treeData));
    let map = {};
    originalData.forEach(item => {
        map[item.id] = item;
    });
    ///获取匹配条件的id
    let ids = treeFindPath(_data, flag ? data => data[label] == keyword : data => data[label].indexOf(keyword) > -1);
    let _list = [];
    ids.forEach(item => {
        _list = [..._list, ...reverseTree(map, item, _pId)];
    });
    ///与id匹配的数据
    _list = Array.from(new Set(_list));
    if (flag) { return _list; }
    return toTree(_list, pid);
}

/**
 * 
 * @param {树结构数据} treeData 
 * @param {原始数据} originalData 
 * @param {选中id} keyword 
 * @param {对比属性名} label 
 * @param {父id属性名} pid 
 * @summary 选中逆推所有父节点id
 * @returns 
 */
export function reverseDataToIds(originalData, keyword, pid) {
    let _list = _reverseData(toTree(originalData), originalData, keyword, 'id', pid, true);
    return _list.map(item => item.id);
}

/**
 * 根据条件获取节点
 * @param {树节点数据} treeData 
 * @param {选中id} id 
 * @param {*自定义条件} func 
 * @summary 点击截取当前节点及以下节点树结构
 * @returns 
 */
export function followingNodes(treeData, id, _func) {
    let path = [];
    let func = _func || (data => data.id == id);
    path = treeFindPath(treeData, func, [], true);
    return path;
}


/**
 * 获取当前节点以下节点
 * @param {*元数据} originalData 
 * @param {* 选中节点id} id 
 * @summary 选中获取选中节点及其以下所有节点id；
 * @returns 
 */
export function followingNodeIds(originalData, id) {
    return translationToNodeId(followingNodes(toTree(originalData), id));
}


function translationToNodeId(data, list = []) {
    for (const item of data) {
        list.push(item.id);
        if (item.children) {
            translationToNodeId(item.children, list);
        }
    }
    return list;
}


/**
 * 逆推父节点
 * @param {数组对象} map 
 * @param {id} id 
 * @param {父id字段属性} pid 
 * @param {数组} path 
 * @returns 
 */
function reverseTree(map, id, pid, path = []) {
    let _json = map[id];
    if (_json != null && id != _json[pid]) {
        path.push(_json);
        reverseTree(map, _json[pid], pid, path)
    }
    return path;
}


/**
 * 获取匹配数据
 * @param {*树结构数据} tree 
 * @param {*判断方法} func 
 * @param {*内容数组} path 
 * @returns 
 */
function treeFindPath(tree, func, path = [], isData = false) {
    if (!tree) return []
    for (const data of tree) {
        if (func(data)) {
            if (isData) {
                path.push(data);
                break;
            } else {
                path.push(data.id);
            }
        }
        if (data.children) {
            treeFindPath(data.children, func, path, isData);
        }
    }
    return path
}

/**
 * 转换数据库与树结构字段名
 * @summary 元数据转换树结构
 */
export const loopTreeDate = (treeData) => {
    let list = [];
    for (let item of treeData) {
        item.key = item.id + '';
        item.text = item.name + '';
        if (item.children && item.children.length > 0) {
            item.children = loopTreeDate(item.children);
        }
        list.push(item)
    }
    return list
}


/**
 * 
 * @param {*函数} fn 
 * @param {*时间/千} wait 
 * @returns 
 */
export function throttle(fn, wait) {
    let pre = Date.now();
    return function () {
        let context = this;
        let args = arguments;
        let now = Date.now();
        if (now - pre >= wait) {
            fn.apply(context, args);
            pre = Date.now();
        }
    }
}


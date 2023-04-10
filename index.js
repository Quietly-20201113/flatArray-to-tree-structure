/**
 * 数组转树结构
 * @param {原始数据} data
 * @param {父id的属性名} id
 * @param {排序属性} sorting
 * @returns TreeArray
 */
export function toTree(data, id = "pId", sorting) {
    const map = {};
    const result = [];
  
    for (const item of data) {
      if (item?.children) delete item.children;
      map[item.id] = item;
      item.key = item.id;
      item.text = item.text || item.name;
      item.title = item.text || item.name;
      item._level =
        map[item[id]]?._level + 1 || reverseTree(map, item.id, id).length - 1;
      const parent = map[item[id]];
      parent
        ? (parent.children || (parent.children = [])).push(item)
        : result.push(item);
    }
  
    // Sort children of each parent node
    if (sorting) {
      for (const item of result) {
        if (item.children) {
          item.children.sort((a, b) => a[sorting] - b[sorting]);
        }
      }
    }
  
    return result;
  }
  
  /**
   * 逆推父节点
   * @param {数组对象} map
   * @param {id} id
   * @param {父id字段属性} pid
   * @param {数组} path
   * @returns Map
   */
  function reverseTree(map, id, pid, path = []) {
    const _json = map[id];
    if (_json != null && id !== _json[pid]) {
      path.push(_json);
      reverseTree(map, _json[pid], pid, path);
    }
    return path;
  }
  
  /**
   *
   * @param {原始数据} originalData
   * @param {关键字} keyword
   * @param {搜索对应的属性名} label
   * @summary 根据条件生成树结构[包含父节点以上递归]
   * @returns Map
   */
  export function reverseData(originalData, keyword, label, pid, flag = false) {
    const _pId = pid || "pId";
    const map = {};
    for (const item of originalData) {
      map[item.id] = item;
    }
    const ids = treeFindPath(
      toTree(originalData, pid),
      flag
        ? (data) => data[label] === keyword
        : (data) => data[label].includes(keyword)
    );
    const _list = [];
    for (const id of ids) {
      _list.push(...reverseTree(map, id, _pId));
    }
    return flag ? _list : toTree([...new Set(_list)], pid);
  }
  
  /**
   * 获取匹配数据
   * @param {*树结构数据} tree
   * @param {*判断方法} func
   * @param {*内容数组} path
   * @returns Map
   */
  function treeFindPath(tree, func, path = [], isData) {
    if (!tree) return [];
    for (const data of tree) {
      if (func(data)) {
        path.push(isData ? data : data.id);
      }
      if (data.children) {
        treeFindPath(data.children, func, path, isData);
      }
    }
    return path;
  }
  /**
   *
   * @param {树结构数据} treeData
   * @param {原始数据} originalData
   * @param {选中id} keyword
   * @param {对比属性名} label
   * @param {父id属性名} pid
   * @summary 选中逆推所有父节点id
   * @returns Array
   */
  export function reverseDataToIds(originalData, keyword, label, pid) {
    return Object.values(
      reverseData(originalData, keyword, label, pid, true)
    ).map((item) => item[label]);
  }
  
  /**
   * 根据条件获取节点
   * @param {树节点数据} treeData
   * @param {选中id} id
   * @param {*自定义条件} func
   * @summary 点击截取当前节点及以下节点树结构
   * @returns Map
   */
  export function followingNodes(treeData, id, _func) {
    let path = [];
    // 不是id的请自定义_func
    let func = _func || ((data) => data.id === id);
    path = treeFindPath(treeData, func, [], true);
    return path;
  }
  
  /**
   * 获取当前节点以下节点
   * @param {*元数据} originalData
   * @param {* 选中节点id} id
   * @param {* 自定义func} _func
   * @summary 选中获取选中节点及其以下所有节点；
   * @returns Map
   */
  export function followingNodeIds(treeData, id, _func) {
    let func = _func || ((data) => data.id === id);
    return treeFindPath(treeData, func, [], true);
  }
  
  /**
   * 获取当前节点以下节点
   * @param {*树结构数据} treeData
   * @param {* 选中节点id} id
   * * @param {* 自定义func} _func
   * @summary 选中获取选中节点及其以下所有节点id；
   * @returns Array
   */
  export function followingTreeNodeIds(treeData, id, _func) {
    let func = _func || ((data) => data.id === id);
    const path = treeFindPath(treeData, func, [], true);
    return path.flatMap((item) => translationToNodeId(item.children || []));
  }
  
  function translationToNodeId(data) {
    return data.flatMap((item) => [
      item.id,
      ...translationToNodeId(item.children || [])
    ]);
  }
  
  /**
   * 转换数据库与树结构字段名
   * @summary 元数据转换树结构
   * @returns Array
   */
  export const loopTreeDate = (
    treeData,
    map = {
      id: "key",
      name: "text"
    }
  ) => {
    const loop = (data) => {
      return data.map((item) => {
        const newItem = { ...item };
        Object.keys(map).forEach(
          (_item) => (newItem[map[_item]] = newItem[_item] + "")
        );
        if (newItem.children && newItem.children.length > 0) {
          newItem.children = loop(newItem.children);
        }
        return newItem;
      });
    };
    return loop(treeData);
  };
  
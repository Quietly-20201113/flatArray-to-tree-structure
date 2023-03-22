# flatArray-to-tree-structure
自己实践封装

# toTree

**数组转树结构**

> `data`: 扁平数组
>
> `id`: 父ID属性
>
> `sorting`: 排序字段
>
> 默认键: `id`

# reverseData

**根据条件生成树结构[包含父节点以上递归与子节点以下递归]**

> `originalData`: 原始数据
>
> `keyword`: 关键字
>
> `label`: 搜索对应的属性名

# reverseDataToIds

**选中逆推所有父节点id**

> `treeData`: 树结构数据
>
> `originalData`: 原始数据
>
> `keyword`: 选中id
>
> `label`: 对比属性名
>
> `pid`: 父id属性名,

# followingNodes

**点击截取当前节点及以下节点树结构**

> `treeData`: 树节点数据
>
> `id`: 选中id
>
> `func`: 自定义条件

# followingNodeIds

**选中获取选中节点及其以下所有节点id；**

> `originalData`: 元数据
>
> `id`: 选中节点id

# reverseTree

**逆推父节点**

> `map`: 数组对象
>
> `id`:id,
>
> `pid`: 父id字段属性
>
> `path`: 数组

# treeFindPath

**获取匹配数据**

> `tree`: 树结构数据
>
> `func`: 判断方法
>
> `path`:内容数组

# loopTreeDate

**转换数据库与树结构字段名**

**元数据转换树结构需要匹配字段**

> `treeData` 

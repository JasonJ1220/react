# immutable

> http://facebook.github.io/immutable-js/

一张图解释 Immutable 如何使用 Structural Sharing（结构共享，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享）来避免 deepCopy 把所有节点都复制一遍带来的性能损耗
![](https://i.imgur.com/HZe70cF.gif)

## 概述

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

### 优点

-   丰富的语法糖，有了 ImmutableJS，不会出现如下代码：

```
//为了在不污染原对象的前提下增加新的key
var state = Object.assign({}, state, {
	key: value
});

//为了在不污染原数组的前提下插入新元素
var state = [
	...state.slice(0, index),
	insertData,
	...state.slice(index + 1)
```

有时候，为了保证 reducer 在处理 state 的时候不会改变传入的 state，就要写大量的上述代码。
有了 ImmutableJS 之后：

```
var state = state.set('key', value);

var state = state.splice(index, 1, value);
```

-   性能的提升。

由于 immutable 内部使用了 Trie 数据结构来存储，只要两个对象的 hashCode 相等，值就是一样的。这样的算法避免了深度遍历比较，性能非常好。

-   Undo/Redo，Copy/Paste，甚至时间旅行这些功能变得简单

因为每次数据都是不一样的，只要把这些数据放到一个数组里储存起来，想回退到哪里就拿出对应数据即可，很容易开发出撤销重做这种功能。

-   并发安全

传统的并发非常难做，因为要处理各种数据不一致问题，因此『聪明人』发明了各种锁来解决。但使用了 Immutable 之后，数据天生是不可变的，并发锁就不需要了。（目前没用，JavaScript 是单线程运行的）

-   拥抱函数式编程

Immutable 本身就是函数式编程中的概念，纯函数式编程比面向对象更适用于前端开发。因为只要输入一致，输出必然一致，这样开发的组件更易于调试和组装。

### 缺点

-   容易与原生对象混淆

这点是我们使用 Immutable.js 过程中遇到最大的问题。写代码要做思维上的转变。

虽然 Immutable.js 尽量尝试把 API 设计的原生对象类似，有的时候还是很难区别到底是 Immutable 对象还是原生对象，容易混淆操作。

Immutable 中的 Map 和 List 虽对应原生 Object 和 Array，但操作非常不同，比如你要用 map.get('key')而不是 map.key，array.get(0) 而不是 array[0]。另外 Immutable 每次修改都会返回新对象，也很容易忘记赋值。

当使用外部库的时候，一般需要使用原生对象，也很容易忘记转换。

例如：

```
// Immutable
const map = Map({ a: 1, b: 2 });
const list = List([1,2,3]);

// 原生js
const obj = { a: 1, b: 2 };
const array = [1,2,3];

// 取值方式对比
console.log(map.get('a'));
console.log(list.get(0));
console.log(obj.a);
console.log(array[0]);
```

- 增加了资源文件大小
- 需要学习新的 API

## 更多认识和思考
### 与 Object.freeze、const 区别
Object.freeze 和 ES6 中新加入的 const 都可以达到防止对象被篡改的功能，但它们是 shallowCopy 的。对象层级一深就要特殊处理了。

### Cursor
Cursor 和数据库中的游标是完全不同的概念。

由于 Immutable 数据一般嵌套非常深，为了便于访问深层数据，Cursor 提供了可以直接访问这个深层数据的引用。

```
import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';

let data = Immutable.fromJS({ a: { b: { c: 1 } } });
// 让 cursor 指向 { c: 1 }
let cursor = Cursor.from(data, ['a', 'b'], newData => {
  // 当 cursor 或其子 cursor 执行 update 时调用
  console.log(newData);
});

cursor.get('c'); // 1
cursor = cursor.update('c', x => x + 1);
cursor.get('c'); // 2
```
### 在react中的应用
熟悉 React 的都知道，使用 shouldComponentUpdate() 防止重复渲染，但它默认返回 true，即始终会执行 render() 方法，然后做 Virtual DOM 比较，并得出是否需要做真实 DOM 更新，这里往往会带来很多无必要的渲染并成为性能瓶颈。

当然也可以在 shouldComponentUpdate() 中使用使用 deepCopy 和 deepCompare 来避免无必要的 render()，但 deepCopy 和 deepCompare 一般都是非常耗性能的。

Immutable 则提供了简洁高效的判断数据是否变化的方法，只需 === 和 is 比较就能知道是否需要执行 render()，而这个操作几乎 0 成本，所以可以极大提高性能。(React 中规定 state 和 props 只能是一个普通对象)
```
import { is } from 'immutable';

shouldComponentUpdate: (nextProps = {}, nextState = {}) => {
  const thisProps = this.props || {}, thisState = this.state || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
    return true;
  }

  for (const key in nextProps) {
    if (!is(thisProps[key], nextProps[key])) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
      return true;
    }
  }
  return false;
}
```

### setState 的一个技巧
React 建议把 this.state 当作 Immutable 的，因此修改前需要做一个 deepCopy，显得麻烦：
```
import '_' from 'lodash';

const Component = React.createClass({
  getInitialState() {
    return {
      data: { times: 0 }
    }
  },
  handleAdd() {
    let data = _.cloneDeep(this.state.data);
    data.times = data.times + 1;
    this.setState({ data: data });
    // 如果上面不做 cloneDeep，下面打印的结果会是已经加 1 后的值。
    console.log(this.state.data.times);
  }
}
```
使用 Immutable 后：
```
  getInitialState() {
    return {
      data: Map({ times: 0 })
    }
  },
  handleAdd() {
    this.setState({ data: this.state.data.update('times', v => v + 1) });
    // 这时的 times 并不会改变
    console.log(this.state.data.get('times'));
  }
```



## 数据类型

-   **List: 有序索引集，类似 JavaScript 中的 Array。**
-   **Map: 无序索引集，类似 JavaScript 中的 Object。**
-   OrderedMap: 有序的 Map，根据数据的 set()进行排序。
-   Set: 没有重复值的集合。
-   OrderedSet: 有序的 Set，根据数据的 add 进行排序。
-   Stack: 有序集合，支持使用 unshift()和 shift()添加和删除。
-   Record: 一个用于生成 Record 实例的类。类似于 JavaScript 的 Object，但是只接收特定字符串为 key，具有默认值。
-   Seq: 序列，但是可能不能由具体的数据结构支持。
-   Collection: 是构建所有数据结构的基类，不可以直接构建。

## 常用 API

-   fromJS()

作用：将一个 js 数据转换为 Immutable 类型的数据
用法：

    fromJS(value, converter)

简介：value 是要转变的数据，converter 是要做的操作。第二个参数可不填，默认情况会将数组准换为 List 类型，将对象转换为 Map 类型，其余不做操作

代码实现：

```
const obj = Immutable.fromJS({a:'123',b:'234'} (key, value, path) => {
        // 定制转换方式，下这种就是将Array转换为List，Object转换为Map
        console.log(key, value, path)
        return isIndexed(value) ? value.toList() : value.toOrderedMap())
    });
```

-   toJS()

作用：将一个 Immutable 数据转换为 JS 类型的数据
用法：

    value.toJS()

-   is()

作用：对两个对象进行比较
用法：

    is(map1,map2)

简介：和 js 中对象的比较不同，在 js 中比较两个对象比较的是地址，但是在 Immutable 中比较的是这个对象 hashCode 和 valueOf，只要两个对象的 hashCode 相等，值就是相同的，避免了深度遍历，提高了性能

代码实现：

```
import { Map, is } from 'immutable'
const map1 = Map({ a: 1, b: 1, c: 1 })
const map2 = Map({ a: 1, b: 1, c: 1 })
map1 === map2   //false
Object.is(map1, map2) // false
is(map1, map2) // true
```

-   List()和 Map()

作用：用来创建一个新的 List/Map 对象
用法:

```
//List
Immutable.List(); // 空List
Immutable.List([1, 2]);

//Map
Immutable.Map(); // 空Map
Immutable.Map({ a: '1', b: '2' });
```

-   List.isList()和 Map.isMap()

作用：判断一个数据结构是不是 List/Map 类型
用法：

```
List.isList([]); // false
List.isList(List()); // true

Map.isMap({}) // false
Map.isMap(Map()) // true
```

-   size

作用：属性，获取 List/Map 的长度，等同于 ImmutableData.count();

-   get()和 getIn()

作用：获取数据结构中的数据

```
//获取List索引的元素
ImmutableData.get(0);

// 获取Map对应key的value
ImmutableData.get('a');

// 获取嵌套数组中的数据
ImmutableData.getIn([1, 2]);

// 获取嵌套map的数据
ImmutableData.getIn(['a', 'b']);
```

-   has()和 hasIn()

作用：判断是否存在某一个 key
用法：

```
Immutable.fromJS([1,2,3,{a:4,b:5}]).has('0'); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).hasIn([3,'b']) //true
```

-   includes()

作用：判断是否存在某一个 value
用法：

```
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes(2); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes('2'); //false 不包含字符2
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes(5); //false
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes({a:4,b:5}) //false
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes(Immutable.fromJS({a:4,b:5})) //true
```

-   first()和 last()

作用：用来获取第一个元素或者最后一个元素，若没有则返回 undefined
代码：

```
Immutable.fromJS([1,2,3,{a:4,b:5}]).first()//1
Immutable.fromJS([1,2,3,{a:4,b:5}]).last()//{a:4,b:5}

Immutable.fromJS({a:1,b:2,c:{d:3,e:4}}).first() //1
Immutable.fromJS({a:1,b:2,c:{d:3,e:4}}).first() //{d:3,e:4}
```

数据修改
注：这里对于数据的修改，是对原数据进行操作后的值赋值给一个新的数据，并不会对原数据进行修改，因为 Immutable 是不可变的数据类型。

-   set()

作用：设置第一层 key、index 的值
用法：

```
const originalList = List([ 0 ]);
// List [ 0 ]
originalList.set(1, 1);
// List [ 0, 1 ]
originalList.set(0, 'overwritten');
// List [ "overwritten" ]
originalList.set(2, 2);
// List [ 0, undefined, 2 ]

List().set(50000, 'value').size;
// 50001

const originalMap = Map()
const newerMap = originalMap.set('key', 'value')
const newestMap = newerMap.set('key', 'newer value')

originalMap
// Map {}
newerMap
// Map { "key": "value" }
newestMap
// Map { "key": "newer value" }
```

List 在使用的时候，将 index 为 number 值设置为 value。Map 在使用的时候，将 key 的值设置为 value。
在 List 中使用时，若传入的 number 为负数，则将 index 为 size+index 的值设置为 value，例，若传入-1，则将 size-1 的值设为 value。若传入的 number 的值超过了 List 的长度，则将 List 自动补全为传入的 number 的值，将 number 设置为 value，其余用 undefined 补全。注：跟 js 中不同，List 中不存在空位，[,,,],List 中若没有值，则为 undefined。

-   setIn()

作用：设置深层结构中某属性的值
用法：

```
const originalMap = Map({
  subObject: Map({
    subKey: 'subvalue',
    subSubObject: Map({
      subSubKey: 'subSubValue'
    })
  })
})

const newMap = originalMap.setIn(['subObject', 'subKey'], 'ha ha!')
// Map {
//   "subObject": Map {
//     "subKey": "ha ha!",
//     "subSubObject": Map { "subSubKey": "subSubValue" }
//   }
// }

const newerMap = originalMap.setIn(
  ['subObject', 'subSubObject', 'subSubKey'],
  'ha ha ha!'
)
// Map {
//   "subObject": Map {
//     "subKey": "subvalue",
//     "subSubObject": Map { "subSubKey": "ha ha ha!" }
//   }
// }
```

用法与 set()一样，只是第一个参数是一个数组，代表要设置的属性所在的位置

-   delete

作用：用来删除第一层结构中的属性
用法：

```
// List
List([ 0, 1, 2, 3, 4 ]).delete(0);
// List [ 1, 2, 3, 4 ]

// Map
const originalMap = Map({
  key: 'value',
  otherKey: 'other value'
})
// Map { "key": "value", "otherKey": "other value" }
originalMap.delete('otherKey')
// Map { "key": "value" }
```

-   deleteIn()

用来删除深层数据，用法参考 setIn

-   deleteAll() (Map 独有，List 没有)

作用：用来删除 Map 中的多个 key
用法：

    deleteAll(keys: Iterable<K>): this

代码示例：

```
const names = Map({ a: "Aaron", b: "Barry", c: "Connor" })
names.deleteAll([ 'a', 'c' ])
// Map { "b": "Barry" }
```

-   update()

作用：对对象中的某个属性进行更新，可对原数据进行相关操作
用法：

```
////List
const list = List([ 'a', 'b', 'c' ])
const result = list.update(2, val => val.toUpperCase())

///Map
const aMap = Map({ key: 'value' })
const newMap = aMap.update('key', value => value + value)
```

-   updateIn()

用法参考 setIn

-   clear()

作用：清除所有数据
用法：

    clear()

代码示例：

```
Map({ key: 'value' }).clear()  //Map
List([ 1, 2, 3, 4 ]).clear()   // List
List中的各种删除与插入
List对应的数据结构是js中的数组，所以数组的一些方法在Immutable中也是通用的，比如push，pop,shift，
unshift，insert。
```

-   push()

在 List 末尾插入一个元素,并返回新List

-   pop()

在 List 末尾删除一个元素,并返回新List

-   unshift

在 List 首部插入一个元素,并返回新List

-   shift

在 List 首部删除一个元素,并返回新List

-   insert

在 List 的 index 处插入元素,并返回新List

代码实现：

```
List([ 0, 1, 2, 3, 4 ]).insert(6, 5)
//List [ 0, 1, 2, 3, 4, 5 ]
List([ 1, 2, 3, 4 ]).push(5)
// List [ 1, 2, 3, 4, 5 ]
List([ 1, 2, 3, 4 ]).pop()
// List[ 1, 2, 3 ]
List([ 2, 3, 4]).unshift(1);
// List [ 1, 2, 3, 4 ]
List([ 0, 1, 2, 3, 4 ]).shift();
// List [ 1, 2, 3, 4 ]

List中还有一个特有的方法用法设置List的长度，setSize()
List([]).setSize(2).toJS() //[undefined,undefined]
```

-   merge

作用：浅合并，新数据与旧数据对比，旧数据中不存在的属性直接添加，就数据中已存在的属性用新数据中的覆盖

代码实现：
```
const { merge } = require('immutable')
const original = { x: 123, y: 456 }
merge(original, { y: 789, z: 'abc' }) // { x: 123, y: 789, z: 'abc' }
console.log(original) // { x: 123, y: 456 }
```

-   mergrWith

作用：自定义浅合并，可自行设置某些属性的值

代码实现：
```
const { mergeWith } = require('immutable')
const original = { x: 123, y: 456 }
mergeWith(
  (oldVal, newVal) => oldVal + newVal,
  original,
  { y: 789, z: 'abc' }
) // { x: 123, y: 1245, z: 'abc' }
console.log(original) // { x: 123, y: 456 }
```

-   mergeIn

作用：对深层数据进行浅合并

-   mergeDeep

作用：深合并，新旧数据中同时存在的的属性为新旧数据合并之后的数据

-   mergeDeepIn

作用：对深层数据进行深合并

-   mergrDeepWith

作用：自定义深合并，可自行设置某些属性的值
这里用一段示例彻底搞懂 merge，此示例为 Map 结构，List 与 Map 原理相同

```
 const Map1 = Immutable.fromJS({a:111,b:222,c:{d:333,e:444}});
 const Map2 = Immutable.fromJS({a:111,b:222,c:{e:444,f:555}});

 const Map3 = Map1.merge(Map2);
  //Map {a:111,b:222,c:{e:444,f:555}}
 const Map4 = Map1.mergeDeep(Map2);
  //Map {a:111,b:222,c:{d:333,e:444,f:555}}
 const Map5 = Map1.mergeWith((oldData,newData,key)=>{
      if(key === 'a'){
        return 666;
      }else{
        return newData
      }
    },Map2);
  //Map {a:666,b:222,c:{e:444,f:555}}
```

-   concat

作用：对象的拼接，用法与 js 数组中的 concat()相同，返回一个新的对象。
用法：

    const List = list1.concat(list2)

-   map

作用：遍历整个对象，对 Map/List 元素进行操作，返回一个新的对象。

用法：

```
Map({a:1,b:2}).map(val=>10*val)
//Map{a:10,b:20}
```

-   mapKey

作用：遍历整个对象，对 Map 元素的 key 进行操作，返回一个新的对象。
用法：

```
Map({a:1,b:2}).mapKey(val=>val+'l')
//Map{al:10,bl:20}
```

-   mapEntries

作用：遍历整个对象，对 Map 元素的 key 和 value 同时进行操作，返回一个新的对象。Map 的 map()也可实现此功能。
用法：

```
Map({a:1,b:2}).map((key,val)=>{
  return [key+'l',val*10]
})
//Map{al:10,bl:20}
```

-   filter

作用：返回一个新的对象，包括所有满足过滤条件的元素
用法：

```
Map({a:1,b:2}).filter((key,val)=>{
  return val == 2
})
//Map{b:2}
```

-   filterNot

作用： 与 filter 方法正好相反。

-   reverse

作用：将数据的结构进行反转

代码示例：

```
Immutable.fromJS([1, 2, 3, 4, 5]).reverse();
// List [5,4,3,2,1]
Immutable.fromJS({a:1,b:{c:2,d:3},e:4}).reverse();
// Map {e:4,b:{c:2,d:3},a:1}
```

-   sort 和 sortBy

作用：对数据结构进行排序
代码示例：

```
///List
Immutable.fromJS([4,3,5,2,6,1]).sort()
// List [1,2,3,4,5,6]
Immutable.fromJS([4,3,5,2,6,1]).sort((a,b)=>{
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }
})
// List [1,2,3,4,5,6]
Immutable.fromJS([{a:3},{a:2},{a:4},{a:1}]).sortBy((val,index,obj)=>{
  return val.get('a')
},(a,b)=>{
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }
})
//List  [ {a:3}, {a:2}, {a:4}, {a:1} ]

//Map

Immutable.fromJS( {b:1, a: 3, c: 2, d:5} ).sort()
//Map {b: 1, c: 2, a: 3, d: 5}
Immutable.fromJS( {b:1, a: 3, c: 2, d:5} ).sort((a,b)=>{
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }
})
//Map {b: 1, c: 2, a: 3, d: 5}
Immutable.fromJS( {b:1, a: 3, c: 2, d:5} ).sortBy((value, key, obj)=> {
  return value
})
//Map {b: 1, c: 2, a: 3, d: 5}
```

-   groupBy

作用：对数据进行分组

```
const listOfMaps = List([
  Map({ v: 0 }),
  Map({ v: 1 }),
  Map({ v: 1 }),
  Map({ v: 0 }),
  Map({ v: 2 })
])
const groupsOfMaps = listOfMaps.groupBy(x => x.get('v'))
// Map {
//   0: List [ Map{ "v": 0 }, Map { "v": 0 } ],
//   1: List [ Map{ "v": 1 }, Map { "v": 1 } ],
//   2: List [ Map{ "v": 2 } ],
// }
```

-   indexOf 和 lastIndexOf

作用：和 js 数组中的方法相同，查找第一个或者最后一个 value 的 index 值，找不到则返回-1
用法：

```
Immutable.fromJS([1,2,3,4]).indexof(3) //2
Immutable.fromJS([1,2,3,4]).lastIndexof(3) //2
```

-   findIndex 和 findLastIndex

作用：查找满足要求的元素的 index 值
用法：

```
Immutable.fromJS([1,2,3,4]).findIndex((value,index,array)=>{
  return value%2 === 0;
})   // 1
Immutable.fromJS([1,2,3,4]).findLastIndex((value,index,array)=>{
  return index%2 === 0;
})  // 3
```

-   find 和 findLast

作用：查找满足条件的元素的 value 值
用法：

```
Immutable.fromJS([1,2,3,4]).find((value,index,array)=>{
  return value%2 === 0;
})  // 2

Immutable.fromJS([1,2,3,4]).findLast((value,index,array)=>{
  return value%2 === 0;
})  // 4
```

-   findKey 和 findLastKey

作用：查找满足条件的元素的 key 值
用法：

```
Immutable.fromJS([1,2,3,4]).findKey((value,index,array)=>{
  return value%2 === 0;
})  // 1

Immutable.fromJS([1,2,3,4]).findLastKey((value,index,array)=>{
  return value%2 === 0;
})  // 3
```

-   findEntry 和 findLastEntry

作用：查找满足条件的元素的键值对 key:value
用法：

```
Immutable.fromJS([1,2,3,4]).findEntry((value,index,array)=>{
  return value%2 === 0;
})  // [1,2]

Immutable.fromJS([1,2,3,4]).findLastEntry((value,index,array)=>{
  return value%2 === 0;
})  // [3,4]
```

-   keyOf 和 lastKeyOf

作用：查找某一个 value 对应的 key 值
用法：

```
Immutable.fromJS([1,2,3,4]).keyOf(2) //1
Immutable.fromJS([1,2,3,4]).lastKeyOf(2) //1
```

-   max 和 maxBy

作用：查找最大值
用法:

```
Immutable.fromJS([1, 2, 3, 4]).max() //4

Immutable.fromJS([{a;1},{a:2},{a: 3},{a:4}]).maxBy((value,index,array)=>{
  return value.get('a')
})  //{a:4}
```

-   min 和 minBy

作用：查找最小值
用法: 同max

-   slice

作用： 和原生 js 中数组的 slice 数组一样，包含两个参数，start 和 end，start 代表开始截取的位置，end 代表结束的位置，不包括第 end 的元素。若不包括 end，则返回整个对象，若 end 为负数，则返回（start，length-end）对应的数据。若 start 只有一个并且为负数，则返回最后的 end 个元素。
用法：

```
Immutable.fromJS([1, 2, 3, 4]).slice(0); //[1,2,3,4]
Immutable.fromJS([1, 2, 3, 4]).slice(0,2); //[1,2]
Immutable.fromJS([1, 2, 3, 4]).slice(-2); //[3,4]
Immutable.fromJS([1, 2, 3, 4]).slice(0,-2); //[1,2]
```

-   rest

作用：返回除第一个元素之外的所有元素
用法:

```
Immutable.fromJS([1, 2, 3, 4]).rest()//[2,3,4]
```

-   butLast()

作用：返回除最后一个元素之外的所有元素
用法:

    Immutable.fromJS([1, 2, 3, 4]).rest()//[1,2,3]

-   skip

作用：有一个参数 n, 返回截掉前 n 个元素之后剩下的所有元素
用法:

    Immutable.fromJS([1, 2, 3, 4]).skip(1)//[2,3,4]\

-   skipLast

作用：有一个参数 n, 返回截掉最后 n 个元素之后剩下的所有元素
用法:

    Immutable.fromJS([1, 2, 3, 4]).skip(1)//[1,2,3]

-   skipWhile

作用：返回从第一次返回 false 之后的所有元素

```
Immutable.fromJS([1, 2, 3, 4]).skipWhile(list.skipWhile((value,index,list)=>{
  return value > 2;
}))// [1,2,3,4]
```

-   skipUntil

作用：返回从第一次返回 true 之后的所有元素

```
Immutable.fromJS([1, 2, 3, 4]).skipUntil(list.skipWhile((value,index,list)=>{
  return value > 2;
}))// [3,4]
```

-   take

作用：有一个参数 n, 返回前 n 个元素
用法：

    Immutable.fromJS([1, 2, 3, 4]).take(2)//[1,2]

-   takeLast

作用：有一个参数 n, 返回最后 n 个元素
用法：

    Immutable.fromJS([1, 2, 3, 4]).takeLast(2)//[3,4]

-   takeWhile

作用：返回从第一次返回 false 之前的所有元素

```
Immutable.fromJS([1, 2, 3, 4]).skipWhile(list.takeWhile((value,index,list)=>{
  return value > 2;
}))// []
```

-   takeUntil

作用：返回从第一次返回 true 之前的所有元素

```
Immutable.fromJS([1, 2, 3, 4]).skipUntil(list.takeUntil((value,index,list)=>{
  return value > 2;
}))// [1,2]
```

-   reduce

作用：和 js 中数组中的 reduce 相同,按索引升序的顺序处理元素
用法：

```
Immutable.fromJS([1,2,3,4]).reduce((pre,next,index,arr)=>{
  console.log(pre+next)
  return pre+next;
})
// 3 6 10
```

-   reduceRight

作用：和 js 中数组中的 reduceRight 相同,按索引降序的顺序处理元素
用法：

```
Immutable.fromJS([1,2,3,4]).reduceRight((pre,next,index,arr)=>{
  console.log(pre+next)
  return pre+next;
})
// 7 9 10
```

-   every

作用：判断整个对象总中所有的元素是不是都满足某一个条件，都满足返回 true，反之返回 false。
代码：

```
Immutable.fromJS([1,2,3,4]).every((value,index,arr)=>{
  return value > 2
}) // false
```

-   some

作用：判断整个对象总中所有的元素是不是存在满足某一个条件的元素，若存在返回 true，反之返回 false。
代码：

```
Immutable.fromJS([1,2,3,4]).some((value,index,arr)=>{
  return value > 2
}) // true
```

-   join

作用：同 js 中数组的 join 方法。数组转换为字符串
用法：

    Immutable.fromJS([1,2,3,4, {a: 123, b: 321}]).join(',') //1,2,3,4,Map { "a": 123, "b": 321 }

-   isEmpty()

作用：判断是否为空
用法:

```
Immutable.fromJS([]).isEmpty(); // true
Immutable.fromJS({}).isEmpty(); // true
```

-   count()

作用：返回元素个数，可自定义条件，返回满足条件的个数
用法：

```
const list = Immutable.fromJS([1,2,3,4]);
const map = Immutable.fromJS({a:1,b:2,c:3,d:4});

list.count((value,index,list)=>{
  return value > 2;
})    //2

map.count((value,index,list)=>{
  return value > 2;
})    //2
```

-   countBy()

作用：与 count 不同的是，countBy 返回一个对象
用法：

```
const list = Immutable.fromJS([1,2,3,4]);
const map = Immutable.fromJS({a:1,b:2,c:3,d:4});

list.countBy((value,index,list)=>{
  return value > 2;
} //{false: 2, true: 2}

map.countBy((value,index,list)=>{
  return value > 2;
} //{false: 2, true: 2}
```
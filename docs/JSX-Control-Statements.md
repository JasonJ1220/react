# JSX Control Statements
JSX-Control-Statements 为 JSX 增加了基本的结构控制语句，比如条件和循环控制语句。通过将插件将「组件风格」的控制语句最终转换为普通 JS 代码
例如：
```
<If condition={condition()}>Hello World!</If>
// 将会转换为
condition() ? 'Hello World!' : null
```

## 安装
```
npm install --save-dev babel-plugin-jsx-control-statements
// 配置 .babelrc　文件
{
  ...
  "plugins": ["jsx-control-statements"]
}

```

## 核心语法
### If
用来表示最简单的条件判断逻辑
```
// 简单示例
<If condition={ true }>
  <span>IfBlock</span>
</If>

// 包括多个子元素及表达式
<If condition={ true }>
  one { "two" }
  <span>three</span>
  <span>four</span>
</If>
```
if 的 body 部分只有在 condition 为 true 才会渲染
If 标签将会预编译为「三元表达式」
```
// 转换前
<If condition={ test }>
  <span>Truth</span>
</If>

// 转换后
{ test ? <span>Truth</span> : null }
```

### Choose
Choose 是比 If 更复杂分支结构写法
```
<Choose>
  <When condition={ test1 }>
    <span>IfBlock</span>
  </When>
  <When condition={ test2 }>
    <span>ElseIfBlock</span>
    <span>Another ElseIfBlock</span>
    <span>...</span>
  </When>
  <Otherwise>
    <span>ElseBlock</span>
  </Otherwise>
</Choose>

// default block is optional; minimal example:
<Choose>
  <When condition={true}>
    <span>IfBlock</span>
  </When>
</Choose>
```
Choose 的子元素只允许出现 When 和 Otherwise，其中最少需要有一个 When，而 Otherwise 是可选的
Choose 标签同样将会预编译为「三元表达式」
```
// 转换前
<Choose>
  <When condition={ test1 }>
    <span>IfBlock1</span>
  </When>
  <When condition={ test2 }>
    <span>IfBlock2</span>
  </When>
  <Otherwise>
    <span>ElseBlock</span>
  </Otherwise>
</Choose>

// 转换后
{ test1 ? <span>IfBlock1</span> : test2 ? <span>IfBlock2</span> : <span>ElseBlock</span> }
```

### For
For 的命名用方法，如下
```
// 注意，需要指定 key 属性
  <For each="item" of={ this.props.items }>
    <span key={ item.id }>{ item.title }</span>
  </For>

  <For each="item" index="idx" of={ [1,2,3] }>
    <span key={ idx }>{ item }</span>
    <span key={ idx + '_2' }>Static Text</span>
  </For>
```
注意，For 不能作为根元素
```
// 转换前
<For each="item" index="index" of={ items )}>
  <span key={ item.id }>{ index }. { item.title }</span>
</For>

// 转换前
{
  items.map( function(item, index) {
    <span key={ item.id }>{ index }. { item.title }</span>
  })
}
```

### With
用于将值赋给局部变量
```
// 简单用法
<With foo={ 47 } bar={ 'test' }>
  <span>{ foo }</span>
  <span>{ bar }</span>
</With>

// 嵌套使用
<With foo={ 47 }>
  <With bar={ 'test' }>
    <span>{ foo }</span>
    <span>{ bar }</span>
  </With>
</With>
```
注意，定义的「变量」仅在 With 块中可用。

`<With>` 将会转换为一个「匿名的立即执行函数」
```
// 转换前
<With foo={ 47 }>
  <span>{ foo }</span>
</With>


// 转换后
{
  (function(foo) {
    return <span>{ foo }</span>
  }).call(this, 47)
}
```



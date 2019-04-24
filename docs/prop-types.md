# prop-types
> https://github.com/facebook/prop-types

```
import React from 'react';
import PropTypes from 'prop-types';
 
class MyComponent extends React.Component {
  render() {
    // ... do things with the props
  }
}
 
MyComponent.PropTypes = {
  // 基本类型
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,
 
  // 任何可以渲染的东西：数字，字符串，元素或数组（或片段）。
  optionalNode: PropTypes.node,
 
  // React元素　(ie. `<MyComponent />`)
  optionalElement: PropTypes.element,

  // React 元素类型 (ie. MyComponent).
  optionalElementType: PropTypes.elementType,

  // 也可以声明prop是某个类的实例。 内部使用的是JS的instanceof运算符。.
  optionalMessage: PropTypes.instanceOf(Message),
 
  // 可以通过将它作为枚举来确保你的prop被限制到特定的值。
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),
 
  // 可以是多种类型之一的对象
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),
 
  // 某种类型的数组
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
 
  // 具有某种类型的属性值的对象
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),
 
  // 采取特定模型的对象
  optionalObjectWithShape: PropTypes.shape({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired
  }),
 
  // 对额外属性有警告的对象
  optionalObjectWithStrictShape: PropTypes.exact({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired
  }),
 
  // 你可以用`isRequired`来连接到上面的任何一个类型，以确保如果没有提供props的话会显示一个警告。
  requiredFunc: PropTypes.func.isRequired,
 
  // 任何数据类型
  requiredAny: PropTypes.any.isRequired,
 
  // 可以指定自定义类型检查器。
  // 如果检查失败，它应该返回一个Error对象。 不要`console.warn`或throw，因为这不会在`oneOfType`内工作。
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
 
  // 可以为`arrayOf`和`objectOf`提供自定义类型检查器。 如果检查失败，它应该返回一个Error对象。 
  // 检查器将为数组或对象中的每个键调用验证函数。 
  // 检查器有两个参数，第一个参数是数组或对象本身，第二个是当前项的键。
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

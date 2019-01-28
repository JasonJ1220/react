# React
> https://reactjs.org/

## MAIN CONCEPTS
### Hello World
```
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```
### JSX
React 使用 JSX 来替代常规的 JavaScript。(当遇到<，JSX就当HTML解析，遇到{就当JavaScript解析。)

JSX 是一个看起来很像 XML 的 JavaScript 语法扩展。

我们不需要一定使用 JSX，但它有以下优点：

- 防止注入攻击
- JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化。
- 它是类型安全的，在编译过程中就能发现错误。
- 使用 JSX 编写模板更加简单快速。


#### Embedding Expressions
```
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```
#### Specifying Attributes with JSX
```
const element = <img src={user.avatarUrl}></img>;
```

#### Specifying Children with JSX
```
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```
#### style
```
var myStyle = {
    fontSize: 100,
    color: '#FF0000'
};
ReactDOM.render(
    <h1 style={myStyle}>标题</h1>,
    document.getElementById('example')
);
```

#### comments
```
ReactDOM.render(
    <div>
    <h1>标题</h1>
    {/*注释...*/}
     </div>,
    document.getElementById('example')
);
```

#### HTML tag vs. React component
React 可以渲染 HTML 标签 (strings) 或 React 组件 (classes)。
要渲染 HTML 标签，只需在 JSX 里使用小写字母的标签名。
```
var myDivElement = <div className="foo" />;
ReactDOM.render(myDivElement, document.getElementById('example'));
```
要渲染 React 组件，只需创建一个大写字母开头的本地变量。
```
var MyComponent = React.createClass({/*...*/});
var myElement = <MyComponent someProperty={true} />;
ReactDOM.render(myElement, document.getElementById('example'));
```
React 的 JSX 使用大、小写的约定来区分本地组件的类和 HTML 标签。

### Rendering Elements
#### Rendering an Element into the DOM
HTML
```
<div id="root"></div>
```

JSX
```
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

#### Updating the Rendered Element
JSX
```
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```
React只会重新渲染必要更新的部分。


### Components
#### Function and Class Components
通过 function 定义组件:
```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
通过 ES6 class 定义组件:
```
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

#### Rendering a Component
```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

#### Composing Components

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

### Props
#### Props are Read-Only
state 和 props 主要的区别在于 props 是不可变的，而 state 可以根据与用户交互来改变。
这就是为什么有些容器组件需要定义 state 来更新和修改数据。 而子组件只能通过 props 来传递数据。
```
function HelloMessage(props) {
    return <h1>Hello {props.name}!</h1>;
}
 
const element = <HelloMessage name="Runoob"/>;
 
ReactDOM.render(
    element,
    document.getElementById('example')
);
```

#### default props
```
class HelloMessage extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
 
HelloMessage.defaultProps = {
  name: 'Runoob'
};
 
const element = <HelloMessage/>;
 
ReactDOM.render(
  element,
  document.getElementById('example')
);
```

### State
React 把组件看成是一个状态机（State Machines）。通过与用户的交互，实现不同状态，然后渲染 UI，让用户界面和数据保持一致。
React 里，只需更新组件的 state，然后根据新的 state 重新渲染用户界面（不要操作 DOM）。
以下实例创建一个名称扩展为 React.Component 的 ES6 类，在 render() 方法中使用 this.state 来修改当前的时间。
添加一个类构造函数来初始化状态 this.state，类组件应始终使用 props 调用基础构造函数。
```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }
 
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>现在是 {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
 
ReactDOM.render(
  <Clock />,
  document.getElementById('example')
);
```
### Lifecycle
组件的生命周期可分成三个状态：
- Mounting：已插入真实 DOM
- Updating：正在被重新渲染
- Unmounting：已移出真实 DOM

生命周期的方法有：
- componentWillMount 在渲染前调用,在客户端也在服务端。
- componentDidMount : 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问。 如果你想和其他JavaScript框架一起使用，可以在这个方法中调用setTimeout, setInterval或者发送AJAX请求等操作(防止异步操作阻塞UI)。
- componentWillReceiveProps 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
- shouldComponentUpdate 返回一个布尔值。在组件接收到新的props或者state时被调用。在初始化时或者使用forceUpdate时不被调用。 可以在你确认不需要更新组件时使用。
- componentWillUpdate在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用。
- componentDidUpdate 在组件完成更新后立即调用。在初始化时不会被调用。
- componentWillUnmount在组件从 DOM 中移除之前立刻被调用。

#### Using State Correctly
- Do Not Modify State Directly
```
// Wrong
this.state.comment = 'Hello';
// Correct
this.setState({comment: 'Hello'});
```

- State Updates May Be Asynchronous
```
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

#### State Updates are Merged
当你调用setState()方法时，React会合并你提供的对象。
```
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```
当然，你也可以分别调用：
```
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

### Handling Events
React 元素的事件处理和 DOM 元素类似。但是有一点语法上的不同:
- React 事件绑定属性的命名采用驼峰式写法，而不是小写。
- 如果采用 JSX 的语法你需要传入一个函数作为事件处理函数，而不是一个字符串(DOM 元素的写法)

HTML 通常写法：
```
<button onclick="activateLasers()">
  激活按钮
</button>
```

React写法：
```
<button onClick={activateLasers}>
  激活按钮
</button>
```
在 React 中另一个不同是你不能使用返回 false 的方式阻止默认行为， 你必须明确的使用 preventDefault。
例如，通常我们在 HTML 中阻止链接默认打开一个新页面，可以这样写：

HTML 通常写法：
```
<a href="#" onclick="console.log('点击链接'); return false">
  点我
</a>
```
React写法：
```
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('链接被点击');
  }
 
  return (
    <a href="#" onClick={handleClick}>
      点我
    </a>
  );
}
```

通过 onClick 事件来修改数据
```
class HelloMessage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value: 'Hello Runoob!'};
  }
  
  handleChange(event) {
    this.setState({value: 'test'})
  }
  render() {
    var value = this.state.value;
    return <div>
            <button onClick={this.handleChange.bind(this)}>click me!</button>
            <h4>{value}</h4>
           </div>;
  }
}
ReactDOM.render(
  <HelloMessage />,
  document.getElementById('example')
);
```

当需要从子组件中更新父组件的 state 时，需要在父组件通过创建事件句柄 (handleChange) ，并作为 prop (updateStateProp) 传递到你的子组件上。
```
class Content extends React.Component {
  render() {
    return (<div>
              <button onClick = {this.props.updateStateProp}>点我</button>
              <h4>{this.props.myDataProp}</h4>
           </div>)
  }
}

class HelloMessage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value: 'Hello Runoob!'};
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: 'test'})
  }

  render() {
    var value = this.state.value;
    return <div>
            <Content myDataProp = {value} 
              updateStateProp = {this.handleChange}></Content>
           </div>;
  }
}
ReactDOM.render(
  <HelloMessage />,
  document.getElementById('example')
);
```


**你必须谨慎对待 JSX 回调函数中的 this，类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this 的值会是 undefined。**

向事件处理程序传递参数：
```
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```
实例：
```
class Popper extends React.Component{
    constructor(){
        super();
        this.state = {name:'Hello world!'};
    }
    
    preventPop(name, e){    //事件对象e要放在最后
        e.preventDefault();
        alert(name);
    }
    
    render(){
        return (
            <div>
                <p>hello</p>
                {/* 通过 bind() 方法传递参数。 */}
                <a href="https://reactjs.org" onClick={this.preventPop.bind(this,this.state.name)}>Click</a>
            </div>
        );
    }
}
```

### Conditional Rendering

#### 条件渲染
在 React 中，你可以创建不同的组件来封装各种你需要的行为。然后还可以根据应用的状态变化只渲染其中的一部分。
使用 if 或条件运算符来创建表示当前状态的元素，然后让 React 根据它们来更新 UI。
```
function UserGreeting(props) {
  return <h1>欢迎回来!</h1>;
}

function GuestGreeting(props) {
  return <h1>请先注册。</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  else{
    return <GuestGreeting />;
  }
}
 
ReactDOM.render(
  // 尝试修改 isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('example')
);
```

#### 元素变量

你可以使用变量来储存元素。它可以帮助你有条件的渲染组件的一部分，而输出的其他部分不会更改。
```
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }
 
  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }
 
  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }
 
  render() {
    const isLoggedIn = this.state.isLoggedIn;
 
    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }
 
    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}
 
ReactDOM.render(
  <LoginControl />,
  document.getElementById('example')
);
```
#### 运算符
你可以通过用花括号包裹代码在 JSX 中嵌入任何表达式 ，也包括 JavaScript 的逻辑与 &&，它可以方便地条件渲染一个元素。
```
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length>0 &&
        <h2>
          您有 {unreadMessages.length} 条未读信息。
        </h2>
      }
    </div>
  );
}
 
const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('example')
);
```
#### 三目运算符
```
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

#### 阻止组件渲染
如果需要隐藏组件或者根据某些条件渲染组件，需要通过 return null 来阻止渲染。

```
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }
 
  return (
    <div className="warning">
      警告!
    </div>
  );
}
 
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true}
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }
 
  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }
 
  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? '隐藏' : '显示'}
        </button>
      </div>
    );
  }
}
 
ReactDOM.render(
  <Page />,
  document.getElementById('example')
);
```

### Lists and Keys
**元素的 key 在他的兄弟元素之间应该唯一**

Keys 可以在 DOM 中的某些元素被增加或删除的时候帮助 React 识别哪些元素发生了变化。因此你应当给数组中的每一个元素赋予一个确定的标识。

```
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
 
const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('example')
);
```

一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据的 id 作为元素的 key。
```
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

当元素没有确定的 id 时，你可以使用他的序列号索引 index 作为 key。
如果列表可以重新排序，我们不建议使用索引来进行排序，因为这会导致渲染变得很慢。
```
const todoItems = todos.map((todo, index) =>
  // 只有在没有确定的 id 时使用
  <li key={index}>
    {todo.text}
  </li>
);

```

元素的 key 只有在它和它的兄弟节点对比时才有意义。
比方说，如果你提取出一个 ListItem 组件，你应该把 key 保存在数组中的这个 ListItem 元素上，而不是放在 ListItem 组件中的 li 元素上。
```
function ListItem(props) {
  // 这里不需要指定key！！
  return <li>{props.value}</li>;
}
 
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // key应该在数组的上下文中被指定
    <ListItem key={number.toString()}
              value={number} />
 
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
 
const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('example')
);
```

### Forms
HTML 表单元素与 React 中的其他 DOM 元素有所不同,因为表单元素生来就保留一些内部状态。
在 HTML 当中，像 input, textarea, 和 select 这类表单元素会维持自身状态，并根据用户输入进行更新。但在React中，可变的状态通常保存在组件的状态属性中，并且只能用 setState() 方法进行更新。
#### 实例
1. 在实例中我们设置了输入框 input 值 value = {this.state.data}。在输入框值发生变化时我们可以更新 state。我们可以使用 onChange 事件来监听 input 的变化，并修改 state。
```
class HelloMessage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value: 'Hello Runoob!'};
      this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  render() {
    var value = this.state.value;
    return (<div>
                <input type="text" value={value} onChange={this.handleChange} /> 
                <h4>{value}</h4>
           </div>);
  }
}
ReactDOM.render(
  <HelloMessage />,
  document.getElementById('example')
);
```

1. 以下实例演示如何在子组件上使用表单。 onChange 方法将触发 state 的更新并将更新的值传递到子组件的输入框的 value 上来重新渲染界面。需要在父组件通过创建事件句柄 (handleChange) ，并作为 prop (updateStateProp) 传递到子组件上。
```
class Content extends React.Component {
  render() {
    return  (<div>
                <h4>{this.props.contentProp}</h4>
                <input type="text" value={this.props.contentProp} onChange={this.props.updateStateProp} />
            </div>);
  }
}
class Father extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value: 'Hello Runoob!'};
      this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  render() {
    var value = this.state.value;
    return <div>
            <Content contentProp = {value} 
              updateStateProp = {this.handleChange}></Content>
           </div>;
  }
}
ReactDOM.render(
  <Father />,
  document.getElementById('example')
);
```

#### Select Tag
在 React 中，不使用 selected 属性，而在根 select 标签上用 value 属性来表示选中项。
```
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};
 
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 
  handleChange(event) {
    this.setState({value: event.target.value});
  }
 
  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }
 
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          选择您最喜欢的网站
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="gg">Google</option>
            <option value="rn">Runoob</option>
            <option value="tb">Taobao</option>
            <option value="fb">Facebook</option>
          </select>
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
 
ReactDOM.render(
  <FlavorForm />,
  document.getElementById('example')
);
```
#### Textarea Tag
在React中 textarea 用 value 属性代替了它的子对象。如下：
```
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

```

#### 多个表单
当你有处理多个 input 元素时，你可以通过给每个元素添加一个 name 属性，来让处理函数根据 event.target.name 的值来选择做什么。
```
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };
 
    this.handleInputChange = this.handleInputChange.bind(this);
  }
 
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
 
    this.setState({
      [name]: value
    });
  }
 
  render() {
    return (
      <form>
        <label>
          是否离开:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          访客数:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```
#### 控制输入空值

```
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);
```

### 非受控组件
在大多数情况下，推荐使用 受控组件 来实现表单。 在受控组件中，表单数据由 React 组件处理。如果让表单数据由 DOM 处理时，替代方案为使用非受控组件。
要编写一个非受控组件，而非为每个状态更新编写事件处理程序，你可以 使用 ref 从 DOM 获取表单值。
```
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```
由于非受控组件将真实数据保存在 DOM 中，因此在使用非受控组件时，更容易同时集成 React 和非 React 代码。如果你想快速而随性，这样做可以减小代码量。否则，你应该使用受控组件。

#### 默认值
在 React 的生命周期中，表单元素上的 value 属性将会覆盖 DOM 中的值。使用非受控组件时，通常你希望 React 可以为其指定初始值，但不再控制后续更新。要解决这个问题，你可以指定一个 defaultValue 属性而不是 value。
```
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={(input) => this.input = input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```
#### file tag
在React中，<input type="file" /> 始终是一个不受控制的组件，因为它的值只能由用户设置，而不是以编程方式设置。
```
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${this.fileInput.files[0].name}`
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input
            type="file"
            ref={input => {
              this.fileInput = input;
            }}

          />

        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

ReactDOM.render(
  <FileInput />,
  document.getElementById('root')
);
```

### Refs
React 支持一种非常特殊的属性 Ref ，你可以用来绑定到 render() 输出的任何组件上。

这个特殊的属性允许你引用 render() 返回的相应的支撑实例（ backing instance ）。这样就可以确保在任何时间总是拿到正确的实例。
创建 Refs:
```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    //创建Ref
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```
什么时候适合用refs?
- 管理 focus ,文本选中 或者 media 回放。
- 触发动画。
- 整合 第三方DOM 组件。

ref的值取决于节点的类型:
- 当 ref 属性被用于一个普通的 HTML 元素时，React.createRef() 将接收底层 DOM 元素作为它的 current 属性以创建 ref 。
- 当 ref 属性被用于一个自定义类组件时，ref 对象将接收该组件已挂载的实例作为它的 current 。
- **你不能在函数式组件上使用 ref 属性，因为它们没有实例。**

为 DOM 元素添加 Ref:
React 会在组件加载时将 DOM 元素传入 `current` 属性，在卸载时则会改回 null。ref 的更新会发生在componentDidMount 或 componentDidUpdate 生命周期钩子之前。
```
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />

        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

#### 为类组件添加 Ref:
```
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```
#### Refs 与函数式组件:
你不能在函数式组件上使用 ref 属性，因为它们没有实例：
```
function MyFunctionalComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // 这将 *不会* 工作！
    return (
      <MyFunctionalComponent ref={this.textInput} />
    );
  }
}
```
#### 回调 Refs
React 也支持另一种设置 ref 的方式，称为“回调 ref”，更加细致地控制何时 ref 被设置和解除。

不同于传递 createRef() 创建的 ref 属性，你会传递一个函数。这个函数接受 React 组件的实例或 HTML DOM 元素作为参数，以存储它们并使它们能被其他地方访问。
```
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // 直接使用原生 API 使 text 输入框获得焦点
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // 渲染后文本框自动获得焦点
    this.focusTextInput();
  }

  render() {
    // 使用 `ref` 的回调将 text 输入框的 DOM 节点存储到 React
    // 实例上（比如 this.textInput）
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

### 高阶组件
高阶组件（HOC）是react中的高级技术，用来重用组件逻辑。但高阶组件本身并不是React API。它只是一种模式，这种模式是由react自身的组合性质必然产生的。

具体而言，**高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件**
```
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```
在React中，组件是代码复用的主要单元。然而你会发现，一些模式用传统的组件并不直白。
例如，假设你有一个CommentList组件，该组件从外部数据源订阅数据并渲染评论列表：
```
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```
然后，你又写了一个订阅单个博客文章的组件，该组件遵循类似的模式：
```
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```
CommentList 和 BlogPost 组件并不相同————他们调用了 DataSource 的不同方法，并且他们渲染的输出也不相同。但是，他们的大部分实现是一样的：
- 挂载组件时， 向 DataSource 添加一个改变监听器。
- 在监听器内， 每当数据源发生改变，调用setState。
- 卸载组件时， 移除改变监听器。

设想一下，在一个大型的应用中，这种从 DataSource 订阅数据并调用 setState 的模式将会一次又一次的发生。我**们就可以抽象出一个模式，该模式允许我们在一个地方定义逻辑并且许多组件都能共享，这就是高阶组件的精华所在**。

写一个函数，该函数能够创建类似 CommonList 和 BlogPost 从 DataSource 数据源订阅数据的组件 。该函数接受一个子组件作为其中的一个参数，并从数据源订阅数据作为props属性传入子组件。把这个函数取个名字 withSubscription：
```
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```
当 CommentListWithSubscription 和 BlogPostWithSubscription 渲染时, 会向CommentList 和 BlogPost 传递一个 data 属性，该 data属性的数据包含了从 DataSource 检索的最新数据：
```
// 函数接受一个组件参数……
function withSubscription(WrappedComponent, selectData) {
  // ……返回另一个新组件……
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ……注意订阅数据……
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ……使用最新的数据渲染组件
      // 注意此处将已有的props属性传递给原组件
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```
注意，高阶组件既不会修改输入组件，也不会使用继承复制它的行为。相反，高阶组件是将原组件通过 包裹（wrapping） 在容器组件里面的方式来 组合（composes）。**高阶组件就是一个没有副作用的纯函数。**

#### 通过组合的方式修改原始组件
在高阶组件内部，不要修改一个组件的原型（或以其它方式修改组件）。
```
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```
不应该修改原组件，高阶组件应该使用组合技术，将输入组件包裹到容器组件中：
```
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // 用容器组件组合包裹组件且不修改包裹组件，这才是正确的打开方式。
      return <WrappedComponent {...this.props} />;
    }
  }
}
```
#### 三大约定 
1. 约定：将不相关的props属性传递给包裹组件
高阶组件给组件添加新特性。他们不应该大幅修改原组件的接口和属性。预期，从高阶组件返回的组件应该与原包裹的组件具有类似的接口。
高阶组件应该传递与它要实现的功能点无关的props属性。大多数高阶组件都包含一个如下的render函数：
```
render() {
  // 过滤掉与高阶函数功能相关的props属性，
  // 不再传递
  const { extraProp, ...passThroughProps } = this.props;

  // 向包裹组件注入props属性，一般都是高阶组件的state状态
  // 或实例方法
  const injectedProp = someStateOrInstanceMethod;

  // 向包裹组件传递props属性
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

1. 约定：最大化使用组合
并不是所有的高阶组件看起来都是一样的。有时，它们仅仅接收一个参数，即包裹组件：
```
const NavbarWithRouter = withRouter(Navbar);
```
一般而言，高阶组件会接收额外的参数。在下面这个来自Relay的示例中，可配置对象用于指定组件的数据依赖关系：
```
const CommentWithRelay = Relay.createContainer(Comment, config);
```
大部分常见高阶组件的函数签名如下所示：
```
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(Comment);
```
分解connect函数：
```
// connect是一个返回函数的函数，称为高阶函数。
const enhance = connect(commentListSelector, commentListActions);
// 返回的函数就是一个高阶组件，该高阶组件返回一个与Redux store
// 关联起来的新组件
const ConnectedComment = enhance(CommentList);
```
换句话说，**connect 是一个返回高阶组件的高阶函数！**

1. 约定：包装显示名字以便于调试
为了便于调试，可以选择一个好的名字，确保能够识别出它是由高阶组件创建的新组件还是普通的组件。
最常用的技术就是将包裹组件的名字包装在显示名字中。所以，如果你的高阶组件名字是 withSubscription，且包裹组件的显示名字是 CommentList，那么就是用 WithSubscription(CommentList)这样的显示名字：
```
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

#### 约束
1. 不要在render函数中使用高阶组件

1. 必须将静态方法做拷贝
当使用高阶组件包装组件，原始组件被容器组件包裹，也就意味着新组件会丢失原始组件的所有静态方法。
```
// 定义静态方法
WrappedComponent.staticMethod = function() {/*...*/}
// 使用高阶组件
const EnhancedComponent = enhance(WrappedComponent);
// 增强型组件没有静态方法
typeof EnhancedComponent.staticMethod === 'undefined' // true
```
解决这个问题的方法就是，将原始组件的所有静态方法全部拷贝给新组件：
```
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // 必须得知道要拷贝的方法 :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

1. Refs属性不能传递
一般来说，高阶组件可以传递所有的props属性给包裹的组件，但是不能传递refs引用。因为并不是像key一样，refs是一个伪属性，React对它进行了特殊处理。如果你向一个由高阶组件创建的组件的元素添加ref应用，那么ref指向的是最外层容器组件实例的，而不是包裹组件。
如果你碰到了这样的问题，最理想的处理方案就是搞清楚如何避免使用 ref。有时候，没有看过React示例的新用户在某种场景下使用prop属性要好过使用ref。

### 传递Refs
高阶组件logProps 将props传递给子组件。
```
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
```
但是 ref 是无法传递的，因为ref不是prop。

```
import FancyButton from './FancyButton';

const ref = React.createRef();

// The FancyButton component we imported is the LogProps HOC.
// Even though the rendered output will be the same,
// Our ref will point to LogProps instead of the inner FancyButton component!
// This means we can't call e.g. ref.current.focus()
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
```

可以使用 React.forwardRef API：
```
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Note the second param "ref" provided by React.forwardRef.
  // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
  // And it can then be attached to the Component.
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```
如果我们不进行任何调整，下面的代码在调试工具中输出的组件名称为："ForwardRef(MyComonent)"：
```
const WrappedComponent = React.forwardRef(
  function myFunction(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }
);
```
可以通过displayName来设定想要现实的名字：
```
function logProps(Component) {
  class LogProps extends React.Component {
    // ...
  }

  //先定义返回的高阶组件方法
  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  //然后设定这个组件的名称
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `logProps(${name})`;

  //构建组件
  return React.forwardRef(forwardRef);
```

---
### Component API
#### 构造函数：constructor
组件的构造函数只能用于做以下两件事：
1. 初始化state（不要调用setState方法，不要给state赋值props的值）
1. 绑定事件
```
constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
  // Don't do this!
  //this.state = { color: props.color };
}
```

#### 组件插入dom: componentDidMount
在组件被挂载(插入到树中)之后立即调用。需要DOM节点的初始化应该到这里。
    componentDidMount()

#### 组件属性更新: componentDidUpdate
更新发生后立即调用。初始呈现不调用此方法。
```
componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

#### 组件注销：componentWillUnmount
不应在此调用 setState 方法
    componentWillUnmount()


#### 定义props默认值： defaultProps
```
class CustomButton extends React.Component {

  static defaultProps = {
    color: 'blue'
  };
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
}
```

#### 设置状态：setState
    setState(object nextState[, function callback])

不能在组件内部通过this.state修改状态，因为该状态会在调用setState()后被替换。

setState()并不会立即改变this.state，而是创建一个即将处理的state。setState()并不一定是同步的，为了提升性能React会批量执行state和DOM渲染。

setState()总是会触发一次组件重绘，除非在shouldComponentUpdate()中实现了一些条件渲染逻辑。

```
class Counter extends React.Component{
  constructor(props) {
      super(props);
      this.state = {clickCount: 0};
      this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.setState(function(state) {
      return {clickCount: state.clickCount + 1};
    });
  }
  render () {
    return (<h2 onClick={this.handleClick}>点我！点击次数为: {this.state.clickCount}</h2>);
  }
}
ReactDOM.render(
  <Counter />,
  document.getElementById('example')
);
```
#### 强制更新：forceUpdate
    forceUpdate([function callback])
forceUpdate()方法会使组件调用自身的render()方法重新渲染组件，组件的子组件也会调用自己的render()。但是，组件重新渲染时，依然会读取this.props和this.state，如果状态没有改变，那么React只会更新DOM。

forceUpdate()方法适用于this.props和this.state之外的组件重绘（如：修改了this.state后），通过该方法通知React需要调用render()

一般来说，应该尽量避免使用forceUpdate()，而仅从this.props和this.state中读取状态并由React触发render()调用。
#### 获取DOM节点：findDOMNode
    DOMElement findDOMNode()
如果组件已经挂载到DOM中，该方法返回对应的本地浏览器 DOM 元素。当render返回null 或 false时，this.findDOMNode()也会返回null。从DOM 中读取值的时候，该方法很有用，如：获取表单字段的值和做一些 DOM 操作。
#### 判断组件挂载状态：isMounted
    bool isMounted()
isMounted()方法用于判断组件是否已挂载到DOM中。可以使用该方法保证了setState()和forceUpdate()在异步场景下的调用不会出错。

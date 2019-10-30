# typescript

**内容：**

-   类型基础
-   类型断言
-   解构
-   接口
-   类
-   修饰符
-   抽象类
-   高级技巧
-   函数
-   this
-   泛型
-   枚举
-   类型推论
-   类型兼容性

## 类型基础

ts 的类型主要有布尔值、数字、字符串、数组、元组、枚举、Symbol、Any、Void、Null 和 Undefined、Never。

```
  # Boolean
  let boo : boolean = true; || let boo : boolean = false;

  # Number(数字和各种进制)
  let num : number = 6; || let num : number = 0xf00d;

  # String
  let str : string = 'string';

  # Array
  let arr : number[] = [1, 2, 3];  // 此类是表示由此类元素组成的一个数组
  let arr : Array<number> = [1, 2, 3]; // 数组泛型 Array<元素类型>

  # Tuple
  > 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
  let arr : [ string, number ];
  arr = [ 'hello', 10 ];  // ok
  arr = [ 10, 'hello' ]; // error
  > 访问已知索引的元素，会得到正确的类型
  arr[1].slice(0);  // error, 'number' does not have 'slice';

  # enum
  > enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。
  enum Name { 'Tom', 'Jack' }
  let currName : Name = Name.Tom;
  > 默认情况下，从0开始为元素编号。 你也可以手动的指定成员的数值。
  enum Name { 'Tom' = 1, 'Jack' }
  let currName : Name = Name.Jack;
  > 或全部手动赋值
  enum Name { 'Tom' = 1, 'Jack' = 4 }
  > 枚举类型提供的一个便利是你可以由枚举的值得到它的名字。
  enum Name { 'Tom' = 1, 'Jack' = 4 }
  let currName : Name = Name[4];
  console.log(currName); // Jack

  # Any
  > 有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any类型来标记这些变量：
  let anytype : any = 3;
  anytype = 'also can be string';
  anytype = false;
  > 不定类型的array
  let anyArray : any[] = [ 1, true, '123'];

  # Void
  > 某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是void
  function warning() : void {
    console.log('warning');
  }
  > void的变量只能赋值为`undefined`或`null`;
  let unsure : void = undefined;

  # undefined 和 null
  > TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。
  let un : undefined = undefined;
  let nu : null = null;
  > 默认情况下null和undefined是所有类型的子类型。 就是说你可以把 null和undefined赋值给number类型的变量.当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。 这能避免 很多常见的问题。 也许在某处你想传入一个 string或null或undefined，你可以使用联合类型string | null | undefined。

  # never
  > never类型表示的是那些永不存在的值的类型。 例如， never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never类型，当它们被永不为真的类型保护所约束时。never类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。

  function error( message : string ) : never {
    throw new Error(message);
  }

  function fail(){
    return error('something error');
  }

  function loop() : never {
    while (true) {

    }
  }
```

## 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

-   as 语法

```
let unsure : any = 'this is a string';
let strlength : number = (unsure as string).length;
```

## 解构

这里主要说一下解构声明类，如果对解构不了解的可以先了解一下解构。

```
# 对于函数参数
function arg([ fir, sec ] : [ number, number ]) :void {
	console.log( fir, sec );
}
let input : Array<number> = [ 1, 2 ];
arg(input);

# 属性重命名
let { a : name1 , b : name2 } : { a : string, b : number }= { a : 'a' , b : 100 };

# 默认值
function default( defaultObj : { a : string, b : number } ) : void {
	let { a , b  = 100 } = defaultObj;
}
```

这里单说一下不声明的赋值需要用括号括起来，不然一对花括号会被解析成一个块。

```
( { a, b } : { a : string, b : number } = { a : 'a', b: 100 } );
```

## 接口

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

```
# 简例
  interface LabelledValue {
    label : string
  };

  function printLabel (labelledObj : labelledValue) : void {
    console.log( labelledObj.label );
  }
  let myObj = {size: 10, label: "Size 10 Object"};
  printLabel(myObj);
  > 类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

  # 可选属性
  interface SquareConfig {
    color?: string;
    width?: number;
  }
  function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
      newSquare.color = config.color;
    }
    if (config.width) {
      newSquare.area = config.width * config.width;
    }
    return newSquare;
  }
  let mySquare = createSquare({color: "black"});

  # 只读属性
  一些对象属性只能在对象刚刚创建的时候修改其值。你可以在属性名前用 readonly来指定只读属性:
  interface Point {
    readonly x: number;
    readonly y: number;
  }
  TypeScript具有ReadonlyArray<T>类型，它与Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：
  let a: number[] = [1, 2, 3, 4];
  let ro: ReadonlyArray<number> = a;

  > readonly vs const
   做为变量使用的话用 const，若做为属性则使用readonly。

  # 额外属性检查
  interface SquareConfig {
    color?: string;
    width?: number;
  }

  function createSquare(config: SquareConfig): { color: string; area: number } {
    console.log(config);
    return {
        color: config.color || '',
        area: 100
    };
  }

  createSquare({ color: 'red' });

  1 类型断言
  let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
  2 添加字符串索引签名,这种是你前提可以确定这个对象可能具有某些特殊用途的额外属性。
  interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
  }

  # 函数类型
  为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。
  interface SearchFunc {
    (source: string, subString: string): boolean;
  }
  创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量
  let mySearch: SearchFunc;
  mySearch = function(source: string, subString: string) : boolean {
    let result = source.search(subString);
    return result > -1;
  }
  函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。但函数的参数名不需要与接口里定义的名字相匹配。

  # 可索引的类型(接口可以作为索引器)
  可索引类型具有一个 索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。
  interface SomeArray {
      [index: number]: string;
  }

  let someArray: SomeArray;
  someArray = ["string1", "string2"];

  let str: string = someArray[0];
  console.log(str);
  // string1
  共有支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 number来索引时，JavaScript会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。
  class Person {
      name: string;
  }
  class Student extends Person {
      className: string;
  }

  // 错误：使用数值型的字符串索引，有时会得到完全不同的Person!
  interface NotOkay {
      // [x: number]: Person; // 数字索引类型“Person”不能赋给字符串索引类型“Student”
      [x: string]: Student;
  }
  字符串索引签名能够很好的描述dictionary模式，并且它们也会确保所有属性与其返回值类型相匹配。 因为字符串索引声明了 obj.property和obj["property"]两种形式都可以。
  interface NumberDictionary {
    [index: string]: number;
    length: number;    // 可以，length是number类型
    name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
  }
  索引签名可以设置为只读，这样可以防止给索引赋值
  interface ReadonlyStringArray {
      readonly [index: number]: string;
  }
  let myArray: ReadonlyStringArray = ["Alice", "Bob"];
  myArray[2] = "Mallory"; // error!

  # 类-类型
  1. 简例
  interface ClockInterface {
      currentTime: Date;
  }
  class Clock implements ClockInterface {
      currentTime: Date;
      constructor(h: number, m: number) { }
  }
  接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
  2. 类静态部分与实例部分的区别
  当你操作类和接口的时候，你要知道类是具有两个类型的：静态部分的类型和实例的类型。当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内。我们应该直接操作类的静态部分。
  interface ClockConstructor {
      new (hour: number, minute: number): ClockInterface;
  }
  interface ClockInterface {
      tick();
  }

  function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
      return new ctor(hour, minute);
  }

  class DigitalClock implements ClockInterface {
      constructor(h: number, m: number) { }
      tick() {
          console.log("beep beep");
      }
  }
  class AnalogClock implements ClockInterface {
      constructor(h: number, m: number) { }
      tick() {
          console.log("tick tock");
      }
  }

  let digital = createClock(DigitalClock, 12, 17);
  let analog = createClock(AnalogClock, 7, 32);
  3. 继承接口
  和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。
  interface Shape {
      color: string;
  }
  interface Square extends Shape {
      sideLength: number;
  }
  let square = <Square>{};
  square.color = "blue";
  square.sideLength = 10;
  可继承多个接口
  interface Shape {
      color: string;
  }
  interface PenStroke {
      penWidth: number;
  }
  interface Square extends Shape, PenStroke {
      sideLength: number;
  }
  let square = <Square>{};
  square.color = "blue";
  square.sideLength = 10;
  square.penWidth = 5.0;
  4. 混合类型
  有时你希望一个对象可以同时具有多种类型。
  interface Counter {
      (start: number): string;
      interval: number;
      reset(): void;
  }
  function getCounter(): Counter {
      let counter = <Counter>function (start: number) { };
      counter.interval = 123;
      counter.reset = function () { };
      return counter;
  }
  let c = getCounter();
  c(10);
  c.reset();
  c.interval = 5.0;
  ( 在使用JavaScript第三方库的时候，你可能需要像上面那样去完整地定义类型。 )

  5. 接口继承类
  当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。
  class Control {
      private state: any;
  }

  interface SelectableControl extends Control {
      select(): void;
  }

  class Button extends Control implements SelectableControl {
      select() { }
  }

  class TextBox extends Control {
      select() { }
  }

  // 错误：“Image”类型缺少“state”属性。
  class Image implements SelectableControl {
      select() { }
  }
```

## 类

举个栗子

```
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

## 修饰符

-   公共 public(默认)

可以自由的访问程序里定义的成员。

-   私有 private

不能在声明它的类的外部访问。当我们比较带有 private或 protected成员的类型的时候，情况就不同了。 如果其中一个类型里包含一个 private成员，那么只有当另外一个类型中也存在这样一个 private成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。

-   受保护 protected

protected 修饰符与private修饰符的行为很像，但是，protected成员在派生类中仍然可以访问。构造函数也可以被标记成 protected。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。

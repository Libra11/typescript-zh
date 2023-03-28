---
lang: zh-CN
title: 类
description: 类
---

`TypeScript` 完全支持 `ES2015` 中引入的类关键字。

与其他 `JavaScript` 语言特性一样，`TypeScript` 添加了类型注解和其他语法，允许您在类和其他类型之间表达关系。

## 类成员

这是最基本的类 - 一个空类：

```ts
class Point {}
```

这个类还不是很有用，所以让我们开始添加一些成员。

### 字段

一个字段声明创建了一个公共可写属性：

```ts
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

与其他位置一样，类型注释是可选的，但如果未指定，则将是隐式的 `any` 类型。

字段也可以有初始化器；当实例化类时，这些初始化器将自动运行：

```ts
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
// 打印结果为 "0, 0"
console.log(`${pt.x}, ${pt.y}`);
```

与 `const`、`let` 和 `var` 一样，类属性的初始化器将用于推断其类型：

```ts
const pt = new Point();
pt.x = "0"; // 报错，Type 'string' is not assignable to type 'number'
```

- `-strictPropertyInitialization` 选项控制类字段是否需要在构造函数中进行初始化。

```ts
class BadGreeter {
  name: string;
  // 报错，Property 'name' has no initializer and is not definitely assigned in the constructor.
  // 译者注：这里的报错是因为没有在构造函数中初始化 name 字段, 通过 -strictPropertyInitialization 选项可以控制是否需要在构造函数中初始化
}
```

```ts
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

请注意，字段需要在构造函数本身中进行初始化。 `TypeScript` 不会分析您从构造函数调用的方法以检测初始化，因为派生类可能会覆盖这些方法并未初始化成员。

如果您打算通过其他方式（例如，也许外部库为您填充了类的一部分）明确初始化字段，则可以使用明确赋值断言运算符`!`：

```ts
class OKGreeter {
  // 未初始化，但没有错误
  name!: string;
}
```

### 只读

字段可以带有只读修饰符。这可以防止在构造函数之外对字段进行赋值。

```ts
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "not ok"; // 报错，Cannot assign to 'name' because it is a read-only property.
  }
}

const g = new Greeter();
g.name = "also not ok"; // 报错，Cannot assign to 'name' because it is a read-only property.
```

### 构造函数

背景阅读：

[构造函数(MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)

类构造函数与函数非常相似。您可以添加带有类型注解、默认值和重载的参数：

```ts
class Point {
  x: number;
  y: number;

  // 正常签名
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```ts
class Point {
  // 重载
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```

类构造函数签名和函数签名之间只有一些细微差别：

- 构造函数不能有类型参数 - 这些属于外部类声明，我们稍后会学习它们
- 构造函数不能具有返回类型注释 - 类实例类型总是返回的内容

#### 调用 `super`

与 `JavaScript` 中一样，如果你有一个基类，在使用任何 `this` 成员之前，你需要在构造函数体内调用 `super()`;：

```ts
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // 在 ES5 中输出错误的值；在 ES6 中抛出异常
    console.log(this.k);
    // 'super' 必须在派生类的构造函数中调用之后才能访问 'this'。
    super();
  }
}
```

在 `JavaScript` 中忘记调用 `super` 是一个容易犯的错误，但是 `TypeScript` 会告诉你何时需要它。

## 方法

类上的函数属性称为方法。方法可以使用所有与函数和构造函数相同的类型注释：

```ts
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

除了标准的类型注释之外，`TypeScript` 在方法中没有添加任何新的东西。

请注意，在方法体内部，仍然必须通过 `this.` 访问字段和其他方法。方法体中的未限定名称始终会引用封闭作用域中的某些内容：

```ts
let x: number = 0;

class C {
  x: string = "hello";

  m() {
    // 这正在尝试修改第 1 行的 'x'，而不是类属性
    x = "world";
    // Type 'string' is not assignable to type 'number'.
  }
}
```

### `Getter` / `Setter`

类也可以有访问器：

```ts
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

注意，一个没有额外逻辑的基于字段的 `get`/`set` 对在 `JavaScript` 中很少有用。如果在 `get`/`set` 操作期间不需要添加其他逻辑，则可以公开公共字段。

`TypeScript` 对访问器有一些特殊的推断规则：

- 如果有 `get` 但没有 `set`，则属性自动为只读
- 如果 `setter` 参数的类型未指定，则它会从 `getter` 的返回类型中推断出来
- `Getter` 和 `setter` 必须具有相同的成员可见性

从 `TypeScript 4.3` 开始，可以拥有具有不同类型的访问器进行获取和设置。

```ts
class Thing {
  _size = 0;

  get size(): number {
    return this._size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // 不允许 NaN、Infinity 等
    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

### 索引签名

类可以声明索引签名；这些与其他对象类型的索引签名工作方式相同：

```ts
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

因为索引签名类型也需要捕捉方法的类型，所以很难有用地使用这些类型。通常最好将索引数据存储在另一个地方，而不是在类实例本身上。

## 类继承

像其他带有面向对象特性的语言一样，`JavaScript` 中的类可以从基类继承。

### `implements` 语句

您可以使用 `implements` 子句检查类是否满足特定接口。如果类无法正确实现，将发出错误：

```ts
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  // Class 'Ball' incorrectly implements interface 'Pingable'. Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
  pong() {
    console.log("pong!");
  }
}
```

类也可以实现多个接口，例如 `class C implements A, B {`。

### 注意事项

重要的是要明白，`implements` 子句只是检查类是否可以被视为接口类型的检查。它不会改变类或其方法的类型。一个常见的错误源是假设 `implements` 子句会改变类类型 - 实际上它不会！

```ts
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {
    // Parameter 's' implicitly has an 'any' type.
    // Notice no error here
    // 译者注：这里没有错误，因为 `implements` 子句不会改变类体如何被检查或其类型如何推断, 所以 `s` 的类型是 `any`
    return s.toLowercse() === "ok";
    // s: any
  }
}
```

在这个例子中，我们可能期望 `s` 的类型会受到 `check` 的 `name: string` 参数的影响。它不会 - `implements` 子句不会改变类体如何被检查或其类型如何推断。

类似地，实现具有可选属性的接口不会创建该属性：

```ts
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10;
// Property 'y' does not exist on type 'C'.
```

### `extends` 语句

类可以从基类继承。派生类具有其基类的所有属性和方法，并定义附加成员。

```ts
class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}

const d = new Dog();
// 基类方法
d.move();
// 派生类方法
d.woof(3);
```

#### 重写方法

派生类还可以覆盖基类字段或属性。您可以使用“`super`”语法访问基类方法。请注意，由于 `JavaScript` 类是一个简单的查找对象，因此没有“超级字段”的概念。
`TypeScript` 强制要求派生类始终是其基类的子类型。

> 译者注: 在一些其他面向对象编程语言中，子类可以通过“super”关键字直接访问父类的字段。然而，在 JavaScript 中，这样的概念并不存在。相反，子类会继承父类的属性和方法，但不能直接通过“super”关键字访问父类的字段。要访问父类的字段，您可以使用父类的方法或者通过子类的实例访问这些字段（前提是它们是可访问的，例如公共字段）。

例如，以下是覆盖方法的合法方式：

```ts
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();
d.greet("reader");
```

重要的是，派生类遵循其基类合同。请记住，通常（并且始终是合法的！）可以通过基类引用引用派生类实例：

```ts
// 通过基类引用别名化派生实例
const b: Base = d;
// 没问题
b.greet();
```

> 译者注: 在这个示例中，d 是一个派生类实例，它被赋值给一个类型为 Base 的变量 b。这是完全合法的，因为派生类实例具有基类的所有属性和方法。通过基类引用调用 greet 方法时不会出现问题，因为派生类遵循了基类的契约。

如果 `Derived` 没有遵循 `Base` 的合同会怎么样？

```ts
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // 使此参数为必需
  greet(name: string) {
    // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
    // Type '(name: string) => void' is not assignable to type '() => void'.
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

如果我们尽管有错误而编译了此代码，则此示例将崩溃：

```ts
const b: Base = new Derived();
// 因为“name”将为未定义而崩溃
b.greet();
```

#### 类型字段的声明

当目标 `>= ES2022` 或 `useDefineForClassFields` 为 `true` 时，类字段在父类构造函数完成后初始化，会覆盖父类设置的任何值。当您只想为继承的字段重新声明更准确的类型时，这可能会成为问题。为了处理这些情况，可以使用 `declare` 关键字告诉 `TypeScript`，这个字段声明不应该在运行时产生任何影响。

```ts
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // 不会生成 JavaScript 代码,
  // 只确保类型是正确的
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

> 译者注: 在这个示例中，DogHouse 类继承自 AnimalHouse 类。我们希望 DogHouse 的 resident 属性具有更精确的 Dog 类型，而不是 Animal 类型。为了在不影响运行时行为的情况下实现这一点，我们使用了 declare 关键字。这样，resident 字段只会影响类型检查，不会在生成的 JavaScript 代码中产生任何实际效果。

#### 初始化顺序

`JavaScript` 类的初始化顺序在某些情况下可能会让人惊讶。让我们来看看下面的代码：

```ts
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// 输出 "base"，而不是 "derived"
const d = new Derived();
```

这里发生了什么？

`JavaScript` 定义的类初始化顺序如下：

1. 初始化基类字段
2. 运行基类构造函数
3. 初始化派生类字段
4. 运行派生类构造函数

这意味着，在基类构造函数中，它看到的是自己的 `name` 值，因为派生类字段初始化还没有运行。

#### 继承内置类型

注意：如果您不打算从内置类型（如 `Array`、`Error`、`Map` 等）继承，或者编译目标明确设置为 `ES6`/`ES2015` 或更高版本，则可以跳过此节。

在 `ES2015` 中，返回对象的构造函数会隐式地为 `super(...)` 的任何调用者替换 `this` 的值。生成的构造函数代码需要捕获 `super(...)` 的任何潜在返回值，并将其替换为 `this`。

因此，子类化 `Error`、`Array` 等可能不再按预期工作。这是因为 `Error`、`Array` 等的构造函数使用 `ECMAScript 6` 的 `new.target` 调整原型链。然而，在 `ECMAScript 5` 中调用构造函数时，无法保证 `new.target` 的值。其他 `downlevel` 编译器通常默认具有相同的限制。

对于以下子类：

```ts
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return "hello " + this.message;
  }
}
```

您可能会发现：

1. 这些子类构造的对象上可能未定义方法，因此调用 `sayHello` 会导致错误。
2. 子类实例和它们的实例之间的 `instanceof` 将被破坏，因此 `(new MsgError()) instanceof MsgError` 将返回 `false`。

建议手动在任何 `super(...)` 调用之后立即调整原型。

```ts
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // 明确设置原型。
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
```

但是，`MsgError` 的任何子类也必须手动设置原型。对于不支持 `Object.setPrototypeOf` 的运行时，您可能可以使用 **proto**。

不幸的是，这些解决方法在 `Internet Explorer 10` 及更早版本上无法工作。您可以手动将方法从原型复制到实例本身上（即 `MsgError.prototype` 到 `this`），但是原型链本身无法修复。

## 成员可见性

你可以使用 `TypeScript` 来控制某些方法或属性是否对类外的代码可见。

### `public`

类成员的默认可见性是 `public`。公共成员可以在任何地方访问：

```ts
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

由于 `public` 已经是默认的可见性修饰符，你不需要在类成员上写它，但出于风格/可读性的原因，你可能会选择这样做。

### `protected`

`protected` 成员只对类的子类可见。

```ts
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // 在这里访问 protected 成员是可以的
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // 可以
g.getName(); // 属性'getName'是受保护的，只有在类'Greeter'及其子类中才能访问。
```

#### 暴露受保护的成员

派生类需要遵循它们的基类合同，但可以选择公开具有更多功能的基类子类型。这包括使受保护的成员公开：

```ts
class Base {
  protected m = 10;
}
class Derived extends Base {
  // 没有修饰符，所以默认为“public”
  m = 15;
}
const d = new Derived();
console.log(d.m); // 可以
```

请注意，`Derived` 已经能够自由读写 `m`，因此这并不意味着这种情况的“安全性”发生了实质性的变化。在派生类中，需要注意的主要事情是，如果这种暴露不是有意的，我们需要小心地重复保护修饰符。

#### 跨层级保护访问

不同的面向对象编程语言对于通过基类引用访问受保护的成员是否合法存在分歧：

```ts
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10; // 属性“x”受保护，只能通过类“Derived2”的实例访问。
  }
}
```

例如，`Java` 认为这是合法的。另一方面，`C＃`和 `C++`选择这段代码应该是非法的。

`TypeScript` 在这里支持 `C＃`和 `C++`，因为仅从 `Derived2` 的子类中访问 `x` 应该是合法的，而 `Derived1` 不属于它们之一。此外，如果通过 `Derived1` 引用访问 `x` 是非法的（这当然应该是！），那么通过基类引用访问它也永远不会改善情况。

另请参见为什么无法从派生类访问受保护的成员？其中更详细地解释了 `C＃`的推理。

### `private`

`private` 与 `protected` 类似，但不允许从子类访问该成员：

```ts
class Base {
  private x = 0;
}
const b = new Base();
// 无法从类外部访问
console.log(b.x); // 属性“x”是私有的，只能在类“Base”内部访问。

class Derived extends Base {
  showX() {
    // 无法在子类中访问
    console.log(this.x); // 属性“x”是私有的，只能在类“Base”内部访问。
  }
}
```

由于私有成员对派生类不可见，因此派生类无法增加其可见性：

```ts
class Base {
  private x = 0;
}
class Derived extends Base {
  // 类'Derived'错误地扩展了基类'Base'。
  // 属性“x”在类型“Base”中是私有的，但在类型“Derived”中不是。
  x = 1;
}
```

#### 跨实例私有访问

不同的面向对象编程语言对于同一类的不同实例是否可以访问彼此的私有成员存在争议。`Java`、`C#`、`C++`、`Swift` 和 `PHP` 等语言允许这样做，而 `Ruby` 则不允许。

`TypeScript` 允许跨实例私有访问：

```ts
class A {
  private x = 10;

  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

#### 注意事项

与 `TypeScript` 类型系统的其他方面一样，`private` 和 `protected` 仅在类型检查期间执行。

这意味着像 `in` 或简单的属性查找等 `JavaScript` 运行时构造仍然可以访问 `private` 或 `protected` 成员：

```ts
class MySafe {
  private secretKey = 12345;
}
```

```js
// 在 JavaScript 文件中...
const s = new MySafe();
// 将会打印 12345
console.log(s.secretKey);
```

`private` 也允许在类型检查期间使用方括号表示法进行访问。这使得声明为 `private` 的字段在单元测试等方面更容易访问，但缺点是这些字段是软私有的，不严格执行隐私。

```ts
class MySafe {
  private secretKey = 12345;
}
```

```ts
const s = new MySafe();
// 在类型检查期间不允许
console.log(s.secretKey);
// Property 'secretKey' is private and only accessible within class 'MySafe'.
// 可行
console.log(s["secretKey"]);
```

与 `TypeScript` 的 `private` 不同，`JavaScript` 的 `private` 字段（`#`）在编译后仍然保持私有，并且不提供之前提到的逃脱口，例如方括号访问，使其成为硬私有。

```js
class Dog {
  #barkAmount = 0;
  personality = "happy";
  constructor() {}
}
```

```js
"use strict";
class Dog {
  #barkAmount = 0;
  personality = "happy";
  constructor() {}
}
```

在编译为 `ES2021` 或更低版本时，`TypeScript` 将使用 `WeakMaps` 代替`#`。

```js
"use strict";
var _Dog_barkAmount;
class Dog {
  constructor() {
    _Dog_barkAmount.set(this, 0);
    this.personality = "happy";
  }
}
_Dog_barkAmount = new WeakMap();
```

如果您需要保护类中的值不受恶意操作者的影响，应使用提供硬运行时隐私的机制，例如闭包、`WeakMaps` 或 `private` 字段。请注意，这些运行时添加的隐私检查可能会影响性能。

## 静态成员

类可以有静态成员。这些成员与类的特定实例无关。它们可以通过类构造函数对象本身访问：

```ts
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

静态成员也可以使用相同的公共，受保护和私有可见性修饰符：

```ts
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
// Property 'x' is private and only accessible within class 'MyClass'.
```

静态成员也可以继承：

```ts
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### 特殊的静态名称

通常不安全/无法覆盖 `Function` 原型中的属性。因为类本身是可以使用 `new` 调用的函数，所以某些静态名称无法使用。函数属性如 `name`，`length` 和 `call` 不能作为静态成员定义：

```ts
class S {
  static name = "S!";
  // Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}
```

### 为什么没有静态类？

`TypeScript`（和 `JavaScript`）没有像 `C#`一样的静态类构造。

这些构造仅因为这些语言强制所有数据和函数都在类中。因为在 `TypeScript` 中不存在此限制，所以不需要它们。仅具有单个实例的类通常在 `JavaScript` / `TypeScript` 中表示为普通对象。

例如，我们不需要“静态类”语法，因为普通对象（甚至是顶级函数）同样适用：

```ts
// 不必要的“静态”类
class MyStaticClass {
  static doSomething() {}
}

// 首选（替代 1）
function doSomething() {}

// 首选（替代 2）
const MyHelperObject = {
  dosomething() {},
};
```

## 类中的静态块

静态块允许您编写具有自己作用域的语句序列，这些语句可以访问包含类中的私有字段。这意味着我们可以编写具有编写语句的所有功能，没有变量泄漏，并且完全访问我们类的内部的初始化代码。

```ts
class Foo {
  static #count = 0;
  get count() {
    return Foo.#count;
  }
  static {
    try {
      const lastInstances = loadLastInstances();
      Foo.#count += lastInstances.length;
    } catch {}
  }
}
```

## 泛型类

类，就像接口一样，可以是泛型的。当使用 `new` 实例化泛型类时，其类型参数与函数调用中一样被推断：

```ts
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("hello!");

const b: Box<string>;
```

类可以像接口一样使用泛型约束和默认值。

## 静态成员中的类型参数

以下代码不合法，可能不太明显：

```ts
class Box<Type> {
  static defaultValue: Type;
  // Static members cannot reference class type parameters.
}
```

请记住，类型始终完全被抹除！在运行时，只有一个 `Box.defaultValue` 属性插槽。这意味着设置 `Box<string>.defaultValue`（如果可能的话）也会改变 `Box<number>.defaultValue`-不好。泛型类的静态成员永远不能引用类的类型参数。

> 译者注: 当我们在泛型类中使用类型参数作为静态成员的类型时，会导致一些问题。因为类型参数在运行时被擦除，所以无法保证静态成员具有正确的类型。在这个例子中，`Box<string>` 和 `Box<number>` 都将尝试访问同一个 `defaultValue`，但由于它们的类型不同，这将导致类型不匹配的问题。

## 类中的 `this` 关键字

重要的是要记住，`TypeScript` 不会改变 `JavaScript` 的运行时行为，而 `JavaScript` 在某种程度上因其某些奇特的运行时行为而著名。

`JavaScript` 处理 `this` 的方式确实很不寻常：

```ts
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};

// 输出"obj"而不是"MyClass"
console.log(obj.getName());
```

长话短说，默认情况下，函数内的 `this` 值取决于函数的调用方式。在此示例中，因为该函数是通过 `obj` 引用调用的，所以其 `this` 值为 `obj` 而不是类实例。

这很少是您想要发生的！ `TypeScript` 提供了一些方法来减轻或预防此类错误。

### 箭头函数

如果有一个经常以失去其 `this` 上下文的方式调用的函数，那么使用箭头函数属性而不是方法定义可能是有意义的：

```ts
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// 输出"MyClass"而不是崩溃
console.log(g());
```

这有一些权衡：

- 在运行时，`this` 值保证是正确的，即使对于未经 `TypeScript` 检查的代码也是如此
- 这将使用更多的内存，因为每个类实例都将拥有其自己定义的每个函数的副本
- 您无法在派生类中使用 `super.getName`，因为没有条目可以从原型链中获取基类方法

### 类中的 `this` 参数

在方法或函数定义中，名为 `this` 的初始参数在 `TypeScript` 中具有特殊含义。这些参数在编译时被抹除：

```ts
// TypeScript输入带有“this”参数
function fn(this: SomeType, x: number) {
  / * ... * /;
}
```

```js
// JavaScript输出
fn(x) {
  / * ... * /
}

```

`TypeScript` 检查使用 `this` 参数调用函数时是否使用了正确的上下文。我们可以在方法定义中添加 `this` 参数，以静态地强制执行该方法的正确调用：

```ts
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();

// 错误，会崩溃
const g = c.getName;
console.log(g());
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'.
```

这种方法与箭头函数方法相反：

- `JavaScript` 调用者可能仍然会不正确地使用类方法，而不会意识到它
- 每个类定义只分配一个函数，而不是每个类实例一个函数
- 基本方法定义仍然可以通过 `super` 调用。

## `this` 类型

在类中，一个特殊的类型叫做 `this`，动态地指向当前类的类型。让我们看看它的用法：

```ts
class Box {
  contents: string = "";
  set(value: string) {
    // (method) Box.set(value: string): this
    this.contents = value;
    return this;
  }
}
```

在这里，`TypeScript` 推断 `set` 的返回类型为 `this`，而不是 `Box`。现在让我们创建 `Box` 的一个子类：

```ts
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello");
// const b: ClearableBox;
// 译者注: 这里 b 的类型为 ClearableBox(this)，而不是 Box
```

你还可以在参数类型注释中使用 `this`：

```ts
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

这与写 `other：Box` 不同，如果你有一个派生类，它的 `sameAs` 方法现在只会接受相同派生类的其他实例：

```ts
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
// Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
// Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.
```

### 基于 `this` 的类型守卫

你可以在类和接口中使用 `this` 作为返回位置的类型。与类型缩小结合使用（例如 `if` 语句），目标对象的类型将缩小到指定的类型。

```ts
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
  fso.content;
  // const fso: FileRep
} else if (fso.isDirectory()) {
  fso.children;
  // const fso: Directory
} else if (fso.isNetworked()) {
  fso.host;
  // const fso: Networked & FileSystemObject
}
```

基于 `this` 的类型守卫的一个常见用例是允许对特定字段进行延迟验证。例如，这种情况在已经验证为 `true` 的 `hasValue` 的情况下，从 `box` 中移除 `undefined` 的值：

```ts
class Box<T> {
  value?: T;

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

const box = new Box();
box.value = "Gameboy";

box.value;
// (property) Box<unknown>.value?: unknown

if (box.hasValue()) {
  box.value;
  //(property) value: unknown
}
```

## 参数属性

`TypeScript` 提供了一种特殊的语法，将构造函数参数转换为具有相同名称和值的类属性。这些称为参数属性，通过在构造函数参数前缀加上公共、私有、受保护或只读中的一个可见性修饰符来创建。生成的字段得到这些修饰符：

```ts
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
// (property) Params.x: number
console.log(a.z);
// Property 'z' is private and only accessible within class 'Params'.
```

### 类表达式

类表达式与类声明非常相似。唯一的真正区别是类表达式不需要名称，尽管我们可以通过它们绑定到的任何标识符来引用它们：

```ts
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new someClass("Hello, world");
// const m: someClass<string>
```

### 抽象类和成员

在 `TypeScript` 中，类、方法和字段可以是抽象的。

抽象方法或抽象字段是没有提供实现的方法或字段。这些成员必须存在于抽象类中，该类不能直接实例化。

抽象类的作用是作为实现所有抽象成员的子类的基类。当一个类没有任何抽象成员时，它被称为具体类。

让我们看一个例子：

```ts
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log("Hello, " + this.getName());
  }
}

const b = new Base();
// Cannot create an instance of an abstract class.
```

我们不能使用`new`实例化`Base`，因为它是抽象的。相反，我们需要创建一个派生类并实现抽象成员：

```ts
class Derived extends Base {
  getName() {
    return "world";
  }
}

const d = new Derived();
d.printName();
```

请注意，如果我们忘记实现基类的抽象成员，我们会得到一个错误：

```ts
class Derived extends Base {
  // Non-abstract class 'Derived' does not implement inherited abstract member 'getName' from class 'Base'.
  // forgot to do anything
}
```

### 抽象构造函数签名

有时您希望接受一些类构造函数函数，该函数生成从某个抽象类派生的类的实例。

例如，您可能想编写以下代码：

```ts
function greet(ctor: typeof Base) {
  const instance = new ctor();
  // Cannot create an instance of an abstract class.
  instance.printName();
}
```

`TypeScript` 正确地告诉您，您正在尝试实例化一个抽象类。毕竟，根据 `greet` 的定义，您可以完全合法地编写此代码，该代码最终将构造一个抽象类：

```ts
// Bad!
greet(Base);
```

相反，您要编写一个接受构造函数签名的函数：

```ts
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);
// Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'.
// Cannot assign an abstract constructor type to a non-abstract constructor type.
```

现在 `TypeScript` 正确地告诉您哪些类构造函数函数可以被调用——`Derived` 可以，因为它是具体的，但 `Base` 不能。

### 类之间的关系

在大多数情况下，`TypeScript` 中的类与其他类型一样在结构上进行比较。

例如，这两个类可以互换使用，因为它们完全相同：

```ts
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK
const p: Point1 = new Point2();
```

类之间的子类型关系也存在，即使没有明确的继承：

```ts
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK
const p: Person = new Employee();
```

这听起来很简单，但有一些情况似乎比其他情况更奇怪。

空类没有成员。在结构类型系统中，没有成员的类型通常是任何其他类型的超类型。因此，如果您编写一个空类（不要这样做！），则可以使用任何替代它：

```ts
class Empty {}

function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}

// All OK!
fn(window);
fn({});
fn(fn);
```

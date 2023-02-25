---
lang: zh-CN
title: 常用类型
description: 常用类型
---

在本章中，我们将介绍在`JavaScript`代码中最常见的一些类型，并解释在`TypeScript`中描述这些类型的相应方法。这不是一个详尽无遗的列表，未来的章节将描述更多命名和使用其他类型的方式。

类型也可以出现在许多不仅仅是类型注释的地方。当我们了解类型本身时，我们也将了解可以引用这些类型以形成新结构的地方。

我们将从回顾编写`JavaScript`或`TypeScript`代码时可能遇到的最基本和常见的类型开始。这些稍后将形成更复杂类型的核心构建块。

## 原始类型：`string`（字符串）、`number`（数字）和 `boolean`（布尔值）

`JavaScript`有三种非常常用的原始类型：字符串、数字和布尔值。每种类型在`TypeScript`中都有相应的类型。正如您可能期望的那样，如果在这些类型的值上使用`JavaScript` `typeof`运算符，您将看到相同的名称：

- `string`表示字符串值，例如"`Hello, world`"
- `number`用于数字，例如`42`。`JavaScript`没有针对整数的特殊运行时值，因此没有相当于`int`或`float`的等效值 - 一切都是`number`
- `boolean`用于两个值`true`和`false`

> 类型名称`String`、`Number`和`Boolean`（以大写字母开头）是合法的，但是指的是一些很少出现在您的代码中的特殊内置类型。始终使用`string`、`number`或`boolean`作为类型。

## 数组

要指定像`[1, 2, 3]`这样的数组的类型，可以使用语法 `number[]`；这种语法适用于任何类型（例如 `string[]`是字符串数组，依此类推）。您还可以将其写成 `Array<number>`，这意味着相同的事情。我们将在讲解泛型时了解更多 `T<U>`语法的内容。

> 请注意，`[number]`是一件不同的事情；请参阅关于元组的部分。

## `any`

`TypeScript` 还有一个特殊类型 `any`，当你不想让某个值引起类型检查错误时，可以使用它。

当一个值是 `any` 类型时，你可以访问它的任何属性（它们将是 `any` 类型），像函数一样调用它，将它赋值给任何类型的值，或者几乎任何其他语法合法的操作：

```ts
let obj: any = { x: 0 };
// 以下任何一行代码都不会引发编译器错误。
// 使用 any 禁用了所有进一步的类型检查，假定你比 TypeScript 更了解环境。
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

当你不想写出一个长类型，只是为了让 `TypeScript` 相信某个特定的代码行是可以的时，`any` 类型非常有用。

### `noImplicitAny`

当你没有指定类型，并且 `TypeScript` 无法从上下文中推断出类型时，编译器通常会默认为 `any`。

不过通常要避免这种情况，因为 `any` 没有经过类型检查。使用编译器标志 `noImplicitAny` 将隐式的 `any` 标记为错误。

## 变量的类型注解

当你使用 `const`、`var` 或 `let` 声明一个变量时，可以选择添加类型注解，显式指定变量的类型：

```ts
let myName: string = "Alice";
```

`TypeScript` 不使用 "`types on the left`" 类型声明，如 `int x = 0`; 类型注解总是在被注释的事物之后。

但在大多数情况下，这是不需要的。在可能的情况下，`TypeScript` 会自动推断你代码中的类型。例如，变量的类型是基于其初始化器的类型推断得出的：

```ts
// 不需要类型注解——'myName' 推断为 'string' 类型
let myName = "Alice";
```

大部分时间你不需要显式地学习推断规则。如果你刚开始使用 ` TypeScript``，请尝试使用比你认为需要更少的类型注解——你可能会惊讶地发现你需要的类型注解非常少，TypeScript ` 就能完全理解发生了什么。

## 函数

在 `JavaScript` 中，函数是传递数据的主要方式。`TypeScript` 允许你指定函数的输入和输出值的类型。

### 参数类型注解

当你声明一个函数时，你可以在每个参数后面添加类型注解来声明函数接受的参数类型。参数类型注解放在参数名称后面：

```ts
// 参数类型注解
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

当一个参数有类型注解时，传递给该函数的参数将会被检查：

```ts
// 如果执行将会出现运行时错误！
greet(42);
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

> 即使你没有在参数上使用类型注解，`TypeScript` 仍会检查你传递了正确数量的参数。

### 返回类型注释

你也可以添加返回类型注释。返回类型注释出现在参数列表之后：

```ts
function getFavoriteNumber(): number {
  return 26;
}
```

与变量类型注释一样，通常情况下你不需要返回类型注释，因为 `TypeScript` 会根据函数的返回语句推断出函数的返回类型。上面例子中的类型注释没有改变任何东西。某些代码库可能会显式指定返回类型以进行文档化，防止意外更改或者出于个人喜好。

### 匿名函数

匿名函数与函数声明有一点不同。当一个函数出现在 `TypeScript` 可以确定如何调用它的位置时，该函数的参数会自动获得类型。

下面是一个例子：

```ts
// 这里没有类型注释，但 TypeScript 可以发现这个错误
const names = ["Alice", "Bob", "Eve"];

// 函数的上下文类型推断
names.forEach(function (s) {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});

// 箭头函数也适用上下文类型推断
names.forEach((s) => {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```

即使参数 `s` 没有类型注释，`TypeScript` 也使用了 `forEach` 函数的类型，以及数组的推断类型，来确定 `s` 的类型。

这个过程称为上下文类型推断，因为函数所在的上下文环境会决定它应该有什么类型。

与推断规则类似，你不需要显式学习它发生的方式，但了解它的存在可以帮助你注意到类型注释不需要的情况。稍后，我们将看到更多示例，了解值出现的上下文如何影响其类型。

## 对象类型

除了基本类型，你将遇到的最常见类型是对象类型。它指的是任何具有属性的 `JavaScript` 值，几乎所有的值都是这种类型！为了定义一个对象类型，我们只需要列出它的属性和它们的类型。

例如，这里是一个接受类似于点的对象的函数：

```ts
// 参数的类型注释是一个对象类型
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

在这里，我们用两个属性 - `x` 和 `y` - 标注了参数的类型，它们的类型都是 `number`。你可以用逗号或分号来分隔属性，最后的分隔符都是可选的。

每个属性的类型部分也是可选的。如果你不指定类型，它会被假定为 `any` 类型。

### 可选属性

对象类型也可以指定它们的一些或全部属性是可选的。要做到这一点，只需要在属性名后面添加一个 `?`：

```ts
function printName(obj: { first: string; last?: string }) {
  // ...
}
// 两个都可以
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

在 `JavaScript` 中，如果你访问一个不存在的属性，你会得到 `undefined` 的值而不是运行时错误。因此，当你读取一个可选属性时，你需要在使用它之前检查它是否为 `undefined。`

```ts
function printName(obj: { first: string; last?: string }) {
  // 错误 - 如果没有提供 'obj.last'，就可能会崩溃！
  console.log(obj.last.toUpperCase());
  // Object is possibly 'undefined'.
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // 一种使用现代 JavaScript 语法的安全替代方式：
  console.log(obj.last?.toUpperCase());
}
```

## 联合类型

`TypeScript` 的类型系统允许你使用各种操作符从现有类型中构建新的类型。现在我们已经知道了如何编写一些类型，是时候开始以有趣的方式组合它们了。

### 定义一个联合类型

你可能会看到的第一种组合类型的方式是联合类型。联合类型是由两个或多个其他类型形成的类型，表示值可以是这些类型中的任何一个。我们称其中每个类型为联合的成员。

让我们编写一个可以操作字符串或数字的函数：

```ts
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
```

### 使用联合类型

提供匹配联合类型的值很容易，只需要提供与联合的任何成员匹配的类型即可。如果你有一个联合类型的值，如何处理它呢？

只有在每个联合成员上都是有效的操作，`TypeScript` 才会允许操作。例如，如果你有字符串 | 数字的联合类型，你不能使用仅适用于字符串的方法：

```ts
function printId(id: number | string) {
  console.log(id.toUpperCase());
  // Property 'toUpperCase' does not exist on type 'string | number'.
  // Property 'toUpperCase' does not exist on type 'number'.
}
```

解决方案是使用代码缩小联合，就像在没有类型注释的 `JavaScript` 中一样。当 `TypeScript` 可以根据代码结构推断出一个更具体的类型时，缩小会发生。

例如，`TypeScript` 知道只有字符串值才具有 `typeof` 值为 "`string`"：

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    // 在这个分支中，id 是 'string' 类型
    console.log(id.toUpperCase());
  } else {
    // 这里，id 是 'number' 类型
    console.log(id);
  }
}
```

另一个例子是使用像 `Array.isArray` 这样的函数：

```ts
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // 在这里：'x' 是 'string[]' 类型
    console.log("Hello, " + x.join(" and "));
  } else {
    // 在这里：'x' 是 'string' 类型
    console.log("Welcome lone traveler " + x);
  }
}
```

请注意，在`else`分支中，我们不需要做任何特殊处理 - 如果`x`不是一个`string[]`，那么它肯定是一个字符串。

有时你会有一个联合类型，其中所有成员都有一些共同点。例如，数组和字符串都有一个`slice`方法。如果联合中的每个成员都有一个共同的属性，那么你可以在不需要缩小范围的情况下使用该属性：

```ts
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> 可能会让人感到困惑的是，类型的联合似乎具有这些类型属性的交集。这不是偶然的 - 名称“`union`”来自类型理论。number | string 的联合是通过从每个类型的值中取并集来组成的。请注意，给定具有相应事实的两个集合，只有这些事实的交集适用于它们本身的联合。例如，如果我们有一个戴帽子的高个子人的房间，和另一个戴帽子的西班牙语演讲者的房间，将这些房间结合起来后，我们只知道每个人一定戴着帽子。

## 类型别名

我们一直在直接在类型注释中编写对象类型和联合类型。这很方便，但通常我们想多次使用同一种类型，并使用单个名称引用它。

类型别名正是为此而存在 - 是任何类型的名称。类型别名的语法是：

```ts
type Point = {
  x: number;
  y: number;
};

// 与之前的示例完全相同
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

实际上，你可以使用类型别名来为任何类型命名，而不仅仅是对象类型。例如，类型别名可以为联合类型命名：

```ts
type ID = number | string;
```

请注意，别名只是别名 - 你不能使用类型别名创建不同/不同版本的同一类型。当你使用别名时，就像你编写了别名的类型一样。换句话说，这段代码看起来可能是非法的，但是根据 `TypeScript`，它是可以的，因为两种类型都是相同类型的别名：

```ts
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Create a sanitized input
let userInput = sanitizeInput(getInput());

// 但是仍然可以重新分配字符串
userInput = "new input";
```

> 译者注: 这段代码定义了一个名为 `UserInputSanitizedString` 的类型别名，它实际上只是另一个名字对于 `string` 类型。接下来的 `sanitizeInput` 函数接收一个字符串作为参数并返回 `UserInputSanitizedString` 类型的结果，这意味着它返回一个被 `sanitize` 函数处理过的字符串。然后，通过调用 `sanitizeInput` 函数并将其结果分配给 `userInput` 变量，创建了一个被处理过的字符串输入。最后，代码重新将 `userInput` 变量分配为一个新字符串，尽管它的类型是 `UserInputSanitizedString`，但这是被允许的，因为类型别名只是一个别名，不会创建一个新的、不同的类型。

## 接口

接口声明是另一种为对象类型命名的方式：

```ts
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

就像我们在上面使用类型别名时一样，该示例的工作方式就像我们使用了一个匿名对象类型一样。`TypeScript` 只关心我们传递给 `printCoord` 的值的结构 - 它只关心它具有预期的属性。只关心类型的结构和功能是我们将 `TypeScript` 称为结构化类型系统的原因。

### 类型别名和接口的区别

**类型别名和接口非常相似，在许多情况下，你可以自由选择使用它们之一。**几乎所有接口的特性在类型中都是可用的，**关键区别在于类型无法重新打开以添加新属性，而接口则始终是可扩展的**。

通过扩展接口来创建新的接口

```ts
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
```

通过交叉类型扩展类型

```ts
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```

向现有接口添加新字段

```ts
interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

创建后的类型无法更改

```ts
type Window = {
  title: string;
};

type Window = {
  ts: TypeScriptAPI;
};

// 错误：重复的标识符“Window”。
```

你将在后面的章节中了解更多有关这些概念的内容，所以如果你不立刻理解所有内容，不用担心。

- 在 `TypeScript 4.2` 版本之前，类型别名名称可能会出现在错误消息中，有时代替等效的匿名类型（这可能是想要的，也可能不是）。接口将始终在错误消息中命名。

- 类型别名不能参与声明合并，但接口可以。

- 接口只能用于声明对象的形状，而不能重命名基本类型。

- 接口名称将始终以其原始形式出现在错误消息中，但仅在按名称使用它们时才会出现。

- 在大多数情况下，你可以根据个人喜好进行选择，如果 `TypeScript` 需要另一种声明类型，它会告诉你。如果你需要一个启发式算法，请使用接口，直到需要使用类型的功能为止。

## 类型断言

有时你会拥有 `TypeScript` 无法知道的某个值的类型信息。

例如，如果你使用 `document.getElementById`，`TypeScript` 只知道它会返回某种 `HTMLElement`，但你可能知道你的页面上会始终有一个特定 `ID` 的 `HTMLCanvasElement`。

在这种情况下，你可以使用类型断言来指定一个更具体的类型：

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

与类型注释一样，类型断言会被编译器移除，并不会影响代码的运行时行为。

你也可以使用尖括号语法（除非代码在 `.tsx` 文件中），这是等价的：

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

提醒：由于类型断言在编译时被移除，所以它没有与类型断言相关的运行时检查。如果类型断言是错误的，不会产生异常或 `null`。

`TypeScript` 只允许将类型断言转换为更具体或不那么具体的版本。此规则防止“不可能”的强制转换，如：

```ts
const x = "hello" as number;
// 将类型 'string' 转换为类型 'number' 可能是错误的，因为两个类型都不足够重叠。如果这是有意的，请先将表达式转换为 'unknown'。
```

有时，这个规则可能过于保守，会禁止更复杂的强制转换，但这些转换可能是有效的。如果发生这种情况，你可以使用两个断言，首先转换为 `any`（或我们稍后介绍的 `unknown`），然后再转换为所需的类型：

```ts
const a = expr as any as T;
```

## 字面量类型

除了通用类型`string`和`number`之外，我们可以在类型位置引用特定的字符串和数字。

一种思考方式是考虑`JavaScript`如何使用不同的方式声明变量。`var`和`let`都允许更改变量中包含的内容，而`const`则不允许。这反映在`TypeScript`为字面量创建类型的方式上。

```ts
let changingString = "Hello World";
changingString = "Olá Mundo";
// 因为changingString可以表示任何可能的字符串，所以在类型系统中描述为这样
let changingString: string;

const constantString = "Hello World";
// 因为constantString只能表示1个可能的字符串，所以它具有文字类型表示, 所以在类型系统中描述为这样
const constantString: "Hello World";
```

单独使用字面量类型并不是很有价值：

```ts
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.
```

一个只能拥有一个值的变量并没有什么用处！

但是通过将字面量组合成联合类型，您可以表达一个更有用的概念 - 例如，仅接受一定已知值集的函数：

```ts
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

数字字面量类型的工作方式相同：

```ts
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

当然，您可以将这些与非文字类型组合：

```ts
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

还有一种字面类型：布尔文字类型。只有两个布尔文字类型，正如您可能猜到的那样，它们是 `true` 和 `false` 类型。类型布尔本身实际上只是 `true` | `false` 的联合别名。

### 字面推断

当您使用对象初始化变量时，`TypeScript` 会认为该对象的属性可能会稍后更改值。例如，如果您编写了这样的代码：

```ts
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

`TypeScript` 不会假定将 `1` 赋值给以前为 `0` 的字段是错误的。另一种说法是 `obj.counter` 必须具有类型 `number`，而不是 `0`，因为类型用于确定读写行为。

对于字符串也是一样的：

```ts
const req = { url: "https://example.com", method: "GET" };
// 这个函数是译者加的,个人认为更容易理解.
function handleRequest(url: string, method: "GET" | "POST") {}
handleRequest(req.url, req.method);
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

在上面的例子中，`req.method`被推断为`string`而不是"`GET`"。因为在创建`req`和调用`handleRequest`之间可能会执行代码，该代码可能会将新的字符串赋值给`req.method`，例如"`GUESS`"，因此`TypeScript`认为此代码存在错误。

有两种解决方法。

您可以在任一位置添加类型断言来更改推断：

```ts
// 修改 1：
const req = { url: "https://example.com", method: "GET" as "GET" };
// 修改 2：
handleRequest(req.url, req.method as "GET");
```

修改 1 表示“我打算 `req.method` 始终具有字面类型"`GET`"”，防止在此字段之后将“`GUESS`”分配给该字段。 修改 2 表示“我知道由于其他原因 `req.method` 具有值"`GET`"“。

您可以使用 `as const` 将整个对象转换为类型字面量：

```ts
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

`as const` 后缀类似于 `const`，但用于类型系统，确保所有属性都分配了字面类型，而不是更一般的版本，例如 `string` 或 `number`。

## `null` 和 `undefined`

`JavaScript`有两个原始值用于表示缺少或未初始化的值：`null`和`undefined`。

`TypeScript`有两个相应的同名类型。这些类型的行为取决于是否启用了`strictNullChecks`选项。

### `strictNullChecks`为`off`时

`strictNullChecks`为`off`时，可能为`null`或`undefined`的值仍可以正常访问，并且`null`和`undefined`值可以分配给任何类型的属性。这类似于没有空值检查的语言（例如`C＃，Java`）的行为。不检查这些值往往是错误的主要来源；如果代码库中有实际可行的情况，我们始终建议开启`strictNullChecks`选项。

### `strictNullChecks`为`on`时

`strictNullChecks`为`on`时，当一个值为`null`或`undefined`时，您需要在使用该值的方法或属性之前测试这些值。就像在使用可选属性之前检查`undefined`一样，我们可以使用缩小类型范围的方法检查可能为`null`的值：

```ts
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### 尾随的非空断言操作符（后缀!）

`TypeScript` 还有一种特殊语法，可以在不进行任何显式检查的情况下从类型中移除 `null` 和 `undefined`。在任何表达式后面写`!`实际上是一种类型断言，即该值不为 `null` 或 `undefined`：

```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

与其他类型断言一样，这不会改变您的代码的运行时行为，因此重要的是只有在您知道该值不可能为 `null` 或 `undefined` 时才使用`!`。

## 枚举

枚举是由 `TypeScript` 添加到 `JavaScript` 中的功能，允许描述可能是一组可能的命名常量之一的值。与大多数 `TypeScript` 功能不同，这不是对 `JavaScript` 的类型级别的补充，而是添加到语言和运行时中的东西。因此，这是一个您应该知道存在的功能，但除非您确定，否则可能暂时不要使用。您可以在 `Enum` 参考页面中了解更多有关枚举的信息。

## 不太常见的原始类型

值得一提的是，在类型系统中表示的 `JavaScript` 中的其他原始类型。虽然我们在这里不会深入讨论。

###　`bigint`
从 `ES2020` 开始，`JavaScript` 中有一种用于非常大的整数的原始类型，即 `BigInt`：

```ts
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

您可以在 `TypeScript 3.2` 版本发布说明中了解有关 `BigInt` 的更多信息。

### `symbol`

`JavaScript` 中有一个用于通过 `Symbol（）`函数创建全局唯一引用的原始类型：

```ts
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // This condition will always return 'false' since the types 'typeof firstName' and 'typeof secondName' have no overlap.
  // Can't ever happen
}
```

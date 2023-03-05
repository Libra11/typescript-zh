---
lang: zh-CN
title: 关于函数的更多内容
description: 函数
---

函数是任何应用程序的基本构建块，无论它们是本地函数、从另一个模块导入的函数，还是类的方法。它们也是值，就像其他值一样，`TypeScript` 有许多方法描述函数的调用方式。让我们了解如何编写描述函数的类型。

## 函数类型表达式

描述函数的最简单方式是使用函数类型表达式。这些类型在语法上类似于箭头函数：

```ts
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

语法`(a: string) => void` 的意思是“一个参数名为 `a`，类型为 `string`，没有返回值的函数”。与函数声明一样，如果没有指定参数类型，**则隐式为 `any`**。

> 请注意，参数名是必需的。函数类型 `(string) => void` 的意思是“一个名为 `string` 的参数类型为 `any` 的函数”！

当然，我们可以使用类型别名来命名函数类型：

```ts
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## 调用签名

在 `JavaScript` 中，函数除了可被调用外还可以拥有属性。然而，函数类型表达式语法不允许声明属性。如果我们想描述一个带有属性的可调用对象，我们可以在对象类型中编写一个调用签名：

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

### 译者注

> 上面的代码定义了一个名为 `DescribableFunction` 的类型别名，它是一个对象类型，包含一个 `description` 属性和一个调用签名。该调用签名表示该对象可以像函数一样被调用，并接受一个 `number` 类型的参数，返回一个 `boolean` 类型的值。

调用一下上面的代码

```ts
const myFunction: DescribableFunction = (someArg: number): boolean => {
  return someArg > 0;
};
myFunction.description =
  "This function returns true if the argument is greater than 0";

doSomething(myFunction); // 输出: "This function returns true if the argument is greater than 0 returned true"
```

请注意，该语法与函数类型表达式略有不同——在参数列表和返回类型之间使用`:`而不是`=>`。

## 构造函数签名

`JavaScript`函数也可以使用`new`操作符调用。`TypeScript`将其称为构造函数，因为它们通常会创建一个新的对象。您可以通过在调用签名前添加`new`关键字来编写构造函数签名：

```ts
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

有些对象（例如 `JavaScript` 的 `Date` 对象）可以带或不带 `new` 进行调用。您可以任意地将调用和构造函数签名组合在同一类型中：

```ts
// 译者注：这么做的意义是为了定义一个函数类型，它可以用于不同的场景。比如，你可能想要一个函数，它既可以创建一个日期对象，也可以返回一个数字。使用这个接口，你可以约束函数的参数和返回值类型。
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

## 泛型函数

编写一个函数，其中输入的类型与输出的类型相关，或者两个输入类型以某种方式相关，这是很常见的。让我们考虑一个函数，它返回数组的第一个元素：

```ts
function firstElement(arr: any[]) {
  return arr[0];
}
```

这个函数完成了它的工作，但不幸的是，它的返回类型是 `any`。如果函数返回数组元素的类型，则更好。

在 `TypeScript` 中，**当我们想要描述两个值之间的对应关系时，我们使用泛型**。我们通过在函数签名中声明类型参数来实现这一点：

```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

通过为这个函数添加一个类型参数 `Type`，并在两个地方使用它，我们创建了一个链接，将函数的输入（数组）与输出（返回值）联系起来。现在当我们调用它时，会得到一个更具体的类型：

```ts
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

### 接口

请注意，在此示例中我们不需要指定 `Type`。`TypeScript` 会自动推断-选择 `Type`。

我们也可以使用多个类型参数。例如，`map` 函数的独立版本如下所示：

```ts
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

// 参数'n'的类型是'string'
// 'parsed'的类型是'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

请注意，在此示例中，`TypeScript` 可以从给定的字符串数组中推断出输入类型参数(`Input`)的类型，也可以根据函数表达式的返回值（`number`）推断出输出类型参数(`Output`)的类型。

### 约束

我们编写了一些可以用于任何类型的通用函数。有时我们想要关联两个值，但只能在某些特定类型的值上操作。在这种情况下，我们可以使用约束来限制类型参数可以接受的类型。

让我们编写一个函数，返回两个值中较长的那个。为此，我们需要一个 `length` 属性，这个属性是一个数字。我们通过写一个 `extends` 子句，将类型参数约束为该类型：

```ts
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

在这个例子中，有几个有趣的事情需要注意。我们允许 `TypeScript` 推断 `longest` 函数的返回类型。返回类型推断也适用于泛型函数。

因为我们将 `Type` 约束为`{ length：number }`，所以我们可以访问 `a` 和 `b` 参数的`.length` 属性。如果没有类型约束，我们将无法访问这些属性，因为这些值可能是没有 `length` 属性的其他类型。

`longerArray` 和 `longerString` 的类型是根据参数推断出来的。请记住，泛型是关于将两个或多个具有相同类型的值相关联的！

最后，正如我们所希望的，调用 `longest(10, 100)`会被拒绝，因为 `number` 类型没有`.length` 属性。

### 处理约束值

在使用泛型约束时，这是一个常见的错误：

```ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
    // Type '{ length: number; }' is not assignable to type 'Type'.
    // '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
  }
}
```

这个函数看起来很好 - `Type` 被限制为`{ length: number }`，函数要么返回 `Type`，要么返回匹配该约束的值。问题在于，该函数承诺返回与传入的对象相同类型的对象，而不仅仅是与约束匹配的对象。如果该代码是合法的，您可能会编写绝对不起作用的代码：

```ts
// 译者注： 这里如果传进来是一个数组，并且数组的长度小于6，那么就会返回一个对象，对象是没有 slice 方法的，所以会报错
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

#### 译者注

该错误的原因在于该函数尝试返回一个不符合类型`Type`的对象。虽然返回的对象符合约束`{ length: number }`，但不能保证其与原始`obj`相同。如果该代码是合法的，那么存在返回的对象与原始`obj`不同的情况，这会对依赖于原始对象属性和方法的代码造成问题。

```ts
// 解决办法
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    const newObject = { ...obj, length: minimum };
    return newObject;
  }
}
```

### 指定类型参数

`TypeScript` 通常可以推断出泛型调用的预期类型参数，但并非总是如此。例如，假设您编写了一个将两个数组组合在一起的函数：

```ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

通常情况下，使用不匹配的数组调用该函数会导致错误：

```ts
const arr = combine([1, 2, 3], ["hello"]);
// Type 'string' is not assignable to type 'number'.
```

但是，如果您打算这样做，可以手动指定 `Type`：

```ts
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

### 编写好的通用函数指导

编写通用函数很有趣，但使用类型参数时很容易走极端。使用过多的类型参数或在不需要的情况下使用约束会使推断更少成功，令函数的调用者感到沮丧。

#### 将类型参数向下推

以下是两种看似相似的函数编写方式：

```ts
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

这两个函数可能乍一看似乎相同，但 `firstElement1` 是编写此函数的更好方法。它的推断返回类型为 `Type`，但 `firstElement2` 的推断返回类型为 `any`，因为 `TypeScript` 必须使用约束类型来解析 `arr[0]`表达式，而不是在调用期间“等待”解析元素。

> 规则：尽可能使用类型参数本身而不是对其进行约束。

#### 使用较少的类型参数

以下是另一对相似的函数：

```ts
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

我们创建了一个不涉及两个值的类型参数 `Func`。这总是一个警示信号，因为它意味着想要指定类型参数的调用者必须手动指定额外的类型参数而没有任何理由。Func 除了使函数更难阅读和理解之外什么都不做！

> 规则：始终尽可能使用较少的类型参数。

### 类型参数应该出现两次

有时候我们会忘记一个函数可能不需要是泛型的：

```ts
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}

greet("world");
```

我们同样可以写一个更简单的版本：

```ts
function greet(s: string) {
  console.log("Hello, " + s);
}
```

**记住，类型参数是用来关联多个值的类型的。如果类型参数只在函数签名中出现一次，它就没有起到任何关联作用。**

> 规则：如果一个类型参数只在一个地方出现，那么请仔细考虑是否真的需要它。

## 可选参数

`JavaScript` 中的函数经常会接收可变数量的参数。例如，数字的 `toFixed` 方法接收一个可选的数字参数：

```ts
function f(n: number) {
  console.log(n.toFixed()); // 0 个参数
  console.log(n.toFixed(3)); // 1 个参数
}
```

我们可以在 `TypeScript` 中将参数标记为可选的，使用问号 `?`：

```ts
function f(x?: number) {
  // ...
}
```

虽然参数被指定为类型为 `number`，但 `x` 参数实际上会有类型 `number | undefined`，因为在 JavaScript 中未指定的参数会得到 `undefined` 的值。

您还可以提供参数默认值：

```ts
// 译者注：这里的 x 就是可选参数，虽然没有加问号，但是有默认值
function f(x = 10) {
  // ...
}
```

现在，在 `f` 的函数体中，`x` 将具有类型 `number`，因为任何未定义的参数都将被替换为 `10`。请注意，当参数是可选的时，调用者总是可以传递 `undefined`，因为这只是模拟了一个“缺少”的参数：

### 回调函数中的可选参数

一旦你学习了可选参数和函数类型表达式，编写调用回调函数的函数时容易犯以下错误：

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

当写入`index?`作为可选参数时，人们通常意图是想让这两个调用都是合法的：

```ts
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

实际上这意味着回调函数可以只被传递一个参数。换句话说，函数定义表明实现可能像这样：

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // 我今天不想提供索引
    callback(arr[i]);
  }
}
```

因此，`TypeScript` 会强制执行这个意义，并发出并不存在的错误：

```ts
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
  // Object is possibly 'undefined'.
});
```

在 `JavaScript` 中，如果你调用一个参数比形参多的函数，额外的参数会被简单地忽略。`TypeScript` 的表现方式也是一样的。参数更少（类型相同）的函数总是可以取代参数更多的函数。

> 当为回调函数编写函数类型时，永远不要写一个可选参数，除非你打算在调用函数时不传递该参数。

## 函数重载

一些 `JavaScript` 函数可以使用多种参数数量和类型进行调用。例如，您可能会编写一个生成日期的函数，该函数接受时间戳（一个参数）或月/日/年规范（三个参数）。

在 `TypeScript` 中，我们可以通过编写重载签名来指定可以以不同方式调用的函数。为此，请编写一些函数签名（通常为两个或多个），然后是函数主体：

```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
const d3 = makeDate(1, 3);
```

在此示例中，我们编写了两个重载：一个接受一个参数，另一个接受三个参数。这前两个签名被称为重载签名。

然后，我们编写了一个具有兼容签名的函数实现。函数具有实现签名，但无法直接调用此签名。即使我们在必需参数之后编写了具有两个可选参数的函数，也不能使用两个参数调用它！

### 重载签名和实现签名

这是一个常见的困惑来源。经常有人会编写像这样的代码，但不理解为什么会出错：

```ts
// 译者注： 当我们定义一个函数时，我们可以定义多个签名，每个签名对应不同的参数类型和个数，以及返回值类型。这些签名组成了函数的重载，让我们可以使用不同的参数来调用同一个函数。

// 但是，当我们在函数实现中写代码时，我们只能写一次函数体，无法根据调用参数的类型和个数来决定执行哪一段代码。因此，我们需要在函数实现之前定义所有的函数签名，让 TypeScript 可以根据参数类型和个数来判断应该使用哪个函数签名。

// 如果我们只写了一个函数实现而没有写多个函数签名，那么 TypeScript 就无法根据参数类型和个数来判断应该使用哪个函数签名，从而会报错。因此，我们需要在函数实现之前定义所有的函数签名，以确保 TypeScript 可以正确判断应该使用哪个函数签名。

// 另外，函数实现的签名也必须与函数签名兼容，否则会导致类型错误。例如，如果函数签名中定义了一个参数类型为字符串，但是函数实现中没有定义这个参数，那么 TypeScript 就会报类型错误。
// 函数签名
function fn(x: string): void;
// 函数实现
function fn() {
  // ...
}
// 期望能够不带参数调用
fn();
// 期望 1 个参数，但得到 0 个。
```

同样，用于编写函数主体的签名无法从外部“看到”。

实现的签名在外部不可见。编写重载函数时，您应始终在函数实现之上有两个或多个签名。

实现签名还必须与重载签名兼容。例如，这些函数存在错误，因为实现签名没有以正确的方式与重载匹配：

```ts
function fn(x: boolean): void;
// 参数类型不正确
function fn(x: string): void;
// 译者注： 此重载签名与其实现签名不兼容， 实现签名中 x 的类型为 boolean，而重载签名中 x 的类型为 boolean 和 string。
// This overload signature is not compatible with its implementation signature.
function fn(x: boolean) {}
```

```ts
function fn(x: string): string;
// 返回类型不正确
function fn(x: number): boolean;
// 译者注： 此重载签名与其实现签名不兼容， 实现签名中返回值类型为 string，而重载签名中返回值类型为 string 和 boolean。
// This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
  return "oops";
}
```

### 编写良好的函数重载

就像泛型一样，在使用函数重载时，您应该遵循一些指导方针。遵循这些原则将使您的函数更易于调用、更易于理解和更易于实现。

让我们考虑一个函数，它返回一个字符串或数组的长度：

```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
```

这个函数很好；我们可以用字符串或数组调用它。但是，我们不能用可能是字符串或数组的值调用它，因为 `TypeScript` 只能将函数调用解析为单个重载：

```ts
len(""); // OK
len([0]); // OK
// No overload matches this call.
// Overload 1 of 2, '(s: string): number', gave the following error.
// Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
// Type 'number[]' is not assignable to type 'string'.
// Overload 2 of 2, '(arr: any[]): number', gave the following error.
// Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
// Type 'string' is not assignable to type 'any[]'.
len(Math.random() > 0.5 ? "hello" : [0]);
```

因为两个重载具有相同的参数计数和相同的返回类型，我们可以使用非重载版本的函数：

```ts
function len(x: any[] | string) {
  return x.length;
}
```

这样就好多了！调用者可以使用任何一种类型的值调用它，作为额外的奖励，我们不必找出正确的实现签名。

> 在可能的情况下，始终优先使用参数联合类型而不是重载。

### 在函数中声明 `this`

`TypeScript` 可以通过代码流分析推断函数中的 `this`，例如下面的代码：

```ts
const user = {
  id: 123,
  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```

`TypeScript` 理解函数`user.becomeAdmin`有一个对应的 this 关键字，它是外部对象`user`。这种情况已经足够处理许多情况，但是在很多情况下，您需要更多控制来确定 `this` 表示的对象。`JavaScript` 规范规定您不能使用 `this` 作为参数名称，因此 `TypeScript` 使用该语法空间，让您在函数体中声明 `this` 的类型。

```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

这种模式在回调式 `API` 中很常见，其中另一个对象通常控制何时调用您的函数。请注意，**您需要使用`function`而不是箭头函数才能获得这种行为**：

```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
// The containing arrow function captures the global value of 'this'.
// Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
// 包含箭头函数捕获了全局的 "this" 值。
// 元素隐式具有 "any" 类型，因为类型“typeof globalThis”没有索引签名。
const admins = db.filterUsers(() => this.admin);
```

## 其他需要了解的类型

在处理函数类型时，有一些额外的类型需要识别。和所有类型一样，您可以在任何地方使用它们，但在函数上下文中它们尤为重要。

### `void`

`void` 代表没有返回值的函数的返回值。每当函数没有任何返回语句，或者没有从这些返回语句中返回任何显式值时，它就是推断的类型：

```ts
// 推断返回类型为 void
function noop() {
  return;
}
```

在 `JavaScript` 中，不返回任何值的函数将隐式地返回 `undefined` 值。然而，`void` 和 `undefined` 在 `TypeScript` 中并不相同。本章末尾有更多细节。

> `void` 不同于 `undefined`。

### `object`

特殊类型 `object` 指任何不是基元类型（`string`、`number`、`bigint`、`boolean`、`symbol`、`null` 或 `undefined`）的值。这与空对象类型 `{ }` 不同，也不同于全局类型 `Object`。很可能您永远不会使用 `Object`。

`object` 不等于 `Object`。请始终使用 `object`！

请注意，在 `JavaScript` 中，函数值是对象：它们有属性，在原型链中有 `Object.prototype`，是 `Object` 的实例，可以对它们调用 `Object.keys`，等等。因此，在 `TypeScript` 中，函数类型被认为是对象。

### `unknown`

`unknown` 类型表示任何值。这类似于 `any` 类型，但比较安全，因为不能对未知值执行任何操作：

```ts
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
  // Object 的类型为 'unknown'
}
```

这在描述函数类型时很有用，因为可以描述接受任何值的函数而不必在函数体中使用任何值。

同样地，您可以描述一个返回未知类型的函数：

```ts
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

// 必须小心处理 'obj'！
const obj = safeParse(someRandomString);
```

### `never`

有些函数永远不会返回值：

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

`never` 代表永远不会被观察到的值。在返回类型中，这意味着该函数会抛出异常或终止程序的执行。在 `TypeScript` 确定联合类型中没有剩余类型时，也会出现 `never`。

```ts
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

### `Function`

全局的 `Function` 类型描述了 `JavaScript` 中所有函数值的属性，例如 `bind`、` call``、apply ` 和其他一些属性。它还具有特殊属性，即 `Function` 类型的值始终可以被调用；这些调用返回 `any`：

```ts
// 译者注： 在这个例子中，我们可以看到 Function 类型的灵活性和通用性，因为它允许我们传递任何类型的函数作为参数，而不需要指定具体的函数签名或参数类型。然而，我们也要注意 Function 类型的潜在问题，如未经类型化的函数调用可能会导致不安全的任意类型返回值，因此我们要尽可能避免使用它们。比如说这里的 f 的返回值
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```

这是一个未类型化的函数调用，通常最好避免使用，因为它具有不安全的任意返回类型。

如果您需要接受任意函数但不打算调用它，则`() => void` 类型通常更安全。

## 形参和实参的展开

### 形参展开

除了使用可选参数或过载来创建可以接受各种固定参数数量的函数之外，我们还可以使用 rest 参数定义可以接受不定数量参数的函数。
`rest` 参数出现在所有其他参数之后，并使用以下语法：'`...`'。

```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

在 `TypeScript` 中，这些参数的类型注释隐式地为 `any[]` 而不是 `any`，并且给定的任何类型注释必须是 `Array<T>` 或 `T[]` 的形式，或者是元组类型（稍后我们将学习）。

### 实参展开

相反，我们可以使用展开语法从数组中提供可变数量的参数。例如，数组的 `push` 方法接受任意数量的参数：

```ts
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

请注意，**通常情况下，`TypeScript` 不会假设数组是不可变的**。这可能会导致一些令人惊讶的行为：

```ts
// 推断类型为 number[]--“一个具有零个或多个数字的数组”，而不是"包含两个数字的数组"
const args = [8, 5];
// 译者注：这里的 args 被推断为 number[] 类型，而不是 [number, number] 类型，因为它包含了 0 个或多个数字，而不是两个数字。而 Math.atan2 函数的参数类型为 (x: number, y: number) => number，因此这里的 args 不能被推断为 [number, number] 类型，所以会报错。
const angle = Math.atan2(...args);
// 一个展开参数必须具有元组类型或传递给 `rest` 参数。
```

最好的解决方法取决于您的代码，但通常 `const` 上下文是最简单的解决方案：

```ts
// Inferred as 2-length tuple
// 推断为 2 长度的元组
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```

在针对旧运行时时使用 `rest` 参数可能需要启用 `downlevelIteration。`

## 参数解构

您可以使用参数解构将作为参数提供的对象方便地解包到函数体中的一个或多个本地变量中。在 `JavaScript` 中，它看起来像这样：

```js
function sum({ a, b, c }) {
  console.log(a + b + c);
}

sum({ a: 10, b: 3, c: 9 });
```

对象的类型注释放在解构语法之后：

```ts
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

这可能看起来有点啰嗦，但您也可以在此处使用命名类型：

```ts
// 与先前示例相同
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## 函数的可分配性

### 返回类型 `void`

函数的 `void` 返回类型可能会产生一些不寻常但预期的行为。具有 `void` 返回类型的上下文函数类型并不强制函数不返回任何内容。也就是说，带有 `void` 返回类型的上下文函数类型（`type vf = () => void`）在实现时可以返回任何其他值，但将被忽略。

因此，以下`() => void` 类型的实现是有效的：

```ts
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
```

当这些函数的返回值分配给另一个变量时，它将保留 `void` 类型：

```ts
const v1 = f1();
const v2 = f2();
const v3 = f3();
```

这种行为存在是为了使以下代码有效，即使 `Array.prototype.push` 返回一个数字，`Array.prototype.forEach` 方法也期望具有 `void` 返回类型的函数。

```ts
const src = [1, 2, 3];
const dst = [0];

// 译者注： push 方法返回一个数字，但 forEach 方法期望的是一个具有 void 返回类型的函数，所以这里的函数的返回值会被忽略。
src.forEach((n) => dst.push(n));
```

当我们定义一个返回类型为 `void` 的函数时，该函数不能返回任何值，否则会出错。

```ts
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```

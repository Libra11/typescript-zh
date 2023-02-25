---
lang: zh-CN
title: 基础
description: The Basic
---

在 `JavaScript` 中，每个值都具有一组您可以从运行不同操作中观察到的行为。这听起来很抽象，但举个快速的例子，考虑一些我们可能在名为 `message` 的变量上运行的操作。

```ts
// 访问 'message' 上的 'toLowerCase' 属性并调用它
message.toLowerCase();
// 调用 'message'
message();
```

如果我们将其分解，第一行可运行的代码访问名为 `toLowerCase` 的属性，然后调用它。
第二个则尝试直接调用 `message`。

但假设我们不知道 `message` 的值，这很常见，我们不能可靠地说尝试运行任何此代码将得到什么结果。每个操作的行为完全取决于我们在第一次操作时有的值。

- `message` 是否可调用？
- 它是否具有名为 `toLowerCase` 的属性？
- 如果有，是否 `toLowerCase` 也可调用？
- 如果这两个值都可调用，它们返回什么？
  这些问题的答案通常是我们在编写 `JavaScript` 代码时需要记住的内容，我们必须希望我们把所有细节都记对了。

假设 `message` 是以下方式定义的。

```ts
const message = "Hello World!";
```

正如您可能猜到的那样，如果我们尝试运行 `message.toLowerCase()`，我们将得到相同的字符串，只是小写。

那第二行代码呢？如果您熟悉 `JavaScript`，您将知道这会导致异常：

```ts
TypeError: message is not a function
```

如果我们能避免这样的错误就太好了。

当我们运行代码时，`JavaScript` 运行时会根据值的类型来决定要执行什么操作，包括它具有哪些行为和能力。这就是`TypeError`所指的部分内容-它表明字符串"`Hello World！`"无法作为函数调用。

对于一些值，例如字符串和数字这样的原始类型，我们可以使用`typeof`运算符在运行时确定它们的类型。但是对于其他东西，如函数，没有相应的运行时机制来识别它们的类型。例如，考虑以下函数：

```js
function fn(x) {
  return x.flip();
}
```

我们可以通过阅读代码发现，只有在给定具有可调用 `flip` 属性的对象时，此函数才能正常工作，但是 `JavaScript` 不以我们可以在运行代码时检查的方式呈现此信息。在纯 `JavaScript` 中唯一知道 `fn` 对特定值的操作方式的方法是调用它并查看发生了什么。这种行为使得在运行代码之前难以预测代码将要执行的操作，这意味着在编写代码时更难知道代码将要做什么。

从这个角度看，类型是描述哪些值可以传递给 `fn` 并且哪些值会崩溃的概念。`JavaScript` 仅提供动态类型-运行代码以查看发生了什么。

另一种选择是使用静态类型系统来预测代码在运行之前的期望行为。

## 静态类型

回想一下之前我们尝试将一个字符串作为函数调用时遇到的`TypeError`。大多数人都不喜欢在运行代码时遇到任何类型的错误-它们被视为错误！而当我们编写新代码时，我们尽力避免引入新的错误。

如果我们添加了一点代码，保存文件，重新运行代码，并立即看到错误，我们可能能够快速地找出问题；但这并不总是这样。我们可能没有充分测试该功能，因此可能永远不会遇到可能抛出的潜在错误！或者如果我们足够幸运地见证了错误，我们可能最终会进行大量重构并添加许多不同的代码，而我们被迫挖掘其中。

理想情况下，我们可以有一个工具，可以在我们的代码运行之前帮助我们找到这些错误。这就是像`TypeScript`这样的静态类型检查器所做的。静态类型系统描述了当我们运行程序时我们的值的形状和行为。像`TypeScript`这样的类型检查器使用这些信息，并告诉我们何时有问题。

```ts
const message = "hello!";

message();
// This expression is not callable. Type 'String' has no call signatures.
```

尝试
在 `TypeScript` 中运行最后一个示例会在我们运行代码之前给我们一个错误消息。

## 非异常错误

到目前为止，我们已经讨论了某些问题，比如运行时错误——当`JavaScript`运行时遇到一些无法理解的内容时，它会告诉我们。这些情况会出现，因为`ECMAScript`规范对语言在遇到意外情况时应该如何行为有明确的说明。

例如，规范规定，尝试调用不可调用的内容应该引发错误。也许这听起来像“显而易见的行为”，但你可以想象，访问对象上不存在的属性也应该引发错误。然而，`JavaScript`并没有引发错误,而是返回了`undefined`值：

```js
const user = {
  name: "Daniel",
  age: 26,
};
user.location; // 返回undefined
```

静态类型系统会因为这些错误的代码终止程序调用，即使它们是“有效”的`JavaScript`，不会立即引发错误。在`TypeScript`中，以下代码会产生关于`location`未定义的错误：

```ts
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
// Property 'location' does not exist on type '{ name: string; age: number; }'.
```

虽然有时这可能意味着你需要在表达上做出一些权衡，但其目的是捕获我们程序中的合法错误。`TypeScript` 可以捕获很多合法的错误。

例如:拼写错误

```ts
const announcement = "Hello World!";

// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();
```

> 在上面的代码中，`toLocaleLowercase()`和`toLocalLowerCase()`都是拼写错误，应该是`toLocaleLowerCase()`。

未调用函数

```ts
function flipCoin() {
  // Meant to be Math.random()
  return Math.random < 0.5;
}
```

> 在上面的代码中，`Math.random`应该是一个函数，但是代码中没有调用它，导致这个函数总是返回一个函数本身而不是返回随机数。这个问题应该是`Math.random()`，调用`Math.random()`来获取一个随机数。

基本逻辑错误

```ts
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // Oops, unreachable
}
```

> 在上面的代码中，第二个`if`语句中的条件判断是错误的，因为`value`要么是字符串"a"，要么是字符串"b"，两个字符串类型是不可能重叠的，因此条件判断会永远返回`false`，这意味着该分支的代码永远不会执行。

## 类型工具化

`TypeScript` 不仅可以在我们的代码出现错误时捕捉到 `bug`，还可以防止我们在编写代码时犯这些错误。

`TypeScript` 的类型检查器可以检查我们是否在变量和其他属性上访问了正确的属性。一旦它有了这些信息，它还可以开始建议你可能想使用的属性。

这意味着 `TypeScript` 也可以用于编辑代码，并且核心类型检查器可以在你在编辑器中输入时提供错误消息和代码补全。这是人们谈论 `TypeScript` 工具化时经常提到的部分。

```ts
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.sen;
  // 下面是一些可能的补全选项
  send;
  sendDate;
  sendfile;
  sendFile;
  sendStatus;
});

app.listen(3000);
```

`TypeScript` 非常注重工具化，这不仅仅是关于输入时自动完成和错误提示。支持 `TypeScript` 的编辑器可以提供“快速修复”来自动修复错误，提供重构功能来轻松重组代码，并提供有用的导航功能来跳转到变量的定义或查找给定变量的所有引用。所有这些功能都是基于类型检查器构建的，并且是全平台的，因此你喜欢的编辑器很可能已经支持 `TypeScript。`

## `tsc`，`TypeScript` 编译器

我们已经讨论了类型检查，但我们还没有使用 `TypeScript` 的类型检查器。让我们熟悉一下我们的新朋友 ` tsc``，TypeScript ` 编译器。首先，我们需要通过 `npm` 安装它。

```bash
npm install -g typescript
```

这将全局安装 `TypeScript` 编译器 `tsc`。如果您希望从本地的 `node_modules` 包中运行 `tsc`，则可以使用 `npx` 或类似工具。

现在让我们进入一个空文件夹，并尝试编写我们的第一个 `TypeScript` 程序：`hello.ts`：

```ts
// Greets the world.
console.log("Hello world!");
```

请注意，这里没有花哨的东西；这个“`hello world`”程序看起来与您在 `JavaScript` 中编写“`hello world`”程序时编写的内容完全相同。现在，让我们通过运行 `typescript` 包安装为我们提供的命令 `tsc` 来进行类型检查。

```bash
tsc hello.ts
// Tada！
```

等等，“`tada`”是什么意思？我们运行了 `tsc`，但没有发生任何事情！好吧，没有类型错误，所以我们没有在控制台中获得任何输出，因为没有什么要报告的。

但是请再次检查 - 我们得到了一些文件输出。如果我们查看当前目录，我们将在 `hello.ts` 旁边看到一个 `hello.js` 文件。那就是我们的 `hello.ts` 文件在 `tsc` 将其编译或转换为普通 `JavaScript` 文件后的输出。如果我们检查内容，我们将看到 `TypeScript` 在处理 `.ts` 文件后所生成的输出：

```js
// Greets the world.
console.log("Hello world!");
```

在这种情况下，`TypeScript`需要进行的转换非常少，因此它看起来与我们编写的内容相同。编译器试图发出干净可读的代码，看起来像人们写的代码。虽然这并不总是那么容易，但`TypeScript`会始终保持一致的缩进，注意我们的代码跨越不同代码行时的情况，并试图保留注释。

如果我们引入类型检查错误会怎样呢？让我们重新编写`hello.ts`：

```ts
// This is an industrial-grade general-purpose greeter function
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

如果我们再次运行`tsc hello.ts`，请注意，我们会在命令行上收到一个错误！

```bash
Expected 2 arguments, but got 1.
```

`TypeScript`告诉我们，我们忘记向`greet`函数传递一个参数，这是正确的。到目前为止，我们只编写了标准`JavaScript`，但类型检查仍然能够发现我们代码中的问题。感谢`TypeScript`！

## 带错误的输出

有一件事情你可能没有注意到，就是在上一个示例中我们的 `hello.js` 文件又发生了变化。如果我们打开该文件，会发现它的内容与我们的输入文件基本相同。这可能有点令人惊讶，因为 `tsc` 报告了关于我们代码的错误，但这是基于 `TypeScript` 的一个核心价值观：大多数情况下，你比 `TypeScript` 更了解你的代码。

再次强调一下前面提到的，对代码进行类型检查会限制可运行的程序类型，因此在某些情况下，类型检查器找到的问题会成为一种权衡。大多数情况下这没问题，但是在某些场景下这些检查会阻碍你的工作。例如，想象一下将 `JavaScript` 代码迁移到 `TypeScript` 的情况，并引入类型检查错误。最终，你会花时间清理代码以适应类型检查器，但最初的 `JavaScript` 代码已经能够正常工作！为什么将其转换为 `TypeScript` 会阻止你运行它呢？

所以 `TypeScript` 不会妨碍你。当然，随着时间的推移，你可能希望更加防范错误，让 `TypeScript` 表现得更加严格一些。在这种情况下，你可以使用 `noEmitOnError` 编译器选项。尝试更改你的 `hello.ts` 文件，并使用该标志运行 `tsc`：

```ts
tsc --noEmitOnError hello.ts
```

你会注意到 `hello.js` 永远不会被更新。

> `TypeScript` 中的 `noEmitOnError` 是一种编译器选项，它控制着在编译 `TypeScript` 代码时是否在遇到错误时生成编译输出文件。如果将 `noEmitOnError` 设置为 `true`，则在编译 `TypeScript` 代码时如果出现任何错误，`TypeScript` 编译器将不会生成任何 `JavaScript` 代码文件，而是停止编译过程，并输出错误信息。当我们需要对大型项目进行重构或更改时，使用 `noEmitOnError` 可以确保我们不会意外地生成无效的 `JavaScript` 代码文件，并帮助我们更快地找到并修复问题。

## 显式类型

直到现在，我们还没有告诉`TypeScript` `person`和`date`的类型。让我们编辑代码，告诉`TypeScript` `person`是字符串类型，`date`应该是一个`Date`对象。我们还将使用`date`上的`toDateString()`方法。

```ts
function greet(person: string, date: Date) {
  console.log(Hello ${person}, today is ${date.toDateString()}!);
}
```

我们添加了类型注释，以描述`greet`可以使用哪些类型的值进行调用。您可以将其阅读为“`greet`接受一个类型为字符串的`person`和一个类型为`Date`的`date`”。

通过这样做，`TypeScript`可以告诉我们关于可能错误调用`greet`的其他情况。例如...

```ts
function greet(person: string, date: Date) {
  console.log(Hello ${person}, today is ${date.toDateString()}!);
}

greet("Maddison", Date());
// Argument of type 'string' is not assignable to parameter of type 'Date'.
```

咦？`TypeScript`在第二个参数上报告了一个错误，但为什么？

也许令人惊讶的是，在`JavaScript`中调用`Date()`会返回一个字符串。另一方面，使用`new Date()`构造`Date`对象实际上给了我们期望的结果。

无论如何，我们可以很快修复错误：

```ts
function greet(person: string, date: Date) {
  console.log(Hello ${person}, today is ${date.toDateString()}!);
}

greet("Maddison", new Date());
```

请注意，我们并不总是需要编写显式的类型注释。在许多情况下，即使我们省略类型注释，`TypeScript` 也可以推断（或“计算出”）出类型。

```ts
let msg = "hello there!";
// 如果你将鼠标悬停在 msg 上，你会看到 TypeScript 推断出它的类型是 string。如下所示：
let msg: string;
```

即使我们没有告诉 `TypeScript` 变量 `msg` 的类型是字符串，它也能够推断出来。这是 `TypeScript` 的一个特性，最好不要在类型系统将推断出相同类型的情况下添加注释。

## 擦除类型

让我们来看一下使用`tsc`编译上面的函数`greet`以输出`JavaScript`时会发生什么：

```ts
"use strict";
function greet(person, date) {
  console.log(
    "Hello ".concat(person, ", today is ").concat(date.toDateString(), "!")
  );
}
greet("Maddison", new Date());
```

请注意以下两点：

- 我们的 `person` 和 `date` 参数不再具有类型注释。

- 我们的“模板字符串”——使用反引号（`字符）的字符串——被转换为具有连接操作的普通字符串。

稍后再讨论第二点，现在让我们专注于第一点。类型注释不是 `JavaScript`（或更准确地说是 `ECMAScript`）的一部分，因此没有任何浏览器或其他运行时可以仅仅运行未经修改的 `TypeScript`。这就是为什么 `TypeScript` 需要编译器的原因——它需要一些方式来去除或转换任何特定于 `TypeScript` 的代码，以便您可以运行它。大多数特定于 `TypeScript` 的代码都会被消除，同样，在这里，我们的类型注释被完全删除。

> 记住：类型注释永远不会改变程序的运行时行为。

## 下级化

上面的例子中另一个区别是我们的模板字符串被重写为：

```ts
"Hello " + person + ", today is " + date.toDateString() + "!";
```

为什么会这样？

模板字符串是 `ECMAScript` 的一项功能，属于 `ECMAScript` 2015 版本（又称为 `ECMAScript 6`、`ES2015`、`ES6` 等等）。`TypeScript` 有能力将新版本 `ECMAScript` 的代码转换为旧版本（如 `ECMAScript 3` 或 `ECMAScript 5`，又称为 `ES3` 和 `ES5`）的代码。将从较新或“更高”的 ECMAS`cript 版本向较旧或“更低”的版本转换的过程有时称为下级化。

默认情况下，`TypeScript` 的目标版本是 `ES3`，这是 `ECMAScript` 的非常旧的版本。我们可以使用 `target` 选项选择更近期的版本。使用 `--target es2015` 运行 `TypeScript` 会将 `TypeScript` 编译为 `ECMAScript 2015` 的代码，这意味着代码应该能在支持 `ECMAScript 2015` 的任何地方运行。因此，运行 `tsc --target es2015 hello.ts` 将给我们以下输出：

```ts
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> 虽然默认目标是 `ES3`，但目前绝大多数浏览器都支持 `ES2015`。因此，大多数开发人员可以安全地将 `ES2015` 或更高版本指定为目标，除非需要与某些古老的浏览器兼容。

## 严格模式

不同的用户在 `TypeScript` 中寻找不同的类型检查器功能。有些人寻求更松散的选择体验，可以帮助验证程序的某些部分，同时仍具有良好的工具支持。这是 `TypeScript` 的默认体验，其中类型是可选的，推断采用最宽松的类型，而且没有检查潜在的 `null/undefined` 值。与 `tsc` 在出现错误时发出警告一样，这些默认值被设置为不影响你的代码。如果你正在迁移现有的 `JavaScript` 代码，这可能是一个理想的第一步。

相比之下，许多用户更喜欢让 `TypeScript` 尽可能多地验证代码，并且这就是语言提供严格性设置的原因。这些严格性设置将静态类型检查从开关（无论你的代码是否被检查）转变为更接近调节旋钮的东西。你将这个调节旋钮转得越高，`TypeScript` 就会为你检查更多。这可能需要一些额外的工作，但一般来说，这会在长期内产生回报，并且可以实现更彻底的检查和更准确的工具支持。尽可能在新的代码库中打开这些严格性检查。

`TypeScript` 有几个类型检查的严格性标志，可以打开或关闭，除非另有说明，我们的所有示例都将使用它们。在 `CLI` 中的 `strict` 标志，或在 `tsconfig.json` 中的 `"strict": true`，可以同时将它们全部打开，但我们也可以单独退出它们。你应该了解的两个最重要的标志是 `noImplicitAny` 和 `strictNullChecks`。

### `noImplicitAny`

回想一下，在某些地方，`TypeScript` 不会尝试为我们推断类型，而是回退到最宽松的类型 `any`。这并不是最糟糕的事情 - 毕竟，回退到 `any` 只是普通的 `JavaScript` 体验。

然而，使用 `any` 经常会破坏使用 `TypeScript` 的初衷。程序类型化越多，验证和工具支持就越多，这意味着编写代码时会遇到更少的错误。打开 `noImplicitAny` 标志会在任何类型被隐式推断为 `any` 的变量上发出错误。

#### 译者注

`noImplicitAny` 是 `TypeScript` 的一个编译器选项，它用于防止隐式地将类型设置为 `any`。如果将 `noImplicitAny` 设置为 `true`，则在 `TypeScript` 代码中使用了未明确指定类型的变量时，编译器将会发出警告。

以下是一个示例，在这个示例中，我们有一个 `TypeScript` 文件 `index.ts`，其中使用了未明确指定类型的变量。如果我们将 `noImplicitAny` 设置为 `true`，则在编译过程中会发出警告：

```ts
// index.ts
function add(a, b) {
  return a + b;
}

add(1, 2); // 没有为变量 a 和 b 明确指定类型

// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "target": "ES5",
    "module": "commonjs",
    "outDir": "dist"
  }
}

```

如果我们使用命令 `tsc` 来编译 `index.ts` 文件，将得到以下警告信息：

```ts
// Parameter 'a' implicitly has an 'any' type.
// Parameter 'b' implicitly has an 'any' type.
```

可以看到，由于没有为变量 `a` 和 `b` 明确指定类型，`TypeScript` 编译器发出了警告，并建议我们明确指定类型以提高代码的类型安全性。

### `strictNullChecks`

默认情况下，像 `null` 和 `undefined` 这样的值可分配给任何其他类型。这可能会使编写某些代码更容易，但忘记处理 `null` 和 `undefined` 是世界上无数错误的原因 - 有人认为这是一个价值十亿美元的错误！ `strictNullChecks` 标志使处理 `null` 和 `undefined` 更加明确，让我们不用担心是否忘记处理 `null` 和 `undefined。`

#### 译者注

`strictNullChecks` 是 `TypeScript` 的另一个编译器选项，它用于强制进行空值检查。如果将 `strictNullChecks` 设置为 `true`，则在 `TypeScript` 代码中使用了可能为 `null` 或 `undefined` 的变量时，编译器将会发出警告。

```ts
interface User {
  name: string;
  age?: number;
}
function printUserInfo(user: User) {
  console.log(`${user.name}, ${user.age.toString()}`);
  // => error TS2532: Object is possibly 'undefined'.
  console.log(`${user.name}, ${user.age!.toString()}`);
  // => OK, you confirm that you're sure user.age is non-null.

  if (user.age != null) {
    console.log(`${user.name}, ${user.age.toString()}`);
  }
  // => OK, the if-condition checked that user.age is non-null.

  console.log(
    user.name + ", " + user.age != null ? user.age.toString() : "age unknown"
  );
  // => Unfortunately TypeScript can't infer that age is non-null here.
}
```

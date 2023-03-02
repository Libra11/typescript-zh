---
lang: zh-CN
title: 类型约束
description: 类型约束
---

假设我们有一个名为`padLeft`的函数。

```ts
function padLeft(padding: number | string, input: string): string {
  throw new Error("Not implemented yet!");
}
```

如果 `padding` 是一个数字，则将其视为我们要在 `input` 前面添加的空格数。如果 `padding` 是一个字符串，则只需将 `padding` 添加到 `input` 前面。现在，让我们尝试实现当 `padLeft` 传递一个数字作为 `padding` 参数时的逻辑。

```ts
function padLeft(padding: number | string, input: string) {
  return " ".repeat(padding) + input;

  // 参数“padding” 的类型“string | number”不能赋给类型“number”的参数。
  // 类型“string”不能赋给类型“number”。
}
```

哦，出现了一个错误，提示我们在 `padding` 参数上进行加法操作时可能会得到不正确的结果。换句话说，我们还没有明确检查 `padding` 是否为数字，也没有处理它是字符串的情况，所以让我们来做一下。

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

如果这看起来像无聊的 `JavaScript` 代码，那么这正是意图。除了我们放置的注释之外，这段 `TypeScript` 代码看起来像 `JavaScript`。想法是，`TypeScript` 的类型系统旨在使编写典型的 `JavaScript` 代码变得尽可能容易，而不必为了获得类型安全而费尽心思。

尽管看起来不起眼，但这里实际上有很多内容。与 `TypeScript` 使用静态类型分析运行时值一样，它在 `JavaScript` 的运行时控制流构造中覆盖了类型分析，例如 `if/else`、条件三元运算符、循环、真值检查等，这些都可能影响这些类型。

在我们的 `if` 检查内部，`TypeScript` 看到 `typeof padding === "number"`并将其理解为一种特殊形式的代码，称为类型守卫。`TypeScript` 跟随程序可能采取的路径来分析值在给定位置的最具体可能类型。它查看这些特殊的检查（称为类型守卫）和赋值，将类型精炼到比声明更具体的类型的过程称为类型约束。在许多编辑器中，我们可以观察到这些类型随着它们的更改而变化，我们在示例中也会这样做。

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
    // 鼠标放在padding上的结果：(parameter) padding: number
  }
  return padding + input;
  // 鼠标放在padding上的结果: (parameter) padding: string
}
```

`TypeScript` 理解几种不同的类型约束的方法。

## `typeof` 类型守卫

正如我们所看到的，`JavaScript` 支持 `typeof` 运算符，它可以在运行时提供关于值类型的基本信息。`TypeScript` 期望它返回一组特定的字符串：

- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

像 `padLeft` 中所看到的那样，这个运算符在许多 `JavaScript` 库中经常出现，`TypeScript` 可以理解它以缩小不同分支中的类型。

在 `TypeScript` 中，根据 `typeof` 返回的值进行检查就是一种类型保护。因为 `TypeScript` 对 `typeof` 在不同值上的操作进行了编码，所以它了解 `JavaScript` 中的一些怪癖。例如，请注意在上面的列表中，`typeof` 不返回字符串 `null`。请查看以下示例：

```ts
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      // Object is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

在 `printAll` 函数中，我们尝试检查 `strs` 是否为对象，以查看它是否为数组类型（现在可能是巩固数组在 `JavaScript` 中是对象类型的时候了）。但是事实证明，在 `JavaScript` 中，`null` 的 `typeof` 实际上是 `"object"`！这是历史上的一个不幸意外。

有足够经验的用户可能不会感到惊讶，但并不是每个人都在 `JavaScript` 中遇到过这种情况；幸运的是，`TypeScript` 让我们知道 `strs` 只缩小到了 `string[] | null`，而不是仅仅是 `string[]`。

这可能是一个好的过渡，来谈一谈我们将称之为“真值约束”的东西。

## 真值约束

`Truthiness` 可能不是字典中的词汇，但在 `JavaScript` 中却非常常见。

在 `JavaScript` 中，我们可以在条件语句、`&&`、`||`、`if` 语句、`Boolean` 非运算符（`!`）等中使用任何表达式。例如，在 `if` 语句中，条件不一定总是布尔类型。

```ts
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return 目前有 ${numUsersOnline} 位用户在线！;
  }
  return "没有人在线。:(";
}
```

在 `JavaScript` 中，像 `if` 这样的结构首先将它们的条件转换为布尔类型，以理解它们，然后根据结果选择它们的分支。例如，值为

- `0`
- `NaN`
- `""`（空字符串）
- `0n`（大整数版本的零）
- `null`
- `undefined`

都可以转换为 `false`，而其他值则转换为 `true`。您可以通过将值传递给 `Boolean` 函数或使用更短的双重 `Boolean` 非运算符来始终将值转换为布尔值。（后者的优点是 `TypeScript` 推断出一个狭窄的字面量布尔类型 `true`，而对第一个推断为布尔类型。）

```ts
// 这两个结果都为 'true'
Boolean("hello"); // 类型: boolean, 值: true
!!"world"; // 类型: true, 值: true
```

利用这种行为是相当普遍的，尤其是为了防范像 `null` 或 `undefined` 这样的值。例如，让我们尝试将其用于我们的 `printAll` 函数。

```ts
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

您会注意到，我们通过检查 `strs` 是否为 `true` 来消除了上面的错误。这至少可以防止我们运行像下面这样的代码时出现错误：

```bash
TypeError: null is not iterable
```

但请记住，对原始类型进行真值检查通常容易出错。例如，考虑另一种编写 `printAll` 的尝试：

```ts
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  // 不要这样做！
  // 请继续阅读
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

我们将函数的整个主体包装在了检查中，但这有一个微妙的缺点：我们可能不再正确地处理**空字符串**`''`的情况。

`TypeScript` 在这里对我们并没有产生影响，但如果你对 `JavaScript` 不太熟悉，这个行为还是值得注意的。`TypeScript` 经常可以帮助你尽早发现错误，但如果你选择不处理一个值(例如上面的空字符串)，那么 `TypeScript` 可能并不能发挥其作用。如果你愿意，你可以使用一个 `linter` 来确保处理这类情况。

> 译者注：`linter`是一个静态代码分析工具，用于标记编程错误、`bug`、风格错误和可疑的构造。这个词源于一个用于检查`C`语言源代码的`Unix`工具。

最后，关于真值约束的一个要点是，使用`!`进行布尔否定会从否定的分支中过滤掉一些情况。

```ts
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

## 等值约束

`TypeScript` 还使用 `switch` 语句和等值检查（如 `===`、`!==`、`==` 和 `!=`）来约束类型。例如：

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // 我们现在可以在 'x' 或 'y' 上调用任何 'string' 方法。
    x.toUpperCase();
    y.toLowerCase();
  } else {
    console.log(x);
    console.log(y);
  }
}
```

在上面的例子中，当我们检查 `x` 和 `y` 是否相等时，`TypeScript` 知道它们的类型也必须相等。由于 `string` 是 `x` 和 `y` 都可能采用的唯一公共类型，`TypeScript` 知道 `x` 和 `y` 在第一个分支中必须是字符串。

针对特定的字面量值（而不是变量）进行检查也是可行的。在我们关于真值约束的部分中，我们编写了一个 `printAll` 函数，由于它不小心没有正确处理空字符串，因此容易出错。相反，我们可以进行特定的检查，阻止 `null`，并且 `TypeScript` 会正确地从 `strs` 的类型中移除 `null`。

```ts
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

`JavaScript` 中使用 `==` 和 `!=` 的较松的等值检查也可以正确约束类型。如果您不熟悉，检查某些东西是否为 `null` 实际上不仅检查其是否具有 `null` 值，还检查其是否可能为 `undefined`。对于 `== undefined` 同样适用, 它检查一个值是否为 `null` 或 `undefined`。

> 译者注： 注意这里是 `==` 和 `!=`，而不是 `===` 和 `!==`。这种情况下 `null` 和 `undefined` 是相等的。

```ts
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // 从类型中移除 'null' 和 'undefined'。
  if (container.value != null) {
    console.log(container.value);
    // 现在我们可以安全地乘以 'container.value'。
    container.value *= factor;
  }
}
```

## `in` 约束

`JavaScript`中有一个用于确定对象是否具有名称为属性的运算符：`in`运算符。 `TypeScript`将其考虑为一种约束潜在类型的方法。

例如，对于代码：`"value" in x`，其中`"value"`是一个字符串字面量，`x` 是一个联合类型。 `"true"`分支约束了 `x` 的类型，其中具有可选或必需属性 `value`，而`"false"`分支约束了具有可选或缺失属性 `value` 的类型。

> 译者注： 其实意思就是，当我们有一个联合类型的变量 `x`，并且我们知道它具有一些公共属性，比如 `"value"` 属性。我们可以使用 `"value" in x` 语法来检查变量 `x` 是否有 `"value"` 属性。如果有，`TypeScript` 就可以利用这个信息，把 `x` 约束到只有那些具有 `"value"` 属性的类型，而那些没有 `"value"` 属性的类型就不在考虑范围内了。

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

重申一下，可选属性将存在于约束的两侧，例如人类既可以游泳又可以飞行（使用适当的设备），因此应该出现在 `in` 检查的两侧：

> 译者注： 为了再次强调，在进行类型约束的过程中，可选属性会出现在两个分支中。例如，一个人既可以游泳，又可以飞行（如果有合适的装备），因此应该出现在 `"swim" in animal` 的分支和 `"fly" in animal` 的分支中。这是因为 `TypeScript` 并不能确定在 `animal` 中到底是否有 `"swim"` 或 `"fly"` 属性，因为这些属性都是可选的。因此，在类型约束的时候，`TypeScript` 会把具有可选属性的类型都考虑进来，无论这些属性是否出现在 `if` 或 `else` 分支中。

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;
    // (parameter) animal: Fish | Human
  } else {
    animal;
    // (parameter) animal: Bird | Human
  }
}
```

## `instanceof` 约束

`JavaScript` 有一个运算符，用于检查一个值是否是另一个值的“实例”。更具体地说，在 `JavaScript` 中，`x instanceof Foo` 检查 `x` 的原型链是否包含 `Foo.prototype`。虽然我们不会在这里深入探讨，你会在我们进入类时看到更多的内容，但它们对于大多数可以使用 `new` 构造的值仍然很有用。正如你可能已经猜到的那样，`instanceof` 也是一个类型保护，`TypeScript` 在 `instanceof` 保护的分支中约束了类型。

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
    // (parameter) x: Date
  } else {
    console.log(x.toUpperCase());
    // (parameter) x: string
  }
}
```

## 赋值语句

正如我们之前提到的那样，当我们对任何变量进行赋值时，`TypeScript` 会查看赋值的右侧并相应地约束左侧的类型。

例如，对于以下代码：

```ts
let x = Math.random() < 0.5 ? 10 : "hello world!";
// let x: string | number;

x = 1;
console.log(x);
// let x: number;

x = "goodbye!";
console.log(x);
// let x: string;
```

请注意，每个赋值都是有效的。即使在第一个赋值后，`x` 的观察类型更改为 `number`，我们仍然能够将字符串赋给 `x`。这是因为 `x` 的声明类型开始的类型是 `string | number`，并且可分配性始终根据声明类型进行检查。

如果我们将一个布尔值分配给 `x`，我们会看到一个错误，因为它不是声明类型的一部分。

```ts
let x = Math.random() < 0.5 ? 10 : "hello world!";
// let x: string | number

x = 1;
console.log(x);
// let x: number

x = true;
// Type 'boolean' is not assignable to type 'string | number'.
console.log(x);
// let x: string | number
```

## 控制流分析

到目前为止，我们已经演示了 `TypeScript` 在特定分支内如何缩小类型的一些基本示例。但是并不仅仅是遍历每个变量并在 `if`、`while`、条件语句等中寻找类型保护这么简单。例如：

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

`padLeft` 在其第一个 `if` 块中返回。`TypeScript` 能够分析此代码并看到，在 `padding` 是数字的情况下，函数的其余部分 `(return padding + input;)` 是不可访问的。因此，它能够从`string | number` 约束为字符串的类型，用于函数的其余部分。

基于可达性分析代码的过程称为控制流分析，`TypeScript` 在遇到类型保护和赋值时使用此流分析来约束类型。当分析变量时，控制流可以一遍又一遍地分裂和重新合并，这个变量可以被观察到在每个点上都有不同的类型。

例如：

```ts
function example() {
  let x: string | number | boolean;
  x = Math.random() < 0.5;
  console.log(x);
  // let x: boolean;

  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x);
    // let x: string
  } else {
    x = 100;
    console.log(x);
    // let x: number
  }

  return x;
  // let x: string | number
  // 译者注：这里的 x 的类型是 string | number，因为在 if-else 分支中，x 的类型都是 string 和 number，函数一定会走 if-else 分支中的一条，因此 x 的类型是 string | number
}
```

## 使用类型谓词

到目前为止，我们已经使用了现有的 `JavaScript` 构造来处理约束类型的范围，但有时您希望更直接地控制代码中的类型如何变化。

要定义一个用户定义的类型谓词，我们只需要定义一个返回类型为类型谓词的函数：

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

在这个例子中，`pet is Fish` 是我们的类型谓词。谓词采用参数名是 `Type` 的形式，其中 `parameterName` 必须是当前函数签名中的参数名。

每次使用某个变量调用 `isFish` 时，`TypeScript` 都会将该变量约束到与特定类型兼容的类型。

```ts
// 现在调用 'swim' 和 'fly' 都是可以的。
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

请注意，`TypeScript` 不仅知道 `if` 分支中的 `pet` 是 `Fish`；它还知道在 `else` 分支中，您没有 `Fish`，因此必须有 `Bird`。

您可以使用类型谓词 `isFish` 对 `Fish | Bird` 数组进行过滤，并获得 `Fish` 数组：

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// 或等效地
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// 对于更复杂的示例，谓词可能需要重复
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

## 区分联合类型

我们之前的例子都是针对简单类型（如字符串、布尔值和数字）对单个变量进行类型约束。虽然这是很常见的情况，但实际上，`JavaScript` 中的数据结构往往比这要稍微复杂一些。

举个例子，我们要编码表示圆和正方形这样的形状。圆用半径来表示，而正方形用边长来表示。我们使用一个名为 `kind` 的字段来标识是哪种形状。下面是一个定义 `Shape` 接口的第一个尝试。

```ts
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

我们使用字符串字面量类型的联合：`"circle"` 和 `"square"` 来告诉我们这个形状是圆形还是正方形。通过使用 `"circle" | "square"` 而不是 `string`，我们可以避免拼写错误。

```ts
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === "rect") {
    // 这个条件永远不会成立，因为类型 '"circle" | "square"' 和 '"rect"' 没有重叠。
    // ...
  }
}
```

我们可以编写一个 `getArea` 函数，根据是否处理圆形或正方形来应用正确的逻辑。首先我们试试处理圆形。

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
  // Object is possibly 'undefined'.
}
```

在开启严格空值检查模式时，这会导致一个错误——这是合理的，因为 `radius` 可能未定义。但是如果我们对 `kind` 属性进行适当的检查呢？

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // Object is possibly 'undefined'.
  }
}
```

嗯，`TypeScript` 仍然不知道该怎么做。我们已经达到了一个点，我们知道比类型检查器更多关于我们的值的信息。我们可以尝试使用非空断言（在 `shape.radius` 后加上`！`）来表示 `radius` 肯定存在。

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

但这并不理想。我们不得不使用非空断言`（！）`向类型检查器喊话，以使其相信 `shape.radius` 已定义，但如果我们开始移动代码，这些断言很容易出错。此外，在 `strictNullChecks` 之外，我们仍然可以意外访问其中任何一个字段（**因为可选属性在读取时被假定为始终存在**）。我们肯定可以做得更好。

这种 `Shape` 的编码方式的问题是类型检查器无法根据 `kind` 属性知道 `radius` 或 `sideLength` 是否存在。我们需要将我们所知道的信息传达给类型检查器。有了这个想法，让我们重新定义 `Shape`。

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

在这里，我们已经将 `Shape` 正确分成了两个具有不同 `kind` 属性值的类型，但 `radius` 和 `sideLength` 在它们各自的类型中声明为必需属性。

让我们看看在 `Shape` 中尝试访问 `radius` 会发生什么。

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
  // Property 'radius' does not exist on type 'Shape'.
  // Property 'radius' does not exist on type 'Square'.
}
```

与我们对 `Shape` 的第一个定义一样，这仍然是一个错误。当 `radius` 是可选的时，我们得到了一个错误（启用 `strictNullChecks`），因为 `TypeScript` 无法确定该属性是否存在。现在 `Shape` 是一个联合类型，`TypeScript` 告诉我们 `shape` 可能是 `Square`，并且 `Squares` 上没有定义 `radius`！两种解释都是正确的，但只有 `Shape` 的联合编码无论如何都会导致错误。

但如果我们再次尝试检查 `kind` 属性呢？

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // (parameter) shape: Circle
  }
}
```

这样就消除了错误！当联合类型中的每个类型都包含具有文字类型的共同属性时，`TypeScript` 就会认为这是一个有判别属性的联合类型，并且可以排除掉联合类型的成员。

在这种情况下，`kind` 就是那个共同属性（它被视为 `Shape` 的判别属性）。检查 `kind` 属性是否为 `"circle"` 可以消除 `Shape` 中没有类型为 `"circle"` 的 `kind` 属性的所有类型。这将 `shape` 约束为类型 `Circle`。

使用 `switch` 语句进行检查也可以起到同样的作用。现在我们可以尝试编写完整的 `getArea` 函数，而不需要使用任何烦人的非空断言 `!`。

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    // (parameter) shape: Circle
    case "square":
      return shape.sideLength ** 2;
    // (parameter) shape: Square
  }
}
```

重要的是 `Shape` 的编码方式。将正确的信息传达给 `TypeScript` - `Circle` 和 `Square` 实际上是具有特定 `kind` 字段的两个不同类型 - 是至关重要的。这样做让我们编写类型安全的 `TypeScript` 代码，看起来和我们本来会编写的 `JavaScript` 没有任何不同。从那里，类型系统能够做出“正确”的决策，并确定我们 `switch` 语句中每个分支的类型。

顺便说一句，尝试玩一下上面的示例并删除一些 `return` 关键字。您会发现，在 `switch` 语句的不同子句中意外地掉落时，类型检查可以帮助避免错误。

```ts
// 译者注：那就玩一下呗
// 在这个示例中，我们删除了每个 case 子句中的 return 语句。这样做将导致类型错误。如果我们调用 getArea 函数并将其传递给一个 Circle 对象
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      console.log(`Calculating area of a circle with radius ${shape.radius}`);
    case "square":
      // 这里会报错，因为 TypeScript 把 shape 约束为 Circle 类型，而 Circle 类型上没有 sideLength 属性
      console.log(
        `Calculating area of a square with side length ${shape.sideLength}`
      );
  }
}
```

有判别属性的联合类型不仅对于讨论圆形和正方形有用。它们对于表示 `JavaScript` 中的任何消息方案都很有用，例如在发送网络消息（客户端/服务器通信）或在状态管理框架中编码突变时。

## `never` 类型

当进行类型约束时，你可以将联合类型的选项约束到一定程度，以至于移除所有可能性，不再剩余任何选项。在这些情况下，`TypeScript` 将使用 `never` 类型来表示一个不应该存在的状态。

## 穷尽性检查

`never` 类型可以赋值给任何类型，但是没有任何类型可以赋值给 `never`（除了 `never` 本身）。这意味着你可以使用类型约束并依赖于 `never` 来进行 `switch` 语句的穷尽性检查。

例如，为我们的 `getArea` 函数添加一个默认项，尝试将形状分配给 `never` 时，如果未处理每种可能情况，将会引发错误。

```ts
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

将一个新成员添加到 `Shape` 联合中，将会导致 `TypeScript` 错误：

```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      // Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```

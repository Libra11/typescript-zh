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

但请记住，对原始类型进行 `truthiness` 检查通常容易出错。例如，考虑另一种编写 `printAll` 的尝试：

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

我们将函数的整个主体包装在了检查中，但这有一个微妙的缺点：我们可能不再正确地处理空字符串的情况。

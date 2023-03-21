---
lang: zh-CN
title: typeof类型运算符
description: typeof类型运算符
---

`JavaScript` 中已经有了一个 `typeof` 运算符，可以在表达式上下文中使用：

```js
// 输出 "string"
console.log(typeof "Hello world");
```

`TypeScript` 添加了一个 `typeof` 运算符，可以在类型上下文中使用，用于引用变量或属性的类型：

```ts
let s = "hello";
let n: typeof s;
// let n: string;
```

对于基本类型并没有什么用处，但与其他类型运算符结合使用，可以使用 `typeof` 方便地表达许多模式。例如，让我们首先查看预定义类型 `ReturnType<T>`。它获取函数类型并生成其返回类型：

```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
// type K = boolean;
```

如果我们尝试在函数名称上使用 `ReturnType`，我们会看到一个有指导意义的错误：

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
// 'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?
```

请记住，值和类型并不相同。要引用值 `f` 具有的类型，我们使用 `typeof`：

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
// type P = {
//   x: number;
//   y: number;
// };
```

## 限制

`TypeScript` 有意限制了您可以在 `typeof` 上使用的表达式类型。

具体来说，只能在标识符（即变量名）或其属性上使用 `typeof`。这有助于避免编写您认为正在执行但实际上不执行的代码的混淆陷阱：

```ts
// 希望使用 ReturnType<typeof msgbox>
let shouldContinuts: typeof msgbox("Are you sure you want to continue?");
// 期望“，”。

// 译者注: 解释一下，这里的 msgbox("Are you sure you want to continue?") 是一个函数调用表达式, 而不是一个类型表达式, 所以这里的 typeof msgbox("Are you sure you want to continue?") 是一个错误的类型表达式, 不能用于类型上下文中, 如果你想要使用 ReturnType, 你应该使用 typeof msgbox, 而不是 typeof msgbox("Are you sure you want to continue?")
```

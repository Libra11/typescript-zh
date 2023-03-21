---
lang: zh-CN
title: keyof类型运算符
description: keyof类型运算符
---

## `keyof` 类型运算符

`keyof` 类型运算符接受一个对象类型并生成其键的字符串或数字文字联合类型。以下类型 `P` 与`“x” | “y”`相同：

```ts
type Point = { x: number; y: number };
type P = keyof Point;
// type P = keyof Point;

// 译者注
function a(p: P) {
  return p;
}
console.log(a("x"));
```

如果类型具有字符串或数字索引签名，则 `keyof` 将返回这些类型：

```ts
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number
```

请注意，在此示例中，`M` 为 `string | number`——这是因为 `JavaScript` 对象键始终被强制转换为字符串，因此 `obj[0]`始终与 `obj[“0”]`相同。

与映射类型结合使用时，`keyof` 类型尤其有用，我们稍后会更多地了解它们。

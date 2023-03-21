---
lang: zh-CN
title: 索引访问类型
description: 索引访问类型
---

我们可以使用索引类型来查找另一个类型的特定属性：

```ts
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
// Age的类型为number
```

索引类型本身也是一种类型，因此我们可以使用联合类型、`keyof` 或其他类型：

```ts
type I1 = Person["age" | "name"];

// I1的类型为string | number

type I2 = Person[keyof Person];

// I2的类型为string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];

// I3的类型为string | boolean
```

如果尝试索引一个不存在的属性，则会出现错误：

```ts
type I1 = Person["alve"];
// Property 'alve' does not exist on type 'Person'.
```

使用任意类型进行索引的另一个示例是使用数字获取数组元素的类型。我们可以将其与 `typeof` 结合使用，方便地捕获数组字面量的元素类型：

```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];

// Person的类型为:
// {
//   name: string;
//   age: number;
// }

type Age = typeof MyArray[number]["age"];

// Age的类型为number

// 或者
type Age2 = Person["age"];

// Age2的类型为number
```

在索引时，只能使用类型，这意味着不能使用 `const` 来进行变量引用：

```ts
const key = "age";
type Age = Person[key];
// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
```

但是，您可以使用类型别名进行类似的重构：

```ts
type key = "age";
type Age = Person[key];
```

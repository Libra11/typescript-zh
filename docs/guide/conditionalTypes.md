---
lang: zh-CN
title: 条件类型
description: 条件类型
---

在大多数有用的程序中，我们需要根据输入做出决策。`JavaScript` 程序也不例外，但是考虑到值可以轻松地内省，这些决策也基于输入的类型。条件类型有助于描述输入和输出类型之间的关系。

```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
// type Example1 = number;

type Example2 = RegExp extends Animal ? number : string;
// type Example2 = string;
```

条件类型的形式类似于 `JavaScript` 中的条件表达式（`condition ? trueExpression : falseExpression`）：

```js
SomeType extends OtherType ? TrueType : FalseType;
```

当左边的类型可以赋值给右边的类型时，将得到第一个分支（“`true`”分支）的类型；否则，将得到后一个分支（“`false`”分支）的类型。

从上面的例子中，条件类型可能不会立即显得有用 - 我们可以自己判断 `Dog` 是否扩展 `Animal` 并选择 `number` 或 `string`！但条件类型的威力来自于将它们与泛型一起使用。

例如，让我们看看以下的 `createLabel` 函数：

```ts
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

这些 `createLabel` 的重载描述了一个 `JavaScript` 函数，它根据其输入的类型做出选择。注意以下几点：

- 如果一个库必须在整个 `API` 中反复做出相同的选择，这将变得繁琐。
- 我们必须创建三个重载：针对我们确定类型的每种情况（一个为字符串，一个为数字），以及最一般的情况（接受字符串 | 数字）。对于 `createLabel` 可以处理的每种新类型，重载数量呈指数级增长。
- 相反，我们可以使用条件类型对该逻辑进行编码：

```ts
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

然后，我们可以使用该条件类型将我们的重载简化为一个没有重载的单个函数。

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");
// let a: NameLabel;

let b = createLabel(2.8);
// let b: IdLabel;

let c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel;
```

## 条件类型约束

在条件类型中，检查操作可以提供新的信息。就像通过类型保护缩小类型范围可以得到更具体的类型一样，条件类型的真分支将通过我们检查的类型进一步约束泛型类型。

例如，我们来看下面的例子：

```ts
type MessageOf<T> = T["message"];
```

这里 `TypeScript` 会报错，因为 `T` 不具有名为“`message`”的属性。我们可以对 `T` 进行约束，这样 `TypeScript` 就不会再抱怨了：

```ts
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>;
```

但是，如果我们想让 `MessageOf` 接受任何类型，并在没有 `message` 属性时默认为 `never`，该怎么办呢？我们可以将约束移出，并引入一个条件类型：

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
type DogMessageContents = MessageOf<Dog>;
```

在真分支中，`TypeScript` 知道 `T` 将具有 `message` 属性。

另一个例子，我们也可以编写一个名为 `Flatten` 的类型，将数组类型展开为它们的元素类型，否则保持不变：

```ts
type Flatten<T> = T extends any[] ? T[number] : T;

// 提取出元素类型。
type Str = Flatten<string[]>;

// 保持类型不变。
type Num = Flatten<number>;
```

当 `Flatten` 被赋予一个数组类型时，它使用 `number` 进行索引访问，以提取出 `string[]`的元素类型。否则，它只是返回它所接收到的类型。

## 推断条件类型

我们刚刚发现，使用条件类型来应用约束并提取类型是一种很常见的操作，条件类型使这一过程变得更加简单。

条件类型为我们提供了一种方式，通过使用 `infer` 关键字在 `true` 分支中比较的类型来进行推断。例如，我们可以在 `Flatten` 中推断元素类型，而不是使用索引访问类型手动提取出它：

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

在这里，我们使用 `infer` 关键字声明性地引入一个名为 Item 的新通用类型变量，而不是在 true 分支中指定如何检索 T 的元素类型。这使我们无需考虑如何挖掘并分解我们感兴趣的类型的结构。

我们可以使用 `infer` 关键字编写一些有用的辅助类型别名。例如，对于简单的情况，我们可以从函数类型中提取返回类型：

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
type Str = GetReturnType<(x: string) => string>;
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
```

当从具有多个调用签名的类型（例如重载函数的类型）进行推断时，推断会从最后一个签名中进行（这通常是最宽松的 `catch-all` 情况）。无法根据参数类型列表执行重载分辨率。

```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
```

当条件类型作用于通用类型时，如果给定了联合类型，则它们变成分布式。例如，考虑以下代码：

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
```

如果我们将联合类型传递给 `ToArray`，那么条件类型将应用于该联合的每个成员。

```ts
type StrArrOrNumArr = ToArray<string | number>;
```

这里发生的情况是 `StrArrOrNumArr` 对以下内容进行了分布：

```ts
string | number;
```

并且映射了联合的每个成员类型，实际上是：

```ts
ToArray<string> | ToArray<number>;
```

这使我们得到：

```ts
string[] | number[];
```

通常，分布性是期望的行为。要避免这种行为，可以将 `extends` 关键字的每个侧面都用方括号括起来。

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 这样，`StrArrOrNumArr` 就不再是一个联合类型。
// type StrArrOrNumArr = (string | number)[]
type StrArrOrNumArr = ToArrayNonDist<string | number>;
```

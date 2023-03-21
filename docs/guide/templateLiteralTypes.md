---
lang: zh-CN
title: 模板字面量类型
description: 模板字面量类型
---

模板字面量类型是在字符串字面量类型的基础上构建的，具有通过联合类型扩展为多个字符串的能力。

它们与 `JavaScript` 中的模板字面量字符串具有相同的语法，但用于类型位置。当与具体的字面量类型一起使用时，模板字面量通过连接内容产生一个新的字符串字面量类型。

```ts
type World = "world";
type Greeting = `hello ${World}`;
// type Greeting = "hello world";
```

当联合类型用于插值位置时，类型是由每个联合成员表示的可能的每个字符串字面量集合组成的：

```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type AllLocaleIDs =
  | "welcome_email_id"
  | "email_heading_id"
  | "footer_title_id"
  | "footer_sendoff_id";
```

对于模板字面量中的每个插值位置，联合类型进行交叉乘积：

```ts
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
type LocaleMessageIDs =
  | "en_welcome_email_id"
  | "en_email_heading_id"
  | "en_footer_title_id"
  | "en_footer_sendoff_id"
  | "ja_welcome_email_id"
  | "ja_email_heading_id"
  | "ja_footer_title_id"
  | "ja_footer_sendoff_id"
  | "pt_welcome_email_id"
  | "pt_email_heading_id"
  | "pt_footer_title_id"
  | "pt_footer_sendoff_id";
```

我们通常建议人们对于大型字符串联合使用提前生成，但在更小的情况下也很有用。

### 字符串联合类型

模板字面量的威力在于根据类型内部的信息定义新的字符串。

考虑一个函数（`makeWatchedObject`），它向传递的对象添加一个名为 `on()`的新函数。在 `JavaScript` 中，它的调用可能如下所示：`makeWatchedObject(baseObject)`。我们可以将基础对象想象为：

```ts
const passedObject = {
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
};
```

将被添加到基本对象的 `on()`函数期望两个参数，`eventName`（字符串）和 `callBack`（函数）。

`eventName` 应该是属性名 + "`Changed`" 的形式；因此，`firstNameChanged` 派生自基本对象中的属性 `firstName`。

当调用 `callBack` 函数时：

- 应该传递一个与属性名的值相关联的类型的值；因此，由于 `firstName` 的类型为字符串，因此用于 `firstNameChanged` 事件的回调函数期望在调用时传递一个字符串。类似地，与 `age` 相关的事件应该期望使用数字参数进行调用。
- 应该具有 `void` 返回类型（为了演示的简单性）

因此，`on()`的朴素函数签名可能是：`on(eventName: string, callBack: (newValue: any) => void)`。然而，在前面的描述中，我们确定了我们想在代码中记录的重要类型约束。模板字面量类型让我们将这些约束带入我们的代码中。

```ts
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// makeWatchedObject has added `on` to the anonymous Object

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

注意，`on` 监听事件“`firstNameChanged`”，而不仅仅是“`firstName`”。如果我们要确保合格的事件名称集合由带有“`Changed`”的观察对象属性名称的联合限制，则我们的 `on()`的朴素规范可以更加健壮。虽然我们在 `JavaScript` 中做这样的计算（即 `Object.keys(passedObject).map(x => ${x}Changed)`）感到舒适，但类型系统内部的模板字面量提供了一种类似的字符串操作方法：

```ts
type PropEventSource<Type> = {
  on(
    eventName: `${string & keyof Type}Changed`,
    callback: (newValue: any) => void
  ): void;
};

/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;
```

有了这个，我们就可以构建一个会在给定错误属性时出错的东西：

```ts
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", () => {});

// Prevent easy human error (using the key instead of the event name)
person.on("firstName", () => {});
// Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.

// It's typo-resistant
person.on("frstNameChanged", () => {});
// Argument of type '"frstNameChanged"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
```

### 推断模板字面量

请注意，我们没有从传递的原始对象中受益于所有提供的信息。给定 `firstName` 的更改（即 `firstNameChanged` 事件），我们应该期望回调将收到一个类型为字符串的参数。类似地，更改年龄的回调应该接收一个数字参数。我们正在天真地使用任何来类型化 `callBack` 的参数。再次，模板文字类型使得可以确保属性的数据类型将与该属性的回调的第一个参数的类型相同。

使这一切成为可能的关键见解是：我们可以使用一个带有泛型的函数，使得：

- 在第一个参数中使用的字面量被捕获为字面量类型
- 该字面量类型可以被验证为在泛型中有效属性的联合中
- 可以使用索引访问来查找已验证属性的类型在泛型结构中
- 可以应用此类型信息以确保回调函数的参数类型相同

```ts
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", (newName) => {
  // (parameter) newName: string
  console.log(`new name is ${newName.toUpperCase()}`);
});

person.on("ageChanged", (newAge) => {
  // (parameter) newAge: number
  if (newAge < 0) {
    console.warn("warning! negative age");
  }
});
```

这里我们将 `on` 方法变成了一个通用方法。

当用户使用字符串“`firstNameChanged`”调用时，`TypeScript` 将尝试为 `Key` 推断正确的类型。为此，它将 `Key` 与“`Changed`”之前的内容进行匹配，并推断出字符串“`firstName`”。一旦 `TypeScript` 弄清楚了这一点，`on` 方法就可以获取原始对象上 `firstName` 的类型，这种情况下是字符串。类似地，当使用“`ageChanged`”调用时，`TypeScript` 找到属性 `age` 的类型，该类型为数字。

推断可以以不同的方式组合，通常是为了解构字符串并以不同的方式重构它们。

### 内置字符串操纵类型

为了帮助进行字符串操作，`TypeScript` 包括一组可用于字符串操作的类型。这些类型内置于编译器中以提高性能，并且无法在 `TypeScript` 附带的 `.d.ts` 文件中找到。

```ts
Uppercase<StringType>;
```

将字符串中的每个字符转换为大写版本。

```ts
type Greeting = "Hello, world";
type ShoutyGreeting = Uppercase<Greeting>;
// type ShoutyGreeting = "HELLO, WORLD";

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<"my_app">;
// type MainID = "ID-MY_APP";
```

```
Lowercase<StringType>
```

将字符串中的每个字符转换为小写字母。

```ts
type Greeting = "Hello, world";
type QuietGreeting = Lowercase<Greeting>;
// type QuietGreeting = "hello, world"

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`;
type MainID = ASCIICacheKey<"MY_APP">;
// type MainID = "id-my_app"
```

```ts
Capitalize<StringType>;
```

将字符串中的第一个字符转换为大写字母。

```ts
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
// type Greeting = "Hello, world"
```

```ts
Uncapitalize<StringType>;
```

将字符串中的第一个字符转换为小写字母。

```ts
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
// type UncomfortableGreeting = "hELLO WORLD"
```

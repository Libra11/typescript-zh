---
lang: zh-CN
title: 映射类型
description: 映射类型
---

当你不想重复自己的时候，有时需要基于其他类型创建一个类型。

映射类型建立在索引签名的语法基础之上，索引签名用于声明那些预先没有声明类型的属性的类型：

```ts
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

映射类型是一种使用属性键的并集（通常通过 `keyof` 创建）进行迭代创建类型的泛型类型：

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

在这个例子中，`OptionsFlags` 将获取类型 `Type` 的所有属性，并将它们的值更改为布尔值。

```ts
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;

// type FeatureOptions = {
//   darkMode: boolean;
//   newUserProfile: boolean;
// };
```

### 映射修饰符

映射期间可以应用两个附加修饰符：`readonly` 和 `?`，分别影响可变性和可选性。

您可以通过前缀 `-` 或 `+` 删除或添加这些修饰符。如果您不添加前缀，则假定为 `+`。

```ts
// 从类型的属性中删除 'readonly' 属性
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;

// type UnlockedAccount = {
//   id: string;
//   name: string;
// };
```

```ts
// 从类型的属性中删除 'optional' 属性
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;

// type User = {
//   id: string;
//   name: string;
//   age: number;
// };
```

### 通过 `as` 重新映射键

在 `TypeScript 4.1` 及以上版本中，您可以使用映射类型中的 `as` 子句重新映射键：

```ts
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

您可以利用模板文字类型等功能从先前的属性名称创建新的属性名称：

```ts
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;

type LazyPerson = {
  getName: () => string;
  getAge: () => number;
  getLocation: () => string;
};
```

您可以通过条件类型通过生成 `never` 来过滤键：

```ts
// 删除 'kind' 属性
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

type KindlessCircle = {
  radius: number;
};
```

您可以映射任意联合类型，而不仅仅是`string | number | symbol`的联合：

```ts
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
// type Config = {
//   square: (event: SquareEvent) => void;
//   circle: (event: CircleEvent) => void;
// };
```

### 进一步探索

映射类型与此类型操作部分中的其他功能配合使用效果很好，例如下面是使用条件类型的映射类型，根据对象是否将 `pii` 属性设置为字面量 `true` 返回 `true` 或 `false`：

```ts
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;

// type ObjectsNeedingGDPRDeletion = {
//   id: false;
//   name: true;
// };
```

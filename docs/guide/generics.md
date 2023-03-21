---
lang: zh-CN
title: 泛型
description: 泛型
---

软件工程的主要部分之一是构建具有明确定义和一致的 `API` 的组件，同时也是可重复使用的。能够处理今天和明天的数据的组件将为构建大型软件系统提供最灵活的功能。

在像 `C#` 和 `Java` 这样的语言中，创建可重复使用组件的主要工具之一是泛型，也就是能够创建一个可以处理多种类型而不是单一类型的组件。这允许用户消耗这些组件并使用他们自己的类型。

## 泛型的 `Hello World`

首先，让我们来做泛型的“`Hello World`”：`identity`函数。`identity`函数是一个函数，将返回传入的任何内容。你可以将其想象成类似于 `echo` 命令。

如果没有泛型，我们要么必须给身份函数指定一个特定的类型：

```ts
function identity(arg: number): number {
  return arg;
}
```

或者，我们可以使用任意类型来描述身份函数：

```ts
function identity(arg: any): any {
  return arg;
}
```

虽然使用任意类型肯定是泛型的，因为它将导致该函数接受任何和所有类型的 `arg`，但当函数返回时，我们实际上失去了关于该类型的信息。如果我们传入一个数字，我们所拥有的唯一信息就是任何类型都可能被返回。

相反，我们需要一种捕获参数类型的方式，以便我们也可以用它来表示正在返回的内容。在这里，我们将使用类型变量，这是一种特殊的变量，它在类型而不是值上工作。

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```

我们现在已经向身份函数添加了一个类型变量 `Type`。这个 `Type` 允许我们捕获用户提供的类型（例如数字），以便我们稍后可以使用该信息。在这里，我们再次使用 `Type` 作为返回类型。经过检查，我们现在可以看到同一类型被用于参数和返回类型。这使我们能够在函数的一侧交换该类型信息并在另一侧输出该信息。

我们说，这个版本的身份函数是泛型的，因为它可以处理一系列类型。与使用任意类型不同，它也与使用数字作为参数和返回类型的第一个身份函数一样精确（即，它不会丢失任何信息）。

一旦我们编写了通用的`identity`函数，我们可以通过两种方式之一调用它。第一种方式是将所有参数（包括类型参数）传递给函数：

```ts
let output = identity<string>("myString");
// let output: string;
```

在这里，我们明确设置 `Type` 为字符串，作为函数调用的参数之一，使用`<>`而不是`()`表示。

第二种方式也可能是最常见的。在这里，我们使用类型参数推断 - 也就是说，我们希望编译器根据我们传递的参数类型自动设置 `Type` 的值：

```ts
let output = identity("myString");
//let output: string;
```

请注意，我们不必明确传递尖括号（`<>`）中的类型;编译器只是查看值“`myString`”，并将 `Type` 设置为其类型。虽然类型参数推断可以是使代码更短，更易读的有用工具，但在更复杂的示例中可能需要显式传递类型参数，就像我们在上一个示例中所做的那样，当编译器无法推断类型时会发生这种情况。

## 使用泛型类型变量

当你开始使用泛型时，你会注意到当你创建泛型函数（如 `identity` ）时，编译器会强制你在函数体中正确使用任何的泛型类型参数。也就是说，你必须将这些参数当作可以是任何类型的参数来处理。

让我们来看看之前的 `identity` 函数：

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```

如果我们想在每次调用时将参数 `arg` 的长度记录到控制台中，我们可能会写出以下代码：

```ts
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

当我们这样做时，编译器会给我们一个错误，告诉我们我们正在使用 `arg` 的`.length` 成员，但是我们没有声明 `arg` 有这个成员。记住，我们之前说过这些类型变量代表任何类型，因此使用此函数的人可以传入一个数字，而数字没有`.length` 成员。

假设我们实际上打算让这个函数在数组 `Type` 上工作，而不是直接在 `Type` 上工作。由于我们正在处理数组，`.length` 成员应该是可用的。我们可以像创建其他类型的数组一样描述它：

```ts
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```

你可以将 `loggingIdentity` 的类型读作“泛型函数 `loggingIdentity` 接受一个类型参数 `Type` 和一个参数 `arg`，该参数是 `Type` 类型的数组，并返回一个 `Type` 类型的数组”。如果我们传入一个数字数组，我们将得到一个数字数组，因为 `Type` 将绑定到数字。这使我们可以将泛型类型变量 `Type` 作为我们正在处理的类型的一部分，而不是整个类型，从而使我们具有更大的灵活性。

我们也可以用这种方式编写样例代码：

```ts
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // 数组有.length，因此不会再出现错误
  return arg;
}
```

你可能已经从其他语言中熟悉了这种类型的风格。在下一节中，我们将介绍如何创建自己的泛型类型，例如 `Array<Type>`。

## 泛型类型

在之前的章节中，我们创建了可以适用于多种类型的泛型`identity`函数。在本章中，我们将探讨函数本身的泛型类型以及如何创建泛型接口。

泛型函数的类型与非泛型函数的类型相同，类型参数排在最前面，类似于函数声明：

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

我们还可以在类型中使用不同的泛型类型参数名称，只要类型变量的数量和使用方式相同即可。

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
```

我们还可以将泛型类型写成对象字面量类型的调用签名：

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;
```

这引导我们编写我们的第一个泛型接口。让我们将前面示例中的对象字面量移动到接口中：

```ts
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

在类似的示例中，我们可能希望将泛型参数移动到整个接口的参数中。这样我们可以看到我们泛型的类型（例如 `Dictionary<string>`而不仅仅是 `Dictionary`）。这使得类型参数对接口的所有其他成员可见。

```ts
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

请注意，我们的示例已经稍微变化了一下。我们现在没有描述一个泛型函数，而是一个非泛型函数签名是泛型类型的一部分。当我们使用 `GenericIdentityFn` 时，我们现在还需要指定相应的类型参数（这里是：`number`），有效地锁定底层调用签名将使用什么类型。了解何时将类型参数直接放在调用签名上，何时将其放在接口本身上，将有助于描述类型中哪些方面是泛型的。

除了泛型接口之外，我们还可以创建泛型类。请注意，无法创建泛型枚举和命名空间。

## 泛型类

泛型类与泛型接口有相似的结构。在类名后面使用尖括号（`<>`）来定义泛型类型参数列表。

```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

这是一个对 `GenericNumber` 类的非常直接的使用，但你可能已经注意到没有什么限制它只能使用 `number` 类型。我们可以使用字符串或者更复杂的对象。

```ts
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

与接口一样，将类型参数放在类本身上可以确保该类的所有属性都使用相同的类型。

正如我们在类的部分中所介绍的那样，类有两个方面的类型：静态方面和实例方面。泛型类仅对其实例方面进行泛型，而不是对其静态方面进行泛型，因此在处理类时，静态成员不能使用类的类型参数。

## 泛型约束

如果您记得之前的例子，有时您可能想编写一个泛型函数，该函数适用于一组类型，您对该类型集合将拥有一些知识。在 `loggingIdentity` 示例中，我们希望能够访问 `arg` 的`.length` 属性，但编译器无法证明每种类型都具有`.length` 属性，因此它警告我们不能做出这种假设。

```ts
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  // Property 'length' does not exist on type 'Type'.
  return arg;
}
```

而不是处理任何类型，我们希望将此函数限制为与具有`.length` 属性的任何和所有类型一起工作。只要类型具有此成员，我们将允许它，但它需要至少具有此成员。为此，我们必须将我们的要求列为对类型的约束。

为此，我们将创建一个描述我们的约束的接口。在这里，我们将创建一个具有单个`.length` 属性的接口，然后使用此接口和关键字“`extends`”来表示我们的约束：

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); //现在我们知道它具有.length属性，因此不再报错
  return arg;
}
```

由于泛型函数现在受到了限制，它将不再适用于任何类型：

```ts
loggingIdentity(3);
// Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
```

相反，我们需要传入具有所有所需属性的类型的值：

```ts
loggingIdentity({ length: 10, value: 3 });
```

## 在泛型约束中使用类型参数

您可以声明一个由另一个类型参数约束的类型参数。例如，下面的示例中，我们想通过属性名称从对象中获取属性。我们希望确保不会意外抓取 `obj` 上不存在的属性，因此我们将在两种类型之间放置一个约束：

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
// 显示错误：Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'
```

## 在泛型中使用类类型

在 `TypeScript` 中使用泛型创建工厂时，有必要通过它们的构造函数引用类类型。例如：

```ts
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

更高级的示例使用原型属性来推断和约束构造函数和类类型实例之间的关系。

```ts
class BeeKeeper {
  hasMask: boolean = true;
}

class ZooKeeper {
  nametag: string = "Mikle";
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

这种模式用于实现混入设计模式。

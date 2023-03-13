---
lang: zh-CN
title: 对象类型
description: 对象类型
---

在 `JavaScript` 中，我们将数据分组并传递给其他部分的基本方式是通过对象。在 `TypeScript` 中，我们使用对象类型来表示它们。

正如我们所见，它们可以是匿名的：

```ts
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}
```

或者可以通过使用接口来命名：

```ts
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```

或者使用类型别名：

```ts
type Person = {
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```

在上面的三个示例中，我们编写了函数，它们接受包含属性 `name`（必须是字符串）和 `age`（必须是数字）的对象。

## 属性修饰符

对象类型中的每个属性都可以指定几个内容：类型、属性是否可选以及属性是否可以写入。

### 可选属性

在大多数情况下，我们需要处理可能已设置属性的对象。在这种情况下，我们可以通过在名称后面添加问号（`?`）来将这些属性标记为可选。

例如：

```ts
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // ...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```

在这个例子中，`xPos` 和 `yPos` 都被认为是可选的。我们可以选择提供它们中的任何一个，因此上面对 `paintShape` 的每个调用都是有效的。所有可选性真正表明的是，如果属性被设置，则它必须具有特定的类型。

我们也可以从这些属性中读取值——但是当我们在 `strictNullChecks` 下这样做时，`TypeScript` 会告诉我们它们可能是未定义的。例如：

```ts
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;
  // (property) PaintOptions.xPos?: number | undefined

  let yPos = opts.yPos;
  // (property) PaintOptions.yPos?: number | undefined
  // ...
}
```

在 `JavaScript` 中，即使属性从未设置，我们仍然可以访问它——它只会给我们 `undefined` 值。我们可以特别处理 `undefined`。例如：

```ts
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  // let xPos: number;
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
  // let yPos: number;
  // ...
}
```

请注意，为未指定的值设置默认值的此模式非常常见，`JavaScript` 具有支持它的语法。例如：

```ts
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos);
  // (parameter) xPos: number

  console.log("y coordinate at", yPos);
  // (parameter) yPos: number
  // ...
}
```

### 使用解构模式和默认值

在`paintShape`的参数中，我们使用了解构模式，并为`xPos`和`yPos`提供了默认值。现在，在`paintShape`的函数体中，`xPos`和`yPos`都是必不可少的，但对于任何调用`paintShape`的人来说是可选的。

> 请注意，目前无法在解构模式中放置类型注释。这是因为在`JavaScript`中以下语法已经有了不同的含义。

```ts
function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
  render(shape);
  // Cannot find name 'shape'. Did you mean 'Shape'?
  render(xPos);
  // Cannot find name 'xPos'.
}
```

在对象解构模式中，`shape: Shape` 表示“获取属性 `shape` 并将其重定义为名为 `Shape` 的局部变量。同样，`xPos: number` 创建了一个名为 `number` 的变量，其值基于参数的 xPos。

使用映射修饰符，您可以删除可选属性。

### `readonly` 属性

`TypeScript` 中的属性也可以标记为 `readonly`。虽然它不会在运行时改变任何行为，但被标记为 `readonly` 的属性在类型检查期间不能被写入。

```ts
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // 我们可以读取 'obj.prop' 的值。
  console.log(`prop has the value '${obj.prop}'.`);

  // 但我们不能重新分配它。
  obj.prop = "hello";
  // 报错：Cannot assign to 'prop' because it is a read-only property.
}
```

使用 `readonly` 修饰符并不一定意味着该值完全不可变，或者换句话说，其内部内容不能被更改。它只是意味着该属性本身不能被重写。

```ts
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // 我们可以读取和更新 'home.resident' 的属性。
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // 但我们不能在 'Home' 上直接写入 'resident' 属性本身。
  home.resident = {
    name: "Victor the Evictor",
    age: 42,
  };
  // 报错：Cannot assign to 'resident' because it is a read-only property.
}
```

`readonly` 的含义需要管理预期。它在 `TypeScript` 的开发期间有助于标志对象的使用方式。`TypeScript` 在检查两种类型是否兼容时不考虑两种类型的属性是否为 `readonly`，因此 `readonly` 属性也可以通过别名更改。

```ts
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // 输出 '42'
writablePerson.age++;
console.log(readonlyPerson.age); // 输出 '43'
```

使用映射修饰符，您可以删除 `readonly` 属性。

### 索引签名

有时候你无法提前知道某个类型的属性的全部名称，但你确实知道值的形状。

在这种情况下，你可以使用索引签名来描述可能值的类型，例如：

```ts
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();

const secondItem = myArray[1];
// const secondItem: string;
```

在上述代码中，我们有一个 `StringArray` 接口，它具有索引签名。这个索引签名声明了当使用数字对 `StringArray` 进行索引时，它将返回一个字符串。

只有一些类型可以用于索引签名属性：字符串、数字、符号、模板字符串模式以及仅由这些类型组成的联合类型。

可以支持这两种类型的索引器...

虽然字符串索引签名是描述“字典”模式的强大方式，但它们也强制所有属性与它们的返回类型匹配。这是因为字符串索引声明 `obj.property` 也可以使用 `obj["property"]`来访问。在以下示例中，`name` 的类型与字符串索引的类型不匹配，类型检查器会报错：

```ts
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string;
  // Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
```

但是，如果索引签名是属性类型的联合类型，则不同类型的属性是可以接受的：

```ts
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

最后，您可以将索引签名设置为只读，以防止对其索引进行赋值：

```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
// Index signature in type 'ReadonlyStringArray' only permits reading.
```

由于索引签名是只读的，因此无法设置 `myArray[2]`。

## 扩展类型

拥有一些更具体版本的类型是很常见的。例如，我们可能有一个 `BasicAddress` 类型，用于描述邮寄信件和包裹到美国所需的字段。

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

在某些情况下，这就足够了，但是地址通常会与单元号相关联，如果地址中的建筑物有多个单元。于是我们可以描述一个 `AddressWithUnit`。

```ts
interface AddressWithUnit {
  name?: string;
  unit: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

这样做可以完成任务，但是缺点在于，当我们的更改仅仅是增加时，我们不得不重复所有其他来自 `BasicAddress` 的字段。相反，我们可以扩展原始的 `BasicAddress` 类型，并只添加 `AddressWithUnit` 独有的新字段。

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

`extends` 关键字允许我们有效地从其他命名类型复制成员，并添加我们想要的任何新成员。这对于减少我们必须编写的类型声明模板代码以及表明多个相同属性的不同声明可能相关的意图非常有用。例如，`AddressWithUnit` 不需要重复 `street` 属性，而且由于 `street` 来源于 `BasicAddress`，读者将会知道这两种类型在某种程度上是相关的。

接口也可以从多个类型扩展。

```ts
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

## 交叉类型

接口允许我们通过扩展其他类型来建立新的类型。`TypeScript` 提供了另一种构造，称为交叉类型，主要用于组合现有的对象类型。

使用`&`运算符定义交叉类型。

```ts
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

在这里，我们交叉了 `Colorful` 和 `Circle`，产生了一个新的类型，该类型具有 `Colorful` 和 `Circle` 的所有成员。

```ts
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

// 可以
draw({ color: "blue", radius: 42 });

// 错了
draw({ color: "red", raidus: 42 });
// 类型“{ color: string; raidus: number; }”的参数不能赋给类型“Colorful & Circle”的参数。
// 对象文字可以只指定已知属性，但“raidus”不存在于类型“Colorful & Circle”中。是否要写“radius”？
```

### 接口 vs. 交叉类型

我们刚刚看了两种类似但实际上略有不同的组合类型的方法。通过接口，我们可以使用扩展子句从其他类型进行扩展，而使用交叉类型可以进行类似的操作，并将结果命名为交叉类型的类型别名。两者之间的主要区别在于如何处理冲突，而这种差异通常是您在接口和交叉类型的类型别名之间选择一个而不是另一个的主要原因之一。

## 通用对象类型

假设有一种 `Box` 类型，它可以包含任何值 - 字符串，数字，长颈鹿等等。

```ts
interface Box {
  contents: any;
}
```

目前，`contents` 属性被定义为 `any` 类型，这样做可以工作，但是可能会在后续出现意外。

我们可以改用 `unknown` 类型，但这意味着在我们已经知道 `contents` 的类型的情况下，我们需要进行预防性检查，或使用易错的类型断言。

```ts
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: "hello world",
};

//我们可以检查'x.contents'
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}

//或者我们可以使用类型断言
console.log((x.contents as string).toLowerCase());
```

一种类型安全的方法是为每种类型的 `contents` 创建不同的 `Box` 类型。

```ts
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```

但这意味着我们将不得不创建不同的函数或函数重载来操作这些类型。

```ts
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```

这是很多重复的样板代码。而且，我们可能需要引入新的类型和重载。这很令人沮丧，因为我们的 `box` 类型和重载实际上都是相同的。

相反，我们可以制作一个声明了类型参数的通用 `Box` 类型。

```ts
interface Box<Type> {
  contents: Type;
}
```

你可以将其理解为“`Type` 类型的 `Box` 是一种其 `contents` 具有 `Type` 类型的东西”。稍后，当我们提到 `Box` 时，我们必须在 `Type` 的位置上给出一个类型参数。

```ts
let box: Box<string>;
```

将 `Box` 看作是一个真实类型的模板，其中 `Type` 是一个占位符，将被替换为其他某种类型。当 `TypeScript` 看到 `Box<string>`时，它将用 `string` 替换 `Box<Type>`中的每个 `Type` 实例，并最终与类似于`{contents:string}`的东西一起工作。换句话说，`Box<string>`和我们之前的 `StringBox` 具有相同的功能。

```ts
interface Box<Type> {
  contents: Type;
}
interface StringBox {
  contents: string;
}

let boxA: Box<string> = { contents: "hello" };
// boxA.contents;
// (property) Box<string>.contents: string

let boxB: StringBox = { contents: "world" };
// boxB.contents;
// (property) StringBox.contents: string
```

`Box` 是可重用的，因为 `Type` 可以替换为任何东西。这意味着当我们需要一个新类型的盒子时，我们根本不需要声明一个新的 `Box` 类型（尽管如果我们想的话，我们当然可以声明一个新的类型）。

```ts
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ....
}

//与'{contents：Apple}'相同。
type AppleBox = Box<Apple>;
```

这也意味着我们可以通过使用泛型函数而完全避免重载。

```ts
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

值得注意的是，类型别名也可以是泛型的。我们可以用一个类型别名来定义我们的新 `Box<Type>`接口，即：

```ts
interface Box<Type> {
  contents: Type;
}
```

使用类型别名代替接口:

```ts
type Box<Type> = {
  contents: Type;
};
```

由于类型别名不像接口那样仅描述对象类型，因此我们还可以使用它们来编写其他类型的通用辅助类型。

```ts
type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;

type OneOrManyOrNullStrings = OneOrManyOrNull<string>;

type OneOrManyOrNullStrings = OneOrMany<string> | null;
```

稍后我们将回到类型别名。

### 数组类型

通常情况下，泛型对象类型是某种独立于其包含元素类型的容器类型。这样做是为了使数据结构能够跨不同的数据类型重复使用。

事实上，我们一直在本手册中使用一种类似的类型：数组类型。每当我们编写像 `number[]` 或 `string[]` 这样的类型时，它实际上只是 `Array<number>` 和 `Array<string>` 的简写。

```ts
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ["hello", "world"];

// 以下两种方式都可以！
doSomething(myArray);
doSomething(new Array("hello", "world"));
```

与上面的 `Box` 类型类似，`Array` 本身也是一个泛型类型。

```ts
interface Array<Type> {
  /**
   * 获取或设置数组的长度。
   */
  length: number;

  /**
   * 从数组中移除最后一个元素并返回它。
   */
  pop(): Type | undefined;

  /**
   * 向数组追加新元素，并返回数组的新长度。
   */
  push(...items: Type[]): number;
  // ...
}
```

现代 `JavaScript` 还提供了其他泛型数据结构，例如 `Map<K, V>`、`Set<T>` 和 `Promise<T>`。所有这些都意味着，由于 `Map`、`Set` 和 `Promise` 的行为方式，它们可以与任何类型集合一起使用。

## `ReadonlyArray` 类型

`ReadonlyArray` 是一种特殊类型，用于描述不应更改的数组。

```ts
function doStuff(values: ReadonlyArray<string>) {
  //我们可以从'values'中读取…
  const copy = values.slice();
  console.log(`第一个值是 ${values[0]}`);

  //…但我们无法更改'values'。
  values.push("hello!");
  // Property 'push' does not exist on type 'readonly string[]'.
}
```

类似于属性的 `readonly` 修改符，它主要是一个表达意图的工具。当我们看到一个返回 `ReadonlyArrays` 的函数时，它告诉我们我们不应该改变其内容，当我们看到一个消耗 `ReadonlyArrays` 的函数时，它告诉我们我们可以将任何数组传递到该函数中，而不必担心它会改变其内容。

与 `Array` 不同，我们不能使用 `ReadonlyArray` 构造函数。

```ts
new ReadonlyArray("red", "green", "blue");
// 'ReadonlyArray' only refers to a type, but is being used as a value here.
```

相反，我们可以将常规数组分配给 `ReadonlyArrays。`

```ts
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

就像 `TypeScript` 为 `Array<Type>`提供 `Type[]`的简写语法一样，它也为 `ReadonlyArray<Type>`提供 `readonly Type[]`的简写语法。

```ts
function doStuff(values: readonly string[]) {
  //我们可以从'values'中读取…
  const copy = values.slice();
  console.log(`第一个值是 ${values[0]}`);

  //…但我们无法更改'values'。
  values.push("hello!");
  // Property 'push' does not exist on type 'readonly string[]'.
}
```

最后要注意的一点是，与属性的 `readonly` 修改符不同，常规数组和 `ReadonlyArrays` 之间的可赋值性不是双向的。

```ts
let x: readonly string[] = [];
let y: string[] = [];

x = y;
y = x;
// The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

### 元组类型

元组类型是另一种数组类型，它确切地知道它包含多少个元素，以及在特定位置包含哪些类型。

```ts
type StringNumberPair = [string, number];
```

在这里，`StringNumberPair` 是一个由字符串和数字组成的元组类型。与 `ReadonlyArray` 一样，它在运行时没有表示，但对于 `TypeScript` 很重要。对于类型系统而言，`StringNumberPair` 描述了其 `0` 索引包含字符串，而 `1` 索引包含数字的数组。

```ts
function doSomething(pair: [string, number]) {
  const a = pair[0];
  const b = pair[1];
  // ...
}

doSomething(["hello", 42]);
```

如果我们尝试超出元素数量进行索引，我们将会得到一个错误。

```ts
function doSomething(pair: [string, number]) {
  // ...
  const c = pair[2];
  // 元组类型 '[string, number]' 的长度为 '2'，没有索引为 '2' 的元素。
}
```

我们也可以使用 `JavaScript` 的数组解构来解构元组。

```ts
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;

  console.log(inputString);
  console.log(hash);
}
```

> 在高度基于约定的 `API` 中，元组类型非常有用，每个元素的含义都是“显而易见”的。这使我们在解构时可以为变量命名任何我们想要的元素 `0` 和 `1`。

> 然而，由于并非每个用户都持有相同的观点，因此重新考虑使用具有描述性属性名称的对象是否更适合您的 `API` 可能会更好。

除了长度检查外，像这样的简单元组类型等效于为特定索引声明属性并使用数字字面类型声明长度的数组版本的类型。

```ts
// 译者注: 上面这段话的意思是，简单的元组类型（如上面例子中的StringNumberPair）和数组类型是等价的，只是数组类型会声明特定索引位置的属性，并使用数字字面量类型来声明长度。
interface StringNumberPair {
  // 专用属性
  length: 2;
  0: string;
  1: number;

  // 其他 'Array<string | number>' 成员...
  slice(start?: number, end?: number): Array<string | number>;
}
```

元组可以通过在元素类型后面写一个问号（`?`）来拥有可选属性。可选元素只能出现在最后，并且影响长度的类型。

```ts
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;

  const z: number | undefined;

  console.log(`Provided coordinates had ${coord.length} dimensions`);
  // (property) length: 2 | 3
}
```

元组也可以拥有剩余元素，剩余元素必须是数组/元组类型。

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

`StringNumberBooleans` 描述了一个元组，其前两个元素分别是字符串和数字，但其后可以有任意数量的布尔值。

`StringBooleansNumber` 描述了一个元组，其第一个元素是字符串，然后是任意数量的布尔值，并以数字结尾。

`BooleansStringNumber` 描述了一个元组，其开始元素是任意数量的布尔值，并以字符串和数字结尾。

带有剩余元素的元组没有固定的“长度”-它只有一组不同位置的已知元素。

```ts
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```

为什么可选和剩余元素很有用？因为它允许 `TypeScript` 与参数列表对应。元组类型可以用于剩余参数和参数，使得以下内容：

```ts
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

基本上等同于：

```ts
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

当你想要使用剩余参数获取可变数量的参数时，这非常方便，同时你需要一定数量的最小元素，但又不想引入中间变量。

### 只读元组

关于 `tuple` 类型的最后一点注释 - `tuple` 类型有只读变体，可以在它们前面加上 `readonly` 修饰符来指定 - 就像使用数组简写语法一样。

```ts
function doSomething(pair: readonly [string, number]) {
  // ...
}
```

像您预期的那样，在 `TypeScript` 中不允许写入只读元组的任何属性。

```ts
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
}
```

不能分配给“`0`”，因为它是只读属性。

在大多数代码中，元组往往被创建并保持不变，因此在可能的情况下将类型注释为只读元组是一个很好的默认选择。这也很重要，因为带有 `const` 断言的数组字面量将被推断为只读元组类型。

```ts
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
// 类型“readonly [3, 4]”的参数不能分配给类型“[number，number]”的参数。类型“readonly [3, 4]”是“readonly”，不能分配给可变类型“[number，number]”。
```

在这里，`distanceFromOrigin` 从未修改其元素，但期望可变元组。由于 `point` 的类型被推断为 `readonly [3, 4]`，所以它不会与`[number，number]`兼容，因为该类型不能保证 `point` 的元素不会被修改。

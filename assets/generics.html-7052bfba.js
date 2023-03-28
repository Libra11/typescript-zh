import{_ as n,p as s,q as a,a1 as e}from"./framework-1cb228a4.js";const p={},t=e(`<p>软件工程的主要部分之一是构建具有明确定义和一致的 <code>API</code> 的组件，同时也是可重复使用的。能够处理今天和明天的数据的组件将为构建大型软件系统提供最灵活的功能。</p><p>在像 <code>C#</code> 和 <code>Java</code> 这样的语言中，创建可重复使用组件的主要工具之一是泛型，也就是能够创建一个可以处理多种类型而不是单一类型的组件。这允许用户消耗这些组件并使用他们自己的类型。</p><h2 id="泛型的-hello-world" tabindex="-1"><a class="header-anchor" href="#泛型的-hello-world" aria-hidden="true">#</a> 泛型的 <code>Hello World</code></h2><p>首先，让我们来做泛型的“<code>Hello World</code>”：<code>identity</code>函数。<code>identity</code>函数是一个函数，将返回传入的任何内容。你可以将其想象成类似于 <code>echo</code> 命令。</p><p>如果没有泛型，我们要么必须给身份函数指定一个特定的类型：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">identity</span><span class="token punctuation">(</span>arg<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者，我们可以使用任意类型来描述身份函数：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">identity</span><span class="token punctuation">(</span>arg<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然使用任意类型肯定是泛型的，因为它将导致该函数接受任何和所有类型的 <code>arg</code>，但当函数返回时，我们实际上失去了关于该类型的信息。如果我们传入一个数字，我们所拥有的唯一信息就是任何类型都可能被返回。</p><p>相反，我们需要一种捕获参数类型的方式，以便我们也可以用它来表示正在返回的内容。在这里，我们将使用类型变量，这是一种特殊的变量，它在类型而不是值上工作。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们现在已经向身份函数添加了一个类型变量 <code>Type</code>。这个 <code>Type</code> 允许我们捕获用户提供的类型（例如数字），以便我们稍后可以使用该信息。在这里，我们再次使用 <code>Type</code> 作为返回类型。经过检查，我们现在可以看到同一类型被用于参数和返回类型。这使我们能够在函数的一侧交换该类型信息并在另一侧输出该信息。</p><p>我们说，这个版本的身份函数是泛型的，因为它可以处理一系列类型。与使用任意类型不同，它也与使用数字作为参数和返回类型的第一个身份函数一样精确（即，它不会丢失任何信息）。</p><p>一旦我们编写了通用的<code>identity</code>函数，我们可以通过两种方式之一调用它。第一种方式是将所有参数（包括类型参数）传递给函数：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> output <span class="token operator">=</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;myString&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// let output: string;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在这里，我们明确设置 <code>Type</code> 为字符串，作为函数调用的参数之一，使用<code>&lt;&gt;</code>而不是<code>()</code>表示。</p><p>第二种方式也可能是最常见的。在这里，我们使用类型参数推断 - 也就是说，我们希望编译器根据我们传递的参数类型自动设置 <code>Type</code> 的值：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> output <span class="token operator">=</span> <span class="token function">identity</span><span class="token punctuation">(</span><span class="token string">&quot;myString&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//let output: string;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>请注意，我们不必明确传递尖括号（<code>&lt;&gt;</code>）中的类型;编译器只是查看值“<code>myString</code>”，并将 <code>Type</code> 设置为其类型。虽然类型参数推断可以是使代码更短，更易读的有用工具，但在更复杂的示例中可能需要显式传递类型参数，就像我们在上一个示例中所做的那样，当编译器无法推断类型时会发生这种情况。</p><h2 id="使用泛型类型变量" tabindex="-1"><a class="header-anchor" href="#使用泛型类型变量" aria-hidden="true">#</a> 使用泛型类型变量</h2><p>当你开始使用泛型时，你会注意到当你创建泛型函数（如 <code>identity</code> ）时，编译器会强制你在函数体中正确使用任何的泛型类型参数。也就是说，你必须将这些参数当作可以是任何类型的参数来处理。</p><p>让我们来看看之前的 <code>identity</code> 函数：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果我们想在每次调用时将参数 <code>arg</code> 的长度记录到控制台中，我们可能会写出以下代码：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">loggingIdentity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当我们这样做时，编译器会给我们一个错误，告诉我们我们正在使用 <code>arg</code> 的<code>.length</code> 成员，但是我们没有声明 <code>arg</code> 有这个成员。记住，我们之前说过这些类型变量代表任何类型，因此使用此函数的人可以传入一个数字，而数字没有<code>.length</code> 成员。</p><p>假设我们实际上打算让这个函数在数组 <code>Type</code> 上工作，而不是直接在 <code>Type</code> 上工作。由于我们正在处理数组，<code>.length</code> 成员应该是可用的。我们可以像创建其他类型的数组一样描述它：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">loggingIdentity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> Type<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你可以将 <code>loggingIdentity</code> 的类型读作“泛型函数 <code>loggingIdentity</code> 接受一个类型参数 <code>Type</code> 和一个参数 <code>arg</code>，该参数是 <code>Type</code> 类型的数组，并返回一个 <code>Type</code> 类型的数组”。如果我们传入一个数字数组，我们将得到一个数字数组，因为 <code>Type</code> 将绑定到数字。这使我们可以将泛型类型变量 <code>Type</code> 作为我们正在处理的类型的一部分，而不是整个类型，从而使我们具有更大的灵活性。</p><p>我们也可以用这种方式编写样例代码：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">loggingIdentity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 数组有.length，因此不会再出现错误</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你可能已经从其他语言中熟悉了这种类型的风格。在下一节中，我们将介绍如何创建自己的泛型类型，例如 <code>Array&lt;Type&gt;</code>。</p><h2 id="泛型类型" tabindex="-1"><a class="header-anchor" href="#泛型类型" aria-hidden="true">#</a> 泛型类型</h2><p>在之前的章节中，我们创建了可以适用于多种类型的泛型<code>identity</code>函数。在本章中，我们将探讨函数本身的泛型类型以及如何创建泛型接口。</p><p>泛型函数的类型与非泛型函数的类型相同，类型参数排在最前面，类似于函数声明：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> myIdentity<span class="token operator">:</span> <span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> Type <span class="token operator">=</span> identity<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们还可以在类型中使用不同的泛型类型参数名称，只要类型变量的数量和使用方式相同即可。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> myIdentity<span class="token operator">:</span> <span class="token operator">&lt;</span>Input<span class="token operator">&gt;</span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Input<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> Input <span class="token operator">=</span> identity<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们还可以将泛型类型写成对象字面量类型的调用签名：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> myIdentity<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">}</span> <span class="token operator">=</span> identity<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这引导我们编写我们的第一个泛型接口。让我们将前面示例中的对象字面量移动到接口中：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">GenericIdentityFn</span> <span class="token punctuation">{</span>
  <span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> myIdentity<span class="token operator">:</span> GenericIdentityFn <span class="token operator">=</span> identity<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在类似的示例中，我们可能希望将泛型参数移动到整个接口的参数中。这样我们可以看到我们泛型的类型（例如 <code>Dictionary&lt;string&gt;</code>而不仅仅是 <code>Dictionary</code>）。这使得类型参数对接口的所有其他成员可见。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">GenericIdentityFn<span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span> <span class="token punctuation">{</span>
  <span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token generic-function"><span class="token function">identity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> myIdentity<span class="token operator">:</span> GenericIdentityFn<span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">&gt;</span> <span class="token operator">=</span> identity<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>请注意，我们的示例已经稍微变化了一下。我们现在没有描述一个泛型函数，而是一个非泛型函数签名是泛型类型的一部分。当我们使用 <code>GenericIdentityFn</code> 时，我们现在还需要指定相应的类型参数（这里是：<code>number</code>），有效地锁定底层调用签名将使用什么类型。了解何时将类型参数直接放在调用签名上，何时将其放在接口本身上，将有助于描述类型中哪些方面是泛型的。</p><p>除了泛型接口之外，我们还可以创建泛型类。请注意，无法创建泛型枚举和命名空间。</p><h2 id="泛型类" tabindex="-1"><a class="header-anchor" href="#泛型类" aria-hidden="true">#</a> 泛型类</h2><p>泛型类与泛型接口有相似的结构。在类名后面使用尖括号（<code>&lt;&gt;</code>）来定义泛型类型参数列表。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">GenericNumber<span class="token operator">&lt;</span>NumType<span class="token operator">&gt;</span></span> <span class="token punctuation">{</span>
  zeroValue<span class="token operator">:</span> NumType<span class="token punctuation">;</span>
  <span class="token function-variable function">add</span><span class="token operator">:</span> <span class="token punctuation">(</span>x<span class="token operator">:</span> NumType<span class="token punctuation">,</span> y<span class="token operator">:</span> NumType<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> NumType<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> myGenericNumber <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">GenericNumber<span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
myGenericNumber<span class="token punctuation">.</span>zeroValue <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
myGenericNumber<span class="token punctuation">.</span><span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个对 <code>GenericNumber</code> 类的非常直接的使用，但你可能已经注意到没有什么限制它只能使用 <code>number</code> 类型。我们可以使用字符串或者更复杂的对象。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> stringNumeric <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">GenericNumber<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
stringNumeric<span class="token punctuation">.</span>zeroValue <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
stringNumeric<span class="token punctuation">.</span><span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>stringNumeric<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>stringNumeric<span class="token punctuation">.</span>zeroValue<span class="token punctuation">,</span> <span class="token string">&quot;test&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与接口一样，将类型参数放在类本身上可以确保该类的所有属性都使用相同的类型。</p><p>正如我们在类的部分中所介绍的那样，类有两个方面的类型：静态方面和实例方面。泛型类仅对其实例方面进行泛型，而不是对其静态方面进行泛型，因此在处理类时，静态成员不能使用类的类型参数。</p><h2 id="泛型约束" tabindex="-1"><a class="header-anchor" href="#泛型约束" aria-hidden="true">#</a> 泛型约束</h2><p>如果您记得之前的例子，有时您可能想编写一个泛型函数，该函数适用于一组类型，您对该类型集合将拥有一些知识。在 <code>loggingIdentity</code> 示例中，我们希望能够访问 <code>arg</code> 的<code>.length</code> 属性，但编译器无法证明每种类型都具有<code>.length</code> 属性，因此它警告我们不能做出这种假设。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">loggingIdentity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Property &#39;length&#39; does not exist on type &#39;Type&#39;.</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而不是处理任何类型，我们希望将此函数限制为与具有<code>.length</code> 属性的任何和所有类型一起工作。只要类型具有此成员，我们将允许它，但它需要至少具有此成员。为此，我们必须将我们的要求列为对类型的约束。</p><p>为此，我们将创建一个描述我们的约束的接口。在这里，我们将创建一个具有单个<code>.length</code> 属性的接口，然后使用此接口和关键字“<code>extends</code>”来表示我们的约束：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">Lengthwise</span> <span class="token punctuation">{</span>
  length<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token generic-function"><span class="token function">loggingIdentity</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type <span class="token keyword">extends</span> Lengthwise<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>arg<span class="token operator">:</span> Type<span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//现在我们知道它具有.length属性，因此不再报错</span>
  <span class="token keyword">return</span> arg<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于泛型函数现在受到了限制，它将不再适用于任何类型：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">loggingIdentity</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Argument of type &#39;number&#39; is not assignable to parameter of type &#39;Lengthwise&#39;.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>相反，我们需要传入具有所有所需属性的类型的值：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">loggingIdentity</span><span class="token punctuation">(</span><span class="token punctuation">{</span> length<span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token number">3</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="在泛型约束中使用类型参数" tabindex="-1"><a class="header-anchor" href="#在泛型约束中使用类型参数" aria-hidden="true">#</a> 在泛型约束中使用类型参数</h2><p>您可以声明一个由另一个类型参数约束的类型参数。例如，下面的示例中，我们想通过属性名称从对象中获取属性。我们希望确保不会意外抓取 <code>obj</code> 上不存在的属性，因此我们将在两种类型之间放置一个约束：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">getProperty</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token punctuation">,</span> Key <span class="token keyword">extends</span> <span class="token keyword">keyof</span> Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>obj<span class="token operator">:</span> Type<span class="token punctuation">,</span> key<span class="token operator">:</span> Key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> x <span class="token operator">=</span> <span class="token punctuation">{</span> a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> b<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span> c<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span> d<span class="token operator">:</span> <span class="token number">4</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">getProperty</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> <span class="token string">&quot;a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">getProperty</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> <span class="token string">&quot;m&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 显示错误：Argument of type &#39;&quot;m&quot;&#39; is not assignable to parameter of type &#39;&quot;a&quot; | &quot;b&quot; | &quot;c&quot; | &quot;d&quot;&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="在泛型中使用类类型" tabindex="-1"><a class="header-anchor" href="#在泛型中使用类类型" aria-hidden="true">#</a> 在泛型中使用类类型</h2><p>在 <code>TypeScript</code> 中使用泛型创建工厂时，有必要通过它们的构造函数引用类类型。例如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token generic-function"><span class="token function">create</span><span class="token generic class-name"><span class="token operator">&lt;</span>Type<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>c<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token keyword">new</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> Type <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">c</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更高级的示例使用原型属性来推断和约束构造函数和类类型实例之间的关系。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">BeeKeeper</span> <span class="token punctuation">{</span>
  hasMask<span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">ZooKeeper</span> <span class="token punctuation">{</span>
  nametag<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">=</span> <span class="token string">&quot;Mikle&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  numLegs<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Bee</span> <span class="token keyword">extends</span> <span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  keeper<span class="token operator">:</span> BeeKeeper <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BeeKeeper</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Lion</span> <span class="token keyword">extends</span> <span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  keeper<span class="token operator">:</span> ZooKeeper <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZooKeeper</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token generic-function"><span class="token function">createInstance</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">A</span> <span class="token keyword">extends</span> Animal<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>c<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token constant">A</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token constant">A</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">c</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">createInstance</span><span class="token punctuation">(</span>Lion<span class="token punctuation">)</span><span class="token punctuation">.</span>keeper<span class="token punctuation">.</span>nametag<span class="token punctuation">;</span>
<span class="token function">createInstance</span><span class="token punctuation">(</span>Bee<span class="token punctuation">)</span><span class="token punctuation">.</span>keeper<span class="token punctuation">.</span>hasMask<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种模式用于实现混入设计模式。</p>`,72),o=[t];function c(l,i){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","generics.html.vue"]]);export{r as default};
#What is “this” in JavaScript?

If you have been building things using JavaScript libraries, you might have noticed a particular keyword called `this`.

`this` is quite a common thing in JavaScript, but there are a quite a few developers who have taken quite some time to fully understand what `this` keyword exactly does and where should it be used in your code.

In this post I will help you understand `this` and its mechanism, in depth.

Before diving in, make sure you have **Node** installed on your system. Then, open a command terminal and run the node command.

## “this” in Global Environment

The working mechanism of `this` is not always easy to understand. To understand how `this` works, we will start looking at `this` in different environments. Let’s start by looking at the `global` environment first.

At the global level, this is equivalent to a _global object_ called `global`.

```js
this === global;
true;
```

But this is `true` only inside `node`. If we try to run this same code inside a JavaScript file, we will get the output as `false`.

To test this, create a file called `index.js` with the following code inside it:

```js
console.log(this === global);
```

Then run this file using the node command:

```js
node index.js
false
```

The reason for this is that inside a JavaScript file, `this` equates to _module.exports_ and not global.

## “this” inside Functions

The value of `this` inside a function is usually defined by the function’s call. So, `this` can have different values inside it for each execution of the function.

In your `index.js` file, write a very simple function that simply checks if `this` is equal to the `global` object.

```js
function rajat() {
  console.log(this === global);
}
rajat();
```

If we run this code using `node`, we will see the output as `true`. But we add `'use strict'` at the top of the file and run it again, we will get a `false` output because now the value of `this` is `undefined`.

To further explain `this`, let’s create a simple function that defines a Superhero’s real name and hero name.

```js
function Hero(heroName, realName) {
  this.realName = realName;
  this.heroName = heroName;
}
const superman = Hero("Superman", "Clark Kent");
console.log(superman);
```

Note that this function is not written in strict mode. Running this code in node will not get us the value of `“Superman”` and `“Clark Kent”` as we expected, but it will instead just give us an `undefined`.

The reason behind this is that since the function is not written in strict mode, `this` refers to the global object.

If we run this code in strict mode, we will get an error because JavaScript does not allow us to assign properties `realName` and `heroName` to `undefined`. This actually is a good thing because it prevents us from creating global variables.

Lastly, writing the function’s name in uppercase means that we need to call it as a constructor using the `new` operator. Replace the last two lines of the above code snippet with this:

```js
const superman = new Hero("Superman", "Clark Kent");
console.log(superman);
```

Run the `node index.js` command again, and you will now get the expected output.

## “this” inside constructors

JavaScript does not have any special constructor functions. All we can do is convert a function call into a constructor call using new operator as shown in the above section.

When a constructor call is made, a new object is created and set as the function’s `this` argument. The object is then implicitly returned from the function, unless we have another object that is being returned explicitly.

Inside the hero function write the following return statement:

```js
return {
  heroName: "Batman",
  realName: "Bruce Wayne",
};
```

If we run the node command now, we will see that the above return statement overwrites the constructor call.

The only scenario where the return statement doesn’t overwrite the constructor call is if the return statement tries to return anything that is not an object. In this case, the object will contain the original values.
“this” in Methods

When calling a function as a method of an object, this refers to the object, which is then known as the receiver of the function call.

Here, I have a method dialogue inside an object called hero. The dialogue‘s this value then refers to hero itself. So hero here will be know as the receiver of the dialogue method’s call.

```js
const hero = {
  heroName: "Batman",
  dialogue() {
    console.log(`I am ${this.heroName}!`);
  },
};
hero.dialogue();
```

This is very simply example. But in the real-world cases it can get very hard for our method to keep track of the receiver. Write the following snippet at the end of index.js.

```js
const saying = hero.dialogue();
saying();
```

Here, I am storing the reference to dialogue inside another variable and calling the variable as a function. Run this with node and you will see that this returns an undefined because the method has lost track of the receiver. this now refers to global instead of hero.

The loss of receiver usually happens when we are passing a method as a callback to another. We can either solve this by adding a wrapper function or by using bind method to tie our this to a specific object.
call() and apply()

Though a function’s this value is set implicitly, we can also call function with explicit this argument call() and apply().

Lets restructure the previous sections code snippet like this:

```js
function dialogue() {
  console.log(`I am ${this.heroName}`);
}
const hero = {
  heroName: "Batman",
};
```

We need to connect the dialogue function with the hero object as a receiver. To do so, we can either use call() or apply() like this:

dialogue.call(hero)
// or
dialogue.apply(hero)

But if you are using call or apply outside of strict mode, then passing null or undefined using call or apply will be ignored by the JavaScript engine. This is one of the reasons why it is usually suggested to always write our code in strict mode.
bind()

When we pass a method as a callback to another function, there is always a risk of losing the intended receiver of the method, making the this argument set to the global object instead.

The bind() method allows us to permanently tie a this argument to a value. So in the below code snippet, bind will create a new dialogue function and set its this value to hero.

```js
const hero = {
  heroName: "Batman",
  dialogue() {
    console.log(`I am ${this.heroName}`);
  },
};
setTimeOut(hero.dialogue.bind(hero), 1000);
```

By doing so, our this cannot be changed by even call or apply methods.
Catching “this” inside an Arrow Function

Using this with an arrow function is quite different from using it with any other kind of JavaScript function. An arrow function uses the this value from its enclosing execution context, since it does have one of its own.

An arrow function permanently captures the this value, preventing apply or call from changing it later on.

To explain how this works with regards to the arrow functions, let’s write the arrow function shown below:

```js
const batman = this;
const bruce = () => {
  console.log(this === batman);
};
bruce();
```

Here, we are storing the value of a this in a variable and then comparing the value with a this value that is inside an arrow function. Running node index.js in our terminal should give us true as output.

An arrow function’s this value cannot be set explicitly. Also, the arrow function will ignored any attempt from us at passing a value to this using methods like call, apply, and bind. An arrow function will refer to the this value that was set when the arrow function was created.

An arrow function can also not be used as a constructor. Hence, we cannot assign properties to this inside an arrow function.

So what can arrow functions do in regards to this?

Arrow functions can help us access this within a callback. To explain how this is done. Take a look at the counter object that I have written below:

```js
const counter = {
  count: 0,
  increase() {
    setInterval(function () {
      console.log(++this.count);
    }, 1000);
  },
};
counter.increase();
```

Running this code using node index.js will only give an increase list of NaNs. This is because this.count is not referring to the counter object. It actually refers to the global object.

To make this counter work, lets rewrite it using an arrow function.

```js
const counter = {
  count: 0,
  increase() {
    setInterval(() => {
      console.log(++this.count);
    }, 1000);
  },
};
counter.increase();
```

Our callback now uses this binding from the increase method, and the counter now works as it should.

Note: Do not try to write this.count + 1 instead of ++this.count. The former of these two will only increase the value of count once, and return the that value on each iteration.

## “this” in Classes

Classes are one of the most important parts of any JavaScript apps. Lets see how this behaves inside a class.

A class generally contains a constructor, where this would refer to any newly created object.

But in case of methods, this can also refer to any other value if the method is called as an ordinary function. And just like a method, classes can also lose track of the receiver.

Let’s re-create the Hero functions that we have seen earlier as a class. This class will contain a constructor and a dialogue() method. Finally, we create an instance of this class and call the dialogue method.

```js
class Hero {
  constructor(heroName) {
    this.heroName = heroName;
  }
  dialogue() {
    console.log(`I am ${this.heroName}`);
  }
}
const batman = new Hero("Batman");
batman.dialogue();
```

this inside the constructor refers to the newly created instance of that class. When we call batman.dialogue(), we invoke dialogue() as a method with batman as a receiver.

But if we store a reference to the dialogue() method, and later invoke it as a function, we once again lose the receiver of the method and the this argument now refers to undefined.

const say = batman.dialogue();
say();

The reason for error is that JavaScript classes are implicitly in strict mode. We are invoking say() as an function without any autobinding. To solve this, we will need to manually bind() to tie this dialogue() function to batman.

const say = batman.dialogue.bind(batman);
say();

We can also do this binding inside the `constructor` method.

## To sum it up…

We need to use this in JavaScript like we need to pronouns in English. Take these two sentences.

- Rajat loves DC Comics.
- Rajat also loves Marvel movies.

We use pronouns to combine these two sentences. so these two sentences now become:

> Rajat loves DC Comics, and he also loves Marvel Comics

This short grammar lesson perfectly explains the importance of this in JavaScript. Just like how the pronoun he connects the two sentences, this acts as a shortcut to refer the same thing again.

I hope this post helped you clear any confusions you had about this in JavaScript and you now where and how to use this simple but extremely important keyword in your JavaScript code.

Source: [What is “this” in JavaScript? by Rajat S.](https://blog.bitsrc.io/what-is-this-in-javascript-3b03480514a7)

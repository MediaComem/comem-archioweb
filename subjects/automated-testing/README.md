# Automated Testing

Learn about the various kinds of automated tests.

**Going further**

* [Set up automated testing for an Express.js REST API](https://github.com/MediaComem/comem-archioweb/blob/master/guides/set-up-automated-tests.md)

<!-- START doctoc -->
<!-- END doctoc -->



## What is automated testing?

<!-- slide-front-matter class: center, middle -->

<p class='center'><img class='w60' src='images/automated-tests.png' /></p>

### Manual testing

When writing or modifying software, especially large software, you must
regularly **test** it to make sure it works. **Manual testing** is basically
testing the software yourself, whether it's a desktop or mobile application, or
a website. You'll browse through the pages or screens, fill and submit forms,
trigger actions, etc.

In a large company, this might be handled by specialized [Quality Assurance
(QA)][qa] engineers. Whether you or a QA engineer is doing it, manual testing
has certain disadvantages:

* It is **time-consuming**. Testing a large software application manually can
  take hours or even days. You might skip some tests to save time, allowing bugs
  to stay hidden.
* It is **boring** and **repetitive**. This makes it more likely that you will
  make a mistake while testing and miss a bug.

### Automated testing

Running functions, making HTTP calls or clicking on specific buttons does not
have to be done by a human being. A program can do it just as well, *and it will
never get bored doing it*.

[**Test automation**][automated-tests] is the use of special **testing
software**:

* The test software is **separate from the software being tested**.
* It **executes tests automatically** instead of manually.
* It compares **actual outcomes** (what actually happens) versus **expected**
  outcomes (what you expected to happen when writing the test).

### Automated vs. manual

**Automated tests are not a replacement for manual tests**. They are
complementary in that they can be used to accelerate or automate tests that can
be run by a machine instead of a human.

Manual testers still have their place, but are better employed running complex
or hard-to-reproduce tests which actually require a human being at the wheel, or
finding ways to break your application.

### Test frameworks

There are many test frameworks written in various languages. These are all
**test runners**, i.e. they can be used to write and execute tests:

Frameworks                                                                             | Tests written in
:------------------------------------------------------------------------------------- | :------------------
[Mocha][mocha], [Jasmine][jasmine], [Jest][jest], [SuperTest][supertest], [Tape][tape] | [JavaScript][js]
[JUnit][junit], [JMeter][jmeter], [Robotium][robotium]                                 | [Java][java]
[PHPUnit][phpunit]                                                                     | [PHP][php]
[RSpec][rspec], [test-unit][ruby-test-unit]                                            | [Ruby][ruby]
[doctest][doctest], [unittest][python-unittest]                                        | [Python][python]
[Go Test][go-test]                                                                     | [Go][go]
[Quick][quick]                                                                         | [Swift][swift]
[kotlin.test][kotlin.test]                                                             | [Kotlin][kotlin]
[Mix Test][mix-test]                                                                   | [Elixir][elixir]
[Elm Test][elm-test]                                                                   | [Elm][elm]
[Apium][appium], [Cucumber][cucumber], [Selenium WebDriver][selenium-webdriver]        | *Various languages*

#### Which test framework should I use?

It depends on what kind of test you want to write.

**If you want to test an individual function**, a PHP function for example, you
must use a **test framework written in the same language**, such as
[PHPUnit][phpunit].

However, **if you want to test an API** or drive a mobile application or
website, **it does not matter in which language the test framework is written**,
as long as it can make the required HTTP calls or click on the correct buttons.

For example:

* [SuperTest][supertest] is a JavaScript tool to test APIs. It could be used to
  test an API implemented in PHP with Laravel, or with any other language or
  framework.
* [Selenium WebDriver][selenium-webdriver] is a tool to automate browser tests.
  It can test any web application or site, regardless of the language or
  framework used to implement that application or site.

### Types of automated tests

There are various types of automated tests, and some of these types overlap. Not
everybody agrees how they should be called:

<!-- slide-column -->

<img class='w100' src='images/pyramid-1.png' />

<!-- slide-column -->

<img class='w100' src='images/pyramid-2.png' />

<!-- slide-column -->

<img class='w100' src='images/pyramid-3.png' />

### Yet another classification

This is how we will separate the 3 main types of tests in this guide:

Type                                     | What is tested                           | Properties
:--------------------------------------- | :--------------------------------------- | :---------------------------
[Unit tests][unit-testing]               | Things in isolation                      | Fastest, easiest to maintain
[Integration tests][integration-testing] | Things together                          |
[End-to-end tests][system-testing]       | Whole system from the user's perspective | Slower, harder to maintain

There are also other specialized types of tests which we will not focus on, like
[performance tests][performance-testing], which can be used to test the response
time or scalability of software or infrastructure.



## Unit tests

<!-- slide-front-matter class: center, middle -->

<p class='center'><img class='w80' src='images/unit-tests.png' /></p>

## What is a unit test?

The goal of [unit testing][unit-testing] is to test **individual units of source
code in isolation**. You can view a **unit** as the **smallest testable part of
your software**.

For example, you might test an individual JavaScript function:

```js
function add(a, b) {
  return a + b;
}
```

### How to write a unit test

When writing a unit test for a piece of code, you want to identify the
**inputs** and **outputs** (or side effects) of that code.

```js
function add(a, b) {
  return a + b;
}
```

In this case:

* There are two numbers as inputs, `a` and `b`.
* There is one number as output.

### Assertions

Once you have the inputs and outputs, you want to define **assertions** on how
that code should behave.

```js
function add(a, b) {
  return a + b;
}
```

Assertions are the outputs you expect for specific inputs.
For example:

* For inputs 2 and 3, the **expected** output is 5.
* For inputs -3 and 4, the **expected** output is 1.
* For inputs 10 and -12, the **expected** output is -2.

When implementing unit tests, you will execute the code and use assertions to
compare the **actual** output value with the **expected** one.

### An implementation in JavaScript

For example, this is how you could write those assertions with the
[Mocha][mocha] test framework and the [Chai][chai] assertion library:

```js
describe('add', function() {
  it('should add two numbers together', function() {
    const actual = add(2, 3);
    const expected = 5;
    expect(actual).to.equal(expected);
  });

  it('should add a positive number to a negative number', function() {
    expect(add(-3, 4)).to.equal(1);
  });

  it('should add a negative number to a positive number', function() {
    expect(add(10, -12)).to.equal(-2);
  });
});
```

### Why write unit tests?

Unit tests allow to isolate each part of a program and **prove that each
individual part is correct**.

> Unit tests provide a strict, written contract.

Unit tests **find problems early in the development cycle**.

> The process of writing unit tests forces the programmer to think through
> inputs, outputs, and error conditions, and thus more crisply define the unit's
> desired behavior. The cost of finding a bug when the code is first written is
> considerably lower than the cost of detecting, identifying, and correcting the
> bug later.

Unit tests may **reduce uncertainty** in the units themselves.

> By testing the parts of a program first and then testing the sum of its parts,
> integration testing becomes much easier.

Unit tests provide a sort of **living documentation** of the system.

> Looking at a unit's tests can give a basic understanding of the unit's
> interface.

#### Disadvantages of unit tests

Unit tests **will not catch every error in the program**, because they cannot
evaluate every execution path in any but the most trivial programs. They will
not catch integration errors or broader system-level errors.

Software testing is a combinatorial problem. For every logical branch (true or
false), a test case must be written, which is quite **time-consuming** and might
not be worth the effort.

To obtain the intended benefits from unit testing, **rigorous discipline is
needed** throughout the software development process. You must keep track of
which tests have been written already, which are missing, and ensure that
failures are reviewed and addressed immediately.



## Integration tests

When doing integration tests, individual software **units are combined and
tested as a group**. This **ensures that components work well together**, not
only individually as tested by unit tests.

<p class='center'><img class='w70' src='images/integration-test-exec.jpg' /></p>

The tools used to write integration tests are often the same as for unit tests,
so you do not need to install any new library.

### Advantages and disadvantages of integration testing

**Advantages**

* Integration tests help **discover interfacing problems** between components.
* Integration tests **catch system-level issues**, such as broken database
  schema, mistaken cache integration, and so on, which might be difficult to
  identify with unit tests.

**Disadvantages**

* **Finding bugs is more difficult** than with unit tests. When an integration
  test fails, since multiple components are combined, it may be unclear which
  one is causing the bug.



## API tests

[API testing][api-testing] is a part of [integration
testing][integration-testing].

Specifically, it involves **testing application programming interfaces (APIs)**
directly to **determine if they meet expectations** for functionality,
reliability, performance and security.

For example, your application may provide a [RESTful][rest] API or an [RPC][rpc]
API accessible over the Internet. Automated tests can make HTTP calls to these
APIs and compared actual outcomes with expected outcomes.

> API tests are a type of integration test since they test all components of
> your API working together.

### Benefits of API tests

API testing is considered critical for automating testing because APIs now serve
as the primary interface to application logic. Higher level end-to-end tests are
also more difficult to maintain with the short release cycles and frequent
changes commonly used with iterative software development.

<p class='center'><img class='w80' src='images/api-test-exec.jpg' /></p>



## End-to-end tests

End-to-end tests, or [Graphical User Interface (GUI) tests][gui-testing] are
automated tests focused on testing the whole system from the user perspective.

<p class='center'><img class='w70' src='images/e2e-test-exec.jpg' /></p>

For example, testing tools like [Selenium WebDriver][selenium-webdriver] allow
you to control a browser and simulate a user by navigating to web pages, filling
forms, clicking buttons, etc.



## Test-Driven Development (TDD)

<!-- slide-front-matter class: center, middle -->

<p class='center'><img class='w80' src='images/tdd.jpeg' /></p>

### What is test-driven development?

As the name implies, [test-driven development][tdd] is **driven by tests**. When
you want to add a new feature to your software, instead of developing your code
first, then writing your tests, you use this process:

1. First, **write a failing test** for the feature.

   > The test will always fail at first because the feature does not exist yet.
   > You do not have to write a complete test either. Just enough to make it
   > fail.
1. Then, **implement the necessary code** until your test succeeds.

  > You do not have to implement the complete feature. Just enough to make your
  > test pass.
1. Finally, **refactor your code** to improve it if possible and if necessary.

Continue this process until the feature is finalized.

### Why the hell would I do that?

Working like this will improve code quality because it **forces you to really
think about your features up front** to write the tests, before even starting to
write one line of production code. This will improve your design.

Imagine that you are always working with this process. **At any given point in
time, virtually all your code is covered by at least one automated test.** You
will end up with a very high-quality test suite for your project.

Having a high-quality test suite will:

* Help ensure you maintain high quality by preventing
  [regression][regression-testing].
* Help someone who is not familiar with the code (*that could be you in 6
  months*) be sure that they have not broken anything when adding new features
  or fixing bugs.

### The three laws of TDD

<!-- slide-front-matter class: center, middle, image-header -->

<img class='w50' src='images/the-three-laws-of-tdd.jpg' />



## References

* [Test Automation][automated-tests]
  * [Unit Testing][unit-testing]
  * [Integration Testing][integration-testing]
  * [System Testing][system-testing]
  * [API Testing][api-testing]
  * [GUI Testing][gui-testing]
  * [Performance Testing][performance-testing]
* [Smartbear - Automated Testing](https://smartbear.com/learn/automated-testing/)
* [The 3 Types of Automated Tests](https://learn.techbeacon.com/units/3-types-automated-tests)
* [Atlassian CI/CD - Types of Software Testing](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing)
* [I Don't Write Unit Tests Because... The Excuses](https://edwardthienhoang.wordpress.com/2014/10/29/i-dont-write-unit-tests-because-the-excuses/)
* [Test-Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)
  * [*YouTube:* GOTO 2017 – The Scribe's Oath – Robert C. Martin](https://youtu.be/Tng6Fox8EfI)
  * [*YouTube:* The Future of Programming – Robert C. Martin](https://youtu.be/ecIWPzGEbFc)
  * [*YouTube:* Expecting Profesionnalism – Robert C. Martin](https://youtu.be/BSaAMQVq01E)



[api-testing]: https://en.wikipedia.org/wiki/API_testing
[appium]: https://appium.io
[automated-tests]: https://en.wikipedia.org/wiki/Test_automation
[chai]: https://www.chaijs.com
[cucumber]: https://cucumber.io/
[doctest]: https://pythontesting.net/framework/doctest/doctest-introduction/
[elixir]: https://elixir-lang.org
[elm]: https://elm-lang.org
[elm-test]: https://github.com/elm-explorations/test
[go]: https://golang.org
[go-test]: https://golang.org/pkg/testing/
[gui-testing]: https://en.wikipedia.org/wiki/Graphical_user_interface_testing
[integration-testing]: https://en.wikipedia.org/wiki/Integration_testing
[jasmine]: https://jasmine.github.io
[java]: https://www.java.com
[jest]: https://jestjs.io
[jmeter]: https://jmeter.apache.org/
[js]: https://en.wikipedia.org/wiki/JavaScript
[junit]: https://junit.org
[kotlin]: https://kotlinlang.org
[kotlin.test]: https://kotlinlang.org/api/latest/kotlin.test/
[mix-test]: https://hexdocs.pm/mix/Mix.Tasks.Test.html
[mocha]: https://mochajs.org
[node]: https://nodejs.org
[performance-testing]: https://en.wikipedia.org/wiki/Software_performance_testing
[php]: http://php.net
[phpunit]: https://phpunit.de
[python]: https://www.python.org
[python-unittest]: https://docs.python.org/3/library/unittest.html
[qa]: https://en.wikipedia.org/wiki/Quality_assurance
[quick]: https://github.com/Quick/Quick
[regression-testing]: https://en.wikipedia.org/wiki/Regression_testing
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[robotium]: https://github.com/RobotiumTech/robotium
[rpc]: https://en.wikipedia.org/wiki/Remote_procedure_call
[rspec]: http://rspec.info
[ruby]: https://www.ruby-lang.org
[ruby-test-unit]: https://test-unit.github.io
[selenium-webdriver]: https://www.seleniumhq.org/projects/webdriver/
[supertest]: https://github.com/visionmedia/supertest
[swift]: https://swift.org
[system-testing]: https://en.wikipedia.org/wiki/System_testing
[tape]: https://github.com/substack/tape
[tdd]: https://en.wikipedia.org/wiki/Test-driven_development
[unit-testing]: https://en.wikipedia.org/wiki/Unit_testing
[vscode]: https://code.visualstudio.com

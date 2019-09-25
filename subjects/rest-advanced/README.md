# REST In Depth

Learn about more advanced [REST][rest] concepts like [HATEOAS][hateoas], and the
various ways REST APIs are implemented in the wild, from "practical REST" to
"true REST".

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Richardson Maturity Model

<!-- slide-front-matter class: center, middle, image-header -->

<img src='images/richardson-maturity-model.png' class='w90' />



### How RESTful is my API?

The technologies of the World Wide Web form an amazing technology stack you can
pick from when developing your REST API. However, not everyone understands all
of these technologies or how to use them to their fullest potential.

<!-- slide-column -->

The [REST maturity model developed by Leonard Richardson][rest-maturity] splits
the web technologies used to develop REST APIs into a stack with 4 levels.

Web developers tend to pick technologies from the bottom of the stack.

<!-- slide-column 60 -->

<img src='images/richardson-maturity-model-small.png' class='w100' />



## Resources

**Documentation**

* [GitHub REST API version 3][github-api]
* [Twitter REST API][twitter-api]
* [Foxy Hypermedia REST API][foxy-api]

**Further reading**

* [Architectural Styles and the Design of Network-based Software Architectures (Roy Fielding)][roy-fielding-thesis]
* [Justice Will Take Us Millions Of Intricate Moves - Act Three: The Maturity Heuristic (Leonard Richardson)][rest-maturity]
  * [Richardson Maturity Model (Martin Fowler)][rest-maturity-fowler]
  * [4 Maturity Levels Of REST API Design (Guy Levin)][rest-maturity-levin]
* [How to GET a Cup of Coffee][get-coffee]
* [Standards.REST: don't reinvent the wheel, use fantastic wheels][rest-standards]



[foxy-api]: https://api.foxycart.com/docs
[get-coffee]: https://www.infoq.com/articles/webber-rest-workflow/
[github-api]: https://developer.github.com/v3/
[hateoas]: https://en.wikipedia.org/wiki/HATEOAS
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[rest-maturity]: https://www.crummy.com/writing/speaking/2008-QCon/act3.html
[rest-maturity-fowler]: https://martinfowler.com/articles/richardsonMaturityModel.html
[rest-maturity-levin]: https://blog.restcase.com/4-maturity-levels-of-rest-api-design/
[rest-standards]: https://standards.rest
[roy-fielding-thesis]: https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
[twitter-api]: https://developer.twitter.com/en/docs/api-reference-index
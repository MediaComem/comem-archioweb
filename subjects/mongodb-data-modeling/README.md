# MongoDB data modeling

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Modeling rules](#modeling-rules)
- [One-to-one relationships](#one-to-one-relationships)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Modeling rules

<!-- slide-front-matter class: center, middle -->

Creating a data model with MongoDB does not have to follow the rules that apply for relational databases. Often, they should not.



## One-to-one relationships

* Consider theses questions: is this a composition relationship (containment)? Is this "aggregate" of documents often used at the same time (i.e. can we reduce chattiness)? Would embedding lead to "a lot" of data duplication?

Normalized data model (references) vs. Embedded data model (sub-documents)

TODO: examples



## Resources

https://docs.mongodb.com/manual/core/data-modeling-introduction/

https://docs.mongodb.org/getting-started/shell/

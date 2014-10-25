ECMAscript 6 Walkthroughs
=========================

Contains a collection of walkthroughs and examples for the new and upcoming features in ECMAscript 6.

How to contribute
=================

Coming up with a way to allow people to contribute guided walkthroughs...

Local Testing
=============

A simple static server has been included and requires nodejs. A package.json has been included for installing dependencies. To install and run:

```shell
git clone https://github.com/realistschuckle/es6-walkthroughs.git
npm install
gulp dev
```

In another shell...

```shell
npm start
```
Change ES6 modules in `_assets` and **gulp** will build the ES5 versions and
put them in `assets`. When you commit, commit the changes in both `_assets` and
`assets` so GitHub pages will work appropriately.

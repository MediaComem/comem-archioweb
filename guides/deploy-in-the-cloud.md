# Deploying an Express.js application with Heroku & MongoDB Atlas

This guide will walk you through the process of deploying an Express.js
application in the [cloud][cloud]. You will use [Heroku][heroku], a
[Platform-as-a-Service][paas] cloud, to run your application; and [MongoDB
Atlas][mongodb-atlas], a database cloud, to host your database.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Name your project](#name-your-project)
- [Create an Express.js application](#create-an-expressjs-application)
  - [Make it a Git repository](#make-it-a-git-repository)
  - [Push it to GitHub](#push-it-to-github)
- [Deploy the application on Heroku](#deploy-the-application-on-heroku)
- [Create a database on MongoDB Atlas](#create-a-database-on-mongodb-atlas)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Name your project

> "There are only [two hard things][two-hard-things] in Computer Science: cache
> invalidation and **naming things**."
>
> -- Phil Karlton

Choose a good name for your project. You will have to use it to name several
things: your Express.js application, the Heroku application, the MongoDB cluster
and database, etc.



## Create an Express.js application

Install the [Express.js generator][express-generator] if you haven't already:

```bash
$> npm install -g express-generator
```

Generate a new [Express][express] application:

```bash
$> cd /path/to/projects
$> express my-project
```

Make sure it works:

```bash
$> cd my-project
$> npm install
$> npm start
```

Check that you can access it at [http://localhost:3000](http://localhost:3000).
Once you're sure it works, you can stop it with `Ctrl-C`.

### Make it a Git repository

To deploy code on Heroku, you will need to use [Git][git]. Initialize a Git
repository in the app's directory:

```bash
$> git init
```

Add a `.gitignore` file to ignore the `node_modules` directory (dependencies
will be automatically installed by Heroku when you push):

```bash
$> echo node_modules > .gitignore
```

Your `.gitignore` file should look like this:

```txt
node_modules
```

Commit all the app's files:

```bash
$> git add --all
$> git commit -m "Initial commit"
```

### Push it to GitHub

* Push
* Add collaborators



## Deploy the application on Heroku

Heroku: one person in each group

![Heroku dashboard][./images/heroku-01-dashboard.png]
![Create an application][./images/heroku-02-create-app.png]
![Add collaborators][./images/heroku-03-add-collaborator.png]
![Configure the application][./images/heroku-04-configure-app.png]
![Configure environment variables][./images/heroku-05-config-vars.png]



## Create a database on MongoDB Atlas

Register a MongoDB account to use their Atlas service: https://www.mongodb.com/try

![Register a MongoDB account][./images/mongodb-atlas-01-register.png]
![Choose the free plan][./images/mongodb-atlas-02-plan.png]
![Create a MongoDB cluster][./images/mongodb-atlas-03-cluster.png]
![Configure the cluster][./images/mongodb-atlas-04-configure-cluster.png]
![Configure network access][./images/mongodb-atlas-05-network-access.png]
![Allow access from anywhere][./images/mongodb-atlas-06-whitelist-ip.png]
![Configure database access][./images/mongodb-atlas-07-database-access.png]
![Add a database user][./images/mongodb-atlas-08-add-user.png]
![Connect to the cluster][./images/mongodb-atlas-09-connect.png]
![Connect your application][./images/mongodb-atlas-10-connect-app.png]
![Connect a Node.js application][./images/mongodb-atlas-11-connect-nodejs.png]



[cloud]: https://en.wikipedia.org/wiki/Cloud_computing
[express]: https://expressjs.com
[express-generator]: https://www.npmjs.com/package/express-generator
[git]: https://git-scm.com
[heroku]: https://heroku.com
[mongodb-atlas]: https://www.mongodb.com/cloud/atlas
[paas]: https://en.wikipedia.org/wiki/Platform_as_a_service
[two-hard-things]: https://martinfowler.com/bliki/TwoHardThings.html

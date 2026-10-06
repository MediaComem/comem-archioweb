# Deploy an Express.js application with Render & MongoDB Atlas

This guide will walk you through the process of deploying an Express.js
application in the [cloud][cloud]. You will use [Render][render], a
[Platform-as-a-Service][paas] cloud, to run your application; and [MongoDB
Atlas][mongodb-atlas], a database cloud, to host your database.

When working as a team, only one member of the team needs to follow this guide.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Requirements](#requirements)
- [Name your project](#name-your-project)
- [Create an Express.js application](#create-an-expressjs-application)
  - [Make it a Git repository](#make-it-a-git-repository)
  - [Push it to GitHub](#push-it-to-github)
- [Connect your application to a database](#connect-your-application-to-a-database)
- [Deploy the application to Render](#deploy-the-application-to-render)
- [Create a MongoDB cluster on MongoDB Atlas](#create-a-mongodb-cluster-on-mongodb-atlas)
- [Provide your database URL to your Render application](#provide-your-database-url-to-your-render-application)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

- [Node.js][node] 26 (22.9+ and 24 also work)
- [Git][git]
- A [GitHub][github] account
- A [Render][render] account
- A [MongoDB Atlas][mongodb-atlas] account

## Name your project

> "There are only [two hard things][two-hard-things] in Computer Science: cache
> invalidation and **naming things**."
>
> -- Phil Karlton

Choose a good name for your project. You will have to use it to name several
things: your Express.js application, the Render application, the MongoDB cluster
and database, etc.

## Create an Express.js application

Copy the [starter application][express-starter] from the Express subject into a
new directory, and install its dependencies:

```bash
$> npx degit MediaComem/comem-archioweb/subjects/express/starter my-api
$> cd my-api
$> npm install
```

Start it:

```bash
$> npm start
```

Check that you can access the [Express][express] application at
[http://localhost:3000](http://localhost:3000). Once you're sure it works, you
can stop it with `Ctrl-C`.

> The starter requires **Node.js 22.9 or later**. If you copied it earlier in
> the course, check the `engines` field of your `package.json`: it should be
> `"node": "^22.9 || ^24 || ^26"`. Render uses this field to choose the Node.js
> version that runs your application.

### Make it a Git repository

To deploy code on Render, you will need to use [Git][git]. Initialize a Git
repository in the application's directory:

```bash
$> git init
```

The starter comes with a `.gitignore` file that ignores the `node_modules`
directory (dependencies will be automatically installed by Render when you
push):

```txt
/.env
/node_modules
```

Commit all the app's files:

```bash
$> git add --all
$> git commit -m "Initial commit"
```

### Push it to GitHub

Register a [GitHub][github] account if you haven't already.

Create a **private** repository on GitHub, then add it as a remote on your
machine and push your new application to it:

```bash
$> git branch -M main
$> git remote add origin git@github.com:your-github-username/your-repo-name.git
$> git push -u origin main
```

If you have team members, you may add them in the repository's settings on
GitHub so that they also have push access:

![GitHub: manage repository access](./images/github-manage-access.png)

## Connect your application to a database

Add [Mongoose][mongoose] to your application:

```bash
$> npm install mongoose
```

Then add the following code to the `app.js` file, below the other imports (if
you followed the [Mongoose
subject](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/mongoose?home=MediaComem%2Fcomem-archioweb%23readme),
you already have it):

```js
import mongoose from 'mongoose';

await mongoose.connect(
  process.env.DATABASE_URL ?? 'mongodb://127.0.0.1/your-app-name'
);
```

> The application connects to the database URL in the `$DATABASE_URL`
> [environment variable][node-process-env], or to your local database if that
> variable is not set.

Stage all changes (including the changes made to `package.json` and
`package-lock.json` as a result of the `npm install mongoose` command). Then
commit and push this change:

```bash
$> git add .
$> git commit -m "Connect to a MongoDB database with Mongoose"
$> git push origin main
```

## Deploy the application to Render

Register a [Render][render] account if you haven't already. If you register
through GitHub, you will not have to link the two accounts together later.

> Render's interface may have changed since the following screenshots were
> taken. Look for the equivalent options.

![Render: register using an existing GitHub Account](./images/render-01-signup.png)

Go to your dashboard and create a new Web Service:

![Render: dashboard](./images/render-02-create.png)

Connect your GitHub repository to Render by selecting the one that contains
your app from the list.

![Render: connect to repo](./images/render-03-connect.png)

Name the application, choose the region and enter the commands used to build and
start your app (`npm install` and `npm start`). The branch should be set to
`main`.

![Render: setup your application](./images/render-04-setup.png)

Select the free plan and finish the creation process.

![Render: end the web service creation process](./images/render-05-plans.png)

Once you submit the form, Render will automatically try to deploy your app. You
will be able to see live logs. Pretty cool, but be aware that deploys on the
free plan can take a little while. Be patient.

![Render: first deploy](./images/render-06-deploy.png)

But... **Oh no, the deploy fails after a little while!** Look at the logs. Think
about it for a second. What could've gone wrong?

```txt
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
    at _handleConnectionErrors (/opt/render/project/src/node_modules/mongoose/lib/connection.js:1175:11)
    ...
```

Remember this piece of code?

```js
await mongoose.connect(
  process.env.DATABASE_URL ?? 'mongodb://127.0.0.1/your-app-name'
);
```

At this point, our app is looking for a `DATABASE_URL` environment variable.
Unfortunately we have not configured it yet, so the app is trying to connect to
a local MongoDB server, which does not exist on Render. The app never starts
listening for requests, so Render considers that the deploy has failed.

We must therefore setup a database elsewhere and provide its URL to Render.
Let's start by setting up a [MongoDB Atlas][mongodb-atlas] cluster.

## Create a MongoDB cluster on MongoDB Atlas

Register a free [MongoDB Atlas][mongodb-try] account for a cloud deployment:

> MongoDB Atlas's interface has changed since the following screenshots were
> taken. Look for the equivalent options, e.g. the **Free** cluster tier.

![MongoDB Atlas: register an account](./images/mongodb-atlas-01-register.png)

Choose the free cluster plan:

![MongoDB Atlas: choose the free plan](./images/mongodb-atlas-02-plan.png)

Create a cluster if one has not already been created for you:

![MongoDB Atlas: create a cluster](./images/mongodb-atlas-03-create-cluster.png)

Configure your cluster. The provider and region are unimportant as long as you
choose one that is free, but you should at least change the default name:

![MongoDB Atlas: configure the cluster](./images/mongodb-atlas-04-configure-cluster.png)

You must configure network access to your cluster to allow connections from the
outside world:

![MongoDB Atlas: configure network access](./images/mongodb-atlas-05-network-access.png)

For the purposes of this guide, you can allow access from anywhere, which should
set the access list entry to `0.0.0.0/0` (i.e. any source IP address is allowed
to access the cluster):

![MongoDB Atlas: allow access from anywhere](./images/mongodb-atlas-06-whitelist-ip.png)

> In a real production environment, you should only allow the exact IP addresses
> of your servers so that only they can connect to your cluster, for improved
> security.

You must then create a database user to connect with:

![MongoDB Atlas: configure database access](./images/mongodb-atlas-07-database-access.png)

Set the credentials for the new database user:

![MongoDB Atlas: add a database user](./images/mongodb-atlas-08-add-user.png)

To obtain the connection URL for your cluster, go to Clusters and click on your
cluster's Connect button:

![MongoDB Atlas: connect to the cluster](./images/mongodb-atlas-09-connect.png)

You want to connect an application:

![MongoDB Atlas: connect your application](./images/mongodb-atlas-10-connect-app.png)

And you are using a Node.js driver. You should copy the provided connection URL:

![MongoDB Atlas: connect a Node.js application](./images/mongodb-atlas-11-connect-nodejs.png)

The connection URL Atlas gives you looks like this (the screenshot above shows
an older format):

```txt
mongodb+srv://<db_username>:<db_password>@your-cluster-name.abcd.mongodb.net/?retryWrites=true&w=majority&appName=…
```

You must make two changes to it:

- Replace `<db_password>` with the password of the database user you just
  created (and `<db_username>` with its name, if Atlas has not already done so).
  If the password contains characters such as `@`, `:`, `/` or `?`, you must
  [URL-encode][url-encoding] them (e.g. `@` becomes `%40`).
- **Add a database name after the `/`**, before the `?`. You should name it
  after your project:

  ```txt
  mongodb+srv://admin:secret@your-cluster-name.abcd.mongodb.net/my-api?retryWrites=true&w=majority&appName=…
  ```

  MongoDB creates the database automatically the first time you use it.
  Without a name, your data ends up in a database called `test`.

> If you have [installed `mongosh`](./install-mongodb.md), you can connect to your
> new MongoDB cluster from your machine with the command:
>
>     mongosh "mongodb+srv://admin:secret@your-cluster-name.abcd.mongodb.net/my-api?retryWrites=true&w=majority"

## Provide your database URL to your Render application

Now that you have a connection URL for a MongoDB database, you should give it
to your Render application.

This is trivially done by adding `DATABASE_URL` to your application's
environment variables in the Environment section:

![Render: configure environment variables](./images/render-08-variables.png)

When you save the variables, choose **Save and deploy** so that Render deploys
your application again with the new configuration. From now on, Render will
also deploy automatically every time you push commits on your `main` branch to
GitHub.

Once your deploy is live, you should be able to test your API at the URL
generated by Render. It should look something like:
`https://my-api-4vxg.onrender.com`

🎉

> You don't need to configure the port: Render sets the `$PORT` environment
> variable, which the starter's `bin/start.js` already uses.

> **On the free plan, your application goes to sleep** after 15 minutes without
> requests. The next request wakes it up, which takes about a minute. If your API
> seems down, wait a minute and try again.

[cloud]: https://en.wikipedia.org/wiki/Cloud_computing
[express]: https://expressjs.com
[express-starter]: https://github.com/MediaComem/comem-archioweb/tree/main/subjects/express/starter
[git]: https://git-scm.com
[github]: https://github.com
[render]: https://render.com
[mongodb-atlas]: https://www.mongodb.com/cloud/atlas
[mongodb-try]: https://www.mongodb.com/try
[mongoose]: https://mongoosejs.com
[node]: https://nodejs.org
[node-process-env]: https://nodejs.org/docs/latest-v26.x/api/process.html#processenv
[paas]: https://en.wikipedia.org/wiki/Platform_as_a_service
[two-hard-things]: https://martinfowler.com/bliki/TwoHardThings.html
[url-encoding]: https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding

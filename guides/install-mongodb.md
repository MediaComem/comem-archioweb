# Installing MongoDB

Learn how to install [MongoDB][mongodb] **Community Edition** on macOS or
Windows. You will find detailed installation instructions for all platforms [in
the documentation][installation-instructions], including [Linux][install-linux].

If you already use [Docker][docker], you can also skip the installation and run
`docker run -d -p 27017:27017 mongo:8.0` instead (you still need
[mongosh][mongosh-download] to connect to it). A free [MongoDB Atlas][atlas]
cluster (which you will create anyway to [deploy your
project](./deploy-in-the-cloud.md)) also works.

> **Install MongoDB 8.0, not 9.** MongoDB 9 is out, but MongoDB Atlas, where you
> will deploy your project, still runs 8.0. Use the same version locally.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [MongoDB on macOS](#mongodb-on-macos)
  - [Installing MongoDB](#installing-mongodb)
  - [Run the MongoDB server on macOS](#run-the-mongodb-server-on-macos)
  - [Checking the server's logs](#checking-the-servers-logs)
  - [Run the MongoDB shell on macOS](#run-the-mongodb-shell-on-macos)
- [MongoDB on Windows](#mongodb-on-windows)
  - [Install the MongoDB shell on Windows](#install-the-mongodb-shell-on-windows)
- [Test the MongoDB shell on macOS or Windows](#test-the-mongodb-shell-on-macos-or-windows)
- [Troubleshooting](#troubleshooting)
  - [I installed MongoDB 9](#i-installed-mongodb-9)
  - [`Connection refused` error in the MongoDB shell](#connection-refused-error-in-the-mongodb-shell)
  - [`Access control` warning in the MongoDB server or shell](#access-control-warning-in-the-mongodb-server-or-shell)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## MongoDB on macOS

### Installing MongoDB

Install [Homebrew][brew] if you don't have it. Then add MongoDB's Homebrew "tap"
(its collection of formulae), and install MongoDB:

```bash
$> brew tap mongodb/brew
$> brew update
$> brew install mongodb-community@8.0
```

**Keep the `@8.0`**: without it, Homebrew installs MongoDB 9.

This installs the [`mongod`][mongod] server and the MongoDB shell, `mongosh`.
MongoDB's configuration file, logs and data are in `$(brew --prefix)/etc`,
`$(brew --prefix)/var/log/mongodb` and `$(brew --prefix)/var/mongodb`
respectively (`brew --prefix` is `/opt/homebrew` on Apple Silicon and
`/usr/local` on Intel Macs).

### Run the MongoDB server on macOS

To run the MongoDB server, you will need to launch the `mongod` executable. (The
`d` in `mongod` means [daemon][daemon]: a program that runs as a background
process and is not interactive). Run it as a **macOS service**, which keeps it
running in the background (and starts it again when you log in):

```bash
$> brew services start mongodb-community@8.0
```

To stop it, use the following command as needed:

```bash
$> brew services stop mongodb-community@8.0
```

> **If macOS prevents `mongod` from opening** with a security error saying that
> the developer could not be identified or verified, open _System Settings ›
> Privacy & Security_, and click _Open Anyway_ next to the message about
> `mongod`.

### Checking the server's logs

To check that MongoDB is running, list your Homebrew services:

```bash
$> brew services list
Name                  Status  User   File
mongodb-community@8.0 started ...
```

If it's not `started`, display the end of its logfile to see what went wrong:

```bash
$> tail -n 50 "$(brew --prefix)/var/log/mongodb/mongo.log"
```

The logs should look something like this (abridged output):

```bash
...
{"t":{"$date":"2026-09-29T..."}, ... ,"msg":"MongoDB starting","attr":{"pid":8023,"port":27017,"dbPath":"/opt/homebrew/var/mongodb","architecture":"64-bit","host":"example.local"}}
...
{"t":{"$date":"2026-09-29T..."}, ... ,"msg":"Access control is not enabled for the database. Read and write access to data and configuration is unrestricted","tags":["startupWarnings"]}
...
{"t":{"$date":"2026-09-29T..."}, ... ,"msg":"Waiting for connections","attr":{"port":27017,"ssl":"off"}}
...
```

The access control warning shown above is expected with the default
configuration (see [Access control
warning](#access-control-warning-in-the-mongodb-server-or-shell)).

You will know it's working if it says that it's **waiting for connections** on
port 27017 (the default port for MongoDB). This may not be the last line of the
log.

You now have a running MongoDB server that **will accept connections from
clients**.

### Run the MongoDB shell on macOS

You will use the MongoDB shell as a client. In any terminal, run the `mongosh`
executable:

```bash
$> mongosh
Current Mongosh Log ID:	6abb6ae978a1f29b54b0fac6
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.12.0
Using MongoDB:		8.0.32
Using Mongosh:		2.12.0
...
test>
```

You will know it's working if you see a **different prompt** in your CLI. That
means you are now connected to the MongoDB shell and can **type MongoDB
commands**. Check that `Using MongoDB` says **8.0** (if it says 9, see [I
installed MongoDB 9](#i-installed-mongodb-9)).

You can now [test the shell](#test-the-mongodb-shell-on-macos-or-windows).

## MongoDB on Windows

Download and install [MongoDB Community Edition][mongodb-download]. In the
**Version** list, pick the latest **8.0.x** release, **not 9**. Choose the **Run
service as Network Service user** option during installation.

The installer sets MongoDB up as a Windows **service**, which starts
automatically (also when Windows starts), so you usually have nothing else to
do.

If you need to start or stop it manually, open the **Start menu**, type `cmd`
and select "Run as administrator" (starting and stopping services requires an
administrator Command Prompt). To start MongoDB:

```bash
> net start MongoDB
...
The MongoDB Server (MongoDB) service was started successfully.
```

And stop it by entering:

```bash
> net stop MongoDB
...
The MongoDB Server (MongoDB) service was stopped successfully.
```

### Install the MongoDB shell on Windows

Download and install [MongoDB Shell][mongosh-download].

You run the MongoDB shell by calling `mongosh` in your terminal (Git Bash or the
Command Prompt). If it shows no prompt or doesn't react to your input in Git
Bash, run `winpty mongosh` instead, or use the Command Prompt.

You will know it's working if you see a **different prompt** in your CLI. That
means you are now connected to the MongoDB shell and can **type MongoDB
commands**.

```bash
$> mongosh
Current Mongosh Log ID:	6abb6ae978a1f29b54b0fac6
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.12.0
Using MongoDB:		8.0.32
Using Mongosh:		2.12.0
...
test>
```

Check that `Using MongoDB` says **8.0** (if it says 9, see
[I installed MongoDB 9](#i-installed-mongodb-9)).

You can now [test the shell](#test-the-mongodb-shell-on-macos-or-windows).

## Test the MongoDB shell on macOS or Windows

Once you have:

- A **running MongoDB server**
- An **open MongoDB shell** (run with the `mongosh` command)

Make sure it works by trying a few commands:

```bash
test> use test
already on db test

test> db.things.insertOne({ fruit: 'apple' })
{
  acknowledged: true,
  insertedId: ObjectId('6abba680ee12a8ef235b9682')
}

test> db.things.insertOne({ name: 'John Doe', age: 24 })
{
  acknowledged: true,
  insertedId: ObjectId('6abba6811eee0afed6e73de7')
}

test> db.things.find()
[
  { _id: ObjectId('6abba680ee12a8ef235b9682'), fruit: 'apple' },
  {
    _id: ObjectId('6abba6811eee0afed6e73de7'),
    name: 'John Doe',
    age: 24
  }
]
```

If you would also like a graphical interface to browse your data, you can
install [MongoDB Compass][compass] (optional).

## Troubleshooting

### I installed MongoDB 9

The course uses **MongoDB 8.0** (see the top of this guide). If `mongosh` says
`Using MongoDB: 9.x`, replace it with 8.0.

On macOS, uninstall version 9, delete its data (MongoDB 8.0 cannot read data
written by version 9), and install 8.0:

```bash
$> brew services stop mongodb-community
$> brew uninstall mongodb/brew/mongodb-community
$> rm -rf "$(brew --prefix)/var/mongodb"
$> brew install mongodb-community@8.0
$> brew services start mongodb-community@8.0
```

On Windows, uninstall MongoDB 9 from _Settings › Apps_, then install 8.0 as
described in [MongoDB on Windows](#mongodb-on-windows).

### `Connection refused` error in the MongoDB shell

If you see an error like this:

```bash
$> mongosh
...
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

It means that **your MongoDB server is not running**. Start it with
`brew services start mongodb-community@8.0` on macOS, or `net start MongoDB` on
Windows.

### `Access control` warning in the MongoDB server or shell

If you see this warning when starting `mongosh` (or in the server's logs):

```txt
------
   The server generated these startup warnings when booting
   2026-09-29T09:29:39.868+02:00: Access control is not enabled for the
     database. Read and write access to data and configuration is unrestricted
------
```

It's because MongoDB tells you that access to your databases is unrestricted as
there is **no username/password** configured by default.

This is a bad thing in production, but is acceptable during development when you
are running the database on your local machine and external access is probably
blocked by your firewall anyway. So you can **ignore** this warning **as long as
you're only running MongoDB for development**.

[atlas]: https://www.mongodb.com/products/platform/atlas-database
[brew]: https://brew.sh
[compass]: https://www.mongodb.com/products/tools/compass
[docker]: https://www.docker.com
[install-linux]: https://www.mongodb.com/docs/manual/administration/install-community-linux/
[mongod]: https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod
[mongosh-download]: https://www.mongodb.com/try/download/shell
[daemon]: https://en.wikipedia.org/wiki/Daemon_(computing)
[mongodb]: https://www.mongodb.com
[mongodb-download]: https://www.mongodb.com/try/download/community
[installation-instructions]: https://www.mongodb.com/docs/manual/installation/

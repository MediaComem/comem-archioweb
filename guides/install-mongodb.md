# Installing MongoDB

Learn how to install [MongoDB][mongodb] **Community Edition** on macOS or
Windows. You will find detailed installation instructions for all platforms [in
the documentation][installation-instructions].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [MongoDB on macOS](#mongodb-on-macos)
  - [Create the MongoDB data directory on macOS](#create-the-mongodb-data-directory-on-macos)
  - [Run the MongoDB server on macOS](#run-the-mongodb-server-on-macos)
    - [What you should see](#what-you-should-see)
  - [Run the MongoDB shell on macOS](#run-the-mongodb-shell-on-macos)
- [MongoDB on Windows](#mongodb-on-windows)
  - [Run the MongoDB server on Windows](#run-the-mongodb-server-on-windows)
  - [Run the MongoDB shell on Windows](#run-the-mongodb-shell-on-windows)
- [Test the MongoDB shell on macOS or Windows](#test-the-mongodb-shell-on-macos-or-windows)
- [Troubleshooting](#troubleshooting)
  - [`Read-only file system` error on macOS Catalina and later](#read-only-file-system-error-on-macos-catalina-and-later)
  - [`Data directory not found` error in the MongoDB server](#data-directory-not-found-error-in-the-mongodb-server)
  - [`Attempted to create a lock file` error in the MongoDB server](#attempted-to-create-a-lock-file-error-in-the-mongodb-server)
  - [`Connection refused` error in the MongoDB shell](#connection-refused-error-in-the-mongodb-shell)
  - [`Access control` warning in the MongoDB server or shell](#access-control-warning-in-the-mongodb-server-or-shell)
  - [`Unhandled exception ..., terminating` in the MongoDB server on Windows](#unhandled-exception--terminating-in-the-mongodb-server-on-windows)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## MongoDB on macOS

> **Homebrew users**: if you have installed MongoDB with [Homebrew][brew], you
> should already have a MongoDB server installed and running. You can skip to
> [Run the MongoDB shell on macOS](#run-the-mongodb-shell-on-macos).

Run the following commands to download and uncompress the binary distribution of
MongoDB. (These instructions assume that you have a `~/Downloads` directory. Use
another path if that is not the case.)

```bash
$> cd ~/Downloads

$> curl -O https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-5.0.tgz

$> tar -zxvf mongodb-macos-x86_64-5.0.tgz

$> ls mongodb-macos-x86_64-5.0
LICENSE-Community.txt  MPL-2  README  THIRD-PARTY-NOTICES  ...
```

Move and/or rename the `mongodb-macos-x86_64-5.0` directory where you want it
(you can do that in the CLI or manually in your Finder/Desktop).

For example, you could move it to your home directory (**_only if_ your username
doesn't have any spaces/accents**, otherwise move it somewhere else):

```bash
$> mv mongodb-macos-x86_64-5.0 ~/mongodb
```



### Create the MongoDB data directory on macOS

You need to create a directory for the MongoDB server to store its databases in
(it looks in `/data/db` by default). Run the following commands to **create the
data directory** and **give ownership of it to your user**:

```bash
$> sudo mkdir -p /data/db
$> sudo chown "$(whoami)" /data/db
```

*(**Note:** you will need to enter your password.)*

> If you get a `Read-only file system` error after running the `mkdir` command,
> see
> [Troubleshooting](#read-only-file-system-error-on-macos-catalina-and-later).



### Run the MongoDB server on macOS

To run the MongoDB server, you will need to launch the `mongod` executable. (The
`d` in `mongod` means [daemon][daemon]: a program that runs as a background
process and is not interactive). There are **three ways** you can run MongoDB,
assuming you have it at `~/mongodb` (adapt the instructions otherwise):

* Go in MongoDB's `bin` directory and run `./mongod`:

  ```bash
  $> cd ~/mongodb/bin
  $> ./mongod
  ```

* **Or,** run `mongod` by its **absolute path** (from anywhere):

  ```bash
  $> /Users/jdoe/mongodb/bin/mongod
  ```

* **Or,** add the line `export PATH=~/mongodb/bin:$PATH` to your `.bash_profile`
  and re-launch your CLI so you can run it by simply typing `mongod`:

   ```bash
   $> mongod
   ```

   (Re-read [The `PATH` variable](https://mediacomem.github.io/comem-archidep/2019-2020/subjects/cli/#49) if you need to refresh your memory.)

> If you have created a custom data directory other than `/data/db`, for example
> `~/data/db`, you must supply the `--dbpath` option to tell MongoDB where it
> is, e.g. run `mongod --dbpath ~/data/db` instead of just `mongodb` if you
> chose the third way.

#### What you should see

When you run `mongod`, it should take over the CLI and show you the MongoDB
server logs. They should look something like this (abridged output):

```bash
...
{"t":{"$date":"2020-09-29T..."}, ... ,"msg":"MongoDB starting","attr":{"pid":24769,"port":27018,"dbPath":"/data/db","architecture":"64-bit","host":"example.local"}}
...
{"t":{"$date":"2020-09-29T..."}, ... ,"msg":"Access control is not enabled for the database. Read and write access to data and configuration is unrestricted","tags":["startupWarnings"]}
{"t":{"$date":"2020-09-29T..."}, ... ,"msg":"This server is bound to localhost. Remote systems will be unable to connect to this server. Start the server with --bind_ip <address> to specify which IP addresses it should serve responses from, or with --bind_ip_all to bind to all interfaces. If this behavior is desired, start the server with --bind_ip 127.0.0.1 to disable this warning","tags":["startupWarnings"]}
...
{"t":{"$date":"2020-09-29T..."}, ... ,"msg":"Waiting for connections","attr":{"port":27017,"ssl":"off"}}
...
```

If you have a slightly older version of MongoDB, the logs may look something
like this (abridged output):

```bash
$> mongod
2019-09-25T... [initandlisten] MongoDB starting ...
2019-09-25T... [initandlisten] db version v4.2.1
2019-09-25T... [initandlisten] ...
2019-09-25T... [initandlisten] ** WARNING: Access control is not enabled
2019-09-25T... [initandlisten] **          for the database. Read and write
2019-09-25T... [initandlisten] **          access to data and configuration
2019-09-25T... [initandlisten] **          is unrestricted.
2019-09-25T... [initandlisten] ...
2019-09-25T... [initandlisten] Listening on 127.0.0.1
2019-09-25T... [initandlisten] waiting for connections on port 27017
2019-09-25T... [initandlisten] ...
```

The warnings shown above are expected with the default configuration.

You will know it's working if it says that it's **waiting for connections** on
port 27017 (the default port for MongoDB). This may not be the last line of the
log.

You now have a running MongoDB server that **will accept connections from
clients**.



### Run the MongoDB shell on macOS

You will use the MongoDB shell as a client. **Open another CLI** (you need to
keep the MongoDB server running in the other one).

You run the MongoDB shell by launching the `mongo` executable. Use the same
**three ways** of launching it as for `mongod`, but type `mongo` instead:

```bash
$> mongo
MongoDB shell version v5.0
connecting to: mongodb://127.0.0.1:27018...
MongoDB server version: 5.0
...
*>
```

You will know it's working if you see a **different prompt** in your CLI. That
means you are now connected to the MongoDB shell and can **type MongoDB
commands**.

You can now [test the shell](#test-the-mongodb-shell-on-macos-or-windows).



## MongoDB on Windows

Download and install [MongoDB Community Edition][mongodb-download].

You need to create a directory for the MongoDB server to store its databases in
(it looks in `C:\data\db` by default).

For MongoDB on Windows, you **SHOULD use the Windows command line** (not a Unix
shell like Git Bash), otherwise you may have problems. Open the **Launch menu**
and type `cmd` to launch it.

Run the following command in the Windows CLI to **create the data directory**:

```bash
$> md \data\db
```



### Run the MongoDB server on Windows

To run the MongoDB server, you will need to launch the `mongod` executable. (The
`d` in `mongod` means [daemon][daemon]: a program that runs as a background
process and is not interactive).

You need to type the **double-quoted, absolute path** to `mongod.exe` (adapt the
path if your MongoDB installation is elsewhere):

```bash
$> "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe"

2016-02-22T07:25 I CONTROL  [init...] MongoDB starting :
2016-02-22T07:25 I CONTROL  [init...]   pid=203 port=27017 dbpath=\data\db ...
2016-02-22T07:25 I CONTROL  [init...] db version v5.0
2016-02-22T07:25 I CONTROL  [init...] ...
2016-02-22T07:25 I NETWORK  [init...] `waiting for connections on port 27017`
```

You will know it's working if it says that it's **waiting for connections on
port 27017** (the default port for MongoDB). You now have a running MongoDB
server that **will accept connections from clients**.



### Run the MongoDB shell on Windows

You will use the MongoDB shell as a client. **Open another Windows cmd** (you
need to keep the MongoDB server running in the other one).

You run the MongoDB shell by launching the `mongo.exe` executable. Again, you
must use the **double-quoted, absolute path**:

```bash
$> "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
MongoDB shell version: 5.0
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 5.0
...
*>
```

You will know it's working if you see a **different prompt** in your CLI. That
means you are now connected to the MongoDB shell and can **type MongoDB
commands**.

You can now [test the shell](#test-the-mongodb-shell-on-macos-or-windows).



## Test the MongoDB shell on macOS or Windows

Once you have:

* A **running MongoDB server** in a CLI
* An **open MongoDB shell**

Make sure it works by trying a few commands:

```bash
> use test
connecting to: test

> db.things.insert({ "fruit": "apple" })
WriteResult({ "nInserted" : 1 })

> db.things.insert({ "name": "John Doe", "age": 24 })
WriteResult({ "nInserted" : 1 })

> db.things.find()
{ "_id" : ObjectId("56ca09b5d536b4526d219ba8"), "fruit" : "apple" }
{ "_id" : ObjectId("56ca095ed536b4526d219ba7"), "name" : "John Doe", "age" : 24 }
```



## Troubleshooting

<!-- slide-front-matter class: center, middle -->



### `Read-only file system` error on macOS Catalina and later

If you are on macOS Catalina (10.15) or later, you may get the following error:

```bash
$> sudo mkdir -p /data/db
mkdir: /data/db: Read-only file system
```

This is because starting with macOS Catalina, [the root of the file system is
read-only for increased security](https://support.apple.com/en-us/HT210650), to
help prevent the accidental overwriting of critical operating system files.

In this case, you need to create the MongoDB data directory elsewhere, for
example in your home directory. In this case, you will not need `sudo`, since
your home directory already belongs to you:

```bash
$> mkdir -p ~/data/db
```

When you run the `mongod` command later, you will need to supply the `--dbpath`
option to indicate to MongoDB that it should store data in that directory:

```bash
$> mongod --dbpath ~/data/db
```



### `Data directory not found` error in the MongoDB server

If you see an error like this:

```bash
mongod
2017-02-27T10:00 I CONTROL  [init...] MongoDB starting :
2017-02-27T10:00 I CONTROL  [init...]   pid=2975 port=27017 dbpath=/data/db ...
2017-02-27T10:00 I CONTROL  [init...] db version v3.4.2
2017-02-27T10:00 I CONTROL  [init...] ...
2017-02-27T10:00 I STORAGE  [init...] exception in initAndListen:
2017-02-27T10:00 I STORAGE  [init...]   29 `Data directory /data/db not found.`,
2017-02-27T10:00 I STORAGE  [init...]   terminating
2017-02-27T10:00 I NETWORK  [init...] shutdown: going to close listening sockets
2017-02-27T10:00 I NETWORK  [init...] shutdown: going to flush diaglog
2017-02-27T10:00 I CONTROL  [init...] now exiting
2017-02-27T10:00 I CONTROL  [init...] shutting down with code:100
```

It means that you have **not created MongoDB's data directory** at `/data/db` on
macOS or `C:\data\db` on Windows. Follow the installation instructions.



### `Attempted to create a lock file` error in the MongoDB server

If you see an error like this:

```
2017-02-27T10:01 I CONTROL  [init...] MongoDB starting :
2017-02-27T10:01 I CONTROL  [init...]   pid=3017 port=27017 dbpath=/data/db ...
2017-02-27T10:01 I CONTROL  [init...] db version v3.4.2
2017-02-27T10:01 I CONTROL  [init...] ...
2017-02-27T10:01 I STORAGE  [init...] exception in initAndListen:
2017-02-27T10:01 I STORAGE  [init...]   20 `Attempted to create a lock file`
2017-02-27T10:01 I STORAGE  [init...]   on a read-only directory: /data/db,
2017-02-27T10:01 I STORAGE  [init...]   terminating
2017-02-27T10:01 I NETWORK  [init...] shutdown: going to close listening sockets
2017-02-27T10:01 I NETWORK  [init...] shutdown: going to flush diaglog
2017-02-27T10:01 I CONTROL  [init...] now exiting
2017-02-27T10:01 I CONTROL  [init...] shutting down with code:100
```

It means that you **have not given ownership of the `/data/db` directory to your
user on macOS**. Follow the installation instructions.



### `Connection refused` error in the MongoDB shell

If you see an error like this:

```bash
$> mongo
MongoDB shell version v3.4.1
connecting to: mongodb://127.0.0.1:27017
2017-02-27T09:51+0100 W NETWORK  [main] Failed to connect to 127.0.0.1:27017,
2017-02-27T09:51+0100 W NETWORK    in(checking socket for error after poll),
2017-02-27T09:51+0100 W NETWORK    reason: Connection refused
2017-02-27T09:51+0100 E QUERY    [main] Error:
2017-02-27T09:51+0100 E QUERY      couldn't connect to server 127.0.0.1:27017,
2017-02-27T09:51+0100 E QUERY      connection attempt failed :
connect@src/mongo/shell/mongo.js:234:13
@(connect):1:6
exception: connect failed
```

It means that **your MongoDB server is not running**. You need to open another
CLI, run it, and keep it running so that you can use the client.



### `Access control` warning in the MongoDB server or shell

If you see this warning either when running `mongod` or `mongo`:

```
2017-02-27T10:02 I CONTROL  [init...] ** WARNING: Access control is not enabled
2017-02-27T10:02 I CONTROL  [init...] **          for the database. Read and
2017-02-27T10:02 I CONTROL  [init...] **          write access to data and
2017-02-27T10:02 I CONTROL  [init...] **          configuration is unrestricted.
```

It's because MongoDB tells you that access to your databases is unrestricted as
there is **no username/password** configured by default.

This is a bad thing in production, but is acceptable during development when you
are running the database on your local machine and external access is probably
blocked by your firewall anyway. So you can **ignore** this warning **as long as
you're only running MongoDB for development**.



### `Unhandled exception ..., terminating` in the MongoDB server on Windows

If you see an error like this:

```bash
2019-08-22T11:27:41.166-0500 F CONTROL [main] *** unhandled exception 0xE06D7363 at 0x00007FFA0FAC9129, terminating
2019-08-22T11:27:41.167-0500 F CONTROL [main] *** stack trace for unhandled exception:
2019-08-22T11:27:41.173-0500 I - [main] KERNELBASE.dll RaiseException+0x69
VCRUNTIME140.dll CxxThrowException+0xad
mongo.exe MallocExtension::GetEstimatedAllocatedSize+0x175210
mongo.exe MallocExtension::GetEstimatedAllocatedSize+0x174fef
mongo.exe tc_mallopt+0xa52c
mongo.exe mozilla::detail::MutexImpl::~MutexImpl+0x866f
mongo.exe mozilla::detail::MutexImpl::~MutexImpl+0x2317
mongo.exe mozilla::detail::MutexImpl::~MutexImpl+0x8de5
mongo.exe tcmalloc::Log+0xaaf04
KERNEL32.DLL BaseThreadInitThunk+0x14
2019-08-22T11:27:41.176-0500 I CONTROL [main] writing minidump diagnostic file C:\Program Files\MongoDB\Server\4.2019-08-22T16-27-41.mdmp
2019-08-22T11:27:41.421-0500 F CONTROL [main] *** immediate exit due to unhandled exception
```

It may be caused by a non-ASCII character in your system username, for example
an accented letter. You should attempt to set the `USERPROFILE` environment
variable in your cmd shell:

```bash
$> set USERPROFILE=SomeNameWithoutAccents
```

Then try running `mongod.exe` again in that shell and see if it fixes the issue.



[brew]: https://brew.sh
[daemon]: https://en.wikipedia.org/wiki/Daemon_(computing)
[mongodb]: https://www.mongodb.com
[mongodb-download]: https://www.mongodb.com/download-center/community
[installation-instructions]: https://docs.mongodb.com/manual/installation/

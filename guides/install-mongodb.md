# Installing MongoDB

Learn how to install [MongoDB][mongodb] **Community Edition** on macOS or
Windows. You will find detailed installation instructions for all platforms [in
the documentation][installation-instructions].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [MongoDB on macOS](#mongodb-on-macos)
  - [Prerequisites](#prerequisites)
  - [Installing MongoDB](#installing-mongodb)
  - [Run the MongoDB server on macOS](#run-the-mongodb-server-on-macos)
  - [Checking the server's logs](#checking-the-servers-logs)
  - [Run the MongoDB shell on macOS](#run-the-mongodb-shell-on-macos)
- [MongoDB on Windows](#mongodb-on-windows)
  - [Install the MongoDB shell on Windows](#install-the-mongodb-shell-on-windows)
- [Test the MongoDB shell on macOS or Windows](#test-the-mongodb-shell-on-macos-or-windows)
- [Troubleshooting](#troubleshooting)
  - [`Data directory not found` error in the MongoDB server](#data-directory-not-found-error-in-the-mongodb-server)
  - [`Attempted to create a lock file` error in the MongoDB server](#attempted-to-create-a-lock-file-error-in-the-mongodb-server)
  - [`Connection refused` error in the MongoDB shell](#connection-refused-error-in-the-mongodb-shell)
  - [`Access control` warning in the MongoDB server or shell](#access-control-warning-in-the-mongodb-server-or-shell)
  - [`Unhandled exception ..., terminating` in the MongoDB server on Windows](#unhandled-exception--terminating-in-the-mongodb-server-on-windows)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## MongoDB on macOS

### Prerequisites

Ensure your system meets each of the following prerequisites. You only need to perform each prerequisite step once on your system. If you have already performed the prerequisite steps as part of an earlier MongoDB installation using Homebrew, you can skip to the
installation procedure.

**Install Xcode Command-Line Tools**

Homebrew requires the Xcode command-line tools from Apple's Xcode.

- Install the Xcode command-line tools by running the following command in your macOS Terminal:
  ```bash
  $> xcode-select --install
  ```

**Install Homebrew**

Homebrew is a fantastic package manager for macOS. In other words, it is a command-line utility that allows you to install and manage third-party software. macOS does not include  [Homebrew][brew] by default.

- Install homebrew:
  ```bash
  $> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

### Installing MongoDB

Follow these steps to install MongoDB Community Edition using Homebrew's brew package manager. Be sure that you have followed the installation prerequisites above before proceeding.

1. Tap the MongoDB Homebrew Tap to download the official Homebrew formula for MongoDB and the Database Tools, by running the following command in your macOS Terminal:

   ```bash
   $> brew tap mongodb/brew
   ```

   If you have already done this for a previous installation of MongoDB, you can skip this step.

2. To update Homebrew and all existing formulae:
   ```bash
   $> brew update
   ```
3. To install MongoDB, run the following command in your macOS Terminal application:
   ```bash
   $> brew install mongodb-community@6.0
   ```

The installation includes the following binaries:

- The [mongod][mongod] server
- The MongoDB Shell, mongosh

In addition, the installation creates the following files and directories at the location specified below, depending on your Apple hardware:

|                    | Intel Processor            | Apple Silicon (M1, M2)                  |
| ------------------ | -------------------------- | ----------------------------- |
| configuration file | /usr/local/etc/mongod.conf | /opt/homebrew/etc/mongod.conf |
| log directory      | /usr/local/var/log/mongodb | /opt/homebrew/var/log/mongodb |
| data directory     | /usr/local/var/mongodb     | /opt/homebrew/var/mongodb     |

### Run the MongoDB server on macOS

To run the MongoDB server, you will need to launch the `mongod` executable. (The
`d` in `mongod` means [daemon][daemon]: a program that runs as a background
process and is not interactive). There are **two ways** you can run MongoDB: as macOS service (recommended) or manually.

- To run MongoDB (i.e. the mongod process) as a **macOS service**, run:

  ```bash
  $> brew services start mongodb-community@6.0
  ```

  To stop `mongod` running as a macOS service, use the following command as needed:

  ```bash
  $> brew services stop mongodb-community@6.0
  ```

- **Or,** to run MongoDB (i.e. the `mongod` process) **manually as a background process**, run:
  - For macOS running Intel processors:
    ```bash
    $> mongod --config /usr/local/etc/mongod.conf --fork
    ```
  - For macOS running Intel processors:
    ```bash
    $> mongod --config /opt/homebrew/etc/mongod.conf --fork
    ```
    To stop a [`mongod`][mongod] running as a background process, connect to the `mongod` using [`mongosh`][mongosh], and issue de `shutdown` command.

> **If macOS Prevents mongod From Opening**
> macOS may prevent `mongod` from running after installation. If you receive a security error when starting `mongod` indicating that the developer could not be identified or verified, do the following to grant mongod access to run:
>
> - Open _System Preferences_
> - Select the _Security_ and _Privacy_ pane.
> - Under the General tab, click the button to the right of the message about `mongod`, labelled either Open Anyway or Allow Anyway depending on your version of macOS.

### Checking the server's logs

MongoDB runs in the background, but you can display the contents of its logfile
to see if it's running correctly:

```bash
# For Intel Processors
$> cat /usr/local/var/log/mongodb/mongo.log
# For Apple Silicon (M1, M2)
$> cat /opt/homebrew/var/log/mongodb/mongo.log
```

The logs should look something like this (abridged output):

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

You run the MongoDB shell by launching the `mongosh` executable.

```bash
$> mongosh
Current Mongosh Log ID:	6310b4b33ec62956119c999a
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4
Using MongoDB:		6.0.1
Using Mongosh:		1.5.4
...
test>
```

You will know it's working if you see a **different prompt** in your CLI. That
means you are now connected to the MongoDB shell and can **type MongoDB
commands**.

You can now [test the shell](#test-the-mongodb-shell-on-macos-or-windows).

## MongoDB on Windows

Download and install [MongoDB Community Edition][mongodb-download]. Choose the **Windows Service** option during installation.


For MongoDB on Windws, you **SHOULD use the Windows command line** (not a Unix
shell like Git Bash), otherwise you may have problems. Open the **Launch menu**, type `cmd` and select "Run as administrator".

From the Command Prompt, you may start MongoDB by entering:

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

You run the MongoDB shell by calling `mongosh` in the Command Prompt.

You will know it's working if you see a **different prompt** in your CLI. That
means you are now connected to the MongoDB shell and can **type MongoDB
commands**.

```bash
$> mongosh
connecting to: mongodb://127.0.0.1:27017
Using MongoDB: 6.0.1
Using Mongosh: 1.5.4
...
test>
```

You can now [test the shell](#test-the-mongodb-shell-on-macos-or-windows).

## Test the MongoDB shell on macOS or Windows

Once you have:

- A **running MongoDB server** in a CLI
- An **open MongoDB shell** (run with the `mongosh` command)

Make sure it works by trying a few commands:

```bash
> use test
connecting to: test

> db.things.insertOne({ "fruit": "apple" })
{
  acknowledged: true,
  insertedId: ObjectId("6310b5143ec62956119c999c")
}

> db.things.insertOne({ "name": "John Doe", "age": 24 })
{
  acknowledged: true,
  insertedId: ObjectId("6310b52a3ec62956119c999d")
}

> db.things.find()
[
  { _id: ObjectId("6310b5143ec62956119c999c"), fruit: 'apple' },
  {
    _id: ObjectId("6310b52a3ec62956119c999d"),
    name: 'John Doe',
    age: 24
  }
]
```

## Troubleshooting

<!-- slide-front-matter class: center, middle -->

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
$> mongosh
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

If you see this warning either when running `mongod` or `mongosh`:

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
mongosh.exe MallocExtension::GetEstimatedAllocatedSize+0x175210
mongosh.exe MallocExtension::GetEstimatedAllocatedSize+0x174fef
mongosh.exe tc_mallopt+0xa52c
mongosh.exe mozilla::detail::MutexImpl::~MutexImpl+0x866f
mongosh.exe mozilla::detail::MutexImpl::~MutexImpl+0x2317
mongosh.exe mozilla::detail::MutexImpl::~MutexImpl+0x8de5
mongosh.exe tcmalloc::Log+0xaaf04
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
[mongod]: https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod
[mongosh]: https://www.mongodb.com/docs/mongodb-shell/
[mongosh-download]:https://downloads.mongodb.com/compass/mongosh-1.5.4-x64.msi
[daemon]: https://en.wikipedia.org/wiki/Daemon_(computing)
[mongodb]: https://www.mongodb.com
[mongodb-download]: https://www.mongodb.com/download-center/community
[installation-instructions]: https://docs.mongodb.com/manual/installation/

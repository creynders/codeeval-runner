#  [![Build Status](https://secure.travis-ci.org/creynders/codeeval-runner.png?branch=master)](http://travis-ci.org/creynders/codeeval-runner)

> CLI for running your codeeval programs

This command-line utility allows running your codeeval scripts and compares the output to test data.
(Though written in node, you can configure it to run any kind of command, i.e. you can use it for Go, Java, et cetera as well)

## Installation

```sh
$ npm install -g codeeval-runner
```

## Usage

`cd` to the directory containing your codeeval programs. Run the program with:

```sh
$ codeeval
```

By default it will traverse a `solutions` directory and iterate over each sub-directory. In each subdirectory it searches for following files:

* `index.js`: your "program". The file containing your solution.
* `expected.txt`: the test data the output will be compared to.
* `sample.txt` (optional): input for your program.

However all of this configurable, i.e. you can use different directory and file names. Or even a different directory structure.

## Configuration

The utility will try and load a file called `codeeval.json` which allows configuration using following fields:

* `base`, default "solutions"
* `files`:
    * `files.output`, default "<%=base%>/<%=challenge%>/output.txt"
    * `files.input`, default "<%=base%>/<%=challenge%>/sample.txt"
    * `files.program`, default "<%=base%>/<%=challenge%>/index.js"
    * `files.expected`, default "<%=base%>/<%=challenge%>/expected.txt"
* `command`:
    * `command.main`, default "node"
    * `command.args`, default "<%=program%> <%=input%>"

The ERB-style variables are substituted with the values provided by the configuration file. 
There's one dynamically generated value `challenge` which is the name of the directory being iterated over.

You can provide challenge-specific overrides, e.g. let's say we have a directory `solutions/101` which needs to be configured differently than the others, then just provide a `101` key in `codeeval.json` containing the configuration:

```json
{
  "101": {
    "files" : {
      "program" : "<%=base%>/<%=challenge%>/<%=challenge%>.js
    }
  }
}
```

This will load a file `solutions/101/101.js` as the program.

## Arguments & Flags

You can provide the command line utility with an argument containing the name of the challenge you want to run. 
This will run the provided challenge exclusively.

E.g.:

```sh
codeeval mars-networks
```

Will run the code inside `solutions/mars-networks` (using the configuration in `codeeval.json` if one is provided)

Setting the `--verbose` (or `-v`) flag will send the output of your program to `stdout`.

E.g.:

```sh
codeeval toLowerCase -v
```

Outputs:

```sh
ab c
de fgh

✔ toLowerCase
```

## Examples

* This is a `codeeval.json` with all the default values:
  
  ```json
  {
    "base": "solutions",
    "files" : {
      "output": "<%=base%>/<%=challenge%>/output.txt",
      "input": "<%=base%>/<%=challenge%>/sample.txt",
      "program": "<%=base%>/<%=challenge%>/index.js",
      "expected": "<%=base%>/<%=challenge%>/expected.txt"
    },
    "command":{
      "main" : "node",
      "args" : "<%=program%> <%=input%>"
    }
  }
  ```

* See [`/demo`](demo) for a full example.

## License

Copyright (c) 2014 Camille Reynders  
Licensed under the MIT license.

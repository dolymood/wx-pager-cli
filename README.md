# wxpager-cli

wx-pager's CLI interface

## Usage

```
$ wxpager [options] [dir|file ...]
```

Render `<file>`s and all files in `<dir>`s.

### Options

```
-h, --help          output usage information
-V, --version       output the version number
-o, --output <dir>  output the rendered files to <dir>
-w, --watch         watch files for changes and automatically re-render
-s, --silent        do not output logs
```

### Examples

Render all files in the `templates` directory:

```
$ wxpager templates
```

Create {foo,bar}.{wxml,js,wxss,json}:

```
$ wxpager {foo,bar}.wx
```

Render all files in `foo` and `bar` directories to `/tmp`:

```
$ wxpager foo bar --output /tmp
```

## Installation

    npm install wxpager-cli -g

## License

MIT

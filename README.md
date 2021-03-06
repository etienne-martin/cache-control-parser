# cache-control-parser

A humble cache-control parser.

[![Coveralls github](https://img.shields.io/coveralls/github/etienne-martin/cache-control-parser.svg)](https://coveralls.io/github/etienne-martin/cache-control-parser)
[![CircleCI build](https://img.shields.io/circleci/project/github/etienne-martin/cache-control-parser.svg)](https://circleci.com/gh/etienne-martin/cache-control-parser)
[![npm version](https://img.shields.io/npm/v/cache-control-parser.svg)](https://www.npmjs.com/package/cache-control-parser)
[![npm monthly downloads](https://img.shields.io/npm/dm/cache-control-parser.svg)](https://www.npmjs.com/package/cache-control-parser)

## Features

- Fault-tolerant
- Case-insensitive
- No dependencies
- Built-in TypeScript support
- Thoroughly tested

✨ **New:** you can now stringify parsed cache controls

## Getting Started

### Installation

To use cache-control-parser in your project, run:

```bash
npm install cache-control-parser
```

### Usage

**Example** - parse a cache control string into an object:

```javascript
import { parse } from "cache-control-parser";

const directives = parse(
  "public, max-age=86400, no-transform"
);

console.log(directives);
```

Output:

```json
{
  "public": true,
  "max-age": 86400,
  "no-transform": true
}
```

**Example** - stringify a cache control object into a string:

```javascript
import { stringify } from "cache-control-parser";

const cacheControl = stringify({
  "max-age": 300,
  "s-maxage": 3600,
  "public": true
});

console.log(cacheControl);
```

Output:

```
max-age=300, s-maxage=3600, public
```

**Supported cache-control directives:**

```
{
  "max-age"?: number;
  "s-maxage"?: number;
  "stale-while-revalidate"?: number;
  "stale-if-error"?: number;
  "public"?: boolean;
  "private"?: boolean;
  "no-store"?: boolean;
  "no-cache"?: boolean;
  "must-revalidate"?: boolean;
  "proxy-revalidate"?: boolean;
  "immutable"?: boolean;
  "no-transform"?: boolean;
}
```

## TypeScript

Type definitions are included in this library and exposed via:

```typescript
import { CacheControl } from "cache-control-parser";
```

## Built with

- [node.js](https://nodejs.org/en/) - Cross-platform JavaScript run-time environment for executing JavaScript code server-side.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
- [Jest](https://facebook.github.io/jest/) - Delightful JavaScript Testing.

## Contributing

When contributing to this project, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Update the [README.md](https://github.com/etienne-martin/cache-control-parser/blob/master/README.md) with details of changes to the library.

Execute `yarn test` and update the tests if needed.

### Testing

Run the full test suite:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

## Authors

- **Etienne Martin** - _Initial work_ - [etiennemartin.ca](https://etiennemartin.ca/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

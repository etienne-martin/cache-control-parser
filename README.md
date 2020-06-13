# cache-control-parser

A lightweight cache-control parser.

[![Coveralls github](https://img.shields.io/coveralls/github/etienne-martin/cache-control-parser.svg)](https://coveralls.io/github/etienne-martin/cache-control-parser)
[![CircleCI build](https://img.shields.io/circleci/project/github/etienne-martin/cache-control-parser.svg)](https://circleci.com/gh/etienne-martin/cache-control-parser)
[![npm version](https://img.shields.io/npm/v/cache-control-parser.svg)](https://www.npmjs.com/package/cache-control-parser)
[![npm monthly downloads](https://img.shields.io/npm/dm/cache-control-parser.svg)](https://www.npmjs.com/package/cache-control-parser)

## Features

- No dependencies
- Built-in TypeScript support
- Thoroughly tested

## Getting Started

### Installation

To use cache-control-parser in your project, run:

```bash
npm install cache-control-parser
```

### Usage

```javascript
import cacheControlParser from "cache-control-parser";

const cacheControl = cacheControlParser(
  "public, max-age=86400, no-transform"
);

console.log(cacheControl);
```

Output:

```json
{
  "isPublic": true,
  "maxAge": 86400,
  "noTransform": true
}
```

**Supported cache-control directives:**

```
{
  maxAge?: number;
  sharedMaxAge?: number;
  staleWhileRevalidate?: number;
  staleIfError?: number;
  isPublic?: boolean;
  isPrivate?: boolean;
  noStore?: boolean;
  noCache?: boolean;
  mustRevalidate?: boolean;
  proxyRevalidate?: boolean;
  immutable?: boolean;
  noTransform?: boolean;
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

# sitemap-merger

A simple CLI and npm package to merge sitemaps together.

This project is based on deprecated project [merge-sitemaps](https://github.com/rdilweb/merge-sitemaps)

## Usage

It will merge all child **url** comparing the text from tag **loc** from sitemap A to B resulting C.

### With CLI

```bash
$ npx sitemap-merger sitemap.xml subdir/other-sitemap.xml build/sitemap.xml --format
```

(With the CLI, argument 1 is the base sitemap, argument 2 is the secondary sitemap, and argument 3 is the destination for the output.)

### With API

```js
const sitemapMerger = require("sitemap-merger");

console.log(
  sitemapMerger.merge(
    "base-xml-sitemap-as-string",
    "secondary-xml-sitemap-as-string",
    { format: true }
  )
);
```

## License

MIT. See the LICENSE file.

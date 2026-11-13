# wptb-preview

A standalone, in-browser preview of the [WP Table Builder](https://wordpress.org/plugins/wp-table-builder/) editor.

**Live:** https://protibimbok.github.io/wptb-preview/

The editor normally runs inside wp-admin. Here it runs on a static page with no WordPress and no server: a small bootstrap script provides the config the editor expects and answers its REST requests in the browser.

## What works

- The drag-and-drop builder with the Pro add-on enabled, opened on an "Element showcase" table that uses all fourteen element types
- A second sample table, the table list, the "Add New" page and every bundled template
- Saving, duplicating, trashing and restoring, all simulated in memory

Nothing leaves your browser and nothing is stored. Reloading the page starts again from the sample tables. Features that need a WordPress site (media library, live front-end preview, export, settings, the AI Assistant) are not available.

## What is in this repository

Built files only. There is no plugin source code here.

| Path | Contents |
| --- | --- |
| `dist/` | The production build of the plugin's editor (JS, CSS, fonts) |
| `pro/` | The production build of the Pro add-on |
| `assets/` | Static assets shipped with the plugin (icons, images, template data) |
| `demo/boot.js` | The bootstrap that stands in for WordPress |
| `demo/showcase.json` | The showcase table, in the plugin's saved format |
| `demo/patterns.json` | The template list the "Add New" page reads |
| `demo/img/` | Illustrations used by the showcase table |
| `index.html` | The page that loads it all |
| `scripts/` | The build script |

## Rebuilding

The built files come from a local checkout of the plugin's monorepo.

```sh
pnpm install
pnpm build              # builds the free + Pro editors in the monorepo, then copies them here
pnpm build:copy         # copies the monorepo's existing build without rebuilding
```

The first run asks for the monorepo path and saves it in `.dir` (git-ignored). Delete `.dir` to be asked again.

The script replaces `dist/`, `pro/` and `assets/`, and regenerates `demo/patterns.json` and `index.html` with the new hashed file names. It also updates the version in `demo/boot.js`.

## License

WP Table Builder is licensed under GPL-3.0-or-later. The built files here are distributed under the same license.

# wptb-preview

A standalone, in-browser preview of the [WP Table Builder](https://wordpress.org/plugins/wp-table-builder/) editor.

**Live:** https://protibimbok.github.io/wptb-preview/

The editor normally runs inside wp-admin. Here it runs on a static page with no WordPress and no server: a small bootstrap script provides the config the editor expects and answers its REST requests in the browser.

## What works

- The drag-and-drop builder, opened on a sample table
- The table list, the "Add New" page and the free template
- Saving, duplicating, trashing and restoring, all simulated in memory

Nothing leaves your browser and nothing is stored. Reloading the page starts again from the sample table. Features that need a WordPress site (media library, live front-end preview, export, settings) are not available.

## What is in this repository

Built files only. There is no plugin source code here.

| Path | Contents |
| --- | --- |
| `dist/` | The production build of the free plugin's editor (JS, CSS, fonts) |
| `assets/` | Static assets shipped with the free plugin (icons, images, template data) |
| `demo/boot.js` | The bootstrap that stands in for WordPress |
| `demo/patterns.json` | The template list the "Add New" page reads |
| `index.html` | The page that loads it all |

## License

WP Table Builder is licensed under GPL-3.0-or-later. The built files here are distributed under the same license.

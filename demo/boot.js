/*
 * Standalone preview bootstrap for the WP Table Builder editor.
 *
 * The editor normally runs inside wp-admin and talks to the plugin's REST API.
 * This file stands in for WordPress: it provides the config object the editor
 * reads, a minimal `wp.i18n`, and answers every REST request in the browser
 * through the editor's own `WPTB_HTTP_HOOK`. Nothing is sent to a server and
 * nothing is stored: a reload starts from the sample table again.
 */
(function () {
  "use strict";

  var BASE = new URL(".", window.location.href).href.replace(/\/$/, "");
  var SAMPLE_PATTERN = "employee-table";
  var DEMO_NOTE = " (preview: changes stay in this tab)";

  // Open straight into the builder with the sample table.
  var params = new URLSearchParams(window.location.search);
  if (!params.get("page")) {
    window.history.replaceState(null, "", "?page=wptb-builder&table=1");
  }

  window.wp = window.wp || {};
  window.wp.i18n = window.wp.i18n || {
    __: function (s) { return s; },
    _x: function (s) { return s; },
    _n: function (single, plural, n) { return n === 1 ? single : plural; },
    sprintf: function (s) { return s; },
  };

  window.WPTB_CFG = {
    WEB_URL: BASE,
    PLUGIN_URL: BASE,
    HOME_URL: BASE,
    IS_PRO: false,
    FONT_FAMILIES: [],
    SETTINGS: {
      is_authorized: true,
      version: "2.3.0",
      all_roles: {
        administrator: { name: "Administrator", capabilities: [] },
        editor: { name: "Editor", capabilities: [] },
      },
      general: {
        allowed_roles: ["administrator"],
        display_edit_link_frontend: false,
        display_credits: false,
        restrict_users_to_their_tables: false,
        disable_emoji_image_conversion: false,
        disable_theme_styles: false,
        sidebar_position: "left",
        enable_version_sync: false,
        take_over_entire_screen: true,
      },
      table_style: "",
      lazy_load: { enabled: false },
    },
    NONCE: { wp_rest: "preview" },
  };

  // ------------------------------------------------------------ fake backend
  var now = function () {
    return new Date().toLocaleString("en-GB", {
      hour: "2-digit", minute: "2-digit", hour12: true,
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  var tables = [
    { id: 1, title: "Employee Table", date: now(), modified: now(), is_template: false, status: "draft" },
  ];
  var nextId = 2;
  var tags = {};
  var nextTagId = 1;
  var patternCache = {};

  var json = function (data, status) {
    return new Response(JSON.stringify(data), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  var loadJson = function (path) {
    if (!patternCache[path]) {
      patternCache[path] = fetch(BASE + path).then(function (r) {
        if (!r.ok) throw new Error("Not found: " + path);
        return r.json();
      });
    }
    return patternCache[path];
  };

  var findTable = function (id) {
    id = Number(id);
    for (var i = 0; i < tables.length; i++) {
      if (tables[i].id === id) return tables[i];
    }
    return null;
  };

  var toObject = function (data) {
    if (!data) return {};
    if (data instanceof FormData) {
      var o = {};
      data.forEach(function (v, k) { o[k] = v; });
      return o;
    }
    return data;
  };

  var listTables = function (q) {
    var status = q.get("status") === "trash" ? "trash" : "draft";
    var search = (q.get("search") || "").toLowerCase();
    var except = (q.get("except") || "").split(",").filter(Boolean).map(Number);
    var perPage = Math.min(Math.max(15, Number(q.get("per_page")) || 15), 100);
    var page = Math.max(1, Number(q.get("page")) || 1);
    var sortBy = (q.get("sort_by") || "id").toLowerCase();
    var desc = (q.get("sort_order") || "DESC").toUpperCase() !== "ASC";

    var rows = tables.filter(function (t) {
      return t.status === status &&
        except.indexOf(t.id) < 0 &&
        (!search || t.title.toLowerCase().indexOf(search) >= 0);
    });
    rows.sort(function (a, b) {
      var x = sortBy === "title" ? a.title.localeCompare(b.title) : a.id - b.id;
      return desc ? -x : x;
    });
    var total = rows.length;
    return {
      posts: rows.slice((page - 1) * perPage, page * perPage).map(function (t) {
        return { id: t.id, title: t.title, date: t.date, modified: t.modified, is_template: t.is_template };
      }),
      total_count: total,
      total_pages: Math.max(1, Math.ceil(total / perPage)),
      current_page: page,
      per_page: perPage,
    };
  };

  var tableAction = function (action, body) {
    var ids = body.ids && body.ids.length ? body.ids.map(Number) : [Number(body.id)];
    var kind = action.replace("_bulk", "");
    ids.forEach(function (id) {
      var t = findTable(id);
      if (!t) return;
      if (kind === "trash") t.status = "trash";
      if (kind === "restore") t.status = "draft";
      if (kind === "delete") tables.splice(tables.indexOf(t), 1);
      if (kind === "duplicate") {
        tables.push({
          id: nextId++, title: t.title + " (copy)", date: now(), modified: now(),
          is_template: t.is_template, status: "draft",
        });
      }
    });
    return json({ message: "Done" + DEMO_NOTE, success: true });
  };

  window.WPTB_HTTP_HOOK = function (req) {
    var url = new URL(req.path, "https://preview.local");
    var path = url.pathname.replace(/\/+$/, "") || "/";
    var q = url.searchParams;
    var body = toObject(req.data);

    if (req.method === "GET") {
      if (path === "/table") {
        var t = findTable(q.get("id"));
        if (!t) return json({ message: "Table not found." }, 404);
        return loadJson("/assets/patterns/free/" + SAMPLE_PATTERN + ".json").then(function (p) {
          return json({ table: p.content, name: t.title, tags: [], is_template: t.is_template });
        });
      }
      if (path === "/tables") return json(listTables(q));
      if (path === "/patterns") {
        var name = (q.get("name") || "").replace(/[^a-z0-9-_]/gi, "");
        if (name) {
          return loadJson("/assets/patterns/free/" + name + ".json").then(
            function (p) { return json({ pattern: p }); },
            function () { return json({ error: "Pattern was not found" }); }
          );
        }
        return loadJson("/demo/patterns.json").then(json);
      }
      if (path === "/tags") return json({ tags: tags });
      return json({ message: "Not available in the preview." }, 404);
    }

    if (path === "/save") {
      var existing = body.id ? findTable(body.id) : null;
      if (existing) {
        existing.title = body.title || existing.title;
        existing.modified = now();
        return json({ id: String(existing.id), message: "Table saved" + DEMO_NOTE, is_new: false });
      }
      var created = {
        id: nextId++, title: body.title || "Untitled table", date: now(), modified: now(),
        is_template: !!body.prebuilt, status: "draft",
      };
      tables.push(created);
      return json({ id: String(created.id), message: "Table created" + DEMO_NOTE, is_new: true });
    }
    if (path === "/tags") {
      var id = nextTagId++;
      tags[id] = body.name || "Tag " + id;
      return json({ id: id, name: tags[id], tags: tags });
    }
    if (/^\/(duplicate|trash|restore|delete)(_bulk)?$/.test(path)) {
      return tableAction(path.slice(1), body);
    }
    if (path === "/settings") {
      return json({ message: "Settings are read-only in the preview.", success: true });
    }
    return json({ message: "Not available in the preview." }, 400);
  };
})();

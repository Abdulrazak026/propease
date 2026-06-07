import fs from "node:fs";

const target = "node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/turbopack.js";
const src = new URL("turbopack.js", import.meta.url);

if (fs.existsSync(target)) {
  fs.cpSync(src, target, { force: true });
  console.log("[patch] Applied turbopack.js Windows fix");
}

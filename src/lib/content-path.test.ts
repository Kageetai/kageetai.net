import assert from "node:assert/strict";
import { test } from "node:test";
import { contentPath } from "./content-path.ts";

test("blog URLs use the published date and filename slug, including nested posts", () => {
  assert.equal(
    contentPath("blog/new-blog-new-stack", new Date("2025-12-02")),
    "/2025-12-02-new-blog-new-stack",
  );
  assert.equal(
    contentPath(
      "blog/today-i-learned/react-pdf-renderer",
      new Date("2026-02-17"),
    ),
    "/2026-02-17-react-pdf-renderer",
  );
});

test("project and game URLs also use the published date and filename slug", () => {
  assert.equal(
    contentPath("projects/css/marquee-machine", new Date("2026-02-17")),
    "/2026-02-17-marquee-machine",
  );
  assert.equal(
    contentPath("games/super-skelemania", new Date("2025-10-15")),
    "/2025-10-15-super-skelemania",
  );
});

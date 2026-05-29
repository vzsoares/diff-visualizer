import { expect, test } from "@playwright/test";

// baseURL already includes the Pages sub-path, so navigate with RELATIVE paths
// (a leading "/" would escape to the origin root).

const SAMPLE_DIFF = `--- a/src/hello.ts
+++ b/src/hello.ts
@@ -1,3 +1,4 @@
 export function greet(name: string): string {
-    return \`Hello, \${name}!\`;
+    const msg = \`Hello, \${name}!\`;
+    return msg;
 }`;

test("home loads under the base path with all assets and boots Alpine", async ({
    page,
}) => {
    const failures: string[] = [];
    page.on("requestfailed", (r) =>
        failures.push(`${r.url()} (${r.failure()?.errorText})`),
    );
    page.on("response", (r) => {
        if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });

    await page.goto("./");
    await expect(
        page.locator("h1").filter({ hasText: "Paste your diff" }),
    ).toBeVisible();
    await expect.poll(() => page.evaluate(() => "Alpine" in window)).toBe(true);
    expect(failures, "no failed requests on the built home page").toEqual([]);
});

test("a shared URL resolves and survives a reload (SPA fallback + basePath)", async ({
    page,
}) => {
    // Navigate to home, share a diff, then reload to exercise the 404.html fallback.
    await page.goto("./");
    await page.getByTestId("diff-input").fill(SAMPLE_DIFF);
    await page.getByTestId("share-btn").click();
    await expect(page.getByTestId("diff-output")).toBeVisible();

    // Reloading a ?d=… URL is the GitHub Pages 404.html / SPA-fallback case.
    await page.reload();
    await expect(page.getByTestId("diff-output")).toBeVisible();

    // URL must stay under the single base path (guards the double-base regression).
    const { pathname } = new URL(page.url());
    expect(pathname.startsWith("/diff-visualizer/")).toBe(true);
    expect(pathname).not.toContain("diff-visualizer/diff-visualizer");
});

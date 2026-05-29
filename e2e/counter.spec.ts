import { expect, test } from "@playwright/test";

const SAMPLE_DIFF = `--- a/src/hello.ts
+++ b/src/hello.ts
@@ -1,5 +1,6 @@
 export function greet(name: string): string {
-    return \`Hello, \${name}!\`;
+    const msg = \`Hello, \${name}!\`;
+    return msg;
 }`;

test("share flow: paste diff → share → view rendered output", async ({
    page,
}) => {
    await page.goto("/");

    // Editor is visible; textarea accepts input.
    await expect(page.getByTestId("diff-input")).toBeVisible();
    await page.getByTestId("diff-input").fill(SAMPLE_DIFF);

    // Click Share — URL gains a ?d= param.
    await page.getByTestId("share-btn").click();
    await expect(page).toHaveURL(/[?&]d=/);

    // Viewer mode: rendered output and share-url input are visible.
    await expect(page.getByTestId("diff-output")).toBeVisible();
    await expect(page.getByTestId("share-url")).toBeVisible();

    // diff2html rendered at least one addition and one deletion row.
    await expect(page.locator(".d2h-ins").first()).toBeVisible();
    await expect(page.locator(".d2h-del").first()).toBeVisible();
});

test("new diff resets back to the editor", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("diff-input").fill(SAMPLE_DIFF);
    await page.getByTestId("share-btn").click();
    await expect(page.getByTestId("diff-output")).toBeVisible();

    await page.getByTestId("new-diff-btn").click();
    await expect(page.getByTestId("diff-input")).toBeVisible();
    await expect(page).not.toHaveURL(/[?&]d=/);
});

test("loading a shared URL renders the diff directly", async ({ page }) => {
    // Navigate to the editor, share a diff, grab the URL, then visit it fresh.
    await page.goto("/");
    await page.getByTestId("diff-input").fill(SAMPLE_DIFF);
    await page.getByTestId("share-btn").click();
    const sharedUrl = page.url();

    await page.goto(sharedUrl);
    await expect(page.getByTestId("diff-output")).toBeVisible();
    await expect(page.locator(".d2h-ins").first()).toBeVisible();
});

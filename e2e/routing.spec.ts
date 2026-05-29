import { expect, test } from "@playwright/test";

test("unknown route shows the 404 page", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(
        page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
});

test("logo link navigates back to home", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await page.getByRole("link", { name: "Diff Sharer" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("diff-input")).toBeVisible();
});

import { describe, expect, it } from "vitest";
import { decodeDiff, encodeDiff, generateDiff } from "./diff";

describe("encodeDiff / decodeDiff", () => {
    it("roundtrips a unified diff", () => {
        const diff = "--- a/file.txt\n+++ b/file.txt\n@@ -1 +1 @@\n-old\n+new";
        expect(decodeDiff(encodeDiff(diff))).toBe(diff);
    });

    it("handles an empty string", () => {
        expect(decodeDiff(encodeDiff(""))).toBe("");
    });

    it("produces a whitespace-free URL-safe string", () => {
        const encoded = encodeDiff(
            "--- a/foo.ts\n+++ b/foo.ts\n@@ -1,3 +1,3 @@\n context\n-old\n+new",
        );
        expect(encoded).not.toMatch(/\s/);
        expect(encoded).not.toMatch(/[+/=]/);
    });

    it("roundtrips a large diff without data loss", () => {
        const bigDiff = Array.from(
            { length: 100 },
            (_, i) => `-line ${i}\n+line ${i} updated`,
        ).join("\n");
        expect(decodeDiff(encodeDiff(bigDiff))).toBe(bigDiff);
    });
});

describe("generateDiff", () => {
    it("produces a unified diff with +/- markers", () => {
        const diff = generateDiff("hello\nworld\n", "hello\nearth\n");
        expect(diff).toContain("-world");
        expect(diff).toContain("+earth");
    });

    it("produces an empty hunk for identical texts", () => {
        const diff = generateDiff("same\n", "same\n");
        expect(diff).not.toContain("@@");
    });

    it("uses the provided filename in the header", () => {
        const diff = generateDiff("a\n", "b\n", "foo.ts");
        expect(diff).toContain("foo.ts");
    });
});

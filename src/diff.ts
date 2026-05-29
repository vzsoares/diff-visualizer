import LZString from "lz-string";
import { html as diff2htmlHtml } from "diff2html";
import { createTwoFilesPatch } from "diff";

export function encodeDiff(diff: string): string {
    return LZString.compressToEncodedURIComponent(diff);
}

export function decodeDiff(encoded: string): string {
    if (!encoded) return "";
    return LZString.decompressFromEncodedURIComponent(encoded) ?? "";
}

export function generateDiff(
    original: string,
    modified: string,
    fileName = "file",
): string {
    return createTwoFilesPatch(fileName, fileName, original, modified, "", "");
}

export function renderDiff(diff: string): string {
    return diff2htmlHtml(diff, {
        drawFileList: true,
        matching: "lines",
        outputFormat: "line-by-line",
    });
}

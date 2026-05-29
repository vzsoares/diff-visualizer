import { decodeDiff, encodeDiff, generateDiff, renderDiff } from "./diff";

export interface DiffSharerState {
    inputMode: "raw" | "compare";
    rawDiff: string;
    originalText: string;
    modifiedText: string;
    renderedHtml: string;
    mode: "editor" | "viewer";
    copied: boolean;
    shareUrl: string;
    init(this: DiffSharerState): void;
    share(this: DiffSharerState): void;
    compare(this: DiffSharerState): void;
    copyLink(this: DiffSharerState): Promise<void>;
    newDiff(this: DiffSharerState): void;
}

function pushDiff(state: DiffSharerState, diff: string) {
    const encoded = encodeDiff(diff);
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("d", encoded);
    window.history.pushState({}, "", url.toString());
    state.shareUrl = url.toString();
    state.renderedHtml = renderDiff(diff);
    state.mode = "viewer";
}

export function diffSharer(): DiffSharerState {
    return {
        inputMode: "raw",
        rawDiff: "",
        originalText: "",
        modifiedText: "",
        renderedHtml: "",
        mode: "editor",
        copied: false,
        shareUrl: "",

        init(this: DiffSharerState) {
            const params = new URLSearchParams(window.location.search);
            const encoded = params.get("d");
            if (encoded) {
                const decoded = decodeDiff(encoded);
                this.rawDiff = decoded;
                this.renderedHtml = renderDiff(decoded);
                this.shareUrl = window.location.href;
                this.mode = "viewer";
            }
        },

        share(this: DiffSharerState) {
            const trimmed = this.rawDiff.trim();
            if (!trimmed) return;
            pushDiff(this, trimmed);
        },

        compare(this: DiffSharerState) {
            const diff = generateDiff(this.originalText, this.modifiedText);
            pushDiff(this, diff);
        },

        async copyLink(this: DiffSharerState) {
            await navigator.clipboard.writeText(this.shareUrl);
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 2000);
        },

        newDiff(this: DiffSharerState) {
            window.history.pushState({}, "", window.location.pathname);
            this.rawDiff = "";
            this.originalText = "";
            this.modifiedText = "";
            this.renderedHtml = "";
            this.shareUrl = "";
            this.mode = "editor";
        },
    };
}

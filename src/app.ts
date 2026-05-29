import "diff2html/bundles/css/diff2html.min.css";
import Alpine from "alpinejs";
import PineconeRouter from "pinecone-router";
import { diffSharer } from "./alpine";

Alpine.plugin(PineconeRouter);
Alpine.data("diffSharer", diffSharer);

document.addEventListener("alpine:init", () => {
    Alpine.store("app", {
        version: __APP_VERSION__,
        base: import.meta.env.BASE_URL,
    });

    window.PineconeRouter.settings({
        basePath: import.meta.env.BASE_URL.replace(/\/$/, ""),
        targetID: "app",
        hash: false,
    });
});

window.Alpine = Alpine;
Alpine.start();

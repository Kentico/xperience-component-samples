import { exposeWidgetComponent } from "../../../../shared/helpers";

const setVideoSize = (widgetGuid: string) => {
    const videoIframe = document.querySelector<HTMLIFrameElement>(`iframe[data-widget-guid='${widgetGuid}']`);
    if (!videoIframe) {
        return;
    }

    const aspectRatio = 9 / 16;
    const parentElementWidth = videoIframe.parentElement!.clientWidth;
    const videoHeight = Math.round(parentElementWidth * aspectRatio);

    videoIframe.style.width = `${parentElementWidth}px`;
    videoIframe.style.height = `${videoHeight}px`;
};

export const init = (widgetGuid: string) => {
    setVideoSize(widgetGuid);

    window.addEventListener("resize", (event) => {
        setVideoSize(widgetGuid);
    });
};

exposeWidgetComponent("video", {init: init})

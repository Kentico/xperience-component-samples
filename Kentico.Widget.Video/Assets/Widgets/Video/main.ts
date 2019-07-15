window.kentico = window.kentico || {};

const setVideoSize = (videoUrl: string) => {
    const videoIframe = document.querySelector<HTMLIFrameElement>(`iframe[src='${videoUrl}']`);
    if (!videoIframe) {
        return;
    }

    const aspectRatio = 9 / 16;
    const parentElementWidth = videoIframe.parentElement!.clientWidth;
    const videoHeight = Math.round(parentElementWidth * aspectRatio);

    videoIframe.style.width = `${parentElementWidth}px`;
    videoIframe.style.height = `${videoHeight}px`;
};

const init = (videoUrl: string) => {
    setVideoSize(videoUrl);

    window.addEventListener("resize", (event) => {
        setVideoSize(videoUrl);
    });
};

window.kentico._initVideoWidget = init;
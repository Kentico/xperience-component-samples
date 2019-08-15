export const hideToolbar = () => {
    const toolbars = document.querySelectorAll<HTMLElement>(".fr-toolbar");
    toolbars.forEach((toolbar) => {
        if (isVisible(toolbar)) {
            toolbar.classList.add("ktc-hidden");
        }
    });
}

export const showToolbar = () => {
    const toolbars = document.querySelectorAll<HTMLElement>(".fr-toolbar");
    toolbars.forEach((toolbar) => {
        if (toolbar.classList.contains("ktc-hidden")) {
            toolbar.classList.remove("ktc-hidden");
        }
    });
}

const isVisible = (element: HTMLElement) => {
    return element !== null && element.offsetParent !== null;
}
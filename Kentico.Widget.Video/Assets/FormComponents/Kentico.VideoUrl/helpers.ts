import _merge from "lodash/merge";

/**
 * Regular expression representing an URL.
 */
const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

/**
 * Checks if a URL points to an image.
 * @param url URL.
 */
export const isUrlImage = (url: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (!urlPattern.test(url)) {
            reject("Invalid URL.");
            return;
        }

        const request = new XMLHttpRequest();
        request.open('HEAD', url);
        request.onload = function () {
            if (this.status === 200) {
                if (this.getResponseHeader("Content-Type")!.indexOf("image") !== -1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                reject("The provided URL does not represent an image.");
            }
        };
        request.onerror = () => {
            reject("Request failed.");
        }

        request.send();
    });
}

/**
 * Exposes form component API to the global namespace.
 * @param name Form component name.
 * @param api API object to expose.
 */
export const exposeFormComponent = (name: string, api: object) => {
    window.MyCompany = window.MyCompany || {} as any;
    
    _merge(window.MyCompany, {
        formComponents: {
            [name]: {
                ...api,
            }
        }
    })
}
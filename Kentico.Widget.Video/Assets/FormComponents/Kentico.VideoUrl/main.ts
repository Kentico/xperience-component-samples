import { debounce } from "debounce";

import { ImageUrlOptions, ImageUrlWithPreview } from "@/types/mycompany";
import { isUrlImage, exposeFormComponent } from "./helpers";
import "./style.less";

const init = (options: ImageUrlOptions) => {
    const controlInstance = document.querySelector(`div[data-control-instance-id='${options.identifier}']`);
    
    const imageUrlControl = controlInstance && controlInstance.querySelector(`.${options.controlClassName}`);
    const validationMessage = controlInstance && controlInstance.querySelector(`.${options.validationClassName}`);
    const imagePreview = controlInstance && controlInstance.querySelector<HTMLImageElement>(`.${options.imagePreviewClassName}`);

    if (!controlInstance || !imageUrlControl || !validationMessage || !imagePreview) {
        return;
    }

    const setPreviewImage = (imageUrl: string | null, errorMessage: string | null = null) => {
        if (imageUrl) {
            imagePreview.src = imageUrl;
            validationMessage.textContent = "";
        } else {
            imagePreview.src = options.placeholderImageUri;
            validationMessage.textContent = errorMessage;
        }
    };

    imageUrlControl.addEventListener("input", debounce((event) => {
        const url = (event.target as HTMLInputElement).value;

        if (!url) {
            setPreviewImage(null, "");
            return;
        }

        const onSuccess = (urlIsImage: boolean) => {
            if (urlIsImage) {
                setPreviewImage(url);
            } else {
                setPreviewImage(null, "The provided URL does not represent an image.");
            }
        };
        const onError = (errorMessage: string) => {
            setPreviewImage(null, errorMessage);
        };

        isUrlImage(url).then(onSuccess, onError);
    }, 500));
}

const api: ImageUrlWithPreview = {
    init,
}

exposeFormComponent("imageUrlWithPreview", api);
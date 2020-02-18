import { imageCommands } from "./image-commands";

export const initializeImagePlugin = () => {
    imageCommands.forEach(command => command.register());
}
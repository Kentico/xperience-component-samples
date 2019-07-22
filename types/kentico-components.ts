export interface KenticoComponents {
    readonly widgets: {
        video: {
            init: (widgetGuid: string) => void
        }
    };
}

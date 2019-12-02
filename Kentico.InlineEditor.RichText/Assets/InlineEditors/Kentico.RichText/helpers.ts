/**
 * Returns native HTML element which is wrapped by provided jQuery object.
 * @param $element jQuery object which targets the element.
 * @returns HTML element or null.
 */
export const unwrapElement = <T extends HTMLElement>($element: JQuery): T | null => {
    if ($element) {
        return ($element as any)[0] as T;
    }

    return null;
}

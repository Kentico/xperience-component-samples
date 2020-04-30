import $ from "jquery";
import "select2";
import "select2/dist/css/select2.css";

import { ObjectSelectorItemModel } from "./types";
import "./styles.less";

const OBJECT_TYPE_ATTRIBUTE = "data-object-type";
const GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE = "data-get-objects-endpoint-url";
const INITIALIZATION_EVENT_NAME = "Kentico.Selector.ObjectSelector.Initialize";
const IDENTIFIER_ATTRIBUTE = "data-value-for";

document.addEventListener(INITIALIZATION_EVENT_NAME, (event) => {
    const $selector = $(event.target as HTMLSelectElement);

    // Remove the name attribute to enforce that the hidden input sends the property value
    $selector.removeAttr("name");

    $selector.select2({
        placeholder: "(None)",
        minimumResultsForSearch: 7,
        // @ts-ignore // TODO: Remove 'containerCssClass' option when https://github.com/select2/select2/issues/5843 is resolved
        selectionCssClass: "ktc-object-selector-container",  
        containerCssClass: "ktc-object-selector-container",
        dropdownCssClass: "ktc-object-selector-dropdown",
        ajax: {
            url: $selector.attr(GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE),
            dataType: 'json',
            delay: 250,
            data: (params) => ({
                objectType: $selector.attr(OBJECT_TYPE_ATTRIBUTE),
                pageIndex: params.page || 0,
                searchTerm: params.term
            }),
            processResults: (data, params) => ({
                results: data.items.map((i: ObjectSelectorItemModel) => ({
                    id: JSON.stringify(i.value),
                    text: i.text,
                })),
                pagination: {
                    more: data.nextPageAvailable
                }
            }),
            cache: true
        },
    });

    // Ensure selected value as an array
    $selector.on("change.select2", function () {
        console.log(`[${IDENTIFIER_ATTRIBUTE}='${this.id}']`);
        const valueElement = document.querySelector<HTMLInputElement>(`[${IDENTIFIER_ATTRIBUTE}='${this.id}']`);
        valueElement!.value = `[${$(this).val()}]`;
    });

    // Ensure search input placeholder
    $selector.one("select2:open", (event) => {
        const { $dropdown } = $(event.target).data('select2');
        $dropdown.find("input.select2-search__field").prop("placeholder", getString("SearchPlaceholder"));
    });
});

const getString = (resourceString: string) => window.kentico.localization.strings[`Kentico.Selector.ObjectSelector.${resourceString}`];

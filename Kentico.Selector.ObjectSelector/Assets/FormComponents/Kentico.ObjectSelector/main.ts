import $ from "jquery";
import "select2";
import "select2/dist/css/select2.css";

import { ObjectSelectorItemModel } from "./types";
import "./styles.less";

const OBJECT_TYPE_ATTRIBUTE = "data-object-type";
const GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE = "data-get-objects-endpoint-url";
const INITIALIZATION_EVENT_NAME = "Kentico.Selector.ObjectSelector.Initialize";
const IDENTIFIER_ATTRIBUTE = "data-value-for";
const IDENTIFY_BY_GUID_ATTRIBUTE = "data-identify-object-by-guid";

document.addEventListener(INITIALIZATION_EVENT_NAME, (event) => {
    const $selector = $(event.target as HTMLSelectElement);

    // Remove the name attribute to enforce that the hidden input sends the property value
    $selector.removeAttr("name");

    $selector.select2({
        placeholder: getString("Placeholder"),
        minimumResultsForSearch: 7,
        // @ts-ignore
        selectionCssClass: "ktc-object-selector-container",  
        dropdownCssClass: "ktc-object-selector-dropdown",
        ajax: {
            url: $selector.attr(GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE),
            dataType: 'json',
            delay: 400,
            data: (params) => ({
                objectType: $selector.attr(OBJECT_TYPE_ATTRIBUTE),
                pageIndex: params.page || 0,
                searchTerm: params.term,
                identifyByGuid: $selector.attr(IDENTIFY_BY_GUID_ATTRIBUTE),
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
        language: {
            loadingMore: () => getString("LoadingMore"),
            noResults: () => getString("NoResults"),
            searching: () => getString("Searching"),
        }
    });

    // Ensure selected value as an array
    $selector.on("change.select2", function () {
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

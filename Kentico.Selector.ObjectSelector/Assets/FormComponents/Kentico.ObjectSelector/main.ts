import $ from "jquery";
import "select2";
import "select2/dist/css/select2.css";

import { ObjectSelectorItemModel } from "./types";
import "./styles.less";

const OBJECT_TYPE_ATTRIBUTE = "data-object-type";
const GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE = "data-get-objects-endpoint-url";
const INITIALIZATION_EVENT_NAME = "Kentico.Selector.ObjectSelector.Initialize";

document.addEventListener(INITIALIZATION_EVENT_NAME, (event) => {
    const $selector = $(event.target as HTMLSelectElement).empty();

    $selector.select2({
        placeholder: "(None)", //TODO MAE-305: Represent as value not placeholder
        // minimumResultsForSearch: 50, //TODO MAE-305: Minimum results for search?
        // selectionCssClass: "ktc-object-selector-container",  //TODO MAE-305: Use this when https://github.com/select2/select2/issues/5843 is resolved
        containerCssClass: "ktc-object-selector-container",
        dropdownCssClass: "ktc-object-selector-dropdown",
        ajax: {
            url: $selector.attr(GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE),
            dataType: 'json',
            delay: 250,
            data: (params) => ({
                objectType: $selector.attr(OBJECT_TYPE_ATTRIBUTE),
                page: params.page || 1,
                searchTerm: params.term
            }),
            processResults: (data, params) => ({
                results: data.results.map((i: ObjectSelectorItemModel) => ({
                    id: JSON.stringify(i.value),
                    text: i.text,
                })),
                pagination: {
                    more: (params.page! * 50) < data.searchItemsCount
                }
            }),
            cache: true
        },
    });

    // Ensure search input placeholder
    $selector.one("select2:open", (event) => {
        const { $dropdown } = $(event.target).data('select2');
        $dropdown.find("input.select2-search__field").prop("placeholder", getString("SearchPlaceholder"));
    });
});

const getString = (resourceString: string) => window.kentico.localization.strings[`Kentico.Selector.ObjectSelector.${resourceString}`];

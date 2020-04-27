import $ from "jquery";
import "select2";
import "select2/dist/css/select2.css";

import { ObjectSelectorItemModel } from "./types";
import "./styles.less";

document.addEventListener('initObjectSelector', () => {
    const $formControl = $(".ktc-object-selector").empty();
    $formControl.select2({
        placeholder: "Search for item", //TODO MAE-305: Localize placeholder
        minimumResultsForSearch: 50, //TODO MAE-305: Minimum results for search?
        // minimumInputLength: 1, //TODO MAE-305: Minimum input length?
        dropdownCssClass: "ktc-object-selector-dropdown",
        ajax: {
            url: $formControl.data("objects-endpoint"),
            dataType: 'json',
            delay: 250,
            data: (params) => ({
                objectType: $formControl.data("object-type"),
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
});
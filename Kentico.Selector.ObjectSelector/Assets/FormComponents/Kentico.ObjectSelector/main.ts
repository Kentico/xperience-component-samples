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
const DROPDOWN_CLASS_NAME = "ktc-object-selector-dropdown";
const HIDE_SEARCH_CLASS_NAME = "ktc-object-selector-dropdown__search--hide";
const SEARCHING_MESSAGE_CLASS_NAME = "ktc-object-selector-dropdown--searching";
const SEARCH_FIELD_CLASS_NAME = "select2-search__field";

document.addEventListener(INITIALIZATION_EVENT_NAME, (event) => {
    const $selector = $(event.target as HTMLSelectElement);
    let isSearchEnsured = false;

    // Remove the name attribute to enforce that the hidden input sends the property value
    $selector.removeAttr("name");

    $selector.select2({
        placeholder: getString("Placeholder"),
        minimumResultsForSearch: 7,
        // @ts-ignore
        selectionCssClass: "ktc-object-selector-container",  
        dropdownCssClass: `${DROPDOWN_CLASS_NAME} ${HIDE_SEARCH_CLASS_NAME}`,
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
            transport(params, success, failure) {
                var $request = $.ajax(params);
            
                $request.then((data) => {
                    if (!isSearchEnsured) {
                        const $dropdown = $selector.data("select2").$dropdown.find(`.${DROPDOWN_CLASS_NAME}`);
                        $dropdown.removeClass(HIDE_SEARCH_CLASS_NAME);
                        $dropdown.find(`input.${SEARCH_FIELD_CLASS_NAME}`).focus();
                        isSearchEnsured = true;
                    }

                    return data;
                }).then(success as JQuery.jqXHR.DoneCallback);
                $request.fail(failure as JQuery.jqXHR.FailCallback<JQuery.jqXHR>);
            
                return $request;
            },
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
        $dropdown.find(`input.${SEARCH_FIELD_CLASS_NAME}`).prop("placeholder", getString("SearchPlaceholder"));
    });

    // Ensure "Searching..." message visibility
    $selector.on("select2:open", (event) => {
        const { $dropdown } = $(event.target).data('select2');
        setTimeout(() => {
            $dropdown.find(`.${DROPDOWN_CLASS_NAME}`).addClass(SEARCHING_MESSAGE_CLASS_NAME);
        }, 200);
    });

    // Reset "Searching..." message visibility handling
    $selector.on("select2:closing", (event) => {
        const { $dropdown } = $(event.target).data('select2');
        $dropdown.find(`.${DROPDOWN_CLASS_NAME}`).removeClass(SEARCHING_MESSAGE_CLASS_NAME);
    });
});

const getString = (resourceString: string) => window.kentico.localization.strings[`Kentico.Selector.ObjectSelector.${resourceString}`];

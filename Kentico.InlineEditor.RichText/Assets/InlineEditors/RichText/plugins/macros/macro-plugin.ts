import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import { MacrosPlugin } from "./macro-types";
import { showActionsPopup, showConfigurationPopup, hideActionsPopup, hideConfigurationPopup} from "./popups";

export const macroPlugin = (editor: FroalaEditor): MacrosPlugin => {

    return [showActionsPopup, hideActionsPopup, showConfigurationPopup, hideConfigurationPopup].reduce((accumulator: MacrosPlugin, currentValue) => {
        accumulator[currentValue.name] = currentValue.bind(editor);
        
        return accumulator;
    }, {} as MacrosPlugin);
}

import { showPopup, getDialogElement } from "../../popup-helper";
import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import { INSERT_LINK_POPUP_NAME } from "../link-constants";
import { getLinkConfigurationPopupTemplate } from "../link-templates";
import { getString } from "../link-helpers";

export function showInsertLinkPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkText: string) {
  const customLayer = "<div class=\"ktc-configure-popup\"></div>";
  showPopup(this, INSERT_LINK_POPUP_NAME, relatedElementPosition, this.opts.popupInsertLinkButtons, customLayer)

  const dialog = getDialogElement(this, INSERT_LINK_POPUP_NAME);
    
    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        container!.innerHTML = getLinkConfigurationPopupTemplate("", linkText, getString("Label.Path"), getString("Label.Text"));
    }
}

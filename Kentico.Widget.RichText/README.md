# Rich Text widget

The rich text widget allows content editors to edit rich text in a "WYSIWYG" manner.

## Requirements
* **Kentico 12.0.43** or later version is required to use this component. The **[Froala editor](https://www.froala.com/wysiwyg-editor) license** is also included in these versions, you do not need to buy your own license to use this component.

## Download & installation
Prerequisite: You need to have [NodeJS runtime](https://nodejs.org/en/) installed to be able to use this widget.

1. Clone this repository to your file system.
    - `git clone https://github.com/Kentico/ems-mvc-components.git`
1. Open the `Kentico.Components.sln` solution in Visual Studio and build the solution.
1. Open PowerShell and navigate to the root of the repository.
1. In the PowerShell, run the `npm install` command and then the `npm run build` command.
1. Copy `Kentico.Widget.RichText.dll`, `Kentico.Widget.RichText.Views.dll` and `Kentico.InlineEditor.RichText.dll` files from the `/SandboxSite/bin` folder from this repository to the `bin` folder of your MVC project.
1. Copy contents of `Kentico.Widget.RichText/App_Data` and `Kentico.InlineEditor.Richtext/App_Data` folders from this repository to the `App_Data` folder of your MVC project.
    - This step ensures that resource strings required by the component are available in your project.
1. Copy contents of `Kentico.Widget.RichText/Content` and `Kentico.InlineEditor.RichText/Content` folders from this repository to the `Content` folder of your MVC project.
    - This step ensures that scripts and stylesheets required by the component are available in your project.

You may need to adjust the [limitations](https://kentico.com/CMSPages/DocLinkMapper.ashx?version=latest&link=page_builder_editable_areas_mvc#CreatingpageswitheditableareasinMVC-Limitingwidgetsallowedinaneditablearea) of editable areas to be able to insert the widget into an editable area.

![Rich Text widget](/Kentico.Widget.RichText/RichTextWidget.gif)

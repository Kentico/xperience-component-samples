# Rich Text widget

The **Rich text** widget allows content editors to edit text areas in a "WYSIWYG" manner.

## Requirements
* **Kentico 12.0.43** or later version is required to use this component. The **[Froala editor](https://www.froala.com/wysiwyg-editor) license** is also included in these versions, you do not need to buy your own license to use this component.

## Installation

If you want to include the *Rich text* widget in your MVC project, install the [Kentico.EMS12.MvcComponents.Widget.RichText](https://www.nuget.org/packages/Kentico.EMS12.MvcComponents.Widget.RichText) NuGet package.

Run the following command in the [Package Manager Console](https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-powershell):
```
PM> Install-Package Kentico.EMS12.MvcComponents.Widget.RichText
```

You can also visit the [Wiki](https://github.com/Kentico/ems-mvc-components/wiki) of this repository to learn how to [customize the toolbar](https://github.com/Kentico/ems-mvc-components/wiki/Customizing-the-Rich-text-editor-toolbar) of the editor.

**Note**: You may need to adjust the [limitations](https://kentico.com/CMSPages/DocLinkMapper.ashx?version=latest&link=page_builder_editable_areas_mvc#CreatingpageswitheditableareasinMVC-Limitingwidgetsallowedinaneditablearea) of editable areas to be able to insert the widget into an editable area.

![Rich Text widget](/Kentico.Widget.RichText/RichTextWidget.gif)

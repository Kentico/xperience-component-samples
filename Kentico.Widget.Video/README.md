# Video widget

The video widget allows content editors to insert an embedded video from Youtube or Vimeo into their website. The URL of the video can be specified in the widget's `Video URL` property.

### Properties
- **Video URL** - the URL of a [Youtube video](https://www.youtube.com/watch?v=dQw4w9WgXcQ) or a [Vimeo video](https://vimeo.com/148751763) to be displayed on the live site.

### Download & installation
Prerequisite: You need to have [NodeJS runtime](https://nodejs.org/en/) installed to be able to use this widget.

1. Clone this repository to your file system.
    - `git clone https://github.com/Kentico/xperience-component-samples.git`
1. Open the `Kentico.Components.sln` solution in Visual Studio and build the solution.
1. Open PowerShell and navigate to the root of the repository.
1. In the PowerShell, run the `npm install` command and then the `npm run build` command.
1. Add `Kentico.Widget.Video.dll` and `Kentico.Widget.Video.Views.dll` files from the `/Kentico.Widget.Video/bin/<configuration>/netcoreapp3.1` folder from this repository as assembly references into your .NET Core project.
1. Copy contents of the `Kentico.Widget.Video/Content/InlineEditors` folder from this repository to the `wwwroot/PageBuilder/Admin` folder of your .NET Core project and the `Kentico.Widget.Video/Content/Widgets` to the `wwwroot/PageBuilder/Public` folder of your .NET Core project.
    - This step ensures that the inline editor scripts and stylesheets required by the component are available in the administration interface and the widget styles are available in the live site.

After rebuilding your solution, you can place the video widget into your pages when using the page builder. You may need to adjust the [limitations](https://kentico.com/CMSPages/DocLinkMapper.ashx?version=latest&link=page_builder_editable_areas_mvc#CreatingpageswitheditableareasinMVC-Limitingwidgetsallowedinaneditablearea) of editable areas to be able to insert the widget into an editable area.

![Video widget](/Kentico.Widget.Video/VideoWidget.gif)

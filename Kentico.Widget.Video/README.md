# Video widget

The video widget allows content editors to insert an embedded video from Youtube into their website. The URL of the video can be specified in the widget's `Video URL` property.

### Properties
- **Video URL** - a URL of a [Youtube video](https://www.youtube.com/watch?v=dQw4w9WgXcQ) to be displayed on the live site.

### Download & installation
Prerequisite: You need to have [NodeJS runtime](https://nodejs.org/en/) installed to be able to use this widget.

1. Clone this repository to your file system.
    - `git clone https://github.com/Kentico/ems-mvc-components.git`
1. Open the `Kentico.Components.sln` solution in Visual Studio and build the solution.
1. Open PowerShell and navigate to the root of the repository.
1. In the PowerShell, run the `npm install` command and then the `npm run build` command.
1. Copy `Kentico.Widget.Video.dll` and `Kentico.Widget.Video.Views.dll` files from the `/SandboxSite/bin` folder from this repository to the `bin` folder of your MVC project.
1. Copy the `Kentico.Widget.Video/App_Data` folder from this repository to the `App_Data` folder of your MVC project.
    - This step ensures that resource strings required by the widget are available in your project.
1. Copy the `Kentico.Widget.Video/Content` folder from this repository to the `Content` folder of your MVC project.
    - This step ensures that stylesheets required by the widget are available in your project.

You may need to adjust the [limitations](https://kentico.com/CMSPages/DocLinkMapper.ashx?version=latest&link=page_builder_editable_areas_mvc#CreatingpageswitheditableareasinMVC-Limitingwidgetsallowedinaneditablearea) of editable areas to be able to insert the widget into an editable area.

![Video widget](/Kentico.Widget.Video/VideoWidget.gif)

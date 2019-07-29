# Video widget

The video widget allows content editors to insert an embedded video from Youtube into their website. The URL of the video can be specified in the widget's `Video URL` property.

### Properties
- **Video URL** - a URL of a [Youtube video](https://www.youtube.com/watch?v=dQw4w9WgXcQ) to be displayed on the live site.

### Download & installation
- Copy and include [`Kentico.Widget.Video`](/Kentico.Widget.Video) and [`Kentico.Widget.Video.Views`](/Kentico.Widget.Video.Views) projects into your solution
- Reference these two projects from your MVC application
- Build and Run your MVC application

You may need to adjust the [limitations](https://kentico.com/CMSPages/DocLinkMapper.ashx?version=latest&link=page_builder_editable_areas_mvc#CreatingpageswitheditableareasinMVC-Limitingwidgetsallowedinaneditablearea) of editable areas to be able to insert the widget into an editable area.

![Video widget](/Kentico.Widget.Video/VideoWidget.gif)

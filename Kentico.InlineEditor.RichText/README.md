# Rich Text inline editor

The rich text inline editor for editing rich text in a "WYSIWYG" manner.

### Download & installation
1. Clone this repository to your file system.
    - `git clone https://github.com/Kentico/ems-mvc-components.git`
1. Open the `Kentico.Components.sln` solution in Visual Studio and build the solution.
1. Open PowerShell and navigate to the root of the repository.
1. In the PowerShell, run the `npm install` command and then the `npm run build` command.
1. Copy `Kentico.InlineEditor.RichText.dll` file from the `/SandboxSite/bin` folder from this repository to the `bin` folder of your MVC project.
1. Copy contents of the `Kentico.InlineEditor.RichText/Content` folder from this repository to the `Content` folder of your MVC project..
    - This step ensures that scripts and stylesheets required by the component are available in your project.
1. Use the `Html.Kentico().RichTextEditor(propertyName, propertyValue)` extension method in the views of your widgets.

![Rich Text inline editor](/Kentico.InlineEditor.RichText/RichTextInlineEditor.gif)

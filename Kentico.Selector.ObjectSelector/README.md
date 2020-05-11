# Object selector form component
**!!!** This component is under development. It is not advised to use this component as there are going to be breaking changes in the future. **!!!**

The object selector form component allows content editors to select objects of a specified type (defined by the developer) when editing page builder components via the properties configuration dialog. The selector returns a collection of *ObjectSelectorItem* objects corresponding to the objects selected by the user, which contain the code name of the returned object in the *ObjectCodeName* property. Additionally, the selector can be set to also return GUIDs of object in the *ObjectGuid* property.

## Installation
If you want to include the object selector form component in your MVC project, install the [Kentico.EMS12.MvcComponents.TBD.TBD](https://www.nuget.org/packages/Kentico.EMS12.MvcComponents.TBD.TBD) NuGet package.

Run the following command in the [Package Manager Console](https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-powershell):
```
PM> Install-Package Kentico.EMS12.MvcComponents.TBD.TBD
```

After installing the NuGet package, map the routes used by the object selector by using the *MapObjectSelectorRoutes* method in your application's *RouteConfig.cs* file (after mapping general Kentico Xperience routes).
```
public static void RegisterRoutes(RouteCollection routes)
{
  ...
  routes.Kentico().MapObjectSelectorRoutes();
  ...
}
```

## Using the selector
The object selector has the following configurable properties:

- **ObjectType** - A string property that contains the code name of the object type that will be listed in the selector. For example, use "personas.persona" to list personas.
- (Optional) **IdentifyObjectByGuid** - A boolean property where you can choose whether the returning object should contain GUID of the selected object. By default, the option is turned off (*false*) and the returned object contains only object code name.

The following example shows the declaration of a property in a page builder component's property model class that has the ObjectSelector form component assigned as its editing component. The selected object is then retrieved in the component's controller.

### Component's model class
```csharp
// Assigns a selector component to the 'Contacts' property
[EditingComponent(ObjectSelector.IDENTIFIER)]
// Configures the object type which can be selected
[EditingComponentProperty(nameof(ObjectSelectorProperties.ObjectType), "om.contact")]
// Configures the returned objects to contain GUIDs
[EditingComponentProperty(nameof(ObjectSelectorProperties.IdentifyObjectByGuid), true)]
// Returns a list of object selector items (objects that contain GUIDs of selected contacts)
public IEnumerable<ObjectSelectorItem> Contacts { get; set; } = Enumerable.Empty<ObjectSelectorItem>();
```
### Component's controller class
```csharp
// Retrieves the GUID of the first selected object from the 'Contacts' property
Guid guid = GetProperties().Contacts.FirstOrDefault()?.ObjectGuid ?? Guid.Empty;
// Retrieves the ContactInfo object that corresponds to the selected object GUID
ContactInfo contact = ContactInfo.Provider.Get().WhereEquals("ContactGuid", guid);
```

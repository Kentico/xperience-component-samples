# Object selector form component
---
:warning: This component is under development. It is not recommended to include this component in your projects.
---

The object selector form component allows content editors to select objects of a specified type (defined by the developer) when editing page builder components via the properties configuration dialog. The selector returns a collection of *ObjectSelectorItem* objects corresponding to the objects selected by the user, which contain the code name of the returned object in the *ObjectCodeName* property. Additionally, the selector can be set to return GUIDs of object in the *ObjectGuid* property instead of code names.

## Installation

This component is under development right now, therefore the NuGet package is not available. Stay tuned!

## Using the selector
![Object selector](/Kentico.Selector.ObjectSelector/ObjectSelector.gif)

The object selector has the following configurable properties:

- **ObjectType** - A string property that contains the code name of the object type that will be listed in the selector. For example, use "personas.persona" to list personas.
- (Optional) **IdentifyObjectByGuid** - A boolean property where you can choose whether the returning object contains GUID of the selected object instead of the code name. By default, the option is turned off (*false*) and the returned object contains only object code name.

The following example shows the declaration of a property in a page builder component's property model class that has the ObjectSelector form component assigned as its editing component. The selected object is then retrieved in the component's controller.

### Component's model class
```csharp
// Assigns a selector component to the 'Contacts' property
[EditingComponent(ObjectSelector.IDENTIFIER)]
// Configures the object type which can be selected
[EditingComponentProperty(nameof(ObjectSelectorProperties.ObjectType), "om.contact")]
// Configures the object selector to store GUIDs of the selected objects
[EditingComponentProperty(nameof(ObjectSelectorProperties.IdentifyObjectByGuid), true)]
// Returns a list of object selector items (objects that contain GUIDs of selected contacts)
public IEnumerable<ObjectSelectorItem> Contacts { get; set; } = Enumerable.Empty<ObjectSelectorItem>();
```
### Component's controller class
```csharp
// Retrieves the GUID of the first selected object from the 'Contacts' property
Guid guid = GetProperties().Contacts.FirstOrDefault()?.ObjectGuid ?? Guid.Empty;
// Retrieves the ContactInfo object that corresponds to the selected object GUID
ContactInfo contact = ContactInfoProvider.GetContactInfo(guid);
```

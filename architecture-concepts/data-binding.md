---
title: Data Binding
---

## Data Binding

The purpose of this article is to explain what Data Binding is and how it works in NativeScript.

Data binding is the process of connecting application user interface (UI) to a data object (code). It enables changes propagation by reflecting UI modifications in the code and vice versa.

::: tip Note

1. In this article `source` is used as any object in the code and `target` as any UI control (like [TextField](/ui/components.html#textfield)).

2. The article uses StackBlitz IDE + Nativescript Preview app to show different examples of data binding in Nativescript. Use these tools to try out the code snippets provided throughout the article.
   :::

### Data flow direction

Part of the data binding settings deals with how the data flows between the UI and the data object. NativeScript data binding supports the following data transmissions:

- **One-Way**: This is the default setting, which ensures that the target property updates when a change in the source property occurs. However, UI modification will not update the source property.
- **Two-Way**: This setting ensures the reflection of changes in both directions — from target to source and source to target. You can use two-way data binding when you need to handle user input.

## Two-way binding

### Binding in code

The example below consists of a Label, TextField and a source property to which the UI controls are bound. First, the **source** object is created with a **textSource** property, initially set to an empty string and then the source object is bound to both the `TextField` and `Label` elements.

Then when the user inputs new string into the `TextField`, the **two-way** binding will update the TextField's text property. Since the Label is bound to the same property, its text property will also be updated. For the Label the data flow is **one-way**,as the changes only propagate from the code to the UI. For a constant flow of changes propagation from the source property to the Label, the source property has to raise a **propertyChange** event in order to notify the Label of the changes. To raise this event, a built-in class is used, which provides this functionality - [Observable](/nativescript-core/observable.md).

<iframe width="100%" height="600px" src="https://stackblitz.com/edit/nativescript-stackblitz-templates-itpjy3?embed=1&hideExplorer=0&file=app/main-view-model.ts"></iframe>

### Binding in XML

To create a binding in XML, a source object is needed, which will be created the same way, as in the example above. Then the binding is created in the XML using a mustache(`{{ }}`) syntax. With an XML declaration, only the names of the properties are set - for the target: text, and for source: textSource. The interesting thing here is that the source of the binding is not specified explicitly.

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd">
  <StackLayout>
    <TextField text="{{ textSource }}" />
  </StackLayout>
</Page>
```

::: tip Note
When creating UI elements with an XML declaration, the data binding is two-way by default.
:::

### Binding to a property

An important part of the data binding is setting the source object. For a continuous flow of data changes, the source property needs to emit a **propertyChange** event. NativeScript data binding works with any object that emits this event. Adding a binding source happens by passing it as a second parameter in the method `bind(bindingOptions, source)`. This parameter is optional and could be omitted, in which case a property named **bindingContext** of the `View` class is used as the source. What is special about this property is that it is inheritable across the visual tree. This means that a UI control can use the **bindingContext** of the first of its parent elements, which has an explicitly set **bindingContext**. See [Parent Binding](/architecture-concepts/data-binding.md#parent-binding) In the example from [Binding in Code](/architecture-concepts/data-binding.md#binding-in-code), the **bindingContext** can be set either on a [Page](/ui/components.md#page) instance or a [StackLayout](/ui/components.md#stacklayout) instance and the [TextField](/ui/components.md#textfield) will inherit it as a proper source for the binding of its "text" property.

```js
page.bindingContext = source
//or
stackLayout.bindingContext = source
```

```ts
page.bindingContext = source
//or
stackLayout.bindingContext = source
```

### Parent Binding

Another common case in working with bindings is requesting access to the parent binding context. This is because a parent UI element and a child UI element can have different binding contexts and the child UI might need to bind its property to a source property in its parent's **bindingContext**.

Generally, the binding context is inheritable, but not when the elements (items) are created dynamically based on some data source. For example, [ListView](/ui/components.md#listview) creates its child items based on an itemТemplate, which describes what the ListView element will look like. When this element is added to the visual tree, it gets for binding context an element from a ListView items array (with the corresponding index). This process creates a new binding context chain for the child item and its inner UI elements. So, the inner UI element cannot access the binding context of the ListView. In order to solve this problem, NativeScript binding infrastructure has two special keywords: `$parent` and `$parents`. While the first one denotes the binding context of the direct parent visual element, the second one can be used as an array (with a number or string index). This gives you the option to choose either N levels of UI nesting or get a parent UI element with a given type. Let's see how this works with an example.

<iframe width="100%" height="600px" src="https://stackblitz.com/edit/nativescript-stackblitz-templates-y6sj7k?embed=1&hideExplorer=0&&file=app/main-page.xml"></iframe>

::: tip Note
If the value of the `items` property of the `ListView` is an array of plain elements(numbers,string, dates) as in the preceeding example, you use the `$value` variable to access the current item of the array.

If it is an array of objects,you use the current object property name as the variable name.
:::

### Binding to an event in XML

There is an option to bind a function to execute on a specific event. This option is available only through an XML declaration. To implement such a functionality, the source object should have an event handler function. The following is an example of binding a function on a button `tap` event.

<!--tabs: XML -->

```html
<StackLayout>
  <button text="Test Button For Binding" tap="{{ onTap }}" />
</StackLayout>
```

```js
source.set('onTap', function (eventData) {
  console.log('button is tapped!')
})
page.bindingContext = source
```

```ts
source.set('onTap', function (eventData) {
  console.log('button is tapped!')
})
page.bindingContext = source
```

::: tip Note
Be aware that if there is a button with an event handler function **onTap** within the page code-behind (more info about XML declarations, and **onTap** function within the **bindingContext** object, then there will not be two event handlers hooked up for that button. For executing the function in the code behind, the following syntax should be used in the XML - **tap="onTap"** and for the function from the bindingContext - **tap="{{ onTap }}"**.
:::

### Using expressions for bindings

You can create a custom expression for bindings. Custom expressions could help in cases when a certain logic should be applied to the UI, while keeping the underlying business data and logic clear. To be more specific, let's see a basic binding expression example. The result should be a TextField element that will display the value of the sourceProperty followed by " some static text" string.

<!--tabs: XML -->

```html
<Page xmlns="http://schemas.nativescript.org/tns.xsd">
  <StackLayout>
    <TextField text="{{ sourceProperty, sourceProperty + ' some static text' }}" />
  </StackLayout>
</Page>
```

:::tip Note
Binding expression could be used without explicitly named source property. In that case `$value` is used as a source property. However this could lead to problems when a nested property should be observed for changes (e.g. _item.nestedProp_). $value represents bindingContext and when any property of the bindingContext is changed expression will be evaluated. Since nestedProp is not a property of the bindingContext in _item.nestedProp_ then there will be no propertyChange listener attached and changes to _nestedProp_ will not be populated to UI. So it is a good practice to specify which property should be used as source property in order to eliminate such issues.
:::

The full binding syntax contains three parameters:

1.  The first parameter is the source property, which will be listened to for changes.
2.  The second parameter is the expression that will be evaluated.
3.  The third parameter states whether the binding is two-way or not.

As mentioned earlier, XML declaration creates a two-way binding by default, so in the example, the third parameter could be omitted. Keeping the other two properties means that the custom expression will be evaluated only when the sourceProperty changes. The first parameter could also be omitted; if you do that, then the custom expression will not be evaluated every time the bindingContext changes. Thus, the recommended syntax is to include two parameters in the XML declaration, as in our example - the property of interest and the expression, which has to be evaluated.

### Supported Expressions

NativeScript supports different kind of expressions including:
| Feature| Example| Description|
|--------|--------|------------|
|`property access`| `obj1.obj2.prop1`|Resulting in the value of the `prop1` property of the object `obj2`. Expressions in binding are based on polymer expressions, which supports re-evaluation of expression when any value within the dot (`.`) chain is changed. NativeScript uses expressions only in context of bindings (for now), so a binding expression will be re-evaluated only when the binding source property is changed (due to performance considerations). The expression part will not observe and therefore will not initiate re-evaluation.|
|array access| `arrayVar[indexVar]`| Taking the value of an element in an array (arrayVar) accessed by a valid index for that array (indexVar).|
|logical operators | `!var1` |Reversing the logical state of the operand - logical not.|
|unary operators |`+var1`, `-var2`| Converts `var1` into a number. Converts `var2` to a number and negates it.|
|binary operators | `var1 + var2`| Adding the value of `var2` to `var1`. Supported operators: `+`, `-`, `*`, `/`, `%`.|
|comparison operators | `var1 > var2` | Comparing whether the value of `var1` is more than the value of `var2`. Other supported operators: `<`, `>`, `<=`, `>=`, `==`, `!=`, `===`, `!==`.|
|logical comparison operators | `var1>1 && var2>1` | Evaluating whether the value of `var1` is more than 1 `AND` the value of `var2` is more than 2. Supported operators: `&&`, `\|\|`.|
|ternary operator | `var1 ? var2 : var3` | Evaluating the value of `var1` and if `true`, returns `var2`, else returns `var3`.|
|grouping parenthesis | (a + b) \* (c + d)|
|function calls | `myFunc(var1, var2, ..., varN)`| Where `myFunc` is a function available in `bindingContext`(used as context for expression) or within application level resources. The value of the `var1` and `varN` will be used as parameter(s).|
|filters | `expression \| filter1(param1, ...) \| filter 2` |A filter is an object or a function that is applied to the value of the expression. Within the context of binding, this feature is used as converters. For more information, see the dedicated topic Using Converters in Bindings.|
:::tip Note
Special characters need to be escaped as follows:

- " => \&quot;
- ' => \&apos;
- < => \&lt;
- \> => \&gt;
- & => \&amp;
  :::

### Using converters in bindings

Speaking of a two-way binding, there is a common problem - having different ways of storing and displaying data. Probably the best example here is the date and time objects. Date and time information is stored as a number or a sequence of numbers (very useful for indexing, searching and other database operations), but this is not the best possible option for displaying date to the application user. Also there is another problem when the user inputs a date (in the example below, the user types into a TextField). The result of the user input will be a string, which will be formatted in accordance with the user's preferences. This string should be converted to a correct date object. Let's see how this could be handled with NativeScript binding.
The code below shows how to format a TextField input:

<!--tabs: XML -->

```html
<Page navigatingTo="onNavigatingTo" xmlns="http://schemas.nativescript.org/tns.xsd">
  <StackLayout>
    <TextField text="{{ testDate, testDate | dateConverter('DD.MM.YYYY') }}" />
  </StackLayout>
</Page>
```

```js
import { fromObject } from '@nativescript/core'

export function onNavigatingTo(args) {
  const dateConverter = {
    toView(value, format) {
      let result = format
      const day = value.getDate()
      result = result.replace('DD', day < 10 ? `0${day}` : day)
      const month = value.getMonth() + 1
      result = result.replace('MM', month < 10 ? `0${month}` : month)
      result = result.replace('YYYY', value.getFullYear())

      return result
    },
    toModel(value, format) {
      const ddIndex = format.indexOf('DD')
      const day = parseInt(value.substr(ddIndex, 2), 10)
      const mmIndex = format.indexOf('MM')
      const month = parseInt(value.substr(mmIndex, 2), 10)
      const yyyyIndex = format.indexOf('YYYY')
      const year = parseInt(value.substr(yyyyIndex, 4), 10)
      const result = new Date(year, month - 1, day)

      return result
    }
  }

  const page = args.object
  const viewModel = fromObject({
    dateConverter,
    testDate: new Date()
  })

  page.bindingContext = viewModel
}
```

```ts
import { Page, EventData, fromObject } from '@nativescript/core'

export function onNavigatingTo(args: EventData) {
  const dateConverter = {
    toView(value, format) {
      let result = format
      const day = value.getDate()
      result = result.replace('DD', day < 10 ? '0' + day : day)
      const month = value.getMonth() + 1
      result = result.replace('MM', month < 10 ? '0' + month : month)
      result = result.replace('YYYY', value.getFullYear())

      return result
    },
    toModel(value, format) {
      const ddIndex = format.indexOf('DD')
      const day = parseInt(value.substr(ddIndex, 2), 10)
      const mmIndex = format.indexOf('MM')
      const month = parseInt(value.substr(mmIndex, 2), 10)
      const yyyyIndex = format.indexOf('YYYY')
      const year = parseInt(value.substr(yyyyIndex, 4), 10)
      const result = new Date(year, month - 1, day)

      return result
    }
  }

  const page = <Page>args.object
  const viewModel = fromObject({
    dateConverter,
    testDate: new Date()
  })

  page.bindingContext = viewModel
}
```

Note the special operator `\|` within the expression. The above code snippet (both XML and JavaScript) will display a date in a `DD.MM.YYYY` format (`toView()` function), and when a new date is entered with the same format, it is converted to a valid Date object (`toModel()` function). A Converter object should have one or two functions (`toView()` and `toModel()`) executed every time when a data should be converted. The `toView()` function is called when data will be displayed to the end user as a value of any UI view, and the `toModel()` function will be called when there is an editable element (like TextField) and the user enters a new value. In the case of one-way binding, the Converter object could have only a `toView()` function or it should be a function. All converter functions have an array of parameters where the first parameter is the value that will be converted, and all other parameters are custom parameters defined in the converter definition.

:::tip Note
Any run-time error within the converter methods (`toView()` and `toModel()`) will be handled automatically and the application will not break, but the data in the view-model will not be altered (in case of error) and an error message with more information will be logged to the console. To enable it, use the built-in [Trace](/nativescript-core/trace.md) with an `Trace.categories.Error` category. A date converter is simplified just for the sake of the example and it is not supposed to be used as a fully functional converter from date to string and vice versa. The best way to get a date from a user is to use a [DatePicker](/ui/components.md#date-picker).
:::

A converter can accept not only static custom parameters, but any value from the bindingContext. For example:

<!--tabs: XML -->

```html
<Page navigatingTo="onNavigatingTo" xmlns="http://schemas.nativescript.org/tns.xsd">
  <StackLayout>
    <TextField text="{{ testDate, testDate | dateConverter(dateFormat) }}" />
  </StackLayout>
</Page>
```

```ts
import { Page, EventData, fromObject } from '@nativescript/core'

export function onNavigatingTo(args: EventData) {
  const dateConverter = {
    toView(value, format) {
      let result = format
      const day = value.getDate()
      result = result.replace('DD', day < 10 ? '0' + day : day)
      const month = value.getMonth() + 1
      result = result.replace('MM', month < 10 ? '0' + month : month)
      result = result.replace('YYYY', value.getFullYear())

      return result
    },
    toModel(value, format) {
      const ddIndex = format.indexOf('DD')
      const day = parseInt(value.substr(ddIndex, 2), 10)
      const mmIndex = format.indexOf('MM')
      const month = parseInt(value.substr(mmIndex, 2), 10)
      const yyyyIndex = format.indexOf('YYYY')
      const year = parseInt(value.substr(yyyyIndex, 4), 10)
      const result = new Date(year, month - 1, day)

      return result
    }
  }

  const page = <Page>args.object
  const viewModel = fromObject({
    dateConverter,
    dateFormat: 'DD.MM.YYYY',
    testDate: new Date()
  })

  page.bindingContext = viewModel
}
```

Setting a converter function and a parameter within the bindingContext is very useful for ensuring proper conversion of data. However, this is not the case when [ListView](/ui/components.md#listview) items should be bound. The problem comes from the fact that the bindingContext of a ListView is the individual data items in the array, and to apply a converter, the converter and its parameters should be added to the each data item, which will result in multiple converter instances. Tackling this problem with NativeScript is fairly simple. the binding infrastructure search in the application level resources to find a proper converter and parameters. So you could add the converters to the resources in the [Application](/nativescript-core/application.md) class. To be more clear, examine the following example (both XML and JavaScript):

<!--tabs: XML-->

```html
<Page navigatingTo="onNavigatingTo" xmlns="http://schemas.nativescript.org/tns.xsd">
  <StackLayout>
    <ListView items="{{ items }}" height="200">
      <ListView.itemTemplate>
        <label text="{{ itemDate | dateConverter(dateFormat) }}" />
      </ListView.itemTemplate>
    </ListView>
  </StackLayout>
</Page>
```

```js
import { Application, Page, EventData, fromObject } from '@nativescript/core'

export function onNavigatingTo(args) {
  const list = []
  for (let i = 0; i < 5; i++) {
    list.push({ itemDate: new Date() })
  }

  const dateConverter = (value, format) => {
    let result = format
    const day = value.getDate()
    result = result.replace('DD', day < 10 ? `0${day}` : day)
    const month = value.getMonth() + 1
    result = result.replace('MM', month < 10 ? `0${month}` : month)
    result = result.replace('YYYY', value.getFullYear())

    return result
  }

  Application.getResources().dateConverter = dateConverter
  Application.getResources().dateFormat = 'DD.MM.YYYY'

  const page = args.object
  const viewModel = fromObject({
    items: list
  })

  page.bindingContext = viewModel
}
```

```ts
import { Application, Page, EventData, fromObject } from '@nativescript/core'

export function onNavigatingTo(args: EventData) {
  const list = []
  for (let i = 0; i < 5; i++) {
    list.push({ itemDate: new Date() })
  }

  const dateConverter = (value, format) => {
    let result = format
    const day = value.getDate()
    result = result.replace('DD', day < 10 ? '0' + day : day)
    const month = value.getMonth() + 1
    result = result.replace('MM', month < 10 ? '0' + month : month)
    result = result.replace('YYYY', value.getFullYear())

    return result
  }

  application.getResources().dateConverter = dateConverter
  application.getResources().dateFormat = 'DD.MM.YYYY'

  const page = <Page>args.object
  const viewModel = fromObject({
    items: list
  })

  page.bindingContext = viewModel
}
```

### Stop binding

Generally there is no need to stop binding explicitly since a Binding object uses weak references, which prevents any memory leaks. However, there are some scenarios where binding must be stopped. In order to stop an existing data binding, just call the **unbind()** method with the target property name as the argument.

```ts
targetTextField.unbind('text')
```

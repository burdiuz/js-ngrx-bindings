# @actualwave/ngrx-bindings

This library aims to help developer to use NGRX from templates skipping boilerplate code in components.

> Note: This library allows using object paths to property in the store to select the value and dispatch action by specifying its type string. This can be useful while developing, but I strongly recommend to refrain from using them after and replace with selectors and action creators as soon as possible.

Here is a [classic](https://codesandbox.io/s/qvy8xvlxzj) example with counter [updated to use NGRX Bindings on codesandbox.io](https://codesandbox.io/s/ngrx-bindings-introduction-with-counter-8tm5e).

# Select data from the Store

This library provides multiple ways of selecting data from the Store, using pipes, directives and components. There are two types of each -- one to use NGRX selector and another to use JS path to the property.
Using `selector` pipe

```html
<div>{{"selectUpdatedBy" | selector | date }}</div>
```

Using `select` pipe

```html
<div>{{"feature.dates.updatedBy" | select | date }}</div>
```

These pipes are impure, so they will call change detection on every Store update.

Here is how it looks when using directives

```html
<div>
  Select with data path:
  <span select="feature.dates.updatedBy"></span>
  <span selectOnce="feature.dates.updatedBy"></span>
</div>
<div>
  Select using selector name:
  <span selector="selectUpdatedBy"></span>
  <span selectorOnce="selectUpdatedBy"></span>
</div>
```

And components

```html
<div>
  Select with data path:
  <rx-select value="feature.dates.updatedBy"></rx-select>
  <rx-select-once value="feature.dates.updatedBy"></rx-select-once>
</div>
<div>
  Select using selector name:
  <rx-selector value="selectUpdatedBy"></rx-selector>
  <rx-selector-once value="selectUpdatedBy"></rx-selector-once>
</div>
```

To use selector component, directive or pipe, they should be aware of available NGRX Store selectors. To setup NGRX Store selectors, use `SelectorsModule`:

```javascript
import { NGRXBindingsModule, SelectorsModule } from "@actualwave/ngrx-bindings";
import * as dateSelectors from "./store/date.selectors";

@NgModule({
  declarations: [],
  imports: [NGRXBindingsModule, SelectorsModule.forSelectors(dateSelectors)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

All selectors imported with `SelectorsModule` can be referenced by UI in this module.

# Dispatch actions

This library provides a `dispatch` pipe, which dispatches an action every time value changes.

```html
<div>{{someValue | dispatch : "valueUpdateAction" }}</div>
```

And `action` pipe to dispatch action using its type.

```html
<div>{{someValue | action : "Value Update" }}</div>
```

This will result in dispatching action like:

```javascript
{
	type: "Value Update",
	payload: someValue,
}
```

Also, you can create own pipes for specific actions.

```javascript
import {
  NGRXBindingsModule,
  createActionPipes,
} from "@actualwave/ngrx-bindings";
import { valueUpdateActionCreator } from "./store/value.actions";

@NgModule({
  declarations: [
    createActionPipes({
      dispatchValueUpdated: valueUpdateActionCreator,
    }),
  ],
  imports: [],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Then use it

```html
<div>{{someValue | dispatchValueUpdate }}</div>
```

This pipe dispatches selected action with value being passed to action creator or used as payload and returns it unchanged, so it could be chained with other pipes.

Since it is not possible to use pipes with event expressions, like this

```html
<button (click)="$event | dispatch : 'somethingUpdated'">Click Me</button>
```

I've figured we can use components for dispatching actions and have all the interaction with the Store in template. To make this possible I've created two components -- rx-action and rx-channel. First allows dispatching single NGRX action and second dispatches multiple actions.
To make component work, add it to template, reference it with template variable and call its method.

```html
<div>
  <rx-action #myAction value="TestActionType"></rx-action>
  ...
  <!-- anywhere in this template -->
  <button (click)="myAction.dispatch($event)">Dispatch Action</button>
</div>
```

On button click, it will dispatch action like:

```javascript
{
	type: "TestActionType",
	payload: {}, /* Event Object passed into dispath() method */
}
```

To make it work, just add `ActionComponent` to the module.

For Action Creators, they should be imported with module to become available and used with `rx-channel` component.

```javascript
import  { NGRXBindingsModule, ActionsModule }  from  "@actualwave/ngrx-bindings";
import  {  setCurrentDate,  updateDate  }  from  "./store/date.actions";

@NgModule({
declarations:  [],
imports:  [
	NGRXBindingsModule,
	ActionsModule.forActions({ setCurrentDate, updateDate }),
providers:  [],
bootstrap:  [AppComponent]
})
export  class  AppModule {}
```

Within this module you can use `rx-channel` component, once instantiated it will generate methods `setCurrentDate` and `updateDate`, which could be called from template like this.

```html
<rx-channel #dates></rx-channel>
<input #newDate />
<button (click)="dates.setCurrentDate()">Set Current Date</button>
<button (click)="dates.updateDate(newDate.value)">Update Date</button>
```

Here on button click corresponding actions will be dispatched with its argument as payload.

When passing action to `action` pipe or `rx-action` component or registering with `ActionModule.`, they accept

1. `string` and use it as a type of the action, passed value will be used as payload
2. `object` assumed to be `Action` object is used with passed value as payload
3. `function` assumed to be an `ActionCreator` that accepts a payload value as only argument

When passing action to `dispatch` pipe or `rx-channel` component, they accept same value types, but treat `string`s in a different way -- instead of using it as a type to an action, they use it as a key to lookup for a registered action. However, you can register action using it's type string.

```javascript
import  { NGRXBindingsModule, ActionsModule }  from  "@actualwave/ngrx-bindings";

@NgModule({
imports:  [
	NGRXBindingsModule,
	ActionsModule.forActions({
		setCurrentDate: "Set Current Date",
		updateDate: "Update Date",
	}),
bootstrap:  [AppComponent]
})
export  class  AppModule {}
```

# Custom UI elements

NGRX Bindings library contains set of factory functions to generate custom UI elements for selectors and actions. These functions generate UI elements that should be declared within a module where you plan you use them.

For every case we have factory to generate single element or bulk creation of multiple elements. For example, `createSelectorDirective` creates single directive and `createSelectorDirectives` will create multiple directives in bulk and is simply a replacement to multiple calls of `createSelectorDirective`.

Declaration example using methods for bulk generation:

```javascript
import  {
	createActionPipes,
	createActionComponents,
	createChannelComponents,
	createSelectorDirectives,
	createSelectorOnceDirectives,
	createSelectorComponents,
	createSelectorOnceComponents,
}  from  "@actualwave/ngrx-bindings";

@NgModule({
declarations:  [
	createActionPipes({
		dispatchResetData: "Reset Data Action",
	}),
	createActionComponents({
		"my-action": "Set Data Action",
	}),
	createChannelComponents({
		"my-channel": {
			update: "Update Data Action",
			remove: "Remove Data Action",
		},
	}),
	createSelectorComponents({
		"my-date": dateSelectors.selectDate,
	}),
	createSelectorOnceComponents({
		"my-date-once":  dateSelectors.selectDate,
	}),
	createSelectorDirectives({
		myDate:  dateSelectors.selectDate,
	}),
	createSelectorOnceDirectives({
		myDateOnce:  dateSelectors.selectDate,
	}),
],
imports:  [],
providers:  [],
bootstrap:  [AppComponent]
})
export  class  AppModule {}
```

Within this module you will be able to use custom components `my-date` and `my-date-once`, directives `myDate` and `myDateOnce` to select data from the Store; and `my-action` with `my-channel` components to dispatch actions.

# API

TBA

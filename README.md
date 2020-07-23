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
	<rx-select-once value="feature.dates.updatedBy"></rx-select-once></div>
<div>
	Select using selector name:
	<rx-selector value="selectUpdatedBy"></rx-selector>
	<rx-selector-once value="selectUpdatedBy"></rx-selector-once>
</div>
```

To use selector component, directive or pipe, they should be aware of available NGRX Store selectors. To setup NGRX Store selectors, use `SelectorsModule`:
```javascript
import  { NGRXBindingsModule }  from  "@actualwave/ngrx-bindings";
import  *  as  dateSelectors  from "./store/date.selectors";

@NgModule({
declarations:  [],
imports:  [
	SelectorsModule.forSelectors(dateSelectors),
],
providers:  [],
bootstrap:  [AppComponent]
})
export  class  AppModule {}
```
All selectors imported with `SelectorsModule` can be referenced by UI in this module.

# Dispatch actions
Since it is not possible to use pipes with events, like this
```html
<button (click)="$event | dispatch">Click Me</button>
```
I've figured I can use components for dispatching actions and have all the interaction with the Store in template. To make this possible I've created two components -- rx-action and rx-channel. First allows dispatching single NGRX action and second dispatches multiple actions.
To make component work, add it to template, reference it with template variable and call its method.
```html
<div>
	<rx-action #myAction value="TestActionType"></rx-action>
	...
	<!-- anywhere in this template -->
	<button  (click)="myAction.dispatch($event)">Dispatch Action</button>
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

For Action Creators, they should be imported with to become available
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

# Custom UI elements
NGRX Bindings library contains set of factory functions to generate custom UI elements for selectors and actions. These functions generate UI elements that should be declared within a module:
```javascript
import  {
	createSelectorDirectives,
	createSelectorOnceDirectives,
	createSelectorComponents,
	createSelectorOnceComponents,
}  from  "@actualwave/ngrx-bindings";

@NgModule({
declarations:  [
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
Within this module you will able to use custom components `my-date` and `my-date-once`, and directives `myDate` and `myDateOnce`.

# API

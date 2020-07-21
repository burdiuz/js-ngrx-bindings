'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular/core');
var compiler = require('@angular/compiler');
var store = require('@ngrx/store');
var operators = require('rxjs/operators');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

const parser = new compiler.IvyParser(new compiler.Lexer());
const parsePropertyPath = (path) => {
    const { ast } = parser.parseBinding(path, null, 0);
    const pathFn = constructPathFrom(ast);
    return (store) => pathFn(store, store);
};
const basePathFn = (target) => target;
const createListFn = (list) => {
    const listFns = list.map((item) => constructPathFrom(item));
    return (context, base) => listFns.map((itemFn) => itemFn(context, base));
};
const constructPathFrom = (target, nextFn = basePathFn) => {
    switch (Object.getPrototypeOf(target).constructor) {
        case compiler.PropertyRead:
            return constructPathFromNamed(target, nextFn);
        case compiler.KeyedRead:
            return constructPathFromKeyed(target, nextFn);
        case compiler.MethodCall:
            return constructPathFromMethodCall(target, nextFn);
        case compiler.FunctionCall:
            return constructPathFromFunctionCall(target, nextFn);
        case compiler.LiteralPrimitive:
            const { value } = target;
            return () => value;
        case compiler.LiteralArray:
            const { expressions } = target;
            return createListFn(expressions);
        case compiler.ImplicitReceiver:
            return nextFn;
        default:
            console.error('Could not construct Path from AST:', target);
            throw new Error('Could not construct Path from AST');
    }
};
const constructPathFromNamed = (ast, nextFn = basePathFn) => {
    const { name, receiver } = ast;
    const fn = (context, base) => nextFn(context[name], base);
    if (receiver) {
        return constructPathFrom(receiver, fn);
    }
    return fn;
};
const constructPathFromKeyed = (target, nextFn = basePathFn) => {
    const { key, obj } = target;
    const objFn = constructPathFrom(obj);
    const keyFn = constructPathFrom(key);
    return (context, base) => nextFn(objFn(context, base)[keyFn(base, base)], base);
};
const constructPathFromMethodCall = (target, nextFn = basePathFn) => {
    const { receiver, name, args } = target;
    const contextFn = constructPathFrom(receiver);
    const argsFn = createListFn(args);
    return (context, base) => nextFn(contextFn(context, base)[name](...argsFn(base, base)), base);
};
const constructPathFromFunctionCall = (target, nextFn = basePathFn) => {
    const { target: func, args } = target;
    const nameFn = constructPathFrom(func);
    const argsFn = createListFn(args);
    return (context, base) => nextFn(nameFn(context, base)(...argsFn(base, base)), base);
};

class SubscriptionBase {
    constructor(store) {
        this.store = store;
    }
    ngOnDestroy() {
        this.unsubscribe();
    }
    getCurrentValue() {
        return this.currentValue;
    }
    setCurrentValue(value) {
        this.currentValue = value;
    }
    getObservable() {
        return this.store.pipe(store.select(this.getSelector()));
    }
    subscribe() {
        this.unsubscribe();
        this.subscription = this.getObservable().subscribe((value) => {
            if (this.getCurrentValue() === value) {
                return;
            }
            this.setCurrentValue(value);
        });
    }
    unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = null;
    }
}

exports.SelectPipe = class SelectPipe extends SubscriptionBase {
    constructor(store, changeDetector) {
        super(store);
        this.changeDetector = changeDetector;
    }
    transform(path) {
        if (path !== this.path) {
            this.unsubscribe();
            this.path = path;
            this.selector = parsePropertyPath(path);
            this.subscribe();
        }
        return this.getCurrentValue();
    }
    getSelector() {
        return this.selector;
    }
    setCurrentValue(value) {
        super.setCurrentValue(value);
        this.changeDetector.markForCheck();
    }
    subscribe() {
        if (!this.path) {
            return;
        }
        super.subscribe();
    }
};
exports.SelectPipe = __decorate([
    core.Pipe({
        name: 'select',
        pure: false,
    })
], exports.SelectPipe);

const getSelectorFrom = (value, storage) => {
    if (typeof value === 'function') {
        return value;
    }
    return storage[value];
};

const SELECTORS_MAP_PROVIDER = new core.InjectionToken('ngrx-selectors-provider');
let SelectorsMapModule = class SelectorsMapModule {
};
SelectorsMapModule = __decorate([
    core.NgModule({})
], SelectorsMapModule);
class SelectorsModule {
    static forSelectors(selectors) {
        return {
            ngModule: SelectorsMapModule,
            providers: [{ provide: SELECTORS_MAP_PROVIDER, useValue: selectors }],
        };
    }
}

exports.SelectorPipe = class SelectorPipe extends SubscriptionBase {
    constructor(store, selectors, changeDetector) {
        super(store);
        this.selectors = selectors;
        this.changeDetector = changeDetector;
    }
    transform(selectorKey, ...args) {
        if (selectorKey !== this.selectorKey) {
            this.unsubscribe();
            this.selectorKey = selectorKey;
            this.subscribe();
        }
        return this.getCurrentValue();
    }
    getSelector() {
        return this.selector;
    }
    setCurrentValue(value) {
        super.setCurrentValue(value);
        this.changeDetector.markForCheck();
    }
    subscribe() {
        if (!this.selectorKey) {
            return;
        }
        this.selector = getSelectorFrom(this.selectorKey, this.selectors);
        super.subscribe();
    }
};
exports.SelectorPipe = __decorate([
    core.Pipe({
        name: 'selector',
        pure: false,
    }),
    __param(1, core.Inject(SELECTORS_MAP_PROVIDER))
], exports.SelectorPipe);

class SelectNoInputDirective extends SubscriptionBase {
    constructor(store, element) {
        super(store);
        this.element = element;
    }
    getSelector() {
        return this.selectorFn;
    }
    getObservable() {
        return this.configureObservable(super.getObservable());
    }
    setCurrentValue(value) {
        super.setCurrentValue(value);
        this.applyValue();
    }
    applyValue() {
        const value = this.getCurrentValue();
        let target = this.element.nativeElement;
        if (this.targetElement) {
            target = target.querySelector(this.targetElement);
        }
        if (this.targetProp) {
            target[this.targetProp] = value;
        }
        if (this.targetAttr) {
            target.setAttribute(this.targetAttr, value);
        }
    }
    ngOnInit() {
        this.setSelector();
        this.subscribe();
    }
    ngOnChanges({ value }) {
        if (value.isFirstChange) {
            return;
        }
        if (value.previousValue !== value.currentValue) {
            this.setSelector();
            this.subscribe();
        }
        this.applyValue();
    }
}
class SelectBaseDirective extends SelectNoInputDirective {
    constructor() {
        super(...arguments);
        this.targetProp = 'innerText';
    }
}
__decorate([
    core.Input()
], SelectBaseDirective.prototype, "targetElement", void 0);
__decorate([
    core.Input()
], SelectBaseDirective.prototype, "targetProp", void 0);
__decorate([
    core.Input()
], SelectBaseDirective.prototype, "targetAttr", void 0);

exports.SelectDirective = class SelectDirective extends SelectBaseDirective {
    constructor(store, element) {
        super(store, element);
    }
    setSelector() {
        this.selectorFn = parsePropertyPath(this.value);
    }
    configureObservable(source) {
        return source;
    }
};
__decorate([
    core.Input('select')
], exports.SelectDirective.prototype, "value", void 0);
exports.SelectDirective = __decorate([
    core.Directive({
        selector: '[select]',
    })
], exports.SelectDirective);

exports.SelectOnceDirective = class SelectOnceDirective extends SelectBaseDirective {
    constructor(store, element) {
        super(store, element);
    }
    setSelector() {
        this.selectorFn = parsePropertyPath(this.value);
    }
    configureObservable(source) {
        return source.pipe(operators.take(1));
    }
};
__decorate([
    core.Input('selectOnce')
], exports.SelectOnceDirective.prototype, "value", void 0);
exports.SelectOnceDirective = __decorate([
    core.Directive({
        selector: '[selectOnce]',
    })
], exports.SelectOnceDirective);

exports.SelectorDirective = class SelectorDirective extends SelectBaseDirective {
    constructor(store, selectors, element) {
        super(store, element);
        this.selectors = selectors;
    }
    setSelector() {
        this.selectorFn = getSelectorFrom(this.value, this.selectors);
    }
    configureObservable(source) {
        return source;
    }
};
__decorate([
    core.Input('selector')
], exports.SelectorDirective.prototype, "value", void 0);
exports.SelectorDirective = __decorate([
    core.Directive({
        selector: '[selector]',
    }),
    __param(1, core.Inject(SELECTORS_MAP_PROVIDER))
], exports.SelectorDirective);
const createSelectorDirective = (directiveSelector, selectorFn, targetElement = '', targetProp = 'innerText', targetAttr = '') => {
    const Definition = core.Directive({
        selector: directiveSelector,
    })(class extends SelectNoInputDirective {
        // static ctorParameters = () => [{ type: Store }, { type: ElementRef }];
        constructor(store, el) {
            super(store, el);
            this.selectorFn = selectorFn;
            this.targetElement = targetElement;
            this.targetProp = targetProp;
            this.targetAttr = targetAttr;
        }
        setSelector() { }
        configureObservable(source) {
            return source;
        }
        ngOnChanges() { }
    });
    core.Inject(store.Store)(Definition, undefined, 0);
    core.Inject(core.ElementRef)(Definition, undefined, 1);
    return Definition;
};
const createSelectorDirectives = (selectors, targetElement = '', targetProp = 'innerText', targetAttr = '') => Object.keys(selectors).reduce((list, name) => {
    const selectorFn = selectors[name];
    if (typeof selectorFn !== 'function') {
        return list;
    }
    return [
        ...list,
        createSelectorDirective(`[${name}]`, selectorFn, targetElement, targetProp, targetAttr),
    ];
}, []);

exports.SelectorOnceDirective = class SelectorOnceDirective extends SelectBaseDirective {
    constructor(store, selectors, element) {
        super(store, element);
        this.selectors = selectors;
    }
    setSelector() {
        this.selectorFn = getSelectorFrom(this.value, this.selectors);
    }
    configureObservable(source) {
        return source.pipe(operators.take(1));
    }
};
__decorate([
    core.Input('selectorOnce')
], exports.SelectorOnceDirective.prototype, "value", void 0);
exports.SelectorOnceDirective = __decorate([
    core.Directive({
        selector: '[selectorOnce]',
    }),
    __param(1, core.Inject(SELECTORS_MAP_PROVIDER))
], exports.SelectorOnceDirective);
const createSelectorOnceDirective = (directiveSelector, selectorFn, targetElement = '', targetProp = 'innerText', targetAttr = '') => {
    const Definition = core.Directive({
        selector: directiveSelector,
    })(class extends SelectNoInputDirective {
        constructor(store, el) {
            super(store, el);
            this.selectorFn = selectorFn;
            this.targetElement = targetElement;
            this.targetProp = targetProp;
            this.targetAttr = targetAttr;
        }
        setSelector() { }
        configureObservable(source) {
            return source.pipe(operators.take(1));
        }
        ngOnChanges() { }
    });
    core.Inject(store.Store)(Definition, undefined, 0);
    core.Inject(core.ElementRef)(Definition, undefined, 1);
    return Definition;
};
const createSelectorOnceDirectives = (selectors, targetElement = '', targetProp = 'innerText', targetAttr = '') => Object.keys(selectors).reduce((list, name) => {
    const selectorFn = selectors[name];
    if (typeof selectorFn !== 'function') {
        return list;
    }
    return [
        ...list,
        createSelectorOnceDirective(`[${name}]`, selectorFn, targetElement, targetProp, targetAttr),
    ];
}, []);

class SelectBaseComponent extends SubscriptionBase {
    getSelector() {
        return this.selectorFn;
    }
    getObservable() {
        return this.configureObservable(super.getObservable());
    }
    setCurrentValue(value) {
        super.setCurrentValue(value);
        this.applyValue();
    }
    applyValue() {
        this.output = this.getCurrentValue();
    }
    ngOnInit() {
        this.setSelector();
        this.subscribe();
    }
    ngOnChanges({ value }) {
        if (value.isFirstChange) {
            return;
        }
        if (value.previousValue !== value.currentValue) {
            this.setSelector();
            this.subscribe();
        }
        this.applyValue();
    }
}

exports.SelectComponent = class SelectComponent extends SelectBaseComponent {
    constructor(store) {
        super(store);
    }
    setSelector() {
        this.selectorFn = parsePropertyPath(this.value);
    }
    configureObservable(source) {
        return source;
    }
};
__decorate([
    core.Input()
], exports.SelectComponent.prototype, "value", void 0);
exports.SelectComponent = __decorate([
    core.Component({
        selector: 'rx-select',
        template: '{{output}}',
    })
], exports.SelectComponent);

exports.SelectOnceComponent = class SelectOnceComponent extends SelectBaseComponent {
    constructor(store) {
        super(store);
    }
    setSelector() {
        this.selectorFn = parsePropertyPath(this.value);
    }
    configureObservable(source) {
        return source.pipe(operators.take(1));
    }
};
__decorate([
    core.Input()
], exports.SelectOnceComponent.prototype, "value", void 0);
exports.SelectOnceComponent = __decorate([
    core.Component({
        selector: 'rx-select-once',
        template: '{{output}}',
    })
], exports.SelectOnceComponent);

exports.SelectorComponent = class SelectorComponent extends SelectBaseComponent {
    constructor(store, selectors) {
        super(store);
        this.selectors = selectors;
    }
    setSelector() {
        this.selectorFn = getSelectorFrom(this.value, this.selectors);
    }
    configureObservable(source) {
        return source;
    }
};
__decorate([
    core.Input()
], exports.SelectorComponent.prototype, "value", void 0);
exports.SelectorComponent = __decorate([
    core.Component({
        selector: 'rx-selector',
        template: '{{output}}',
    }),
    __param(1, core.Inject(SELECTORS_MAP_PROVIDER))
], exports.SelectorComponent);
const createSelectorComponent = (componentSelector, selectorFn, template = '{{output}}') => {
    const Definition = core.Component({
        selector: componentSelector,
        template,
    })(class extends SelectBaseComponent {
        constructor(store) {
            super(store);
            this.selectorFn = selectorFn;
        }
        setSelector() { }
        configureObservable(source) {
            return source;
        }
        ngOnChanges() { }
    });
    core.Inject(store.Store)(Definition, undefined, 0);
    return Definition;
};
const createSelectorComponents = (selectors, template = '{{output}}') => Object.keys(selectors).reduce((list, name) => {
    const selectorFn = selectors[name];
    if (typeof selectorFn !== 'function') {
        return list;
    }
    return [...list, createSelectorComponent(name, selectorFn, template)];
}, []);

exports.SelectorOnceComponent = class SelectorOnceComponent extends SelectBaseComponent {
    constructor(store, selectors) {
        super(store);
        this.selectors = selectors;
    }
    setSelector() {
        this.selectorFn = getSelectorFrom(this.value, this.selectors);
    }
    configureObservable(source) {
        return source.pipe(operators.take(1));
    }
};
__decorate([
    core.Input()
], exports.SelectorOnceComponent.prototype, "value", void 0);
exports.SelectorOnceComponent = __decorate([
    core.Component({
        selector: 'rx-selector-once',
        template: '{{output}}',
    }),
    __param(1, core.Inject(SELECTORS_MAP_PROVIDER))
], exports.SelectorOnceComponent);
const createSelectorOnceComponent = (componentSelector, selectorFn, template = '{{output}}') => {
    const Definition = core.Component({
        selector: componentSelector,
        template,
    })(class extends SelectBaseComponent {
        constructor(store) {
            super(store);
            this.selectorFn = selectorFn;
        }
        setSelector() { }
        configureObservable(source) {
            return source.pipe(operators.take(1));
        }
        ngOnChanges() { }
    });
    core.Inject(store.Store)(Definition, undefined, 0);
    return Definition;
};
const createSelectorOnceComponents = (selectors, template = '{{output}}') => Object.keys(selectors).reduce((list, name) => {
    const selectorFn = selectors[name];
    if (typeof selectorFn !== 'function') {
        return list;
    }
    return [...list, createSelectorOnceComponent(name, selectorFn, template)];
}, []);

exports.SELECTORS_MAP_PROVIDER = SELECTORS_MAP_PROVIDER;
exports.SelectorsModule = SelectorsModule;
exports.createSelectorComponent = createSelectorComponent;
exports.createSelectorComponents = createSelectorComponents;
exports.createSelectorDirective = createSelectorDirective;
exports.createSelectorDirectives = createSelectorDirectives;
exports.createSelectorOnceComponent = createSelectorOnceComponent;
exports.createSelectorOnceComponents = createSelectorOnceComponents;
exports.createSelectorOnceDirective = createSelectorOnceDirective;
exports.createSelectorOnceDirectives = createSelectorOnceDirectives;
//# sourceMappingURL=index.js.map

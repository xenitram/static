//A Unified Helper Factory

const signal = (function() {


    class FormValidator {
        constructor(fields, submitButtonSelector) {
            this.fields = fields; // Object containing all form observables
            this.submitButton = document.querySelector(submitButtonSelector);
            this.validationState = {};

            Object.keys(fields).forEach(key => {
                this.validationState[key] = false; // Default: all fields are invalid
                fields[key].register(() => this.checkValidity());
                fields[key].onInvalid(() => this.markInvalid(key));
            });

            this.checkValidity();
        }

        markInvalid(fieldName) {
            this.validationState[fieldName] = false;
            this.checkValidity();
        }

        checkValidity() {
            let allValid = Object.values(this.validationState).every(valid => valid);
            if (this.submitButton) {
                this.submitButton.disabled = !allValid;
            }
        }
    }

    function applyAnimation(element, animationOptions) {
        if (!animationOptions || typeof animationOptions !== "object") return;

        const {
            type,
            duration = 300,
            easing = "ease-in-out",
            keyframes
        } = animationOptions;

        if (type === "fade") {
            element.style.transition = `opacity ${duration}ms ${easing}`;
            element.style.opacity = "0";
            setTimeout(() => (element.style.opacity = "1"), 10);
        }

        if (type === "scale") {
            element.style.transition = `transform ${duration}ms ${easing}`;
            element.style.transform = "scale(0.5)";
            setTimeout(() => (element.style.transform = "scale(1)"), 10);
        }

        if (keyframes) {
            element.animate(keyframes, {
                duration,
                easing
            });
        }
    }

function oneWay(observable, target, options = {}) {
    let elements = [];
    let observer = null;

    const updateElements = () => {
        const value = observable.get();
        elements.forEach(elem => {
            if (options.type) elem[options.type] = value;
            if (options.attribute) elem.setAttribute(options.attribute, value);
            if (options.className) {
                value ? elem.classList.add(options.className) : elem.classList.remove(options.className);
            }
            if (options.style) elem.style[options.style] = value;
            if (options.animation) applyAnimation(elem, options.animation);
        });
    };

    const refreshElements = () => {
        if (typeof target === "string") {
            elements = Array.from(document.querySelectorAll(target));
        }
        updateElements();
    };

    if (typeof target === "string") {
        refreshElements();

        observer = new MutationObserver(() => {
            refreshElements();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    } else if (target instanceof Element) {
        elements = [target];
        updateElements();
    } else if (Array.isArray(target) || target instanceof NodeList) {
        elements = Array.from(target);
        updateElements();
    } else {
        throw new Error("Invalid target for oneWay");
    }

    observable.register(updateElements);

    return () => {
        observable.unregister(updateElements);
        if (observer) observer.disconnect();
    };
}

function otherWay(observable, target, options = {}, parent = document) {
    if (!options.event) return () => ({});

    const elements = typeof target === "string"
        ? () => parent.querySelectorAll(target)
        : () => (Array.isArray(target) || target instanceof NodeList ? target : [target]);

    function handleUserInput(event) {
        const allElements = elements();
        let targetElem = event.target;

        while (targetElem && ![...allElements].includes(targetElem)) {
            targetElem = targetElem.parentElement;
        }

        if (!targetElem || !options.type) return;

        let newValue = targetElem[options.type];
        if (typeof observable.get() === "number") {
            newValue = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
        }

        observable.set(newValue, targetElem);
    }

    parent.addEventListener(options.event, handleUserInput);
    return () => parent.removeEventListener(options.event, handleUserInput);
}


function twoWay(observable, target, options = {}, parent = document) {
    const unregisterOneWay = oneWay(target, observable, options);
    const unregisterOtherWay = otherWay(target, observable, options, parent);

    return () => {
        unregisterOneWay();
        unregisterOtherWay();
    };
}
    class Observer {
        constructor() {
            this.listeners = [];
            this.debug = false;
        }

        register(listener) {
            if (!this.listeners.includes(listener)) {
                this.listeners.push(listener);
            }
        }

        unregister(fn) {
            this.listeners = this.listeners.filter(item => item !== fn);
        }

        notify(origin, ...params) {
            if (this.debug) {
                console.log(`[DEBUG] Notify called by:`, origin, `with value:`, params[0]);
            }
            this.listeners.forEach(listener => listener?.(origin, ...params));
        }

        enableDebug() {
            this.debug = true;
            return this;
        }

        disableDebug() {
            this.debug = false;
            return this;
        }
    }

    class Observable extends Observer {
        constructor(initialValue, validator = null) {
            super();
            this.value = initialValue;
            this.unbindFns = [];
            this.validator = validator; // Store the validation function
            this.invalidListeners = []; // Store validation failure listeners

        }


        set(newValue, origin = null) {
            if (this.validator && !this.validator(newValue)) {
                this.notifyInvalid(origin, newValue); // Trigger validation event
                if (this.debug) {
                    console.log(`[DEBUG] Invalid called by:`, origin, `with value:`, newValue);
                }
                return;
            }

            if (newValue !== this.value) {
                this.value = newValue;
                this.notify(origin, newValue);
            }
        }
        get() {
            if (Computed.activeComputed) {
                Computed.activeComputed.addDependency(this); // Track dependency dynamically
            }
            return this.value;
        }

        bind(selector, options, parent ) {
            const unbind = twoWay(this, selector, options, parent);
            this.unbindFns.push(unbind); // Store unbind function
            return this;
        }

        unbind() {
            this.unbindFns.forEach(unbind => unbind()); // Remove all listeners
            this.unbindFns = []; // Reset list
        }

        // Register event listeners for invalid values
        onInvalid(listener) {
            if (!this.invalidListeners.includes(listener)) {
                this.invalidListeners.push(listener);
            }
        }

        notifyInvalid(origin, invalidValue) {
            this.invalidListeners.forEach(listener => listener(origin, invalidValue));
        }

        unregisterAllListeners() {
            this.listeners = [];
            this.invalidListeners = [];
            clearTimeout(this.debounceTimer);
        }

    }

    class DebounceObservable extends Observable {
        constructor(initialValue, validator = null, debounceTime = 0, leading = false) {
            super(initialValue, validator);
            this.debounceTime = debounceTime;
            this.debounceTimer = null;
            this.leading = leading;
            this.lastInvocationTime = 0;
        }

        set(newValue, origin = null) {
            clearTimeout(this.debounceTimer);
            const now = Date.now();

            if (this.leading && now - this.lastInvocationTime > this.debounceTime) {
                super.set(newValue, origin);
                this.lastInvocationTime = now;
            } else if (this.debounceTime > 0) {
                this.debounceTimer = setTimeout(() => {
                    super.set(newValue, origin);
                    this.lastInvocationTime = Date.now();
                }, this.debounceTime);
            } else {
                super.set(newValue, origin);
            }
        }

    }

    class AsyncObservable extends DebounceObservable {
        constructor(initialValue, asyncValidator = null, debounceTime = 0, leading = false) {
            super(initialValue, null, debounceTime, leading);
            this.asyncValidator = asyncValidator;
        }

        async set(newValue, origin = null) {
            clearTimeout(this.debounceTimer);
            const validateAndSet = async () => {
                if (this.asyncValidator) {
                    const isValid = await this.asyncValidator(newValue);
                    if (!isValid) {
                        this.notifyInvalid(origin, newValue);
                        return;
                    }
                }
                super.set(newValue, origin);
            };

            if (this.debounceTime > 0) {
                this.debounceTimer = setTimeout(validateAndSet, this.debounceTime);
            } else {
                await validateAndSet();
            }
        }
    }

    class Computed extends Observable {
        constructor(calculation, dependencies) {
            super(calculation());
            this.calculation = calculation;
            this.unbindFns = [];

            const update = () => {
                const newValue = calculation();
                if (!Object.is(newValue, this.value)) {
                    this.value = newValue;
                    this.notify(null, newValue);
                }
            };
            dependencies.forEach(dep => {
                const unbind = () => dep.unregister(update);
                dep.register(update);
                this.unbindFns.push(unbind);
            });
        }

        set() {
            throw new Error("Cannot manually set a computed value.");
        }

        bind(selector, options) {
            const unbind = oneWay(this, selector, options);
            this.unbindFns.push(unbind);
            return this;
        }

        unbind() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }

        dispose() {
            this.unbind();
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }
    }

    class ComputedAuto extends Observable {

        static activeComputed = null; // Tracks the currently evaluating Computed instance	

        constructor(calculation) {
            super();
            this.dependencies = new Set();
            this.unbindFns = [];
            Computed.activeComputed = this;
            this.value = calculation();
            Computed.activeComputed = null;
            this.calculation = calculation;


            this.update = () => {
                const newValue = calculation();
                if (!Object.is(newValue, this.value)) {
                    this.value = newValue;
                    this.notify(null, newValue);
                }
            };

            /*this.dependencies.forEach(dep => {
                const unbind = () => dep.unregister(update);
                dep.register(this.update);
                this.unbindFns.push(unbind);
            });*/
        }
        addDependency(observable) {
            if (!this.dependencies.has(observable)) {
                this.dependencies.add(observable);
                const unbind = () => observable.unregister(this.update);
                observable.register(this.update);
                this.unbindFns.push(unbind);
            }
        }
        set() {
            throw new Error("Cannot manually set a computed value.");
        }

        bind(selector, options) {
            const unbind = oneWay(this, selector, options);
            this.unbindFns.push(unbind);
            return this;
        }

        unbind() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }

        dispose() {
            this.unbind();
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }
    }
    class ComputedAutoLazy extends Observable {
        static activeComputed = null; // Tracks the currently evaluating Computed instance	

        constructor(calculation) {
            super();
            this.dependencies = new Set();
            this.unbindFns = [];
            this.calculation = calculation;
            this.dirty = true; // Marks if the value needs recomputation
            this.cachedValue = undefined; // Stores the last computed value

            this.update = () => {
                this.dirty = true; // Mark as needing recalculation
                this.notify(null, this.get()); // Notify subscribers
            };
        }

        get() {
            if (Computed.activeComputed) {
                Computed.activeComputed.addDependency(this);
            }
            if (this.dirty) {
                this.recompute();
            }
            return this.cachedValue;
        }

        recompute() {
            Computed.activeComputed = this; // Start tracking dependencies
            const newValue = this.calculation();
            Computed.activeComputed = null; // Stop tracking

            if (!Object.is(newValue, this.cachedValue)) {
                this.cachedValue = newValue;
                this.notify(null, newValue);
            }
            this.dirty = false; // Mark as up-to-date
        }

        addDependency(observable) {
            if (!this.dependencies.has(observable)) {
                this.dependencies.add(observable);
                observable.register(this.update);
                this.unbindFns.push(() => observable.unregister(this.update));
            }
        }

        set() {
            throw new Error("Cannot manually set a computed value.");
        }
	    
        bind(selector, options) {
            const unbind = oneWay(this, selector, options);
            this.unbindFns.push(unbind);
            return this;
        }
	    
        unbind() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }

        dispose() {
            this.unbind();
        }
    }

    class ComputedAutoLazyDirect extends Observable {
        static activeComputed = null; // Tracks the currently evaluating Computed instance	

        constructor(calculation) {
            super();
            this.dependencies = new Set();
            this.unbindFns = [];
            this.calculation = calculation;
            this.dirty = true; // Marks if the value needs recomputation
            this.cachedValue = undefined; // Stores the last computed value

            this.update = () => {
                this.dirty = true; // Mark as needing recalculation
                this.notify(null, this.get()); // Notify subscribers
            };
        }

        get() {
            if (Computed.activeComputed) {
                Computed.activeComputed.addDependency(this);
            }
            if (this.dirty) {
                this.recompute();
            }
            return this.cachedValue;
        }

        recompute() {
            Computed.activeComputed = this; // Start tracking dependencies
            const newValue = this.calculation();
            Computed.activeComputed = null; // Stop tracking

            if (!Object.is(newValue, this.cachedValue)) {
                this.cachedValue = newValue;
                this.notify(null, newValue);
            }
            this.dirty = false; // Mark as up-to-date
        }

        addDependency(observable) {
            if (!this.dependencies.has(observable)) {
                this.dependencies.add(observable);
                observable.register(this.update);
                this.unbindFns.push(() => observable.unregister(this.update));

                if (observable instanceof AsyncObservable) {
                    this.recompute(); // Force immediate evaluation for async
                }
            }
        }

        set() {
            throw new Error("Cannot manually set a computed value.");
        }

        bind(selector, options) {
            const unbind = oneWay(this, selector, options);
            this.unbindFns.push(unbind);
            return this;
        }
	    
        unbind() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }

        dispose() {
            this.unbind();
        }
    }


    class ComputedAutoLazyTrigger extends Observable {
        static activeComputed = null; // Tracks the currently evaluating Computed instance	

        constructor(calculation) {
            super();
            this.dependencies = new Set();
            this.unbindFns = [];
            this.calculation = calculation;
            this.dirty = true; // Marks if the value needs recomputation
            this.cachedValue = undefined; // Stores the last computed value

            this.update = async () => {
                this.dirty = true;
                if (this.dependencies.some(dep => dep instanceof AsyncObservable)) {
                    this.get(); // Auto-trigger for async sources
                }
                this.notify(null, this.cachedValue);
            };
        }

        get() {
            if (Computed.activeComputed) {
                Computed.activeComputed.addDependency(this);
            }
            if (this.dirty) {
                this.recompute();
            }
            return this.cachedValue;
        }

        recompute() {
            Computed.activeComputed = this; // Start tracking dependencies
            const newValue = this.calculation();
            Computed.activeComputed = null; // Stop tracking

            if (!Object.is(newValue, this.cachedValue)) {
                this.cachedValue = newValue;
                this.notify(null, newValue);
            }
            this.dirty = false; // Mark as up-to-date
        }

        addDependency(observable) {
            if (!this.dependencies.has(observable)) {
                this.dependencies.add(observable);
                observable.register(this.update);
                this.unbindFns.push(() => observable.unregister(this.update));
            }
        }

        set() {
            throw new Error("Cannot manually set a computed value.");
        }
	    
        bind(selector, options) {
            const unbind = oneWay(this, selector, options);
            this.unbindFns.push(unbind);
            return this;
        }
	    
        unbind() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }

        dispose() {
            this.unbind();
        }
    }


    class ComputedAutoLazyEager extends Observable {
        static activeComputed = null; // Tracks the currently evaluating Computed instance	

        constructor(calculation) {
            super();
            this.dependencies = new Set();
            this.unbindFns = [];
            this.calculation = calculation;
            this.value = undefined; // Store last value

            this.update = async () => {
                const newValue = await calculation();
                if (!Object.is(newValue, this.value)) {
                    this.value = newValue;
                    this.notify(null, newValue);
                }
            };

            this.recompute(); // Always evaluate eagerly
        }

        get() {
            if (Computed.activeComputed) {
                Computed.activeComputed.addDependency(this);
            }
            if (this.dirty) {
                this.recompute();
            }
            return this.cachedValue;
        }

        recompute() {
            Computed.activeComputed = this; // Start tracking dependencies
            const newValue = this.calculation();
            Computed.activeComputed = null; // Stop tracking

            if (!Object.is(newValue, this.cachedValue)) {
                this.cachedValue = newValue;
                this.notify(null, newValue);
            }
            this.dirty = false; // Mark as up-to-date
        }

        addDependency(observable) {
            if (!this.dependencies.has(observable)) {
                this.dependencies.add(observable);
                observable.register(this.update);
                this.unbindFns.push(() => observable.unregister(this.update));

                if (observable instanceof AsyncObservable) {
                    this.recompute(); // Force immediate evaluation for async
                }
            }
        }

        set() {
            throw new Error("Cannot manually set a computed value.");
        }

        bind(selector, options) {
            const unbind = oneWay(this, selector, options);
            this.unbindFns.push(unbind);
            return this;
        }
	    
        unbind() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }

        dispose() {
            this.unbind();
        }
    }

    class ComputedHybrid extends Observable {
        static activeComputed = null; // Track the currently evaluating Computed instance

        constructor(calculation, options = {}) {
            super();
            this.dependencies = new Set();
            this.unbindFns = [];
            this.calculation = calculation;
            this.cachedValue = undefined;
            this.isStale = true; // Lazy evaluation: mark stale until needed
            this.isAsync = false; // Flag for async handling

            Computed.activeComputed = this;
            try {
                let result = calculation();
                if (result instanceof Promise) {
                    this.isAsync = true;
                    result.then(value => {
                        this.cachedValue = value;
                        this.isStale = false;
                        this.notify(null, value);
                    });
                } else {
                    this.cachedValue = result;
                    this.isStale = false;
                }
            } catch (error) {
                console.error("Computed evaluation failed:", error);
            }
            Computed.activeComputed = null;

            this.update = () => {
                try {
                    let result = this.calculation();
                    if (result instanceof Promise) {
                        this.isAsync = true;
                        result.then(value => {
                            if (!Object.is(value, this.cachedValue)) {
                                this.cachedValue = value;
                                this.notify(null, value);
                            }
                        });
                    } else if (!Object.is(result, this.cachedValue)) {
                        this.cachedValue = result;
                        this.notify(null, result);
                    }
                } catch (error) {
                    console.error("Computed update failed:", error);
                }
            };
        }

        get() {
            if (this.isStale) {
                this.update(); // Lazy evaluation
            }
            return this.cachedValue;
        }

        addDependency(observable) {
            if (!this.dependencies.has(observable)) {
                this.dependencies.add(observable);
                observable.register(this.update);
                this.unbindFns.push(() => observable.unregister(this.update));
            }
        }

        set() {
            throw new Error("Cannot manually set a computed value.");
        }

        bind(selector, options) {
            const unbind = oneWay(this, selector, options);
            this.unbindFns.push(unbind);
            return this;
        }
	    
        unbind() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }

        dispose() {
            this.unbind();
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
        }
    }
    class ComputedVueLike extends Observable {
        static activeComputed = null;

        constructor(calculation) {
            super();
            this.dependencies = new Set();
            this.unbindFns = [];
            this.calculation = calculation;
            this.cachedValue = undefined;
            this.isDirty = true; // Marks if recomputation is needed

            // Lazy evaluation setup
            this.update = () => {
                this.isDirty = true; // Mark for recomputation
                this.notify(null, this.cachedValue);
            };
        }

        get() {
            if (this.isDirty) {
                Computed.activeComputed = this;
                const newValue = this.calculation();
                Computed.activeComputed = null;

                if (!Object.is(newValue, this.cachedValue)) {
                    this.cachedValue = newValue;
                    this.notify(null, newValue);
                }

                this.isDirty = false; // Mark as up-to-date
            }

            return this.cachedValue;
        }

        addDependency(observable) {
            if (!this.dependencies.has(observable)) {
                this.dependencies.add(observable);
                observable.register(this.update);
                this.unbindFns.push(() => observable.unregister(this.update));
            }
        }

        set() {
            throw new Error("Cannot manually set a computed value.");
        }

        dispose() {
            this.unbindFns.forEach(unbind => unbind());
            this.unbindFns = [];
            this.dependencies.clear();
        }
    }

    /*
        function watchEffect(effectFunction) {
            const runner = {
                effect: effectFunction,
                dependencies: new Set(),
                update: () => {
                    runner.dependencies.forEach(dep => dep.unregister(runner));
                    runner.dependencies.clear();
                    activeWatcher = runner;
                    effectFunction();
                    activeWatcher = null;
                },
                _debugDeps: () => {
                    console.log(`[DEBUG] watchEffect is tracking:`, [...runner.dependencies]);
                }
            };
            runner.update();
            //return runner._debugDeps;
            return () => runner._debugDeps();
        }
    */
    function watch(source, callback) {
        let oldValue = source.get();
        const watcher = {
            update: () => {
                const newValue = source.get();
                if (newValue !== oldValue) {
                    callback(newValue, oldValue);
                    oldValue = newValue;
                }
            }
        };
        source.register(watcher.update);
        return () => source.unregister(watcher.update);
    }
    /*
        function ref(initialValue) {
            const r = {
                _value: initialValue,
                _dep: new Set(),
                get value() {
                    if (activeWatcher) {
                        r._dep.add(activeWatcher);
                        activeWatcher.dependencies.add(() => r._dep.delete(activeWatcher));
                    }
                    return r._value;
                },
                set value(newValue) {
                    if (r._value !== newValue) {
                        r._value = newValue;
                        const oldDeps = [...r._dep];
                        r._dep.clear(); // Clear old dependencies before notifying watchers
                        oldDeps.forEach(watcher => watcher.update());
                    }
                }
            };
            return r;
        }

        function toRefs(reactiveObj) {
            const refs = {};
            for (const key in reactiveObj) {
                refs[key] = {
                    get value() {
                        return reactiveObj[key];
                    },
                    set value(newValue) {
                        reactiveObj[key] = newValue;
                    }
                };
            }
            return refs;
        }
    */
    function eagerReactive(target) {
        if (typeof target !== "object" || target === null) {
            throw new Error("reactive() can only be used on objects");
        }

        return new Proxy(target, {
            get(obj, key, receiver) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    obj[key] = reactive(obj[key]);
                }
                if (activeWatcher) {
                    if (!obj._deps) obj._deps = {};
                    if (!obj._deps[key]) obj._deps[key] = new Set();
                    obj._deps[key].add(activeWatcher);
                    activeWatcher._dependencies.add(() => obj._deps[key].delete(activeWatcher));
                }
                return Reflect.get(obj, key, receiver);
            },
            set(obj, key, value, receiver) {
                const oldValue = obj[key];
                const result = Reflect.set(obj, key, value, receiver);
                if (oldValue !== value && obj._deps && obj._deps[key]) {
                    obj._deps[key].forEach(watcher => watcher.update());
                }
                return result;
            }
        });
    }

    function lazyReactive(target) {
        if (typeof target !== "object" || target === null) {
            throw new Error("reactive() can only be used on objects");
        }

        return new Proxy(target, {
            get(obj, key, receiver) {
                const value = Reflect.get(obj, key, receiver);
                if (typeof value === "object" && value !== null && !value.__isReactive) {
                    obj[key] = reactive(value); // Lazily convert nested objects only when accessed
                }
                if (activeWatcher) {
                    if (!obj._deps) obj._deps = {};
                    if (!obj._deps[key]) obj._deps[key] = new Set();
                    obj._deps[key].add(activeWatcher);
                    activeWatcher.dependencies.add(() => obj._deps[key].delete(activeWatcher));
                }
                return obj[key];
            },
            set(obj, key, value, receiver) {
                const oldValue = obj[key];
                const result = Reflect.set(obj, key, value, receiver);
                if (oldValue !== value && obj._deps && obj._deps[key]) {
                    obj._deps[key].forEach(watcher => watcher.update());
                }
                return result;
            }
        });
    }
    /*    function createObservable(ClassType, ...constructorArgs) {
            const obs = new ClassType(...constructorArgs);

            function accessor(newValue) {
                if (arguments.length) {
                    obs.set(newValue);
                }
                return obs.get();
            }

            Object.setPrototypeOf(accessor, obs);

            return new Proxy(accessor, {
                get(target, prop) {
                    return prop in obs ? obs[prop] : undefined;
                },
                apply(target, thisArg, args) {
                    return target(...args);
                }
            });
        }*/

    function createObservable(ClassType, ...constructorArgs) {
        const obs = new ClassType(...constructorArgs);

        function accessor(newValue) {
            if (arguments.length) {
                return obs.set.call(obs, newValue); // Ensure `this` refers to `Observable`
            }
            return obs.get.call(obs); // Ensure `this` refers to `Observable`
        }

        Object.setPrototypeOf(accessor, obs);

        return new Proxy(accessor, {
            get(target, prop) {
                const value = obs[prop];
                // Ensure methods correctly bind `this` to `obs`
                return typeof value === "function" ? value.bind(obs) : value;
            },
            apply(target, thisArg, args) {
                return target(...args);
            }
        });
    }


    const observable = (initialValue, validator = null) => createObservable(Observable, initialValue, validator);

    const debounceObservable = (initialValue, validator = null, debounceTime = 300, leading = false) =>
        createObservable(DebounceObservable, initialValue, validator, debounceTime, leading);

    const asyncObservable = (initialValue, asyncValidator = null, debounceTime = 300, leading = false) =>
        createObservable(AsyncObservable, initialValue, asyncValidator, debounceTime, leading);

    const computed = (calculation, dependencies) => createObservable(Computed, calculation, dependencies);

    return {
        Observable,
        DebounceObservable,
        AsyncObservable,
        Computed,
        ComputedAuto,
		ComputedAutoLazy,
		ComputedAutoLazyDirect,
		ComputedAutoLazyEager,
		ComputedAutoLazyTrigger,
		ComputedHybrid,
		ComputedVueLike,
        observable,
        debounceObservable,
        asyncObservable,
        computed,
        FormValidator,
        //watchEffect,
        watch,
        //ref,
        //toRefs,
        eagerReactive,
        lazyReactive
    };
})();

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

    function oneWay(selector, observable, options = {}) {
        function updateElements() {
            document.querySelectorAll(selector).forEach(elem => {
                if (options.type) elem[options.type] = observable.get();
                if (options.attribute) elem.setAttribute(options.attribute, observable.get());
                if (options.className) {
                    observable.get() ? elem.classList.add(options.className) : elem.classList.remove(options.className);
                }
                if (options.style) elem.style[options.style] = observable.get();
                if (options.animation) {
                    applyAnimation(elem, options.animation);
                }
            });
        }

        updateElements();
        const updateHandler = updateElements;
        observable.register(updateHandler);
        return () => observable.unregister(updateHandler);
    }


    function twoWay(parent, selector, observable, options = {}) {
        let unregisterOneWay = oneWay(selector, observable, options);

        let handleUserInput = function(event) {
            let target = event.target.closest(selector);
            if (!target) return;
            let newValue = target[options.type];

            if (typeof observable.get() === "number") {
                newValue = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
            }
            observable.set(newValue, target);
        };

        parent.addEventListener(options.event, handleUserInput);

        return () => {
            unregisterOneWay();
            parent.removeEventListener(options.event, handleUserInput)
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

        bind(parent, selector, options) {
            const unbind = twoWay(parent, selector, this, options);
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
            const unbind = oneWay(selector, this, options);
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
            const unbind = oneWay(selector, this, options);
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

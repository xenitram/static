const dom = function() {

    const byId = (lbl) => {
        if (!lbl || typeof lbl !== 'string') {
            throw new Error("Invalid argument: `lbl` must be a non-empty string");
        }
        return document.getElementById(lbl);
    };

    const byName = (lbl) => {
        if (!lbl || typeof lbl !== 'string') {
            throw new Error("Invalid argument: `lbl` must be a non-empty string");
        }
        return document.getElementsByName(lbl);
    };

    const byClass = (el = document, lbl) =>
        lbl !== undefined ?
        el.getElementsByClassName(lbl) :
        (lbl) => el.getElementsByClassName(lbl);

    const byTag = (el = document, lbl) =>
        lbl !== undefined ?
        el.getElementsByTagName(lbl) :
        (lbl) => el.getElementsByTagName(lbl);

    const byTagNS = (el = document, lbl) =>
        lbl !== undefined ?
        el.getElementsByTagNameNS(lbl) :
        (lbl) => el.getElementsByTagNameNS(lbl);



    const $ = (el = document, lbl) =>
        typeof el === 'string' ?
        document.querySelector(el) // Called with just a selector: $$('.class')
        :
        lbl !== undefined ?
        el.querySelector(lbl) // Called with a context and a selector: $$(container, '.class')
        :
        (selector) => el.querySelector(selector); // Called with just a context: $$(container)


    const $$ = (el = document, lbl) =>
        typeof el === 'string' ?
        document.querySelectorAll(el) // Called with just a selector: $$('.class')
        :
        lbl !== undefined ?
        el.querySelectorAll(lbl) // Called with a context and a selector: $$(container, '.class')
        :
        (selector) => el.querySelectorAll(selector); // Called with just a context: $$(container)



    const prepend = first = (target = document.body, ...elements) => {
        const prependTo = (el, els) => {
            el.prepend(...els.flat(Infinity));
            return els;
        };

        if (elements.length) {
            return prependTo(target, elements);
        } else if (Array.isArray(target)) {
            return prependTo(document.body, target);
        } else {
            return (...elems) => prependTo(target, elems);
        }
    };

    const append = last = (target = document.body, ...elements) => {
        const appendTo = (el, els) => {
            el.append(...els.flat(Infinity));
            return els;
        };

        if (elements.length) {
            return appendTo(target, elements);
        } else if (Array.isArray(target)) {
            return appendTo(document.body, target);
        } else {
            return (...elems) => appendTo(target, elems);
        }
    };

    const before = precede = (target = document.body, ...elements) => {
        const insertBefore = (el, els) => {
            el.before(...els.flat(Infinity));
            return el;
        };

        if (elements.length) {
            return insertBefore(target, elements);
        } else if (Array.isArray(target)) {
            return insertBefore(document.body, target);
        } else {
            return (...elems) => insertBefore(target, elems);
        }
    };

    const after = succede = (target = document.body, ...elements) => {
        const insertAfter = (el, els) => {
            el.after(...els.flat(Infinity));
            return el;
        };

        if (elements.length) {
            return insertAfter(target, elements);
        } else if (Array.isArray(target)) {
            return insertAfter(document.body, target);
        } else {
            return (...elems) => insertAfter(target, elems);
        }
    };


    const detach = (target = document.body) => target.remove();

    const replaceWith = (el = document.body, elem) => {
        const doReplace = (replacement) => {
            const newElem = typeof replacement === 'string' ?
                document.createRange().createContextualFragment(replacement) :
                replacement;

            el.replaceWith(newElem);
            return el; // Return the replaced element for chaining
        };

        return elem ? doReplace(elem) : doReplace;
    };


    const replaceChildren = (target = document.body, ...elements) => {
        const replace = (el, elems) => {
            el.replaceChildren(...elems.flat(Infinity));
            return elems;
        };

        if (elements.length) {
            return replace(target, elements);
        } else {
            return (elems) => replace(target, elems);
        }
    };

    function html(sel, ...args) {
        // Split the selector string by '.' or '#' into element, id, and classes
        const chunks = sel.split(/([.#@])/);

        // Create the element from the first chunk (tag name)
        const element = document.createElement(chunks[0]);

        // Iterate through the chunks to handle id and classes
        let currentAttr = '';
        for (let i = 1; i < chunks.length; i += 2) {
            if (chunks[i] === '@') {
                // Next chunk is an ID
                element.name = chunks[i + 1];
            } else if (chunks[i] === '#') {
                // Next chunk is an ID
                element.id = chunks[i + 1];
            } else if (chunks[i] === '.') {
                // Next chunk is a class, we accumulate class names in the element.classList
                element.classList.add(chunks[i + 1]);
            }
        }

        // Set other attributes from the attrs argument
        function setAttribute(attrs) {
            for (let val in attrs) {
                if (val in element) {
                    // If it's a known property, set it directly
                    element[val] = attrs[val];
                } else {
                    // Otherwise, use setAttribute to set it as an attribute
                    element.setAttribute(val, attrs[val]);
                }
            }
        }

        args.forEach(arg => {
            // Append the content (arg) to the element
            if (arg instanceof Node) {
                element.append(arg);
            } else if (Array.isArray(arg)) {
                element.append(...arg);
            } else if (typeof arg === "string" || typeof arg === "number") {
                element.append(document.createTextNode(arg));
            } else if (typeof arg === "object") {
                setAttribute(arg);
            }
        });
        // Return the element with the set attributes, ID, and classes
        return element;
    }

    function svg(sel, ...args) {
        // SVG namespace URI
        const svgNS = "http://www.w3.org/2000/svg";

        // Split the selector string by '.' or '#' into element, id, and classes
        const chunks = sel.split(/([.#@])/);

        // Create the element from the first chunk (tag name) within the SVG namespace
        const element = document.createElementNS(svgNS, chunks[0]);

        // Iterate through the chunks to handle id, classes, and name
        for (let i = 1; i < chunks.length; i += 2) {
            if (chunks[i] === '@') {
                // Next chunk is a name
                element.name = chunks[i + 1];
            } else if (chunks[i] === '#') {
                // Next chunk is an ID
                element.id = chunks[i + 1];
            } else if (chunks[i] === '.') {
                // Next chunk is a class, accumulate class names in the element.classList
                element.classList.add(chunks[i + 1]);
            }
        }

        // Set other attributes from the args argument
        function setAttribute(attrs) {
            for (let key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    // Use `setAttributeNS` for SVG-specific attributes (like `xlink:href`)
                    if (key === 'xlink:href') {
                        element.setAttributeNS("http://www.w3.org/1999/xlink", key, attrs[key]);
                    } else {
                        element.setAttribute(key, attrs[key]);
                    }
                }
            }
        }


        // Iterate through args to append content or set attributes
        args.forEach(arg => {
            if (arg instanceof Node) {
                // Append an element node
                element.append(arg);
            } else if (Array.isArray(arg)) {
                // Append multiple nodes from an array
                element.append(...arg);
            } else if (typeof arg === "string" || typeof arg === "number") {
                // Append a text node (though less common for SVG elements)
                element.append(document.createTextNode(arg));
            } else if (typeof arg === "object") {
                // Handle object as attributes
                setAttribute(arg);
            }
        });

        // Return the element with the set attributes, ID, and classes
        return element;
    };

	function text(str) {
	  return document.createTextNode(str != null ? str : "");
	};
    const event = {
        on: (el, ...args) => {
            if (!(el instanceof EventTarget)) throw new TypeError("Provided element is not an EventTarget");

            const fn = (...a) => {
                if (typeof a[0] === 'string') {
                    el.addEventListener(...a);
                } else if (a[0] && typeof a[0] === 'object') {
                    Object.entries(a[0]).forEach(([k, v]) => el.addEventListener(k, v));
                }
                return el;
            };
            return args.length ? fn(...args) : fn;
        },
        off: (el, ...args) => {
            if (!(el instanceof EventTarget)) throw new TypeError("Provided element is not an EventTarget");

            const fn = (...a) => {
                if (typeof a[0] === 'string') {
                    el.removeEventListener(...a);
                } else if (a[0] && typeof a[0] === 'object') {
                    Object.entries(a[0]).forEach(([k, v]) => el.removeEventListener(k, v));
                }
                return el;
            };
            return args.length ? fn(...args) : fn;
        },
        fire: (el, arg) => {
            if (el instanceof EventTarget) {
                el.dispatchEvent(new Event(arg));
                return el;
            }
            return (e) => {
                if (!(e instanceof EventTarget)) throw new TypeError("Provided element is not an EventTarget");
                e.dispatchEvent(new Event(arg));
                return e;
            };
        }
    };


    function animate(nodes, action, onEnd, o = {}) {

        let {
            event,
            once
        } = o;
        event = event || "transitionend";
        once = once || true;

        nodes = Array.isArray(nodes) ? nodes : [nodes];

        requestAnimationFrame((timestamp) => {
            let actionFn =
                typeof action === "function" ?
                action :
                (node, i) => {
                    node.classList.add(action);
                    return action;
                };

            nodes.forEach((node, i) => {
                let animation = actionFn(node, i);
                if (onEnd) {
                    onEnd = onEnd === true ? (node, i, animation) => node.classList.remove(animation) : onEnd;
                    node.addEventListener(
                        event,
                        function() {
                            onEnd(node, i, animation);
                        }, {
                            once
                        }
                    );
                }
            });
        });
    }

    const animation = {

        "promise": function promise(nodes, action, onEnd, options = {}) {
            return new Promise((resolve) => {
                const {
                    evnt = "transitionend", once = true
                } = options;
                nodes = Array.isArray(nodes) ? nodes : Array.from(nodes);

                requestAnimationFrame(() => {
                    const actionFn = typeof action === "function" ? action : (node) => {
                        node.classList.add(action);
                        return action;
                    };

                    const originalStates = nodes.map((node) => node.style ? node.style.cssText : '');

                    nodes.forEach((node) => {
                        const animation = actionFn(node);

                        const cleanupFn = () => {
                            if (onEnd === true) {
                                node.classList.remove(animation);
                            } else if (typeof onEnd === "function") {
                                onEnd(node, animation);
                            }
                            node.style.cssText = originalStates.shift();
                            resolve();
                        };

                        node.addEventListener(evnt, cleanupFn, {
                            once
                        });
                    });
                });
            });
        },

        "event": function event(nodes, action, onEnd, options = {}) {
            const {
                startEvent = "startAnimation", endEvent = "endAnimation", once = true
            } = options;
            nodes = Array.isArray(nodes) ? nodes : Array.from(nodes);

            const originalStates = nodes.map((node) => node.style ? node.style.cssText : '');

            const startAnimation = () => {
                requestAnimationFrame(() => {
                    const actionFn = typeof action === "function" ? action : (node) => {
                        node.classList.add(action);
                        return action;
                    };

                    nodes.forEach((node, i) => {
                        const animation = actionFn(node, i);

                        const cleanupFn = () => {
                            if (onEnd === true) {
                                node.classList.remove(animation);
                            } else if (typeof onEnd === "function") {
                                onEnd(node, i, animation);
                            }
                            node.style.cssText = originalStates.shift();
                        };

                        node.addEventListener(endEvent, cleanupFn, {
                            once
                        });
                    });
                });
            };

            nodes.forEach((node) => {
                node.addEventListener(startEvent, startAnimation, {
                    once
                });
            });
        },

        "batch": function batch(nodes, action, onEnd, options = {}) {
            const {
                event = "transitionend", once = true, delay = 0, batchSize = 1, staggerDelay = 0, easing = (t) => t
            } = options;
            nodes = Array.isArray(nodes) ? nodes : Array.from(nodes);

            const originalStates = nodes.map((node) => node.style ? node.style.cssText : '');
            let currentBatchIndex = 0;
            let paused = false;

            const animateBatch = (batchIndex) => {
                if (paused || batchIndex >= nodes.length) return;

                requestAnimationFrame(() => {
                    const batch = nodes.slice(batchIndex, batchIndex + batchSize);
                    const actionFn = typeof action === "function" ? action : (node) => {
                        node.classList.add(action);
                        return action;
                    };

                    batch.forEach((node, i) => {
                        setTimeout(() => {
                            const animation = actionFn(node, i);

                            const cleanupFn = () => {
                                if (onEnd === true) {
                                    node.classList.remove(animation);
                                } else if (typeof onEnd === "function") {
                                    onEnd(node, i, animation);
                                }
                                node.style.cssText = originalStates.shift();
                            };

                            node.addEventListener(event, cleanupFn, {
                                once
                            });
                        }, i * staggerDelay);
                    });

                    setTimeout(() => {
                        animateBatch(batchIndex + batchSize);
                    }, delay);
                });
            };

            animateBatch(currentBatchIndex);

            return {
                pause: () => (paused = true),
                resume: () => {
                    if (paused) {
                        paused = false;
                        animateBatch(currentBatchIndex);
                    }
                }
            };
        }
    }

    const css = {
        addClass: (el, ...classes) => {
            el.classList.add(...classes.flat());
            return el;
        },

        removeClass: (el, ...classes) => {
            el.classList.remove(...classes.flat());
            return el;
        },

        toggleClass: (el, className, force) => {
            el.classList.toggle(className, force);
            return el;
        },

        hasClass: (el, className) => {
            return el.classList.contains(className);
        },

        setStyle: (el, styles) => {
            Object.assign(el.style, styles);
            return el;
        },

        getStyle: (el, property) => {
            return window.getComputedStyle(el).getPropertyValue(property);
        },

        addStylesheet: (styles, id) => {
            let styleEl = id ? document.getElementById(id) : null;
            if (!styleEl) {
                styleEl = document.createElement('style');
                if (id) styleEl.id = id;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent += styles;
            return styleEl;
        },

        setCSSVariable: (el, varName, value) => {
            el.style.setProperty(`--${varName}`, value);
            return el;
        },

        getCSSVariable: (el, varName) => {
            return window.getComputedStyle(el).getPropertyValue(`--${varName}`).trim();
        }
    };

    const attr = {
        setAttr: (el, attrs) => {
            Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
            return el;
        },

        getAttr: (el, attrName) => {
            return el.getAttribute(attrName);
        },

        removeAttr: (el, ...attrNames) => {
            attrNames.flat().forEach(attrName => el.removeAttribute(attrName));
            return el;
        },

        hasAttr: (el, attrName) => {
            return el.hasAttribute(attrName);
        },

        toggleAttr: (el, attrName, value = null) => {
            if (el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
            } else {
                el.setAttribute(attrName, value !== null ? value : "");
            }
            return el;
        }
    };

    const dataAttr = {
        setData: (el, key, value) => {
            el.dataset[key] = value;
            return el;
        },

        getData: (el, key) => {
            return el.dataset[key];
        },

        removeData: (el, key) => {
            delete el.dataset[key];
            return el;
        },
    };

    return {
        get: {
            byId,
            byName,
            byClass,
            byTag,
            byTagNS
        },
        byId,
        byName,
        byClass,
        byTag,
        byTagNS,
        query: {
            $,
            $$
        },
        $,
        $$,
        mount: {
            first,
            last,
            before,
            after,
            detach,
            replaceWith,
            replaceChildren
        },
        first,
        prepend,
        last,
        append,
        before,
        precede,
        after,
        succede,
        detach,
        replaceWith,
        replaceChildren,
        create: {
            html,
            svg,
            text
        },
        html,
        svg,
        text,
        event,
        animate,
        animation,
        css,
        attr,
        dataAttr
    }
}();

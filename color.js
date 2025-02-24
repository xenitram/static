const color = function() {
    const shift = [0.0, 2.0, 4.0];
    const mod = (a, n) => (((a % n) + n) % n);

    const distance = (a, b) => {
        return Math.sqrt(
            (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2
        );
    };

    const near = (str) => {
        return Object.entries(names).reduce((best, [key, val]) => {
            let d = levenshteinDistance(str, key);
            return d < best[1] ? [key, d] : best;
        }, ['', Infinity])[0];

    }
    const levenshteinDistance = (s, t) => {
        if (!s.length) return t.length;
        if (!t.length) return s.length;
        const arr = [];
        for (let i = 0; i <= t.length; i++) {
            arr[i] = [i];
            for (let j = 1; j <= s.length; j++) {
                arr[i][j] =
                    i === 0 ?
                    j :
                    Math.min(
                        arr[i - 1][j] + 1,
                        arr[i][j - 1] + 1,
                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
            }
        }
        return arr[t.length][s.length];
    };

    const names = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 216],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [216, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50]
    };

    const hex = {

        rgb: (hx) => {
            let h = hx.replace(/^#/, '');
            if (h.length === 3) h = [...h].map(x => x + x).join('');
            let r = parseInt(h.substring(0, 2), 16);
            let g = parseInt(h.substring(2, 4), 16);
            let b = parseInt(h.substring(4, 6), 16);
            return (h.length === 8) ? [r, g, b, parseInt(h.substring(6, 8), 16) / 256] : [r, g, b];
        },

        hsl: hx => rgb.hsl(hex.rgb(hx)),
        hsb: hx => rgb.hsb(hex.rgb(hx)),
        hwb: hx => rgb.hwb(hex.rgb(hx)),
        cmyk: hx => rgb.cmyk(hex.rgb(hx)),
        //hsv: hx => rgb.hsv(hex.rgb(hx)),
        xyz: hx => rgb.xyz(hex.rgb(hx)),
        lab: hx => rgb.lab(hex.rgb(hx)),
        lch: hx => rgb.lch(hex.rgb(hx)),
        hcv: hx => rgb.hcv(hex.rgb(hx)),
        yuv: (hx) => rgb.yuv(hex.rgb(hx)),
        ycbcr: (hx) => rgb.ycbcr(hex.rgb(hx)),
        name: hx => rgb.name(hex.rgb(hx))
    };

    const rgb = {
        distance:(a,b)=>{
            a=(Array.isArray(a))?a:[a.r,a.g,a.b];
            b=(Array.isArray(b))?b:[b.r,b.g,b.b];       
            return distance(a,b);
        },
        hex: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] : args;
            return `#${_.slice(0, 4) // Ensure at most 4 values (RGBA)
            .map((x, i) => {
                let value = (i === 3) ? Math.round(x * 255) : Math.round(x); // Round RGB and scale Alpha
                value = Math.min(255, Math.max(0, value)); // Clamp between 0–255
                return value.toString(16).padStart(2, '0');
            })
            .join('')}`;
        },
        hsl: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            r /= 255, g /= 255, b /= 255;
            const max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) h = s = 0;
            else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h *= 60;
            }
            s *= 100
            l *= 100

            return Array.isArray(args[0]) ?
                (a !== undefined ? [h, s, l, a] : [h, s, l]) :
                (a !== undefined ? {
                    h,
                    s,
                    l,
                    a
                } : {
                    h,
                    s,
                    l
                })

        },

        hsb: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            r /= 255;
            g /= 255;
            b /= 255;
            let v = Math.max(r, g, b),
                n = v - Math.min(r, g, b);
            let h =
                n === 0 ?
                0 :
                n && v === r ?
                (g - b) / n :
                v === g ?
                2 + (b - r) / n :
                4 + (r - g) / n;

            h = 60 * (h < 0 ? h + 6 : h)
            s = v && (n / v) * 100
            b = v * 100

            return Array.isArray(args[0]) ?
                (a !== undefined ? [h, s, b, a] : [h, s, b]) :
                (a !== undefined ? {
                    h,
                    s,
                    b,
                    a
                } : {
                    h,
                    s,
                    b
                })

        },
        hwb: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            let w = Math.min(r, g, b) / 255 * 100;
            let _b = 100 - Math.max(r, g, b) / 255 * 100;
            let h = rgb.hsl([r, g, b])[0];

            return Array.isArray(args[0]) ?
                (a !== undefined ? [h, w, _b, a] : [h, w, _b]) :
                (a !== undefined ? {
                    h,
                    w,
                    b: _b,
                    a
                } : {
                    h,
                    w,
                    b: _b
                })
        },

        cmyk: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            let c = 1 - r / 255,
                m = 1 - g / 255,
                y = 1 - b / 255;
            let k = Math.min(c, m, y);
            if (k === 1) return (Array.isArray(args[0])) ? [0, 0, 0, 100, a] : {
                c,
                m,
                y,
                k,
                a
            }

            c = ((c - k) / (1 - k) * 100)
            m = ((m - k) / (1 - k) * 100)
            y = ((y - k) / (1 - k) * 100)
            k = (k * 100)

            return Array.isArray(args[0]) ?
                (a !== undefined ? [c, m, y, k, a] : [c, m, y, k]) :
                (a !== undefined ? {
                    c,
                    m,
                    y,
                    k,
                    a
                } : {
                    c,
                    m,
                    y,
                    k
                })
        },
        /*        hsv: (...args) => {
        			let _ = Array.isArray(args[0])
        				? args[0]
        				:(typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
                    let [r, g, b, a] = _;
                    r /= 255, g /= 255, b /= 255;

                    var max = Math.max(r, g, b),
                        min = Math.min(r, g, b);
                    var h, s, v = max;

                    var d = max - min;
                    s = max == 0 ? 0 : d / max;

                    if (max == min) {
                        h = 0; // achromatic
                    } else {
                        switch (max) {
                            case r:
                                h = (g - b) / d + (g < b ? 6 : 0);
                                break;
                            case g:
                                h = (b - r) / d + 2;
                                break;
                            case b:
                                h = (r - g) / d + 4;
                                break;
                        }

                        h /= 6;
                    }

                    return (a) ? [h, s, v, a] : [h, s, v];
                },
        */
        xyz: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            r /= 255
            g /= 255
            b /= 255

            if (r > 0.04045) {
                r = Math.pow(((r + 0.055) / 1.055), 2.4)
            } else {
                r = r / 12.92
            }

            if (g > 0.04045) {
                g = Math.pow(((g + 0.055) / 1.055), 2.4)
            } else {
                g = g / 12.92
            }

            if (b > 0.04045) {
                b = Math.pow(((b + 0.055) / 1.055), 2.4)
            } else {
                b = b / 12.92
            }

            r *= 100
            g *= 100
            b *= 100

            // Observer = 2°, Illuminant = D65
            const x = r * 0.4124 + g * 0.3576 + b * 0.1805
            const y = r * 0.2126 + g * 0.7152 + b * 0.0722
            const z = r * 0.0193 + g * 0.1192 + b * 0.9505

            //return (a) ? [x, y, z, a] : [x, y, z];
            return Array.isArray(args[0]) ?
                (a !== undefined ? [x, y, z, a] : [x, y, z]) :
                (a !== undefined ? {
                    x,
                    y,
                    z,
                    a
                } : {
                    x,
                    y,
                    z
                })
        },

        lab: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;

            r = r / 255,
                g = g / 255;
            b = b / 255;

            let x, y, z;

            r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
            g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
            b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

            x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
            y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
            z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

            x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
            y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
            z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

            let _l = (116 * y) - 16,
                _a = 500 * (x - y),
                _b = 200 * (y - z)

            return Array.isArray(args[0]) ?
                (a !== undefined ? [_l, _a, _b, a] : [_l, _a, _b]) :
                (a !== undefined ? {
                    l: _l,
                    a: _a,
                    b: _b,
                    A: a
                } : {
                    l: _l,
                    a: _a,
                    b: _b
                })
        },


        lch: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;

            let [l, a_, b_] = rgb.lab([r, g, b]);
            let c = Math.sqrt(a_ ** 2 + b_ ** 2);
            let h = Math.atan2(b_, a_) * (180 / Math.PI);
            if (h < 0) h += 360;
            //return (a) ? [l, c, h, a] : [l, c, h

            return Array.isArray(args[0]) ?
                (a !== undefined ? [l, c, h, a] : [l, c, h]) :
                (a !== undefined ? {
                    l,
                    c,
                    h,
                    a
                } : {
                    l,
                    c,
                    h
                })
        },

        hcv: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let a = _[3];
            // Normalize RGB values (0-255 -> 0-1)

            let rgb = _.slice(0, 3).map(v => v / 255);

            const m = Math.min(...rgb);
            const M = Math.max(...rgb);
            let C = M - m; // Chroma
            let V = M; // Value

            let H = 0;
            if (C > 0) {
                if (M === rgb[0]) {
                    H = mod((rgb[1] - rgb[2]) / C, 6);
                } else if (M === rgb[1]) {
                    H = (rgb[2] - rgb[0]) / C + 2;
                } else {
                    H = (rgb[0] - rgb[1]) / C + 4;
                }
                H /= 6; // Normalize to [0,1]
            }

            H *= 360
            C *= 100
            V *= 100
            //return (a) ? [H, C, V, a] : [H, C, V];
            return Array.isArray(args[0]) ?
                (a !== undefined ? [H, C, V, a] : [H, C, V]) :
                (a !== undefined ? {
                    h: H,
                    c: C,
                    v: V,
                    a
                } : {
                    h: H,
                    c: C,
                    v: V
                })

        },
        yuv: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            let y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let u = -0.09991 * r - 0.33609 * g + 0.436 * b;
            let v = 0.615 * r - 0.55861 * g - 0.05639 * b;
            //return (a) ? [y, u, v, a] : [y, u, v];
            return Array.isArray(args[0]) ?
                (a !== undefined ? [y, u, v, a] : [y, u, v]) :
                (a !== undefined ? {
                    y,
                    u,
                    v,
                    a
                } : {
                    y,
                    u,
                    v
                })
        },
        ycbcr: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            let y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let cb = -0.1146 * r - 0.3854 * g + 0.5 * b + 0.5;
            let cr = 0.5 * r - 0.4542 * g - 0.0458 * b + 0.5;
            //return (a) ? [y, cb, cr, a] : [y, cb, cr];
            return Array.isArray(args[0]) ?
                (a !== undefined ? [y, cb, cr, a] : [y, cb, cr]) :
                (a !== undefined ? {
                    y,
                    cb,
                    cr,
                    a
                } : {
                    y,
                    b,
                    cr
                })
        },

        name: (...args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            return Object.entries(names).reduce((best, [key, val]) => {
                let d = rgb.distance([r, g, b], val);
                return d < best[1] ? [key, d] : best;
            }, ['', Infinity])[0];
        },

        toString: (args) => {
            let _ = Array.isArray(args[0]) ?
                args[0] :
                (typeof args[0] === 'object' ? [args[0].r, args[0].g, args[0].b, args[0].a] : args);
            let [r, g, b, a] = _;
            return a < 1 ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`
        },
    };

    const hsl = {
        hex: (...args) => rgb.hex(hsl.rgb(...args)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].h, args[0].s, args[0].l, args[0].a] : args);

            let [h, s, l, a] = _;
            s /= 100, l /= 100;

            let c = (1 - Math.abs(2 * l - 1)) * s;
            let x = c * (1 - Math.abs((h / 60) % 2 - 1));
            let m = l - c / 2;

            let [r, g, b] =
            h < 60 ? [c, x, 0] :
                h < 120 ? [x, c, 0] :
                h < 180 ? [0, c, x] :
                h < 240 ? [0, x, c] :
                h < 300 ? [x, 0, c] : [c, 0, x];

            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);

            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })

        },
        hsb: (...args) => rgb.hsb(hsl.rgb(...args)),
        hwb: (...args) => rgb.hwb(hsl.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(hsl.rgb(...args)),
        // hsv: (...args) => rgb.hsv(hsl.rgb(...args)),
        xyz: (...args) => rgb.xyz(hsl.rgb(...args)),
        lab: (...args) => rgb.lab(hsl.rgb(...args)),
        lch: (...argsa) => rgb.lch(hsl.rgb(...args)),
        hcv: (...args) => rgb.hcv(hsl.rgb(...args)),
        yuv: (...args) => rgb.yuv(hsl.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(hsl.rgb(...args)),

        name: (...args) => rgb.name(hsl.rgb(...args)),
        toString: (...args) => {
            let _ = (Array.isArray(args[0])) ? args[0] : args;
            let [h, s, l, a] = _;
            return a < 1 ? `hsla(${h}deg,${s}%,${l}%,${a})` : `hsl(${h}deg,${s}%,${l}%)`
        }
    };

    const hsb = {
        hex: (...args) => rgb.hex(hsb.rgb(...args)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].h, args[0].s, args[0].b, args[0].a] : args);
            let [h, s, b, a] = _;

            s /= 100;
            b /= 100;
            const k = (n) => (n + h / 60) % 6;
            const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
            //            return (a) ? , , , a] : [255 * f(5), 255 * f(3), 255 * f(1)];
            r = 255 * f(5)
            g = 255 * f(3)
            b = 255 * f(1)

            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })

        },
        hsl: (...args) => rgb.hsl(hsb.rgb(...args)),
        hwb: (...args) => rgb.hwb(hsb.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(hsb.rgb(...args)),
        // hsv: (...args) => rgb.hsv(hsb.rgb(...args)),
        xyz: (...args) => rgb.xyz(hsb.rgb(...args)),
        lab: (...args) => rgb.lab(hsb.rgb(...args)),
        lch: (...args) => rgb.lch(hsb.rgb(...args)),
        hcv: (...args) => rgb.hcv(hsb.rgb(...args)),
        yuv: (...args) => rgb.yuv(hsb.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(hsb.rgb(...args)),
        name: (...args) => rgb.name(hsb.rgb(...args)),

    };

    const hwb = {
        hex: (...args) => rgb.hex(hwb.rgb(...args)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].h, args[0].w, args[0].b, args[0].a] : args);

            let [h, w, b, a] = _;
            w /= 100;
            b /= 100;
            if (w + b >= 1) {
                let gray = w / (w + b) * 255;
                return [gray, gray, gray, a];
            }
            let _rgb = hsl.rgb([h, 100, 50]);

            for (let i = 0; i < 3; i++) {
                _rgb[i] *= (1 - w - b);
                _rgb[i] += w * 255;
            }

            return Array.isArray(args[0]) ?
                (a !== undefined ? [..._rgb, a] : [..._rgb]) :
                (a !== undefined ? {
                    r: _rgb[0],
                    g: _rgb[1],
                    b: _rgb[2],
                    a
                } : {
                    r: _rgb[0],
                    g: _rgb[1],
                    b: _rgb[2]
                })
        },




        hsl: (...args) => rgb.hsl(hwb.rgb(...args)),
        hsb: (...args) => rgb.hsb(hwb.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(hwb.rgb(...args)),
        // hsv: (...args) => rgb.hsv(hwb.rgb(...args)),
        xyz: (...args) => rgb.xyz(hwb.rgb(...args)),
        lab: (...args) => rgb.lab(hwb.rgb(...args)),
        lch: (...args) => rgb.lch(hwb.rgb(...args)),
        hcv: (...args) => rgb.hcv(hwb.rgb(...args)),
        yuv: (...args) => rgb.yuv(hwb.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(hwb.rgb(...args)),
        name: (...args) => rgb.name(hwb.rgb(...args)),

    };

    const cmyk = {
        hex: (...args) => rgb.hex(cmyk.rgb(...args)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].c, args[0].m, args[0].y, args[0].k, args[0].a] : args);
            let [c, m, y, k, a] = _;

            let r = 255 * (1 - c / 100) * (1 - k / 100);
            let g = 255 * (1 - m / 100) * (1 - k / 100);
            let b = 255 * (1 - y / 100) * (1 - k / 100);

            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })
        },
        hsl: (...args) => rgb.hsl(cmyk.rgb(...args)),
        hsb: (...args) => rgb.hsb(cmyk.rgb(...args)),
        hwb: (...args) => rgb.hwb(cmyk.rgb(...args)),
        // hsv: (...args) => rgb.hsv(cmyk.rgb(...args)),
        xyz: (...args) => rgb.xyz(cmyk.rgb(...args)),
        lab: (...args) => rgb.lab(cmyk.rgb(...args)),
        lch: (...args) => rgb.lch(cmyk.rgb(...args)),
        hcv: (...args) => rgb.hcv(cmyk.rgb(...args)),
        yuv: (...args) => rgb.yuv(cmyk.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(cmyk.rgb(...args)),
        name: (...args) => rgb.name(cmyk.rgb(...args)),

    };

    /*    const hsv = {
            hex: (...args) => rgb.hex(hsv.rgb(...args)),
            rgb: (...args) => {
                let _ = (Array.isArray(args[0])) ? args[0] : args;
                let [h, s, v, a] = _;

                var r, g, b;

                var i = Math.floor(h * 6);
                var f = h * 6 - i;
                var p = v * (1 - s);
                var q = v * (1 - f * s);
                var t = v * (1 - (1 - f) * s);

                switch (i % 6) {
                    case 0:
                        r = v, g = t, b = p;
                        break;
                    case 1:
                        r = q, g = v, b = p;
                        break;
                    case 2:
                        r = p, g = v, b = t;
                        break;
                    case 3:
                        r = p, g = q, b = v;
                        break;
                    case 4:
                        r = t, g = p, b = v;
                        break;
                    case 5:
                        r = v, g = p, b = q;
                        break;
                }

                return (a) ? [r * 255, g * 255, b * 255, a] : [r * 255, g * 255, b * 255];
            },

            hsl: (...args) => rgb.hsl(hsv.rgb(...args)),
            hsb: (...args) => rgb.hsb(hsv.rgb(...args)),
            hwb: (...args) => rgb.hwb(hsv.rgb(...args)),
           // hsv: (...args) => rgb.hsv(hsv.rgb(...args)),
            xyz: (...args) => rgb.xyz(hsv.rgb(...args)),
            lab: (...args) => rgb.lab(hsv.rgb(...args)),
            lch: (...args) => rgb.lch(hsv.rgb(...args)),
            hcv: (...args) => rgb.hcv(hsv.rgb(...args)),
            yuv: (...args) => rgb.yuv(hsv.rgb(...args)),
            ycbcr: (...args) => rgb.ycbcr(hsv.rgb(...args)),

            name: (...args) => rgb.name(hsv.rgb(...args)),
        };
    */

    const xyz = {
        hex: (...args) => rgb.hex(xyz.rgb(...args)),

        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].x, args[0].y, args[0].z, args[0].a] : args);

            let [x, y, z, a] = _;
            // Observer = 2°, Illuminant = D65
            x = x / 100 // X from 0 to 95.047
            y = y / 100 // Y from 0 to 100.000
            z = z / 100 // Z from 0 to 108.883

            let r = x * 3.2406 + y * -1.5372 + z * -0.4986
            let g = x * -0.9689 + y * 1.8758 + z * 0.0415
            let b = x * 0.0557 + y * -0.2040 + z * 1.0570

            if (r > 0.0031308) {
                r = 1.055 * (Math.pow(r, 0.41666667)) - 0.055
            } else {
                r = 12.92 * r
            }

            if (g > 0.0031308) {
                g = 1.055 * (Math.pow(g, 0.41666667)) - 0.055
            } else {
                g = 12.92 * g
            }

            if (b > 0.0031308) {
                b = 1.055 * (Math.pow(b, 0.41666667)) - 0.055
            } else {
                b = 12.92 * b
            }

            r *= 255
            g *= 255
            b *= 255

            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })
        },
        hsl: (...args) => rgb.hsl(xyz.rgb(...args)),
        hsb: (...args) => rgb.hsb(xyz.rgb(...args)),
        hwb: (...args) => rgb.hwb(xyz.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(xyz.rgb(...args)),
        // hsv: (...args) => rgb.hsv(xyz.rgb(...args)),
        xyz: (...args) => rgb.xyz(xyz.rgb(...args)),
        lab: (...args) => rgb.lab(xyz.rgb(...args)),
        lch: (...args) => rgb.lch(xyz.rgb(...args)),
        hcv: (...args) => rgb.hcv(xyz.rgb(...args)),
        yuv: (...args) => rgb.yuv(xyz.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(xyz.rgb(...args)),
        name: (...args) => rgb.name(xyz.rgb(...args)),
    }

    const lab = {
        hex: (l, a, b) => rgb.hex(lab.rgb(l, a, b)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].l, args[0].a, args[0].b, args[0].A] : args);

            let [l, a, b, A] = _;
            let y = (l + 16) / 116,
                x = a / 500 + y,
                z = y - b / 200

            let _r, _g, _b;

            x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16 / 116) / 7.787);
            y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16 / 116) / 7.787);
            z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16 / 116) / 7.787);

            _r = x * 3.2406 + y * -1.5372 + z * -0.4986;
            _g = x * -0.9689 + y * 1.8758 + z * 0.0415;
            _b = x * 0.0557 + y * -0.2040 + z * 1.0570;

            _r = (_r > 0.0031308) ? (1.055 * Math.pow(_r, 1 / 2.4) - 0.055) : 12.92 * _r;
            _g = (_g > 0.0031308) ? (1.055 * Math.pow(_g, 1 / 2.4) - 0.055) : 12.92 * _g;
            _b = (_b > 0.0031308) ? (1.055 * Math.pow(_b, 1 / 2.4) - 0.055) : 12.92 * _b;

            _r = Math.max(0, Math.min(1, _r)) * 255,
                _g = Math.max(0, Math.min(1, _g)) * 255,
                _b = Math.max(0, Math.min(1, _b)) * 255

            return Array.isArray(args[0]) ?
                (A !== undefined ? [_r, _g, _b, A] : [_r, _g, _b]) :
                (A !== undefined ? {
                    r: _r,
                    g: _g,
                    b: _b,
                    A
                } : {
                    r: _r,
                    g: _g,
                    b: _b
                })
        },
        hsl: (...args) => rgb.hsl(lab.rgb(...args)),
        hsb: (...args) => rgb.hsb(lab.rgb(...args)),
        hwb: (...args) => rgb.hwb(lab.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(lab.rgb(...args)),
        // hsv: (...args) => rgb.hsv(lab.rgb(...args)),
        xyz: (...args) => rgb.xyz(lab.rgb(...args)),
        lab: (...args) => rgb.lab(lab.rgb(...args)),
        lch: (...args) => rgb.lch(lab.rgb(...args)),
        hcv: (...args) => rgb.hcv(lab.rgb(...args)),
        yuv: (...args) => rgb.yuv(lab.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(lab.rgb(...args)),

        name: (...args) => rgb.name(lab.rgb(...args)),
    }

    const lch = {
        hex: (...args) => rgb.hex(lch.rgb(...args)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].l, args[0].c, args[0].h, args[0].a] : args);

            let [l, c, h, a] = _;
            let hr = (h * Math.PI) / 180;
            let a_ = c * Math.cos(hr);
            let b_ = c * Math.sin(hr);
            let [r, g, b] = lab.rgb([l, a_, b_]);

            //return (a) ? [...rgbColor, a] : rgbColor;
            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })

        },
        hsl: (...args) => rgb.hsl(lch.rgb(...args)),
        hsb: (...args) => rgb.hsb(lch.rgb(...args)),
        hwb: (...args) => rgb.hwb(lch.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(lch.rgb(...args)),
        // hsv: (...args) => rgb.hsv(lch.rgb(...args)),
        xyz: (...args) => rgb.xyz(lch.rgb(...args)),
        lab: (...args) => rgb.lab(lch.rgb(...args)),
        lch: (...args) => rgb.lch(lch.rgb(...args)),
        hcv: (...args) => rgb.hcv(lch.rgb(...args)),
        yuv: (...args) => rgb.yuv(lch.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(lch.rgb(...args)),

        name: (...args) => rgb.name(lch.rgb(...args)),
    };

    const hcv = { //former hcg
        hex: (...args) => rgb.hex(hcv.rgb(...args)),
        rgb: (...args) => {
            //let _ = (Array.isArray(args[0])) ? args[0] : args;

            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].h, args[0].c, args[0].v, args[0].a] : args);

            let [H, C, V, a] = _;
            H /= 360
            C /= 100
            V /= 100
            const h = H * 6.0; // Scale back to [0,6] range
            const rgb = [h, h, h].map((v, i) =>
                Math.min(Math.max(Math.abs(mod(v - shift[i], 6.0) - 3.0) - 1.0, 0.0), 1.0)
            );
            const m = V - C; // Corrected adjustment value
            let [r, g, b] = rgb.map((ch) => (ch * C + m) * 255).map(Math.round); // Scale back to 0-255
            //return (a) ? [r, g, b, a] : [r, g, b];
            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })
        },

        hsl: (...args) => rgb.hsl(hcv.rgb(...args)),
        hsb: (...args) => rgb.hsb(hcv.rgb(...args)),
        hwb: (...args) => rgb.hwb(hcv.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(hcv.rgb(...args)),
        // hsv: (...args) => rgb.hsv(hcv.rgb(...args)),
        xyz: (...args) => rgb.xyz(hcv.rgb(...args)),
        lab: (...args) => rgb.lab(hcv.rgb(...args)),
        lch: (...args) => rgb.lch(hcv.rgb(...args)),
        hcv: (...args) => rgb.hcv(hcv.rgb(...args)),
        yuv: (...args) => rgb.yuv(hcv.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(hcv.rgb(...args)),

        name: (...args) => rgb.name(hcv.rgb(...args)),
    };


    const yuv = {
        hex: (...args) => rgb.hex(hcv.rgb(...args)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].y, args[0].u, args[0].v, args[0].a] : args);

            let [y, u, v, a] = _;
            let r = y + 1.28033 * v;
            let g = y - 0.21482 * u - 0.38059 * v;
            let b = y + 2.12798 * u;
            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })
        },
        hsl: (...args) => rgb.hsl(yuv.rgb(...args)),
        hsb: (...args) => rgb.hsb(yuv.rgb(...args)),
        hwb: (...args) => rgb.hwb(yuv.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(yuv.rgb(...args)),
        // hsv: (...args) => rgb.hsv(yuv.rgb(...args)),
        xyz: (...args) => rgb.xyz(yuv.rgb(...args)),
        lab: (...args) => rgb.lab(yuv.rgb(...args)),
        lch: (...args) => rgb.lch(yuv.rgb(...args)),
        hcv: (...args) => rgb.hcv(yuv.rgb(...args)),
        hcg: (...args) => rgb.hcg(yuv.rgb(...args)),
        ycbcr: (...args) => rgb.ycbcr(yuv.rgb(...args)),

        name: (...args) => rgb.name(yuv.rgb(...args)),
    }

    const ycbcr = {
        hex: (...args) => rgb.hex(hcv.rgb(...args)),
        rgb: (...args) => {
            let _ = Array.isArray(args[0]) ? args[0] :
                (typeof args[0] === 'object' ? [args[0].y, args[0].cb, args[0].cr, args[0].a] : args);

            let [y, cb, cr, a] = _;
            let r = y + 1.5748 * (cr - 0.5);
            let g = y - 0.1873 * (cb - 0.5) - 0.4681 * (cr - 0.5);
            let b = y + 1.8556 * (cb - 0.5);
            return Array.isArray(args[0]) ?
                (a !== undefined ? [r, g, b, a] : [r, g, b]) :
                (a !== undefined ? {
                    r,
                    g,
                    b,
                    a
                } : {
                    r,
                    g,
                    b
                })
        },
        hsl: (...args) => rgb.hsl(ycbcr.rgb(...args)),
        hsb: (...args) => rgb.hsb(ycbcr.rgb(...args)),
        hwb: (...args) => rgb.hwb(ycbcr.rgb(...args)),
        cmyk: (...args) => rgb.cmyk(ycbcr.rgb(...args)),
        // hsv: (...args) => rgb.hsv(ycbcr.rgb(...args)),
        xyz: (...args) => rgb.xyz(ycbcr.rgb(...args)),
        lab: (...args) => rgb.lab(ycbcr.rgb(...args)),
        lch: (...args) => rgb.lch(ycbcr.rgb(...args)),
        hcv: (...args) => rgb.hcv(ycbcr.rgb(...args)),
        hcg: (...args) => rgb.hcg(ycbcr.rgb(...args)),
        yuv: (...args) => rgb.hcg(ycbcr.rgb(...args)),

        name: (...args) => rgb.name(ycbcr.rgb(...args)),

    }

    const name = {
        hex: (n) => rgb.hex(names[near(n)]),
        rgb: (n) => names[near(n)],
        hsl: (n) => rgb.hsl(names[near(n)]),
        hsb: (n) => rgb.hsb(names[near(n)]),
        hwb: (n) => rgb.hwb(names[near(n)]),
        cmyk: (n) => rgb.cmyk(names[near(n)]),
        // hsv: (n) => rgb.hsv(names[near(n)]),
        xyz: (n) => rgb.xyz(names[near(n)]),
        lab: (n) => rgb.lab(names[near(n)]),
        lch: (n) => rgb.lch(names[near(n)]),
        hcv: (n) => rgb.hcv(names[near(n)]),
        yuv: (n) => rgb.yuv(names[near(n)]),
        ycbcr: (n) => rgb.ycbcr(names[near(n)]),
    };


    const heatMap = (value) => {
        var h = (1.0 - value) * 240
        return {
            h,
            s: 100,
            l: 50
        };
    }


    const grayscale = (value) => {
        let l = value * 100;
        return {
            h: 0,
            s: 0,
            l
        }; // HSL (0, 0%, L%)
    }

/*    const pastelColor = (...args) => {
        let _ = typeof args[0] === 'object' ? args[0] : args;
        let [h, s, l, a] = _;
        h = h * 360;
        s = 60 + s * 20
        l = 70 + l * 20
        return Array.isArray(_) ? [h, s, l, a] : {
            h,
            s,
            l,
            a
        };
    }

    const warm = (...args) => {
        let _ = typeof args[0] === 'object' ? args[0] : args;
        let [h, s, l, a] = _;

        h = 270 + h * 180;
        s = 80 + s * 20;
        l = 50 + l * 10;

        return Array.isArray(_) ? [h, s, l, a] : {
            h,
            s,
            l,
            a
        };
    }

    const cold = (...args) => {
        let _ = typeof args[0] === 'object' ? args[0] : args;
        let [h, s, l, a] = _;

        h = h * 180;
        s = 80 + s * 20;
        l = 50 + l * 10;

        return Array.isArray(_) ? [h, s, l, a] : {
            h,
            s,
            l,
            a
        };
    }
*/

    const pastel = (...args) => adjustColor(args, 21, 7, 96, 7); // S: 21-28, B: 96-103
    const jewel = (...args) => adjustColor(args, 60, 20, 50, 20); // S: 60-80, B: 50-70
    const earth = (...args) => adjustColor(args, 35, 10, 60, 10); // S: 35-45, B: 60-70
    const neutral = (...args) => adjustColor(args, 10, 10, 50, 10); // S: 10-20, B: 50-60
    const neon = (...args) => adjustColor(args, 80, 10, 90, 10); // S: 80-90, B: 90-100
    const shade = (...args) => adjustColor(args, 40, 10, 30, 10); // S: 40-50, B: 30-40
    const muted = (...args) => adjustColor(args, 25, 10, 55, 10); // S: 25-35, B: 55-65
    const bright = (...args) => adjustColor(args, 70, 20, 80, 10); // S: 70-90, B: 80-90
    const warm = (...args) => adjustColor(args, 50, 15, 65, 10); // S: 50-65, B: 65-75
    const cool = (...args) => adjustColor(args, 55, 15, 70, 10); // S: 55-70, B: 70-80
    const vintage = (...args) => adjustColor(args, 30, 10, 50, 10); // S: 30-40, B: 50-60
    const dark = (...args) => adjustColor(args, 50, 10, 25, 10); // S: 50-60, B: 25-35
    const light = (...args) => adjustColor(args, 15, 10, 85, 10); // S: 15-25, B: 85-95
    const metallic = (...args) => adjustColor(args, 40, 10, 75, 5); // S: 40-50, B: 75-80
    const fluorescent = (...args) => adjustColor(args, 85, 10, 95, 5); // S: 85-95, B: 95-100

    function adjustColor(args, sBase, sRange, bBase, bRange) {
        let _ = Array.isArray(args[0]) ? args[0] :
            (typeof args[0] === 'object' ? [args[0].h, args[0].s, args[0].b, args[0].a] : args);
        let [h, s, b, a] = _;
        h = h * 360;
        s = sBase + (s * sRange);
        b = bBase + (b * bRange);

        return Array.isArray(args[0]) ?
            (a !== undefined ? [h, s, b, a] : [h, s, b]) :
            (a !== undefined ? {
                h,
                s,
                b,
                a
            } : {
                h,
                s,
                b
            });
    }

    const complementary = (...args) => {
        let _ = Array.isArray(args[0]) ? args[0] :
            (typeof args[0] === 'object' ? [args[0].h, args[0].s, args[0].l, args[0].a] : args);
        let [h, s, l, a] = _;
        h = (h + 180) % 360
        return Array.isArray(args[0]) ?
            (a !== undefined ? [h, s, l, a] : [h, s, l]) :
            (a !== undefined ? {
                h,
                s,
                l,
                a
            } : {
                h,
                s,
                l
            });
    }


    const triadic = (...args) => {
        let _ = Array.isArray(args[0]) ? args[0] :
            (typeof args[0] === 'object' ? [args[0].h, args[0].s, args[0].l, args[0].a] : args);
        let [h, s, l, a] = _;

        const colors = [
            [h, s, l],
            [(h + 120) % 360, s, l],
            [(h + 240) % 360, s, l]
        ];

        if (Array.isArray(args[0])) {
            return a !== undefined ? [...colors, a] : colors;
        } else {
            return a !== undefined ? colors.map(c => ({
                h: c[0],
                s: c[1],
                l: c[2]
            })).concat(a) : colors.map(c => ({
                h: c[0],
                s: c[1],
                l: c[2]
            }));
        }
    };


    const analogous = (...args) => {
        let _ = Array.isArray(args[0]) ? args[0] :
            (typeof args[0] === 'object' ? [args[0].h, args[0].s, args[0].l, args[0].a, args[0].angle] : args);
        let [h, s, l, a, angle = 30] = _;

        const colors = [
            [(h - angle + 360) % 360, s, l],
            [h, s, l],
            [(h + angle) % 360, s, l]
        ];

        if (Array.isArray(args[0])) {
            return a !== undefined ? [...colors, a] : colors;
        } else {
            return a !== undefined ? colors.map(c => ({
                h: c[0],
                s: c[1],
                l: c[2]
            })).concat(a) : colors.map(c => ({
                h: c[0],
                s: c[1],
                l: c[2]
            }));
        }
    };

    return {
        hex, // Converts color values to hex format
        rgb, // R (Red), G (Green), B (Blue): 0 - 255 (integer)
        hsl, // H (Hue): 0 - 360°, S (Saturation): 0 - 100%, L (Lightness): 0 - 100%
        hsb, // = hsv, H (Hue): 0 - 360°, S (Saturation): 0 - 100%, B (Brightness): 0 - 100%
        hwb, // H (Hue): 0 - 360°, W (Whiteness): 0 - 100%, B (Blackness): 0 - 100%
        cmyk, // C (Cyan), M (Magenta), Y (Yellow), K (Black): 0 - 100%
        xyz, // X: 0 - ~95.047, Y: 0 - ~100.000 (Y is perceptual luminance), Z: 0 - ~108.883
        lab, // L (Lightness): 0 - 100, a (Green to Red): ~ -128 to +127, b (Blue to Yellow): ~ -128 to +127
        lch, // L (Lightness): 0 - 100, C (Chroma): 0 - ~150 (No fixed max, depends on color gamut), H (Hue): 0 - 360°
        hcv, // = former hcg, H (Hue): 0 - 360°, C (Chroma): 0 - 100, V (Value): 0 - 100
        yuv, // Y (Luma): 16 - 235, U (Chroma Blue): -0.436 to 0.436 or 16 - 240, V (Chroma Red): -0.615 to 0.615 or 16 - 240
        ycbcr, // Y (Luma): 16 - 235, Cb (Chroma Blue): 16 - 240, Cr (Chroma Red): 16 - 240
        //distance,
        names, // Named colors and their RGB values
        name, // Get the name of the nearest color
        near, // Find the nearest named color
        heatMap, // Generate a heat map color based on value, H 0 cold - 1 hot (0-240), S 100, L 50
        grayscale, // Generate a grayscale color based on value, H 0, S 0, L 0 black 1 white (0-100)
        //pastelColor, // Generate a pastel color, H 0-1 (0-360), S 0-1 (60-80), L 0-1 (70-90)
        //warm, // Generate a warm color, H 0-1, S 0-1, L 0-1
        //cold, // Generate a cold color, H 0-1, S 0-1, L 0-1
        jewel, // Generate a jewel-tone color, H 0-1, S 0-1, B 0-1
        pastel, // Generate a pastel color, H 0-1, S 0-1, B 0-1
        earth, // Generate an earth-tone color, H 0-1, S 0-1, B 0-1
        neutral, // Generate a neutral color, H 0-1, S 0-1, B 0-1
        neon, // Generate a neon color, H 0-1, S 0-1, B 0-1
        shade, // Generate a shaded color, H 0-1, S 0-1, B 0-1
	warm, // Generate a warm color, H 0-1, S 0-1, B 0-1
	cool, // Generate a cool color, H 0-1, S 0-1, B 0-1
        muted, // Generate a muted color, H 0-1, S 0-1, B 0-1
        bright, // Generate a bright color, H 0-1, S 0-1, B 0-1
        vintage, // Generate a vintage color, H 0-1, S 0-1, B 0-1
        dark, // Generate a dark color, H 0-1, S 0-1, B 0-1
        light, // Generate a light color, H 0-1, S 0-1, B 0-1
        metallic, // Generate a metallic color, H 0-1, S 0-1, B 0-1
        fluorescent, // Generate a fluorescent color, H 0-1, S 0-1, B 0-1
        complementary, // Generate a complementary color
        triadic, // Generate a triadic color scheme
        analogous, // Generate an analogous color scheme
        r: 0, // Red hue angle
        y: 60, // Yellow hue angle
        g: 120, // Green hue angle
        c: 180, // Cyan hue angle
        b: 240, // Blue hue angle
        m: 300 // Magenta hue angle
    };
}();

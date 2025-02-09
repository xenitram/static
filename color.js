/**
 * Color utility module.
 */
const color = function() {
    
    const shift = [0.0, 2.0, 4.0];

    /**
     * Modulus function that handles negative values correctly.
     * @param {number} a - The dividend.
     * @param {number} n - The divisor.
     * @returns {number} The result of the modulus operation.
     */
    const mod = (a, n) => (((a % n) + n) % n);

    /**
     * Calculates the Euclidean distance between two RGB color arrays.
     * @param {number[]} a - The first RGB color array.
     * @param {number[]} b - The second RGB color array.
     * @returns {number} The distance between the two colors.
     */
    const distance = (a, b) => {
        return Math.sqrt(
            (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2
        );
    };

    /**
     * Finds the nearest color name to a given string using Levenshtein distance.
     * @param {string} str - The input string.
     * @returns {string} The nearest color name.
     */
    const near = (str) => {
        return Object.entries(names).reduce((best, [key, val]) => {
            let d = levenshteinDistance(str, key);
            return d < best[1] ? [key, d] : best;
        }, ['', Infinity])[0];
    }

    /**
     * Calculates the Levenshtein distance between two strings.
     * @param {string} s - The first string.
     * @param {string} t - The second string.
     * @returns {number} The Levenshtein distance between the strings.
     */
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
        /**
         * Converts a hex color string to an RGB array.
         * @param {string} hx - The hex color string.
         * @returns {number[]} The corresponding RGB array.
         */
        rgb_: hx => {
            let h = hx.replace(/^#/, '');
            if (h.length === 3) h = [...h].map(x => x + x).join('');
            if (h.length === 6) h += 'ff'; // Default alpha to 255 if not provided
            const intVal = parseInt(h, 16);
            return [
                (intVal >> 24) & 0xff,
                (intVal >> 16) & 0xff,
                (intVal >> 8) & 0xff,
                ((intVal & 0xff) / 255) //.toFixed(2)
            ];
        },

        /**
         * Converts a hex color string to an RGB array.
         * @param {string} hx - The hex color string.
         * @returns {number[]} The corresponding RGB array.
         */
        rgb: (hx) => {
            let h = hx.replace(/^#/, '');
            if (h.length === 3) h = [...h].map(x => x + x).join('');
            let r = parseInt(h.substring(0, 2), 16);
            let g = parseInt(h.substring(2, 4), 16);
            let b = parseInt(h.substring(4, 6), 16);
            //return (h.length===8)?[r, g, b, parseInt(h.substring(6, 8), 16) / 255 ]:[r, g, b];
            return (h.length === 8) ? [r, g, b, parseInt(h.substring(6, 8), 16) / 256] : [r, g, b];
        },

        hsl: hx => rgb.hsl(hex.rgb(hx)),
        hsb: hx => rgb.hsb(hex.rgb(hx)),
        hwb: hx => rgb.hwb(hex.rgb(hx)),
        cmyk: hx => rgb.cmyk(hex.rgb(hx)),
        hsv: hx => rgb.hsv(hex.rgb(hx)),
        xyz: hx => rgb.xyz(hex.rgb(hx)),
        lab: hx => rgb.lab(hex.rgb(hx)),
        lch: hx => rgb.lch(hex.rgb(hx)),
        hcv: hx => rgb.hcv(hex.rgb(hx)),
        yuv: (hx) => rgb.yuv(hex.rgb(hx)),
        ycbcr: (hx) => rgb.ycbcr(hex.rgb(hx)),
        name: hx => rgb.name(hex.rgb(hx))
    };

    const rgb = {
        /**
         * Converts an RGB array to a hex color string.
         * @param {...number} args - The RGB values.
         * @returns {string} The hex color string.
         */
        hex_: (...args) => {
            let _ = (Array.isArray(args[0])) ? args[0] : args;
            return `#${_.map((x,i) => ((i!=3)?Math.round(x):Math.round(x*255)).toString(16).padStart(2, '0')).join('')}`
        },

        /**
         * Converts an RGB array to a hex color string.
         * @param {...number} args - The RGB values.
         * @returns {string} The hex color string.
         */
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

        /**
         * Converts an RGB array to an HSL array.
         * @param {...number} args - The RGB values.
         * @returns {number[]} The HSL values.
         */
        hsl: (...args) => {
            let _ = (Array.isArray(args[0])) ? args[0] : args;
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
            return (a) ? [h, s * 100, l * 100, a] : [h, s * 100, l * 100];
        },

        /**
         * Converts an RGB array to an HSB array.
         * @param {...number} args - The RGB values.
         * @returns {number[]} The HSB values.
         */
        hsb: (...args) => {
            let _ = (Array.isArray(args[0])) ? args[0] : args;
            let [r, g, b, a] = _;
            r /= 255;
            g /= 255;
            b /= 255;
            const v = Math.max(r, g, b),
                n = v - Math.min(r, g, b);
            const h =
                n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
            return (a) ? [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100, a] : [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
        },

        /**
         * Converts an RGB array to an HWB array.
         * @param {...number} args - The RGB values.
         * @returns {number[]} The HWB values.
         */
        hwb: (...args) => {
            let _ = (Array.isArray(args[0])) ? args[0] : args;
            let [r, g, b, a] = _;
            let w = Math.min(r, g

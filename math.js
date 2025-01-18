const math = function() {

    const utils = {
        sign: (val) => {
            return val === 0 ? 0 : val > 0 ? 1 : -1
        },

        withinRange: (val, min, max) => {
            return (val >= min && val <= max)
        },

        lerp: (a, b, alpha) => {
            return a + alpha * (b - a)
        },

        //lerp : (x, y, a) => x * (1 - a) + y * a ,
        clamp: (a, min = 0, max = 1) => Math.min(max, Math.max(min, a)),
        invlerp: (x, y, a) => utils.clamp((a - x) / (y - x)),
        range: (x1, y1, x2, y2, a) => utils.lerp(x2, y2, utils.invlerp(x1, y1, a)),
        safeDivisor: (val) => (Object.is(val, 0) ? Number.MIN_VALUE : Object.is(val, -0) ? -Number.MIN_VALUE : val),
    }

    // 1. Basic Arithmetic
    const arithmetic = {
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        multiply: (a, b) => a * b,
        //divide: (a, b) => (b !== 0 ? a / b : Number.MIN_VALUE),
        divide: (a, b) => a / utils.safeDivisor(b),
        modulus: (a, b) => a % b,
        power: Math.pow,
        root: (a, n = 2) => Math.pow(a, 1 / n),
    };

    // 2. Number Theory
    const numberTheory = {
        //        gcd: (a, b) => (!b ? a : numberTheory.gcd(b, a % b)),
        //Euclidian
        gcd: (a, b) => {
            for (let temp = b, i = 0; b !== 0; i++) {
                b = a % b;
                a = temp;
                temp = b;
            }
            return a;
        },
        lcm: (a, b) => (a * b) / numberTheory.gcd(a, b),
        isPrime: (n) => {
            let flag = true;
            if (n <= 1) return false;
            if (n <= 3) return true;

            if (n % 2 === 0 || n % 3 === 0) return false;
            for (let i = 5; i <= Math.sqrt(n); i += 6) {
                if (n % i === 0 || n % (i + 2) === 0) {
                    flag = false;
                    break;
                }
            }

            return true;
        },
        nextPrime: (n) => {

            // Base case 
            if (n <= 1)
                return 2;

            let prime = n;
            let found = false;

            // Loop continuously until isPrime returns 
            // true for a number greater than n 
            while (!found) {
                prime++;

                if (isPrimeBitwize(prime))
                    found = true;
            }

            return prime;
        },
        factorize: n => {
            let a = [],
                f = 2;
            while (n > 1) {
                if (n % f === 0) {
                    a.push(f);
                    n /= f;
                } else {
                    f++;
                }
            }
            return a;
        },
        primeFactors(n) { // Return prime factors
            let result = [];
            for (let i = 2; i < Math.pow(n, 0.5); i++) {
                if (n % i == 0 && isAPrime(i)) result.push(i);
                if (n % i == 0 && isAPrime(n / i)) result.push(n / i);

            }
            return result.sort((a, b) => a - b);
        },
        divisors: num => [...Array(num).keys()]
            .map(i => i + 1)
            .reduce((acc, inc) =>
                num % inc === 0 ? [...acc, inc] : acc, []),
        phi: () => (n) => { //Euler's Totient
            var result = 1;
            // walk through all integers up to n
            for (let i = 2; i < n; i++) {
                if (numberTheory.gcd(i, n) === 1) {
                    result++;
                }
            }
            return result;
        }
    };

    // 3. Algebra
    const algebra = {
        // Solves a linear equation of the form ax + b = 0
        solveLinearEquation: (a, b) => {
            if (a === 0) {
                throw new Error("Coefficient 'a' cannot be 0 in a linear equation.");
            }
            return -b / a;
        },

        // Solves a quadratic equation of the form ax² + bx + c = 0
        quadraticRoots: (a, b, c) => {
            if (a === 0) {
                throw new Error("Coefficient 'a' cannot be 0 in a quadratic equation.");
            }
            const discriminant = b ** 2 - 4 * a * c;
            if (discriminant < 0) {
                return {
                    real: false,
                    roots: [
                        `${-b / (2 * a)} + ${Math.sqrt(-discriminant) / (2 * a)}i`,
                        `${-b / (2 * a)} - ${Math.sqrt(-discriminant) / (2 * a)}i`
                    ]
                };
            } else {
                return {
                    real: true,
                    roots: [
                        (-b + Math.sqrt(discriminant)) / (2 * a),
                        (-b - Math.sqrt(discriminant)) / (2 * a)
                    ]
                };
            }
        },

        // Simplifies a symbolic expression (example: "2x + 3x" => "5x")
        /*    simplifyExpression: (expression) => {
                const simplify = require('mathjs').simplify;
                try {
                    return simplify(expression).toString();
                } catch (error) {
                    throw new Error("Error simplifying expression: " + error.message);
                }
            }*/
        simplifyExpression: (expression) => {
            // Split the expression into terms
            const terms = expression.match(/([+-]?\s*\d*\*?\w+|\d+)/g);

            if (!terms) {
                throw new Error("Invalid expression.");
            }

            const termMap = {};

            terms.forEach((term) => {
                // Remove whitespace
                term = term.replace(/\s+/g, '');

                let coefficient = 1;
                let variable = '';

                // Match terms with variables (e.g., "3x", "-4y")
                const match = term.match(/^([+-]?\d*)\*?([a-z]*)$/i);

                if (match) {
                    coefficient = match[1] === '' || match[1] === '+' ? 1 :
                        match[1] === '-' ? -1 : parseFloat(match[1]);
                    variable = match[2] || '';
                } else {
                    // Constant term
                    coefficient = parseFloat(term);
                }

                // Add to the map
                if (termMap[variable]) {
                    termMap[variable] += coefficient;
                } else {
                    termMap[variable] = coefficient;
                }
            });

            // Construct the simplified expression
            let simplified = Object.entries(termMap)
                .filter(([_, coeff]) => coeff !== 0)
                .map(([variable, coeff]) => {
                    if (variable === '') {
                        return `${coeff}`;
                    }
                    if (coeff === 1) {
                        return variable;
                    }
                    if (coeff === -1) {
                        return `-${variable}`;
                    }
                    return `${coeff}${variable}`;
                })
                .join(' + ')
                .replace(/\+\s*-/g, '- '); // Fix "+ -" to just "-"

            // Return "0" if the result is empty
            return simplified || '0';
        }
    };


    // 4. Geometry
    const geometry = {
        distance: (a, b) => {
            if (!Array.isArray(a) || !Array.isArray(b)) {
                throw new TypeError("Arguments must be arrays.");
            }
            if (a.length !== b.length) {
                throw new Error("Arrays must have the same length.");
            }
            return Math.hypot(...Object.keys(a).map(k => b[k] - a[k]));
        },
        magnitude: (point) => distance([0, 0, 0], point),
        perimeter: {
            polygon: (arr) => arr.map((v, i) => (i != 0) ? geometry.distance(arr[i - 1], v) : geometry.distance(arr[arr.length - 1], v)).reduce((acc, v) => acc + v, 0),
            rectangle: (l, w) => 2 * (l + w),
            circle: (r) => 2 * Math.PI * r,
        },
        area: {
            rectangle: (l, w) => l * w,
            triangle: (b, h) => 0.5 * b * h,
            circle: (r) => Math.PI * Math.pow(r, 2),
            // JavaScript program to evaluate area
            // of a polygon using shoelace formula

            // (X[i], Y[i]) are coordinates of i'th point.
            polygon: (arr) => {
                // Initialize area
                let area = 0.0;
                let X = arr.map(v => [0]);
                let Y = arr.map(v => [1]);
                let n = arr.length;
                // Calculate value of shoelace formula
                let j = n - 1;
                for (let i = 0; i < n; i++) {
                    area += (X[j] + X[i]) * (Y[j] - Y[i]);

                    // j is previous vertex to i
                    j = i;
                }

                // Return absolute value
                return Math.abs(area / 2.0);
            },


        },
        volume: {

            polyhedron: (vertices, faces) => {
                // Ensure vertices is an array of [x, y, z] points
                // and faces is an array of arrays, where each sub-array is a face with vertex indices

                let vol = 0.0;

                for (const face of faces) {
                    if (face.length < 3) continue; // A valid face must have at least 3 vertices

                    const v0 = vertices[face[0]];
                    for (let i = 1; i < face.length - 1; i++) {
                        const v1 = vertices[face[i]];
                        const v2 = vertices[face[i + 1]];

                        // Calculate signed volume of tetrahedron formed by v0, v1, v2, and origin
                        vol += (
                            v0[0] * (v1[1] * v2[2] - v1[2] * v2[1]) -
                            v0[1] * (v1[0] * v2[2] - v1[2] * v2[0]) +
                            v0[2] * (v1[0] * v2[1] - v1[1] * v2[0])
                        ) / 6.0;
                    }
                }

                return Math.abs(vol); // Return absolute value as volume cannot be negative
            },

            volumeMesh: (vertices, triangles) => {
                let vol = 0.0;

                for (const tri of triangles) {
                    const v0 = vertices[tri[0]];
                    const v1 = vertices[tri[1]];
                    const v2 = vertices[tri[2]];

                    // Calculate signed volume of tetrahedron
                    vol += (
                        v0[0] * (v1[1] * v2[2] - v1[2] * v2[1]) -
                        v0[1] * (v1[0] * v2[2] - v1[2] * v2[0]) +
                        v0[2] * (v1[0] * v2[1] - v1[1] * v2[0])
                    ) / 6.0;
                }

                return Math.abs(vol);
            },
            cube: (a) => Math.pow(a, 3),
            sphere: (r) => (4 / 3) * Math.PI * Math.pow(r, 3),
            cylinder: (r, h) => Math.PI * Math.pow(r, 2) * h,
        },
    };

    // 5. Trigonometry
    const trigonometry = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        arcsin: Math.asin,
        arccos: Math.acos,
        arctan: Math.atan,
        deg2rad: (deg) => deg * Math.PI / 180,
        rad2deg: (rad) => rad * 180 / Math.PI,
        lawOfSines: (a, A, B) => {
            // Law of Sines: a / sin(A) = b / sin(B)
            // To calculate b, we can rearrange the formula: b = a * (sin(B) / sin(A))
            const sinA = Math.sin(A * Math.PI / 180); // Convert angle A to radians
            const sinB = Math.sin(B * Math.PI / 180); // Convert angle B to radians
            const b = (a * sinB) / sinA;
            return b;
        },

        lawOfCosines: (a, b, C) => {
            // Law of Cosines: c^2 = a^2 + b^2 - 2ab * cos(C)
            // To calculate c, we can rearrange the formula: c = sqrt(a^2 + b^2 - 2ab * cos(C))
            const cosC = Math.cos(C * Math.PI / 180); // Convert angle C to radians
            const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * cosC);
            return c;
        },


    };

    // 6. Vector and Matrix Operations
    const linearAlgebra = {


        vector: {
            add: (v1, v2) => {
                return v1.map((x, i) => v2[i] + x);
            },
            subtract: (v1, v2) => {
                return v1.map((x, i) => x - v2[i]);
            },
            scale: (v1, s) => {
                return v1.map((x) => x * s);
            },

            dotProduct: (v1, v2) => {
                return v1.reduce((acc, x, i) => acc + v2[i] * x, 0);
            },
            crossProduct: (v1, v2) => {
                return [
                    v1[1] * v2[2] - v1[2] * v2[1],
                    v1[2] * v2[0] - v1[0] * v2[2],
                    v1[0] * v2[1] - v1[1] * v2[0]
                ];
            },

/*            crossProductGeneralized: (...vectors) => { //Generalized Cross Product for n-Dimensional Vectors
                const n = vectors[0].length; // Dimension of vectors
                if (vectors.length !== n - 1) {
                    throw new Error(`Cross product requires exactly ${n - 1} vectors in ${n}-dimensional space.`);
                }

                // Generate the matrix with standard basis vectors as rows
                const matrix = Array.from({
                    length: n
                }, (_, i) => {
                    return i < vectors.length ? vectors[i] : Array.from({
                        length: n
                    }, (_, j) => (i === j ? 1 : 0));
                });


                // Compute cofactors for each element in the basis row (last row)
                return Array.from({
                    length: n
                }, (_, i) => {
                    const subMatrix = matrix.filter((_, rowIndex) => rowIndex !== i)
                        .map(row => row.slice(1));
                    return linearAlgebra.matrix.determinant(subMatrix) * (i % 2 === 0 ? 1 : -1);
                });
            },

            generalizedCrossProduct:(...vectors)=>{
                const n = vectors.length + 1; // Dimension of the vectors
                if (!vectors.every(v => v.length === n - 1)) {
                    throw new Error("Each vector must have n-1 components.");
                }

                const matrix = vectors.map(v => [...v, 1]); // Add dummy row for determinant
                const result = [];

                for (let i = 0; i < n; i++) {
                    // Create submatrix excluding current column
                    const subMatrix = matrix.map(row => row.filter((_, j) => j !== i));
                    // Calculate determinant of the submatrix
                    const det = linearAlgebra.matrix.determinant(subMatrix);
                    // Alternate signs
                    result.push((i % 2 === 0 ? 1 : -1) * det);
                }

                return result;
            },
*/
            magnitude: (v) => {
                return Math.sqrt(v.reduce((acc, x) => acc + x * x, 0));
            },
            normalize: (v) => {
                const m = linearAlgebra.vector.magnitude(v);
                return m === 0 ? Array(v.length).fill(0) : v.map((x) => x / m);
            },
            angleBetween: (v1, v2) => {
                const dot = linearAlgebra.vector.dotProduct(v1, v2);
                const magnitude1 = linearAlgebra.vector.magnitude(v1);
                const magnitude2 = linearAlgebra.vector.magnitude(v2);
                return Math.acos(dot / (magnitude1 * magnitude2));
            },

            projection: (v1, v2) => {
                const dot = linearAlgebra.vector.dotProduct(v1, v2);
                const magSquared = linearAlgebra.vector.magnitude(v2) ** 2;
                return linearAlgebra.vector.scale(v2, dot / magSquared);
            },
            rejection: (v1, v2) => {
                const proj = linearAlgebra.vector.projection(v1, v2);
                return linearAlgebra.vector.subtract(v1, proj);
            },

            distance: (v1, v2) => {
                return Math.sqrt(v1.reduce((acc, x, i) => acc + (x - v2[i]) ** 2, 0));
            },

            hadamardProduct: (v1, v2) => {
                return v1.map((x, i) => x * v2[i]);
            },

            reflection: (v, normal) => {
                const dot = 2 * linearAlgebra.vector.dotProduct(v, normal);
                return linearAlgebra.vector.subtract(v, linearAlgebra.vector.scale(normal, dot));
            },

            perpendicular2D: (v) => {
                if (v.length !== 2) throw new Error("Vector must be 2D for perpendicular operation.");
                return [-v[1], v[0]];
            },

            equals: (v1, v2) => {
                return v1.length === v2.length && v1.every((x, i) => x === v2[i]);
            },

            lerp: (v1, v2, alpha) => {
                return v1.map((x, i) => x * (1 - alpha) + v2[i] * alpha);
            },

            rotate2D: (v, angle) => {
                if (v.length !== 2) throw new Error("Vector must be 2D for rotation.");
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                return [
                    v[0] * cosA - v[1] * sinA,
                    v[0] * sinA + v[1] * cosA
                ];
            }
        },

        matrix: {
            add: (m1, m2) => {
                if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
                    throw new Error("Matrices must have the same dimensions.");
                }
                return m1.map((row, i) => row.map((val, j) => val + m2[i][j]));
            },
            subtract: (m1, m2) => {
                if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
                    throw new Error("Matrices must have the same dimensions.");
                }
                return m1.map((row, i) => row.map((val, j) => val - m2[i][j]));
            },
            multiply: (m1, m2) => {
                if (m1[0].length !== m2.length) {
                    throw new Error("Number of columns in m1 must equal number of rows in m2.");
                }
                return m1.map((row, i) =>
                    m2[0].map((_, j) =>
                        row.reduce((sum, val, k) => sum + val * m2[k][j], 0)
                    )
                );
            },
            scalarMultiply: (matrix, scalar) => {
                return matrix.map(row => row.map(val => val * scalar));
            },
            determinant: (matrix) => {
                const n = matrix.length;
                if (n !== matrix[0].length) {
                    throw new Error("Matrix must be square.");
                }

                const determinantRecursive = (m) => {
                    if (m.length === 1) return m[0][0];
                    if (m.length === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

                    return m[0].reduce((det, val, col) => {
                        const subMatrix = m.slice(1).map(row => row.filter((_, j) => j !== col));
                        return det + val * determinantRecursive(subMatrix) * (col % 2 === 0 ? 1 : -1);
                    }, 0);
                };

                return determinantRecursive(matrix);
            },

            transpose: (matrix) => {
                return matrix[0].map((_, i) => matrix.map(row => row[i]));
            },

            inverse: (matrix) => {
                const n = matrix.length;
                if (n !== matrix[0].length) {
                    throw new Error("Matrix must be square.");
                }

                const det = linearAlgebra.matrix.determinant(matrix);
                if (det === 0) {
                    throw new Error("Matrix is singular and cannot be inverted.");
                }

                const adjugate = matrix.map((row, i) =>
                    row.map((_, j) => {
                        const subMatrix = matrix
                            .filter((_, rowIdx) => rowIdx !== i)
                            .map(row => row.filter((_, colIdx) => colIdx !== j));
                        return linearAlgebra.matrix.determinant(subMatrix) * ((i + j) % 2 === 0 ? 1 : -1);
                    })
                );

                const adjugateTransposed = linearAlgebra.matrix.transpose(adjugate);
                return adjugateTransposed.map(row => row.map(val => val / det));
            },
        },
        identity: (size) => {
            return Array.from({
                    length: size
                }, (_, i) =>
                Array.from({
                    length: size
                }, (_, j) => (i === j ? 1 : 0))
            );
        },

        trace: (matrix) => {
            if (matrix.length !== matrix[0].length) {
                throw new Error("Matrix must be square.");
            }
            return matrix.reduce((sum, row, i) => sum + row[i], 0);
        },

        isSquare: (matrix) => {
            return matrix.length === matrix[0].length;
        },

        isSymmetric: (matrix) => {
            if (!linearAlgebra.matrix.isSquare(matrix)) return false;
            const transposed = linearAlgebra.matrix.transpose(matrix);
            return matrix.every((row, i) => row.every((val, j) => val === transposed[i][j]));
        },

    };

    // 7. Coordinate Systems and Transformations
    const transformations = {
        cartesianToSpherical: ([x, y, z]) => {
            const r = magnitude([x, y, z]); // Radial distance
            const theta = Math.atan2(y, x); // Azimuthal angle
            const phi = r === 0 ? 0 : Math.acos(z / r); // Polar angle (handle edge case when r is 0)
            return [r, theta, phi];
        },
        sphericalToCartesian: ([r, phi, theta]) => {
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            return [x, y, z];
        },
        rotatePoint: ([x, y, z], [ax, ay, az], angle) => {
            // Normalize the axis vector
            const axisLength = Math.sqrt(ax * ax + ay * ay + az * az);
            const [ux, uy, uz] = [ax / axisLength, ay / axisLength, az / axisLength];

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const oneMinusCosA = 1 - cosA;

            // Rodrigues' rotation formula
            const rotatedX =
                (cosA + ux * ux * oneMinusCosA) * x +
                (ux * uy * oneMinusCosA - uz * sinA) * y +
                (ux * uz * oneMinusCosA + uy * sinA) * z;

            const rotatedY =
                (uy * ux * oneMinusCosA + uz * sinA) * x +
                (cosA + uy * uy * oneMinusCosA) * y +
                (uy * uz * oneMinusCosA - ux * sinA) * z;

            const rotatedZ =
                (uz * ux * oneMinusCosA - uy * sinA) * x +
                (uz * uy * oneMinusCosA + ux * sinA) * y +
                (cosA + uz * uz * oneMinusCosA) * z;

            return [rotatedX, rotatedY, rotatedZ];
        },

        reflectVector: (v, n) => {
            const dot = dotProduct(v, n);
            return [
                v[0] - 2 * dot * n[0],
                v[1] - 2 * dot * n[1],
                v[2] - 2 * dot * n[2]
            ];
        },
    };

    // 8. Calculus
    const calculus = {
        differentiate: (fn, x, h = 1e-5) => (fn(x + h) - fn(x - h)) / (2 * h),

        integrate: (fn, a, b, n = 1000) => {
            const h = (b - a) / n; // Width of each interval
            let sum = 0;

            // Trapezoidal Rule
            for (let i = 0; i <= n; i++) {
                const x = a + i * h;
                const weight = (i === 0 || i === n) ? 0.5 : 1; // Half-weight for endpoints
                sum += weight * fn(x);
            }

            return sum * h;
        },

        gradient: (fn, point, h = 1e-5) => {
            if (!Array.isArray(point)) {
                throw new Error("Point must be an array.");
            }

            return point.map((_, i) => {
                const pointForward = [...point];
                const pointBackward = [...point];
                pointForward[i] += h;
                pointBackward[i] -= h;

                return (fn(...pointForward) - fn(...pointBackward)) / (2 * h);
            });
        },
    };


    // 9. Probability and Statistics
    const statistics = {
        mean: (arr) => arr.reduce((sum, x) => sum + x, 0) / arr.length,

        median: (arr) => {
            if (!arr.length) return null;
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0 ?
                sorted[mid] // Odd length
                :
                (sorted[mid - 1] + sorted[mid]) / 2; // Even length
        },

        mode: (arr) => {
            if (!arr.length) return null;
            const freqMap = arr.reduce((acc, val) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {});
            const maxFreq = Math.max(...Object.values(freqMap));
            const modes = Object.keys(freqMap).filter((key) => freqMap[key] === maxFreq);
            return modes.length === 1 ? Number(modes[0]) : modes.map(Number); // Single or multiple modes
        },

        variance: (arr, isSample = false) => {
            if (arr.length < 2) return null;
            const m = statistics.mean(arr);
            const sumSquaredDiffs = arr.reduce((sum, x) => sum + (x - m) ** 2, 0);
            return isSample ? sumSquaredDiffs / (arr.length - 1) : sumSquaredDiffs / arr.length;
        },

        standardDeviation: (arr, isSample = false) => {
            const v = statistics.variance(arr, isSample);
            return v !== null ? Math.sqrt(v) : null;
        },

        normalize: (arr) => {
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            return arr.map((x) => (x - min) / (max - min));
        },
    };

    const scaleCalc = {

        linear: (value, from = [1, 100], to = [0, 1]) => {
            const [minp, maxp] = to;
            const [minv, maxv] = from;
            var scale = (maxp - minp) / utils.safeDivisor(maxv - minv);
            // y=m*x+b
            return (value - minv) * scale + minp
        },
        linearInvert: (value, from = [1, 100], to = [0, 1]) => {
            const [minp, maxp] = to;
            const [minv, maxv] = from;
            var scale = (maxp - minp) / utils.safeDivisor(maxv - minv);
            // y=m*x+b
            return (value - minp) / utils.safeDivisor(scale) + minv
        },

        exponential: (value, from = [1, 100], to = [0.1, 10]) => {
            const [minp, maxp] = from;
            const minv = Math.log(to[0]);
            const maxv = Math.log(to[1]);

            // calculate adjustment factor
            var scale = (maxp - minp) / utils.safeDivisor(maxv - minv);
            // y=m*log(x)+b

            return Math.exp((value - minp) / utils.safeDivisor(scale) + minv);
        },
        exponentialInvert: (value, from = [1, 100], to = [0.1, 10]) => {
            const [minp, maxp] = from;
            var minv = Math.log(to[0]);
            var maxv = Math.log(to[1]);

            // calculate adjustment factor
            var scale = (maxp - minp) / utils.safeDivisor(maxv - minv);
            // y=m*log(x)+b
            return (Math.log(value) - minv) * scale + minp;
        },
        logarithmic: (value, from = [1, 100], to = [0, 1]) => {

            var [minp, maxp] = to;

            var minv = Math.log(from[0]);
            var maxv = Math.log(from[1]);

            // calculate adjustment factor
            var scale = (maxp - minp) / utils.safeDivisor(maxv - minv);
            // y=m*log(x)+b
            return (Math.log(value) - minv) * scale + minp;
        },
        logarithmicInvert: (value, from = [1, 100], to = [0, 1]) => {

            var [minp, maxp] = to;

            var minv = Math.log(from[0]);
            var maxv = Math.log(from[1]);

            // calculate adjustment factor
            var scale = (maxp - minp) / (maxv - minv);
            // y = m * log(x) + b
            return Math.exp((value - minp) / utils.safeDivisor(scale) + minv);
        },
        power: (value, from = [1, 100], to = [0, 1], e = 2) => {
            var [minp, maxp] = to;
            var minv = Math.pow(from[0], e);
            var maxv = Math.pow(from[1], e);
            var scale = (maxp - minp) / utils.safeDivisor(maxv - minv);
            return Math.pow(value - minv, e) * scale + minp;
        },

        powerInvert: (value, from = [1, 100], to = [0, 1], e = 2) => {
            var [minp, maxp] = to;
            var minv = Math.pow(from[0], e);
            var maxv = Math.pow(from[1], e);
            var scale = (maxp - minp) / utils.safeDivisor(maxv - minv);
            return Math.pow((value - minp) / utils.safeDivisor(scale), 1 / utils.safeDivisor(e)) + minv;
        }
    }

    const scaler = function(fn, from, to, e) {
        from = from || [1, 100];
        to = to || [0, 1];
        e = e || 2.0;
        const scale = (val) => {
            return fn(val, from, to, e)
        }

        scale.from = function(value) {
            if (!arguments.length) return from;
            from = value;
            return scale;
        };

        scale.to = function(value) {
            if (!arguments.length) return to;
            to = value;
            return scale;
        };

        scale.e = function(value) {
            if (!arguments.length) return e;
            e = value;
            return scale;
        };

        return scale;
    }

    const scaling = {
        linear: (value, from, to) => {
            return (value != undefined) ? scaleCalc.linear(value, from, to) : scaler(scaleCalc.linear, from, to)
        },
        linearInvert: (value, from, to) => {
            return (value != undefined) ? scaleCalc.linearInvert(value, from, to) : scaler(scaleCalc.linearInvert, from, to)
        },

        exponential: (value, from, to) => {
            return (value != undefined) ? scaleCalc.exponential(value, from, to) : scaler(scaleCalc.exponential, from, to)
        },
        exponentialInvert: (value, from, to) => {
            return (value != undefined) ? scaleCalc.exponentialInvert(value, from, to) : scaler(scaleCalc.exponentialInvert, from, to)
        },

        logarithmic: (value, from, to) => {
            return (value != undefined) ? scaleCalc.logarithmic(value, from, to) : scaler(scaleCalc.logarithmic, from, to)
        },
        logarithmicInvert: (value, from, to) => {
            return (value != undefined) ? scaleCalc.logarithmicInvert(value, from, to) : scaler(scaleCalc.logarithmicInvert, from, to)
        },

        power: (value, from, to, e) => {
            return (value != undefined) ? scaleCalc.power(value, from, to, e) : scaler(scaleCalc.power, from, to, e)
        },
        powerInvert: (value, from, to, e) => {
            return (value != undefined) ? scaleCalc.powerInvert(value, from, to, e) : scaler(scaleCalc.powerInvert, from, to, e)
        }

    }

    // 11. Miscellaneous Functions
    const miscellaneous = {
        factorial: (n) => (n <= 1 ? 1 : n * miscellaneous.factorial(n - 1)),
        fibonacci: (n) => {
            let phi = (1 + Math.sqrt(5)) / 2;
            let asymp = Math.pow(phi, n) / Math.sqrt(5);

            return Math.round(asymp);
        },
        fib: (numMax) => {
            for (var fibArray = [0, 1], i = 0, j = 1, k = 0; k < numMax; i = j, j = x, k++) {
                x = i + j;
                fibArray.push(x);
            }
            return fibArray;
        },

        randomInRange: (min, max) => Math.random() * (max - min) + min,
    };

    return {
        arithmetic,
        numberTheory,
        algebra,
        geometry,
        trigonometry,
        linearAlgebra,
        transformations,
        calculus,
        statistics,
        scaling,
        miscellaneous,
    };
}();
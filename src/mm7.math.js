(function (mm7) {
    mm7["math"] = {
        detarminant: function (matris) {
            if (matris.length > 2) {

                var result = 0;

                for (var k = 0; k < matris[0].length; k++) {
                    var m = new Array();
                    for (var i = 1; i < matris.length; i++) {
                        m.push(new Array());
                        for (var j = 0; j < matris[i].length; j++) {
                            if (k !== j) {
                                m[ i - 1 ].push(matris[i][j]);
                            }
                        }
                    }
                    result += matris[0][k] * Math.pow(-1, k) * this.detarminant(m);
                }
                return result;
            } else {
                if (matris.length === 2) {
                    return matris[0][0] * matris[1][1] - matris[0][1] * matris[1][0];
                } else if (matris.length === 1) {
                    return matris[0][0];
                } else {
                    return 0;
                }
            }
        },
        primes: function (end, start) {
            var max = parseInt(end);
            var min = 2;
            var arr = [];
            if (start)
                min = parseInt(start);

            for (var i = min; i < max; i++) {
                var prn = true;
                for (var j = 2; j < i; j++) {
                    if (i % j === 0) {
                        prn = false;
                        break;
                    }
                }
                if (prn)
                    arr.push(i);
            }
            return arr;
        },
        isPrime: function(n)
        {
            if (n < 2) return false;

            var q = Math.floor(Math.sqrt(n));

            for (var i = 2; i <= q; i++)
            {
                if (n % i === 0) return false;
            }

            return true;
        },
        zeta: function (s, limit) {
            var l = 1000;
            if (limit)
                l = parseInt(limit);
            var res = 0;
            for (var i = 1; i < l + 1; i++) {
                res += 1 / Math.pow(i, s);
            }
            return res;
        },
        euler: function (s, limit) {
            var res = 1;
            var i = 2;
            var c = 0;

            while (c < limit) {
                var prn = true;
                for (var j = 2; j < i; j++) {
                    if (i % j === 0) {
                        prn = false;
                        break;
                    }
                }
                if (prn) {
                    res = res * (1 / (1 - Math.pow(i, -1 * s)));
                    c++;
                }
                i++;
            }
            return res;
        },
        factorial: function (n) {
            var r = 1;
            for (var i = 0; i < n; i++) {
                r = r * (i + 1);
            }
            return r;
        },
        fibonacci: function (n) {
            var r = n, a = 0, b = 1;
            for (var i = 1; i < n; i++) {
                r = a + b;
                a = b;
                b = r;
            }
            return r;
        },
        factorization: function (n) {
            var r = parseInt(n);
            var i = 2;
            var arr = [];
            while (i <= r) {
                if (r % i === 0) {
                    r = r / i;
                    arr.push(i);
                } else {
                    i++;
                }
            }
            return arr;
        },
        gcd: function (a, b) {
            if (a < 0)
                a = -a;
            if (b < 0)
                b = -b;
            if (b > a) {
                var temp = a;
                a = b;
                b = temp;
            }
            while (true) {
                if (b === 0)
                    return a;
                a %= b;
                if (a === 0)
                    return b;
                b %= a;
            }
        },
        lcm: function (a, b) {
            return Math.abs(a * b) / this.gcd(a, b);
        }
    };
})(mm7);
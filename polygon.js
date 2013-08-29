(function(win, doc) {
    'use strict';

    /* ==============================
        DEFAULTS
    ============================== */

    var computedStyle = win.getComputedStyle;

    Number.prototype.toFixed = function(n) {
        var fix = Math.pow(10, n || 0);
        return Math.round(this * fix) / fix;
    }


    /* ==============================
        CONSTRUCTOR
    ============================== */

    function Polygon(element, nSides, sprite) {
        this.el = doc.querySelector(element);
        this.nSides = typeof nSides !== 'number' || nSides < 2 ? 3 : nSides > 360 ? 360 : nSides;
        this.sprite = sprite;
        this.init();
    }


    /* ==============================
        PUBLIC
    ============================== */

    Polygon.prototype = {
        init: function() {
            this.el.classList.add('polygon');
            _createShape(this.el, this.nSides);

            if (this.sprite) {
                this.setSprite(this.sprite);
            }
        },

        setSprite: function(sprite) {
            var layers = this.el.querySelectorAll('.layer'),
                i = 0;

            for(; i < layers.length; i++) {
                _setStyle(layers[i], {
                    'background-image': sprite,
                    'background-position': (100 / this.nSides * i) + '% 0'
                }, sprite);
            }
        }
    }


    /* ==============================
        PRIVATE
    ============================== */

    var
    // create a new shape and append it at target element
    _createShape = function(el, nS) {
        var content = el.innerHTML,
            angle = 360 / nS,
            shape,
            layer,
            top,
            bottom,
            wEl = _fixNum(computedStyle(el).width),
            hEl = _fixNum(computedStyle(el).height),
            wShape = _fixNum(wEl * Math.sqrt(2)),
            wLayer = _fixNum(Math.sin(Math.PI / nS) * wShape),
            lLayer = _fixNum((wEl - wLayer) / 2),
            tzLayer = _fixNum(wShape / 2 * Math.cos(Math.PI / nS)),
            lCovers = _fixNum(-(wShape - wEl) / 2),
            tCovers = _fixNum(-(wShape - hEl) / 2),
            tzCovers = _fixNum(hEl / 2),
            triangleFix = nS == 3 ? _fixNum((wShape - (wLayer / 2 * Math.sqrt(3))) / 2) : false,
            i = 1;

        // set defaults at element
        el.innerHTML = '';

        // create a polygon
        shape = doc.createElement('div');
        shape.classList.add('shape', 'sides-' + nS);

        for (; i <= nS; i++) {
            // create a new layer
            layer = _createLayer(('l' + i), {
                'width': wLayer + 'px',
                'left': lLayer + 'px',

                // calc width and position of each layer
                'transform': 'rotateY(' + (angle * (nS - i + 1)) + 'deg) translateZ(' + tzLayer + 'px)'/* + (nS == 3 ? 'translateX(' + -lLayer + 'px)' : '')*/
            });

            // insert front/back faces of layer
            layer.innerHTML = '<div class="front"></div><div class="back"></div>';

            // append the layer at shape
            shape.appendChild(layer);
        }

        // create and insert the top/bottom layer
        top = _createLayer('top', {'transform': 'rotateX(90deg) translateZ(' + tzCovers + 'px)' + (triangleFix ? ' translateY(' + -triangleFix + 'px)' : '') });
        bottom = _createLayer('bottom', {'transform': 'rotateX(270deg) translateZ(' + tzCovers + 'px)' + (triangleFix ? ' translateY(' + triangleFix + 'px)' : '') });

        top.style.width = bottom.style.width =
        top.style.height = bottom.style.height = wShape + 'px';

        top.style.top = bottom.style.top = tCovers + 'px';
        top.style.left = bottom.style.left = lCovers + 'px';

        shape.insertBefore(top, shape.firstChild);
        shape.appendChild(bottom);

        // append the shape at element
        el.appendChild(shape);

        // insert the content of element at front face of first layer
        shape.querySelector('.front').innerHTML = content;
    },

    // classes: string sepa,rated with whitespace ' '
    // style: object with property/value
    _createLayer = function(classes, style) {
        var layer = doc.createElement('div'),
            classes = classes.split(' '),
            s;

        // set default and specifics classes of layer
        classes.push('layer');
        classes.forEach(function(value) {
            layer.classList.add(value);
        });

        _setStyle(layer, style);

        return layer;
    },

    _setStyle = function(el, prop, val) {
        // set properties with the specif prefix of browser
        if (typeof arguments[1] == 'object') {
            var style= arguments[1],
                s;

            // set style
            for (s in style) {
                _setStyle(el, s, style[s]);
            }
        } else {
            el.style[prop.toLowerCase()] = el.style[_prefixCSS() + (prop.charAt(0).toUpperCase() + prop.slice(1))] = val;
        }
    },

    _prefixCSS = function() {
        var style = computedStyle(doc.documentElement),
            pfx,
            i;

        // search and return specific prefix of browser
        for (i in style) {
            pfx = i.match(/^(moz|webkit|ms)/gi);

            if (pfx) {
                return pfx;
            }
        }
    },

    _fixNum = function(n) {
        if (typeof n !== 'number') {
            n = parseInt(n);
        }

        return n.toFixed(2);
    }


    /* ==============================
        GLOBAL API
    ============================== */

    win.polygon = function() {
        var args = arguments;

        function polygon(args) {
            Polygon.apply(this, args);
        }
        polygon.prototype = Polygon.prototype;

        return new polygon(args);
    }


})(window, document);
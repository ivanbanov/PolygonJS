(function(wdw, doc) {
    'use strict';

    /* ==============================
        DEFAULTS
    ============================== */

    var _plugin = 'polygon',
        computedStyle = wdw.getComputedStyle;

    Number.prototype.toFixed = function(n) {
        var fix = Math.pow(10, n || 0);
        return Math.round(this * fix) / fix;
    }



    /* ==============================
        CONSTRUCTOR
    ============================== */

    function Plugin(element, nSides, sprite) {
        this.el = doc.querySelector(element);
        this.nSides = typeof nSides !== 'number' || nSides < 2 ? 3 : nSides > 360 ? 360 : nSides;
        this.init();
    }



    /* ==============================
        PUBLIC
    ============================== */

    Plugin.prototype = {
        init: function() {
            var el = this.el,
                nS = this.nSides;

            el.classList.add('polygon');
            _createShape(el, nS);
        },

        setSprite: function(sprite) {
            // code
        }
    }



    /* ==============================
        PRIVATE
    ============================== */

    // create a new shape and append it at target element
    function _createShape(el, nS) {
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
            lLayer = (wEl - wLayer) / 2,
            tzLayer = _fixNum(wShape / 2 * Math.cos(Math.PI / nS)),
            lCovers = _fixNum(-(wShape - wEl) / 2),
            tCovers = _fixNum(-(wShape - hEl) / 2),
            tzCovers = hEl / 2,
            triangleFix = nS == 3 ? _fixNum((wShape - (wLayer / 2 * Math.sqrt(3))) / 2) : false,
            i = 1;

        // set defaults at element
        el.innerHTML = '';

        // create a polygon
        shape = doc.createElement('div');
        shape.classList.add('shape', 'sides-' + nS);

        for (; nS >= i; i++) {
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
    }

    // classes: string separated with whitespace ' '
    // style: object with property/value
    function _createLayer(classes, style) {
        var layer = doc.createElement('div'),
            classes = classes.split(' '),
            s;

        // set default and specifics classes of layer
        classes.push('layer');
        classes.forEach(function(value) {
            layer.classList.add(value);
        });

        // set style
        for (s in style) {
            _setStyle(layer, s, style[s]);
        }

        return layer;
    }

    function _setStyle(el, prop, val) {
        // set properties with the specif prefix of browser
        el.style[prop.toLowerCase()] = el.style[_prefixCSS() + (prop.charAt(0).toUpperCase() + prop.slice(1))] = val;
    }

    function _prefixCSS() {
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
    }

    function _fixNum(n) {
        if (typeof n === 'string') {
            n = parseInt(n);
        }

        return n.toFixed(2);
    }



    /* ==============================
        GLOBAL
    ============================== */

    wdw[_plugin] = function() {
        var args = arguments;

        function fn(args) {
            Plugin.apply(this, args);
        }
        fn.prototype = Plugin.prototype;

        new fn(args);
    }



})(window, document);
(function(wdw, doc) {
    'use strict';

    // DEFAULTS
    var _plugin = 'polygon',
        computedStyle = wdw.getComputedStyle;

    // CONSTRUCTOR
    function Plugin(element, sides, sprite) {
        this.el = doc.querySelector(element);
        this.nSides = typeof sides !== 'number' || sides < 2 ? 3 : sides > 360 ? 360 : sides;
        this.init();
    }

    // PUBLIC
    Plugin.prototype = {
        init: function() {
            var el = this.el,
                content = el.innerHTML,
                nS = this.nSides,
                angle = 360 / nS,
                shape = null,
                layer = null,
                wEl = parseInt(computedStyle(el).width),
                wShape = wEl * Math.sqrt(2),
                wLayer = Math.sin(Math.PI / nS) * wShape / wEl * 100,
                prefix = _prefixCSS(),
                i = 1;

            console.log(computedStyle(el));

            // set defaults at element
            el.innerHTML = '';
            el.classList.add('polygon');

            // create a polygon
            shape = doc.createElement('div');
            shape.classList.add('shape', 'sides-' + nS);

            for (; nS >= i; i++) {
                // create a new layer with geral and specific class
                layer = doc.createElement('div');
                layer.classList.add('layer', 'l' + i);

                // calc width and position of each layer
                layer.style.width = wLayer + '%';
                layer.style.transform = layer.style[prefix + 'Transform'] = 'rotateY(' + (angle * (nS - i + 1)) + 'deg)' +
                                                                            'translateZ(' + (wShape / 2 * Math.cos(Math.PI / nS)) + 'px)';
                layer.style.left = (100 - wLayer) / 2 + '%';

                // insert front/back faces of layer
                layer.innerHTML = '<div class="front"></div><div class="back"></div>';

                // append layer on target element
                shape.appendChild(layer);
            }

            // append the shape at element
            el.appendChild(shape);

            // insert the content of element at front face of first layer
            shape.querySelector('.front').innerHTML = content;
        },
        setSprite: function(sprite) {
            // code
        }
    }

    // PRIVATE
    function _prefixCSS(prop, val) {
        var style = computedStyle(doc.documentElement, null),
            pfx = '';

        // search specific prefix of browser
        for (var i in style) {
            pfx = i.match(/^(moz|webkit|ms)/gi);

            if (pfx) {
                return pfx;
            }
        }
    }

    // GLOBAL
    wdw[_plugin] = function() {
        var args = arguments;

        function fn(args) {
            Plugin.apply(this, args);
        }
        fn.prototype = Plugin.prototype;

        new fn(args);
    }
})(window, document);
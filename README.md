# PolygonJS v0.2.0
A script to generate any regular polygon.

## Live Demo
You can see the script running <a href="http://ivanbanov.github.io/PolygonJS/" target="_blank">here</a>.

## Installation
To use the polygonJS you just need add to your project the polygon script and css.
```
<link rel="stylesheet" href="path/polygon.css" />
<script src="path/polygon.js"></script>
```
__NOTE__: PolygonJS runs normally just the css code version. The pre-processor LESS is used just for a faster and easily development.

## Usage

__HTML__
```
<div id="polygon"></div>
```

__SCRIPT__
<br /> Put the script on bottom of your code.
```
<script>
  //polygon(element, sides);
  polygon('#square', 4);
</script>
```

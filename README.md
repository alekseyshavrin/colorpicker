# Colorpicker
Pure javascript color picker with flexible functionality. Only JS and CSS. IE8+

## Documentation

#### Create new object and show colorpicker

```js
new Colorpicker().show()
```

#### Set source color

```js
// Hex model. Full format.
new Colorpicker().set('#35c899').show()

// Hex model. Short format.
new Colorpicker().set('#999').show()

// Rgb model. CSS string.
new Colorpicker().set('rgb(53,136,200)').show()

// Rgb model. Array.
new Colorpicker().set([53,136,200]).show()
```

#### Event listeners

```js
var cp = new Colorpicker().set('rgb(53,136,200)').show();

var body = document.getElementsByTagName('body')[0];

// Listen to a all changes, immediately
cp.on('change', function(color) {
  body.style.backgroundColor = color;
});

// Listen to a click on the apply button
cp.on('apply', function(color) {
  body.style.backgroundColor = color;
});

// Listen to a click on the cancel button or on the close character 'x'
cp.on('cancel', function(color) {
  // Here will be returned source color if it was set early
  if ( color ) {
    body.style.backgroundColor = color;
  }
});
```

#### Custom container instead default

```js
// Element:
var element = document.getElementById('customContainer'),
    cp = new Colorpicker(element).show();

// Or CSS selector:
var cp = new Colorpicker('#customContainer').show();
```

#### Customizable options

```js
var options = {
  theme: 'dark'
};

// Second argument after custom container...
var cp = new Colorpicker('#customContainer', options).show();

// ...or at once first argument
var cp = new Colorpicker(options).show();
```

#### Full list of options

```js
var cp = new Colorpicker({
  theme: 'dark', // Default: 'light'. Possible values: 'light', 'dark'.
  draggable: false, // Default: true
  title: {
    text: 'Custom title', // Default: 'Color'
    use: true // Default: true
  },
  close: {
    use: false // Default: true
  },
  size: 'large', // Default: 'medium'. Possible values: 'small', 'medium', 'large'.
  // Small previews of source and new color
  preview: {
    use: false // Default: true
  },
  btns: {
    apply: {
      text: 'OK', // Default: 'Apply'
      use: true // Default: true
    },
    cancel: {
      text: 'Close', // Default: 'Cancel'
      use: false // Default: true
    }
  },
  returnModel: 'hex' // Default: 'rgb'. Possible values: 'rgb', 'hex'.
});
```

#### Methods and properties

```js
var cp = new Colorpicker();

cp.set( color );

cp.show();

cp.hide();

cp.on( eventName, callback );

cp.getRGB();

cp.getHEX();

// List of all html nodes of picker
cp.markup
```
[Examples](http://modor.ru/)

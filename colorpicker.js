 /*!
  * Colorpicker v0.0.1
  * Copyright Aleksey Shavrin http://modor.ru/
  * Licensed under MIT (https://github.com/alekseyshavrin/colorpicker/blob/master/LICENSE)
  */

 function Colorpicker(a, b) {
	var win = window, doc = win.document;

	if ( !Array.prototype.indexOf ) {
		Array.prototype.indexOf = function(elt) {
			var len = this.length >>> 0,
				from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0) {
				from += len;
			}
			for (; from < len; from++) {
				if ( from in this && this[from] === elt ) {
					return from;
				}
			}
			return -1;
		};
	}

	var E = (function() {
		var list = {};
		return {
			on: function(node, eventName, callback) {
				if ( node.addEventListener ) {
					node.addEventListener(eventName, callback, false);
				} else if ( node.attachEvent ) {
					node.attachEvent('on'+eventName, callback);
				}
			},
			register: function(eventName, handler) {
				if ( !list[eventName] || !list[eventName].length ) {
					list[eventName] = [handler];
				} else {
					list[eventName].push(handler);
				}
			},
			trigger: function(eventName, data) {
				if ( list[eventName] && list[eventName].length ) {
					for ( var i = 0; i < list[eventName].length; i++ ) {
						list[eventName][i](data);
					}
				}
			},
			preventDefault: function(e) {
				e.preventDefault ? e.preventDefault() : (e.returnValue = false);
			},
			getTarget: function(e) {
				return e.target || e.srcElement;
			}
		};
	})();

	var N = {
		query: function(selector, all) {
			return 	all === true ? 	doc.querySelectorAll(selector) : doc.querySelector(selector);
		},
		fullOffset: function(el) {
			var o = {x: el.offsetLeft, y: el.offsetTop};
			re(el);
			function re(el) {
				if ( el.offsetParent ) {
					o.x += el.offsetParent.offsetLeft;
					o.y += el.offsetParent.offsetTop;
					re(el.offsetParent);
				}
			}
			return o;
		},
	};

	var C = {
		toRgbString: function(rgb) {
			return 'rgb('+ rgb.join(',') +')';
		},
		customToHsv: function(custom) {
			if ( custom instanceof Array ) {
				return this.rgbToHsv(custom);
			} else if ( typeof custom === 'string' ) {
				var regexRgb = /^rgb[a]{0,1}\(([\d]{1,3}),[\s]{0,1}([\d]{1,3}),[\s]{0,1}([\d]{1,3})[,.\s\d]*\)$/,
					regexHex = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/;
				if ( custom.match(regexRgb) ) {
					var result = custom.match(regexRgb);
					return this.rgbToHsv([+result[1], +result[2], +result[3]]);
				} else if ( custom.match(regexHex) ) {
					return this.rgbToHsv(this.hexToRgb(custom));
				}
			}
			return [];
		},
		hsvToRgb: function(hsv) {
			var r, g, b, i, f, p, q, t, h = hsv[0]/360, s = hsv[1]/100, v = hsv[2]/100;			
			i = Math.floor(h * 6);
			f = h * 6 - i;
			p = v * (1 - s);
			q = v * (1 - f * s);
			t = v * (1 - (1 - f) * s);
			switch (i % 6) {
				case 0: r = v, g = t, b = p; break;
				case 1: r = q, g = v, b = p; break;
				case 2: r = p, g = v, b = t; break;
				case 3: r = p, g = q, b = v; break;
				case 4: r = t, g = p, b = v; break;
				case 5: r = v, g = p, b = q; break;
			}
			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		},
		rgbToHsv: function(rgb) {
			var r = rgb[0], g = rgb[1], b = rgb[2];
			r /= 255, g /= 255, b /= 255;

			var rr, gg, bb,
				h, s,
				v = Math.max(r, g, b),
				diff = v - Math.min(r, g, b),
				diffc = function(c) {
					return (v - c) / 6 / diff + 1 / 2;
				};

			if (diff == 0) {
				h = s = 0;
			} else {
				s = diff / v;
				rr = diffc(r);
				gg = diffc(g);
				bb = diffc(b);

				if (r === v) {
					h = bb - gg;
				} else if (g === v) {
					h = (1 / 3) + rr - bb;
				} else if (b === v) {
					h = (2 / 3) + gg - rr;
				}
				if (h < 0) {
					h += 1;
				} else if (h > 1) {
					h -= 1;
				}
			}
			return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
		},
		hexToRgb: function(hex) {
		    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		    	return r + r + g + g + b + b;
		    });
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
		},
		rgbToHex: function(rgb) {
		    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
		}
	};

	function CP() {
		this.config = {
			theme: {
				dflt: 'light',
				valid: ['light', 'dark']
			},
			draggable: {
				dflt: true,
				valid: [true, false]
			},
			title: {
				text: {
					dflt: 'Color'
				},
				use: {
					dflt: true,
					valid: [true, false]
				}
			},
			close: {
				use: {
					dflt: true,
					valid: [true, false]
				}
			},
			size: {
				dflt: 'medium',
				valid: ['small', 'medium', 'large']
			},
			preview: {
				use: {
					dflt: true,
					valid: [true, false]
				}
			},
			btns: {
				apply: {
					text: {
						dflt: 'Apply'
					},
					use: {
						dflt: true,
						valid: [true, false]
					}
				},
				cancel: {
					text: {
						dflt: 'Cancel'
					},
					use: {
						dflt: true,
						valid: [true, false]
					}
				}
			},
			returnModel: {
				dflt: 'rgb',
				valid: ['rgb', 'hex']
			}			
		};
		this.construct = function() {
			this.setDefaultState(), this.prepareOptions(), this.createMarkup(), this.initEvents(), this.options.preview.use === true && this.preparePreview();
		};
		this.setDefaultState = function() {
			this.state = {
				isShown: false,
				hsv: [360,0,100],
				setHsv: undefined
			};
		};
		this.prepareOptions = function() {
			var custom = (a && !(a instanceof Element) && typeof a === 'object') ? a : ( (a && b && typeof b === 'object') ? b : {} ),
				build = {};
			recursive(this.config, build, custom);
			this.options = build;
			function recursive(root, build, custom) {
				for (prop in root) {
					if ( root[prop].hasOwnProperty('dflt') ) {
						if ( custom.hasOwnProperty(prop) && ( !root[prop].hasOwnProperty('valid') || root[prop].valid.indexOf(custom[prop]) !== -1 ) ) {
							build[prop] = custom[prop];
						} else {
							build[prop] = root[prop].dflt;
						}						
					} else {
						build[prop] = {};
						if ( custom !== undefined && custom.hasOwnProperty(prop) ) {
							recursive(root[prop], build[prop], custom[prop]);
						} else {
							recursive(root[prop], build[prop], {});
						}						
					}					
				}
			}			
		};
		this.createMarkup = function() {
			this.markup = {};
			this.markup.container = a instanceof Element ? a : ( typeof a === 'string' && N.query(a) instanceof Element ? N.query(a) : undefined );

			var themeClass = ' colorpicker-' + this.options.theme + '-theme',
				wrapperClass = 'colorpicker-wrapper colorpicker-'+ this.options.size;

			if ( !this.markup.container ) {
				this.markup.container = _({name: 'container', cls: 'colorpicker-default-container' + themeClass});
				this.isDefaultContainer = true;
			} else {
				wrapperClass += themeClass;
			}

			_({name: 'wrapper', cls: wrapperClass});

			if ( this.options.title.use === true || this.options.close.use === true ) {
				_({name: 'header', to: 'wrapper', cls: 'colorpicker-header' });

				if ( this.options.draggable === true && this.isDefaultContainer === true ) {
					this.markup.header.className += ' colorpicker-draggable';
				}

				if ( this.options.title.use === true ) {
					_({name: 'title', to: 'header', cls: 'colorpicker-title', text: this.options.title.text});
				}

				if ( this.options.close.use === true ) {
					_({name: 'close', to: 'header', cls: 'colorpicker-close', text: 'x'});
				}
			}

			_({name: 'body', 		to: 'wrapper', 	cls: 'colorpicker-body'			});
			_({name: 'map', 		to: 'body', 	cls: 'colorpicker-map'			});
			_({name: 'mapLight', 	to: 'map', 		cls: 'colorpicker-map-light'	});
			_({name: 'mapDark', 	to: 'map', 		cls: 'colorpicker-map-dark'		});
			_({name: 'mapPointer', 	to: 'map', 		cls: 'colorpicker-map-pointer'	});
			_({name: 'hue', 		to: 'body', 	cls: 'colorpicker-hue'			});
			_({name: 'hue360_300', 	to: 'hue', 		cls: 'colorpicker-hue-360_300'	});
			_({name: 'hue300_240', 	to: 'hue', 		cls: 'colorpicker-hue-300_240'	});
			_({name: 'hue240_180', 	to: 'hue', 		cls: 'colorpicker-hue-240_180'	});
			_({name: 'hue180_120', 	to: 'hue', 		cls: 'colorpicker-hue-180_120'	});
			_({name: 'hue120_60', 	to: 'hue', 		cls: 'colorpicker-hue-120_60'	});
			_({name: 'hue60_0', 	to: 'hue', 		cls: 'colorpicker-hue-60_0'		});
			_({name: 'huePointer', 	to: 'hue', 		cls: 'colorpicker-hue-pointer'	});			

			if ( this.options.preview.use === true || this.options.btns.apply.use === true || this.options.btns.cancel.use === true ) {
				_({name: 'footer', to: 'wrapper', cls: 'colorpicker-footer'		});
			}

			if ( this.options.preview.use === true ) {
				_({name: 'preview', to: 'footer', cls: 'colorpicker-preview'});
				_({name: 'currentColor', to: 'preview', cls: 'colorpicker-preview-color', tag: 'span'});
				_({name: 'newColor', to: 'preview', cls: 'colorpicker-preview-color', tag: 'span'});
			}

			if ( this.options.btns.apply.use === true ) {
				_({name: 'apply', to: 'footer', cls: 'colorpicker-btn colorpicker-apply', tag: 'button', text: this.options.btns.apply.text});
			}
			if ( this.options.btns.cancel.use === true ) {
				_({name: 'cancel', to: 'footer', cls: 'colorpicker-btn colorpicker-cancel', tag: 'button', text: this.options.btns.cancel.text});
			}

			function _(obj) {
				cp.markup[obj.name] = doc.createElement(obj.tag || 'div');
				obj.cls && cp.markup[obj.name].setAttribute('class', obj.cls);
				obj.to && cp.markup[ obj.to ].appendChild(cp.markup[obj.name]);
				obj.text && (cp.markup[obj.name].innerText = obj.text);
				return cp.markup[obj.name];
			}
		};
		this.initEvents = function() {
			var mouseDown = {
				state: false,
				targetKey: undefined,
				x: undefined,
				y: undefined
			};
			E.on(win, 'resize', function() {
				cp.state.isShown && cp.isDefaultContainer === true && cp.align();
			});
			E.on(doc, 'mouseup', function() {
				mouseDown.state = false, mouseDown.targetKey = mouseDown.x = mouseDown.y = undefined;
			});
			E.on(this.markup.map, 'mousedown', function(e) {
				E.preventDefault(e);
				mouseDown.state = true;
				mouseDown.targetKey = 'map';
				cp.changeMap(e);
			});
			E.on(this.markup.wrapper, 'selectstart', function(e) {
				E.preventDefault(e);
			});
			E.on(doc, 'mousemove', function(e) {
				if ( mouseDown.state === false ) {
					return;
				}
				switch (mouseDown.targetKey) {
					case 'map': cp.changeMap(e); break;
					case 'hue': cp.changeHue(e); break;
					case 'header': cp.drag(e, mouseDown); break;
				}
			});
			E.on(this.markup.hue, 'mousedown', function(e) {
				E.preventDefault(e);
				mouseDown.state = true;
				mouseDown.targetKey = 'hue';
				cp.changeHue(e);
			});
			if ( this.options.draggable === true && this.isDefaultContainer === true ) {
				E.on(this.markup.header, 'mousedown', function(e) {
					E.preventDefault(e);
					mouseDown.state = true;
					mouseDown.targetKey = 'header';
					mouseDown.x = e.clientX;
					mouseDown.y = e.clientY;
				});
			}
			if ( this.options.close.use === true ) {
				E.on(this.markup.close, 'click', function() {
					E.trigger('cancel', cp.getCancelColor() );
					cp.hide();
				});
			}
			if ( this.options.btns.apply.use === true ) {
				E.on(this.markup.apply, 'click', function() {
					E.trigger('apply', cp.getApplyColor());
					cp.hide();
				});
			}
			if ( this.options.btns.cancel.use === true ) {
				E.on(this.markup.cancel, 'click', function() {
					E.trigger('cancel', cp.getCancelColor() );
					cp.hide();
				});
			}
		};
		this.preparePreview = function() {
			this.preview = {
				currentColor: {
					rgb: [],
					isShown: false
				},
				newColor: {
					rgb: [],
					isShown: false
				}
			};
			this.markup.currentColor.style.display = 'none';
			this.markup.currentColor.style.backgroundColor = '';
			this.markup.newColor.style.display = 'none';
			this.markup.newColor.style.backgroundColor = '';
		};
		this.setPreviewCurrentColor = function(rgb) {
			if ( this.preview.currentColor.isShown === false ) {
				this.preview.currentColor.isShown = true;
				this.markup.currentColor.style.display = '';
			}
			this.markup.currentColor.style.backgroundColor = this.toRgbString(rgb);
		};
		this.setPreviewNewColor = function(rgb) {
			if ( this.preview.newColor.isShown === false ) {
				this.preview.newColor.isShown = true;
				this.markup.newColor.style.display = '';
			}
			this.markup.newColor.style.backgroundColor = this.toRgbString(rgb);
		};
		this.resetPreviewNewColor = function() {
			this.markup.newColor.style.display = 'none';
			this.markup.newColor.style.backgroundColor = '';
			this.preview.newColor.isShown = false;
		};		
		this.show = function() {
			if ( this.state.isShown === false ) {
				this.markup.container.appendChild(this.markup.wrapper);
				if ( this.isDefaultContainer === true ) {
					doc.getElementsByTagName('body')[0].appendChild(this.markup.container);
					 this.isDefaultContainer === true && this.align();
				}
				this.state.isShown = true;
				this.applyStateHsv();
			}
		};
		this.align = function() {
			var width = win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
				height = win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight;
			this.markup.container.style.left = Math.round((width - this.markup.container.clientWidth)/2) + 'px';
			this.markup.container.style.top = Math.round((height - this.markup.container.clientHeight)/2) + 'px';
		};
		this.applyStateHsv = function() {
			if ( this.state.setHsv !== undefined ) {
				this.state.hsv = this.state.setHsv;

				if ( this.options.preview.use === true ) {
					this.setPreviewCurrentColor( this.hsvToRgb(this.state.hsv) );
					if ( this.preview.newColor.isShown === true ) {
						this.resetPreviewNewColor();
					}
				}
			}
			this.moveMapPointer({hsv: this.state.hsv}), this.moveHuePointer({hue: this.state.hsv[0]}), this.setHueToMap(this.state.hsv[0]);
		};
		this.hide = function() {
			if ( this.state.isShown === true ) {
				if ( this.isDefaultContainer === true ) {
					this.markup.container.parentNode && doc.getElementsByTagName('body')[0].removeChild(this.markup.container);
				} else {
					this.markup.wrapper.parentNode && this.markup.container.removeChild(this.markup.wrapper);
				}
				this.setDefaultState();
				if ( this.options.preview.use === true ) {
					this.preparePreview();
				}
			}
		};
		this.setHueToMap = function(hue) {
			this.markup.map.style.backgroundColor = this.toRgbString( this.hsvToRgb([hue,100,100]) );
		};		
		this.drag = function(e, mouseDown) {
			var pos = N.fullOffset(this.markup.container),
				width = win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
				height = win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight;

			var x = pos.x + (e.clientX - mouseDown.x),
				y = pos.y + (e.clientY - mouseDown.y),
				minX = 0,
				maxX = width - this.markup.container.clientWidth,
				minY = 0,
				maxY = height - this.markup.container.clientHeight;			

			x < minX && (x = minX), x > maxX && (x = maxX);
			y < minY && (y = minY), y > maxY && (y = maxY);

			mouseDown.x += x - pos.x;
			mouseDown.y += y - pos.y;

			cp.markup.container.style.left = x + 'px';
			cp.markup.container.style.top = y + 'px';
		};
		this.changeMap = function(e) {
			var pos = N.fullOffset(this.markup.map),
				x = e.clientX - pos.x,
				y = e.clientY - pos.y,
				minX = 0,
				maxX = this.markup.map.clientWidth,
				minY = 0,
				maxY = this.markup.map.clientHeight;

			x < minX && (x = minX), x > maxX && (x = maxX);
			y < minY && (y = minY), y > maxY && (y = maxY);

			var h = this.state.hsv[0],
				s = Math.round(x/(this.markup.map.clientWidth/100)),
				v = Math.round(100 - y/(this.markup.map.clientHeight/100));
			this.moveMapPointer({xy: [x, y]});
			this.changeHsv([h, s, v]);
		};
		this.moveMapPointer = function(data) {
			var top, left;

			if ( data.hsv !== undefined ) {
				top = Math.round((this.markup.map.clientHeight/100)*(100 - data.hsv[2])),
				left = Math.round((this.markup.map.clientWidth/100)*(data.hsv[1]));
			} else if ( data.xy !== undefined ) {
				top = data.xy[1];
				left = data.xy[0];
			}
			this.markup.mapPointer.style.top = top - Math.round(this.markup.mapPointer.clientHeight/2) +'px';
			this.markup.mapPointer.style.left = left - Math.round(this.markup.mapPointer.clientWidth/2) +'px';			
			if ( top > this.markup.map.clientHeight/2 ) {
				this.markup.mapPointer.style.borderColor = 'rgb(255,255,255)';
			} else if ( this.markup.mapPointer.style.borderColor ) {
				this.markup.mapPointer.style.borderColor = '';
			}
		};
		this.changeHsv = function(hsv) {
			var rgb = this.hsvToRgb(hsv);
			this.state.hsv = hsv;
			this.options.preview.use === true && this.setPreviewNewColor(rgb);
			var color = this.options.returnModel === 'hex' ? this.rgbToHex(rgb) : this.toRgbString(rgb);
			E.trigger('change', color);
		};
		this.changeHue = function(e) {
			var pos = N.fullOffset(this.markup.hue),
				y = e.clientY - pos.y,
				min = 0,
				max = this.markup.hue.clientHeight,
				h;			
			y < min && (y = min), y > max && (y = max);
			h = Math.round(360 - y/(this.markup.hue.clientHeight/360));
			this.moveHuePointer({y: y}), this.setHueToMap(h), this.changeHsv([h, this.state.hsv[1], this.state.hsv[2]]);
		};
		this.moveHuePointer = function(data) {
			var top;
			if ( data.hue !== undefined ) {
				top = Math.round((this.markup.hue.clientHeight/100)*(100 - data.hue*100/360));
			} else if ( data.y !== undefined ) {
				top = data.y;
			}
			this.markup.huePointer.style.top = top - Math.round(this.markup.huePointer.clientHeight/2) +'px';
		};
		this.set = function(custom) {
			var hsv = this.customToHsv(custom);
			if ( hsv && hsv instanceof Array && hsv.length === 3 ) {
				this.state.setHsv = hsv;
				if ( this.state.isShown === true ) {
					this.applyStateHsv();
				}
			}
		};
		this.getApplyColor = function() {
			return this.hsvToReturnModel(this.state.hsv);
		};
		this.getCancelColor = function() {
			return this.state.setHsv ? this.hsvToReturnModel(this.state.setHsv) : undefined;
		};
		this.hsvToReturnModel = function(hsv) {
			return this.options.returnModel === 'hex' ? this.rgbToHex( this.hsvToRgb(hsv) ) : this.toRgbString( this.hsvToRgb(hsv) );
		};
	}

	CP.prototype = C;
	var cp = new CP();
	cp.construct();
	this.markup = cp.markup;
	this.show 	= function() {cp.show(); return this};
	this.hide 	= function() {E.trigger('cancel', cp.getCancelColor()); cp.hide(); return this};
	this.set 	= function(data) {cp.set(data); return this};
	this.getRGB = function() {return cp.toRgbString( cp.hsvToRgb(cp.state.hsv) )};
	this.getHEX = function() {return cp.rgbToHex( cp.hsvToRgb(cp.state.hsv) )};
	this.on 	= function(eventName, handler) {E.register(eventName, handler); return this};
}

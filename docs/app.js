"use strict";function _slicedToArray(arr,i){return _arrayWithHoles(arr)||_iterableToArrayLimit(arr,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(arr,i){if(!(Symbol.iterator in Object(arr)||Object.prototype.toString.call(arr)==="[object Arguments]")){return}var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i["return"]!=null)_i["return"]()}finally{if(_d)throw _e}}return _arr}function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}function _toConsumableArray(arr){return _arrayWithoutHoles(arr)||_iterableToArray(arr)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(iter){if(Symbol.iterator in Object(iter)||Object.prototype.toString.call(iter)==="[object Arguments]")return Array.from(iter)}function _arrayWithoutHoles(arr){if(Array.isArray(arr)){for(var i=0,arr2=new Array(arr.length);i<arr.length;i++){arr2[i]=arr[i]}return arr2}}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable});keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){_defineProperty(target,key,source[key])})}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source))}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})}}return target}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _typeof(obj){"@babel/helpers - typeof";if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj}}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj}}return _typeof(obj)}!function(t){var e={};function r(a){if(e[a])return e[a].exports;var n=e[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=e,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==_typeof(t)&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t){r.d(a,n,function(e){return t[e]}.bind(null,n))}return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e){var r=function(){function t(){}return t.prototype=_objectSpread({},t.prototype,{flatten:function flatten(t){return t.reduce(function(t,e){return t.concat(e)},[])},form2dCol:function form2dCol(t){return t.map(function(t){return[t]})},form2dRow:function form2dRow(t){return[t]},create:function create(t,e){return new Array(t).fill(0).map(function(t){return new Array(e).fill(0)})},identity:function identity(t){var e=this.create(t,t);return e.forEach(function(t,e){return t[e]=1}),e},transpose:function transpose(t){var e=this.create(t[0].length,t.length);return t.forEach(function(t,r){t.forEach(function(t,a){e[a][r]=t})}),e},add:function add(t,e){if(t.length===e.length&&t[0].length===e[0].length)return"number"==typeof t[0]?t.map(function(t,r){return t+e[r]}):t.map(function(t,r){return t.map(function(t,a){return t+e[r][a]})});console.error("Error! Matrices must be same size!")},multiply:function multiply(t,e){if("number"==typeof e)return"number"==typeof t[0]?t.map(function(t){return t*e}):t.map(function(t){return t.map(function(t){return t*e})});if(t[0].length!==e.length)return void console.error("Error! Matrices are incorrect size!");e[0]instanceof Array||(e=this.form2dCol(e));var r=this.create(t.length,e[0].length);return t.forEach(function(a,n){e[0].forEach(function(a,o){r[n][o]=e.reduce(function(r,a,i){return r+t[n][i]*e[i][o]},0)})}),r},isometric:function isometric(){return this.axonometric(180*Math.asin(Math.tan(30*Math.PI/180))/Math.PI,45,0)},axonometric:function axonometric(t,e,r){var a=arguments.length>3&&arguments[3]!==undefined?arguments[3]:3;var n=[t,e,r].map(function(t){return t*Math.PI/180}),o=this.identity(a),i=this.identity(a),s=this.identity(a);return o[1][1]=Math.cos(n[0]),o[1][2]=Math.sin(n[0]),o[2][1]=-Math.sin(n[0]),o[2][2]=Math.cos(n[0]),i[0][0]=Math.cos(n[1]),i[0][2]=-Math.sin(n[1]),i[2][0]=Math.sin(n[1]),i[2][2]=Math.cos(n[1]),s[0][0]=Math.cos(n[2]),s[0][1]=Math.sin(n[2]),s[1][0]=-Math.sin(n[2]),s[1][1]=Math.cos(n[2]),this.multiply(this.multiply(o,i),s)},crossProduct:function crossProduct(t,e){if(t[0]instanceof Array&&(t=this.flatten(t)),e[0]instanceof Array&&(e=this.flatten(e)),t.length===e.length)return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]];console.error("Error! Vectors must be same size!")},dotProduct:function dotProduct(t,e){if(t[0]instanceof Array&&(t=this.flatten(t)),e[0]instanceof Array&&(e=this.flatten(e)),t.length===e.length)return t.reduce(function(r,a,n){return r+t[n]*e[n]},0);console.error("Error! Vectors must be same size!")},translate:function translate(t){var r=[];for(var _len=arguments.length,e=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){e[_key-1]=arguments[_key]}return t.forEach(function(t){r.push(t.slice())}),e.forEach(function(t,e){r[e][3]+=t}),r},translation:function translation(){var e=this.identity(4);for(var _len2=arguments.length,t=new Array(_len2),_key2=0;_key2<_len2;_key2++){t[_key2]=arguments[_key2]}return t.forEach(function(t,r){e[r][3]=t}),e},rotation:function rotation(){for(var _len3=arguments.length,t=new Array(_len3),_key3=0;_key3<_len3;_key3++){t[_key3]=arguments[_key3]}t=t.map(function(t){return t*Math.PI/180});var e=[[1,0,0],[0,Math.cos(t[2]),Math.sin(t[2])],[0,-Math.sin(t[2]),Math.cos(t[2])]],r=[[Math.cos(t[1]),0,Math.sin(t[1])],[0,1,0],[-Math.sin(t[1]),0,Math.cos(t[1])]],a=[[Math.cos(t[0]),Math.sin(t[0]),0],[-Math.sin(t[0]),Math.cos(t[0]),0],[0,0,1]];return this.multiply(this.multiply(a,r),e)},rotateAbout:function rotateAbout(t,e,r,a){var n=arguments.length>4&&arguments[4]!==undefined?arguments[4]:3;t*=Math.PI/180;var o=[e,r,a],i=1-Math.cos(t),s=Math.cos(t),h=Math.sin(t),c=this.identity(n);return c[0][0]=i*o[0]*o[0]+s,c[0][1]=i*o[0]*o[1]-h*o[2],c[0][2]=i*o[0]*o[2]+h*o[1],c[1][0]=i*o[1]*o[0]+h*o[2],c[1][1]=i*o[1]*o[1]+s,c[1][2]=i*o[1]*o[2]-h*o[0],c[2][0]=i*o[2]*o[0]-h*o[1],c[2][1]=i*o[2]*o[1]+h*o[0],c[2][2]=i*o[2]*o[2]+s,c},rotateTo:function rotateTo(t,e,r){var a=arguments.length>3&&arguments[3]!==undefined?arguments[3]:3;var n=this.toUnitVector([t,e,r]),o=this.crossProduct([0,0,1],n),i=Math.hypot.apply(Math,_toConsumableArray(o)),s=this.dotProduct([0,0,1],n),h=[[0,-o[2],o[1]],[o[2],0,-o[0]],[-o[1],o[0],0]],c=this.add(this.identity(3),this.add(h,this.multiply(this.multiply(h,h),(1-s)/Math.pow(i,2))));switch(a){case 3:return c;case 4:return[[].concat(_toConsumableArray(c[0]),[0]),[].concat(_toConsumableArray(c[1]),[0]),[].concat(_toConsumableArray(c[2]),[0]),[0,0,0,1]];default:return this.identity(a);}},toUnitVector:function toUnitVector(t){t[0]instanceof Array&&(t=this.flatten(t));var e=Math.hypot.apply(Math,_toConsumableArray(t));return e?this.multiply(t,1/e):new Array(t.length).fill(0)},inverseTranspose:function inverseTranspose(t){if(4===t.length&&(t=this.flatten(t)),16!==t.length)return console.error("We only do inverse on 4\xD74 matrices!"),this.identity(4);var e=t[0],r=t[1],a=t[2],n=t[3],o=t[4],i=t[5],s=t[6],h=t[7],c=t[8],l=t[9],m=t[10],p=t[11],d=t[12],u=t[13],y=t[14],f=t[15],b=e*i-r*o,M=e*s-a*o,v=e*h-n*o,g=r*s-a*i,A=r*h-n*i,P=a*h-n*s,L=c*u-l*d,I=c*y-m*d,x=c*f-p*d,E=l*y-m*u,C=l*f-p*u,S=m*f-p*y,_=1/(b*S-M*C+v*E+g*x-A*I+P*L);return[[(+i*S-s*C+h*E)*_,(-o*S+s*x-h*I)*_,(+o*C-i*x+h*L)*_,(-o*E+i*I-s*L)*_],[(-r*S+a*C-n*E)*_,(+e*S-a*x+n*I)*_,(-e*C+r*x-n*L)*_,(+e*E-r*I+a*L)*_],[(+u*P-y*A+f*g)*_,(-d*P+y*v-f*M)*_,(+d*A-u*v+f*b)*_,(-d*g+u*M-y*b)*_],[(-l*P+m*A-p*g)*_,(+c*P-m*v+p*M)*_,(-c*A+l*v-p*b)*_,(+c*g-l*M+m*b)*_]]},lookAt:function lookAt(t,e,r){var a=this.toUnitVector(this.add(e,this.multiply(t,-1)));if(Math.hypot(a)<1e-6)return console.error("Eye and Center cannot be the same point!"),{x:[1,0,0],y:[0,1,0],z:[0,0,1],rotation:this.identity(4)};var n=this.toUnitVector(this.crossProduct(r,a)),o=this.toUnitVector(this.crossProduct(a,n));return{x:n,y:o,z:a,rotation:this.transpose([[].concat(_toConsumableArray(n),[-this.dotProduct(n,t)]),[].concat(_toConsumableArray(o),[-this.dotProduct(o,t)]),[].concat(_toConsumableArray(a),[-this.dotProduct(a,t)]),[0,0,0,1]])}}}),t}();t.exports=new r},function(t,e,r){t.exports=r(2)},function(t,e,r){r(3),yodasws.page("home").setRoute({template:"pages/home.html",route:"/"})},function(t,e,r){yodasws.page("pageGalaxy").setRoute({template:"pages/galaxy/galaxy.html",route:"/galaxy/"}).on("load",function(){var t=r(4),e=r(0),a=function(){var r=document.querySelector("canvas"),n=r.getContext("webgl");if(!n)return void console.error("No canvas context!");var o=[];function l(t){if(!(t instanceof Array))throw new TypeError("Color must be an array of length 3 or 4");if(3===t.length&&t.push(1),4!==t.length)throw new TypeError("Color must be an array of length 3 or 4");this.color=t,this.rotation=e.identity(3),this.translation=new Array(3).fill(0),this.renderedNormals=[],this.renderedPoints=[],this.pointColors=[],this.indices=[],this.normals=[],this.points=[]}function m(_ref){var t=_ref.x,e=_ref.y,r=_ref.width,a=_ref.height,o=_ref.color;l.call(this,o),this.points=[[t,e,0],[t,e+a,0],[t+a,e+a,0],[t+a,e,0]],this.indices=[1,0,2,3],this.drawType=n.TRIANGLE_STRIP}function p(_ref2){var t=_ref2.r,e=_ref2.thickness,r=_ref2.color,_ref2$n=_ref2.n,a=_ref2$n===void 0?80:_ref2$n;l.call(this,r),this.drawType=n.TRIANGLE_STRIP;var o=0;for(var _r=0;_r<360;_r+=360/a){this.points.push([(t+Math.pow(-1,o%2)*e)*Math.cos(_r*Math.PI/180),(t+Math.pow(-1,o%2)*e)*Math.sin(_r*Math.PI/180),0]),this.indices.push(o++)}this.indices.push(0,1)}function d(_ref3){var t=_ref3.r,e=_ref3.color,_ref3$n=_ref3.n,r=_ref3$n===void 0?80:_ref3$n;l.call(this,e),this.points=[[0,0,0]],this.indices=[0],this.normals=[[0,0,1]],this.drawType=n.TRIANGLE_FAN;var a=0;for(var _e=0;_e<360;_e+=360/r){this.points.push([t*Math.cos(_e*Math.PI/180),t*Math.sin(_e*Math.PI/180),0]),this.normals.push([-1*Math.cos(_e*Math.PI/180+0),-1*Math.sin(_e*Math.PI/180+0),.5]),this.indices.push(++a)}this.indices.push(1)}function u(_ref4){var t=_ref4.r,e=_ref4.thickness,r=_ref4.color,_ref4$n=_ref4.n,a=_ref4$n===void 0?80:_ref4$n,_ref4$inward=_ref4.inward,o=_ref4$inward===void 0?!1:_ref4$inward;l.call(this,r),this.drawType=n.TRIANGLE_STRIP;var i=0;for(var _r2=0;_r2<360;_r2+=360/a){for(var _a=0;_a<2;_a++){this.points.push([t*Math.cos(_r2*Math.PI/180),t*Math.sin(_r2*Math.PI/180),Math.pow(-1,_a%2)*e]),this.indices.push(i++),this.normals.push([Math.cos(_r2*Math.PI/180+(o?0:Math.PI)),Math.sin(_r2*Math.PI/180+(o?0:Math.PI)),0])}}this.indices.push(0,1)}function y(_ref5){var t=_ref5.r,e=_ref5.height,r=_ref5.color,_ref5$inward=_ref5.inward,a=_ref5$inward===void 0?!1:_ref5$inward,_ref5$n=_ref5.n,o=_ref5$n===void 0?80:_ref5$n;l.call(this,r),this.drawType=n.TRIANGLE_FAN,this.points=[[0,0,e]],this.normals=[[0,0,a?1:-1]],this.indices=[0];var i=0;for(var _e2=0;_e2<360;_e2+=360/o){this.points.push([t*Math.cos(_e2*Math.PI/180),t*Math.sin(_e2*Math.PI/180),0]),this.normals.push([Math.cos(_e2*Math.PI/180+(a?0:Math.PI)),Math.sin(_e2*Math.PI/180+(a?0:Math.PI)),0]),this.indices.push(++i)}this.indices.push(1)}function f(_ref6){var t=_ref6.r,e=_ref6.color,_ref6$n=_ref6.n,r=_ref6$n===void 0?55:_ref6$n;l.call(this,e),Object.defineProperties(this,{n:{value:r},r:{get:function get(){return t},set:function set(e){return this.renderedPoints=[],this.points=this.points.map(function(r){return[r[0]/t*e,r[1]/t*e,r[2]/t*e]}),t=e,this}}}),this.drawType=n.TRIANGLE_STRIP,this.indices=[],this.normals=[],this.points=[];var a=0;for(var _e3=0;_e3<=180;_e3+=180/r){var _n=0===_e3||180===_e3?1:r;for(var _o=0;_o<360;_o+=360/_n){if((180!==_e3||180===_e3&&0===_o)&&(this.points.push([t*Math.sin(_e3*Math.PI/180)*Math.cos(_o*Math.PI/180),t*Math.sin(_e3*Math.PI/180)*Math.sin(_o*Math.PI/180),t*Math.cos(_e3*Math.PI/180)]),this.normals.push([Math.sin(_e3*Math.PI/180)*Math.cos(_o*Math.PI/180),Math.sin(_e3*Math.PI/180)*Math.sin(_o*Math.PI/180),Math.cos(_e3*Math.PI/180)])),this.indices.push(a),this.indices.push(Math.max(++a-_n,0)),180===_e3)for(var _t=1;_t<r+2;_t++){this.indices.push(this.points.length-_t),this.indices.push(this.points.length-1)}}}}function b(_ref7){var t=_ref7.r,e=_ref7.l,r=_ref7.color,_ref7$m=_ref7.m,a=_ref7$m===void 0?1:_ref7$m,_ref7$n=_ref7.n,o=_ref7$n===void 0?55:_ref7$n,_ref7$inward=_ref7.inward,i=_ref7$inward===void 0?!1:_ref7$inward;l.call(this,r),this.drawType=n.TRIANGLE_STRIP,this.indices=[],this.normals=[],this.points=[];var s=0;for(var _r3=0;_r3<=e;_r3+=e/a){var _e4=0;for(var _a2=0;_a2<=360;_a2+=360/o){this.points.push([t*Math.sin(_a2*Math.PI/180),t*Math.cos(_a2*Math.PI/180),_r3]),this.normals.push([(i?-1:1)*Math.sin(_a2*Math.PI/180),(i?-1:1)*Math.cos(_a2*Math.PI/180),0]),this.indices.push(s+_e4,o+_e4,s+_e4,o+_e4+s),_e4++}s++}this.indices.push(0,1)}return l.prototype={render:function render(){var _this=this;if(0===this.renderedPoints.length||0===this.renderedNormals.length||0===this.pointColors.length){this.renderedNormals=[],this.renderedPoints=[],this.pointColors=[];var _t2=e.multiply(this.rotation,e.form2dCol([0,0,1]));this.points.forEach(function(a,n){_this.pointColors.push(_this.color),0===_this.normals.length?_this.renderedNormals.push(_t2):_this.renderedNormals.push(e.multiply(_this.rotation,e.form2dCol(_this.normals[n]||[0,0,1]))),_this.renderedPoints.push(e.multiply(e.add(e.multiply(_this.rotation,e.form2dCol(a)),e.form2dCol(_this.translation)),1/r.width/5))})}return this},rotate:function rotate(){return this.rotation=e.rotation.apply(e,arguments),this.renderedPoints=[],this},rotateTo:function rotateTo(t,r,a){return this.rotation=e.rotateTo(t,r,a,3),this.renderedPoints=[],this},rotateAbout:function rotateAbout(t,r,a,n){return this.rotation=e.rotateAbout(t,r,a,n,3),this.renderedPoints=[],this},translate:function translate(t,e,r){return this.translation=[t,e,r],this.renderedPoints=[],this},move:function move(){for(var _len4=arguments.length,t=new Array(_len4),_key4=0;_key4<_len4;_key4++){t[_key4]=arguments[_key4]}return this.translation=this.translation.map(function(e,r){return e+t[r]}),this.renderedPoints=[],this}},m.prototype={__proto__:l.prototype,constructor:m},p.prototype={__proto__:l.prototype,constructor:p},d.prototype={__proto__:l.prototype,constructor:d},u.prototype={__proto__:l.prototype,constructor:u},y.prototype={__proto__:l.prototype,constructor:y},f.prototype={__proto__:l.prototype,constructor:f},b.prototype={__proto__:l.prototype,constructor:b},{Circle:p,Sphere:f,Square:m,Cone:y,Disc:d,Ring:u,Tube:b,addShapes:function addShapes(){o.push.apply(o,arguments)},removeShapes:function removeShapes(){for(var _len5=arguments.length,t=new Array(_len5),_key5=0;_key5<_len5;_key5++){t[_key5]=arguments[_key5]}t.forEach(function(t){var e=o.indexOf(t);-1!==e&&o.splice(e,1)})},draw:function draw(r){if(c.animation.rotate.run){var _a3=c.animation.rotate;_a3.diff=r-_a3.start;var _n2=e.multiply(s[i].rotateAbout,1/Math.hypot.apply(Math,_toConsumableArray(s[i].rotateAbout)));t.setCameraMatrix(e.multiply(e.rotateAbout.apply(e,[_a3.diff/50%360].concat(_toConsumableArray(_n2),[4])),s[i].rotation))}if(c.animation.zoom.run){var _e5=c.animation.zoom;_e5.diff=r-_e5.start,_e5.diff>2e3&&_e5.diff<=1e4?(h.r=(_e5.diff-1e3)/100,t.zoom(_e5.diff/200)):_e5.diff>12e3&&_e5.diff<=22e3?(h.r=(23e3-_e5.diff)/100,t.zoom((24e3-_e5.diff)/200)):_e5.diff>22e3&&(_e5.start=performance.now())}var n=[];o.forEach(function(t){n.push(t.render())}),t.drawScene(n),requestAnimationFrame(a.draw)}}}(),n=(Number.parseInt("90",16),Number.parseInt("a0",16),Number.parseInt("ee",16),Number.parseInt("f0",16),Number.parseInt("ff",16));function o(t,e,r){return(t-e[0])/(e[1]-e[0])*(r[1]-r[0])+r[0]}var i="earth",s={galaxy:{rotate:[75,0,0],camera:[1,0,0],initEye:[0,0,1],center:[0,0,0]},earth:{rotate:[-23.5,15,0],camera:[1,0,0],upLine:[0,1e-5,1],rotateAbout:[0,0,1],initEye:[0,0,1],center:[0,0,0]}};var h;r(5).forEach(function(t,r){var _ref8=t.α&&t.δ?[(t.α[0]+t.α[1]/60+t.α[2]/60/60)/12*Math.PI,(t.δ[0]+t.δ[1]/60+t.δ[2]/60/60)/180*Math.PI]:[null,null,null],_ref9=_slicedToArray(_ref8,2),i=_ref9[0],c=_ref9[1];var l=35*t.d;switch(t.type){case"star":{var _r4=3,_s2=[222/n,184/n,135/n],m=0===t.d?5:3;void 0!==t["b-v"]&&("number"==typeof t["b-v"]&&(_s2=function(t){t<-.4?t=-.4:t>2&&(t=2);var r=Number.parseInt("00",16),a=Number.parseInt("52",16),n=Number.parseInt("9b",16),i=Number.parseInt("b2",16),s=Number.parseInt("ff",16);var h=s;var c=[.4,.7];return t<=c[0]?h=o(t,[-.4,c[0]],[i,s]):t>=c[1]&&(h=o(t,[c[1],2],[s,a])),e.multiply([t>.2?s:o(t,[-.4,.2],[n,s]),h,t<.1?s:o(t,[.1,2],[s,r])],1/s)}(t["b-v"]),_r4=0===t.d?10:5),"red"===t["b-v"]&&(_s2=[1,0,0],_r4=4)),t.d>=16.5&&(l=700,m=3,_r4=5);var p=new a.Sphere({color:_s2,n:m,r:_r4});return p.translate(l*Math.cos(c)*Math.cos(i),l*Math.cos(c)*Math.sin(i),l*Math.sin(c)),a.addShapes(p),void(0===t.d&&(h=p))}case"center":return;case"pole":return void(s.galaxy.upLine=[595*Math.cos(c)*Math.cos(i),595*Math.cos(c)*Math.sin(i),595*Math.sin(c)]);}}),Object.keys(s).forEach(function(t){s[t].c=e.flatten(e.multiply(e.rotateTo.apply(e,_toConsumableArray(s[t].camera).concat([4])),e.form2dCol([].concat(_toConsumableArray(s[t].initEye),[1])))).slice(0,3),console.log("Sam, c:",s[t].c);var r=e.flatten(e.multiply(e.rotateTo.apply(e,_toConsumableArray(s[t].upLine).concat([4])),e.form2dCol([].concat(_toConsumableArray(s[t].initEye),[1])))).slice(0,3);s[t].cp=e.crossProduct(s[t].c.slice(0,3),r.slice(0,3)),s[t].n=e.multiply(e.crossProduct(s[t].c.slice(0,3),s[t].cp.slice(0,3)),-1);var a=e.multiply(e.rotateTo.apply(e,_toConsumableArray(s[t].c.slice(0,3))),[0,1,0]);switch(s[t].rotation=e.multiply(e.axonometric.apply(e,_toConsumableArray(s[t].rotate).concat([4])),e.multiply(e.rotateAbout.apply(e,[180*Math.acos(Math.abs(e.dotProduct(s[t].n,a))/Math.hypot.apply(Math,_toConsumableArray(s[t].n))/Math.hypot.apply(Math,_toConsumableArray(a)))/Math.PI].concat(_toConsumableArray(s[t].c.slice(0,3)),[4])),e.rotateTo.apply(e,_toConsumableArray(s[t].c.slice(0,3)).concat([4])))),s[t].x=e.multiply(s[t].rotation,[1,0,0,1]).splice(0,3),s[t].y=e.multiply(s[t].rotation,[0,1,0,1]).splice(0,3),s[t].z=e.multiply(s[t].rotation,[0,0,1,1]).splice(0,3),t){case"earth":break;default:s[t].rotateAbout=s[t].y;}}),[s[i].c,s[i].cp,s[i].n].forEach(function(t,e){var _ref10;(_ref10=new a.Tube({r:3,l:700,color:new Array(4).fill(0).map(function(t,r){return e%3===r?1:3===r?1:e%3==2&&1===r?1:0}),n:4,m:1})).rotateTo.apply(_ref10,_toConsumableArray(t))});new Array(12).fill(0).map(function(t,e){var r=1400/Math.sqrt(3);new a.Tube({r:1,l:r,color:[1,1,1],n:4,m:1}).rotate(e%3==0?90:0,e%3==1?90:0,e%3==2?90:0).translate(e%3==0?Math.pow(-1,e%2)*r/2:0,e%3==1?Math.pow(-1,e%2)*r/2:0,e%3==2?Math.pow(-1,e%2)*r/2:0).move(e%3==1?-1*r/2:0,e%3==2?-1*r/2:0,e%3==0?-1*r/2:0).move(e%3==2?Math.pow(-1,e%2)*(e<6?-1:1)*r/2:0,e%3==0?Math.pow(-1,e%2)*(e<6?-1:1)*r/2:0,e%3==1?Math.pow(-1,e%2)*(e<6?-1:1)*r/2:0)}),new a.Sphere({r:700,color:[0,0,0,.8],n:20});var c={animation:{}};["rotate","zoom"].forEach(function(t){var e=document.querySelector("[name=\"animate-".concat(t,"\"]"));if(e instanceof HTMLInputElement){c.animation[t]={start:performance.now(),run:e.checked,diff:0};var _r5=c.animation[t];e.addEventListener("change",function(){_r5.start=performance.now()-_r5.diff,_r5.run=e.checked})}}),function(){console.log("Sam, view:",s.earth.rotate),console.log("Sam, view:",s.earth.rotation);var e=document.querySelector("canvas");e.getContext("webgl")?(t.init(e,[0,0,0,1]),t.setAmbientLight([.5,.5,.5]),t.setSpotlightColor([1,1,1]),t.rotateSpotlight(0,90,0),t.zoom(12),t.setCameraMatrix(s[i].rotation),requestAnimationFrame(a.draw)):console.error("Unable to initialize WebGL. Your browser or machine may not support it.")}()})},function(t,e,r){var a=r(0),n={uniformMatrices:{projection:{webglVar:"uProjectionMatrix",type:"uniformMatrix4fv",transpose:!1,mat:[]},camera:{webglVar:"uCameraMatrix",mat:a.flatten(a.identity(4)),type:"uniformMatrix4fv",transpose:!1},normalMatrix:{webglVar:"uNormalMatrix",mat:a.flatten(a.identity(4)),type:"uniformMatrix4fv",transpose:!1},ambientLight:{webglVar:"uAmbientLight",mat:[.5,.5,.5],type:"uniform3fv"},dLightMatrix:{webglVar:"uLightMatrix",mat:a.flatten(a.identity(3)),type:"uniformMatrix3fv",transpose:!1},dLightColor:{webglVar:"uDLightColor",mat:[.3,.7,.3],type:"uniform3fv"}},uniformLocations:{}};var o;t.exports=function(){var t=5;function e(t,e){var r=o.createShader(t);return o.shaderSource(r,e),o.compileShader(r),o.getShaderParameter(r,o.COMPILE_STATUS)?r:(console.error("An error occurred compiling the shaders: "+o.getShaderInfoLog(r)),o.deleteShader(r),null)}function r(e){t=50/e,n.uniformMatrices.projection.mat=a.flatten([[t*o.canvas.height/o.canvas.width,0,0,0],[0,t,0,0],[0,0,-1,0],[0,0,0,1]])}return{rotateCamera:function rotateCamera(){n.uniformMatrices.camera.mat=a.flatten([].concat(_toConsumableArray(a.axonometric.apply(a,arguments).map(function(t){return t.push(0)&&t})),[[0,0,0,1]])),n.uniformMatrices.normalMatrix.mat=a.flatten(a.inverseTranspose(n.uniformMatrices.camera.mat))},setAmbientLight:function setAmbientLight(t){n.uniformMatrices.ambientLight.mat=t},setSpotlightColor:function setSpotlightColor(t){n.uniformMatrices.dLightColor.mat=t},rotateSpotlight:function rotateSpotlight(){n.uniformMatrices.dLightMatrix.mat=a.flatten(a.axonometric.apply(a,arguments))},setCameraMatrix:function setCameraMatrix(t){n.uniformMatrices.camera.mat=a.flatten(t),n.uniformMatrices.normalMatrix.mat=a.flatten(a.inverseTranspose(t))},drawScene:function drawScene(t){o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),0===n.uniformMatrices.projection.mat.length&&r(10),t.forEach(function(t){var e={indices:o.createBuffer(),normals:o.createBuffer()};[{array:t.pointColors,attrib:"vertexColor",numBytes:4},{array:t.renderedPoints,attrib:"vertexPosition",numBytes:3},{array:t.renderedNormals,attrib:"vertexNormal",numBytes:3}].forEach(function(t){o.bindBuffer(o.ARRAY_BUFFER,o.createBuffer()),o.bufferData(o.ARRAY_BUFFER,new Float32Array(a.flatten(t.array)),o.STATIC_DRAW),o.vertexAttribPointer(n.attribLocations[t.attrib],t.numBytes,o.FLOAT,!1,0,0),o.enableVertexAttribArray(n.attribLocations[t.attrib])}),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.indices),o.bufferData(o.ELEMENT_ARRAY_BUFFER,new Uint16Array(t.indices),o.STATIC_DRAW),o.useProgram(n.program),Object.entries(n.uniformMatrices).forEach(function(_ref11){var _o2;var _ref12=_slicedToArray(_ref11,2),t=_ref12[0],e=_ref12[1];(_o2=o)[e.type].apply(_o2,_toConsumableArray([n.uniformLocations[t],e.transpose,e.mat].filter(function(t){return void 0!==t})))}),o.drawElements(t.drawType,t.indices.length,o.UNSIGNED_SHORT,0)})},lookAt:function lookAt(t,e,r){n.uniformMatrices.normalMatrix.mat=a.flatten(a.lookAt(t,e,r).rotation),n.uniformMatrices.camera.mat=a.flatten(a.inverseTranspose(n.uniformMatrices.normalMatrix.mat))},init:function init(t){var _o3;var r=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[1,1,1,1];o=t.getContext("webgl");var a=function(){var t=e(o.VERTEX_SHADER,"\n\t\tattribute vec4 aVertexPosition;\n\t\tattribute vec4 aVertexColor;\n\t\tuniform mat4 uProjectionMatrix;\n\t\tuniform mat4 uCameraMatrix;\n\t\tuniform mat4 uNormalMatrix;\n\t\tvarying highp vec4 vColor;\n\n\t\tuniform mat3 uLightMatrix;\n\t\tvarying highp vec3 vDirectionalVector;\n\n\t\tuniform vec3 uAmbientLight;\n\t\tvarying highp vec3 vAmbientLight;\n\n\t\tuniform vec3 uDLightColor;\n\t\tvarying highp vec3 vDLightColor;\n\n\t\tattribute vec3 aVertexNormal;\n\t\tvarying highp vec3 vTransformedNormal;\n\n\t\tvoid main(void) {\n\t\t\t// Each Point's Projected Position\n\t\t\tgl_Position = uProjectionMatrix * uCameraMatrix * aVertexPosition;\n\n\t\t\tvColor = aVertexColor;\n\t\t\tvAmbientLight = uAmbientLight;\n\t\t\tvDLightColor = uDLightColor;\n\n\t\t\t// Undo Camera Rotation to keep Lighting in constant position\n\t\t\tvTransformedNormal = mat3(uNormalMatrix) * aVertexNormal;\n\n\t\t\tvDirectionalVector = normalize(uLightMatrix * vec3(0, 0, 1));\n\t\t}\n\t"),r=e(o.FRAGMENT_SHADER,"\n\t\tvarying highp vec3 vLighting;\n\t\tvarying highp vec4 vColor;\n\t\tvarying highp vec3 vTransformedNormal;\n\t\tvarying highp vec3 vDirectionalVector;\n\t\tvarying highp vec3 vAmbientLight;\n\t\tvarying highp vec3 vDLightColor;\n\n\t\tvoid main(void) {\n\t\t\t// Directional Light\n\t\t\thighp float directional = max(dot(vTransformedNormal.xyz, vDirectionalVector), 0.0);\n\t\t\t// Apply Lighting on Vertex's Color\n\t\t\thighp vec3 vLighting = vAmbientLight + (vDLightColor * directional);\n\t\t\tgl_FragColor = vColor * vec4(vLighting, 1.0);\n\t\t}\n\t"),a=o.createProgram();if(o.attachShader(a,t),o.attachShader(a,r),o.linkProgram(a),!o.getProgramParameter(a,o.LINK_STATUS))return console.error("Unable to initialize the shader program: "+o.getProgramInfoLog(a)),null;return a}();n.program=a,n.attribLocations={vertexPosition:o.getAttribLocation(a,"aVertexPosition"),vertexNormal:o.getAttribLocation(a,"aVertexNormal"),vertexColor:o.getAttribLocation(a,"aVertexColor")},Object.entries(n.uniformMatrices).forEach(function(_ref13){var _ref14=_slicedToArray(_ref13,2),t=_ref14[0],e=_ref14[1];n.uniformLocations[t]=o.getUniformLocation(a,e.webglVar)}),(_o3=o).clearColor.apply(_o3,_toConsumableArray(r)),o.clearDepth(1),o.enable(o.DEPTH_TEST),o.depthFunc(o.LEQUAL),o.enable(o.BLEND),o.blendFunc(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA),o.blendEquation(o.FUNC_ADD),o.disable(o.CULL_FACE)},zoom:r}}()},function(t){t.exports=JSON.parse("[{\"name\":\"Sol\",\"type\":\"star\",\"b-v\":0.63,\"\u03B1\":[0,0,0],\"\u03B4\":[0,0,0],\"d\":0},{\"name\":\"Sag A*\",\"type\":\"center\",\"\u03B1\":[17,45,40.0409],\"\u03B4\":[-29,0,-28.118],\"d\":27000},{\"name\":\"North Pole\",\"type\":\"pole\",\"\u03B1\":[12,51.4,0],\"\u03B4\":[27.13,0,0],\"d\":27000},{\"name\":\"\u03B1 Centauri\",\"bayer\":\"\u03B1 Cen\",\"type\":\"star\",\"b-v\":0.71,\"\u03B1\":[14,39,36.494],\"\u03B4\":[-60,-50,-2.3737],\"d\":4.365},{\"name\":\"Barnard's Star\",\"type\":\"star\",\"b-v\":1.713,\"\u03B1\":[17,57,48.49803],\"\u03B4\":[4,41,36.2072],\"d\":5.958},{\"name\":\"Luhman 16\",\"type\":\"star\",\"\u03B1\":[10,49,18.723],\"\u03B4\":[-53,-19,-9.86],\"d\":6.516},{\"name\":\"WISE 0855-0714\",\"type\":\"star\",\"\u03B1\":[8,55,10.83],\"\u03B4\":[-7,-14,-42.5],\"d\":7.27},{\"name\":\"Wolf 359\",\"type\":\"star\",\"b-v\":2.034,\"\u03B1\":[10,56,28.99],\"\u03B4\":[7,0,52],\"d\":7.86},{\"name\":\"Lalande 21185\",\"type\":\"star\",\"b-v\":1.444,\"\u03B1\":[11,3,20.194],\"\u03B4\":[35,58,11.5682],\"d\":8.31},{\"name\":\"Sirius\",\"type\":\"star\",\"b-v\":0,\"\u03B1\":[6,45,8.91728],\"\u03B4\":[-16,-42,-58.0171],\"d\":8.6},{\"name\":\"Luyten 726-8\",\"type\":\"star\",\"b-v\":1.87,\"\u03B1\":[1,39,1.54],\"\u03B4\":[-17,-57,-1.8],\"d\":8.73},{\"name\":\"Ross 154\",\"type\":\"star\",\"b-v\":1.76,\"\u03B1\":[18,49,49.36216],\"\u03B4\":[-23,-50,-10.4291],\"d\":9.6},{\"name\":\"Ross 248\",\"type\":\"star\",\"b-v\":1.92,\"\u03B1\":[23,41,55.0361],\"\u03B4\":[44,10,38.825],\"d\":10.29},{\"name\":\"\u03B5 Eridani\",\"bayer\":\"\u03B5 Eri\",\"type\":\"star\",\"b-v\":0.887,\"\u03B1\":[3,32,55.84496],\"\u03B4\":[-9,-27,-29.7312],\"d\":10.475},{\"name\":\"Lacaille 9352\",\"type\":\"star\",\"b-v\":1.5,\"\u03B1\":[23,5,52.03604],\"\u03B4\":[-35,-51,-11.0475],\"d\":10.721},{\"name\":\"Ross 128\",\"type\":\"star\",\"b-v\":1.59,\"\u03B1\":[11,47,44.3969],\"\u03B4\":[0,48,16.4049],\"d\":11.007},{\"name\":\"EZ Aquarii\",\"type\":\"star\",\"b-v\":1.97,\"\u03B1\":[22,38,33.73],\"\u03B4\":[-15,-17,-57.3],\"d\":11.1},{\"name\":\"61 Cygni\",\"type\":\"star\",\"b-v\":1.139,\"\u03B1\":[21,6,53.94],\"\u03B4\":[38,44,57.9],\"d\":11.406},{\"name\":\"Procyon\",\"type\":\"star\",\"b-v\":0.42,\"\u03B1\":[7,39,18.1195],\"\u03B4\":[5,13,29.9552],\"d\":11.46},{\"name\":\"Struve 2398\",\"type\":\"star\",\"b-v\":1.53,\"\u03B1\":[18,42,46.67934],\"\u03B4\":[59,37,49.4724],\"d\":11.5},{\"name\":\"Groombridge 34\",\"type\":\"star\",\"b-v\":1.56,\"\u03B1\":[0,18,22.885],\"\u03B4\":[44,1,22.6373],\"d\":11.62},{\"name\":\"DX Cancri\",\"type\":\"star\",\"b-v\":2.08,\"\u03B1\":[8,29,49.345],\"\u03B4\":[26,46,33.74],\"d\":11.8},{\"name\":\"\u03C4 Ceti\",\"type\":\"star\",\"b-v\":0.72,\"\u03B1\":[1,44,4.08338],\"\u03B4\":[-15,-56,-14.9262],\"d\":11.905},{\"name\":\"\u03B5 Indi\",\"bayer\":\"\u03B5 Ind\",\"type\":\"star\",\"b-v\":1.056,\"\u03B1\":[22,3,21.658],\"\u03B4\":[-56,-47,-9.52],\"d\":11.81},{\"name\":\"GJ 1061\",\"type\":\"star\",\"b-v\":1.9,\"\u03B1\":[3,35,59.69],\"\u03B4\":[-44,-30,-45.3],\"d\":12.04},{\"name\":\"YZ Ceti\",\"type\":\"star\",\"b-v\":1.811,\"\u03B1\":[1,12,30.6368],\"\u03B4\":[-16,-59,-56.3613],\"d\":12.108},{\"name\":\"Luyten's Star\",\"type\":\"star\",\"b-v\":1.571,\"\u03B1\":[7,27,24.4991],\"\u03B4\":[5,13,32.827],\"d\":12.2},{\"name\":\"Teegarden's Star\",\"type\":\"star\",\"b-v\":\"red\",\"\u03B1\":[2,53,0.85],\"\u03B4\":[16,52,53.3],\"d\":12.58},{\"name\":\"SCR 1845-6357\",\"type\":\"star\",\"b-v\":\"red\",\"\u03B1\":[18,45,5.26],\"\u03B4\":[-63,-57,-47.8],\"d\":12.57},{\"name\":\"Kapteyn's Star\",\"type\":\"star\",\"b-v\":1.57,\"\u03B1\":[5,11,50],\"\u03B4\":[-45,-2,-30],\"d\":12.76,\"v\":{\"\u03B1\":6.50508,\"\u03B4\":-5.73084,\"r\":245.2}},{\"name\":\"Lacaille 8760\",\"type\":\"star\",\"b-v\":1.395,\"\u03B1\":[21,17,15.2697],\"\u03B4\":[-38,-52,-2.502],\"d\":12.87},{\"name\":\"Kruger 60\",\"type\":\"star\",\"b-v\":1.65,\"\u03B1\":[22,27,59.4677],\"\u03B4\":[57,41,45.15],\"d\":13.18},{\"name\":\"DEN 1048-3956\",\"type\":\"star\",\"\u03B1\":[10,48,14.64],\"\u03B4\":[-39,-56,-6.24],\"d\":13.15},{\"name\":\"Ross 614\",\"type\":\"star\",\"b-v\":1.72,\"\u03B1\":[6,29,23.401],\"\u03B4\":[-2,-48,-50.32],\"d\":13.36},{\"name\":\"UGPS J0722-0540\",\"type\":\"star\",\"\u03B1\":[7,22,27.29],\"\u03B4\":[-5,-40,-30],\"d\":13.4},{\"name\":\"Wolf 1061\",\"type\":\"star\",\"b-v\":1.57,\"\u03B1\":[16,30,18.0584],\"\u03B4\":[-12,-39,-45.325],\"d\":14.04},{\"name\":\"Wolf 424\",\"type\":\"star\",\"b-v\":1.84,\"\u03B1\":[12,33,17.38],\"\u03B4\":[9,1,15.8],\"d\":14.3},{\"name\":\"Van Maanen's Star\",\"type\":\"star\",\"b-v\":0.546,\"\u03B1\":[0,49,9.89841],\"\u03B4\":[5,23,18.9931],\"d\":14.074},{\"name\":\"Gliese 1\",\"type\":\"star\",\"b-v\":1.46,\"\u03B1\":[0,5,24.4279],\"\u03B4\":[-37,-21,-26.503],\"d\":14.173},{\"name\":\"WISE 1639-6847\",\"type\":\"star\",\"\u03B1\":[16,39,40.83],\"\u03B4\":[-68,-47,-38.6],\"d\":16.1},{\"name\":\"L 1159-16\",\"type\":\"star\",\"b-v\":1.8,\"\u03B1\":[2,0,12.959],\"\u03B4\":[13,3,7.01],\"d\":14.5},{\"name\":\"Gliese 674\",\"type\":\"star\",\"b-v\":1.55,\"\u03B1\":[17,28,39.9455],\"\u03B4\":[-46,-53,-42.6932],\"d\":14.839},{\"name\":\"Gliese 687\",\"type\":\"star\",\"b-v\":1.06,\"\u03B1\":[17,36,25.8999],\"\u03B4\":[68,20,20.909],\"d\":14.77},{\"name\":\"LHS 292\",\"type\":\"star\",\"b-v\":2.1,\"\u03B1\":[10,48,12.6],\"\u03B4\":[-11,-20,-14],\"d\":14.8},{\"name\":\"WISE J0521+1025\",\"type\":\"star\",\"\u03B1\":[5,21,26.349],\"\u03B4\":[10,25,27.41],\"d\":16.3},{\"name\":\"LP 145-141\",\"type\":\"star\",\"b-v\":0.19,\"\u03B1\":[11,45,42.9205],\"\u03B4\":[-64,-50,-29.459],\"d\":15.11},{\"name\":\"G 208-44\",\"type\":\"star\",\"b-v\":\"red\",\"\u03B1\":[16,53,54.492],\"\u03B4\":[44,24,53.41],\"d\":14.81},{\"name\":\"Gliese 876\",\"type\":\"star\",\"b-v\":1.59,\"\u03B1\":[22,53,16.7323],\"\u03B4\":[-14,-15,-49.3034],\"d\":15.25},{\"name\":\"LHS 288\",\"type\":\"star\",\"b-v\":1.82,\"\u03B1\":[10,44,21.32],\"\u03B4\":[-61,-12,-35.44],\"d\":15.77},{\"name\":\"GJ 1022\",\"type\":\"star\",\"b-v\":1.97,\"\u03B1\":[0,6,43.205],\"\u03B4\":[-7,-32,-16.83],\"d\":15.816},{\"name\":\"Groombridge 1618\",\"type\":\"star\",\"b-v\":1.34,\"\u03B1\":[10,11,22.14051],\"\u03B4\":[49,27,15.2567],\"d\":15.89},{\"name\":\"DEN 0255-4700\",\"type\":\"star\",\"\u03B1\":[2,55,3.579],\"\u03B4\":[-47,0,-50.99],\"d\":16.2},{\"name\":\"Gliese 412\",\"type\":\"star\",\"b-v\":1.54,\"\u03B1\":[11,5,28.5777],\"\u03B4\":[43,31,36.394],\"d\":15.81},{\"name\":\"Gliese 832\",\"type\":\"star\",\"b-v\":1.52,\"\u03B1\":[21,33,33.975],\"\u03B4\":[-49,0,-32.4035],\"d\":16.194},{\"name\":\"AD Leonis\",\"type\":\"star\",\"b-v\":1.54,\"\u03B1\":[10,19,36.277],\"\u03B4\":[19,52,12.06],\"d\":16},{\"name\":\"GJ 1005\",\"type\":\"star\",\"b-v\":\"red\",\"\u03B1\":[0,15,28.1109],\"\u03B4\":[-16,-8,-1.6303],\"d\":16.3},{\"name\":\"Betelgeuse\",\"bayer\":\"\u03B1 Ori\",\"type\":\"star\",\"b-v\":1.85,\"\u03B1\":[5,55,10.30536],\"\u03B4\":[7,24,25.4304],\"d\":724},{\"name\":\"Rigel\",\"bayer\":\"\u03B2 Ori\",\"type\":\"star\",\"b-v\":-0.03,\"\u03B1\":[5,14,32.2721],\"\u03B4\":[-8,-12,-5.8981],\"d\":860},{\"name\":\"Rigel\",\"bayer\":\"\u03B3 Ori\",\"type\":\"star\",\"b-v\":-0.03,\"\u03B1\":[5,25,7.86325],\"\u03B4\":[6,20,58.9318],\"d\":250},{\"name\":\"Mintaka\",\"bayer\":\"\u03B4 Ori\",\"type\":\"star\",\"b-v\":-0.22,\"\u03B1\":[5,32,0.40009],\"\u03B4\":[0,-17,-56.7424],\"d\":1200},{\"name\":\"Alnilam\",\"bayer\":\"\u03B5 Ori\",\"type\":\"star\",\"b-v\":-0.18,\"\u03B1\":[5,36,12.8],\"\u03B4\":[-1,-12,-6.9],\"d\":2000},{\"name\":\"Alnitak\",\"bayer\":\"\u03B6 Ori\",\"type\":\"star\",\"b-v\":-0.11,\"\u03B1\":[5,40,45.52666],\"\u03B4\":[-1,-56,-34.2649],\"d\":1260},{\"name\":\"Saiph\",\"bayer\":\"\u03BA Ori\",\"type\":\"star\",\"b-v\":-0.18,\"\u03B1\":[5,47,45.38884],\"\u03B4\":[-9,-40,-10.5777],\"d\":650},{\"name\":\"Dubhe\",\"bayer\":\"\u03B1 UMa\",\"type\":\"star\",\"b-v\":1.07,\"\u03B1\":[11,3,43.67152],\"\u03B4\":[61,45,3.7249],\"d\":123},{\"name\":\"Merak\",\"bayer\":\"\u03B2 UMa\",\"type\":\"star\",\"b-v\":-0.02,\"\u03B1\":[11,1,50.47654],\"\u03B4\":[56,22,56.7339],\"d\":79.7},{\"name\":\"Phecda\",\"bayer\":\"\u03B3 UMa\",\"type\":\"star\",\"b-v\":-0.013,\"\u03B1\":[11,53,49.84732],\"\u03B4\":[53,41,41.135],\"d\":83.2},{\"name\":\"Megrez\",\"bayer\":\"\u03B4 UMa\",\"type\":\"star\",\"b-v\":0.075,\"\u03B1\":[12,15,25.56063],\"\u03B4\":[57,1,57.4156],\"d\":80.5},{\"name\":\"Alioth\",\"bayer\":\"\u03B5 UMa\",\"type\":\"star\",\"b-v\":-0.02,\"\u03B1\":[12,54,1.74959],\"\u03B4\":[55,57,35.3627],\"d\":82.6},{\"name\":\"Mizar\",\"bayer\":\"\u03B6 UMa\",\"type\":\"star\",\"b-v\":0.02,\"\u03B1\":[13,23,55.543],\"\u03B4\":[54,55,31.3],\"d\":82.9},{\"name\":\"Alkaid\",\"bayer\":\"\u03B7 UMa\",\"type\":\"star\",\"b-v\":-0.19,\"\u03B1\":[13,47,32.43776],\"\u03B4\":[49,18,47.7602],\"d\":103.9},{\"name\":\"Polaris\",\"bayer\":\"\u03B1 UMi\",\"type\":\"star\",\"b-v\":0.6,\"\u03B1\":[2,31,47.08],\"\u03B4\":[89,15,50.9],\"d\":431},{\"name\":\"Kochab\",\"bayer\":\"\u03B2 UMi\",\"type\":\"star\",\"b-v\":1.47,\"\u03B1\":[14,50,42.3258],\"\u03B4\":[74,9,19.8142],\"d\":130.9},{\"name\":\"Pherkad\",\"bayer\":\"\u03B3 UMi\",\"type\":\"star\",\"b-v\":0.09,\"\u03B1\":[15,20,43.71604],\"\u03B4\":[71,50,2.4596],\"d\":487},{\"name\":\"\u03B5 Ursae Minoris\",\"bayer\":\"\u03B5 UMi\",\"type\":\"star\",\"b-v\":0.89,\"\u03B1\":[16,45,58.24168],\"\u03B4\":[82,2,14.1233],\"d\":300},{\"name\":\"\u03B6 Ursae Minoris\",\"bayer\":\"\u03B6 UMi\",\"type\":\"star\",\"b-v\":0.04,\"\u03B1\":[15,44,3.5193],\"\u03B4\":[77,47,40.175],\"d\":380},{\"name\":\"Yildun\",\"bayer\":\"\u03B4 UMi\",\"type\":\"star\",\"b-v\":0.02,\"\u03B1\":[17,32,12.99671],\"\u03B4\":[86,35,11.2584],\"d\":172},{\"name\":\"\u03B7 Ursae Minoris\",\"bayer\":\"\u03B7 UMi\",\"type\":\"star\",\"b-v\":0.35,\"\u03B1\":[16,17,30.28696],\"\u03B4\":[75,45,19.1885],\"d\":97},{\"name\":\"Regulus\",\"bayer\":\"\u03B1 Leo\",\"type\":\"star\",\"b-v\":-0.11,\"\u03B1\":[10,8,22.311],\"\u03B4\":[11,58,1.95],\"d\":79.3},{\"name\":\"Denebola\",\"bayer\":\"\u03B2 Leo\",\"type\":\"star\",\"b-v\":0.107,\"\u03B1\":[11,49,3.57834],\"\u03B4\":[14,34,19.409],\"d\":35.9},{\"name\":\"Algieba\",\"bayer\":\"\u03B3 Leo\",\"type\":\"star\",\"b-v\":1.14,\"\u03B1\":[10,19,58.35056],\"\u03B4\":[19,50,29.3468],\"d\":130},{\"name\":\"Zosma\",\"bayer\":\"\u03B4 Leo\",\"type\":\"star\",\"b-v\":0.12,\"\u03B1\":[11,14,6.50142],\"\u03B4\":[20,31,25.3853],\"d\":58.4},{\"name\":\"Asad Australis\",\"bayer\":\"\u03B5 Leo\",\"type\":\"star\",\"b-v\":0.808,\"\u03B1\":[9,45,51.0733],\"\u03B4\":[23,47,27.3208],\"d\":247},{\"name\":\"Chertan\",\"bayer\":\"\u03B8 Leo\",\"type\":\"star\",\"b-v\":-0.02,\"\u03B1\":[11,14,14.40446],\"\u03B4\":[15,25,46.4541],\"d\":165},{\"name\":\"Adhafera\",\"bayer\":\"\u03B6 Leo\",\"type\":\"star\",\"b-v\":0.3,\"\u03B1\":[10,16,41.41597],\"\u03B4\":[23,25,2.3221],\"d\":274},{\"name\":\"\u03B7 Leonis\",\"bayer\":\"\u03B7 Leo\",\"type\":\"star\",\"b-v\":-0.026,\"\u03B1\":[10,7,19.95186],\"\u03B4\":[16,45,45.592],\"d\":1270},{\"name\":\"Rasalas\",\"bayer\":\"\u03BC Leo\",\"type\":\"star\",\"b-v\":1.23,\"\u03B1\":[9,52,48.81654],\"\u03B4\":[26,0,25.0319],\"d\":124.1},{\"name\":\"\u03B9 Leonis\",\"bayer\":\"\u03B9 Leo\",\"type\":\"star\",\"b-v\":0.456,\"\u03B1\":[11,23,55.45273],\"\u03B4\":[10,31,46.2195],\"d\":79},{\"name\":\"\u03C3 Leonis\",\"bayer\":\"\u03C3 Leo\",\"type\":\"star\",\"b-v\":-0.06,\"\u03B1\":[11,21,8.1943],\"\u03B4\":[6,1,45.558],\"d\":210},{\"name\":\"\u03B1 Aquarii\",\"bayer\":\"\u03B1 Aqr\",\"type\":\"star\",\"b-v\":0.971,\"\u03B1\":[22,5,47.03593],\"\u03B4\":[0,19,11.4568],\"d\":520},{\"name\":\"\u03B2 Aquarii\",\"bayer\":\"\u03B2 Aqr\",\"type\":\"star\",\"b-v\":0.84,\"\u03B1\":[21,31,33.53171],\"\u03B4\":[-5,34,16.232],\"d\":540},{\"name\":\"\u03B4 Aquarii\",\"bayer\":\"\u03B4 Aqr\",\"type\":\"star\",\"b-v\":0.05,\"\u03B1\":[22,54,39.0125],\"\u03B4\":[-15,49,14.953],\"d\":113},{\"name\":\"\u03B6 Aquarii\",\"bayer\":\"\u03B6 Aqr\",\"type\":\"star\",\"b-v\":0.4,\"\u03B1\":[22,28,49.90685],\"\u03B4\":[0,1,11.7942],\"d\":92},{\"name\":\"88 Aquarii\",\"bayer\":\"88 Aqr\",\"type\":\"star\",\"b-v\":1.215,\"\u03B1\":[23,9,26.79681],\"\u03B4\":[-21,10,20.6812],\"d\":271},{\"name\":\"\u03BB Aquarii\",\"bayer\":\"\u03BB Aqr\",\"type\":\"star\",\"b-v\":1.641,\"\u03B1\":[22,52,36.87441],\"\u03B4\":[-7,34,46.5542],\"d\":390},{\"name\":\"\u03B5 Aquarii\",\"bayer\":\"\u03B5 Aqr\",\"type\":\"star\",\"b-v\":-0.001,\"\u03B1\":[20,47,40.5526],\"\u03B4\":[-9,29,44.7877],\"d\":208},{\"name\":\"\u03B3 Aquarii\",\"bayer\":\"\u03B3 Aqr\",\"type\":\"star\",\"b-v\":-0.06,\"\u03B1\":[22,21,39.37542],\"\u03B4\":[-1,23,14.4031],\"d\":164}]")}]);
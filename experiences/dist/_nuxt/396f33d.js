(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{1005:function(t,n,e){"use strict";e.r(n);var r=e(983),o=e(974),c={mixins:[r.a],props:{href:{type:String,required:!0},filename:{type:String,default:void 0},text:{type:String,default:"Download"}},computed:{download:function(){var t;return null!==(t=this.filename)&&void 0!==t?t:"results.".concat(this.extension)}},watch:{href:function(t,n){Object(o.h)(n)}},beforeDestroy:function(){Object(o.h)(this.href)}},l=e(38),component=Object(l.a)(c,(function(){var t=this,n=t.$createElement;return(t._self._c||n)("BaseButton",t._b({attrs:{icon:"mdiDownload"}},"BaseButton",Object.assign({},{href:t.href,download:t.download,text:t.text},t.$attrs),!1))}),[],!1,null,null,null);n.default=component.exports;installComponents(component,{BaseButton:e(586).default})},974:function(t,n,e){"use strict";e.d(n,"b",(function(){return d})),e.d(n,"d",(function(){return f})),e.d(n,"a",(function(){return h})),e.d(n,"h",(function(){return w})),e.d(n,"g",(function(){return m})),e.d(n,"e",(function(){return j})),e.d(n,"i",(function(){return v})),e.d(n,"j",(function(){return B})),e.d(n,"k",(function(){return x})),e.d(n,"c",(function(){return y})),e.d(n,"f",(function(){return O})),e.d(n,"l",(function(){return k}));var r=e(85),o=(e(22),e(15)),c=e(6),l=e(2),d=(e(92),e(3),e(41),e(40),e(1050),e(427),e(13),e(1080),e(253),e(28),e(1081),e(64),e(86),e(588),"txt"),f=Object(l.a)({csv:"text/csv",json:"application/json",jsonld:"application/ld+json",nq:"application/n-quads",rq:"application/sparql-query",ttl:"text/turtle",yaml:"application/x-yaml",yml:"application/x-yaml",png:"image/png",jpeg:"image/jpeg",zip:"application/zip"},d,"text/plain;charset=UTF-8");function h(data){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"text/plain";return data instanceof Blob?window.URL.createObjectURL(data):window.URL.createObjectURL(new Blob([data],{type:t}))}function w(t){window.URL.revokeObjectURL(t)}function m(t){return t.stack?t.stack:"object"===Object(c.a)(t)?Object.entries(t).reduce((function(t,n){var e=Object(o.a)(n,2),r=e[0],c=e[1];return"".concat(t).concat(r,": ").concat(c,"\n")}),"ERROR\n").trimRight():t}function j(t,n){return t.toString().padStart(n,"0")}function v(t,n){return t.postMessage(n),new Promise((function(n,e){t.addEventListener("message",(function(t){n(t.data)})),t.addEventListener("error",(function(t){console.error("worker error",t),e(t)})),t.addEventListener("messageerror",(function(t){console.error("worker error",t),e(t)}))}))}var B=function(t,n){return new Promise((function(e){return setTimeout(e,t,n)}))};function x(t,n){return t.size===n.size&&Object(r.a)(t).every((function(t){return n.has(t)}))}function y(t){var i=Math.floor(Math.log(t||1)/Math.log(1024));return"".concat((t/Math.pow(1024,i)).toFixed(2)," ").concat(["B","kB","MB","GB","TB"][i])}function O(t,n){return 1===n?t:"".concat(t,"s")}var k=function(t,title){var content="".concat(title," | ").concat(t.$store.state.config.appName);return{title:title,meta:[{hid:"og:title",property:"og:title",content:content},{hid:"twitter:title",property:"twitter:title",content:content}]}}},983:function(t,n,e){"use strict";e(39),e(60),e(13);var r=e(974);n.a={props:{extension:{type:String,default:r.b,validator:function(t){return Object.keys(r.d).includes(t)}}}}},992:function(t,n,e){"use strict";e.r(n);e(589),e(3),e(1096),e(1097),e(1098),e(1099),e(1100),e(1101),e(1102),e(1103),e(1104),e(1105),e(1106),e(1107),e(1108),e(1109),e(1110),e(1111),e(1112),e(1113),e(1114),e(1115),e(1116),e(1117),e(1118),e(1119);var r=e(983),o=e(974),c={name:"BaseButtonDownloadData",mixins:[r.a],props:{data:{type:[String,Blob,Uint8Array,Array],default:""}},computed:{href:function(){return Object(o.a)(this.data,o.d[this.extension])}}},l=e(38),component=Object(l.a)(c,(function(){var t=this,n=t.$createElement;return(t._self._c||n)("BaseButtonDownload",t._b({},"BaseButtonDownload",Object.assign({},{extension:t.extension,href:t.href},t.$attrs),!1))}),[],!1,null,null,null);n.default=component.exports;installComponents(component,{BaseButtonDownload:e(1005).default})}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[92],{1071:function(t,n,e){e(1573);var r=e(4),o=e(1449);r({target:"String",proto:!0,name:"trimEnd",forced:"".trimEnd!==o},{trimEnd:o})},1072:function(t,n,e){"use strict";var r=e(4),o=e(1574).start;r({target:"String",proto:!0,forced:e(1575)},{padStart:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},1449:function(t,n,e){"use strict";var r=e(460).end,o=e(638);t.exports=o("trimEnd")?function(){return r(this)}:"".trimEnd},1573:function(t,n,e){var r=e(4),o=e(1449);r({target:"String",proto:!0,name:"trimEnd",forced:"".trimRight!==o},{trimRight:o})},1574:function(t,n,e){var r=e(18),o=e(122),c=e(54),d=e(459),f=e(90),l=r(d),h=r("".slice),m=Math.ceil,v=function(t){return function(n,e,r){var d,v,w=c(f(n)),j=o(e),x=w.length,O=void 0===r?" ":c(r);return j<=x||""==O?w:((v=l(O,m((d=j-x)/O.length))).length>d&&(v=h(v,0,d)),t?w+v:v+w)}};t.exports={start:v(!1),end:v(!0)}},1575:function(t,n,e){var r=e(140);t.exports=/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(r)},965:function(t,n,e){"use strict";e.d(n,"b",(function(){return f})),e.d(n,"d",(function(){return l})),e.d(n,"a",(function(){return h})),e.d(n,"g",(function(){return m})),e.d(n,"f",(function(){return v})),e.d(n,"e",(function(){return w})),e.d(n,"h",(function(){return j})),e.d(n,"i",(function(){return x})),e.d(n,"j",(function(){return O})),e.d(n,"c",(function(){return y}));var r=e(86),o=(e(21),e(16)),c=e(6),d=e(2),f=(e(77),e(3),e(42),e(41),e(1044),e(433),e(10),e(1071),e(257),e(28),e(1072),e(66),e(87),e(596),"txt"),l=Object(d.a)({csv:"text/csv",json:"application/json",jsonld:"application/ld+json",nq:"application/n-quads",rq:"application/sparql-query",ttl:"text/turtle",yaml:"application/x-yaml",yml:"application/x-yaml",png:"image/png",jpeg:"image/jpeg",zip:"application/zip"},f,"text/plain;charset=UTF-8");function h(data){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"text/plain";return data instanceof Blob?window.URL.createObjectURL(data):window.URL.createObjectURL(new Blob([data],{type:t}))}function m(t){window.URL.revokeObjectURL(t)}function v(t){return t.stack?t.stack:"object"===Object(c.a)(t)?Object.entries(t).reduce((function(t,n){var e=Object(o.a)(n,2),r=e[0],c=e[1];return"".concat(t).concat(r,": ").concat(c,"\n")}),"ERROR\n").trimRight():t}function w(t,n){return t.toString().padStart(n,"0")}function j(t,n){return t.postMessage(n),new Promise((function(n,e){t.addEventListener("message",(function(t){n(t.data)})),t.addEventListener("error",(function(t){console.error("worker error",t),e(t)})),t.addEventListener("messageerror",(function(t){console.error("worker error",t),e(t)}))}))}var x=function(t,n){return new Promise((function(e){return setTimeout(e,t,n)}))};function O(t,n){return t.size===n.size&&Object(r.a)(t).every((function(t){return n.has(t)}))}function y(t){var i=Math.floor(Math.log(t||1)/Math.log(1024));return"".concat((t/Math.pow(1024,i)).toFixed(2)," ").concat(["B","kB","MB","GB","TB"][i])}},975:function(t,n,e){"use strict";e(39),e(57),e(10);var r=e(965);n.a={props:{extension:{type:String,default:r.b,validator:function(t){return Object.keys(r.d).includes(t)}}}}},997:function(t,n,e){"use strict";e.r(n);var r=e(975),o=e(965),c={mixins:[r.a],props:{href:{type:String,required:!0},filename:{type:String,default:void 0},text:{type:String,default:"Download"}},computed:{download:function(){var t;return null!==(t=this.filename)&&void 0!==t?t:"results.".concat(this.extension)}},watch:{href:function(t,n){Object(o.g)(n)}},beforeDestroy:function(){Object(o.g)(this.href)}},d=e(40),component=Object(d.a)(c,(function(){var t=this,n=t.$createElement;return(t._self._c||n)("BaseButton",t._b({attrs:{icon:"mdiDownload"}},"BaseButton",Object.assign({},{href:t.href,download:t.download,text:t.text},t.$attrs),!1))}),[],!1,null,null,null);n.default=component.exports;installComponents(component,{BaseButton:e(595).default})}}]);
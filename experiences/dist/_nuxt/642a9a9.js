(window.webpackJsonp=window.webpackJsonp||[]).push([[156],{1071:function(t,e,r){r(1573);var n=r(4),o=r(1449);n({target:"String",proto:!0,name:"trimEnd",forced:"".trimEnd!==o},{trimEnd:o})},1072:function(t,e,r){"use strict";var n=r(4),o=r(1574).start;n({target:"String",proto:!0,forced:r(1575)},{padStart:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},1326:function(t,e,r){"use strict";var n=r(21);r(77),r(46),r(87);e.a={props:{hash:{type:String,required:!0}},data:function(){return{progress:!1,refreshPipeline:!0}},watch:{progress:{immediate:!0,handler:function(t){this.$store.commit("experience/setProgress",t)}},"$store.state.fileManager":{immediate:!0,handler:function(t){t&&(this.refreshPipeline=!0)}},"$route.hash":{immediate:!0,handler:function(t){var e=this;t.slice(1)===this.hash&&this.refreshPipeline&&(this.progress=!0,window.setTimeout(Object(n.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.run();case 2:e.refreshPipeline=!1;case 3:case"end":return t.stop()}}),t)}))),500))}}}}},1449:function(t,e,r){"use strict";var n=r(460).end,o=r(638);t.exports=o("trimEnd")?function(){return n(this)}:"".trimEnd},1573:function(t,e,r){var n=r(4),o=r(1449);n({target:"String",proto:!0,name:"trimEnd",forced:"".trimRight!==o},{trimRight:o})},1574:function(t,e,r){var n=r(18),o=r(122),c=r(54),f=r(459),d=r(90),l=n(f),h=n("".slice),m=Math.ceil,v=function(t){return function(e,r,n){var f,v,j=c(d(e)),w=o(r),O=j.length,y=void 0===n?" ":c(n);return w<=O||""==y?j:((v=l(y,m((f=w-O)/y.length))).length>f&&(v=h(v,0,f)),t?j+v:v+j)}};t.exports={start:v(!1),end:v(!0)}},1575:function(t,e,r){var n=r(140);t.exports=/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(n)},1705:function(t,e,r){"use strict";r.r(e);r(10),r(8),r(14),r(3),r(19),r(9),r(20);var n=r(21),o=r(2),c=(r(77),r(120)),f=r(1326),d=r(965);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function h(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var m={mixins:[f.a],props:{sql:{type:String,required:!0}},computed:h(h({},Object(c.c)(["currentDB"])),{},{disabled:function(){return!this.currentDB||!this.sql}}),methods:{run:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.progress=!0,e.next=3,Object(d.i)(1);case 3:try{r=t.currentDB.select(t.sql),t.$emit("update",{result:r})}catch(e){t.$emit("update",{error:e})}finally{t.progress=!1}case 4:case"end":return e.stop()}}),e)})))()}}},v=r(40),component=Object(v.a)(m,(function(){var t=this.$createElement;return(this._self._c||t)("div")}),[],!1,null,null,null);e.default=component.exports},965:function(t,e,r){"use strict";r.d(e,"b",(function(){return d})),r.d(e,"d",(function(){return l})),r.d(e,"a",(function(){return h})),r.d(e,"g",(function(){return m})),r.d(e,"f",(function(){return v})),r.d(e,"e",(function(){return j})),r.d(e,"h",(function(){return w})),r.d(e,"i",(function(){return O})),r.d(e,"j",(function(){return y})),r.d(e,"c",(function(){return x}));var n=r(86),o=(r(21),r(16)),c=r(6),f=r(2),d=(r(77),r(3),r(42),r(41),r(1044),r(433),r(10),r(1071),r(257),r(28),r(1072),r(66),r(87),r(596),"txt"),l=Object(f.a)({csv:"text/csv",json:"application/json",jsonld:"application/ld+json",nq:"application/n-quads",rq:"application/sparql-query",ttl:"text/turtle",yaml:"application/x-yaml",yml:"application/x-yaml",png:"image/png",jpeg:"image/jpeg",zip:"application/zip"},d,"text/plain;charset=UTF-8");function h(data){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"text/plain";return data instanceof Blob?window.URL.createObjectURL(data):window.URL.createObjectURL(new Blob([data],{type:t}))}function m(t){window.URL.revokeObjectURL(t)}function v(t){return t.stack?t.stack:"object"===Object(c.a)(t)?Object.entries(t).reduce((function(t,e){var r=Object(o.a)(e,2),n=r[0],c=r[1];return"".concat(t).concat(n,": ").concat(c,"\n")}),"ERROR\n").trimRight():t}function j(t,e){return t.toString().padStart(e,"0")}function w(t,e){return t.postMessage(e),new Promise((function(e,r){t.addEventListener("message",(function(t){e(t.data)})),t.addEventListener("error",(function(t){console.error("worker error",t),r(t)})),t.addEventListener("messageerror",(function(t){console.error("worker error",t),r(t)}))}))}var O=function(t,e){return new Promise((function(r){return setTimeout(r,t,e)}))};function y(t,e){return t.size===e.size&&Object(n.a)(t).every((function(t){return e.has(t)}))}function x(t){var i=Math.floor(Math.log(t||1)/Math.log(1024));return"".concat((t/Math.pow(1024,i)).toFixed(2)," ").concat(["B","kB","MB","GB","TB"][i])}}}]);
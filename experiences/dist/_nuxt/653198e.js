(window.webpackJsonp=window.webpackJsonp||[]).push([[21,85],{663:function(t,e,n){"use strict";n.d(e,"b",(function(){return f})),n.d(e,"d",(function(){return d})),n.d(e,"a",(function(){return h})),n.d(e,"h",(function(){return m})),n.d(e,"g",(function(){return v})),n.d(e,"e",(function(){return x})),n.d(e,"i",(function(){return w})),n.d(e,"j",(function(){return B})),n.d(e,"k",(function(){return j})),n.d(e,"c",(function(){return y})),n.d(e,"f",(function(){return O})),n.d(e,"l",(function(){return S}));var r=n(87),o=(n(27),n(23)),c=n(5),l=n(2),f=(n(89),n(3),n(46),n(41),n(790),n(412),n(13),n(797),n(396),n(29),n(798),n(65),n(77),n(413),"txt"),d=Object(l.a)({csv:"text/csv",json:"application/json",jsonld:"application/ld+json",nq:"application/n-quads",rq:"application/sparql-query",ttl:"text/turtle",yaml:"application/x-yaml",yml:"application/x-yaml",png:"image/png",jpeg:"image/jpeg",zip:"application/zip"},f,"text/plain;charset=UTF-8");function h(data){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"text/plain";return data instanceof Blob?window.URL.createObjectURL(data):window.URL.createObjectURL(new Blob([data],{type:t}))}function m(t){window.URL.revokeObjectURL(t)}function v(t){return t.stack?t.stack:"object"===Object(c.a)(t)?Object.entries(t).reduce((function(t,e){var n=Object(o.a)(e,2),r=n[0],c=n[1];return"".concat(t).concat(r,": ").concat(c,"\n")}),"ERROR\n").trimRight():t}function x(t,e){return t.toString().padStart(e,"0")}function w(t,e){return t.postMessage(e),new Promise((function(e,n){t.addEventListener("message",(function(t){e(t.data)})),t.addEventListener("error",(function(t){console.error("worker error",t),n(t)})),t.addEventListener("messageerror",(function(t){console.error("worker error",t),n(t)}))}))}var B=function(t,e){return new Promise((function(n){return setTimeout(n,t,e)}))};function j(t,e){return t.size===e.size&&Object(r.a)(t).every((function(t){return e.has(t)}))}function y(t){var i=Math.floor(Math.log(t||1)/Math.log(1024));return"".concat((t/Math.pow(1024,i)).toFixed(2)," ").concat(["B","kB","MB","GB","TB"][i])}function O(t,e){return 1===e?t:"".concat(t,"s")}var S=function(t,title){var content="".concat(title," | ").concat(t.$store.state.config.appName);return{title:title,meta:[{hid:"og:title",property:"og:title",content:content},{hid:"twitter:title",property:"twitter:title",content:content}]}}},678:function(t,e,n){"use strict";n(45),n(66),n(13);var r=n(663);e.a={props:{extension:{type:String,default:r.b,validator:function(t){return Object.keys(r.d).includes(t)}}}}},685:function(t,e,n){"use strict";n.r(e);n(13),n(11),n(15),n(3),n(16),n(12),n(17);var r=n(87),o=n(2),c=n(27),l=(n(89),n(29),n(114),n(73),n(723),n(91));function f(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function d(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}function h(t,e){return m.apply(this,arguments)}function m(){return(m=Object(c.a)(regeneratorRuntime.mark((function t(e,n){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,navigator.share(e,n);case 3:t.next=8;break;case 5:t.prev=5,t.t0=t.catch(0),console.error("navigator.share() failed",t.t0);case 8:case"end":return t.stop()}}),t,null,[[0,5]])})))).apply(this,arguments)}var v={props:{buttonText:{type:String,default:"Share"},title:{type:String,default:""},text:{type:String,default:""},files:{type:Array[File],default:function(){return[]}},fileShare:{type:Boolean,default:!1}},data:function(){return{condition:!this.fileShare||navigator.canShare&&navigator.canShare({files:[new File(["test"],"test.txt")]})}},computed:d(d(d({},Object(l.c)(["config"])),Object(l.b)(["appName","experience"])),{},{experienceTitle:function(){return this.experience(this.$route).title},hashtags:function(){var t=this.experienceTitle,e=Object(r.a)(this.config.hashtags||["hestialabs"]);return t&&e.push(t),e},titleToShare:function(){var title=this.title,t=this.experienceTitle;return title||(t?"".concat(this.appName,": ").concat(t):this.appName)},quoteToShare:function(){var text=this.text,t=this.experienceTitle;if(text)return text;var e="Analyze the data collected on you";return t&&(e+=" by ".concat(t)),"".concat(e,".")},textToShare:function(){return"".concat(this.quoteToShare," ").concat(this.hashtags.map((function(t){return"#".concat(t)})).join(" "))}}),methods:{share:function(){var t=this;return Object(c.a)(regeneratorRuntime.mark((function e(){var n,title,r,o,c,text,l,f;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.hashtags,title=t.titleToShare,r=t.quoteToShare,o=t.textToShare,!(c=t.files).length||navigator.canShare&&navigator.canShare({files:c})){e.next=3;break}throw new Error("Your system does not support sharing files");case 3:return text=r,navigator.canShare&&navigator.canShare({text:text})&&(text=o),l=t.$url(),f={title:title,text:text,url:l,files:c},e.next=9,h(d(d({},f),{},{hashtag:"hestialabs",hashtags:n,via:"HestiaLabs"}),{skype:!1,email:!text,sms:!text,copy:!text,messenger:!text});case 9:case"end":return e.stop()}}),e)})))()}}},x=n(33),w=n(34),B=n.n(w),j=n(644),component=Object(x.a)(v,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("VTooltip",{attrs:{left:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[t.condition?n("BaseButton",t._g(t._b({attrs:{icon:"mdiShare",text:t.buttonText},on:{click:t.share}},"BaseButton",t.$attrs,!1),r)):t._e()]}}])},[t._v(" "),n("span",[t._v("Reset all")])])}),[],!1,null,null,null);e.default=component.exports;B()(component,{BaseButton:n(394).default}),B()(component,{VTooltip:j.a})},692:function(t,e,n){"use strict";n.r(e);n(414),n(3),n(812),n(813),n(814),n(815),n(816),n(817),n(818),n(819),n(820),n(821),n(822),n(823),n(824),n(825),n(826),n(827),n(828),n(829),n(830),n(831),n(832),n(833),n(834),n(835);var r=n(678),o=n(663),c={name:"BaseButtonDownloadData",mixins:[r.a],props:{data:{type:[String,Blob,Uint8Array,Array],default:""}},computed:{href:function(){return Object(o.a)(this.data,o.d[this.extension])}}},l=n(33),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("BaseButtonDownload",t._b({},"BaseButtonDownload",Object.assign({},{extension:t.extension,href:t.href},t.$attrs),!1))}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{BaseButtonDownload:n(714).default})},714:function(t,e,n){"use strict";n.r(e);var r=n(678),o=n(663),c={mixins:[r.a],props:{href:{type:String,required:!0},filename:{type:String,default:void 0},text:{type:String,default:"Download"}},computed:{download:function(){var t;return null!==(t=this.filename)&&void 0!==t?t:"results.".concat(this.extension)}},watch:{href:function(t,e){Object(o.h)(e)}},beforeDestroy:function(){Object(o.h)(this.href)}},l=n(33),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("BaseButton",t._b({attrs:{icon:"mdiDownload"}},"BaseButton",Object.assign({},{href:t.href,download:t.download,text:t.text},t.$attrs),!1))}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{BaseButton:n(394).default})},795:function(t,e,n){"use strict";var r=n(27),o=(n(89),n(796)),c=n.n(o),l=n(663);e.a=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.refName,n=void 0===e?"domToImageNode":e;return{data:function(){return{progress:!1,status:!1,error:!1,blob:null,files:null,extension:"png",filename:"chart.".concat("png")}},methods:{exportImage:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.progress=!0,t.status=!1,t.error=!1,e.prev=3,e.next=6,c.a.toBlob(t.$refs[n],{bgcolor:"white",filter:function(t){return!t.classList||!t.classList.contains("dom-to-image-exclude")}});case 6:t.blob=e.sent,t.files=[new File([t.blob],t.filename,{type:"image/".concat(t.extension)})],e.next=15;break;case 10:e.prev=10,e.t0=e.catch(3),console.error(e.t0),t.error=!0,t.message=Object(l.g)(e.t0);case 15:return e.prev=15,t.progress=!1,t.status=!0,e.finish(15);case 19:case"end":return e.stop()}}),e,null,[[3,10,15,19]])})))()}}}}},799:function(t,e,n){"use strict";n.r(e);var r=n(795),o={mixins:[Object(r.a)()]},c=n(33),l=n(34),f=n.n(l),d=n(837),h=n(645),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),t._v(" "),n("VCol",{staticClass:"dom-to-image-exclude",attrs:{cols:"12"}},[n("BaseButton",t._b({attrs:{icon:"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1)),t._v(" "),n("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1)),t._v(" "),n("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)],2)}),[],!1,null,null,null);e.default=component.exports;f()(component,{BaseButton:n(394).default,BaseButtonDownloadData:n(692).default,BaseButtonShare:n(685).default}),f()(component,{VCol:d.a,VRow:h.a})}}]);
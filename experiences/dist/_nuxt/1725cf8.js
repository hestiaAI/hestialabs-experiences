(window.webpackJsonp=window.webpackJsonp||[]).push([[137,74],{1137:function(e,t,r){"use strict";r(10),r(8),r(14),r(3),r(19),r(9),r(20);var n=r(2),c=r(120);function o(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}t.a={props:{filename:{type:String,required:!0}},computed:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?o(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):o(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(c.c)(["fileManager"]))}},1489:function(e,t,r){"use strict";r(3),r(42),r(41),r(1043),r(432);t.a={computed:{path:function(){return URL.createObjectURL(this.fileManager.fileDict[this.filename])}}}},1546:function(e,t,r){"use strict";r.r(t);var n=r(1137),c=r(1489),o={name:"UnitFileExplorerViewerHtml",mixins:[n.a,c.a]},f=r(40),component=Object(f.a)(o,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("iframe",{attrs:{src:e.path,width:"100%",height:"500px"}})}),[],!1,null,null,null);t.default=component.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[20,11],{1145:function(t,e,r){"use strict";r(31);e.a={methods:{vueMeta:function(title){var content="".concat(title," | ").concat(this.$t("app.name"));return{title:title,meta:[{hid:"og:title",property:"og:title",content:content},{hid:"twitter:title",property:"twitter:title",content:content}]}}}}},1294:function(t,e,r){"use strict";var n=r(275),c=r(450),o=r(274),l=r(196),f=r(81),v=r(154);var O=function(object,path,t,e){if(!Object(f.a)(object))return object;for(var r=-1,n=(path=Object(o.a)(path,object)).length,O=n-1,j=object;null!=j&&++r<n;){var h=Object(v.a)(path[r]),d=t;if("__proto__"===h||"constructor"===h||"prototype"===h)return object;if(r!=O){var _=j[h];void 0===(d=e?e(_,h,j):void 0)&&(d=Object(f.a)(_)?_:Object(l.a)(path[r+1])?[]:{})}Object(c.a)(j,h,d),j=j[h]}return object};var j=function(object,t,e){for(var r=-1,c=t.length,l={};++r<c;){var path=t[r],f=Object(n.a)(object,path);e(f,path)&&O(l,Object(o.a)(path,object),f)}return l},h=r(452);var d=function(object,t){return j(object,t,(function(t,path){return Object(h.a)(object,path)}))},_=r(449),m=r(113),y=r(178),w=r(54),P=m.a?m.a.isConcatSpreadable:void 0;var D=function(t){return Object(w.a)(t)||Object(y.a)(t)||!!(P&&t&&t[P])};var S=function t(e,r,n,c,o){var l=-1,f=e.length;for(n||(n=D),o||(o=[]);++l<f;){var v=e[l];r>0&&n(v)?r>1?t(v,r-1,n,c,o):Object(_.a)(o,v):c||(o[o.length]=v)}return o};var x=function(t){return(null==t?0:t.length)?S(t,1):[]},C=r(453),k=r(451);var M=function(t){return Object(k.a)(Object(C.a)(t,void 0,x),t+"")}((function(object,t){return null==object?{}:d(object,t)}));e.a=M},1299:function(t,e,r){"use strict";r.r(e);var n=r(412),c=r(333),o=r(410),l=r(261),f=r(411),v=r(269),O=r(1),j=r(18),h=(r(74),r(225),r(11),r(9),r(12),r(4),r(15),r(10),r(16),r(1294));function d(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var _={computed:{bubbles:function(){var t=this.$store.state.config.bubbleConfig||{};return Object.entries(t).map((function(t){var e=Object(j.a)(t,2),r=e[0],n=e[1];return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(e){Object(O.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({slug:r},Object(h.a)(n,["title","icon"]))}))}}},m=_,y=r(50),component=Object(y.a)(m,(function(){var t=this,e=t._self._c;return t.bubbles.length?e("div",[e("h1",{staticClass:"mt-6 mb-4 text-h4"},[e(n.a,{staticClass:"mr-2",attrs:{rounded:"",size:"50"}},[e("img",{attrs:{src:"/data-space.png"}})]),t._v(" "),e("span",[t._v(t._s(t.$tc("Data Space",2)))])],1),t._v(" "),e(o.a,{attrs:{rounded:""}},t._l(t.bubbles,(function(r){var title=r.title,n=r.icon,o=r.slug;return e(l.a,{key:o,attrs:{nuxt:"",to:t.localePath({name:"space-bubble",params:{bubble:o}})}},[e(f.a,{attrs:{tile:""}},[e(c.a,{attrs:{src:n,"lazy-src":n}})],1),t._v(" "),e(v.a,[e(v.c,[t._v(t._s(title))])],1)],1)})),1)],1):t._e()}),[],!1,null,null,null);e.default=component.exports},1431:function(t,e,r){"use strict";r.r(e);var n=r(1129),c={mixins:[r(1145).a],head:function(){return this.vueMeta(this.$tc("Data Space",2))}},o=r(50),component=Object(o.a)(c,(function(){var t=this._self._c;return t(n.a,[t("TheDataSpaceMenu")],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{TheDataSpaceMenu:r(1299).default})}}]);
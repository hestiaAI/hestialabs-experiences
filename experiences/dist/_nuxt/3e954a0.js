(window.webpackJsonp=window.webpackJsonp||[]).push([[158],{1e3:function(t,e,r){"use strict";e.a=function(t,e){for(var r,n=-1,o=t.length;++n<o;){var c=e(t[n]);void 0!==c&&(r=void 0===r?c:r+c)}return r}},1002:function(t,e,r){"use strict";r(22),r(46),r(78);var n=/\s/;var o=function(t){for(var e=t.length;e--&&n.test(t.charAt(e)););return e},c=/^\s+/;var l=function(t){return t?t.slice(0,o(t)+1).replace(c,""):t},f=r(51),d=r(175),h=/^[-+]0x[0-9a-f]+$/i,v=/^0b[01]+$/i,m=/^0o[0-7]+$/i,_=parseInt;e.a=function(t){if("number"==typeof t)return t;if(Object(d.a)(t))return NaN;if(Object(f.a)(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=Object(f.a)(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=l(t);var r=v.test(t);return r||m.test(t)?_(t.slice(2),r?2:8):h.test(t)?NaN:+t}},1003:function(t,e,r){"use strict";var n=r(1002),o=1/0;var c=function(t){return t?(t=Object(n.a)(t))===o||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0};e.a=function(t){var e=c(t),r=e%1;return e==e?r?e-r:e:0}},1040:function(t,e,r){var content=r(1041);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(26).default)("e23b7040",content,!0,{sourceMap:!1})},1041:function(t,e,r){var n=r(25)(!1);n.push([t.i,'.theme--light.v-card{background-color:#fff;color:rgba(0,0,0,.87)}.theme--light.v-card>.v-card__subtitle,.theme--light.v-card>.v-card__text{color:rgba(0,0,0,.6)}.theme--dark.v-card{background-color:#1e1e1e;color:#fff}.theme--dark.v-card>.v-card__subtitle,.theme--dark.v-card>.v-card__text{color:hsla(0,0%,100%,.7)}.v-sheet.v-card{border-radius:4px}.v-sheet.v-card:not(.v-sheet--outlined){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.v-sheet.v-card.v-sheet--shaped{border-radius:24px 4px}.v-card{border-width:thin;display:block;max-width:100%;outline:none;text-decoration:none;transition-property:box-shadow,opacity;word-wrap:break-word;position:relative;white-space:normal}.v-card>.v-card__progress+:not(.v-btn):not(.v-chip):not(.v-avatar),.v-card>:first-child:not(.v-btn):not(.v-chip):not(.v-avatar){border-top-left-radius:inherit;border-top-right-radius:inherit}.v-card>:last-child:not(.v-btn):not(.v-chip):not(.v-avatar){border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.v-card__progress{top:0;left:0;right:0;overflow:hidden}.v-card__subtitle+.v-card__text{padding-top:0}.v-card__subtitle,.v-card__text{font-size:.875rem;font-weight:400;line-height:1.375rem;letter-spacing:.0071428571em}.v-card__subtitle,.v-card__text,.v-card__title{padding:16px}.v-card__title{align-items:center;display:flex;flex-wrap:wrap;font-size:1.25rem;font-weight:500;letter-spacing:.0125em;line-height:2rem;word-break:break-all}.v-card__title+.v-card__subtitle,.v-card__title+.v-card__text{padding-top:0}.v-card__title+.v-card__subtitle{margin-top:-16px}.v-card__text{width:100%}.v-card__actions{align-items:center;display:flex;padding:8px}.v-card__actions>.v-btn.v-btn{padding:0 8px}.v-application--is-ltr .v-card__actions>.v-btn.v-btn+.v-btn{margin-left:8px}.v-application--is-ltr .v-card__actions>.v-btn.v-btn .v-icon--left{margin-left:4px}.v-application--is-ltr .v-card__actions>.v-btn.v-btn .v-icon--right{margin-right:4px}.v-application--is-rtl .v-card__actions>.v-btn.v-btn+.v-btn{margin-right:8px}.v-application--is-rtl .v-card__actions>.v-btn.v-btn .v-icon--left{margin-right:4px}.v-application--is-rtl .v-card__actions>.v-btn.v-btn .v-icon--right{margin-left:4px}.v-card--flat{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)!important}.v-sheet.v-card--hover{cursor:pointer;transition:box-shadow .4s cubic-bezier(.25,.8,.25,1)}.v-sheet.v-card--hover:focus,.v-sheet.v-card--hover:hover{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.v-card--link,.v-card--link .v-chip{cursor:pointer}.v-card--link:focus:before{opacity:.08}.v-card--link:before{background:currentColor;bottom:0;content:"";left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:opacity .2s}.v-card--disabled{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.v-card--disabled>:not(.v-card__progress){opacity:.6;transition:inherit}.v-card--loading{overflow:hidden}.v-card--raised{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}',""]),t.exports=n},1070:function(t,e,r){r(1572);var n=r(4),o=r(1448);n({target:"String",proto:!0,name:"trimEnd",forced:"".trimEnd!==o},{trimEnd:o})},1071:function(t,e,r){"use strict";var n=r(4),o=r(1573).start;n({target:"String",proto:!0,forced:r(1574)},{padStart:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},1123:function(t,e,r){"use strict";var n=r(430),o=r(1e3);e.a=function(t,e){return t&&t.length?Object(o.a)(t,Object(n.a)(e,2)):0}},1138:function(t,e,r){var n=r(4),o=r(74),c=r(177);n({target:"Object",stat:!0},{fromEntries:function(t){var e={};return o(t,(function(t,r){c(e,t,r)}),{AS_ENTRIES:!0}),e}})},1144:function(t,e,r){"use strict";var n=r(4),o=r(610),c=r(67),l=r(76),f=r(88),d=r(267);n({target:"Array",proto:!0},{flatMap:function(t){var e,r=l(this),n=f(r);return c(t),(e=d(r,0)).length=o(e,r,r,n,0,1,t,arguments.length>1?arguments[1]:void 0),e}})},1145:function(t,e,r){r(158)("flatMap")},1184:function(t,e,r){"use strict";r(10),r(8),r(14),r(3),r(19),r(9),r(20);var n=r(2),o=(r(36),r(265),r(1190),r(414)),c=r(268),l=r(47),f=r(135),d=r(442),h=r(37),v=r(0),m=r(11);function _(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var y=Object(m.a)(l.a,Object(f.b)(["absolute","fixed","top","bottom"]),d.a,h.a).extend({name:"v-progress-linear",directives:{intersect:c.a},props:{active:{type:Boolean,default:!0},backgroundColor:{type:String,default:null},backgroundOpacity:{type:[Number,String],default:null},bufferValue:{type:[Number,String],default:100},color:{type:String,default:"primary"},height:{type:[Number,String],default:4},indeterminate:Boolean,query:Boolean,reverse:Boolean,rounded:Boolean,stream:Boolean,striped:Boolean,value:{type:[Number,String],default:0}},data:function(){return{internalLazyValue:this.value||0,isVisible:!0}},computed:{__cachedBackground:function(){return this.$createElement("div",this.setBackgroundColor(this.backgroundColor||this.color,{staticClass:"v-progress-linear__background",style:this.backgroundStyle}))},__cachedBar:function(){return this.$createElement(this.computedTransition,[this.__cachedBarType])},__cachedBarType:function(){return this.indeterminate?this.__cachedIndeterminate:this.__cachedDeterminate},__cachedBuffer:function(){return this.$createElement("div",{staticClass:"v-progress-linear__buffer",style:this.styles})},__cachedDeterminate:function(){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__determinate",style:{width:Object(v.i)(this.normalizedValue,"%")}}))},__cachedIndeterminate:function(){return this.$createElement("div",{staticClass:"v-progress-linear__indeterminate",class:{"v-progress-linear__indeterminate--active":this.active}},[this.genProgressBar("long"),this.genProgressBar("short")])},__cachedStream:function(){return this.stream?this.$createElement("div",this.setTextColor(this.color,{staticClass:"v-progress-linear__stream",style:{width:Object(v.i)(100-this.normalizedBuffer,"%")}})):null},backgroundStyle:function(){var t;return t={opacity:null==this.backgroundOpacity?this.backgroundColor?1:.3:parseFloat(this.backgroundOpacity)},Object(n.a)(t,this.isReversed?"right":"left",Object(v.i)(this.normalizedValue,"%")),Object(n.a)(t,"width",Object(v.i)(Math.max(0,this.normalizedBuffer-this.normalizedValue),"%")),t},classes:function(){return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?_(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):_(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({"v-progress-linear--absolute":this.absolute,"v-progress-linear--fixed":this.fixed,"v-progress-linear--query":this.query,"v-progress-linear--reactive":this.reactive,"v-progress-linear--reverse":this.isReversed,"v-progress-linear--rounded":this.rounded,"v-progress-linear--striped":this.striped,"v-progress-linear--visible":this.isVisible},this.themeClasses)},computedTransition:function(){return this.indeterminate?o.d:o.f},isReversed:function(){return this.$vuetify.rtl!==this.reverse},normalizedBuffer:function(){return this.normalize(this.bufferValue)},normalizedValue:function(){return this.normalize(this.internalLazyValue)},reactive:function(){return Boolean(this.$listeners.change)},styles:function(){var t={};return this.active||(t.height=0),this.indeterminate||100===parseFloat(this.normalizedBuffer)||(t.width=Object(v.i)(this.normalizedBuffer,"%")),t}},methods:{genContent:function(){var slot=Object(v.u)(this,"default",{value:this.internalLazyValue});return slot?this.$createElement("div",{staticClass:"v-progress-linear__content"},slot):null},genListeners:function(){var t=this.$listeners;return this.reactive&&(t.click=this.onClick),t},genProgressBar:function(t){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__indeterminate",class:Object(n.a)({},t,!0)}))},onClick:function(t){if(this.reactive){var e=this.$el.getBoundingClientRect().width;this.internalValue=t.offsetX/e*100}},onObserve:function(t,e,r){this.isVisible=r},normalize:function(t){return t<0?0:t>100?100:parseFloat(t)}},render:function(t){return t("div",{staticClass:"v-progress-linear",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":this.normalizedBuffer,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:{bottom:this.bottom?0:void 0,height:this.active?Object(v.i)(this.height):0,top:this.top?0:void 0},on:this.genListeners()},[this.__cachedStream,this.__cachedBackground,this.__cachedBuffer,this.__cachedBar,this.genContent()])}});e.a=y},1190:function(t,e,r){var content=r(1191);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(26).default)("cf87dc84",content,!0,{sourceMap:!1})},1191:function(t,e,r){var n=r(25)(!1);n.push([t.i,".theme--light.v-progress-linear{color:rgba(0,0,0,.87)}.theme--dark.v-progress-linear{color:#fff}.v-progress-linear{background:transparent;overflow:hidden;position:relative;transition:.2s cubic-bezier(.4,0,.6,1);width:100%}.v-progress-linear__buffer{height:inherit;left:0;position:absolute;top:0;transition:inherit;width:100%}.v-progress-linear--reverse .v-progress-linear__buffer{left:auto;right:0}.v-progress-linear__background{bottom:0;left:0;position:absolute;top:0;transition:inherit}.v-progress-linear--reverse .v-progress-linear__background{left:auto;right:0}.v-progress-linear__content{align-items:center;display:flex;height:100%;left:0;justify-content:center;position:absolute;top:0;width:100%}.v-progress-linear--reverse .v-progress-linear__content{left:auto;right:0}.v-progress-linear__determinate{height:inherit;left:0;position:absolute;transition:inherit}.v-progress-linear--reverse .v-progress-linear__determinate{left:auto;right:0}.v-progress-linear .v-progress-linear__indeterminate .long,.v-progress-linear .v-progress-linear__indeterminate .short{-webkit-animation-play-state:paused;animation-play-state:paused;background-color:inherit;bottom:0;height:inherit;left:0;position:absolute;right:auto;top:0;width:auto;will-change:left,right}.v-progress-linear .v-progress-linear__indeterminate--active .long{-webkit-animation-name:indeterminate-ltr;animation-name:indeterminate-ltr;-webkit-animation-duration:2.2s;animation-duration:2.2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear .v-progress-linear__indeterminate--active .short{-webkit-animation-name:indeterminate-short-ltr;animation-name:indeterminate-short-ltr;-webkit-animation-duration:2.2s;animation-duration:2.2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear--reverse .v-progress-linear__indeterminate .long,.v-progress-linear--reverse .v-progress-linear__indeterminate .short{left:auto;right:0}.v-progress-linear--reverse .v-progress-linear__indeterminate--active .long{-webkit-animation-name:indeterminate-rtl;animation-name:indeterminate-rtl}.v-progress-linear--reverse .v-progress-linear__indeterminate--active .short{-webkit-animation-name:indeterminate-short-rtl;animation-name:indeterminate-short-rtl}.v-progress-linear__stream{-webkit-animation:stream-ltr .25s linear infinite;animation:stream-ltr .25s linear infinite;-webkit-animation-play-state:paused;animation-play-state:paused;border-color:currentColor;border-top:4px dotted;bottom:0;left:auto;right:-8px;opacity:.3;pointer-events:none;position:absolute;top:calc(50% - 2px);transition:inherit}.v-progress-linear--reverse .v-progress-linear__stream{-webkit-animation:stream-rtl .25s linear infinite;animation:stream-rtl .25s linear infinite;left:-8px;right:auto}.v-progress-linear__wrapper{overflow:hidden;position:relative;transition:inherit}.v-progress-linear--absolute,.v-progress-linear--fixed{left:0;z-index:1}.v-progress-linear--absolute{position:absolute}.v-progress-linear--fixed{position:fixed}.v-progress-linear--reactive .v-progress-linear__content{pointer-events:none}.v-progress-linear--rounded{border-radius:4px}.v-progress-linear--striped .v-progress-linear__determinate{background-image:linear-gradient(135deg,hsla(0,0%,100%,.25) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.25) 0,hsla(0,0%,100%,.25) 75%,transparent 0,transparent);background-size:40px 40px;background-repeat:repeat}.v-progress-linear--query .v-progress-linear__indeterminate--active .long{-webkit-animation-name:query-ltr;animation-name:query-ltr;-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear--query .v-progress-linear__indeterminate--active .short{-webkit-animation-name:query-short-ltr;animation-name:query-short-ltr;-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear--query.v-progress-linear--reverse .v-progress-linear__indeterminate--active .long{-webkit-animation-name:query-rtl;animation-name:query-rtl}.v-progress-linear--query.v-progress-linear--reverse .v-progress-linear__indeterminate--active .short{-webkit-animation-name:query-short-rtl;animation-name:query-short-rtl}.v-progress-linear--visible .v-progress-linear__indeterminate--active .long,.v-progress-linear--visible .v-progress-linear__indeterminate--active .short,.v-progress-linear--visible .v-progress-linear__stream{-webkit-animation-play-state:running;animation-play-state:running}@-webkit-keyframes indeterminate-ltr{0%{left:-90%;right:100%}60%{left:-90%;right:100%}to{left:100%;right:-35%}}@keyframes indeterminate-ltr{0%{left:-90%;right:100%}60%{left:-90%;right:100%}to{left:100%;right:-35%}}@-webkit-keyframes indeterminate-rtl{0%{left:100%;right:-90%}60%{left:100%;right:-90%}to{left:-35%;right:100%}}@keyframes indeterminate-rtl{0%{left:100%;right:-90%}60%{left:100%;right:-90%}to{left:-35%;right:100%}}@-webkit-keyframes indeterminate-short-ltr{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes indeterminate-short-ltr{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@-webkit-keyframes indeterminate-short-rtl{0%{left:100%;right:-200%}60%{left:-8%;right:107%}to{left:-8%;right:107%}}@keyframes indeterminate-short-rtl{0%{left:100%;right:-200%}60%{left:-8%;right:107%}to{left:-8%;right:107%}}@-webkit-keyframes query-ltr{0%{right:-90%;left:100%}60%{right:-90%;left:100%}to{right:100%;left:-35%}}@keyframes query-ltr{0%{right:-90%;left:100%}60%{right:-90%;left:100%}to{right:100%;left:-35%}}@-webkit-keyframes query-rtl{0%{right:100%;left:-90%}60%{right:100%;left:-90%}to{right:-35%;left:100%}}@keyframes query-rtl{0%{right:100%;left:-90%}60%{right:100%;left:-90%}to{right:-35%;left:100%}}@-webkit-keyframes query-short-ltr{0%{right:-200%;left:100%}60%{right:107%;left:-8%}to{right:107%;left:-8%}}@keyframes query-short-ltr{0%{right:-200%;left:100%}60%{right:107%;left:-8%}to{right:107%;left:-8%}}@-webkit-keyframes query-short-rtl{0%{right:100%;left:-200%}60%{right:-8%;left:107%}to{right:-8%;left:107%}}@keyframes query-short-rtl{0%{right:100%;left:-200%}60%{right:-8%;left:107%}to{right:-8%;left:107%}}@-webkit-keyframes stream-ltr{to{transform:translateX(-8px)}}@keyframes stream-ltr{to{transform:translateX(-8px)}}@-webkit-keyframes stream-rtl{to{transform:translateX(8px)}}@keyframes stream-rtl{to{transform:translateX(8px)}}",""]),t.exports=n},1448:function(t,e,r){"use strict";var n=r(459).end,o=r(637);t.exports=o("trimEnd")?function(){return n(this)}:"".trimEnd},1467:function(t,e,r){"use strict";var n=r(436),o=r(179),c=r(430),l=r(439),f=r(108);var d=function(t,e){var r=-1,n=Object(f.a)(t)?Array(t.length):[];return Object(l.a)(t,(function(t,o,c){n[++r]=e(t,o,c)})),n};r(415);var h=function(t,e){var r=t.length;for(t.sort(e);r--;)t[r]=t[r].value;return t},v=r(182),m=r(175);var _=function(t,e){if(t!==e){var r=void 0!==t,n=null===t,o=t==t,c=Object(m.a)(t),l=void 0!==e,f=null===e,d=e==e,h=Object(m.a)(e);if(!f&&!h&&!c&&t>e||c&&l&&d&&!f&&!h||n&&l&&d||!r&&d||!o)return 1;if(!n&&!c&&!h&&t<e||h&&r&&o&&!n&&!c||f&&r&&o||!l&&o||!d)return-1}return 0};var y=function(object,t,e){for(var r=-1,n=object.criteria,o=t.criteria,c=n.length,l=e.length;++r<c;){var f=_(n[r],o[r]);if(f)return r>=l?f:f*("desc"==e[r]?-1:1)}return object.index-t.index},x=r(180),O=r(38);e.a=function(t,e,r){e=e.length?Object(n.a)(e,(function(t){return Object(O.a)(t)?function(e){return Object(o.a)(e,1===t.length?t[0]:t)}:t})):[x.a];var l=-1;e=Object(n.a)(e,Object(v.a)(c.a));var f=d(t,(function(t,r,o){return{criteria:Object(n.a)(e,(function(e){return e(t)})),index:++l,value:t}}));return h(f,(function(object,t){return y(object,t,r)}))}},1572:function(t,e,r){var n=r(4),o=r(1448);n({target:"String",proto:!0,name:"trimEnd",forced:"".trimRight!==o},{trimRight:o})},1573:function(t,e,r){var n=r(18),o=r(122),c=r(54),l=r(458),f=r(90),d=n(l),h=n("".slice),v=Math.ceil,m=function(t){return function(e,r,n){var l,m,_=c(f(e)),y=o(r),x=_.length,O=void 0===n?" ":c(n);return y<=x||""==O?_:((m=d(O,v((l=y-x)/O.length))).length>l&&(m=h(m,0,l)),t?_+m:m+_)}};t.exports={start:m(!1),end:m(!0)}},1574:function(t,e,r){var n=r(140);t.exports=/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(n)},1715:function(t,e,r){"use strict";var n=r(456),o=r(1467),c=r(454),l=r(431),f=Object(c.a)((function(t,e){if(null==t)return[];var r=e.length;return r>1&&Object(l.a)(t,e[0],e[1])?e=[]:r>2&&Object(l.a)(e[0],e[1],e[2])&&(e=[e[0]]),Object(o.a)(t,Object(n.a)(e,1),[])}));e.a=f},1747:function(t,e,r){"use strict";r.r(e);r(10),r(8),r(19),r(9),r(20),r(46),r(58),r(64),r(69);var n=r(21),o=r(16),c=r(2),l=(r(77),r(1138),r(1144),r(1145),r(3),r(257),r(63),r(14),r(22),r(154),r(32),r(42),r(41),r(39),r(57),r(255),r(66),r(134),r(28),r(120)),f=r(1123);var d=function(t){return void 0===t},h=r(145),v=r(478),m=r(430);var _=function(object,t){var e={};return t=Object(m.a)(t,3),Object(v.a)(object,(function(r,n,object){Object(h.a)(e,n,t(r,n,object))})),e},y=r(946),x=r(180),O=r(1715),k=r(1e3);var j=function(t){return t&&t.length?Object(k.a)(t,x.a):0},w=r(970),P=r(1003);var S=function(t,e,r){return t&&t.length?(e=r||void 0===e?1:Object(P.a)(e),Object(w.a)(t,0,e<0?0:e)):[]},C=r(964);function B(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return E(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return E(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var i=0,n=function(){};return{s:n,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,c=!0,l=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return c=t.done,t},e:function(t){l=!0,o=t},f:function(){try{c||null==r.return||r.return()}finally{if(l)throw o}}}}function E(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,r=new Array(e);i<e;i++)r[i]=t[i];return r}function z(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function M(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?z(Object(source),!0).forEach((function(e){Object(c.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):z(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var $=function(t,e){return 1===e?t:"".concat(t,"s")},R={name:"UnitSummary",data:function(){return{group2ext:{"audio file":["mp3","m4a","wav","aac","webp"],"image file":["jpg","jpeg","png","gif","bnp"],"video file":["avi","mov","mp4","mpg"],document:["pdf","html","doc","docx","rtf","odt"],spreadsheet:["xls","xlsx","ods"],"archive file":["zip","7z","rar","gz"],"data file":["json","csv","tsv","xml"],"text file":["txt","md"],other:[]},computeNPoints:!1,nDataPoints:null,filesInformation:[]}},computed:M(M({},Object(l.c)(["fileManager"])),{},{ext2group:function(){return Object.fromEntries(Object.entries(this.group2ext).flatMap((function(t){return t[1].map((function(e){return[e,t[0]]}))})))},nFiles:function(){return this.fileManager.fileList.length},totalSize:function(){return Object(f.a)(this.fileManager.fileList,(function(t){return t.size}))},dataSizeString:function(){return Object(C.c)(this.totalSize)},fileExts:function(){return this.fileManager.fileList.map((function(t){var e;return null===(e=t.name.match(/^.+\.(.+?)$/))||void 0===e?void 0:e[1]})).filter((function(t){return!d(t)}))},sortedGroupCounts:function(){var t=this,e=this.fileExts.map((function(e){return t.ext2group[e]})),r=_(Object(y.a)(e,x.a),(function(t){return t.length}));return Object(O.a)(Object.entries(r),(function(t){var e=Object(o.a)(t,2),r=e[0],n=e[1];return"other"===r?1:-n}))}}),watch:{fileManager:{immediate:!0,handler:function(){this.fileManager&&(this.completeGroupsTable(),this.setExtensionTexts(),this.computeNPoints&&this.setNumberOfDataPoints())}}},methods:{k:function(t){return"unit-summary.".concat(t)},onFileClick:function(t){this.$store.commit("setFileExplorerCurrentItem",{filename:t}),this.$emit("switch-tab","file-explorer")},setNumberOfDataPoints:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=j,e.next=3,Promise.all(t.fileManager.getFilenames().map(function(){var e=Object(n.a)(regeneratorRuntime.mark((function e(r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.fileManager.getNumberOfDataPoints(r);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 3:e.t1=e.sent,t.nDataPoints=(0,e.t0)(e.t1);case 5:case"end":return e.stop()}}),e)})))()},completeGroupsTable:function(){var t,e=B(this.fileExts);try{for(e.s();!(t=e.n()).done;){var r=t.value;r in this.ext2group||this.group2ext.other.includes(r)||this.group2ext.other.push(r)}}catch(t){e.e(t)}finally{e.f()}},setExtensionTexts:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=3,e.next=3,Promise.all(t.fileManager.getFilenames().map(function(){var e=Object(n.a)(regeneratorRuntime.mark((function e(r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.t0=r,!t.computeNPoints){e.next=7;break}return e.next=4,t.fileManager.getNumberOfDataPoints(r);case 4:e.t1=e.sent,e.next=8;break;case 7:e.t1=0;case 8:return e.t2=e.t1,e.abrupt("return",[e.t0,e.t2]);case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 3:c=e.sent,t.filesInformation=t.sortedGroupCounts.map((function(e){var n=Object(o.a)(e,2),l=n[0],d=n[1],h=new RegExp(".+\\.".concat(t.group2ext[l].join("|"),"$")),v=c.filter((function(t){var e=Object(o.a)(t,2),r=e[0];e[1];return h.test(r)})),m=S(Object(O.a)(v,(function(t){var e=Object(o.a)(t,2);e[0];return-e[1]})),r),_=Object(f.a)(v,(function(t){var e=Object(o.a)(t,2);e[0];return e[1]}));return{topFiles:m.map((function(t){var e=Object(o.a)(t,2),r=e[0],n=e[1];return{filename:r,description:"".concat(0===n?"":" (".concat(n.toLocaleString()," ").concat($("text file"===l?"line":"datapoint",n),")"))}})),globalDescription:"<b>".concat(d," ").concat($("other"===l?"other file":l,d),"</b>").concat(_>0?" (".concat(_.toLocaleString()," ").concat($("text file"===l?"line":"datapoint",_),")"):"").concat(v.length>r?" including: ":":")}}));case 5:case"end":return e.stop()}}),e)})))()}}},D=R,L=r(40),T=r(44),V=r.n(T),N=r(998),F=r(965),component=Object(L.a)(D,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return null!==t.fileManager?r("div",[r("VCard",{staticClass:"pa-2 mb-6",attrs:{flat:""}},[r("VCardTitle",{directives:[{name:"t",rawName:"v-t",value:t.k("cardTitle"),expression:"k('cardTitle')"}],staticClass:"justify-center"}),t._v(" "),r("VCardText",[r("i18n",{attrs:{path:t.k("summaryHeading.main"),tag:"span"},scopedSlots:t._u([{key:"file",fn:function(){return[r("span",{staticClass:"font-weight-bold"},[t._v(t._s(t.$tc(t.k("summaryHeading.file"),t.nFiles,{n:t.$n(t.nFiles)})))])]},proxy:!0},{key:"dataSizeString",fn:function(){return[t._v("\n          ("),r("span",{staticClass:"font-weight-bold"},[t._v(t._s(t.dataSizeString))]),t._v(")\n        ")]},proxy:!0},{key:"datapoint",fn:function(){return[r("span",{staticClass:"font-weight-bold"},[t._v(t._s(t.$tc(t.k("summaryHeading.datapoint"),t.nDataPoints,{n:t.$n(t.nDataPoints)})))])]},proxy:!0}],null,!1,3380426586)}),r("span",[t._v(":")]),t._v(" "),t.filesInformation?r("ul",t._l(t.filesInformation,(function(e,i){var n=e.globalDescription,o=e.topFiles;return r("li",{key:i},[r("span",{domProps:{innerHTML:t._s(n)}}),t._v(" "),t._l(o,(function(e,n){var c=e.filename,l=e.description;return r("span",{key:n},[r("a",{on:{click:function(e){return t.onFileClick(c)}}},[r("u",[t._v(t._s(t.fileManager.getShortFilename(c)))])]),r("span",[t._v(t._s(l))]),n<o.length-1?r("span",[t._v(", ")]):t._e()])}))],2)})),0):t._e()],1)],1)],1):t._e()}),[],!1,null,null,null);e.default=component.exports;V()(component,{VCard:N.a,VCardText:F.c,VCardTitle:F.d})},964:function(t,e,r){"use strict";r.d(e,"b",(function(){return f})),r.d(e,"d",(function(){return d})),r.d(e,"a",(function(){return h})),r.d(e,"g",(function(){return v})),r.d(e,"f",(function(){return m})),r.d(e,"e",(function(){return _})),r.d(e,"h",(function(){return y})),r.d(e,"i",(function(){return x})),r.d(e,"j",(function(){return O})),r.d(e,"c",(function(){return k}));var n=r(86),o=(r(21),r(16)),c=r(6),l=r(2),f=(r(77),r(3),r(42),r(41),r(1043),r(432),r(10),r(1070),r(257),r(28),r(1071),r(66),r(87),r(595),"txt"),d=Object(l.a)({csv:"text/csv",json:"application/json",jsonld:"application/ld+json",nq:"application/n-quads",rq:"application/sparql-query",ttl:"text/turtle",yaml:"application/x-yaml",yml:"application/x-yaml",png:"image/png",jpeg:"image/jpeg",zip:"application/zip"},f,"text/plain;charset=UTF-8");function h(data){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"text/plain";return data instanceof Blob?window.URL.createObjectURL(data):window.URL.createObjectURL(new Blob([data],{type:t}))}function v(t){window.URL.revokeObjectURL(t)}function m(t){return t.stack?t.stack:"object"===Object(c.a)(t)?Object.entries(t).reduce((function(t,e){var r=Object(o.a)(e,2),n=r[0],c=r[1];return"".concat(t).concat(n,": ").concat(c,"\n")}),"ERROR\n").trimRight():t}function _(t,e){return t.toString().padStart(e,"0")}function y(t,e){return t.postMessage(e),new Promise((function(e,r){t.addEventListener("message",(function(t){e(t.data)})),t.addEventListener("error",(function(t){console.error("worker error",t),r(t)})),t.addEventListener("messageerror",(function(t){console.error("worker error",t),r(t)}))}))}var x=function(t,e){return new Promise((function(r){return setTimeout(r,t,e)}))};function O(t,e){return t.size===e.size&&Object(n.a)(t).every((function(t){return e.has(t)}))}function k(t){var i=Math.floor(Math.log(t||1)/Math.log(1024));return"".concat((t/Math.pow(1024,i)).toFixed(2)," ").concat(["B","kB","MB","GB","TB"][i])}},965:function(t,e,r){"use strict";r.d(e,"a",(function(){return c})),r.d(e,"b",(function(){return l})),r.d(e,"c",(function(){return f})),r.d(e,"d",(function(){return d}));var n=r(998),o=r(0),c=Object(o.k)("v-card__actions"),l=Object(o.k)("v-card__subtitle"),f=Object(o.k)("v-card__text"),d=Object(o.k)("v-card__title");n.a},970:function(t,e,r){"use strict";e.a=function(t,e,r){var n=-1,o=t.length;e<0&&(e=-e>o?0:o+e),(r=r>o?o:r)<0&&(r+=o),o=e>r?0:r-e>>>0,e>>>=0;for(var c=Array(o);++n<o;)c[n]=t[n+e];return c}},998:function(t,e,r){"use strict";r(10),r(8),r(14),r(3),r(19),r(9),r(20);var n=r(2),o=(r(36),r(434),r(435),r(1040),r(222)),c=r(999),l=r(156),f=r(11);function d(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function h(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=Object(f.a)(c.a,l.a,o.a).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return h(h({"v-card":!0},l.a.options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},o.a.options.computed.classes.call(this))},styles:function(){var style=h({},o.a.options.computed.styles.call(this));return this.img&&(style.background='url("'.concat(this.img,'") center center / cover no-repeat')),style}},methods:{genProgress:function(){var t=c.a.options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),r=e.tag,data=e.data;return data.style=this.styles,this.isClickable&&(data.attrs=data.attrs||{},data.attrs.tabindex=0),t(r,this.setBackgroundColor(this.color,data),[this.genProgress(),this.$slots.default])}})},999:function(t,e,r){"use strict";r(36);var n=r(1),o=r(1184);e.a=n.a.extend().extend({name:"loadable",props:{loading:{type:[Boolean,String],default:!1},loaderHeight:{type:[Number,String],default:2}},methods:{genProgress:function(){return!1===this.loading?null:this.$slots.progress||this.$createElement(o.a,{props:{absolute:!0,color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,height:this.loaderHeight,indeterminate:!0}})}}})}}]);
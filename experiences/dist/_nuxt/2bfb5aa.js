(window.webpackJsonp=window.webpackJsonp||[]).push([[118,62],{1247:function(t,e,n){"use strict";n(13),n(11),n(15),n(16),n(12),n(17);var r=n(156),o=n(2),l=(n(3),n(65),n(978),n(866),n(80)),c=n(668),h=n(867),v=["title"];function d(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function f(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=h.a.extend({name:"v-checkbox",props:{indeterminate:Boolean,indeterminateIcon:{type:String,default:"$checkboxIndeterminate"},offIcon:{type:String,default:"$checkboxOff"},onIcon:{type:String,default:"$checkboxOn"}},data:function(){return{inputIndeterminate:this.indeterminate}},computed:{classes:function(){return f(f({},c.a.options.computed.classes.call(this)),{},{"v-input--selection-controls":!0,"v-input--checkbox":!0,"v-input--indeterminate":this.inputIndeterminate})},computedIcon:function(){return this.inputIndeterminate?this.indeterminateIcon:this.isActive?this.onIcon:this.offIcon},validationState:function(){if(!this.isDisabled||this.inputIndeterminate)return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0}},watch:{indeterminate:function(t){var e=this;this.$nextTick((function(){return e.inputIndeterminate=t}))},inputIndeterminate:function(t){this.$emit("update:indeterminate",t)},isActive:function(){this.indeterminate&&(this.inputIndeterminate=!1)}},methods:{genCheckbox:function(){var t=this.attrs$,e=(t.title,Object(r.a)(t,v));return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.$createElement(l.a,this.setTextColor(this.validationState,{props:{dense:this.dense,dark:this.dark,light:this.light}}),this.computedIcon),this.genInput("checkbox",f(f({},e),{},{"aria-checked":this.inputIndeterminate?"mixed":this.isActive.toString()})),this.genRipple(this.setTextColor(this.rippleState))])},genDefaultSlot:function(){return[this.genCheckbox(),this.genLabel()]}}})},1324:function(t,e,n){"use strict";var r=n(1322);e.a=r.a},1536:function(t,e,n){var content=n(1537);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(21).default)("1ac33462",content,!0,{sourceMap:!1})},1537:function(t,e,n){var r=n(20)(!1);r.push([t.i,".theme--light.v-input--range-slider.v-input--slider.v-input--is-disabled .v-slider.v-slider .v-slider__thumb{background:#fafafa}.theme--dark.v-input--range-slider.v-input--slider.v-input--is-disabled .v-slider.v-slider .v-slider__thumb{background:#424242}.v-input--range-slider.v-input--is-disabled .v-slider__track-fill{display:none}.v-input--range-slider.v-input--is-disabled.v-input--slider .v-slider.v-slider .v-slider__thumb{border-color:transparent}",""]),t.exports=r},1719:function(t,e,n){"use strict";n(13),n(11),n(15),n(3),n(16),n(12),n(17);var r=n(87),o=n(2),l=(n(73),n(29),n(77),n(28),n(1536),n(1324)),c=n(0);function h(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function v(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?h(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):h(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=l.a.extend({name:"v-range-slider",props:{value:{type:Array,default:function(){return[0,0]}}},data:function(){return{activeThumb:null,lazyValue:this.value}},computed:{classes:function(){return v(v({},l.a.options.computed.classes.call(this)),{},{"v-input--range-slider":!0})},internalValue:{get:function(){return this.lazyValue},set:function(t){var e=this,n=t.map((function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return e.roundValue(Math.min(Math.max(t,e.minValue),e.maxValue))}));if(n[0]>n[1]||n[1]<n[0]){if(null!==this.activeThumb){var r=1===this.activeThumb?0:1;this.$refs["thumb_".concat(r)].focus()}n=[n[1],n[0]]}this.lazyValue=n,Object(c.l)(n,this.value)||this.$emit("input",n),this.validate()}},inputWidth:function(){var t=this;return this.internalValue.map((function(e){return(t.roundValue(e)-t.minValue)/(t.maxValue-t.minValue)*100}))}},methods:{getTrackStyle:function(t,e){var n,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,c=this.vertical?this.$vuetify.rtl?"top":"bottom":this.$vuetify.rtl?"right":"left",h=this.vertical?"height":"width",v="calc(".concat(t,"% + ").concat(r,"px)"),d="calc(".concat(e,"% + ").concat(l,"px)");return n={transition:this.trackTransition},Object(o.a)(n,c,v),Object(o.a)(n,h,d),n},getIndexOfClosestValue:function(t,e){return Math.abs(t[0]-e)<Math.abs(t[1]-e)?0:1},genInput:function(){var t=this;return Object(c.j)(2).map((function(i){var input=l.a.options.methods.genInput.call(t);return input.data=input.data||{},input.data.attrs=input.data.attrs||{},input.data.attrs.value=t.internalValue[i],input.data.attrs.id="input-".concat(i?"max":"min","-").concat(t._uid),input}))},genTrackContainer:function(){var t=this,e=[],n=this.isDisabled?10:0,o=[{class:"v-slider__track-background",color:this.computedTrackColor,styles:[0,this.inputWidth[0],0,-n]},{class:this.isDisabled?"v-slider__track-background":"v-slider__track-fill",color:this.isDisabled?this.computedTrackColor:this.computedTrackFillColor,styles:[this.inputWidth[0],Math.abs(this.inputWidth[1]-this.inputWidth[0]),n,-2*n]},{class:"v-slider__track-background",color:this.computedTrackColor,styles:[this.inputWidth[1],Math.abs(100-this.inputWidth[1]),n,-n]}];return this.$vuetify.rtl&&o.reverse(),e.push.apply(e,Object(r.a)(o.map((function(section){return t.$createElement("div",t.setBackgroundColor(section.color,{staticClass:section.class,style:t.getTrackStyle.apply(t,Object(r.a)(section.styles))}))})))),this.$createElement("div",{staticClass:"v-slider__track-container",ref:"track"},e)},genChildren:function(){var t=this;return[this.genInput(),this.genTrackContainer(),this.genSteps(),Object(c.j)(2).map((function(e){var n=t.internalValue[e],r=t.inputWidth[e],o=t.isActive&&t.activeThumb===e,l=t.isFocused&&t.activeThumb===e;return t.genThumbContainer(n,r,o,l,(function(n){t.isFocused=!0,t.activeThumb=e,t.$emit("focus",n)}),(function(e){t.isFocused=!1,t.activeThumb=null,t.$emit("blur",e)}),"thumb_".concat(e))}))]},reevaluateSelected:function(t){this.activeThumb=this.getIndexOfClosestValue(this.internalValue,t);var e="thumb_".concat(this.activeThumb);this.$refs[e].focus()},onSliderMouseDown:function(t){var e,n=this,r=this.parseMouseMove(t);if(this.reevaluateSelected(r),this.oldValue=this.internalValue,this.isActive=!0,null!=(e=t.target)&&e.matches(".v-slider__thumb-container, .v-slider__thumb-container *")){this.thumbPressed=!0;var o=t.target.getBoundingClientRect(),l="touches"in t?t.touches[0]:t;this.startOffset=this.vertical?l.clientY-(o.top+o.height/2):l.clientX-(o.left+o.width/2)}else this.startOffset=0,window.clearTimeout(this.mouseTimeout),this.mouseTimeout=window.setTimeout((function(){n.thumbPressed=!0}),300);var h=!c.E||{passive:!0,capture:!0},v=!!c.E&&{passive:!0},d="touches"in t;this.onMouseMove(t),this.app.addEventListener(d?"touchmove":"mousemove",this.onMouseMove,v),Object(c.a)(this.app,d?"touchend":"mouseup",this.onSliderMouseUp,h),this.$emit("start",this.internalValue)},onSliderClick:function(t){if(!this.isActive){if(this.noClick)return void(this.noClick=!1);var e=this.parseMouseMove(t);this.reevaluateSelected(e),this.setInternalValue(e),this.$emit("change",this.internalValue)}},onMouseMove:function(t){var e=this.parseMouseMove(t);"mousemove"===t.type&&(this.thumbPressed=!0),null===this.activeThumb&&(this.activeThumb=this.getIndexOfClosestValue(this.internalValue,e)),this.setInternalValue(e)},onKeyDown:function(t){if(null!==this.activeThumb){var e=this.parseKeyDown(t,this.internalValue[this.activeThumb]);null!=e&&(this.setInternalValue(e),this.$emit("change",this.internalValue))}},setInternalValue:function(t){var e=this;this.internalValue=this.internalValue.map((function(n,i){return i===e.activeThumb?t:Number(n)}))}}})},674:function(t,e,n){"use strict";n.d(e,"e",(function(){return o})),n.d(e,"a",(function(){return l})),n.d(e,"c",(function(){return c})),n.d(e,"b",(function(){return h})),n.d(e,"d",(function(){return v})),n.d(e,"f",(function(){return d})),n.d(e,"g",(function(){return f})),n.d(e,"h",(function(){return m}));n(114),n(155),n(22),n(154),n(3),n(45),n(66);var r=n(708);function o(t){return t instanceof Date&&!isNaN(t)&&1970!==t.getFullYear()}var l=r.L("%Y-%m-%d"),c=r.L("%Y-%m-%d %H:%M:%S"),h=r.Q("%Y-%m-%d"),v=r.Q("%Y-%m-%d %H:%M:%S"),d=r.L("%H:%M:%S"),f=r.Q("%H:%M:%S");r.Q("%Y-%m-%d"),r.Q("%Y/%m/%d"),r.Q("%m/%d/%Y"),r.Q("%B %d, %Y"),r.Q("%b %d, %Y"),r.Q("%s"),r.Q("%Q"),r.Q("%H:%M"),r.Q("%H:%M%Z"),r.Q("%H:%M %p"),r.Q("%H:%M:%S"),r.Q("%H:%M:%S %p"),r.Q("%H:%M:%S%Z"),r.Q("%H:%M:%S.%L"),r.Q("%H:%M:%S.%L%Z");function m(t,e){if(["date","time"].find((function(e){return t.toLowerCase().includes(e)}))){var n=new Date(e);if(o(n))return n.toLocaleString();if(o(n=new Date(1e3*e)))return n.toLocaleString()}return e}},675:function(t,e,n){"use strict";n(13),n(11),n(16),n(12),n(17);var r=n(23),o=n(2),l=(n(3),n(15),n(698),n(8)),c=n(290),h=n(80),v=n(35),d=n(185),f=n(32),m=n(52),y=n(118),x=n(188),_=n(9);function k(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function C(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?k(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):k(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=Object(l.a)(v.a,x.a,y.a,f.a,Object(d.a)("chipGroup"),Object(m.b)("inputValue")).extend({name:"v-chip",props:{active:{type:Boolean,default:!0},activeClass:{type:String,default:function(){return this.chipGroup?this.chipGroup.activeClass:""}},close:Boolean,closeIcon:{type:String,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},disabled:Boolean,draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:Boolean,outlined:Boolean,pill:Boolean,tag:{type:String,default:"span"},textColor:String,value:null},data:function(){return{proxyClass:"v-chip--active"}},computed:{classes:function(){return C(C(C(C({"v-chip":!0},y.a.options.computed.classes.call(this)),{},{"v-chip--clickable":this.isClickable,"v-chip--disabled":this.disabled,"v-chip--draggable":this.draggable,"v-chip--label":this.label,"v-chip--link":this.isLink,"v-chip--no-color":!this.color,"v-chip--outlined":this.outlined,"v-chip--pill":this.pill,"v-chip--removable":this.hasClose},this.themeClasses),this.sizeableClasses),this.groupClasses)},hasClose:function(){return Boolean(this.close)},isClickable:function(){return Boolean(y.a.options.computed.isClickable.call(this)||this.chipGroup)}},created:function(){var t=this;[["outline","outlined"],["selected","input-value"],["value","active"],["@input","@active.sync"]].forEach((function(e){var n=Object(r.a)(e,2),o=n[0],l=n[1];t.$attrs.hasOwnProperty(o)&&Object(_.a)(o,l,t)}))},methods:{click:function(t){this.$emit("click",t),this.chipGroup&&this.toggle()},genFilter:function(){var t=[];return this.isActive&&t.push(this.$createElement(h.a,{staticClass:"v-chip__filter",props:{left:!0}},this.filterIcon)),this.$createElement(c.b,t)},genClose:function(){var t=this;return this.$createElement(h.a,{staticClass:"v-chip__close",props:{right:!0,size:18},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.$emit("click:close"),t.$emit("update:active",!1)}}},this.closeIcon)},genContent:function(){return this.$createElement("span",{staticClass:"v-chip__content"},[this.filter&&this.genFilter(),this.$slots.default,this.hasClose&&this.genClose()])}},render:function(t){var e=[this.genContent()],n=this.generateRouteLink(),r=n.tag,data=n.data;data.attrs=C(C({},data.attrs),{},{draggable:this.draggable?"true":void 0,tabindex:this.chipGroup&&!this.disabled?0:data.attrs.tabindex}),data.directives.push({name:"show",value:this.active}),data=this.setBackgroundColor(this.color,data);var o=this.textColor||this.outlined&&this.color;return t(r,this.setTextColor(o,data),e)}})},698:function(t,e,n){var content=n(699);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(21).default)("197fcea4",content,!0,{sourceMap:!1})},699:function(t,e,n){var r=n(20)(!1);r.push([t.i,'.v-chip:not(.v-chip--outlined).accent,.v-chip:not(.v-chip--outlined).error,.v-chip:not(.v-chip--outlined).info,.v-chip:not(.v-chip--outlined).primary,.v-chip:not(.v-chip--outlined).secondary,.v-chip:not(.v-chip--outlined).success,.v-chip:not(.v-chip--outlined).warning{color:#fff}.theme--light.v-chip{border-color:rgba(0,0,0,.12);color:rgba(0,0,0,.87)}.theme--light.v-chip:not(.v-chip--active){background:#e0e0e0}.theme--light.v-chip:hover:before{opacity:.04}.theme--light.v-chip--active:before,.theme--light.v-chip--active:hover:before,.theme--light.v-chip:focus:before{opacity:.12}.theme--light.v-chip--active:focus:before{opacity:.16}.theme--dark.v-chip{border-color:hsla(0,0%,100%,.12);color:#fff}.theme--dark.v-chip:not(.v-chip--active){background:#555}.theme--dark.v-chip:hover:before{opacity:.08}.theme--dark.v-chip--active:before,.theme--dark.v-chip--active:hover:before,.theme--dark.v-chip:focus:before{opacity:.24}.theme--dark.v-chip--active:focus:before{opacity:.32}.v-chip{align-items:center;cursor:default;display:inline-flex;line-height:20px;max-width:100%;outline:none;overflow:hidden;padding:0 12px;position:relative;text-decoration:none;transition-duration:.28s;transition-property:box-shadow,opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);vertical-align:middle;white-space:nowrap}.v-chip:before{background-color:currentColor;bottom:0;border-radius:inherit;content:"";left:0;opacity:0;position:absolute;pointer-events:none;right:0;top:0}.v-chip .v-avatar{height:24px!important;min-width:24px!important;width:24px!important}.v-chip .v-icon{font-size:24px}.v-application--is-ltr .v-chip .v-avatar--left,.v-application--is-ltr .v-chip .v-icon--left{margin-left:-6px;margin-right:6px}.v-application--is-ltr .v-chip .v-avatar--right,.v-application--is-ltr .v-chip .v-icon--right,.v-application--is-rtl .v-chip .v-avatar--left,.v-application--is-rtl .v-chip .v-icon--left{margin-left:6px;margin-right:-6px}.v-application--is-rtl .v-chip .v-avatar--right,.v-application--is-rtl .v-chip .v-icon--right{margin-left:-6px;margin-right:6px}.v-chip:not(.v-chip--no-color) .v-icon{color:inherit}.v-chip .v-chip__close.v-icon{font-size:18px;max-height:18px;max-width:18px;-webkit-user-select:none;-moz-user-select:none;user-select:none}.v-application--is-ltr .v-chip .v-chip__close.v-icon.v-icon--right{margin-right:-4px}.v-application--is-rtl .v-chip .v-chip__close.v-icon.v-icon--right{margin-left:-4px}.v-chip .v-chip__close.v-icon:active,.v-chip .v-chip__close.v-icon:focus,.v-chip .v-chip__close.v-icon:hover{opacity:.72}.v-chip .v-chip__content{align-items:center;display:inline-flex;height:100%;max-width:100%}.v-chip--active .v-icon{color:inherit}.v-chip--link:before{transition:opacity .3s cubic-bezier(.25,.8,.5,1)}.v-chip--link:focus:before{opacity:.32}.v-chip--clickable{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.v-chip--clickable:active{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.v-chip--disabled{opacity:.4;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.v-chip__filter{max-width:24px}.v-chip__filter.v-icon{color:inherit}.v-chip__filter.expand-x-transition-enter,.v-chip__filter.expand-x-transition-leave-active{margin:0}.v-chip--pill .v-chip__filter{margin:0 16px 0 0}.v-chip--pill .v-avatar{height:32px!important;width:32px!important}.v-application--is-ltr .v-chip--pill .v-avatar--left{margin-left:-12px}.v-application--is-ltr .v-chip--pill .v-avatar--right,.v-application--is-rtl .v-chip--pill .v-avatar--left{margin-right:-12px}.v-application--is-rtl .v-chip--pill .v-avatar--right{margin-left:-12px}.v-chip--label{border-radius:4px!important}.v-chip.v-chip--outlined{border-width:thin;border-style:solid}.v-chip.v-chip--outlined.v-chip--active:before{opacity:.08}.v-chip.v-chip--outlined .v-icon{color:inherit}.v-chip.v-chip--outlined.v-chip.v-chip{background-color:transparent!important}.v-chip.v-chip--selected{background:transparent}.v-chip.v-chip--selected:after{opacity:.28}.v-chip.v-size--x-small{border-radius:8px;font-size:10px;height:16px}.v-chip.v-size--small{border-radius:12px;font-size:12px;height:24px}.v-chip.v-size--default{border-radius:16px;font-size:14px;height:32px}.v-chip.v-size--large{border-radius:27px;font-size:16px;height:54px}.v-chip.v-size--x-large{border-radius:33px;font-size:18px;height:66px}',""]),t.exports=r},739:function(t,e,n){"use strict";n.r(e);var r=n(23),o=(n(29),n(73),n(22),n(81),n(674)),l={name:"TimeFilter",props:{isDatetime:{type:Boolean,default:!1}},data:function(){return{allDay:!0,startTime:"00:00",endTime:"23:59"}},computed:{parser:function(){return this.isDatetime?o.d:o.g},filterFunction:function(){var t=this;return this.allDay?null:function(e){var n=t.parser(e);if(!e||!n)return!0;var r=t.toMilliseconds("".concat(n.getHours(),":").concat(n.getMinutes())),o=t.toMilliseconds(t.startTime),l=t.toMilliseconds(t.endTime);return r>=o&&r<=l}}},methods:{toMilliseconds:function(time){var t=time.split(":").map((function(t){return parseInt(t)})),e=Object(r.a)(t,2);return 3600*e[0]*1e3+60*e[1]*1e3},filterChange:function(){"00:00"===this.startTime&&"23:59"===this.endTime?this.allDay=!0:this.allDay=!1,this.$emit("filter-change",this.filterFunction)},reset:function(){this.startTime="00:00",this.endTime="23:59",this.filterChange()}}},c=n(33),h=n(34),v=n.n(h),d=n(1247),f=n(837),m=n(645),y=n(704),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("VRow",[n("VCol",[n("div",{staticClass:"d-flex justify-space-between align-center text-subtitle-1 mt-3 mb-3"},[n("span",[t._v("Time")]),t._v(" "),n("VCheckbox",{attrs:{label:"All Day",color:"primary","hide-details":"",disabled:t.allDay,dense:""},on:{click:t.reset},model:{value:t.allDay,callback:function(e){t.allDay=e},expression:"allDay"}})],1),t._v(" "),n("div",{staticClass:"d-flex justify-space-between"},[n("VTextField",{staticClass:"mr-3",attrs:{label:"Min value",type:"time"},on:{change:function(e){return t.filterChange()}},model:{value:t.startTime,callback:function(e){t.startTime=e},expression:"startTime"}}),t._v(" "),n("VTextField",{staticClass:"ml-3",attrs:{label:"Min value",min:t.startTime,type:"time"},on:{change:function(e){return t.filterChange()}},model:{value:t.endTime,callback:function(e){t.endTime=e},expression:"endTime"}})],1)])],1)}),[],!1,null,null,null);e.default=component.exports;v()(component,{VCheckbox:d.a,VCol:f.a,VRow:m.a,VTextField:y.a})},752:function(t,e,n){"use strict";n.r(e);var r=n(87),o=(n(15),n(3),n(73),n(41),n(45),n(66),n(48),n(708)),l=n(674),c={name:"UnitFilter",props:{values:{type:Array,default:function(){return[]}},isDatetime:{type:Boolean,default:!1}},data:function(){return{dateFormatter:l.a,weekDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],weekDayAuthorized:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],sliderRange:[],timeFilterFunction:null}},computed:{parser:function(){return this.isDatetime?l.d:l.b},dates:function(){var t=this;return this.values.map((function(e){return t.parser(e)})).filter((function(t){return null!==t}))},dateExtent:function(){return o.h(this.dates)},numberOfDays:function(){var t;return(t=o.J).count.apply(t,Object(r.a)(this.dateExtent))},timeScale:function(){return o.C().domain(this.dateExtent).range([0,this.numberOfDays])},dateRange:function(){return[this.getDate(this.sliderRange[0]),this.getDate(this.sliderRange[1])]},allWeekDays:function(){return this.weekDayAuthorized.length===this.weekDays.length},filterFunction:function(){var t=this;return!this.timeFilterFunction&&this.allWeekDays&&JSON.stringify(this.sliderRange)===JSON.stringify([0,this.numberOfDays])?null:function(e){var n=t.parser(e);return(!e||n>=t.dateRange[0]&&n<=t.dateRange[1]&&t.weekDayAuthorized.includes(t.weekDays[n.getDay()]))&&(!t.timeFilterFunction||t.timeFilterFunction(e))}}},mounted:function(){this.sliderRange=[0,this.numberOfDays]},methods:{selectAll:function(){var t=this;this.$nextTick((function(){t.allWeekDays?t.weekDayAuthorized=[]:t.weekDayAuthorized=t.weekDays.slice(),t.filterChange()}))},getDate:function(i){return this.timeScale.invert(i)},timeFilterChange:function(filter){this.timeFilterFunction=filter,this.filterChange()},filterChange:function(){this.$emit("filter-change",this.filterFunction)},reset:function(){this.weekDayAuthorized=this.weekDays.slice(),this.sliderRange=[0,this.numberOfDays],this.isDatetime&&this.$refs.timeFilter.reset(),this.filterChange()}}},h=n(33),v=n(34),d=n.n(v),f=n(173),m=n(1247),y=n(675),x=n(837),_=n(1719),k=n(645),component=Object(h.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t.dates.length?n("div",[n("VRow",[n("VCol",[n("div",{staticClass:"d-flex justify-space-between"},[n("div",[n("div",{staticClass:"subtitle-2"},[t._v("\n              From:\n            ")]),t._v(" "),n("VChip",{attrs:{label:"",outlined:""}},[t._v("\n              "+t._s(t.dateFormatter(t.dateRange[0]))+"\n            ")])],1),t._v(" "),n("div",[n("div",{staticClass:"subtitle-2"},[t._v("\n              To:\n            ")]),t._v(" "),n("VChip",{attrs:{label:"",outlined:""}},[t._v("\n              "+t._s(t.dateFormatter(t.dateRange[1]))+"\n            ")])],1)]),t._v(" "),n("VRangeSlider",{attrs:{min:0,max:t.numberOfDays,"track-color":"primary","thumb-color":"#2c3e50","tick-size":"0","hide-details":"",dense:"",step:"1"},on:{change:t.filterChange},model:{value:t.sliderRange,callback:function(e){t.sliderRange=e},expression:"sliderRange"}})],1)],1),t._v(" "),t.isDatetime?n("TimeFilter",t._b({ref:"timeFilter",on:{"filter-change":t.timeFilterChange}},"TimeFilter",{isDatetime:t.isDatetime},!1)):t._e(),t._v(" "),n("div",{staticClass:"d-flex justify-space-between align-center text-subtitle-1 mt-3 mb-3"},[n("span",[t._v("Day of week")]),t._v(" "),n("VBtn",{staticClass:"ma-2",attrs:{outlined:"",color:"indigo","x-small":""},on:{mousedown:function(t){t.preventDefault()},click:t.selectAll}},[t._v("\n        "+t._s(t.allWeekDays?"Unselect All":"Select All")+"\n      ")])],1),t._v(" "),n("VRow",t._l(t.weekDays,(function(e){return n("VCol",{key:e,staticClass:"pt-0 pb-0",attrs:{cols:"12",md:"6"}},[n("VCheckbox",{attrs:{label:e,color:"primary",value:e,"hide-details":"",dense:""},on:{change:t.filterChange},model:{value:t.weekDayAuthorized,callback:function(e){t.weekDayAuthorized=e},expression:"weekDayAuthorized"}})],1)})),1)],1):n("div",{attrs:{align:"center"}},[n("span",{staticClass:"caption"},[t._v("No valid dates found")])])])}),[],!1,null,null,null);e.default=component.exports;d()(component,{TimeFilter:n(739).default}),d()(component,{VBtn:f.a,VCheckbox:m.a,VChip:y.a,VCol:x.a,VRangeSlider:_.a,VRow:k.a})},866:function(t,e,n){var content=n(913);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(21).default)("2e2bc7da",content,!0,{sourceMap:!1})},867:function(t,e,n){"use strict";n.d(e,"b",(function(){return h}));n(3),n(65),n(15);var r=n(668),o=n(873),l=n(298),c=n(8);function h(t){t.preventDefault()}e.a=Object(c.a)(r.a,o.a,l.a).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data:function(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor:function(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple:function(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive:function(){var t=this,e=this.value,input=this.internalValue;return this.isMultiple?!!Array.isArray(input)&&input.some((function(n){return t.valueComparator(n,e)})):void 0===this.trueValue||void 0===this.falseValue?e?this.valueComparator(e,input):Boolean(input):this.valueComparator(input,this.trueValue)},isDirty:function(){return this.isActive},rippleState:function(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue:function(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel:function(){var label=r.a.options.methods.genLabel.call(this);return label?(label.data.on={click:h},label):label},genInput:function(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:h},ref:"input"})},onClick:function(t){this.onChange(),this.$emit("click",t)},onChange:function(){var t=this;if(this.isInteractive){var e=this.value,input=this.internalValue;if(this.isMultiple){Array.isArray(input)||(input=[]);var n=input.length;(input=input.filter((function(n){return!t.valueComparator(n,e)}))).length===n&&input.push(e)}else input=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(input,this.trueValue)?this.falseValue:this.trueValue:e?this.valueComparator(input,e)?null:e:!input;this.validate(!0,input),this.internalValue=input,this.hasColor=input}},onFocus:function(t){this.isFocused=!0,this.$emit("focus",t)},onBlur:function(t){this.isFocused=!1,this.$emit("blur",t)},onKeydown:function(t){}}})},873:function(t,e,n){"use strict";var r=n(125),o=n(1);e.a=o.a.extend({name:"rippleable",directives:{ripple:r.a},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple:function(){var data=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.ripple?(data.staticClass="v-input--selection-controls__ripple",data.directives=data.directives||[],data.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",data)):null}}})},913:function(t,e,n){var r=n(20)(!1);r.push([t.i,'.v-input--selection-controls{margin-top:16px;padding-top:4px}.v-input--selection-controls>.v-input__append-outer,.v-input--selection-controls>.v-input__prepend-outer{margin-top:0;margin-bottom:0}.v-input--selection-controls:not(.v-input--hide-details)>.v-input__slot{margin-bottom:12px}.v-input--selection-controls .v-input__slot,.v-input--selection-controls .v-radio{cursor:pointer}.v-input--selection-controls .v-input__slot>.v-label,.v-input--selection-controls .v-radio>.v-label{align-items:center;display:inline-flex;flex:1 1 auto;height:auto}.v-input--selection-controls__input{color:inherit;display:inline-flex;flex:0 0 auto;height:24px;position:relative;transition:.3s cubic-bezier(.25,.8,.5,1);transition-property:transform;width:24px;-webkit-user-select:none;-moz-user-select:none;user-select:none}.v-input--selection-controls__input .v-icon{width:100%}.v-application--is-ltr .v-input--selection-controls__input{margin-right:8px}.v-application--is-rtl .v-input--selection-controls__input{margin-left:8px}.v-input--selection-controls__input input[role=checkbox],.v-input--selection-controls__input input[role=radio],.v-input--selection-controls__input input[role=switch]{position:absolute;opacity:0;width:100%;height:100%;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.v-input--selection-controls__input+.v-label{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.v-input--selection-controls__ripple{border-radius:50%;cursor:pointer;height:34px;position:absolute;transition:inherit;width:34px;left:-12px;top:calc(50% - 24px);margin:7px}.v-input--selection-controls__ripple:before{border-radius:inherit;bottom:0;content:"";position:absolute;opacity:.2;left:0;right:0;top:0;transform-origin:center center;transform:scale(.2);transition:inherit}.v-input--selection-controls__ripple>.v-ripple__container{transform:scale(1.2)}.v-input--selection-controls.v-input--dense .v-input--selection-controls__ripple{width:28px;height:28px;left:-9px}.v-input--selection-controls.v-input--dense:not(.v-input--switch) .v-input--selection-controls__ripple{top:calc(50% - 21px)}.v-input--selection-controls.v-input{flex:0 1 auto}.v-input--selection-controls.v-input--is-focused .v-input--selection-controls__ripple:before,.v-input--selection-controls .v-radio--is-focused .v-input--selection-controls__ripple:before{background:currentColor;transform:scale(1.2)}.v-input--selection-controls.v-input--is-disabled:not(.v-input--indeterminate) .v-icon{color:inherit}.v-input--selection-controls.v-input--is-disabled:not(.v-input--is-readonly){pointer-events:none}.v-input--selection-controls__input:hover .v-input--selection-controls__ripple:before{background:currentColor;transform:scale(1.2);transition:none}',""]),t.exports=r},978:function(t,e,n){var content=n(979);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(21).default)("12a190a6",content,!0,{sourceMap:!1})},979:function(t,e,n){var r=n(20)(!1);r.push([t.i,".v-input--checkbox.v-input--indeterminate.v-input--is-disabled{opacity:.6}.v-input--checkbox.v-input--dense{margin-top:4px}",""]),t.exports=r}}]);
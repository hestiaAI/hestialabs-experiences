(window.webpackJsonp=window.webpackJsonp||[]).push([[86],{1023:function(t,e,n){"use strict";n.r(e);var l=n(86),c=(n(3),n(1053),n(42),n(1054),n(1055),n(1056),n(1057),n(1058),n(1059),n(1060),n(1061),n(1062),n(1063),n(1064),n(1065),n(1066),n(1067),n(1068),n(1069),n(41),n(14),n(39),n(57),n(46),{name:"SelectFilter",props:{values:{type:Array,default:function(){return[]}}},data:function(){return{filter:Object(l.a)(new Set(this.values))}},computed:{items:function(){return Object(l.a)(new Set(this.values))},selectAll:function(){return this.filter.length===this.items.length},selectSome:function(){return this.filter.length>0&&!this.selectAll},icon:function(){return this.selectAll?"$vuetify.icons.mdiCloseBox":this.selectSome?"$vuetify.icons.mdiMinusBox":"$vuetify.icons.mdiCheckboxBlankOutline"},filterFunction:function(){var t=this;return this.selectAll?null:function(e){return t.filter.includes(e)}}},watch:{filter:function(){this.$emit("filter-change",this.filterFunction)}},methods:{toggle:function(){var t=this;this.$nextTick((function(){t.selectAll?t.filter=[]:t.filter=t.items.slice()}))},reset:function(){this.filter=this.items}}}),r=n(40),o=n(44),f=n.n(o),m=n(1913),h=n(245),v=n(980),d=n(990),V=n(385),_=n(246),w=n(391),C=n(95),component=Object(r.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("VAutocomplete",{staticClass:"pa-3",attrs:{flat:"","hide-details":"","full-width":"",multiple:"",dense:"",label:t.$t("Search"),items:t.items,"menu-props":{closeOnClick:!0,bottom:!0}},scopedSlots:t._u([{key:"prepend-item",fn:function(){return[n("VListItem",{attrs:{ripple:""},on:{click:t.toggle}},[n("VListItemAction",[n("VIcon",{attrs:{color:t.filter.length>0?"indigo darken-4":""}},[t._v("\n          "+t._s(t.icon)+"\n        ")])],1),t._v(" "),n("VListItemContent",[n("VListItemTitle",{directives:[{name:"t",rawName:"v-t",value:"Select All",expression:"'Select All'"}]})],1)],1),t._v(" "),n("VDivider",{staticClass:"mt-2"})]},proxy:!0},{key:"selection",fn:function(e){var l=e.item,c=e.index;return[c<1?n("VChip",{staticClass:"ma-1 pr-1"},[n("span",{staticStyle:{"overflow-x":"hidden",whitespace:"nowrap","text-overflow":"ellipsis"}},[t._v("\n        "+t._s(l)+"\n      ")]),t._v(" "),n("VBtn",{attrs:{icon:"",small:"",right:""},on:{click:function(e){return t.filter.splice(c,1)}}},[n("VIcon",{attrs:{small:""}},[t._v("\n          $vuetify.icon.mdiCloseCircle\n        ")])],1)],1):t._e(),t._v(" "),1===c?n("span",{staticClass:"grey--text caption"},[t._v("\n      ("+t._s(t.$tc("plusXOther",t.filter.length-1))+")\n    ")]):t._e()]}}]),model:{value:t.filter,callback:function(e){t.filter=e},expression:"filter"}})}),[],!1,null,null,null);e.default=component.exports;f()(component,{VAutocomplete:m.a,VBtn:h.a,VChip:v.a,VDivider:d.a,VIcon:V.a,VListItem:_.a,VListItemAction:w.a,VListItemContent:C.a,VListItemTitle:C.c})}}]);
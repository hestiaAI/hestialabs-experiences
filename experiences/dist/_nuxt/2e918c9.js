(window.webpackJsonp=window.webpackJsonp||[]).push([[126],{1001:function(e,t,r){"use strict";r(12),r(8),r(16),r(3),r(19),r(9),r(20);var n=r(2),o=(r(1045),r(37));function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}t.a=o.a.extend({name:"v-divider",props:{inset:Boolean,vertical:Boolean},render:function(e){var t;return this.$attrs.role&&"separator"!==this.$attrs.role||(t=this.vertical?"vertical":"horizontal"),e("hr",{class:l({"v-divider":!0,"v-divider--inset":this.inset,"v-divider--vertical":this.vertical},this.themeClasses),attrs:l({role:"separator","aria-orientation":t},this.$attrs),on:this.$listeners})}})},1045:function(e,t,r){var content=r(1046);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(26).default)("7132a15d",content,!0,{sourceMap:!1})},1046:function(e,t,r){var n=r(25)(!1);n.push([e.i,".theme--light.v-divider{border-color:rgba(0,0,0,.12)}.theme--dark.v-divider{border-color:hsla(0,0%,100%,.12)}.v-divider{display:block;flex:1 1 0px;max-width:100%;height:0;max-height:0;border:solid;border-width:thin 0 0;transition:inherit}.v-divider--inset:not(.v-divider--vertical){max-width:calc(100% - 72px)}.v-application--is-ltr .v-divider--inset:not(.v-divider--vertical){margin-left:72px}.v-application--is-rtl .v-divider--inset:not(.v-divider--vertical){margin-right:72px}.v-divider--vertical{align-self:stretch;border:solid;border-width:0 thin 0 0;display:inline-flex;height:inherit;min-height:100%;max-height:100%;max-width:0;width:0;vertical-align:text-bottom;margin:0 -1px}.v-divider--vertical.v-divider--inset{margin-top:8px;min-height:0;max-height:calc(100% - 16px)}",""]),e.exports=n},1571:function(e,t,r){"use strict";r.r(t);r(12),r(8),r(19),r(9),r(20);var n=r(2),o=(r(39),r(57),r(16),r(3),r(28),r(342),r(120));function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var d={props:{value:{type:Boolean,required:!0}},data:function(){return{search:"",activeItems:[]}},computed:l(l({},Object(o.c)(["consentForm","fileManager"])),{},{treeItems:function(){return this.fileManager.getTreeItems()},show:{get:function(){return this.value},set:function(e){this.$emit("input",e)}},selectedFiles:{get:function(){return this.$store.state.selectedFiles},set:function(e){this.$store.commit("setSelectedFiles",e)}}}),watch:{fileManager:{immediate:!0,handler:function(){this.setInitOpen()}}},methods:{k:function(e){return"unit-consent-form.select-files-dialog.".concat(e)},ok:function(){this.show=!1,this.updateCheckboxOnReturn(!1)},clear:function(){this.$store.commit("setSelectedFiles",[]),this.updateCheckboxOnReturn(!0),this.show=!1},setInitOpen:function(){for(var e=[],t=this.treeItems;1===t.length;){var r;e.push(t[0]),t=null!==(r=t[0].children)&&void 0!==r?r:[]}this.openItems=e},clickOnLabel:function(e){var t=e[0];this.selectedFiles.includes(t)?this.selectedFiles=this.selectedFiles.filter((function(e){return e!==t})):this.selectedFiles=this.selectedFiles.concat([t]),this.activeItems=[]},updateCheckboxOnReturn:function(e){var t=this.consentForm.findIndex((function(section){return"data"===section.type})),r=this.consentForm[t].value;e?r=r.filter((function(e){return"file-explorer"!==e})):r.includes("file-explorer")||(r=r.concat("file-explorer")),this.$store.commit("setConsentFormValue",{index:t,value:r})}}},h=r(40),v=r(44),f=r.n(v),m=r(246),O=r(1009),x=r(978),y=r(1567),w=r(1001),j=r(385),k=r(962),V=r(1124),_=r(1717),component=Object(h.a)(d,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return null!==e.fileManager?r("VDialog",{attrs:{width:"500",persistent:"",scrollable:""},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[r("VCard",[r("VCardTitle",{staticClass:"text-h5 grey lighten-2"},[e._v("\n      "+e._s(e.$t(e.k("title")))+"\n    ")]),e._v(" "),r("VCardText",[r("VTextField",{staticClass:"my-4 pr-3",staticStyle:{"max-width":"500px"},attrs:{label:e.$t(e.k("label")),placeholder:e.$t(e.k("placeholder")),clearable:"","hide-details":"","prepend-icon":"$vuetify.icons.mdiMagnify",outlined:"",dense:""},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),e._v(" "),r("VTreeview",{attrs:{dense:"",activatable:"","open-on-click":"","return-object":"",transition:"",rounded:"",selectable:"","selected-color":"primary",open:e.openItems,active:e.activeItems,search:e.search,items:e.treeItems},on:{"update:open":function(t){e.openItems=t},"update:active":[function(t){e.activeItems=t},e.clickOnLabel]},scopedSlots:e._u([{key:"prepend",fn:function(t){var n=t.item;return[r("VIcon",[e._v("\n            "+e._s(n.icon)+"\n          ")])]}}],null,!1,1468632301),model:{value:e.selectedFiles,callback:function(t){e.selectedFiles=t},expression:"selectedFiles"}})],1),e._v(" "),r("VDivider"),e._v(" "),r("VCardActions",[r("VSpacer"),e._v(" "),r("VBtn",{attrs:{color:"primary",text:""},on:{click:e.clear}},[e._v("\n        "+e._s(e.$t(e.k("clearButton")))+"\n      ")]),e._v(" "),r("VBtn",{attrs:{color:"primary",text:""},on:{click:e.ok}},[e._v("\n        OK\n      ")])],1)],1)],1):e._e()}),[],!1,null,null,null);t.default=component.exports;f()(component,{VBtn:m.a,VCard:O.a,VCardActions:x.a,VCardText:x.c,VCardTitle:x.d,VDialog:y.a,VDivider:w.a,VIcon:j.a,VSpacer:k.a,VTextField:V.a,VTreeview:_.a})}}]);
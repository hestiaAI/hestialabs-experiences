(window.webpackJsonp=window.webpackJsonp||[]).push([[126],{1251:function(e,t,n){var content=n(1435);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(26).default)("586cac17",content,!0,{sourceMap:!1})},1315:function(e,t,n){"use strict";n.r(t);n(3),n(42),n(41);var o={components:{AceEditor:function(){return n.e(181).then(n.t.bind(null,1942,7))}},inheritAttrs:!1,props:{value:{type:[Object,String,Error],default:""},error:{type:Boolean,default:!1},language:{type:String,default:"text"},lineNumbers:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},height:{type:String,default:""}},data:function(){return{code:this.value}},computed:{editorLanguage:function(){return this.error?"text":this.language}},watch:{value:{immediate:!0,handler:function(e){this.code=e}},code:function(e){this.$emit("update:value",e)}},methods:{initEditor:function(e){e.setReadOnly(this.readonly),e.setOption("showGutter",this.lineNumbers),e.session.setUseWrapMode(!0),e.setOption("minLines",2),e.setOption("maxLines",30),n(1456),n(1457),n(1458),n(1459),n(1460),n(1461),n(1462),n(1463),n(1464)}}},r=(n(1434),n(40)),component=Object(r.a)(o,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("client-only",{attrs:{placeholder:"Loading..."}},[n("AceEditor",{staticClass:"my-ace-editor",attrs:{lang:e.editorLanguage,theme:"chrome"},on:{init:e.initEditor},model:{value:e.code,callback:function(t){e.code=t},expression:"code"}})],1)}),[],!1,null,"f34e1eb6",null);t.default=component.exports},1434:function(e,t,n){"use strict";n(1251)},1435:function(e,t,n){var o=n(25)(!1);o.push([e.i,".my-ace-editor[data-v-f34e1eb6]{font-family:Fira code,Fira Mono,Consolas,Menlo,Courier,monospace;font-size:16px;line-height:1.5}",""]),e.exports=o}}]);
"use strict";(("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience=("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience||[]).push([[9961],{39961:function(e,t,n){n.r(t),n.d(t,{default:function(){return o}});var r=n(68004),f=n(67535),h={name:"UnitFileExplorerViewerUnknown",components:{BaseButton:n(25593).Z},mixins:[r.Z,f.Z],data:()=>({showIframe:!1,href:""}),computed:{iframeClass(){return this.showIframe?"":"d-none"}},watch:{filename(){this.showIframe=!1}},methods:{click(){this.href=this.path},onIframeLoad(){this.href===this.path&&(this.showIframe=!0)}}},o=(0,n(1001).Z)(h,(function(){var e=this,t=e._self._c;return t("div",[t("p",[e._v(" Unknown file type "),t("BaseButton",{staticClass:"ml-2",attrs:{small:""},on:{click:e.click}},[e._v(" Try to open it ")])],1),t("iframe",{ref:"iframe",class:e.iframeClass,attrs:{src:e.href,width:"100%",height:"500px"},on:{load:e.onIframeLoad}})])}),[],!1,null,null,null).exports},67535:function(e,t){t.Z={computed:{path(){return URL.createObjectURL(this.fileManager.fileDict[this.filename].blob)}}}}}]);
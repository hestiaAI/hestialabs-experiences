(window.webpackJsonp=window.webpackJsonp||[]).push([[102],{1447:function(t,e,n){var content=n(1571);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(26).default)("2decc1b6",content,!0,{sourceMap:!1})},1570:function(t,e,n){"use strict";n(1447)},1571:function(t,e,n){var r=n(25)(!1);r.push([t.i,".link[data-v-c0e13b4a]{float:right;margin-top:1em}",""]),t.exports=r},1600:function(t,e,n){"use strict";n.r(e);n(22),n(79),n(39),n(57);var r={name:"VideoWidget",props:{title:{type:String,default:function(){return""}},videoSrc:{type:String,required:!0},width:{type:String,default:function(){return"100%"}},height:{type:String,default:function(){return"250px"}},linkSrc:{type:String,default:function(){return""}},linkTxt:{type:String,default:function(){return""}},caption:{type:String,default:function(){return""}}},computed:{url:function(){var t=this.videoSrc.split("/").pop(),e=null;return this.videoSrc.includes("vimeo.com")&&(e="https://player.vimeo.com/video/"),this.videoSrc.includes("youtube.com")&&(e="https://www.youtube.com/embed/"),e&&t?e+t:null}}},l=(n(1570),n(40)),o=n(44),c=n.n(o),d=n(950),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{width:"100%"}},[n("div",{staticClass:"overline text-center"},[t._v("\n    "+t._s(t.title)+"\n  ")]),t._v(" "),t.url?t._e():n("VAlert",{attrs:{color:"red",dense:"",type:"error"}},[t._v("\n    The video link provided is not recognized\n  ")]),t._v(" "),t.url?n("iframe",{staticClass:"pa-3 video",attrs:{src:t.url,width:t.width,height:t.height,frameborder:"0",allow:"autoplay; fullscreen; picture-in-picture",allowfullscreen:""}}):t._e(),t._v(" "),n("div",{staticStyle:{"text-align":"end","margin-top":"0px","font-size":"12px"}},[n("ExternalLink",{attrs:{href:t.linkSrc}},[t._v("\n      "+t._s(t.linkTxt)+"\n    ")])],1)],1)}),[],!1,null,"c0e13b4a",null);e.default=component.exports;c()(component,{ExternalLink:n(346).default}),c()(component,{VAlert:d.a})}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[166,103],{1460:function(t,e,r){var content=r(1586);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(26).default)("2decc1b6",content,!0,{sourceMap:!1})},1585:function(t,e,r){"use strict";r(1460)},1586:function(t,e,r){var n=r(25)(!1);n.push([t.i,".link[data-v-c0e13b4a]{float:right;margin-top:1em}",""]),t.exports=n},1615:function(t,e,r){"use strict";r.r(e);r(21),r(78),r(39),r(57);var n={name:"VideoWidget",props:{title:{type:String,default:function(){return""}},videoSrc:{type:String,required:!0},width:{type:String,default:function(){return"100%"}},height:{type:String,default:function(){return"250px"}},linkSrc:{type:String,default:function(){return""}},linkTxt:{type:String,default:function(){return""}},caption:{type:String,default:function(){return""}}},computed:{url:function(){var t=this.videoSrc.split("/").pop(),e=null;return this.videoSrc.includes("vimeo.com")&&(e="https://player.vimeo.com/video/"),this.videoSrc.includes("youtube.com")&&(e="https://www.youtube.com/embed/"),e&&t?e+t:null}}},o=(r(1585),r(40)),l=r(44),c=r.n(l),d=r(963),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticStyle:{width:"100%"}},[r("div",{staticClass:"overline text-center"},[t._v("\n    "+t._s(t.title)+"\n  ")]),t._v(" "),t.url?t._e():r("VAlert",{attrs:{color:"red",dense:"",type:"error"}},[t._v("\n    The video link provided is not recognized\n  ")]),t._v(" "),t.url?r("iframe",{staticClass:"pa-3 video",attrs:{src:t.url,width:t.width,height:t.height,frameborder:"0",allow:"autoplay; fullscreen; picture-in-picture",allowfullscreen:""}}):t._e(),t._v(" "),r("div",{staticStyle:{"text-align":"end","margin-top":"0px","font-size":"12px"}},[r("ExternalLink",{attrs:{href:t.linkSrc}},[t._v("\n      "+t._s(t.linkTxt)+"\n    ")])],1)],1)}),[],!1,null,"c0e13b4a",null);e.default=component.exports;c()(component,{ExternalLink:r(345).default}),c()(component,{VAlert:d.a})},1863:function(t,e,r){"use strict";r.r(e);r(3),r(41);var n={props:{title:{type:String,required:!0},description:{type:String,default:""},slug:{type:String,required:!0},icon:{type:String,required:!0}},computed:{mdiIcon:function(){return this.$vuetify.icons.values[this.icon]}}},o=r(40),l=r(44),c=r.n(l),d=r(389),f=r(1009),h=r(978),v=r(334),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("VCard",{attrs:{height:"100%",nuxt:"",to:t.localePath({name:"bubble-bubble",params:{bubble:t.slug}}),hover:""}},[r("VCardText",[r("VAvatar",{attrs:{size:"200",tile:""}},[r("VImg",{attrs:{src:t.icon,"lazy-src":t.icon,contain:""}})],1),t._v(" "),r("h4",{staticClass:"text-subtitle-1 font-weight-bold"},[t._v("\n      "+t._s(t.title)+"\n    ")]),t._v(" "),r("p",[t._v(t._s(t.description))])],1)],1)}),[],!1,null,null,null);e.default=component.exports;c()(component,{VAvatar:d.a,VCard:f.a,VCardText:h.c,VImg:v.a})},1864:function(t,e,r){"use strict";r.r(e);var n={props:{text:{type:String,default:""},profileName:{type:String,default:""},profileDescription:{type:String,default:""},profilePhoto:{type:String,default:""},tweetLink:{type:String,default:""}}},o=r(40),l=r(44),c=r.n(l),d=r(1009),f=r(978),h=r(385),v=r(334),m=r(247),_=r(388),y=r(95),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("VCard",{staticClass:"mx-auto ma-3",attrs:{color:"primary",dark:"","max-width":"400",href:t.tweetLink,hover:""}},[r("VCardTitle",[r("VIcon",{attrs:{large:"",left:""}},[t._v("\n      $vuetify.icons.mdiTwitter\n    ")]),t._v(" "),r("span",{staticClass:"text-h6 font-weight-light"},[t._v("Twitter")])],1),t._v(" "),r("VCardText",{staticClass:"text-subtitle-1 font-weight-bold pr-5 pl-5"},[t._v('\n    "'+t._s(t.text)+'"\n  ')]),t._v(" "),r("VCardActions",[r("VListItem",{staticClass:"grow"},[r("VListItemAvatar",{attrs:{color:"grey darken-3"}},[r("VImg",{staticClass:"elevation-6",attrs:{alt:"",src:t.profilePhoto}})],1),t._v(" "),r("VListItemContent",[r("VListItemTitle",{staticClass:"font-weight-bold"},[t._v("\n          "+t._s(t.profileName)+"\n        ")]),t._v(" "),r("div",[t._v(t._s(t.profileDescription))])],1)],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports;c()(component,{VCard:d.a,VCardActions:f.a,VCardText:f.c,VCardTitle:f.d,VIcon:h.a,VImg:v.a,VListItem:m.a,VListItemAvatar:_.a,VListItemContent:y.a,VListItemTitle:y.c})},1869:function(t,e,r){var content=r(1893);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(26).default)("19c72a78",content,!0,{sourceMap:!1})},1885:function(t,e,r){"use strict";r.r(e);var n={props:{text:{type:String,required:!0},author:{type:String,default:""},authorHref:{type:String,default:""}}},o=r(40),l=r(44),c=r.n(l),d=r(1009),f=r(978),h=r(385),v=r(958),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("VCard",{staticClass:"mx-auto",attrs:{color:"primary",flat:""}},[r("VCardText",{staticClass:"white--text"},[r("VRow",{attrs:{dense:""}},[r("VIcon",{attrs:{large:"",left:"",color:"white"}},[t._v("\n        $vuetify.icons.mdiFormatQuoteOpen\n      ")])],1),t._v(" "),r("div",{staticClass:"blockquote font-italic"},[t._v("\n      "+t._s(t.text)+"\n    ")]),t._v(" "),r("VRow",{staticStyle:{"justify-content":"end"},attrs:{dense:""}},[r("VIcon",{attrs:{large:"",right:"",color:"white"}},[t._v("\n        $vuetify.icons.mdiFormatQuoteClose\n      ")])],1),t._v(" "),t.author?r("div",{staticClass:"d-flex justify-space-between font-italic font-weight-thin"},[t.authorHref?r("span",[r("VIcon",{attrs:{right:"",color:"white"}},[t._v(" $vuetify.icons.mdiMinus ")]),t._v(" "),r("ExternalLink",{attrs:{href:t.linkSrc}},[t._v(t._s(t.author))])],1):r("span",[r("VIcon",{attrs:{right:"",color:"white"}},[t._v("  $vuetify.icons.mdiMinus ")]),t._v("\n        "+t._s(t.author)+"\n      ")],1)]):t._e()],1)],1)}),[],!1,null,null,null);e.default=component.exports;c()(component,{ExternalLink:r(345).default}),c()(component,{VCard:d.a,VCardText:f.c,VIcon:h.a,VRow:v.a})},1886:function(t,e,r){"use strict";r.r(e);r(3),r(41);var n={props:{title:{type:String,required:!0},text:{type:String,required:!0},icon:{type:String,required:!0},actionText:{type:String,default:""},actionHref:{type:String,default:""}},computed:{mdiIcon:function(){return this.$vuetify.icons.values[this.icon]}},method:{scrollToElement:function(){var t=this.$refs.scrollToMe;t&&t.scrollIntoView({behavior:"smooth"})}}},o=r(40),l=r(44),c=r.n(l),d=r(389),f=r(246),h=r(1009),v=r(978),m=r(385),_=r(962),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("VCard",{staticClass:"d-flex flex-column",attrs:{flat:"",height:"100%"}},[r("VCardText",[r("VAvatar",{staticClass:"mb-6",attrs:{color:"primary",size:"80"}},[r("VIcon",{staticClass:"pa-5",attrs:{dark:""}},[t._v("\n        "+t._s(t.mdiIcon)+"\n      ")])],1),t._v(" "),r("h4",{staticClass:"text-subtitle-1 font-weight-bold"},[t._v("\n      "+t._s(t.title)+"\n    ")]),t._v(" "),r("p",{staticClass:"mt-3 mb-3"},[t._v("\n      "+t._s(t.text)+"\n    ")])],1),t._v(" "),r("VSpacer"),t._v(" "),t.actionText?r("VCardActions",[r("VBtn",{attrs:{text:"",color:"primary",href:t.actionHref}},[t._v("\n      "+t._s(t.actionText)+"\n    ")])],1):t._e()],1)}),[],!1,null,null,null);e.default=component.exports;c()(component,{VAvatar:d.a,VBtn:f.a,VCard:h.a,VCardActions:v.a,VCardText:v.c,VIcon:m.a,VSpacer:_.a})},1892:function(t,e,r){"use strict";r(1869)},1893:function(t,e,r){var n=r(25)(!1);n.push([t.i,".banner-wrapper[data-v-30efedb2]{background:var(--v-primary-base);padding:20px;min-height:400px;display:flex;align-items:center}.banner-title[data-v-30efedb2]{font-size:60px;line-height:50px;margin:20px 0}.banner-subtitle[data-v-30efedb2]{font-size:20px}.section-title[data-v-30efedb2]{font-size:25px;margin:20px;line-height:30px;color:#464e61}.pa-15[data-v-30efedb2]{padding:50px}.light-background[data-v-30efedb2]{background-color:#f2f2f2}.icon-wrapper[data-v-30efedb2]{background-color:#9ca299;border-radius:100%;width:80px;height:80px;text-align:center;line-height:80px;display:inline-block;margin:20px 0 30px}.icon[data-v-30efedb2]{font-size:50px;color:#fff;vertical-align:middle}",""]),t.exports=n},1950:function(t,e,r){"use strict";r.r(e);r(12),r(8),r(19),r(9),r(20);var n=r(2),o=r(13),l=(r(16),r(3),r(65),r(222),r(39),r(57),r(969)),c=r(1863),d=r(1864);function f(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var h={components:{BaseBubbleCard:c.default,BaseTwitterCard:d.default},data:function(){return{tools:[{title:"What we do",text:"Digipower.academy empower people and organisations through the mastery of data and data flows.",icon:"mdiDatabaseCog"},{title:"Who is it for",text:"Business leaders, civil servants, researchers, journalists, teachers, you will find here the resources towards understanding and using data in your field.",icon:"mdiAccountGroup"},{title:"Why is it so special",text:"The sessions take place in the digital life of the participants themselves. They retrieve, explore and make sense of their own data. Highly impactful.",icon:"mdiWeb"}]}},computed:{workshops:function(){var t=this;return Object.entries(this.$store.state.config.bubbleConfig).map((function(t){var e=Object(o.a)(t,2),r=e[0],c=e[1];return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({slug:r},Object(l.a)(c,["title","icon","description","publicKey"]))})).filter((function(e){return(t.$store.state.config.homePageBubbles||[]).includes(e.slug)}))}}},v=h,m=(r(1892),r(40)),_=r(44),y=r.n(_),w=r(1818),C=r(1813),V=r(1123),x=r(971),S=r(958),component=Object(m.a)(v,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"banner-wrapper"},[r("VContainer",[r("VRow",{attrs:{justify:"center"}},[r("VCol",{attrs:{cols:"12",md:"6"}},[r("h1",{staticClass:"banner-title font-weight-bold white--text"},[r("div",[t._v("DIGIPOWER")]),t._v(" "),r("div",{staticClass:"ml-13"},[t._v("\n              .ACADEMY\n            ")])]),t._v(" "),r("h4",{staticClass:"banner-subtitle white--text font-weight-regular"})]),t._v(" "),r("VCol",{attrs:{cols:"12",md:"6"}},[r("BaseQuote",{attrs:{text:"We need to train both the people who are putting data and information out there, as well as those reading it, how to interpret and question it to ensure they understand it and are not being misled or deceived.",author:"Sir Tim Berners-Lee, inventor of the World Wide Web"}})],1)],1)],1)],1),t._v(" "),r("div",{staticClass:"section-wrapper pa-15"},[r("VContainer",[r("VRow",{attrs:{justify:"center"}},t._l(t.tools,(function(e){return r("VCol",{key:e.title,attrs:{cols:"12",md:"4"}},[r("BaseInfoCard",t._b({},"BaseInfoCard",Object.assign({},e),!1))],1)})),1)],1)],1),t._v(" "),r("div",{staticClass:"section-wrapper pa-15 light-background"},[r("VContainer",[r("VRow",{attrs:{justify:"center"}},[r("VCol",{attrs:{cols:"12",sm:"10",md:"9",lg:"7"}},[r("div",{staticClass:"text-center"},[r("h3",{staticClass:"section-title font-weight-medium"},[t._v("\n              Learning programs\n            ")]),t._v(" "),r("p",[t._v("Choose the course(s) of your choice or assemble them to create curricula relevant to your needs.")])])])],1),t._v(" "),r("VRow",{attrs:{justify:"center"}},[t.workshops.length?t._l(t.workshops,(function(e){var title=e.title,n=e.icon,o=e.description,l=e.slug;return r("VCol",{key:l,staticClass:"text-center",attrs:{cols:"12",sm:"6",md:"4",lg:"3"}},[r("BaseBubbleCard",t._b({staticClass:"pa-3"},"BaseBubbleCard",{title:title,description:o,icon:n,slug:l},!1))],1)})):[r("span",{staticClass:"caption"},[t._v("No workshops available right now, please contact us for more informations.")])]],2)],1)],1),t._v(" "),r("div",{staticClass:"section-wrapper pa-15"},[r("VContainer",[r("VRow",{attrs:{justify:"center"}},[r("VCol",{attrs:{cols:"12",sm:"10",md:"9",lg:"7"}},[r("div",{staticClass:"text-center"},[r("h3",{staticClass:"section-title font-weight-medium"},[t._v("\n              Testimonial\n            ")]),t._v(" "),r("p",[t._v("See what our customers say")])])])],1),t._v(" "),r("VRow",[r("VCol",[r("div",{staticClass:"text-center"},[r("VCarousel",{attrs:{height:"420","hide-delimiter-background":"","show-arrows-on-hover":"","delimiter-icon":"$vuetify.icons.mdiMinus",light:""}},[r("VCarouselItem",[r("VRow",{attrs:{align:"center",justify:"center"}},[r("BaseTwitterCard",{attrs:{text:"To hope to effectively regulate the data economy you need to deeply understand the power companies have through the personal data they hold. That's why I am participating in @sitrafund's #digipower investigation using #GDPR rights to get my data. Who will be the most transparent?","tweet-link":"https://twitter.com/jyrkikatainen/status/1455484493897342977?s=20&t=YdTsvxYhUonm0Gxr9nICvw","profile-name":"Jyrki Katainen","profile-description":"Former Prime Minister of Finland and VP of EU Commission","profile-photo":"https://pbs.twimg.com/profile_images/1229410125930270720/MLN38R_9_400x400.jpg"}})],1)],1),t._v(" "),r("VCarouselItem",[r("VRow",{attrs:{align:"center",justify:"center"}},[r("BaseVideo",{attrs:{"video-src":"https://player.vimeo.com/video/689283925?h=4b12093bf4",height:"360"}})],1)],1)],1)],1)])],1)],1)],1)])}),[],!1,null,"30efedb2",null);e.default=component.exports;y()(component,{BaseQuote:r(1885).default,BaseInfoCard:r(1886).default,BaseBubbleCard:r(1863).default,BaseTwitterCard:r(1864).default,BaseVideo:r(1615).default}),y()(component,{VCarousel:w.a,VCarouselItem:C.a,VCol:V.a,VContainer:x.a,VRow:S.a})}}]);
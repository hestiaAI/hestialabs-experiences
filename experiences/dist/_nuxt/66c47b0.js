(window.webpackJsonp=window.webpackJsonp||[]).push([[24,15],{1160:function(t,e,r){"use strict";r(28);e.a={computed:{defaultSubtitle:function(){return this.$tc("Data Experience",1)}},methods:{kTitle:function(t,e){var r,n=this.$route.params.bubble;n&&(r=this.$store.state.config.bubbleConfig[n]);var o=this.$store.getters["xp/experienceNameAndTagFromConfig"](t,this.$store.state.config,r);return"experiences.".concat(o,".intro.").concat(e)},title:function(t){return this.$tev(this.kTitle(t,"title"),t.title)},subtitle:function(t){return this.$tev(this.kTitle(t,"subtitle"),t.subtitle||this.defaultSubtitle)}}}},1170:function(t,e,r){var content=r(1193);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(27).default)("7b70526b",content,!0,{sourceMap:!1})},1190:function(t,e,r){"use strict";e.a={props:{experiences:{type:Array,required:!0}},methods:{menuItemAttrs:function(t){var e=t.url,r=t.slug,n=t.disabled,o=this.$route.params.bubble;return e?{href:e,target:"_blank",rel:"noopener noreferrer",disabled:n}:n?{disabled:n}:{nuxt:!0,exact:!0,to:this.localePath({name:"".concat(o?"space-bubble-":"","experience-experience"),params:{bubble:o,experience:r}})}}}}},1191:function(t,e,r){var content=r(1215);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(27).default)("269c3abe",content,!0,{sourceMap:!1})},1192:function(t,e,r){"use strict";r(1170)},1193:function(t,e,r){var n=r(26)((function(i){return i[1]}));n.push([t.i,".link[data-v-81df63ca]{float:right;margin-top:1em}",""]),n.locals={},t.exports=n},1207:function(t,e,r){"use strict";r.r(e);var n=r(1133),o=(r(50),r(71),r(28),r(25),r(74),{name:"BaseVideo",props:{title:{type:String,default:function(){return""}},videoSrc:{type:String,required:!0},width:{type:String,default:function(){return"500px"}},height:{type:String,default:function(){return"300px"}},caption:{type:String,default:function(){return""}}},computed:{url:function(){var t=this.videoSrc.split("/").pop();return t?this.videoSrc.includes("vimeo.com")?"https://player.vimeo.com/video/".concat(t):this.videoSrc.includes("youtube.com")?"https://www.youtube.com/embed/".concat(t):this.videoSrc.includes("twitch.tv")?"https://player.twitch.tv/?video=".concat(t,"&parent=").concat(this.host,"&autoplay=false"):null:null},host:function(){return window?window.location.host.toLowerCase().replace(/www./g,"").split(":")[0]:null}}}),c=(r(1192),r(49)),component=Object(c.a)(o,(function(){var t=this,e=t._self._c;return e("div",{staticStyle:{width:"100%"}},[e("div",{staticClass:"overline text-center"},[t._v("\n    "+t._s(t.title)+"\n  ")]),t._v(" "),t.url?t._e():e(n.a,{attrs:{color:"red",dense:"",type:"error"}},[t._v("\n    The video link provided is not recognized\n  ")]),t._v(" "),t.url?e("iframe",{staticClass:"pa-3 video",attrs:{src:t.url,width:t.width,height:t.height,frameborder:"0",allow:"autoplay; fullscreen; picture-in-picture",allowfullscreen:""}}):t._e()],1)}),[],!1,null,"81df63ca",null);e.default=component.exports},1214:function(t,e,r){"use strict";r(1191)},1215:function(t,e,r){var n=r(26)((function(i){return i[1]}));n.push([t.i,".v-card--link[data-v-6fd5a81e]:before{background:none}",""]),n.locals={},t.exports=n},1277:function(t,e,r){var content=r(1370);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(27).default)("4034fb52",content,!0,{sourceMap:!1})},1352:function(t,e,r){"use strict";r.r(e);var n=r(422),o=r(264),c=r(1143),l=r(1134),d=r(416),h=r(1126),f=(r(4),r(42),{name:"BaseInfoCard",props:{title:{type:String,required:!0},text:{type:String,required:!0},icon:{type:String,required:!0},actionText:{type:String,default:""},actionHref:{type:String,default:""}},computed:{mdiIcon:function(){return this.$vuetify.icons.values[this.icon]}},method:{scrollToElement:function(){var t=this.$refs.scrollToMe;t&&t.scrollIntoView({behavior:"smooth"})}}}),m=r(49),component=Object(m.a)(f,(function(){var t=this,e=t._self._c;return e(c.a,{staticClass:"d-flex flex-column",attrs:{flat:"",height:"100%"}},[e(l.c,[e(n.a,{staticClass:"mb-6",attrs:{color:"primary",size:"80"}},[e(d.a,{staticClass:"pa-5",attrs:{dark:""}},[t._v("\n        "+t._s(t.mdiIcon)+"\n      ")])],1),t._v(" "),e("h4",{staticClass:"text-subtitle-1 font-weight-bold"},[t._v("\n      "+t._s(t.title)+"\n    ")]),t._v(" "),e("p",{staticClass:"mt-3 mb-3"},[t._v("\n      "+t._s(t.text)+"\n    ")])],1),t._v(" "),e(h.a),t._v(" "),t.actionText?e(l.a,[e(o.a,{attrs:{text:"",color:"primary",href:t.actionHref}},[t._v("\n      "+t._s(t.actionText)+"\n    ")])],1):t._e()],1)}),[],!1,null,null,null);e.default=component.exports},1353:function(t,e,r){"use strict";r.r(e);var n=r(422),o=r(1143),c=r(1134),l=r(1180),d=r(338),h=r(1120),f=r(180),m=["icon"],v=r(1190),y=r(1160),w={mixins:[v.a,y.a]},A=(r(1214),r(49)),component=Object(A.a)(w,(function(){var t=this,e=t._self._c;return e(h.a,{staticClass:"mt-3 mb-6"},t._l(t.experiences,(function(r,h){var v=r.icon,y=Object(f.a)(r,m);return e(l.a,{key:h,attrs:{cols:"12",sm:"6",md:"4",lg:"3"}},[e(o.a,t._b({staticClass:"pa-3",attrs:{hover:"",height:"100%"}},"VCard",t.menuItemAttrs(y),!1),[e("div",{staticClass:"text-center"},[e(n.a,{attrs:{size:"150",tile:""}},[e(d.a,{staticClass:"mt-3",attrs:{contain:"",src:v,"lazy-src":v}})],1)],1),t._v(" "),e(c.d,{staticClass:"justify-center"},[t._v("\n        "+t._s(t.title(y))+"\n      ")]),t._v(" "),e(c.b,{staticClass:"subtitle-1 text-center"},[t._v("\n        "+t._s(t.subtitle(y))+"\n      ")])],1)],1)})),1)}),[],!1,null,"6fd5a81e",null);e.default=component.exports},1354:function(t,e,r){"use strict";r.r(e);var n=r(422),o=r(1143),c=r(1134),l=r(338),d=(r(8),r(67),{name:"BaseBubbleCard",props:{title:{type:String,required:!0},description:{type:String,default:""},slug:{type:String,required:!0},icon:{type:String,required:!0}}}),h=r(49),component=Object(h.a)(d,(function(){var t=this,e=t._self._c;return e(o.a,{attrs:{height:"100%",nuxt:"",to:t.localePath({name:"space-bubble",params:{bubble:t.slug}}),hover:""}},[e(c.c,[e(n.a,{attrs:{size:"200",tile:""}},[e(l.a,{attrs:{src:t.icon,"lazy-src":t.icon,contain:""}})],1),t._v(" "),e("h4",{staticClass:"text-subtitle-1 font-weight-bold"},[t._v("\n      "+t._s(t.title)+"\n    ")]),t._v(" "),e("p",[t._v(t._s(t.description))])],1)],1)}),[],!1,null,null,null);e.default=component.exports},1355:function(t,e,r){"use strict";r.r(e);var n=r(1143),o=r(1134),c=r(416),l=r(338),d=r(265),h=r(421),f=r(271),m=(r(628),r(31),r(8),r(67),{name:"BaseTwitterCard",props:{text:{type:String,default:""},name:{type:String,default:""},description:{type:String,default:""},photo:{type:String,default:""},link:{type:String,default:""},twitter:{type:Boolean,default:!1}}}),v=r(49),component=Object(v.a)(m,(function(){var t=this,e=t._self._c;return e(n.a,{staticClass:"mx-auto ma-3",attrs:{color:"primary",dark:"","max-width":"400",href:t.link,hover:""}},[t.twitter?e(o.d,[e(c.a,{attrs:{large:"",left:""}},[t._v("\n      $vuetify.icons.mdiTwitter\n    ")]),t._v(" "),e("span",{staticClass:"text-h6 font-weight-light"},[t._v("Twitter")])],1):t._e(),t._v(" "),e(o.c,{staticClass:"text-subtitle-1 font-weight-bold pr-5 pl-5"},[t._v('\n    "'+t._s(t.text)+'"\n  ')]),t._v(" "),e(o.a,[e(d.a,{staticClass:"grow"},[e(h.a,{attrs:{color:"grey darken-3"}},[e(l.a,{staticClass:"elevation-6",attrs:{alt:"",src:t.photo}})],1),t._v(" "),e(f.a,[e(f.c,{staticClass:"font-weight-bold"},[t._v("\n          "+t._s(t.name)+"\n        ")]),t._v(" "),e("div",[t._v(t._s(t.description))])],1)],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports},1369:function(t,e,r){"use strict";r(1277)},1370:function(t,e,r){var n=r(26)((function(i){return i[1]}));n.push([t.i,".banner-wrapper[data-v-14de141c]{align-items:center;background:var(--v-primary-base);display:flex;min-height:400px;padding:20px}.banner-title[data-v-14de141c]{display:inline-block;font-size:6.5vw;line-height:1.1em;margin:20px 0}.banner-subtitle[data-v-14de141c]{font-size:20px}.section-title[data-v-14de141c]{color:#464e61;font-size:25px;line-height:30px;margin:20px}.pa-15[data-v-14de141c]{padding:50px}.light-background[data-v-14de141c]{background-color:#f2f2f2}.icon-wrapper[data-v-14de141c]{background-color:#9ca299;border-radius:100%;display:inline-block;height:80px;line-height:80px;margin:20px 0 30px;text-align:center;width:80px}.icon[data-v-14de141c]{color:#fff;font-size:50px;vertical-align:middle}",""]),n.locals={},t.exports=n},1549:function(t,e,r){"use strict";r.r(e);var n=r(1143),o=r(1134),c=r(1562),l=r(1563),d=r(1180),h=r(1132),f=r(1211),m=r(419),v=r(265),y=r(1120),w=(r(11),r(8),r(12),r(4),r(15),r(10),r(16),r(1));function A(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function x(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?A(Object(source),!0).forEach((function(e){Object(w.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):A(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var C=r(18),j=(r(69),r(229),r(50),r(71),r(1350));function k(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var O={data:function(){return{tools:[{title:"What we do",text:"Digipower.academy empower people and organisations through the mastery of data and data flows.",icon:"mdiDatabaseCog"},{title:"Who is it for",text:"Business leaders, civil servants, researchers, journalists, teachers, you will find here the resources towards understanding and using data in your field.",icon:"mdiAccountGroup"},{title:"Why is it so special",text:"The sessions take place in the digital life of the participants themselves. They retrieve, explore and make sense of their own data. Highly impactful.",icon:"mdiWeb"}],events:[{month:"Nov",day:"17",time:"9 pm CET",theme:"Linkedin",title:"Identify your company's strengths and weaknesses and create engagement through employee Linkedin data.",language:"FR"},{month:"Nov",day:"24",time:"9 pm CET",theme:"Tracking trackers (ios + Android) + App Audit - Use case: EdTech solutions (Moodle, Blackboard, Canva ?)",title:"Improve transparency and build trust with audits of your sites and apps.",language:"EN"},{month:"Dec",day:"1",time:"9 pm CET",theme:"Tinder + Her + Twitter including aggregation as an example of Digipower tools used for teaching & reseearch",title:"Data analysis as a teaching and research tool (featuring Sciences Po professors)",language:"EN"}],videos:["https://player.twitch.tv/?video=1648947472&parent=localhost&parent=digipower.academy&autoplay=false","https://player.twitch.tv/?video=1648959623&parent=digipower.academy&parent=localhost&autoplay=false","https://player.twitch.tv/?video=1648971525&parent=digipower.academy&parent=localhost&autoplay=false"],testimonials:[{text:"Les géants du web ont fait de nous des datas, mais ça n'est pas une fatalité. Aujourd'hui il est temps de renverser la tendance, de réagir en reprenant la main sur nos données personelles. Nous avons des droits, exerçons-les!",link:"https://twitter.com/jyrkikatainen/status/1455484493897342977?s=20&t=YdTsvxYhUonm0Gxr9nICvw",name:"Alain Bazot",description:"Président de l'UFC- QUE CHOISIR",photo:"https://pbs.twimg.com/profile_images/914770787764260865/PioYDllJ_400x400.jpg",twitter:!1},{text:"To hope to effectively regulate the data economy you need to deeply understand the power companies have through the personal data they hold. That's why I am participating in @sitrafund's #digipower investigation using #GDPR rights to get my data. Who will be the most transparent?",link:"https://twitter.com/jyrkikatainen/status/1455484493897342977?s=20&t=YdTsvxYhUonm0Gxr9nICvw",name:"Jyrki Katainen",description:"Former Prime Minister of Finland and VP of EU Commission",photo:"https://pbs.twimg.com/profile_images/1229410125930270720/MLN38R_9_400x400.jpg",twitter:!0},{text:"You should do it! You can download your data, it doesn't take very long. I'm not a technical person, I'm not a computer scientist and this experience was enlightening. If you can do it, I would recommend it.",link:"https://youtu.be/CkxtsAYIZtM?t=3061",name:"Mark Scott",description:"Chief Technology Correspondent at POLITICO",photo:"https://www.politico.eu/cdn-cgi/image/width=480,quality=80,onerror=redirect,format=auto/wp-content/uploads/2017/07/MarkScott.jpeg",twitter:!1},{text:"What surprised me most was the data collected by Uber. Uber had information that even my colleagues didn’t have – they know the location of my office and where my friends live. Some websites, such as the newspaper Le Monde did the same. They rely on people not asking for their data.",link:"https://twitter.com/SitraFund/status/1529092653459116033?s=20&t=AOR5HO2lXcgooLfnb00WSA",name:"Leïla Chaibi",description:"Member of the European Parliament",photo:"https://pbs.twimg.com/profile_images/1562443761849749504/KcfCN2NG_400x400.jpg",twitter:!1},{text:"Nous étions les premiers à comprendre les enjeux sur la question des données (#data). @podehaye était la pour accompagner notre démarche avec les outils nécessaires qui nous ont permis à la fin de saisir @CNIL. Merci à Paul 🙏",link:"https://twitter.com/BENALIBrahim20/status/1576878448890761216?s=20&t=3Wzb0JsvUHgWAp2RVfB_rg",name:"Brahim Ben Ali",description:"General Secretary of the VTC drivers' union INV",photo:"https://pbs.twimg.com/profile_images/1284456830987632641/wejXQQi9_400x400.jpg",twitter:!0},{text:"That was really exciting! You are doing an outstanding job in an area that is still to be explored. Thank you.",name:"Giuseppe Luciano",description:"Chief Customer Officer at TL",photo:"data:image/jpeg;base64,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",twitter:!1},{text:"Je voulais comprendre le fonctionnement des plateformes numériques et savoir comment les réseaux sociaux faisaient pour avoir accès à mes données.",name:"Christian Dandrès",description:"Conseiller national, PS, Genève",link:"https://www.heidi.news/explorations/surveillance-numerique-jusqu-ou-sommes-nous-traques/comment-les-elus-a-berne-sont-influences-jusque-sur-twitter",photo:"https://pbs.twimg.com/profile_images/1504044101796306956/DRXGLIcJ_400x400.jpg",twitter:!1}]}},computed:{workshops:function(){var t=this,e=this.$store.state.config.bubbleConfig||{};return Object.entries(e).map((function(t){var e=Object(C.a)(t,2),r=e[0],n=e[1];return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?k(Object(source),!0).forEach((function(e){Object(w.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):k(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({slug:r},Object(j.a)(n,["title","icon","description"]))})).filter((function(e){return(t.$store.state.config.homePageBubbles||[]).includes(e.slug)}))},experiences:function(){var t=this;return["twitter","facebook","google","tracker-control"].map((function(e){return t.$store.state.experiences[e]})).filter((function(t){return t}))}}},S=O,E=(r(1369),r(49)),component=Object(E.a)(S,(function(){var t=this,e=t._self._c;return e("div",[e("div",{staticClass:"banner-wrapper"},[e(h.a,[e("div",{staticClass:"text-center"},[e("h1",{staticClass:"banner-title font-weight-bold white--text text-uppercase text-break"},[t._v("\n          Analyze Your Data\n        ")])])])],1),t._v(" "),e("div",{staticClass:"section-wrapper pa-15"},[e(h.a,[e(y.a,{attrs:{justify:"center"}},t._l(t.tools,(function(r){return e(d.a,{key:r.title,attrs:{cols:"12",md:"4"}},[e("BaseInfoCard",t._b({},"BaseInfoCard",x({},r),!1))],1)})),1)],1)],1),t._v(" "),e("div",{staticClass:"section-wrapper pa-15 light-background"},[e(h.a,[e(y.a,{attrs:{justify:"center"}},[e(d.a,{attrs:{cols:"12",sm:"10",md:"9",lg:"7"}},[e("div",{staticClass:"text-center"},[e("h3",{staticClass:"section-title font-weight-medium"},[t._v("\n              Demos\n            ")]),t._v(" "),e("p",[t._v("Watch our live demonstrations")])])])],1),t._v(" "),e(y.a,[e(d.a,{attrs:{cols:"12",md:"6"}},[e(n.a,{attrs:{height:"400",flat:""}},[e(o.d,[t._v("Join the next demos")]),t._v(" "),e(m.a,{staticClass:"pa-6",attrs:{"three-line":""}},[t._l(t.events,(function(r,n){return[n?e(f.a,{key:n,attrs:{inset:!0}}):t._e(),t._v(" "),e(v.a,{key:r.title},[e("div",{staticClass:"text-center"},[e("div",[t._v(t._s(r.month))]),t._v(" "),e("div",{staticClass:"text-h6"},[t._v("\n                      "+t._s(r.day)+"\n                    ")])]),t._v(" "),e("div",{staticClass:"ml-6"},[e("div",{staticClass:"text-caption"},[t._v("\n                      "+t._s(r.time)+"\n                    ")]),t._v(" "),e("div",[t._v(" "+t._s(r.title))])])])]}))],2)],1)],1),t._v(" "),e(d.a,{attrs:{cols:"12",md:"6"}},[e(n.a,{attrs:{height:"400",flat:"",color:"transparent"}},[e(o.d,{staticClass:"justify-center"},[t._v("\n              Replay the last Demos\n            ")]),t._v(" "),e(c.a,{attrs:{height:"340","hide-delimiter-background":"","show-arrows-on-hover":"","delimiter-icon":"$vuetify.icons.mdiMinus",light:""}},t._l(t.videos,(function(t,r){return e(l.a,{key:r},[e(y.a,{attrs:{align:"center",justify:"center"}},[e("iframe",{attrs:{src:t,frameborder:"0",scrolling:"no",allowfullscreen:"true",height:"300",width:"70%"}})])],1)})),1)],1)],1)],1)],1)],1),t._v(" "),e("div",{staticClass:"section-wrapper pa-15"},[e(h.a,[e(y.a,{attrs:{justify:"center"}},[e(d.a,{attrs:{cols:"12",sm:"10",md:"9",lg:"7"}},[e("div",{staticClass:"text-center"},[e("h3",{staticClass:"section-title font-weight-medium"},[t._v("\n              Showroom\n            ")]),t._v(" "),e("p",[t._v("Try out some of our experiences for free")])])])],1),t._v(" "),e(y.a,{attrs:{justify:"center"}},[e("TheExperienceMenuCards",{staticClass:"pa-3",attrs:{experiences:t.experiences}})],1)],1)],1),t._v(" "),e("div",{staticClass:"section-wrapper pa-15 light-background"},[e(h.a,[e(y.a,{attrs:{justify:"center"}},[e(d.a,{attrs:{cols:"12",sm:"10",md:"9",lg:"7"}},[e("div",{staticClass:"text-center"},[e("h3",{staticClass:"section-title font-weight-medium"},[t._v("\n              Learning programs\n            ")]),t._v(" "),e("p",[t._v("Choose the course(s) of your choice or assemble them to create curricula relevant to your needs.")])])])],1),t._v(" "),e(y.a,{attrs:{justify:"center"}},[t.workshops.length?t._l(t.workshops,(function(r,n){return e(d.a,{key:n,staticClass:"text-center",attrs:{cols:"12",sm:"6",md:"4",lg:"3"}},[e("BaseBubbleCard",t._b({staticClass:"pa-3"},"BaseBubbleCard",r,!1))],1)})):[e("span",{staticClass:"caption"},[t._v("No workshops available right now, please contact us for more informations.")])]],2)],1)],1),t._v(" "),e("div",{staticClass:"section-wrapper pa-15"},[e(h.a,[e(y.a,{attrs:{justify:"center"}},[e(d.a,{attrs:{cols:"12",sm:"10",md:"9",lg:"7"}},[e("div",{staticClass:"text-center"},[e("h3",{staticClass:"section-title font-weight-medium"},[t._v("\n              Testimonial\n            ")]),t._v(" "),e("p",[t._v("See what our customers say")])])])],1),t._v(" "),e(y.a,[e(d.a,[e("div",{staticClass:"text-center"},[e(c.a,{attrs:{height:"480","hide-delimiter-background":"","show-arrows-on-hover":"","delimiter-icon":"$vuetify.icons.mdiMinus",light:""}},[t._l(t.testimonials,(function(r,n){return e(l.a,{key:n},[e(y.a,{staticClass:"fill-height",attrs:{align:"center",justify:"center"}},[e("BaseQuoteCard",t._b({},"BaseQuoteCard",x({},r),!1))],1)],1)})),t._v(" "),e(l.a,[e(y.a,{staticClass:"fill-height",attrs:{align:"center",justify:"center"}},[e("BaseVideo",{attrs:{"video-src":"https://player.vimeo.com/video/689283925?h=4b12093bf4",height:"360"}})],1)],1)],2)],1)])],1)],1)],1)])}),[],!1,null,"14de141c",null);e.default=component.exports;installComponents(component,{BaseInfoCard:r(1352).default,TheExperienceMenuCards:r(1353).default,BaseBubbleCard:r(1354).default,BaseQuoteCard:r(1355).default,BaseVideo:r(1207).default})}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[11,20],{1108:function(e,t,n){"use strict";n(31);t.a={methods:{vueMeta:function(title){var content="".concat(title," | ").concat(this.$t("app.name"));return{title:title,meta:[{hid:"og:title",property:"og:title",content:content},{hid:"twitter:title",property:"twitter:title",content:content}]}}}}},1116:function(e,t,n){"use strict";n(31);t.a={computed:{defaultSubtitle:function(){return this.$tc("Data Experience",1)}},methods:{kTitle:function(e,t){var n,r=this.$route.params.bubble;r&&(n=this.$store.state.config.bubbleConfig[r]);var c=this.$store.getters["xp/experienceNameAndTagFromConfig"](e,this.$store.state.config,n);return"experiences.".concat(c,".intro.").concat(t)},title:function(e){return this.$tev(this.kTitle(e,"title"),e.title)},subtitle:function(e){return this.$tev(this.kTitle(e,"subtitle"),e.subtitle||this.defaultSubtitle)}}}},1134:function(e,t,n){"use strict";n.r(t),n.d(t,"validateBubble",(function(){return c})),n.d(t,"validateExperience",(function(){return o}));var r=n(5),c=(n(50),n(69),function(e){var t=e.store,n=e.params;return t.state.config.bubbles.includes(n.bubble)}),o=function(e){var t=e.store,n=e.route,c=t.getters.experience(n);return"object"===Object(r.a)(c)&&!c.disabled};t.default={bubble:c,experience:o}},1181:function(e,t,n){"use strict";var r=n(1092),c=n(1108),o=n(1116);t.a=Object(r.a)(c.a,o.a,{computed:{experienceConfig:function(){return this.$store.getters.experience(this.$route)},siteConfig:function(){return this.$store.state.config},experienceTitle:function(){return this.title(this.experienceConfig)},experienceSubtitle:function(){return this.subtitle(this.experienceConfig)}}})},1392:function(e,t,n){"use strict";n.r(t);n(31);var r=n(1134),c={mixins:[n(1181).a],validate:function(e){return r.default.experience(e)},head:function(){var e=this.experienceTitle,s=this.experienceSubtitle,t="".concat(e,": ").concat(s);return this.vueMeta(t)}},o=n(49),component=Object(o.a)(c,(function(){var e=this;return(0,e._self._c)("TheDataExperience",e._b({},"TheDataExperience",{experienceConfig:e.experienceConfig,siteConfig:e.siteConfig},!1))}),[],!1,null,null,null);t.default=component.exports}}]);
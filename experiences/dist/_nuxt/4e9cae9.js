(window.webpackJsonp=window.webpackJsonp||[]).push([[162,169],{1719:function(t,e,n){"use strict";n(28);e.a={methods:{vueMeta:function(title){var content="".concat(title," | ").concat(this.$t("app.name"));return{title:title,meta:[{hid:"og:title",property:"og:title",content:content},{hid:"twitter:title",property:"twitter:title",content:content}]}}}}},1747:function(t,e,n){"use strict";n.r(e),n.d(e,"validateBubble",(function(){return r})),n.d(e,"validateExperience",(function(){return c}));n(39),n(57),n(94),n(3);var r=function(t){var e=t.store,n=t.params;return e.state.config.bubbles.includes(n.bubble)},c=function(t){var e=t.store,n=t.params,r=n.experience,c=n.bubble;return e.getters.enabledExperiences.find((function(t){return t.slug===r}))&&(!c||e.state.config.bubbleConfig[c].experiences.includes(r))};e.default={bubble:r,experience:c}},1932:function(t,e,n){"use strict";n.r(e);n(28);var r=n(1747),c={mixins:[n(1719).a],middleware:"auth",validate:function(t){return r.default.bubble(t)},head:function(){var t=this.$tc("Bubble",1),e=this.bubble.title,title="fr"===this.$i18n.locale?"".concat(t," ").concat(e):"".concat(e," ").concat(t);return this.vueMeta(title)},computed:{bubble:function(){return this.$store.state.config.bubbleConfig[this.$route.params.bubble]}}},o=n(40),l=n(44),d=n.n(l),f=n(959),h=n(334),component=Object(o.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("VContainer",{staticClass:"mt-6"},[n("div",{staticClass:"d-flex mt-3"},[n("h1",{staticClass:"text-h4 font-weight-bold mr-6",domProps:{textContent:t._s(t.bubble.title)}}),t._v(" "),n("VImg",{attrs:{"max-width":"50",src:t.bubble.icon,"lazy-src":t.bubble.icon,contain:""}})],1),t._v(" "),n("div",{staticClass:"subtitle-2",domProps:{textContent:t._s(t.bubble.description)}}),t._v(" "),n("p",{staticClass:"mt-3 text-justify",domProps:{innerHTML:t._s(t.bubble.content)}}),t._v(" "),n("TheExperienceMenu",{attrs:{cards:t.$vuetify.breakpoint.smAndUp,include:t.bubble.experiences,"hide-collaborators":""}})],1)}),[],!1,null,null,null);e.default=component.exports;d()(component,{TheExperienceMenu:n(665).default}),d()(component,{VContainer:f.a,VImg:h.a})}}]);
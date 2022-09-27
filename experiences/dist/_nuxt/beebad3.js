(window.webpackJsonp=window.webpackJsonp||[]).push([[169,99],{1609:function(e,t,r){"use strict";r.r(t);var n=r(12),o={props:{errorMessage:{type:String,default:""}},data:function(){return{password:"",passwordType:"password",passwordAppendIcon:n.z,errorMessages:this.errorMessage}},watch:{password:function(e){this.errorMessages="",this.$emit("update:value",e)}},methods:{onClickAppend:function(){"password"===this.passwordType?(this.passwordType="text",this.passwordAppendIcon=n.A):(this.passwordType="password",this.passwordAppendIcon=n.z)}}},c=r(40),d=r(44),l=r.n(d),h=r(1111),component=Object(c.a)(o,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("VTextField",e._b({attrs:{label:"Password",placeholder:"Type...",required:"",type:e.passwordType,"append-icon":e.passwordAppendIcon,"error-count":"10","error-messages":e.errorMessages},on:{"click:append":e.onClickAppend},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}},"VTextField",e.$attrs,!1))}),[],!1,null,null,null);t.default=component.exports;l()(component,{VTextField:h.a})},1723:function(e,t,r){"use strict";r(28);t.a={methods:{vueMeta:function(title){var content="".concat(title," | ").concat(this.$t("app.name"));return{title:title,meta:[{hid:"og:title",property:"og:title",content:content},{hid:"twitter:title",property:"twitter:title",content:content}]}}}}},1810:function(e,t,r){"use strict";var n=r(2),o=(r(39),r(57),r(343),r(14),r(3),r(9),r(87),r(94),r(10),r(8),r(19),r(20),r(11)),c=r(178),d=r(264);function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function h(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}t.a=Object(o.a)(c.a,Object(d.b)("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(e){var t=Object.values(e).includes(!0);this.$emit("input",!t)},deep:!0,immediate:!0}},methods:{watchInput:function(input){var e=this,t=function(input){return input.$watch("hasError",(function(t){e.$set(e.errorBag,input._uid,t)}),{immediate:!0})},r={_uid:input._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?r.shouldValidate=input.$watch("shouldValidate",(function(n){n&&(e.errorBag.hasOwnProperty(input._uid)||(r.valid=t(input)))})):r.valid=t(input),r},validate:function(){return 0===this.inputs.filter((function(input){return!input.validate(!0)})).length},reset:function(){this.inputs.forEach((function(input){return input.reset()})),this.resetErrorBag()},resetErrorBag:function(){var e=this;this.lazyValidation&&setTimeout((function(){e.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(input){return input.resetValidation()})),this.resetErrorBag()},register:function(input){this.inputs.push(input),this.watchers.push(this.watchInput(input))},unregister:function(input){var e=this.inputs.find((function(i){return i._uid===input._uid}));if(e){var t=this.watchers.find((function(i){return i._uid===e._uid}));t&&(t.valid(),t.shouldValidate()),this.watchers=this.watchers.filter((function(i){return i._uid!==e._uid})),this.inputs=this.inputs.filter((function(i){return i._uid!==e._uid})),this.$delete(this.errorBag,e._uid)}}},render:function(e){var t=this;return e("form",{staticClass:"v-form",attrs:h({novalidate:!0},this.attrs$),on:{submit:function(e){return t.$emit("submit",e)}}},this.$slots.default)}})},1946:function(e,t,r){"use strict";r.r(t);var n=r(21),o=(r(77),r(22),r(154),r(39),r(57),r(1723)),c=function(){var path=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=path.match(/\/bubble\/([^/]+)(?:\/|$)/);return e&&2===e.length?e[1]:null},d={mixins:[o.a],auth:"guest",middleware:function(e){var t=e.app,r=e.$auth,n=e.redirect,o=e.route,c=e.error;return e.from&&r.loggedIn?t.router.go(-1):o.query.redirect?void r.$storage.setState("redirect",o.query.redirect):r.$state.redirect?n(t.localePath({name:"login",query:{redirect:r.$state.redirect}})):c({statusCode:404,message:"Page Not Found"})},validate:function(e){var t=e.$auth,r=e.store.state.config.bubbles,n=c(t.$state.redirect);return!!r.includes(n)},data:function(){return{errorMessage:"",password:""}},head:function(){return this.vueMeta("Login")},computed:{username:function(){return c(this.$route.query.redirect)}},watch:{$route:function(){this.$refs.password.$children[0].$refs.input.focus()}},methods:{login:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var r,n,o,c,d;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,r=e.username,n=e.password){t.next=5;break}return e.errorMessage="Please enter the password",t.abrupt("return");case 5:return t.next=7,e.$auth.loginWith("local",{data:{username:r,password:n}});case 7:o=t.sent,c=e.$store.state.config.bubbleConfig[r],e.$auth.setUser({username:r,password:n,bubble:c}),console.info(o.statusText),t.next=17;break;case 13:t.prev=13,t.t0=t.catch(0),403===(d=t.t0.response).status?e.errorMessage="You entered an incorrect password, please try again":(e.errorMessage=["An unknown error occurred, we apologize for the inconvenience.","Please report the error via e-mail to contact@hestialabs.org)","Status text: ".concat(d.statusText)],console.error(d));case 17:case"end":return t.stop()}}),t,null,[[0,13]])})))()}}},l=r(40),h=r(44),f=r.n(h),w=r(959),m=r(1810),v=r(1111),component=Object(l.a)(d,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VContainer",{staticClass:"mt-16",staticStyle:{"max-width":"400px"},attrs:{fluid:""}},[r("h1",{staticClass:"text-h4 mb-6"},[e._v("\n    Bubble Login\n  ")]),e._v(" "),r("VForm",{on:{submit:function(t){return t.preventDefault(),e.login.apply(null,arguments)}}},[r("VTextField",{attrs:{value:e.username,label:"Username",readonly:""}}),e._v(" "),r("BasePasswordField",{ref:"password",attrs:{value:e.password,"error-message":e.errorMessage,autofocus:""},on:{"update:value":function(t){e.password=t}}}),e._v(" "),r("BaseButton",{attrs:{type:"submit"}},[e._v("\n      Login\n    ")])],1)],1)}),[],!1,null,null,null);t.default=component.exports;f()(component,{BasePasswordField:r(1609).default,BaseButton:r(595).default}),f()(component,{VContainer:w.a,VForm:m.a,VTextField:v.a})}}]);
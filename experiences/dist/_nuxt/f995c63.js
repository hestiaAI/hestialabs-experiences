(window.webpackJsonp=window.webpackJsonp||[]).push([[28,13,14],{1150:function(e,t,r){"use strict";r(31);t.a={methods:{vueMeta:function(title){var content="".concat(title," | ").concat(this.$t("app.name"));return{title:title,meta:[{hid:"og:title",property:"og:title",content:content},{hid:"twitter:title",property:"twitter:title",content:content}]}}}}},1167:function(e,t,r){"use strict";r.r(t);var n=r(1149),o=r(1140),c=r(1483),l=r(412),d=r(1148),f=(r(43),r(96),{props:{paymentURL:{type:String,required:!0},timeout:{type:Number,default:5e3}},data:function(){return{dialog:!0}},mounted:function(){var e=this;setTimeout((function(){window.location.href=e.paymentURL}),this.timeout)}}),v=r(50),component=Object(v.a)(f,(function(){var e=this,t=e._self._c;return t(c.a,{attrs:{transition:"dialog-bottom-transition","max-width":"600",persistent:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[t(n.a,[t(o.c,{staticClass:"text-center pa-6"},[t(l.a,{staticClass:"mb-3",attrs:{color:"success",size:"100"}},[e._v("\n        $vuetify.icons.mdiCheckCircleOutline\n      ")]),e._v(" "),t("div",{staticClass:"mb-3"},[t("span",{staticClass:"text-h6 font-weight-bold"},[e._v("\n          Votre archive a bien été envoyée!\n        ")])]),e._v(" "),t("span",[e._v("\n        Vous allez être redirigé vers la page de paiement.\n      ")]),e._v(" "),t("div",{staticClass:"ma-3"},[t(d.a,{attrs:{color:"success",indeterminate:"",rounded:"",height:"6"}})],1)],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports},1170:function(e,t,r){var content=r(1194);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(27).default)("8364fc8c",content,!0,{sourceMap:!1})},1182:function(e,t,r){"use strict";r.r(t);var n=r(1138),o=r(1149),c=r(1487),l=r(1482),d=r(1148),f=(r(11),r(9),r(12),r(15),r(16),r(18)),v=r(23),m=r(1),h=(r(90),r(340),r(34),r(108),r(4),r(10),r(224),r(70),r(47),r(44),r(453),r(31),r(87)),y=r(1187),x=r.n(y),_=r(228),w=r(323),O=r(1181),j=r.n(O),C=r(1167);r(28),r(89);function k(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function U(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?k(Object(source),!0).forEach((function(t){Object(m.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):k(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var P={name:"FileUploader",components:{CheckoutDialog:C.default},props:{platform:{type:String,required:!0},country:{type:String,required:!0}},data:function(){return{file:null,progress:!1,uploadPercentage:0,disabled:!1,validated:!1,error:!1,errorMessage:"",success:!1,status:"",successMessage:"Votre archive a bien été envoyée. Nous vous contacterons dès que possible.",fileRules:[function(e){return!!e||"Fichier requis"},function(e){return e&&e.size<5e8||"Le fichier est trop volumineux"},function(e){return e&&e.name.endsWith(".zip")||"Le fichier doit être un zip"}],paymentURL:null,fileType:null,paymentLink:null}},computed:U({},Object(h.c)({encryptionPK:function(e){return e.uploads.encryptionPK},serverlessUrl:function(e){return e.uploads.serverlessUrl},products:function(e){return e.uploads.products}})),watch:{file:function(){this.validated=!1,this.error=!1,this.progress=!1,this.success=!1,this.paymentURL=null,this.paymentLink=null}},methods:{getUberInfos:function(e){var t=this;return Object(v.a)(regeneratorRuntime.mark((function r(){var n,o;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(n=t.products[t.country][t.platform].find((function(e){return e.name===t.fileType}))){r.next=3;break}return r.abrupt("return");case 3:return r.next=5,e.file(j.a.makeRe(n.driverInfos.file))[0].async("text");case 5:return o=r.sent,r.next=8,w.a(o,(function(e){var t={};return Object.entries(n.driverInfos.fields).forEach((function(r){var n=Object(f.a)(r,2),o=n[0],c=n[1];t[o]=e[c]})),t}))[0];case 8:return r.abrupt("return",r.sent);case 9:case"end":return r.stop()}}),r)})))()},getFileType:function(e){var t=this;return this.products[this.country][this.platform].some((function(r){return!!function(e,t){return 0===t.filter((function(t){var r=j.a.makeRe(t);return!e.file(r).length})).length}(e,r.filesNeeded)&&(t.fileType=r.name,t.paymentLink=r.paymentLink,!0)}))},uploadFile:function(){var e=this;return Object(v.a)(regeneratorRuntime.mark((function t(){var r,n,o,c,l,content,d,f,v,m,text,h,y,w,O,j,C,k,P,L;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.$refs.fileForm.validate()){t.next=2;break}return t.abrupt("return");case 2:return e.disabled=!0,e.error=!1,e.progress=!0,e.status="Reading file...",r=new x.a,t.next=9,r.loadAsync(e.file);case 9:if(n=t.sent,e.status="Validating file...",e.error=!e.getFileType(n),!e.error){t.next=17;break}return e.errorMessage='Erreur pendant la validation du fichier: votre archive n\'est pas reconnu par notre système. Si vous rencontrez des problèmes pour récupérer vos données ou si ce message apparait alors que vous avez récemment récupéré vos données en suivant bien le protocole indiqué sur <a href="https://personaldata.io/nos-donnees-nos-projets/mobilite/uber/rgpd/" target="blank">cette page</a>, veuillez nous contacter via <a :href="whatsAppLink" target="blank">Whatsapp</a>',e.disabled=!1,e.progress=!1,t.abrupt("return");case 17:return e.status="Getting file name...",t.next=20,Object(_.hashFile)(e.file);case 20:return o=t.sent,c="Uber_".concat(o,".zip"),e.status="Encrypting file...",l=null,t.prev=24,t.next=27,n.generateAsync({type:"uint8array"});case 27:return content=t.sent,t.next=30,Object(_.encryptFile)(content,e.encryptionPK);case 30:d=t.sent,l=new File([d],c,{type:"application/zip"}),t.next=42;break;case 34:return t.prev=34,t.t0=t.catch(24),e.error=!0,e.disabled=!1,e.progress=!1,e.status="",e.errorMessage="Erreur pendant l'encryption du fichier: "+t.t0.toString(),t.abrupt("return");case 42:return e.status="Getting presigned URL...",f=null,t.prev=44,v=e.serverlessUrl+"getUploadUrl?"+new URLSearchParams({platform:e.platform,country:e.country,name:c}),t.next=48,fetch(v);case 48:if(200===(m=t.sent).status){t.next=54;break}return t.next=52,m.text();case 52:throw text=t.sent,new Error("Le serveur à retourner le code d'erreur ".concat(m.status," : ").concat(text));case 54:return t.next=56,m.json();case 56:if(h=t.sent,f=h.presignedUrl){t.next=60;break}throw new Error("No presigned URL returned");case 60:t.next=70;break;case 62:return t.prev=62,t.t1=t.catch(44),e.error=!0,e.disabled=!1,e.progress=!1,e.status="",e.errorMessage="Erreur pendant la récupération du lien d'upload: "+t.t1.toString(),t.abrupt("return");case 70:return e.status="Uploading file...",t.prev=71,t.next=74,e.$axios.put(f,l,{headers:{"Content-Type":"application/zip"},onUploadProgress:function(t){var progress=Math.round(100*t.loaded/t.total);progress<100&&(e.uploadPercentage=progress)}});case 74:if(200===(y=t.sent).status){t.next=80;break}return t.next=78,y.text();case 78:throw w=t.sent,new Error("Le serveur à retourner le code d'erreur ".concat(y.status," : ").concat(w));case 80:t.next=90;break;case 82:return t.prev=82,t.t2=t.catch(71),e.error=!0,e.disabled=!1,e.progress=!1,e.status="",e.errorMessage="Erreur pendant l'upload du fichier: "+t.t2.toString(),t.abrupt("return");case 90:return e.status="Creating a transaction...",t.next=93,e.getUberInfos(n);case 93:return O=t.sent,j=null,t.prev=95,C=e.serverlessUrl+"createTransaction?"+new URLSearchParams(U({filename:c},O)),t.next=99,fetch(C);case 99:if(200===(k=t.sent).status){t.next=105;break}return t.next=103,k.text();case 103:throw P=t.sent,new Error("Le serveur à retourner le code d'erreur ".concat(k.status," : ").concat(P));case 105:return t.next=107,k.json();case 107:if(L=t.sent,j=L.client_reference_id){t.next=111;break}throw new Error("No clientRefID returned");case 111:t.next=121;break;case 113:return t.prev=113,t.t3=t.catch(95),e.error=!0,e.disabled=!1,e.progress=!1,e.status="",e.errorMessage="Erreur pendant la création de la transaction: "+t.t3.toString(),t.abrupt("return");case 121:e.paymentURL="".concat(e.paymentLink,"?prefilled_email=").concat(O.email,"&client_reference_id=").concat(j,"&locale=fr"),e.status="",e.success=!0,e.disabled=!1,e.progress=!1;case 126:case"end":return t.stop()}}),t,null,[[24,34],[44,62],[71,82],[95,113]])})))()}}},L=r(50),component=Object(L.a)(P,(function(){var e=this,t=e._self._c;return t(o.a,{staticClass:"pa-6",attrs:{outlined:""}},[t(l.a,{ref:"fileForm"},[t(c.a,{staticClass:"mx-auto",attrs:{disabled:e.disabled,rules:e.fileRules,"show-size":"",label:"Sélectionnez votre archive",accept:"application/zip"},model:{value:e.file,callback:function(t){e.file=t},expression:"file"}}),e._v(" "),t("BaseButton",e._b({staticClass:"my-sm-2 mr-sm-4",attrs:{"mdi-icon":"mdiUpload"},on:{click:e.uploadFile}},"BaseButton",{error:e.error,success:e.success,disabled:e.disabled,progress:e.progress},!1),[t("span",[e._v("Transmettez vos données")])]),e._v(" "),e.status?t("div",{domProps:{textContent:e._s(e.status)}}):e._e(),e._v(" "),e.error||e.success?t(n.a,{staticClass:"mt-6 text-left",attrs:{type:e.error?"error":"success",text:""}},[t("div",{domProps:{innerHTML:e._s(e.error?e.errorMessage:e.successMessage)}})]):e._e(),e._v(" "),e.success&&e.paymentURL?t("CheckoutDialog",e._b({},"CheckoutDialog",{paymentURL:e.paymentURL},!1)):e._e()],1),e._v(" "),e.progress&&e.uploadPercentage?t("div",{staticClass:"text-center mt-6"},[t(d.a,{attrs:{value:e.uploadPercentage,color:"primary",height:"4"}}),e._v(" "),t("div",[e._v(e._s(e.uploadPercentage)+"%")])],1):e._e()],1)}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{BaseButton:r(620).default,CheckoutDialog:r(1167).default})},1183:function(e,t,r){"use strict";r(9),r(12),r(15),r(16);var n=r(1),o=(r(4),r(43),r(11),r(28),r(89),r(434),r(47),r(435),r(436),r(437),r(438),r(439),r(440),r(441),r(442),r(443),r(444),r(445),r(446),r(447),r(44),r(51),r(10),r(117),r(452),r(2)),c=r(132),l=r(0);function d(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function f(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var v=["sm","md","lg","xl"],m=v.reduce((function(e,t){return e[t]={type:[Boolean,String,Number],default:!1},e}),{}),h=v.reduce((function(e,t){return e["offset"+Object(l.w)(t)]={type:[String,Number],default:null},e}),{}),y=v.reduce((function(e,t){return e["order"+Object(l.w)(t)]={type:[String,Number],default:null},e}),{}),x={col:Object.keys(m),offset:Object.keys(h),order:Object.keys(y)};function _(e,t,r){var n=e;if(null!=r&&!1!==r){if(t){var o=t.replace(e,"");n+="-".concat(o)}return"col"!==e||""!==r&&!0!==r?(n+="-".concat(r)).toLowerCase():n.toLowerCase()}}var w=new Map;t.a=o.default.extend({name:"v-col",functional:!0,props:f(f(f(f({cols:{type:[Boolean,String,Number],default:!1}},m),{},{offset:{type:[String,Number],default:null}},h),{},{order:{type:[String,Number],default:null}},y),{},{alignSelf:{type:String,default:null,validator:function(e){return["auto","start","end","center","baseline","stretch"].includes(e)}},tag:{type:String,default:"div"}}),render:function(e,t){var r=t.props,data=t.data,o=t.children,l=(t.parent,"");for(var d in r)l+=String(r[d]);var f=w.get(l);return f||function(){var e,t;for(t in f=[],x)x[t].forEach((function(e){var n=r[e],o=_(t,e,n);o&&f.push(o)}));var o=f.some((function(e){return e.startsWith("col-")}));f.push((e={col:!o||!r.cols},Object(n.a)(e,"col-".concat(r.cols),r.cols),Object(n.a)(e,"offset-".concat(r.offset),r.offset),Object(n.a)(e,"order-".concat(r.order),r.order),Object(n.a)(e,"align-self-".concat(r.alignSelf),r.alignSelf),e)),w.set(l,f)}(),e(r.tag,Object(c.a)(data,{class:f}),o)}})},1193:function(e,t,r){"use strict";r(1170)},1194:function(e,t,r){var n=r(26)(!1);n.push([e.i,".card-text[data-v-188d52a8]{color:var(--color)}",""]),e.exports=n},1202:function(e,t,r){"use strict";r.r(t);var n=r(1149),o=r(412),c=r(335),l=(r(11),r(9),r(12),r(4),r(15),r(10),r(16),r(1));function d(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function f(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(t){Object(l.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}r(44);var v={name:"BaseIconCard",inheritAttrs:!1,props:{text:{type:String,default:""},textColor:{type:String,default:"white"},icon:{type:String,default:null},color:{type:String,default:"primary"}},computed:{mdiIcon:function(){return this.$vuetify.icons.values[this.icon]},cssProps:function(){return{"--color":this.textColor}}}},m=(r(1193),r(50)),component=Object(m.a)(v,(function(){var e=this,t=e._self._c;return t(n.a,e._b({staticClass:"pa-2 ma-3",style:e.cssProps},"VCard",f(f({},e.$attrs),{},{color:e.color}),!1),[t("div",{staticClass:"d-flex"},[e.mdiIcon?t(o.a,{attrs:{color:e.textColor}},[e._v("\n      "+e._s(e.mdiIcon)+"\n    ")]):e.icon?t(c.a,{attrs:{src:e.icon,contain:"",width:"24px"}}):e._e(),e._v(" "),t("span",{staticClass:"text-button card-text ml-3"},[e._v(e._s(e.text))])],1)])}),[],!1,null,"188d52a8",null);t.default=component.exports},1314:function(e,t,r){var content=r(1472);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(27).default)("2fd16738",content,!0,{sourceMap:!1})},1471:function(e,t,r){"use strict";r(1314)},1472:function(e,t,r){var n=r(26)(!1);n.push([e.i,".banner-wrapper[data-v-3c52928f]{background:var(--v-primary-base);padding:20px;min-height:300px;display:flex;align-items:center}.banner-title[data-v-3c52928f]{font-size:4.5vw;display:inline-block;line-height:1.1em;margin:20px 0}.section-wrapper[data-v-3c52928f]{margin-top:60px;margin-bottom:40px}",""]),e.exports=n},1496:function(e,t,r){"use strict";r.r(t);var n=r(1183),o=r(1137),c=r(335),l=r(1124),d=r(1150),f={components:{FileUploader:r(1182).default},mixins:[d.a],data:function(){return{whatsAppLink:"https://chat.whatsapp.com/C8NHw4OBveHCTLgWNddD2L",discordLink:"https://discord.gg/MSKQHjEF"}},head:function(){return this.vueMeta("Uber")}},v=(r(1471),r(50)),component=Object(v.a)(f,(function(){var e=this,t=e._self._c;return t("div",[t("div",{staticClass:"banner-wrapper"},[t(o.a,[t("div",{staticClass:"text-center"},[t("h1",{staticClass:"banner-title font-weight-bold white--text text-uppercase text-break"},[e._v("\n          Chauffeurs Uber\n        ")]),e._v(" "),t("h6",{staticClass:"text-h6 white--text"},[e._v("\n          Analysez ici votre activité Uber grâce à vos données.\n        ")])])])],1),e._v(" "),t(o.a,[t("p",{staticClass:"text-h6 mt-6"},[e._v("\n      Nous avons développé un outil pour vous aider à analyser vos données Uber. Cet outil permet de transformer vos données bruts en données comptables. Vous pouvez ensuite les utiliser pour calculer vos arriérés, vos gains et vos coûts. Vous pouvez aussi visualiser votre temps de travail et vos km parcourus, y compris à vide (sans client).\n    ")]),e._v(" "),t("section",{ref:"get-your-data",staticClass:"section-wrapper"},[t(l.a,[t(n.a,{attrs:{cols:"12"}},[t("div",{staticClass:"text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6"},[e._v("\n            Quelle est votre situation ?\n          ")]),e._v(" "),t("div",{staticClass:"text-h5 font-weight-bold blue-grey--text text--darken-2 mb-6"},[e._v("\n            1. Vous avez déjà récupéré vos données\n          ")]),e._v(" "),t("p",{staticClass:"text-h6"},[e._v("\n            Vous avez déjà reçu deux emails « message de Uber », le premier contenant un lien pour accéder à vos données personnelles, le second contenant le mot de passe pour y accéder ?\n          ")]),e._v(" "),t("p",{staticClass:"text-h6"},[e._v("\n            Alors c’est tout bon ! Déposez ci-dessous le fichier .zip récupéré auprès d’Uber pour obtenir l’analyse personnalisée de votre activité. Des éléments à partager avec votre avocat et/ou votre syndicat afin d’engager une procédure légale contre Uber.\n          ")])])],1),e._v(" "),t(l.a,{attrs:{justify:"center"}},[t(n.a,{staticClass:"text-center",attrs:{cols:"12",md:"8",lg:"6","align-self":"center"}},[t("FileUploader",{attrs:{platform:"uber",country:"switzerland"}})],1)],1),e._v(" "),t(l.a,[t(n.a,{attrs:{cols:"12"}},[t("p",{staticClass:"text-h6"},[e._v("\n            Une fois votre archive transmise, vérifiez la boite email associée à votre compte Uber. Après avoir vérifié que la qualité de vos données nous permet de faire une analyse utile, nous vous recontacterons par email. Le lien dans cet email vous permettra de payer 100 € (TTC) pour obtenir votre fichier personnalisé d'analyse de votre activité Uber ainsi que 6 mois de suivi de votre dossier personnalisé (tarif de lancement, susceptible de changer à tout moment). Le détail exact de la prestation sera inclus dans l'email envoyé avant payement.\n          ")])])],1)],1),e._v(" "),t("section",{ref:"get-your-data",staticClass:"section-wrapper"},[t(l.a,[t(n.a,{attrs:{cols:"12"}},[t("div",{staticClass:"text-h5 font-weight-bold blue-grey--text text--darken-2 mb-6"},[e._v("\n            2. Vous n’avez pas encore récupéré vos données Uber?\n          ")]),e._v(" "),t("p",{staticClass:"text-h6"},[e._v("\n            Utilisez votre droit d’accès RGPD pour demander à Uber vos données précises d’activité en suivant\n            "),t("ExternalLink",{attrs:{href:"https://personaldata.io/nos-donnees-nos-projets/mobilite/uber/rgpd/"}},[e._v("\n              le protocole indiqué sur cette page de l’association d’intérêt public PersonalData.io, notre partenaire.\n            ")]),e._v("* L'accompagnement est aussi rendu possible via notre partenaire INV VTC.\n          ")],1),e._v(" "),t("span",{staticClass:"caption"},[e._v("*Que vous travailliez dans un pays de l’UE ("),t("ExternalLink",{attrs:{href:"https://www.privacy-regulation.eu/fr/15.htm"}},[e._v("RGPD art. 15")]),e._v(") ou en Suisse ("),t("ExternalLink",{attrs:{href:"https://www.fedlex.admin.ch/eli/cc/1993/1945_1945_1945/fr#a8"}},[e._v("LPD art. 8")]),e._v("), Uber doit vous donner vos données, c’est la loi.")],1)])],1)],1),e._v(" "),t("section",{staticClass:"section-wrapper"},[t(l.a,[t(n.a,{attrs:{cols:"12"}},[t("div",{staticClass:"text-h5 font-weight-bold blue-grey--text text--darken-2 mb-6"},[e._v("\n            3. Vous avez déjà demandé vos données Uber mais n’avez pas encore reçu le fichier\n          ")]),e._v(" "),t("p",{staticClass:"text-h6"},[e._v("\n            Uber est tenu de vous répondre dans un délai d'un mois au plus tard. Si vous n'avez toujours pas reçu de réponse dans ce délai, vous pouvez nous contacter via "),t("a",{attrs:{href:e.discordLink,target:"blank"}},[e._v("Discord")]),e._v(" ou "),t("a",{attrs:{href:e.whatsAppLink,target:"blank"}},[e._v("Whatsapp")]),e._v(".\n          ")])])],1)],1),e._v(" "),t("section",{staticClass:"section-wrapper"},[t(l.a,[t(n.a,{attrs:{cols:"12"}},[t("div",{staticClass:"text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6"},[e._v("\n            Nos Partenaires\n          ")]),e._v(" "),t(l.a,{attrs:{align:"center"}},[t(n.a,{staticClass:"pa-2",attrs:{cols:"12",md:"4"}},[t(c.a,{attrs:{src:"/personaldataio_logo.jpg",contain:""}})],1),e._v(" "),t(n.a,{staticClass:"pa-2",attrs:{cols:"12",md:"4"}},[t(c.a,{attrs:{src:"/hestiaai_logo.svg",contain:""}})],1),e._v(" "),t(n.a,{staticClass:"pa-2",attrs:{cols:"12",md:"4"}},[t(c.a,{attrs:{src:"/INV-VTC_logo.jpg",contain:""}})],1)],1)],1)],1)],1),e._v(" "),t("section",{ref:"contact",staticClass:"section-wrapper"},[t(l.a,[t(n.a,{attrs:{cols:"12"}},[t("div",{staticClass:"text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6"},[e._v("\n            Besoin d'aide ?\n          ")]),e._v(" "),t("p",{staticClass:"text-h6"},[e._v("\n            Contactez nous via Discord ou WhatsApp, nous vous répondrons dans les plus brefs délais.\n          ")])]),e._v(" "),t(n.a,{attrs:{cols:"12"}},[t("div",{staticClass:"d-flex justify-space-around"},[t("BaseIconCard",{attrs:{href:e.whatsAppLink,icon:"mdiWhatsapp",text:"WhatsApp",color:"#23D366"}}),e._v(" "),t("BaseIconCard",{attrs:{href:e.discordLink,icon:"/discord-mark-white.svg",text:"Discord",color:"#5865F2"}})],1)])],1)],1)])],1)}),[],!1,null,"3c52928f",null);t.default=component.exports;installComponents(component,{FileUploader:r(1182).default,ExternalLink:r(346).default,BaseIconCard:r(1202).default})}}]);
"use strict";(("undefined"!=typeof self?self:this).webpackChunkDataExperience=("undefined"!=typeof self?self:this).webpackChunkDataExperience||[]).push([[3558],{63558:function(e,t,r){r.r(t),r.d(t,{default:function(){return y}});var o=r(74097),l=r(84695),n=r(60194),m={props:{value:{type:Date,default:()=>new Date},label:{type:String,default:"Date"},hint:{type:String,default:""},dateFormat:{type:String,default:"%d/%m/%Y"}},data(){const e=n.timeFormat(this.dateFormat),t=n.timeFormat("%Y-%m-%d"),r=n.timeParse("%Y-%m-%d");return{date:t(this.value),dateFormatted:e(this.value),menu:!1,formatDate:t,parseDate:r,formatDateCustom:e}},watch:{date(){console.log(this.date),this.dateFormatted=this.formatDateCustom(this.parseDate(this.date))}},methods:{handleInput(){this.menu=!1,this.$emit("input",this.parseDate(this.date))}}},c=r(1001),d=(0,c.Z)(m,(function(){var e=this,t=e._self._c;return t("VMenu",{ref:"menu",attrs:{"close-on-content-click":!1,transition:"scale-transition","offset-y":"","max-width":"290px","min-width":"auto"},scopedSlots:e._u([{key:"activator",fn:function({on:r,attrs:o}){return[t("VTextField",e._g(e._b({attrs:{"persistent-hint":"","prepend-icon":"mdi-calendar"},model:{value:e.dateFormatted,callback:function(t){e.dateFormatted=t},expression:"dateFormatted"}},"VTextField",{label:e.label,hint:e.hint,attrs:o},!1),r))]}}]),model:{value:e.menu,callback:function(t){e.menu=t},expression:"menu"}},[t("VDatePicker",{attrs:{"no-title":""},on:{input:e.handleInput},model:{value:e.date,callback:function(t){e.date=t},expression:"date"}})],1)}),[],!1,null,null,null).exports,f=r(60171),h=r(96486),v={components:{UnitFilterableTable:l.Z,BaseDateSelector:d},mixins:[o.default],props:{},data(){const e=n.timeParse("%s"),t=n.extent(this.values,(t=>e(t.begin_ts)));return{drawer:!1,timeParser:e,numberFormatter:n.format(".2s"),aggregations:{Year:n.timeFormat("%Y"),Month:n.timeFormat("%Y/%m"),Week:n.timeFormat("%Y week-%V"),Day:n.timeFormat("%Y/%m/%d")},form:{startDate:t[0],endDate:t[1],groupBy:"Year",kmCost:.7,wage:23.27,c:{weekday:{day:1,night:1.2},weekend:{day:1,night:1.5}}},allValues:[]}},computed:{results(){return(0,f.b1)().key((e=>e[this.form.groupBy])).sortKeys(n.ascending).key((e=>e.status)).key((e=>e.type)).key((e=>e.period)).rollup((e=>({time:n.sum(e,(e=>e.time)),distance:n.sum(e,(e=>e.distance)),price:n.sum(e,(e=>e.price))}))).entries(this.allValues.filter((e=>e.date>=this.form.startDate&&e.date<=this.form.endDate))).flatMap((e=>{const t=e.key;return e.values.flatMap((e=>{const r=e.key;return e.values.flatMap((e=>{const o=e.key;return e.values.map((e=>({[this.form.groupBy]:t,Status:r,Type:o,Period:e.key,Km:e.value.distance,"Time (hr)":e.value.time,"Km Cost to be covered*":e.value.distance*this.form.kmCost,"Theoritical wage**":this.form.c[o][e.key]*e.value.time*this.form.wage,"Uber Income":e.value.price})))}))}))}))},header(){return this.results.length?Object.keys(this.results[0]):[]},overviews(){return[{title:"Kilometers",value:(0,h.sumBy)(this.results,"Km"),suffix:"km"},{title:"Time",value:(0,h.sumBy)(this.results,"Time (hr)"),suffix:"hours"},{title:"Km Expenses",value:(0,h.sumBy)(this.results,"Km Cost to be covered*"),suffix:"CHF"},{title:"Estimated wages",value:(0,h.sumBy)(this.results,"Theoritical wage**"),suffix:"CHF"},{title:"Uber Income",value:(0,h.sumBy)(this.results,"Uber Income"),suffix:"CHF"}]}},methods:{drawViz(){this.allValues=this.values.map((e=>{const time=Math.max(0,e.end_ts-e.begin_ts)/36e5,t=this.timeParser(e.begin_ts),r=t.getDay()>4?"weekend":"weekday",o=t.getHours()>22||t.getHours()<7?"night":"day";return{date:t,type:r,period:o,time:time,status:e.status,distance:e.distance,price:e.price,...(0,h.mapValues)(this.aggregations,(e=>e(t)))}}))}}},y=(0,c.Z)(v,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"ma-0 pa-0"},[t("VContainer",[t("VRow",{staticClass:"d-flex align-stretch justify-center"},[e._l(e.overviews,(function(r,o){return t("VCol",{key:o,staticClass:"pa-0",attrs:{cols:2}},[t("VCard",{attrs:{height:"100%",flat:""}},[t("VListItem",{attrs:{"two-line":""}},[t("VListItemContent",[t("div",{staticClass:"text-overline mb-1"},[e._v(" "+e._s(r.title)+" ")]),t("VListItemTitle",{staticClass:"text-h4 text--primary font-weight-bold"},[e._v(" "+e._s(e.numberFormatter(r.value))+" "),t("span",{staticClass:"caption"},[e._v(" "+e._s(r.suffix)+" ")])])],1)],1)],1)],1)})),t("VCol",{attrs:{cols:"2"}},[t("VBtn",{attrs:{color:"primary",outlined:"",dark:""},on:{click:function(t){e.drawer=!0}}},[e._v(" More Options ")])],1)],2),t("VRow",[t("VCol",{attrs:{cols:"12"}},[t("UnitFilterableTable",e._b({},"UnitFilterableTable",{headers:e.header,items:e.results},!1))],1)],1),t("span",{staticClass:"caption"},[e._v("* Km Cost to be covered: This value is computed with the following formula: "),t("strong",[e._v("Km * Cost per kilometre")])]),t("br"),t("span",{staticClass:"caption"},[e._v("** Theoritical wage: This value is computed with the following formula: "),t("strong",[e._v("Time * Multiplying factor * Wage")])])],1),t("VNavigationDrawer",{attrs:{fixed:"",width:"280px",temporary:""},model:{value:e.drawer,callback:function(t){e.drawer=t},expression:"drawer"}},[t("div",{staticClass:"d-flex ma-3"},[t("div",{staticClass:"text-h6"},[e._v("Options")]),t("VSpacer"),t("VIcon",{on:{click:function(t){e.drawer=!1}}},[e._v("$vuetify.icons.mdiClose")])],1),t("VListItem",[t("VListItemContent",[t("VListItemTitle",[e._v("Date range")]),t("div",{staticClass:"caption"},[e._v("The date range to include.")]),t("div",{staticClass:"d-flex"},[t("BaseDateSelector",{attrs:{label:"From"},model:{value:e.form.startDate,callback:function(t){e.$set(e.form,"startDate",t)},expression:"form.startDate"}}),t("BaseDateSelector",{attrs:{label:"To"},model:{value:e.form.endDate,callback:function(t){e.$set(e.form,"endDate",t)},expression:"form.endDate"}})],1)],1)],1),t("VListItem",[t("VListItemContent",[t("VListItemTitle",[e._v("Kilometric cost")]),t("div",{staticClass:"caption"},[e._v(" The average cost per kilometre is at 0.70CHF in Switzerland according to the "),t("a",{attrs:{href:"https://www.tcs.ch/fr/le-tcs/presse/communiques-de-presse-2021/couts-kilometriques-2021.php"}},[e._v("TCS")]),e._v("."),t("br"),t("a",{attrs:{href:"https://www.tcs.ch/fr/tests-conseils/conseils/achat-vente-vehicule/recherche-auto-comparaison.php"}},[e._v("Calculate yours according to your car.")])]),t("VTextField",{attrs:{label:"Costs per kilometre",step:.01,type:"number",prefix:"CHF"},model:{value:e.form.kmCost,callback:function(t){e.$set(e.form,"kmCost",t)},expression:"form.kmCost"}})],1)],1),t("VListItem",[t("VListItemContent",[t("VListItemTitle",[e._v("Wages")]),t("div",{staticClass:"caption"},[e._v(" The minimum wage salary in Geneva since 1 november 2020 is CHF 23.27. "),t("br"),t("a",{attrs:{href:"https://www.eda.admin.ch/missions/mission-onu-geneve/en/home/manual-regime-privileges-and-immunities/introduction/manual-labour-law/Salaire-minimum-dans-le-canton-de-Geneve.html"}},[e._v("eda.admin.ch")]),e._v("."),t("br")]),t("VTextField",{attrs:{label:"Costs per hour",step:.1,type:"number",prefix:"CHF"},model:{value:e.form.wage,callback:function(t){e.$set(e.form,"wage",t)},expression:"form.wage"}})],1)],1),t("VListItem",[t("VListItemContent",[t("VListItemTitle",[e._v("Group by")]),t("div",{staticClass:"caption"},[e._v(" Decide on the temporal granularity at which you will group the data. ")]),t("VSelect",{attrs:{items:Object.keys(e.aggregations),"menu-props":{bottom:!0,offsetY:!0},label:"Group by"},model:{value:e.form.groupBy,callback:function(t){e.$set(e.form,"groupBy",t)},expression:"form.groupBy"}})],1)],1),t("VListItem",[t("VListItemContent",[t("VListItemTitle",[e._v("Multiplying factor")]),t("div",{staticClass:"caption"},[e._v(" Depending on your situation, working at night or at weekends is not paid in the same way, please adapt the multipliers here. ")]),t("VRow",{attrs:{dense:""}},[t("VCol",{attrs:{cols:"4"}},[t("VSubheader",[e._v("WeekDay")])],1),t("VCol",{attrs:{cols:"4"}},[t("VTextField",{attrs:{label:"Day",step:.1,type:"number"},model:{value:e.form.c.weekday.day,callback:function(t){e.$set(e.form.c.weekday,"day",t)},expression:"form.c.weekday.day"}})],1),t("VCol",{attrs:{cols:"4"}},[t("VTextField",{attrs:{label:"Night",step:.1,type:"number"},model:{value:e.form.c.weekday.night,callback:function(t){e.$set(e.form.c.weekday,"night",t)},expression:"form.c.weekday.night"}})],1)],1),t("VRow",{attrs:{dense:""}},[t("VCol",{attrs:{cols:"4"}},[t("VSubheader",[e._v("WeekEnd")])],1),t("VCol",{attrs:{cols:"4"}},[t("VTextField",{attrs:{label:"Day",step:.1,type:"number"},model:{value:e.form.c.weekend.day,callback:function(t){e.$set(e.form.c.weekend,"day",t)},expression:"form.c.weekend.day"}})],1),t("VCol",{attrs:{cols:"4"}},[t("VTextField",{attrs:{label:"Night",step:.1,type:"number"},model:{value:e.form.c.weekend.night,callback:function(t){e.$set(e.form.c.weekend,"night",t)},expression:"form.c.weekend.night"}})],1)],1)],1)],1)],1)],1)}),[],!1,null,null,null).exports}}]);
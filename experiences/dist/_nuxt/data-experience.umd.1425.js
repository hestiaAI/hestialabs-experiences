"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[1425,8736,6622,1297,9814],{71425:function(t,e,r){r.r(e),r.d(e,{default:function(){return v}});var n=r(60194),o=r(40290),main=r(26641),l=r(21297),c=r(43542),d=r(18736),m=r(49814),h=r(96622),f=r(43434),C=r(84695);o.config.defaultColors(n.schemePaired);var w={components:{ChartViewVRowWebShare:d.default,ChartViewTextSelectTimeRange:m.default,ChartViewFilters:h.default,BaseButton:f.Z,UnitFilterableTable:C.Z},mixins:[l.default],data:()=>({header:[["City","city"],["Service","service"],["Status","tripOrOrderStatus"],["Request Time","dateRequestStr"],["From","beginTripAddress"],["To","dropoffAddress"],["Waiting time (min)","waitingTime"],["Distance (miles)","distanceMiles"],["Duration (min)","duration"],["Price","priceStr"]].map((([text,t])=>({text:text,value:t}))),generalInformationRows:[{heading:"Distance",metric:"miles",ids:["number-distance-total","number-distance-avg"]},{heading:"Duration",metric:"min",ids:["number-duration-total","number-duration-avg"]},{heading:"Waiting time",metric:"min",ids:["number-waiting-total","number-waiting-avg"]}],results:[],currencies:[],currentCurrency:null,currencyDimension:null,priceAvgNumber:null,priceTotalNumber:null}),methods:{k:(t,e="")=>`chart-view.overview-uber.${e?`${e}.`:""}${t}`,filterCurrency(t){this.currencyDimension.filter(t),this.currentCurrency=t,this.resetAll()},resetAll(){o.filterAll(),o.renderAll()},drawViz(){this.results=this.values.filter((t=>"COMPLETED"===t.tripOrOrderStatus));const t=["#254b7f","#1c6488","#287a8c","#40908e","#59a590","#7dba91"],e=n.timeParse("%Y-%m-%d %H:%M:%S %Z UTC"),r=n.timeFormat(`%B %d, %Y ${this.$t("at")} %H:%M:%S`);this.results.forEach((t=>{t.service=t.productType.charAt(0).toUpperCase()+t.productType.slice(1),t.dateRequest=e(t.requestTime),t.dateStart=e(t.beginTripTime),t.dateEnd=e(t.dropoffTime),t.dateRequestStr=r(t.dateRequest),t.dateStartStr=r(t.dateStart),t.dateEndStr=r(t.dateEnd),t.day=n.timeDay(t.dateStart),t.hour=n.timeHour(t.dateStart).getHours(),t.duration=n.timeMinute.count(t.dateStart,t.dateEnd),t.waitingTime=n.timeMinute.count(t.dateRequest,t.dateStart),t.priceStr=this.$n(Number(t.fareAmount),"currency",t.fareCurrency),t.price=+t.fareAmount,t.distance=+t.distanceMiles,t.address=t.beginTripAddress.replace(/[0-9]/g,"").split(",")[0]}));const l=new o.BarChart("#hour-chart"),d=new o.PieChart("#service-chart"),m=new o.RowChart("#week-chart"),h=new o.LineChart("#price-chart"),f=new o.RowChart("#address-chart"),C=new o.NumberDisplay("#number-trip"),w=new o.NumberDisplay("#number-speed-avg"),v=new o.NumberDisplay("#number-distance-total"),y=new o.NumberDisplay("#number-distance-avg"),x=new o.NumberDisplay("#number-duration-total"),T=new o.NumberDisplay("#number-duration-avg"),k=new o.NumberDisplay("#number-waiting-total"),V=new o.NumberDisplay("#number-waiting-avg");n.select("#hour-chart a.reset").on("click",(function(){l.filterAll(),o.redrawAll()})),n.select("#service-chart a.reset").on("click",(function(){d.filterAll(),o.redrawAll()})),n.select("#week-chart a.reset").on("click",(function(){m.filterAll(),o.redrawAll()})),n.select("#price-chart a.reset").on("click",(function(){h.filterAll(),o.redrawAll()})),n.select("#address-chart a.reset").on("click",(function(){f.filterAll(),o.redrawAll()}));const A=(0,main.Z)(this.results),_=A.groupAll(),S=A.dimension((t=>{const e=t.dateStart.getDay();return`${this.$days()[e]}`})),B=A.dimension((t=>t.service)),D=A.dimension((t=>t.address)),N=A.dimension((t=>t.day)),R=A.dimension((t=>t.hour));this.currencyDimension=A.dimension((t=>t.fareCurrency));const P=_.reduce(((p,t)=>(++p.count,p.distanceTotal+=t.distance,p.waitingTotal+=t.waitingTime,p.priceTotal+=t.price,p.durationTotal+=t.duration,p)),((p,t)=>(--p.count,p.distanceTotal-=t.distance,p.waitingTotal-=t.waitingTime,p.priceTotal-=t.price,p.durationTotal-=t.duration,p)),(()=>({count:0,distanceTotal:0,waitingTotal:0,durationTotal:0,priceTotal:0}))),$=S.group().reduceCount(),F=B.group().reduceCount(),O=N.group().reduceSum((t=>t.price)),Z=D.group().reduceCount(),E=R.group().reduceCount(),M=this.currencyDimension.group();this.currentCurrency=M.top(1)[0].key,this.currencyDimension.filter(this.currentCurrency),M.top(1/0).forEach((({key:t})=>{const e=this.$n(void 0,"currency",(0,c.v)(t)).replace(/\s*NaN\s*/,""),text=e?`${t} (${e})`:t;this.currencies.push({value:t,text:text})})),C.group(P).valueAccessor((p=>p.count)).formatNumber(n.format("~s")).on("pretransition",((t,filter)=>{this.results=B.top(1/0)})),w.group(P).valueAccessor((p=>p.durationTotal?60*p.distanceTotal/p.durationTotal:0)).formatNumber(n.format(".1f"));const{priceTotal:H,count:W}=P.value(),I=(0,c.v)(this.currentCurrency);this.priceAvgNumber=this.$n(W?H/W:0,{key:"currency",locale:I,maximumFractionDigits:1}),this.priceTotalNumber=this.$n(H,{key:"currency",locale:I,maximumSignificantDigits:3}),y.group(P).valueAccessor((p=>p.count?p.distanceTotal/p.count:0)).formatNumber(n.format(".1f")),v.group(P).valueAccessor((p=>p.distanceTotal)).formatNumber(n.format(".3s")),x.group(P).valueAccessor((p=>p.durationTotal)).formatNumber(n.format(".3s")),T.group(P).valueAccessor((p=>p.durationTotal?p.durationTotal/p.count:0)).formatNumber(n.format(".1f")),k.group(P).valueAccessor((p=>p.waitingTotal)).formatNumber(n.format(".3s")),V.group(P).valueAccessor((p=>p.count?p.waitingTotal/p.count:0)).formatNumber(n.format(".1f")),l.width(n.select("#hour-chart").node().getBoundingClientRect().width).height(40).margins({top:0,right:10,bottom:20,left:40}).dimension(R).group(E).centerBar(!0).gap(1).x(n.scaleLinear().domain([0,23])).ordinalColors(t).yAxis().ticks(0),l.xAxis().tickFormat((t=>t+":00")).ticks(7),m.width(n.select("#week-chart").node().getBoundingClientRect().width).height(180).margins({top:10,left:10,right:10,bottom:20}).group($).dimension(S).ordinalColors(t).label((t=>t.key)).title((t=>t.value)).elasticX(!0).xAxis().ticks(4),m.ordering((t=>this.$days().indexOf(t.key))),d.width(n.select("#service-chart").node().getBoundingClientRect().width).height(180).radius(90).innerRadius(0).dimension(B).group(F).valueAccessor((t=>t.value)).title((t=>t.key+": "+t.value+" trips")).ordinalColors(t).label((t=>{let label=t.key;return label.length>8&&(label=label.substring(0,8)+".. "),d.hasFilter()&&!d.hasFilter(t.key)?`${label} (0%)`:(_.value()&&(label+=` (${Math.round(t.value/P.value().count*100)}%)`),label)}));const L=N.bottom(1).length>0?N.bottom(1)[0].day:null,U=N.top(1).length>0?N.top(1)[0].day:null;var j;h.margins({top:20,left:40,right:20,bottom:20}).width(n.select("#price-chart").node().getBoundingClientRect().width).turnOnControls(!1).curve(n.curveMonotoneX).xyTipsOn(!0).height(180).brushOn(!1).renderArea(!0).dimension(N).group((j=O,{all(){const t={};return j.all().map((function(e){return t[e.key[0]]?t[e.key[0]]+=e.value:t[e.key[0]]=e.value,{key:e.key,value:t[e.key[0]]}}))}})).x(n.scaleTime().domain([L,U])).elasticX(!0).elasticY(!0).renderDataPoints({radius:3,fillOpaaddress:.8,strokeOpaaddress:0}).clipPadding(10).yAxisLabel(this.$t(this.k("Total price"))).brushOn(!0).ordinalColors(t),h.xAxis().ticks(10),h.yAxis().ticks(6),h.filterAll(),f.width(n.select("#address-chart").node().getBoundingClientRect().width).height(180).margins({top:20,left:10,right:10,bottom:20}).group(function(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}(Z)).dimension(D).ordinalColors(t).label((t=>t.key)).title((t=>t.value)).data((t=>t.top(10))).elasticX(!0).xAxis().ticks(4),o.renderAll()}}},v=(0,r(1001).Z)(w,(function(){var t=this,e=t._self._c;return e("VContainer",[e("VRow",{staticClass:"justify-center"},[e("p",[e("span",{domProps:{textContent:t._s(t.messages["select-currency"])}}),e("VSelect",{attrs:{items:t.currencies},on:{input:t.filterCurrency},model:{value:t.currentCurrency,callback:function(e){t.currentCurrency=e},expression:"currentCurrency"}})],1)]),e("ChartViewVRowWebShare",[e("VCol",{attrs:{cols:"12",md:"8"}},[e("VRow",[e("VCol",{attrs:{cols:"12",md:"12"}},[e("div",{attrs:{id:"price-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["Cumulative expenses"])}}),e("ChartViewFilters")],1),e("div",{attrs:{id:"hour-chart"}},[e("ChartViewTextSelectTimeRange",[e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])],1)])],1),e("VRow",[e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:"service-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["Service used"])}}),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:"week-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["Day of week"])}}),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:"address-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["Begin trip address"])}}),e("ChartViewFilters")],1)])],1)],1),e("VCol",{attrs:{cols:"12",md:"4"}},[e("VCard",{staticClass:"general-info"},[e("VCardTitle",[t._v(t._s(t.messages["General information"]))]),e("VCardSubtitle"),e("VCardText",[e("VContainer",[e("VRow",{attrs:{dense:""}},[e("VCol",{attrs:{cols:"12",md:"6"}},[e("VCard",{attrs:{color:"#385F73",dark:""}},[e("VCardTitle",{staticClass:"justify-center text-caption"},[t._v(" "+t._s(t.messages.Orders)+" ")]),e("VCardSubtitle"),e("VCardText",{staticClass:"text-h4 text-center"},[e("div",{attrs:{id:"number-trip"}}),e("span",{staticClass:"text-subtitle-1",domProps:{textContent:t._s(t.messages.trips)}})])],1)],1),e("VCol",{attrs:{cols:"12",md:"6"}},[e("VCard",{attrs:{color:"#385F73",dark:""}},[e("VCardTitle",{staticClass:"justify-center text-caption"},[t._v(" "+t._s(t.messages.Speed)+" ")]),e("VCardSubtitle"),e("VCardText",{staticClass:"text-h4 text-center"},[e("div",{staticClass:"font-weight-bold",attrs:{id:"number-speed-avg"}}),e("span",{staticClass:"text-subtitle-1",domProps:{textContent:t._s(t.messages.mph)}})])],1)],1)],1)],1),e("VSimpleTable",{attrs:{dense:""},scopedSlots:t._u([{key:"default",fn:function(){return[e("thead",[e("tr",[e("th",{staticClass:"text-left"}),e("th",{staticClass:"text-left",domProps:{textContent:t._s(t.messages.Total)}}),e("th",{staticClass:"text-left",domProps:{textContent:t._s(t.messages.Average)}})])]),e("tbody",[e("tr",[e("td",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages.Price)}}),e("td",{staticClass:"text-h6",domProps:{textContent:t._s(t.priceTotalNumber)}}),e("td",{staticClass:"text-h6",domProps:{textContent:t._s(t.priceAvgNumber)}})]),t._l(t.generalInformationRows,(function({heading:r,ids:n,metric:o}){return e("tr",{key:r},[e("td",{domProps:{textContent:t._s(t.messages[r])}}),t._l(n,(function(r){return e("td",{key:r},[e("span",{staticClass:"text-h6",attrs:{id:r}}),t._v(" "),e("span",{domProps:{textContent:t._s(t.messages[o])}})])}))],2)}))],2)]},proxy:!0}])})],1),e("VCardActions",[e("BaseButton",{attrs:{elevation:"2",block:""},on:{click:function(e){return t.resetAll()}}},[t._v(" "+t._s(t.messages["Reset all filters"])+" ")])],1)],1)],1)],1),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({},"UnitFilterableTable",{headers:t.header,items:t.results,kViewBlock:t.kViewBlock},!1))],1)],1)],1)}),[],!1,null,"ae173470",null).exports},18736:function(t,e,r){r.r(e),r.d(e,{default:function(){return m}});var n=r(12555),o=r(43434),l=r(97888),c=r(9934),d={components:{BaseButton:o.Z,BaseButtonDownloadData:l.Z,BaseButtonShare:c.Z},mixins:[(0,n.Z)()]},m=(0,r(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude",attrs:{cols:"12"}},[e("BaseButton",t._b({attrs:{icon:"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1)),e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1)),e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)],2)}),[],!1,null,null,null).exports},96622:function(t,e,r){r.r(e),r.d(e,{default:function(){return o}});var n={},o=(0,r(1001).Z)(n,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},49814:function(t,e,r){r.r(e),r.d(e,{default:function(){return n}});var n=(0,r(1001).Z)({},(function(){var t=this,e=t._self._c;return e("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[e("span",{domProps:{innerHTML:t._s(t.$t("select-time-range"))}}),t._t("default")],2)}),[],!1,null,null,null).exports},21297:function(t,e,r){r.r(e);var n=r(40290),o=r(18651),l=r(659);const c={props:{values:{type:Array,default:()=>[]},headers:{type:Array,default:()=>[]},messages:{type:Object,default:()=>({})}},data(){return{graphId:"graph_"+this._uid,totalCount:0,filterCount:0}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{drawViz(){},createTextFilterWidget(t,e="Search"){const r=new n.TextFilterWidget(t);return r.placeHolder(this.$tev(e,e)),r}}};e.default=(0,o.Z)(c,l.Z)}}]);
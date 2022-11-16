"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[552,8736,6622,1297,9814],{70552:function(t,e,r){r.r(e),r.d(e,{default:function(){return w}});var n=r(60194),l=r(40290),main=r(26641),o=r(21297),d=r(18736),c=r(49814),h=r(96622),m=r(98931);l.config.defaultColors(n.schemePaired);var f={name:"ChartViewOverviewTwitter",components:{ChartViewVRowWebShare:d.default,ChartViewTextSelectTimeRange:c.default,ChartViewFilters:h.default,UnitFilterableTable:m.Z},mixins:[o.default],data:()=>({header:[{text:"Tweet ID",value:"tweetId"},{text:"Company",value:"companyName"},{text:"Date",value:"date_"},{text:"Promoted Tweet",value:"url"},{text:"Engagement",value:"engagedWith"},{text:"Targeting Criteria",value:"count"}],results:[]}),methods:{drawViz(){this.results=this.values;const t=["#0D4B7A","#248EB8","#7FCEF0","#4A659E"],e=new l.LineChart("#volume-chart"),r=new l.BarChart("#range-chart"+this.graphId),o=new l.DataCount(".dc-data-count"),d=new l.RowChart("#company-chart"),c=new l.PieChart("#engagement-chart"),h=new l.RowChart("#type-chart"),m=new l.RowChart("#value-chart"),f=this.createTextFilterWidget("#company-search"),w=this.createTextFilterWidget("#type-search"),v=this.createTextFilterWidget("#value-search");n.select("#volume-chart p a.reset").on("click",(function(){r.filterAll(),e.filterAll(),l.redrawAll()})),n.select("#company-chart p a.reset").on("click",(function(){d.filterAll(),l.redrawAll()})),n.select("#engagement-chart p a.reset").on("click",(function(){c.filterAll(),l.redrawAll()})),n.select("#type-chart p a.reset").on("click",(function(){h.filterAll(),l.redrawAll()})),n.select("#value-chart p a.reset").on("click",(function(){m.filterAll(),l.redrawAll()}));const C=n.timeParse("%Y-%m-%d %H:%M:%S"),y=n.timeFormat("%B %d, %Y");this.results.forEach((t=>{t.targetingType=t.targetingType?t.targetingType:"Unknown",t.targetingValue=t.targetingValue?t.targetingValue:"Unknown",t.companyName=t.companyName?t.companyName:"",t.dateParsed=C(t.date_),t.day=n.timeDay(t.dateParsed),t.dateStr=y(t.dateParsed),t.url="https://twitter.com/x/status/"+t.tweetId}));const x=n.min(this.results,(function(t){return t.day})),V=n.max(this.results,(function(t){return t.day})),_=(0,main.Z)(this.results),A=_.groupAll(),B=_.dimension((t=>t.day)),k=_.dimension((t=>t.companyName)),T=_.dimension((t=>this.$t(t.engagedWith))),R=_.dimension((t=>t.targetingType)),F=_.dimension((t=>t.targetingValue));f.dimension(_.dimension((t=>t.companyName.toLowerCase()))),w.dimension(_.dimension((t=>t.targetingType.toLowerCase()))),v.dimension(_.dimension((t=>t.targetingValue.toLowerCase())));const S=()=>({count:0,dict:{}}),$=(p,t)=>(p.dict[t.tweetId+t.date_]=(p.dict[t.tweetId+t.date_]||0)+1,1===p.dict[t.tweetId+t.date_]&&p.count++,p),D=(p,t)=>(p.dict[t.tweetId+t.date_]-=1,0===p.dict[t.tweetId+t.date_]&&p.count--,p);function I(p){return p.count}const P=B.group().reduce($,D,S).order(I),Z=k.group().reduce($,D,S).order(I),N=T.group().reduce($,D,S).order(I),W=A.reduce($,D,S),E=R.group().reduceCount(),L=F.group().reduceCount();function U(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}e.renderArea(!0).width(n.select("#volume-chart").node().getBoundingClientRect().width).height(150).transitionDuration(1e3).margins({top:30,right:10,bottom:25,left:40}).group(P).dimension(B).x(n.scaleTime().domain([x,V])).valueAccessor((t=>t.value.count)).ordinalColors(t).brushOn(!1).elasticX(!1).elasticY(!0).xyTipsOn(!0).mouseZoomable(!1).rangeChart(r).renderHorizontalGridLines(!1).renderDataPoints({radius:3,fillOpacity:.8,strokeOpacity:0}).yAxisLabel("N° of ads").clipPadding(10).title((t=>`${y(t.key)}: ${t.value.count}`)).yAxis().ticks(5),r.width(n.select("#volume-chart").node().getBoundingClientRect().width).height(40).margins({top:0,right:10,bottom:20,left:40}).dimension(B).group(P).centerBar(!0).gap(1).x(n.scaleTime().domain([x,V])).valueAccessor((t=>t.value.count)).label((t=>t.key)).round(n.timeDay.round).alwaysUseRounding(!0).xUnits(n.timeDays).ordinalColors(t).yAxis().ticks(0),d.width(n.select("#company-chart").node().getBoundingClientRect().width).height(240).margins({top:20,left:10,right:10,bottom:20}).group(U(Z)).dimension(k).ordinalColors(t).label((t=>t.key)).valueAccessor((t=>t.value.count)).data((t=>t.top(10))).title((t=>t.value.count)).elasticX(!0).xAxis().ticks(4);const z=n.select("#engagement-chart").node().getBoundingClientRect().width;c.width(z).height(220).radius(z/2.5).innerRadius(z/8).dimension(T).group(N).valueAccessor((t=>t.value.count)).title((t=>t.value.count+" ads")).ordinalColors(t).label((t=>{if(c.hasFilter()&&!c.hasFilter(t.key))return`${t.key} (0%)`;let label=t.key;return A.value()&&(label+=` (${Math.round(t.value.count/W.value().count*100)}%)`),label})),h.width(n.select("#type-chart").node().getBoundingClientRect().width).height(240).margins({top:20,left:10,right:10,bottom:20}).group(U(E)).dimension(R).ordinalColors(t).label((t=>t.key)).data((t=>t.top(10))).title((t=>t.value)).elasticX(!0).xAxis().ticks(4),m.width(n.select("#value-chart").node().getBoundingClientRect().width).height(240).margins({top:20,left:10,right:10,bottom:20}).group(U(L)).dimension(F).ordinalColors(t).label((t=>t.key)).data((t=>t.top(10))).title((t=>t.value)).elasticX(!0).xAxis().ticks(4);const O=W.value().count;o.crossfilter({size:()=>O}).groupAll({value:()=>W.value().count}).html({some:`<strong>%filter-count</strong> ${this.$t("selected-out-of")} <strong>%total-count</strong> ${this.messages.ads} | <a class='resetAll'>${this.$t("Reset All")}</a>`,all:`Total: <strong>%total-count</strong> ${this.messages.ads}. ${this.$t("click-graph")}`}).on("pretransition",((t,filter)=>{const e=n.flatRollup(_.allFiltered(),(t=>t.length),(t=>t.tweetId),(t=>t.companyName),(t=>t.date_),(t=>t.url),(t=>t.engagedWith));this.results=e.map((t=>({tweetId:t[0],companyName:t[1],date_:t[2],url:t[3],engagedWith:t[4],count:t[5]}))),n.select("#dc-data-count a.reset").on("click",(function(){l.filterAll(),l.renderAll()}))})),l.renderAll()}}},w=(0,r(1001).Z)(f,(function(){var t=this,e=t._self._c;return e("VContainer",[e("ChartViewVRowWebShare",[e("VCol",{attrs:{cols:"12"}},[e("VRow",[e("VCol",{attrs:{cols:"12",sm:"8"}},[e("div",{attrs:{id:"volume-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["ads-time"])}}),e("ChartViewFilters")],1),e("div",{staticClass:"range-chart",attrs:{id:"range-chart"+t.graphId}},[e("ChartViewTextSelectTimeRange")],1)]),e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"company-chart"}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["top-adv"])}}),e("VSpacer"),e("div",{attrs:{id:"company-search"}})],1),e("ChartViewFilters")],1)])],1),e("VRow",[e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"engagement-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages.interactions)}}),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"type-chart"}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["targeting-type"])}}),e("VSpacer"),e("div",{attrs:{id:"type-search"}})],1),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"value-chart"}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["targeting-criteria"])}}),e("VSpacer"),e("div",{attrs:{id:"value-search"}})],1),e("ChartViewFilters")],1)])],1),e("VRow",[e("div",{staticClass:"dc-data-count",attrs:{id:"dc-data-count"}})])],1)],1),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({},"UnitFilterableTable",{headers:t.header,items:t.results},!1))],1)],1)],1)}),[],!1,null,null,null).exports},18736:function(t,e,r){r.r(e),r.d(e,{default:function(){return h}});var n=r(12555),l=r(37081),o=r(97888),d=r(9934),c={components:{BaseButton:l.Z,BaseButtonDownloadData:o.Z,BaseButtonShare:d.Z},mixins:[(0,n.Z)()]},h=(0,r(1001).Z)(c,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude",attrs:{cols:"12"}},[e("BaseButton",t._b({attrs:{icon:"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1)),e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1)),e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)],2)}),[],!1,null,null,null).exports},96622:function(t,e,r){r.r(e),r.d(e,{default:function(){return l}});var n={},l=(0,r(1001).Z)(n,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},49814:function(t,e,r){r.r(e),r.d(e,{default:function(){return n}});var n=(0,r(1001).Z)({},(function(){var t=this,e=t._self._c;return e("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[e("span",{domProps:{innerHTML:t._s(t.$t("select-time-range"))}}),t._t("default")],2)}),[],!1,null,null,null).exports},21297:function(t,e,r){r.r(e);var n=r(40290),l=r(18651),o=r(659);const d={props:{values:{type:Array,default:()=>[]},headers:{type:Array,default:()=>[]},messages:{type:Object,default:()=>({})}},data(){return{graphId:"graph_"+this._uid,totalCount:0,filterCount:0}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{drawViz(){},createTextFilterWidget(t,e="Search"){const r=new n.TextFilterWidget(t);return r.placeHolder(this.$tev(e,e)),r}}};e.default=(0,l.Z)(d,o.Z)}}]);
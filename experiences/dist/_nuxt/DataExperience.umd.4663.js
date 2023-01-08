"use strict";(("undefined"!=typeof self?self:this).webpackChunkDataExperience=("undefined"!=typeof self?self:this).webpackChunkDataExperience||[]).push([[4663,5701,6622,9814],{44663:function(t,e,r){r.r(e),r.d(e,{default:function(){return w}});var n=r(60194),o=r(40290),main=r(26641),l=r(74097),c=r(65701),d=r(49814),h=r(96622),m=r(6497);o.config.defaultColors(n.schemePaired);var f={name:"ChartViewOverviewTwitter",components:{ChartViewVRowWebShare:c.default,ChartViewTextSelectTimeRange:d.default,ChartViewFilters:h.default,UnitFilterableTable:m.Z},mixins:[l.default],data:()=>({header:[{text:"Tweet ID",value:"tweetId"},{text:"Company",value:"companyName"},{text:"Date",value:"date_"},{text:"Promoted Tweet",value:"url"},{text:"Engagement",value:"engagedWith"},{text:"Targeting Criteria",value:"count"}],results:[]}),methods:{drawViz(){this.results=this.values;const t=new o.LineChart("#volume-chart"),e=new o.BarChart("#range-chart"+this.graphId),r=new o.DataCount(".dc-data-count"),l=new o.RowChart("#company-chart"),c=new o.PieChart("#engagement-chart"),d=new o.RowChart("#type-chart"),h=new o.RowChart("#value-chart"),m=this.createTextFilterWidget("#company-search"),f=this.createTextFilterWidget("#type-search"),w=this.createTextFilterWidget("#value-search");n.select("#volume-chart p a.reset").on("click",(function(){e.filterAll(),t.filterAll(),o.redrawAll()})),n.select("#company-chart p a.reset").on("click",(function(){l.filterAll(),o.redrawAll()})),n.select("#engagement-chart p a.reset").on("click",(function(){c.filterAll(),o.redrawAll()})),n.select("#type-chart p a.reset").on("click",(function(){d.filterAll(),o.redrawAll()})),n.select("#value-chart p a.reset").on("click",(function(){h.filterAll(),o.redrawAll()}));const v=n.timeParse("%Y-%m-%d %H:%M:%S"),C=n.timeFormat("%B %d, %Y");this.results.forEach((t=>{t.targetingType=t.targetingType?t.targetingType:"Unknown",t.targetingValue=t.targetingValue?t.targetingValue:"Unknown",t.companyName=t.companyName?t.companyName:"",t.dateParsed=v(t.date_),t.day=n.timeDay(t.dateParsed),t.dateStr=C(t.dateParsed),t.url="https://twitter.com/x/status/"+t.tweetId}));const y=n.min(this.results,(function(t){return t.day})),x=n.max(this.results,(function(t){return t.day})),_=(0,main.Z)(this.results),V=_.groupAll(),A=_.dimension((t=>t.day)),k=_.dimension((t=>t.companyName)),B=_.dimension((t=>this.$t(t.engagedWith))),T=_.dimension((t=>t.targetingType)),R=_.dimension((t=>t.targetingValue));m.dimension(_.dimension((t=>t.companyName.toLowerCase()))),f.dimension(_.dimension((t=>t.targetingType.toLowerCase()))),w.dimension(_.dimension((t=>t.targetingValue.toLowerCase())));const P=()=>({count:0,dict:{}}),D=(p,t)=>(p.dict[t.tweetId+t.date_]=(p.dict[t.tweetId+t.date_]||0)+1,1===p.dict[t.tweetId+t.date_]&&p.count++,p),F=(p,t)=>(p.dict[t.tweetId+t.date_]-=1,0===p.dict[t.tweetId+t.date_]&&p.count--,p);function S(p){return p.count}const $=A.group().reduce(D,F,P).order(S),I=k.group().reduce(D,F,P).order(S),N=B.group().reduce(D,F,P).order(S),Z=V.reduce(D,F,P),W=T.group().reduceCount(),L=R.group().reduceCount();function U(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}t.renderArea(!0).width(n.select("#volume-chart").node().getBoundingClientRect().width).height(150).transitionDuration(1e3).margins({top:30,right:10,bottom:25,left:40}).group($).dimension(A).x(n.scaleTime().domain([y,x])).valueAccessor((t=>t.value.count)).ordinalColors(this.colorPalette).brushOn(!1).elasticX(!1).elasticY(!0).xyTipsOn(!0).mouseZoomable(!1).rangeChart(e).renderHorizontalGridLines(!1).renderDataPoints({radius:3,fillOpacity:.8,strokeOpacity:0}).yAxisLabel("N° of ads").clipPadding(10).title((t=>`${C(t.key)}: ${t.value.count}`)).yAxis().ticks(5),e.width(n.select("#volume-chart").node().getBoundingClientRect().width).height(40).margins({top:0,right:10,bottom:20,left:40}).dimension(A).group($).centerBar(!0).gap(1).x(n.scaleTime().domain([y,x])).valueAccessor((t=>t.value.count)).label((t=>t.key)).round(n.timeDay.round).alwaysUseRounding(!0).xUnits(n.timeDays).ordinalColors(this.colorPalette).yAxis().ticks(0),l.width(n.select("#company-chart").node().getBoundingClientRect().width).height(240).margins({top:20,left:10,right:10,bottom:20}).group(U(I)).dimension(k).ordinalColors([this.colorPalette[1]]).label((t=>t.key)).valueAccessor((t=>t.value.count)).data((t=>t.top(10))).title((t=>t.value.count)).elasticX(!0).xAxis().ticks(4);const E=n.select("#engagement-chart").node().getBoundingClientRect().width;c.width(E).height(220).radius(E/2.5).innerRadius(E/8).dimension(B).group(N).valueAccessor((t=>t.value.count)).title((t=>t.value.count+" ads")).ordinalColors(this.colorPalette).label((t=>{if(c.hasFilter()&&!c.hasFilter(t.key))return`${t.key} (0%)`;let label=t.key;return V.value()&&(label+=` (${Math.round(t.value.count/Z.value().count*100)}%)`),label})),d.width(n.select("#type-chart").node().getBoundingClientRect().width).height(240).margins({top:20,left:10,right:10,bottom:20}).group(U(W)).dimension(T).ordinalColors([this.colorPalette[2]]).label((t=>t.key)).data((t=>t.top(10))).title((t=>t.value)).elasticX(!0).xAxis().ticks(4),h.width(n.select("#value-chart").node().getBoundingClientRect().width).height(240).margins({top:20,left:10,right:10,bottom:20}).group(U(L)).dimension(R).ordinalColors([this.colorPalette[3]]).label((t=>t.key)).data((t=>t.top(10))).title((t=>t.value)).elasticX(!0).xAxis().ticks(4);const O=Z.value().count;r.crossfilter({size:()=>O}).groupAll({value:()=>Z.value().count}).html({some:`<strong>%filter-count</strong> ${this.$t("selected-out-of")} <strong>%total-count</strong> ${this.messages.ads} | <a class='resetAll'>${this.$t("Reset All")}</a>`,all:`Total: <strong>%total-count</strong> ${this.messages.ads}. ${this.$t("click-graph")}`}).on("pretransition",((t,filter)=>{const e=n.flatRollup(_.allFiltered(),(t=>t.length),(t=>t.tweetId),(t=>t.companyName),(t=>t.date_),(t=>t.url),(t=>t.engagedWith));this.results=e.map((t=>({tweetId:t[0],companyName:t[1],date_:t[2],url:t[3],engagedWith:t[4],count:t[5]}))),n.select("#dc-data-count a.reset").on("click",(function(){o.filterAll(),o.renderAll()}))})),o.renderAll()}}},w=(0,r(1001).Z)(f,(function(){var t=this,e=t._self._c;return e("VContainer",[e("ChartViewVRowWebShare",[e("VCol",{attrs:{cols:"12"}},[e("VRow",[e("VCol",{attrs:{cols:"12",sm:"8"}},[e("div",{attrs:{id:"volume-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["ads-time"])}}),e("ChartViewFilters")],1),e("div",{staticClass:"range-chart",attrs:{id:"range-chart"+t.graphId}},[e("ChartViewTextSelectTimeRange")],1)]),e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"company-chart"}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["top-adv"])}}),e("VSpacer"),e("div",{attrs:{id:"company-search"}})],1),e("ChartViewFilters")],1)])],1),e("VRow",[e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"engagement-chart"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages.interactions)}}),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"type-chart"}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["targeting-type"])}}),e("VSpacer"),e("div",{attrs:{id:"type-search"}})],1),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",sm:"4"}},[e("div",{attrs:{id:"value-chart"}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["targeting-criteria"])}}),e("VSpacer"),e("div",{attrs:{id:"value-search"}})],1),e("ChartViewFilters")],1)])],1),e("VRow",[e("div",{staticClass:"dc-data-count",attrs:{id:"dc-data-count"}})])],1)],1),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({},"UnitFilterableTable",{headers:t.header,items:t.results},!1))],1)],1)],1)}),[],!1,null,null,null).exports},65701:function(t,e,r){r.r(e),r.d(e,{default:function(){return h}});var n=r(14226),o=r(72514),l=r(97888),c=r(39474),d={components:{BaseButton:o.Z,BaseButtonDownloadData:l.Z,BaseButtonShare:c.Z},mixins:[(0,n.Z)()]},h=(0,r(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude webshare d-flex",attrs:{cols:"12"}},[e("div",{staticClass:"webshare__export-button"},[e("BaseButton",t._b({attrs:{"mdi-icon":"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1))],1),e("div",{staticClass:"webshare__download-button"},[e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1))],1),e("div",{staticClass:"webshare__share-button"},[e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)])],2)}),[],!1,null,null,null).exports},96622:function(t,e,r){r.r(e),r.d(e,{default:function(){return o}});var n={},o=(0,r(1001).Z)(n,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},49814:function(t,e,r){r.r(e),r.d(e,{default:function(){return n}});var n=(0,r(1001).Z)({},(function(){var t=this,e=t._self._c;return e("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[e("span",{domProps:{innerHTML:t._s(t.$t("select-time-range"))}}),t._t("default")],2)}),[],!1,null,null,null).exports}}]);
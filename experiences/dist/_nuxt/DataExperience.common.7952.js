"use strict";(("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience=("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience||[]).push([[7952,5701,2027,6622,9814,5225],{37952:function(t,e,n){n.r(e),n.d(e,{default:function(){return y}});var r=n(60194),l=n(40290),main=n(26641),o=n(74097),c=n(85225),d=n(1949),h=n(65701),f=n(96622),m=n(92027),C=n(49814),x=n(3719);l.config.defaultColors(r.schemePaired);var w={components:{ChartViewVRowWebShare:h.default,ChartViewFilters:f.default,ChartViewDcFilterCount:m.default,ChartViewTextSelectTimeRange:C.default,UnitFilterableTable:x.Z},mixins:[o.default],props:{titleTimeline:{type:String,default:"Timeline Chart"},titlePie:{type:String,default:"Pie Chart"},titleTop:{type:String,default:"Top Chart"},rowLabel:{type:String,default:"records"},dateAccessor:{type:Object,required:!0},seriesAccessor:{type:Object,required:!0},topAccessor:{type:Object,required:!0}},data:()=>({header:[{text:"Date",value:"dateStr"},{text:"Name",value:"name"},{text:"Action",value:"type"}],results:[],datesAgg:{day:{accessor:"day",xUnits:r.timeDays,round:r.timeDay.round},month:{accessor:"month",xUnits:r.timeMonths,round:r.timeMonth.round}},timeUnit:{accessor:"day",xUnits:r.timeDays,round:r.timeDay.round}}),methods:{drawViz(){const t=r.timeFormat("%B %d, %Y");this.results=this.values.map((t=>{const e=new Date(t[this.dateAccessor.value]),n=decodeURIComponent(escape(t[this.seriesAccessor.value]));return{name:decodeURIComponent(escape(t[this.topAccessor.value])),type:this.messages?.type[n]||n,date:e,dateStr:(0,d.K1)(e),month:r.timeMonth(e),day:r.timeDay(e)}}));const e=r.extent(this.results,(t=>t.date)),n=new l.LineChart(`#area-chart-${this.graphId}`),o=new l.BarChart(`#range-chart-${this.graphId}`),h=new l.RowChart(`#top-chart-${this.graphId}`),f=this.createTextFilterWidget(`#top-search-${this.graphId}`),m=new l.PieChart(`#pie-chart-${this.graphId}`);r.select(`#top-chart-${this.graphId} a.reset`).on("click",(function(){h.filterAll(),l.redrawAll()})),r.select(`#pie-chart-${this.graphId} a.reset`).on("click",(function(){m.filterAll(),l.redrawAll()})),r.select(`#area-chart-${this.graphId} a.reset`).on("click",(function(){n.filterAll(),o.filterAll(),l.redrawAll()}));const C=(0,main.Z)(this.results),x=C.groupAll();this.totalCount=C.size(),this.filterCount=this.totalCount,C.onChange((()=>{this.results=y.top(x.value()),this.filterCount=C.allFiltered().length})),this.timeUnit=r.timeMonth.count(...e)>10?this.datesAgg.month:this.datesAgg.day;const w=C.dimension((t=>t.name)),y=C.dimension((t=>t[this.timeUnit.accessor])),v=C.dimension((t=>t.type));f.dimension(C.dimension((t=>t.name.toLowerCase())));const _=w.group().reduceCount(),A=v.group().reduceCount(),k=y.group().reduceCount();h.width(r.select(`#top-chart-${this.graphId}`).node().getBoundingClientRect().width).height(252).margins({top:20,left:10,right:10,bottom:20}).group((0,c.removeEmptyBins)(_)).dimension(w).ordinalColors(this.colorPalette).label((t=>t.key)).data((t=>t.top(10))).title((t=>t.value)).elasticX(!0).xAxis().ticks(4);const B=r.select(`#area-chart-${this.graphId}`).node().getBoundingClientRect().width;n.margins({top:20,left:40,right:20,bottom:20}).width(B).transitionDuration(1e3).turnOnControls(!1).curve(r.curveMonotoneX).xyTipsOn(!0).height(180).brushOn(!1).renderArea(!0).dimension(y).group(y.group().reduceCount()).x(r.scaleTime().domain(e)).elasticY(!0).rangeChart(o).renderDataPoints({radius:3,fillOpacity:.8,strokeOpacity:0}).round(this.timeUnit.round).xUnits(this.timeUnit.xUnits).title((e=>`${t(e.key)} : ${e.value} ${this.rowLabel}`)).clipPadding(10).yAxisLabel("Total "+this.rowLabel).ordinalColors(this.colorPalette),n.xAxis().ticks(10),n.yAxis().ticks(6),n.filterAll(),o.width(r.select(`#range-chart-${this.graphId}`).node().getBoundingClientRect().width).height(40).margins({top:0,right:10,bottom:20,left:40}).dimension(y).group(k).centerBar(!0).gap(1).x(r.scaleTime().domain(e)).valueAccessor((t=>t.value)).label((t=>t.key)).round(this.timeUnit.round).alwaysUseRounding(!0).xUnits(this.timeUnit.xUnits).ordinalColors(this.colorPalette).yAxis().ticks(0);const V=r.select(`#pie-chart-${this.graphId}`).node().getBoundingClientRect().width,$=Math.min(V,250);m.width(V).height(250).slicesCap(10).radius($/4).innerRadius($/8).externalLabels(50).dimension(v).group(A).valueAccessor((t=>t.value)).title((t=>`${t.key}: ${t.value} ${this.rowLabel}`)).drawPaths(!0).minAngleForLabel(.1).ordinalColors(this.colorPalette),m.on("pretransition",(function(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=r.select(this);let text=e.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+l.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))})),l.renderAll()}}},y=(0,n(1001).Z)(w,(function(){var t=this,e=t._self._c;return e("VContainer",[e("ChartViewVRowWebShare",[e("VCol",{attrs:{cols:"12"}},[e("VRow",[e("VCol",{attrs:{cols:"12",md:"12"}},[e("div",{attrs:{id:`area-chart-${t.graphId}`}},[e("span",{staticClass:"font-weight-bold"},[e("i18n",{attrs:{path:"item-per-timeunit"},scopedSlots:t._u([{key:"title",fn:function(){return[t._v(" "+t._s(t.titleTimeline)+" ")]},proxy:!0},{key:"timeUnit",fn:function(){return[t._v(" "+t._s(t.$t(t.timeUnit.accessor))+" ")]},proxy:!0}])})],1),e("ChartViewFilters")],1),e("div",{staticClass:"range-chart",attrs:{id:`range-chart-${t.graphId}`}},[e("ChartViewTextSelectTimeRange")],1)])],1),e("VRow",[e("VCol",{attrs:{cols:"12",md:"6"}},[e("div",{attrs:{id:`pie-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold"},[t._v(t._s(t.titlePie))])]),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"6"}},[e("div",{attrs:{id:`top-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold"},[t._v(t._s(t.titleTop))]),e("VSpacer"),e("div",{attrs:{id:`top-search-${t.graphId}`}})],1),e("ChartViewFilters")],1)])],1)],1)],1),e("ChartViewDcFilterCount",t._b({},"ChartViewDcFilterCount",{filterCount:t.filterCount,totalCount:t.totalCount,rowLabel:t.rowLabel},!1)),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({},"UnitFilterableTable",{headers:t.header,items:t.results},!1))],1)],1)],1)}),[],!1,null,null,null).exports},65701:function(t,e,n){n.r(e),n.d(e,{default:function(){return h}});var r=n(14226),l=n(25593),o=n(97888),c=n(39474),d={components:{BaseButton:l.Z,BaseButtonDownloadData:o.Z,BaseButtonShare:c.Z},mixins:[(0,r.Z)()]},h=(0,n(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude webshare d-flex",attrs:{cols:"12"}},[e("div",{staticClass:"webshare__export-button"},[e("BaseButton",t._b({attrs:{"mdi-icon":"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1))],1),e("div",{staticClass:"webshare__download-button"},[e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1))],1),e("div",{staticClass:"webshare__share-button"},[e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)])],2)}),[],!1,null,null,null).exports},92027:function(t,e,n){n.r(e),n.d(e,{default:function(){return o}});var r=n(40290),l={mixins:[n(85027).Z],props:{filterCount:{type:Number,required:!0},totalCount:{type:Number,required:!0},rowLabel:{type:String,default:null}},methods:{resetAll(){r.filterAll(),r.renderAll()}}},o=(0,n(1001).Z)(l,(function(){var t=this,e=t._self._c;return e("VRow",[t.filterCount===t.totalCount?[e("i18n",{attrs:{tag:"div",path:t.kViewBlock("selected-all")},scopedSlots:t._u([{key:"totalCount",fn:function(){return[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.totalCount)}})]},proxy:!0},t.rowLabel?{key:"rowLabel",fn:function(){return[t._v(" "+t._s(t.rowLabel)+" ")]},proxy:!0}:null],null,!0)}),e("span",{directives:[{name:"t",rawName:"v-t",value:"click-graph",expression:"'click-graph'"}]})]:[e("i18n",{attrs:{tag:"div",path:t.kViewBlock("selected-some")},scopedSlots:t._u([t._l({filterCount:t.filterCount,totalCount:t.totalCount},(function(n,r){return{key:r,fn:function(){return[e("span",{key:r,staticClass:"font-weight-bold",domProps:{textContent:t._s(n)}})]},proxy:!0}})),t.rowLabel?{key:"rowLabel",fn:function(){return[t._v(" "+t._s(t.rowLabel)+" ")]},proxy:!0}:null],null,!0)}),e("span",[t._v(" | "),e("a",{directives:[{name:"t",rawName:"v-t",value:"Reset All",expression:"'Reset All'"}],on:{click:t.resetAll}})])]],2)}),[],!1,null,null,null).exports},96622:function(t,e,n){n.r(e),n.d(e,{default:function(){return l}});var r={},l=(0,n(1001).Z)(r,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},49814:function(t,e,n){n.r(e),n.d(e,{default:function(){return r}});var r=(0,n(1001).Z)({},(function(){var t=this,e=t._self._c;return e("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[e("span",{domProps:{innerHTML:t._s(t.$t("select-time-range"))}}),t._t("default")],2)}),[],!1,null,null,null).exports},85225:function(t,e,n){n.r(e),n.d(e,{addPiePercentage:function(){return f},addXLabel:function(){return o},addYLabel:function(){return c},createCumulativeGroup:function(){return d},removeEmptyBins:function(){return h}});var r=n(60194),l=n(40290);function o(t,e){const n=t.svg().append("text").attr("class","x-axis-label").attr("text-anchor","middle").attr("x",t.width()/2).attr("y",t.height()-10).text(e),r=n.node().getBBox(),l=t.margins();n.attr("x",l.left+(t.width()-l.left-l.right)/2).attr("y",t.height()-Math.ceil(r.height)/2)}function c(t,e){const n=t.svg().append("text").attr("class","y-axis-label").attr("text-anchor","middle").attr("transform","rotate(-90)").attr("x",-t.height()/2).attr("y",10).text(e),r=n.node().getBBox(),l=t.margins();n.attr("x",-l.top-(t.height()-l.top-l.bottom)/2).attr("y",Math.max(Math.ceil(r.height),l.left-Math.ceil(r.height)-5))}function d(t){return{all(){const e={};return t.all().map((function(t){return e[t.key[0]]?e[t.key[0]]+=t.value:e[t.key[0]]=t.value,{key:t.key,value:e[t.key[0]]}}))}}}function h(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}function f(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=r.select(this);let text=e.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+l.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))}}}]);
"use strict";(("undefined"!=typeof self?self:this).webpackChunkDataExperience=("undefined"!=typeof self?self:this).webpackChunkDataExperience||[]).push([[8592,5701,6622,9814],{28592:function(t,e,r){r.r(e),r.d(e,{default:function(){return w}});var l=r(60194),n=r(40290),main=r(26641),o=r(74097),c=r(65701),d=r(96622),h=r(49814),m=r(6497);n.config.defaultColors(l.schemePaired);var f={components:{ChartViewVRowWebShare:c.default,ChartViewFilters:d.default,ChartViewTextSelectTimeRange:h.default,UnitFilterableTable:m.Z},mixins:[o.default],data:()=>({header:[{text:"Name",value:"name"},{text:"Liked at",value:"dateStr"},{text:"Matched",value:"matched"}],results:[]}),methods:{resetAll(){n.filterAll(),n.renderAll()},drawViz(){const t=l.timeFormat("%B %d, %Y at %H:%M:%S"),e=l.timeFormat("%B %d, %Y");this.results=this.values.map((e=>{const r=new Date(e.likedAt);return{name:e.name,matched:"TRUE"===e.matched.toUpperCase(),date:r,dateStr:t(r),month:l.timeMonth(r),day:l.timeDay(r),hour:l.timeHour(r).getHours()}}));const r=new n.BarChart("#hour-chart"),o=new n.PieChart("#matched-chart"),c=new n.RowChart("#week-chart"),d=new n.LineChart("#like-chart"),h=new n.BarChart("#range-chart"),m=new n.DataCount("#dc-data-count"+this.graphId);l.select("#hour-chart a.reset").on("click",(function(){r.filterAll(),n.redrawAll()})),l.select("#matched-chart a.reset").on("click",(function(){o.filterAll(),n.redrawAll()})),l.select("#week-chart a.reset").on("click",(function(){c.filterAll(),n.redrawAll()})),l.select("#like-chart a.reset").on("click",(function(){d.filterAll(),h.filterAll(),n.redrawAll()}));const f=(0,main.Z)(this.results),w=f.groupAll(),C=f.dimension((t=>{const e=t.date.getDay();return`${this.$days()[e]}`})),v=f.dimension((t=>t.matched)),x=f.dimension((t=>t.month)),A=f.dimension((t=>t.day)),k=f.dimension((t=>t.hour)),y=C.group().reduceCount(),_=v.group().reduceCount(),B=k.group().reduceCount(),V=x.group(),R=A.group();r.width(l.select("#hour-chart").node().getBoundingClientRect().width).height(180).margins({top:10,right:10,bottom:20,left:40}).dimension(k).group(B).centerBar(!0).gap(1).x(l.scaleLinear().domain([0,23])).ordinalColors(this.colorPalette).yAxis(),r.xAxis().tickFormat((t=>t+":00")).ticks(7),c.width(l.select("#week-chart").node().getBoundingClientRect().width).height(180).margins({top:10,left:10,right:10,bottom:20}).group(y).dimension(C).ordinalColors(this.colorPalette).label((t=>t.key)).title((t=>t.value)).elasticX(!0).xAxis().ticks(4),c.ordering((t=>this.$days().indexOf(t.key))),o.width(l.select("#matched-chart").node().getBoundingClientRect().width).height(180).radius(90).innerRadius(0).dimension(v).group(_).valueAccessor((t=>t.value)).title((t=>t.key+": "+t.value+" matchs")).ordinalColors(this.colorPalette),o.on("pretransition",(function(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=l.select(this);let text=e.text().toUpperCase();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+n.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))}));const D=x.bottom(1).length>0?x.bottom(1)[0].month:null,T=x.top(1).length>0?x.top(1)[0].day:null;d.margins({top:20,left:40,right:20,bottom:20}).width(l.select("#like-chart").node().getBoundingClientRect().width).turnOnControls(!1).curve(l.curveMonotoneX).xyTipsOn(!0).height(180).brushOn(!1).renderArea(!0).dimension(x).group(V).x(l.scaleTime().domain([D,T])).title((t=>e(t.key)+": "+t.value+" likes")).elasticX(!0).elasticY(!0).rangeChart(h).renderDataPoints({radius:3,fillOpacity:.8,strokeOpacity:0}).clipPadding(10).yAxisLabel("Total likes").ordinalColors(this.colorPalette),d.xAxis().ticks(10),d.yAxis().ticks(6),d.filterAll(),h.width(l.select("#range-chart").node().getBoundingClientRect().width).height(30).margins({top:0,right:50,bottom:20,left:40}).dimension(A).group(R).centerBar(!0).elasticY(!0).gap(1).x(l.scaleTime().domain([l.timeHour.offset(D,0),l.timeHour.offset(T,2)])).round(l.timeDay.round).valueAccessor((t=>t.value)).alwaysUseRounding(!0).xUnits(l.timeDays).ordinalColors(this.colorPalette).yAxis().ticks(0),m.crossfilter(f).groupAll(w).html({some:"<strong>%filter-count</strong> selected out of <strong>%total-count</strong> views | <a class='resetAll'>Reset All</a>",all:"All <strong>%total-count</strong> views selected. Please click on the graph to apply filters."}).on("pretransition",((t,filter)=>{this.results=x.top(w.value()),l.select("#dc-data-count"+this.graphId+" a.resetAll").on("click",(()=>{n.filterAll(),n.renderAll()}))})),n.renderAll()}}},w=(0,r(1001).Z)(f,(function(){var t=this,e=t._self._c;return e("VContainer",[e("ChartViewVRowWebShare",[e("VCol",{attrs:{cols:"12"}},[e("VRow",[e("VCol",{attrs:{cols:"12",md:"12"}},[e("div",{attrs:{id:"like-chart"}},[e("strong",[t._v("Likes you've made over time")]),e("ChartViewFilters")],1),e("div",{attrs:{id:"range-chart"}},[e("ChartViewTextSelectTimeRange",[e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])],1)])],1),e("VRow",[e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:"hour-chart"}},[e("strong",[t._v("Time of day")]),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:"week-chart"}},[e("strong",[t._v("Day")]),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:"matched-chart"}},[e("strong",[t._v("Matched")]),e("ChartViewFilters")],1)])],1)],1)],1),e("VRow",[e("div",{staticClass:"dc-data-count",attrs:{id:"dc-data-count"+t.graphId}},[e("span",{staticClass:"filter-count"}),t._v(" selected out of "),e("span",{staticClass:"total-count"}),t._v(" views | "),e("a",{staticClass:"resetAll"},[t._v("Reset All")])])]),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({},"UnitFilterableTable",{headers:t.header,items:t.results},!1))],1)],1)],1)}),[],!1,null,null,null).exports},65701:function(t,e,r){r.r(e),r.d(e,{default:function(){return h}});var l=r(14226),n=r(72514),o=r(97888),c=r(39474),d={components:{BaseButton:n.Z,BaseButtonDownloadData:o.Z,BaseButtonShare:c.Z},mixins:[(0,l.Z)()]},h=(0,r(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude webshare d-flex",attrs:{cols:"12"}},[e("div",{staticClass:"webshare__export-button"},[e("BaseButton",t._b({attrs:{"mdi-icon":"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1))],1),e("div",{staticClass:"webshare__download-button"},[e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1))],1),e("div",{staticClass:"webshare__share-button"},[e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)])],2)}),[],!1,null,null,null).exports},96622:function(t,e,r){r.r(e),r.d(e,{default:function(){return n}});var l={},n=(0,r(1001).Z)(l,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},49814:function(t,e,r){r.r(e),r.d(e,{default:function(){return l}});var l=(0,r(1001).Z)({},(function(){var t=this,e=t._self._c;return e("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[e("span",{domProps:{innerHTML:t._s(t.$t("select-time-range"))}}),t._t("default")],2)}),[],!1,null,null,null).exports}}]);
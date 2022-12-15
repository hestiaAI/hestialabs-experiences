"use strict";(("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience=("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience||[]).push([[6034,2027,6622,9814,5225],{26034:function(t,e,n){n.r(e),n.d(e,{default:function(){return v}});var o=n(60194),r=n(40290),main=n(26641),l=n(74097),c=n(85225),d=n(49814),h=n(96622),m=n(92027),f=n(33242);r.config.defaultColors(o.schemePaired);var C={components:{ChartViewTextSelectTimeRange:d.default,ChartViewFilters:h.default,ChartViewDcFilterCount:m.default,UnitFilterableTable:f.Z},mixins:[l.default],props:{messages:{type:Object,default:()=>({})}},data:()=>({header:[{text:"First Name",value:"firstname"},{text:"Last Name",value:"lastname"},{text:"Email Address",value:"email"},{text:"Company",value:"company"},{text:"Position",value:"position"},{text:"Connected On",value:"dateStr"}],results:[]}),methods:{removeEmptyBins:t=>({top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e),all:()=>t.all()}),drawViz(){const{graphId:t}=this,e=o.timeFormat("%B %d, %Y");this.results=this.values,this.results.forEach((t=>{t.firstname=t.firstName,t.lastname=t.lastName,t.company=t.company||"Unknown",t.position=t.position||"Unknown",t.email=t.emailAddress,t.date=new Date(t.connectedOn),t.week=o.timeWeek(t.date),t.dateStr=e(t.date)}));const n=(0,main.Z)(this.results);this.totalCount=n.size(),this.filterCount=this.totalCount,n.onChange((()=>{this.results=x.top(l.value()),this.filterCount=n.allFiltered().length}));const l=n.groupAll();this.totalCount=n.size(),this.filterCount=this.totalCount,n.onChange((()=>{this.results=x.top(l.value()),this.filterCount=n.allFiltered().length}));const d=new r.LineChart("#connections-chart"+t),h=new r.BarChart("#range-chart"+t),m=new r.RowChart("#company-chart"+t),f=new r.RowChart("#position-chart"+t),C=new r.RowChart("#week-chart"+t),v=this.createTextFilterWidget("#company-search"),w=this.createTextFilterWidget("#position-search");v.dimension(n.dimension((t=>t.company.toLowerCase()))),w.dimension(n.dimension((t=>t.position.toLowerCase()))),o.select("#connections-chart"+t+" a.reset").on("click",(function(){h.filterAll(),d.filterAll(),r.redrawAll()})),o.select("#company-chart"+t+" a.reset").on("click",(function(){m.filterAll(),r.redrawAll()})),o.select("#position-chart"+t+" a.reset").on("click",(function(){f.filterAll(),r.redrawAll()})),o.select("#week-chart"+t+" a.reset").on("click",(function(){C.filterAll(),r.redrawAll()}));const x=n.dimension((t=>t.week)),y=n.dimension((t=>t.company)),k=n.dimension((t=>t.position)),A=n.dimension((t=>{const e=t.date.getDay();return`${this.$days()[e]}`})),_=x.group().reduceCount(),V=y.group().reduceCount(),P=k.group().reduceCount(),F=A.group().reduceCount(),L=x.bottom(1)[0].date,B=x.top(1)[0].date,R=_.top(1)[0].value+2;let S=o.select("#connections-chart"+t).node().getBoundingClientRect().width,T=150;d.renderArea(!0).width(S).height(T).transitionDuration(1e3).margins({top:25,right:25,bottom:25,left:25}).group((0,c.createCumulativeGroup)(_)).dimension(x).curve(o.curveMonotoneX).x(o.scaleTime().domain([o.timeHour.offset(L,0),o.timeHour.offset(B,2)])).y(o.scaleLinear().domain([0,R])).ordinalColors([this.colorPalette[0]]).valueAccessor((t=>t.value)).title((t=>e(t.key)+": "+t.value+" connections made")).xUnits(o.timeHour).brushOn(!1).elasticX(!1).elasticY(!0).xyTipsOn(!0).mouseZoomable(!1).rangeChart(h).renderHorizontalGridLines(!1).renderDataPoints({radius:3,fillOpacity:.8,strokeOpacity:0}).yAxisLabel("Connections").clipPadding(10).yAxis().ticks(5),d.xAxis().ticks(5),h.width(S).height(30).margins({top:0,right:25,bottom:20,left:25}).dimension(x).group(_).centerBar(!0).elasticY(!0).gap(1).x(o.scaleTime().domain([o.timeHour.offset(L,0),o.timeHour.offset(B,2)])).round(o.timeDay.round).valueAccessor((t=>t.value)).alwaysUseRounding(!0).xUnits(o.timeDays).ordinalColors([this.colorPalette[0]]).yAxis().ticks(0),S=o.select("#company-chart"+t).node().getBoundingClientRect().width,T=400,m.width(S).height(T).margins({top:25,left:25,right:25,bottom:25}).group(V).dimension(y).ordinalColors([this.colorPalette[1]]).valueAccessor((t=>t.value)).label((t=>t.key)).data((t=>t.top(20))).title((t=>t.key+": "+t.value+" connections made")).elasticX(!0).xAxis().ticks(4),S=o.select("#week-chart"+t).node().getBoundingClientRect().width,T=400,C.width(S).height(T).margins({top:25,left:25,right:25,bottom:25}).group(F).dimension(A).valueAccessor((t=>t.value)).ordinalColors(this.colorPalette).label((t=>t.key)).title((t=>t.value+" connections")).elasticX(!0).xAxis().ticks(4),C.ordering((t=>this.$days().indexOf(t.key))),S=o.select("#position-chart"+t).node().getBoundingClientRect().width,T=400,f.width(S).height(T).margins({top:25,left:25,right:25,bottom:25}).group(P).dimension(k).ordinalColors([this.colorPalette[2]]).valueAccessor((t=>t.value)).title((t=>t.key+": "+t.value+" connections")).label((t=>t.key)).data((t=>t.top(20))).elasticX(!0).xAxis().ticks(4),r.renderAll()}}},v=(0,n(1001).Z)(C,(function(){var t=this,e=t._self._c;return e("VContainer",[e("VRow",{attrs:{dense:""}},[e("VCol",{attrs:{cols:"12"}},[e("div",{attrs:{id:"connections-chart"+t.graphId}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages["Cumulative number of connections"])}}),e("ChartViewFilters")],1),e("div",{staticClass:"range-chart",attrs:{id:"range-chart"+t.graphId}},[e("ChartViewTextSelectTimeRange")],1)])],1),e("VRow",[e("VCol",{attrs:{cols:"4"}},[e("div",{attrs:{id:"company-chart"+t.graphId}},[e("div",{staticStyle:{display:"flex"}},[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.messages.Company)}}),e("VSpacer"),e("div",{attrs:{id:"company-search"}})],1),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"4"}},[e("div",{attrs:{id:"week-chart"+t.graphId}},[e("span",{directives:[{name:"t",rawName:"v-t",value:t.messages.Day,expression:"messages['Day']"}],staticClass:"font-weight-bold"}),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"4"}},[e("div",{attrs:{id:"position-chart"+t.graphId}},[e("div",{staticStyle:{display:"flex"}},[e("span",{directives:[{name:"t",rawName:"v-t",value:t.messages.Position,expression:"messages['Position']"}],staticClass:"font-weight-bold"}),e("VSpacer"),e("div",{attrs:{id:"position-search"}})],1),e("ChartViewFilters")],1)])],1),e("ChartViewDcFilterCount",t._b({},"ChartViewDcFilterCount",{filterCount:t.filterCount,totalCount:t.totalCount},!1)),e("UnitFilterableTable",t._b({},"UnitFilterableTable",{headers:t.header,items:t.results},!1))],1)}),[],!1,null,null,null).exports},92027:function(t,e,n){n.r(e),n.d(e,{default:function(){return l}});var o=n(40290),r={mixins:[n(85027).Z],props:{filterCount:{type:Number,required:!0},totalCount:{type:Number,required:!0},rowLabel:{type:String,default:null}},methods:{resetAll(){o.filterAll(),o.renderAll()}}},l=(0,n(1001).Z)(r,(function(){var t=this,e=t._self._c;return e("VRow",[t.filterCount===t.totalCount?[e("i18n",{attrs:{tag:"div",path:t.kViewBlock("selected-all")},scopedSlots:t._u([{key:"totalCount",fn:function(){return[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.totalCount)}})]},proxy:!0},t.rowLabel?{key:"rowLabel",fn:function(){return[t._v(" "+t._s(t.rowLabel)+" ")]},proxy:!0}:null],null,!0)}),e("span",{directives:[{name:"t",rawName:"v-t",value:"click-graph",expression:"'click-graph'"}]})]:[e("i18n",{attrs:{tag:"div",path:t.kViewBlock("selected-some")},scopedSlots:t._u([t._l({filterCount:t.filterCount,totalCount:t.totalCount},(function(n,o){return{key:o,fn:function(){return[e("span",{key:o,staticClass:"font-weight-bold",domProps:{textContent:t._s(n)}})]},proxy:!0}})),t.rowLabel?{key:"rowLabel",fn:function(){return[t._v(" "+t._s(t.rowLabel)+" ")]},proxy:!0}:null],null,!0)}),e("span",[t._v(" | "),e("a",{directives:[{name:"t",rawName:"v-t",value:"Reset All",expression:"'Reset All'"}],on:{click:t.resetAll}})])]],2)}),[],!1,null,null,null).exports},96622:function(t,e,n){n.r(e),n.d(e,{default:function(){return r}});var o={},r=(0,n(1001).Z)(o,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},49814:function(t,e,n){n.r(e),n.d(e,{default:function(){return o}});var o=(0,n(1001).Z)({},(function(){var t=this,e=t._self._c;return e("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[e("span",{domProps:{innerHTML:t._s(t.$t("select-time-range"))}}),t._t("default")],2)}),[],!1,null,null,null).exports},85225:function(t,e,n){n.r(e),n.d(e,{addPiePercentage:function(){return m},addXLabel:function(){return l},addYLabel:function(){return c},createCumulativeGroup:function(){return d},removeEmptyBins:function(){return h}});var o=n(60194),r=n(40290);function l(t,e){const n=t.svg().append("text").attr("class","x-axis-label").attr("text-anchor","middle").attr("x",t.width()/2).attr("y",t.height()-10).text(e),o=n.node().getBBox(),r=t.margins();n.attr("x",r.left+(t.width()-r.left-r.right)/2).attr("y",t.height()-Math.ceil(o.height)/2)}function c(t,e){const n=t.svg().append("text").attr("class","y-axis-label").attr("text-anchor","middle").attr("transform","rotate(-90)").attr("x",-t.height()/2).attr("y",10).text(e),o=n.node().getBBox(),r=t.margins();n.attr("x",-r.top-(t.height()-r.top-r.bottom)/2).attr("y",Math.max(Math.ceil(o.height),r.left-Math.ceil(o.height)-5))}function d(t){return{all(){const e={};return t.all().map((function(t){return e[t.key[0]]?e[t.key[0]]+=t.value:e[t.key[0]]=t.value,{key:t.key,value:e[t.key[0]]}}))}}}function h(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}function m(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=o.select(this);let text=e.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+r.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))}}}]);
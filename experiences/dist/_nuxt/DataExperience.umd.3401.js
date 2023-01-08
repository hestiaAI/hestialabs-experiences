"use strict";(("undefined"!=typeof self?self:this).webpackChunkDataExperience=("undefined"!=typeof self?self:this).webpackChunkDataExperience||[]).push([[3401,5701,2027,6622,9814],{63401:function(e,t,r){r.r(t),r.d(t,{default:function(){return C}});var l=r(60194),n=r(40290),main=r(26641),o=r(74097),c=r(6497),d=r(49814),h=r(96622),m=r(92027),f=r(65701);n.config.defaultColors(l.schemePaired);var v={components:{UnitFilterableTable:c.Z,ChartViewTextSelectTimeRange:d.default,ChartViewFilters:h.default,ChartViewDcFilterCount:m.default,ChartViewVRowWebShare:f.default},mixins:[o.default],data:()=>({apps:[],selectedApps:[],selectAppDimension:null,header:[{text:"App",value:"app"},{text:"UID",value:"uid"},{text:"More Info",value:"url"},{text:"Date",value:"dateStr"},{text:"Tracker",value:"tracker"},{text:"Destination Address",value:"daddr"},{text:"Category",value:"category"}],results:[]}),computed:{selectAll(){return this.selectedApps.length===this.apps.length},selectSome(){return this.selectedApps.length>0&&!this.selectAll},icon(){return this.selectAll?"$vuetify.icons.mdiCloseBox":this.selectSome?"$vuetify.icons.mdiMinusBox":"$vuetify.icons.mdiCheckboxBlankOutline"}},methods:{toggle(){this.$nextTick((()=>{this.selectAll?this.selectedApps=[]:this.selectedApps=this.apps.slice(),this.filterApps(this.selectedApps)}))},filterApps(e){this.selectAppDimension.filter(null),this.selectAppDimension.filterFunction((function(t){return e.includes(t)})),n.redrawAll()},removeEmptyBins:e=>({top:t=>e.top(1/0).filter((function(e){return 0!==e.value.count&&0!==e.value})).slice(0,t),all:()=>e.all()}),drawViz(){const e=new n.LineChart("#volume-chart"),t=new n.BarChart("#range-chart"),r=new n.PieChart("#category-chart"),o=new n.RowChart("#advertiser-chart"),c=new n.RowChart("#app-chart"),d=this.createTextFilterWidget("#app-search"),h=this.createTextFilterWidget("#advertiser-search");l.select("#volume-chart a.reset").on("click",(function(){t.filterAll(),e.filterAll(),n.redrawAll()})),l.select("#category-chart a.reset").on("click",(function(){r.filterAll(),n.redrawAll()})),l.select("#advertiser-chart a.reset").on("click",(function(){o.filterAll(),n.redrawAll()})),l.select("#app-chart a.reset").on("click",(function(){c.filterAll(),n.redrawAll()}));const m=l.timeParse("%Q"),f=l.timeFormat("%B %d, %Y");this.values.forEach((e=>{e.date=(e=>m(e)||new Date(e))(e.time)||new Date(e.time),e.day=l.timeDay(e.date),e.url=`https://reports.exodus-privacy.eu.org/en/reports/${e.package}/latest/`,e.dateStr=f(e.day),e.category=""===e.category?"Unknown":e.category,e.app=""===e.app?"Unknown":e.app,e.tracker=""===e.tracker?"Unknown":e.tracker}));const v=(0,main.Z)(this.values),C=v.groupAll();this.totalCount=v.size(),this.filterCount=this.totalCount,v.onChange((()=>{this.results=w.top(C.value()),this.filterCount=v.allFiltered().length}));const w=v.dimension((e=>e.day)),x=v.dimension((e=>e.category)),y=v.dimension((e=>e.tracker)),A=v.dimension((e=>e.app));d.dimension(v.dimension((e=>e.app.toLowerCase()))),h.dimension(v.dimension((e=>e.tracker.toLowerCase()))),this.selectAppDimension=v.dimension((e=>e.app)),this.apps=this.selectAppDimension.group().top(1/0).map((e=>e.key)),this.toggle();const k=w.group().reduceCount(),_=x.group().reduceCount(),V=y.group().reduceCount(),B=A.group().reduceCount(),D=l.min(this.values,(function(e){return e.day})),S=l.max(this.values,(function(e){return e.day})),L=k.top(1)[0].value+2;let R=l.select("#volume-chart").node().getBoundingClientRect().width,F=200;e.renderArea(!0).width(R).height(F).transitionDuration(1e3).margins({top:30,right:50,bottom:25,left:40}).group(k).dimension(w).curve(l.curveMonotoneX).x(l.scaleTime().domain([l.timeHour.offset(D,0),l.timeHour.offset(S,2)])).y(l.scaleLinear().domain([0,L])).ordinalColors([this.colorPalette[0]]).xUnits(l.timeHour).brushOn(!1).elasticX(!1).elasticY(!0).xyTipsOn(!0).mouseZoomable(!1).rangeChart(t).renderHorizontalGridLines(!1).renderDataPoints({radius:3,fillOpacity:.8,strokeOpacity:0}).yAxisLabel("N° of tracker reach").clipPadding(10).yAxis().ticks(5),t.width(R).height(40).margins({top:0,right:50,bottom:20,left:40}).dimension(w).group(k).centerBar(!0).elasticY(!0).gap(1).x(l.scaleTime().domain([l.timeHour.offset(D,0),l.timeHour.offset(S,2)])).round(l.timeDay.round).alwaysUseRounding(!0).xUnits(l.timeDays).ordinalColors([this.colorPalette[0]]).yAxis().ticks(0),R=l.select("#category-chart").node().getBoundingClientRect().width,F=300;const P=Math.min(R,F);r.width(R).height(F).slicesCap(10).radius(P/4).innerRadius(P/8).externalLabels(50).dimension(x).group(_).drawPaths(!0).minAngleForLabel(.1).ordinalColors(this.colorPalette),r.on("pretransition",(function(e){e.selectAll("text.pie-slice.pie-label").call((function(e){e.each((function(e){const t=l.select(this);let text=t.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+n.utils.printSingleValue((e.endAngle-e.startAngle)/(2*Math.PI)*100)+"%)"),t.text(text)}))}))})),R=l.select("#advertiser-chart").node().getBoundingClientRect().width,F=625,o.width(R).height(F).margins({top:20,left:10,right:10,bottom:20}).group(V).dimension(y).ordinalColors([this.colorPalette[2]]).label((e=>e.key)).data((e=>e.top(20))).title((e=>e.value)).elasticX(!0).xAxis().ticks(4),R=l.select("#app-chart").node().getBoundingClientRect().width,F=250,c.width(R).height(F).margins({top:20,left:10,right:10,bottom:20}).group(this.removeEmptyBins(B)).dimension(A).ordinalColors([this.colorPalette[1]]).label((e=>e.key)).data((e=>e.top(10))).title((e=>e.value)).elasticX(!0).xAxis().ticks(4),n.renderAll()}}},C=(0,r(1001).Z)(v,(function(){var e=this,t=e._self._c;return t("VContainer",[t("VRow",[t("VCol",{attrs:{cols:"4",offset:"4"}},[t("VSelect",{attrs:{items:e.apps,label:e.messages.Applications,hint:e.messages["select-applications-hint"],"persistent-hint":"",multiple:""},on:{change:e.filterApps},scopedSlots:e._u([{key:"prepend-item",fn:function(){return[t("VListItem",{attrs:{ripple:""},on:{click:e.toggle}},[t("VListItemAction",[t("VIcon",{attrs:{color:e.selectedApps.length>0?"indigo darken-4":""}},[e._v(" "+e._s(e.icon)+" ")])],1),t("VListItemContent",[t("VListItemTitle",[e._v(e._s(e.$t("Select All")))])],1)],1),t("VDivider",{staticClass:"mt-2"})]},proxy:!0},{key:"selection",fn:function({item:r,index:l}){return[l<3?t("span",[e._v(e._s(r.length>13?r.slice(0,13)+"..":r)+" ")]):e._e(),l<2?t("span",[e._v(", ")]):e._e(),3===l?t("div",{staticClass:"grey--text text-caption"},[e._v(" ("+e._s(e.$tc("plusXOther",e.selectedApps.length-3))+") ")]):e._e()]}}]),model:{value:e.selectedApps,callback:function(t){e.selectedApps=t},expression:"selectedApps"}})],1)],1),t("ChartViewVRowWebShare",[t("VCol",{attrs:{cols:"12",md:"9"}},[t("VRow",[t("VCol",{attrs:{cols:"12"}},[t("div",{attrs:{id:"volume-chart"}},[t("span",{directives:[{name:"t",rawName:"v-t",value:e.messages["Amount of tracking over time"],expression:"messages['Amount of tracking over time']"}],staticClass:"font-weight-bold"}),t("ChartViewFilters")],1),t("div",{attrs:{id:"range-chart"}},[t("ChartViewTextSelectTimeRange")],1)])],1),t("VRow",[t("VCol",{attrs:{cols:"12",md:"6"}},[t("div",{attrs:{id:"category-chart"}},[t("span",{directives:[{name:"t",rawName:"v-t",value:e.messages["Purposes of third party"],expression:"messages['Purposes of third party']"}],staticClass:"font-weight-bold"}),t("ChartViewFilters")],1)]),t("VCol",{attrs:{cols:"12",md:"6"}},[t("div",{attrs:{id:"app-chart"}},[t("div",{staticStyle:{display:"flex"}},[t("span",{directives:[{name:"t",rawName:"v-t",value:e.messages["Applications that use trackers"],expression:"messages['Applications that use trackers']"}],staticClass:"font-weight-bold"}),t("VSpacer"),t("div",{staticClass:"search",attrs:{id:"app-search"}})],1),t("ChartViewFilters")],1)])],1)],1),t("VCol",{attrs:{cols:"12",md:"3"}},[t("div",{attrs:{id:"advertiser-chart"}},[t("div",{staticStyle:{display:"flex"}},[t("span",{directives:[{name:"t",rawName:"v-t",value:e.messages["Companies behind tracking"],expression:"messages['Companies behind tracking']"}],staticClass:"font-weight-bold"}),t("VSpacer"),t("div",{attrs:{id:"advertiser-search"}})],1),t("ChartViewFilters")],1)])],1),t("ChartViewDcFilterCount",e._b({},"ChartViewDcFilterCount",{filterCount:e.filterCount,totalCount:e.totalCount},!1)),t("UnitFilterableTable",e._b({},"UnitFilterableTable",{headers:e.header,items:e.results,kViewBlock:e.kViewBlock},!1))],1)}),[],!1,null,"258f01a1",null).exports},65701:function(e,t,r){r.r(t),r.d(t,{default:function(){return h}});var l=r(14226),n=r(72514),o=r(97888),c=r(39474),d={components:{BaseButton:n.Z,BaseButtonDownloadData:o.Z,BaseButtonShare:c.Z},mixins:[(0,l.Z)()]},h=(0,r(1001).Z)(d,(function(){var e=this,t=e._self._c;return t("VRow",e._b({ref:"domToImageNode"},"VRow",e.$attrs,!1),[e._t("default"),t("VCol",{staticClass:"dom-to-image-exclude webshare d-flex",attrs:{cols:"12"}},[t("div",{staticClass:"webshare__export-button"},[t("BaseButton",e._b({attrs:{"mdi-icon":"mdiExport",text:"Export"},on:{click:e.exportImage}},"BaseButton",{progress:e.progress,status:e.status,error:e.error},!1))],1),t("div",{staticClass:"webshare__download-button"},[t("BaseButtonDownloadData",e._b({},"BaseButtonDownloadData",{disabled:!e.blob,extension:e.extension,filename:e.filename,data:e.blob},!1))],1),t("div",{staticClass:"webshare__share-button"},[t("BaseButtonShare",e._b({attrs:{"file-share":""}},"BaseButtonShare",{files:e.files,disabled:!e.files},!1))],1)])],2)}),[],!1,null,null,null).exports},92027:function(e,t,r){r.r(t),r.d(t,{default:function(){return o}});var l=r(40290),n={mixins:[r(85027).Z],props:{filterCount:{type:Number,required:!0},totalCount:{type:Number,required:!0},rowLabel:{type:String,default:null}},methods:{resetAll(){l.filterAll(),l.renderAll()}}},o=(0,r(1001).Z)(n,(function(){var e=this,t=e._self._c;return t("VRow",[e.filterCount===e.totalCount?[t("i18n",{attrs:{tag:"div",path:e.kViewBlock("selected-all")},scopedSlots:e._u([{key:"totalCount",fn:function(){return[t("span",{staticClass:"font-weight-bold",domProps:{textContent:e._s(e.totalCount)}})]},proxy:!0},e.rowLabel?{key:"rowLabel",fn:function(){return[e._v(" "+e._s(e.rowLabel)+" ")]},proxy:!0}:null],null,!0)}),t("span",{directives:[{name:"t",rawName:"v-t",value:"click-graph",expression:"'click-graph'"}]})]:[t("i18n",{attrs:{tag:"div",path:e.kViewBlock("selected-some")},scopedSlots:e._u([e._l({filterCount:e.filterCount,totalCount:e.totalCount},(function(r,l){return{key:l,fn:function(){return[t("span",{key:l,staticClass:"font-weight-bold",domProps:{textContent:e._s(r)}})]},proxy:!0}})),e.rowLabel?{key:"rowLabel",fn:function(){return[e._v(" "+e._s(e.rowLabel)+" ")]},proxy:!0}:null],null,!0)}),t("span",[e._v(" | "),t("a",{directives:[{name:"t",rawName:"v-t",value:"Reset All",expression:"'Reset All'"}],on:{click:e.resetAll}})])]],2)}),[],!1,null,null,null).exports},96622:function(e,t,r){r.r(t),r.d(t,{default:function(){return n}});var l={},n=(0,r(1001).Z)(l,(function(){var e=this,t=e._self._c;return t("p",{staticClass:"filters"},[t("span",[e._v(" "+e._s(e.$t("Current filter"))+" "),t("span",{staticClass:"filter"})]),t("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},49814:function(e,t,r){r.r(t),r.d(t,{default:function(){return l}});var l=(0,r(1001).Z)({},(function(){var e=this,t=e._self._c;return t("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[t("span",{domProps:{innerHTML:e._s(e.$t("select-time-range"))}}),e._t("default")],2)}),[],!1,null,null,null).exports}}]);
"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[1805,8736,1297,9814],{11805:function(t,e,n){n.r(e),n.d(e,{default:function(){return D}});var l=n(60194),r=n(40290),main=n(26641),o=n(21297),h=n(89295),c=n(18736),m=n(49814),d=n(84695),f={components:{ChartViewVRowWebShare:c.default,ChartViewTextSelectTimeRange:m.default,UnitFilterableTable:d.Z},mixins:[o.default],data(){const t={Day:l.timeDay,Week:l.timeWeek,Month:l.timeMonth,Year:l.timeYear};return{formatDate:l.timeFormat("%B %d, %Y"),fileDimension:null,results:[],selectTimeInt:null,selectFiles:[],filesNames:[],filtered:!1,intervals:t,intervalNames:null,aggregate:!0,minDate:null,maxDate:null,currMinDate:null,currMaxDate:null,total:0,barChart:null,dateDimension:null,volumeGroup:null,header:[["File name","filename"],["Date","dateStr"],["Description","description"]].map((([text,t])=>({text:text,value:t})))}},computed:{selectAll(){return this.selectFiles.length===this.filesNames.length},selectSome(){return this.selectFiles.length>0&&!this.selectAll},icon(){return this.selectAll?"$vuetify.icons.mdiCloseBox":this.selectSome?"$vuetify.icons.mdiMinusBox":"$vuetify.icons.mdiCheckboxBlankOutline"}},methods:{toggle(){this.$nextTick((()=>{this.selectAll?this.selectFiles=[]:this.selectFiles=this.filesNames.slice(),this.filterFiles(this.selectFiles)}))},drawViz(){if(0===this.values.length)return;this.intervalNames=Object.keys(this.intervals).map((t=>({value:t,text:this.$tc(t,2)})));const t=this.values.map((t=>({...t,date:new Date(t.date),day:l.timeDay(t.date),dateStr:(0,h.K1)(t.date)})));this.results=t;const e=(0,main.Z)(t);this.fileDimension=e.dimension((t=>t.filename)),this.filesNames=this.fileDimension.group().top(1/0).map((t=>t.key)),this.dateDimension=e.dimension((t=>t.date)),this.barChart=new r.BarChart("#"+this.graphId),this.rangeChart=new r.BarChart("#range-chart"+this.graphId),this.minDate=l.timeDay.offset(this.dateDimension.bottom(1)[0].date,-12),this.currMinDate=this.formatDate(this.minDate),this.maxDate=this.dateDimension.top(1)[0].date,this.currMaxDate=this.formatDate(this.maxDate),this.total=this.dateDimension.top(1/0).length;const n=l.timeDay.count(this.minDate,this.maxDate);this.selectTimeInt=n<100?"Day":n<1e3?"Week":"Month";const o=l.select("#"+this.graphId).node().getBoundingClientRect().width;this.barChart.width(o).height(180).ordinalColors(["#58539E"]).x(l.scaleTime().domain([l.timeHour.offset(this.minDate,0),l.timeHour.offset(this.maxDate,2)])).xUnits(this.intervals[this.selectTimeInt].range).margins({left:50,top:20,right:50,bottom:20}).dimension(this.dateDimension).group(this.dateDimension.group((t=>this.intervals[this.selectTimeInt](t)))).rangeChart(this.rangeChart).brushOn(!1).elasticX(!1).elasticY(!0).mouseZoomable(!1).clipPadding(10),this.barChart.yAxis().tickFormat((t=>Number.isInteger(t)?t:"")),this.rangeChart.width(o).height(40).margins({top:0,right:50,bottom:20,left:50}).dimension(this.dateDimension).group(this.dateDimension.group((t=>this.intervals.Day(t)))).ordinalColors(["#58539E"]).x(l.scaleTime().domain([l.timeDay.offset(this.minDate,-12),l.timeHour.offset(this.maxDate,12)])).elasticY(!0).xUnits(l.timeDays).brushOn(!0).clipPadding(10),e.onChange((()=>{this.results=e.allFiltered(),this.total=this.results.length;const t=this.dateDimension.currentFilter();t?(this.filtered=!0,this.currMinDate=this.formatDate(t[0]),this.currMaxDate=this.formatDate(t[1])):(this.filtered=!1,this.currMinDate=this.formatDate(this.minDate),this.currMaxDate=this.formatDate(this.maxDate))})),r.renderAll(),this.toggle()},drawBarChart(){this.volumeGroup&&this.volumeGroup.dispose();const t=this.intervals[this.selectTimeInt];this.barChart.xUnits(t.range),this.volumeGroup=this.dateDimension.group((e=>t(e))),this.barChart.dimension(this.dateDimension).group(this.volumeGroup).transitionDuration(1e3).render()},calcDomain(t){let e=t.dimension().top(1),n=t.dimension().bottom(1);e.length>0&&(this.currMinDate=this.formatDate(n[0].date),this.currMaxDate=this.formatDate(e[0].date),n=l.timeMonth.offset(n[0].date,-1),e=l.timeMonth.offset(e[0].date,1),t.x().domain([n,e]))},onTableFilter(t){},filterFiles(t){this.fileDimension.filter(null),this.fileDimension.filterFunction((function(e){return t.includes(e)})),this.calcDomain(this.rangeChart),this.calcDomain(this.barChart),r.redrawAll()},resetFilter(){r.filterAll(),r.redrawAll()}}},D=(0,n(1001).Z)(f,(function(){var t=this,e=t._self._c;return t.values.length>0?e("VContainer",[e("VRow",[e("VCol",{attrs:{cols:"12",md:"7"}},[e("p",{staticClass:"text-h6"},[t._v(" "+t._s(t.$t(t.kViewBlock("graphTitle")))+" ")]),0!==t.total||t.currMinDate||t.currMaxDate?e("i18n",{staticClass:"text-subtitle-2",attrs:{path:t.kViewBlock("datedEvents"),tag:"p"},scopedSlots:t._u([t._l({currMinDate:t.currMinDate,currMaxDate:t.currMaxDate,total:t.total},(function(n,l){return{key:l,fn:function(){return[e("span",{key:l,staticClass:"font-weight-bold",domProps:{textContent:t._s(n)}})]},proxy:!0}}))],null,!0)}):e("p",{staticClass:"text-subtitle-2"},[t._v(" "+t._s(t.$t(t.kViewBlock("graphNoDate")))+" ")])],1),e("VCol",{attrs:{cols:"12",md:"2"}},[e("VSelect",{attrs:{items:t.intervalNames,label:t.$t("Time interval")},on:{change:t.drawBarChart},model:{value:t.selectTimeInt,callback:function(e){t.selectTimeInt=e},expression:"selectTimeInt"}})],1),e("VCol",{attrs:{cols:"12",md:"3"}},[e("VSelect",{attrs:{items:t.filesNames,label:t.$tc("File",2),multiple:""},on:{change:t.filterFiles},scopedSlots:t._u([{key:"prepend-item",fn:function(){return[e("VListItem",{attrs:{ripple:""},on:{click:t.toggle}},[e("VListItemAction",[e("VIcon",{attrs:{color:t.selectFiles.length>0?"indigo darken-4":""}},[t._v(" "+t._s(t.icon)+" ")])],1),e("VListItemContent",[e("VListItemTitle",[t._v(" "+t._s(t.$t("Select All"))+" ")])],1)],1),e("VDivider",{staticClass:"mt-2"})]},proxy:!0},{key:"selection",fn:function({item:n,index:l}){return[0===l?e("span",[t._v(t._s(n.length>13?n.slice(0,13)+"..":n))]):t._e(),1===l?e("span",{staticClass:"grey--text text-caption"},[t._v(" ("+t._s(t.$tc("plusXOther",t.selectFiles.length-1))+") ")]):t._e()]}}],null,!1,1931396690),model:{value:t.selectFiles,callback:function(e){t.selectFiles=e},expression:"selectFiles"}})],1)],1),e("ChartViewVRowWebShare",[e("VCol",{attrs:{cols:"12"}},[e("div",{attrs:{id:t.graphId}}),e("ChartViewTextSelectTimeRange",[e("VBtn",{staticClass:"ma-1",class:{hide:!t.filtered},attrs:{"x-small":"",outlined:"",color:"indigo"},on:{click:t.resetFilter}},[t._v(" "+t._s(t.$t("reset"))+" ")])],1),e("div",{staticClass:"range-chart",attrs:{id:"range-chart"+t.graphId}})],1)],1),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({on:{"current-items":t.onTableFilter}},"UnitFilterableTable",{headers:t.header,items:t.results,kViewBlock:t.kViewBlock},!1))],1)],1)],1):e("VContainer",[e("p",{staticClass:"text-center"},[t._v(" "+t._s(t.$t("No relevant data found"))+" ")])])}),[],!1,null,"3512e396",null).exports},18736:function(t,e,n){n.r(e),n.d(e,{default:function(){return m}});var l=n(12555),r=n(43434),o=n(97888),h=n(9934),c={components:{BaseButton:r.Z,BaseButtonDownloadData:o.Z,BaseButtonShare:h.Z},mixins:[(0,l.Z)()]},m=(0,n(1001).Z)(c,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude",attrs:{cols:"12"}},[e("BaseButton",t._b({attrs:{icon:"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1)),e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1)),e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)],2)}),[],!1,null,null,null).exports},49814:function(t,e,n){n.r(e),n.d(e,{default:function(){return l}});var l=(0,n(1001).Z)({},(function(){var t=this,e=t._self._c;return e("p",{staticClass:"muted pull-right text-subtitle-2 mr-4 mb-1"},[e("span",{domProps:{innerHTML:t._s(t.$t("select-time-range"))}}),t._t("default")],2)}),[],!1,null,null,null).exports},21297:function(t,e,n){n.r(e);var l=n(40290),r=n(18651),o=n(659);const h={props:{values:{type:Array,default:()=>[]},headers:{type:Array,default:()=>[]},messages:{type:Object,default:()=>({})}},data(){return{graphId:"graph_"+this._uid,totalCount:0,filterCount:0}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{drawViz(){},createTextFilterWidget(t,e="Search"){const n=new l.TextFilterWidget(t);return n.placeHolder(this.$tev(e,e)),n}}};e.default=(0,r.Z)(h,o.Z)}}]);
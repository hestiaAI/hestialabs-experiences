"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[4927,1690,6622,9201],{94927:function(t,e,r){r.r(e),r.d(e,{default:function(){return f}});var n=r(60194),l=r(40290),c=r(59201),d=r(31690),o=r(96622);l.config.defaultColors(n.schemePaired);var h={components:{ChartViewFilters:o.default},mixins:[d.default],props:{valueAccessor:{type:String,required:!0},sumAccessor:{type:String,default:""},defaultValue:{type:String,default:"N/A"}},data:()=>({}),methods:{drawViz(){const t=new l.PieChart(`#pie-chart-${this.graphId}`);n.select(`#pie-chart-${this.graphId} a.reset`).on("click",(function(){t.filterAll(),l.redrawAll()}));const e=this.ndx.dimension((t=>t[this.valueAccessor]||this.defaultValue)),r=this.sumAccessor?e.group().reduceSum((t=>t[this.sumAccessor])):e.group().reduceCount(),d=n.select(`#pie-chart-${this.graphId}`).node().getBoundingClientRect().width,o=Math.min(d,this.height);t.width(d).height(this.height).slicesCap(8).radius(o/4).innerRadius(o/8).externalLabels(40).dimension(e).group(r).valueAccessor((t=>t.value)).title((t=>`${t.key}: ${t.value} ${this.valueLabel}`)).drawPaths(!0).minAngleForLabel(0).ordinalColors(this.colorPalette),(0,c.addPiePercentage)(t),l.renderAll()}}},f=(0,r(1001).Z)(h,(function(){var t=this,e=t._self._c;return e("VContainer",[e("div",{attrs:{id:`pie-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("strong",[t._v(t._s(t.title))])]),e("ChartViewFilters")],1)])}),[],!1,null,"65e52735",null).exports},96622:function(t,e,r){r.r(e),r.d(e,{default:function(){return l}});var n={},l=(0,r(1001).Z)(n,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},31690:function(t,e,r){r.r(e);var n=r(40290);e.default={props:{ndx:{type:Object,required:!0},title:{type:String,default:""},valueLabel:{type:String,default:"records"},height:{type:Number,default:250},position:{type:Number,required:!0},colorPalette:{type:Array,default:()=>["#bebada","#8dd3c7","#fb8072","#80b1d3","#fdb462","#b3de69","#bc80bd","#ccebc5"]}},data(){return{graphId:"graph_"+this._uid}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{createTextFilterWidget(t,e="Search"){const r=new n.TextFilterWidget(t);return r.placeHolder(this.$t(e)),r}}}},59201:function(t,e,r){r.r(e),r.d(e,{addPiePercentage:function(){return f},addXLabel:function(){return c},addYLabel:function(){return d},createCumulativeGroup:function(){return o},removeEmptyBins:function(){return h}});var n=r(60194),l=r(40290);function c(t,e){const r=t.svg().append("text").attr("class","x-axis-label").attr("text-anchor","middle").attr("x",t.width()/2).attr("y",t.height()-10).text(e),n=r.node().getBBox(),l=t.margins();r.attr("x",l.left+(t.width()-l.left-l.right)/2).attr("y",t.height()-Math.ceil(n.height)/2)}function d(t,e){const r=t.svg().append("text").attr("class","y-axis-label").attr("text-anchor","middle").attr("transform","rotate(-90)").attr("x",-t.height()/2).attr("y",10).text(e),n=r.node().getBBox(),l=t.margins();r.attr("x",-l.top-(t.height()-l.top-l.bottom)/2).attr("y",Math.max(Math.ceil(n.height),l.left-Math.ceil(n.height)-5))}function o(t){return{all(){const e={};return t.all().map((function(t){return e[t.key[0]]?e[t.key[0]]+=t.value:e[t.key[0]]=t.value,{key:t.key,value:e[t.key[0]]}}))}}}function h(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}function f(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=n.select(this);let text=e.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+l.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))}}}]);
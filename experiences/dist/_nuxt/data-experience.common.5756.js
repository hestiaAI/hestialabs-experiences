"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[5756,1690,6622,5253,9201],{5756:function(t,e,r){r.r(e),r.d(e,{default:function(){return f}});var n=r(60194),l=r(40290),o=r(59201),c=r(31690),h=r(96622);r(5253),l.config.defaultColors(n.schemePaired);var d={components:{ChartViewFilters:h.default},mixins:[c.default],props:{valueAccessor:{type:String,required:!0},valueAsArray:{type:Boolean,default:!1},sumAccessor:{type:String,default:""},topK:{type:Number,default:10},isScrollable:{type:Boolean,default:!1},defaultValue:{type:String,default:""}},data:()=>({total:"N/A"}),computed:{cssProps(){return{"--height":this.height+6.5+"px"}}},methods:{drawViz(){const t=new l.RowChart(`#top-chart-${this.graphId}`),e=this.createTextFilterWidget(`#top-search-${this.graphId}`);n.select(`#top-chart-${this.graphId} a.reset`).on("click",(function(){t.filterAll(),l.redrawAll()}));const r=this.ndx.dimension((t=>this.valueAsArray?JSON.parse(t[this.valueAccessor])||[this.defaultValue]:t[this.valueAccessor]||this.defaultValue),this.valueAsArray);e.dimension(this.ndx.dimension((t=>this.valueAsArray?JSON.parse(t[this.valueAccessor].toLowerCase())||[this.defaultValue.toLowerCase()]:(t[this.valueAccessor]||this.defaultValue).toLowerCase()),this.valueAsArray));const c=this.sumAccessor?r.group().reduceSum((t=>t[this.sumAccessor])):r.group().reduceCount();this.total=c.size();const h=this.isScrollable?Math.max(20*Math.min(this.topK,c.size()),this.height):this.height,d=n.select(`#top-chart-${this.graphId}`).node().getBoundingClientRect().width;t.width(d).height(h).margins({top:20,left:10,right:10,bottom:-5}).group(this.isScrollable?c:(0,o.removeEmptyBins)(c)).dimension(r).ordinalColors([this.colorPalette[this.position%this.colorPalette.length]]).label((t=>t.key)).data((t=>t.top(this.topK))).title((t=>`${t.value} ${this.valueLabel}`)).elasticX(!0).xAxis().ticks(4),l.axisChart(`#top-chart-${this.graphId}-axis`).margins({top:0,left:10,right:10,bottom:10}).height(20).width(d).dimension(r).group(c).elastic(!0).axis().ticks(4),l.renderAll()}}},f=(0,r(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VContainer",{style:t.cssProps},[e("div",{staticStyle:{display:"flex"}},[e("strong",[t._v(t._s(t.title))]),e("VSpacer"),e("div",{attrs:{id:`top-search-${t.graphId}`}})],1),e("ChartViewFilters"),e("div",{class:{isScrollable:t.isScrollable},attrs:{id:`top-chart-${t.graphId}`}}),e("div",{attrs:{id:`top-chart-${t.graphId}-axis`}}),t.topK<t.total?e("div",{directives:[{name:"t",rawName:"v-t",value:{path:"show-top-n",args:{n:t.topK,m:t.total}},expression:"{ path: 'show-top-n', args: { n: topK, m: total } }"}],staticClass:"text-caption"}):t._e()],1)}),[],!1,null,"c8af34f6",null).exports},96622:function(t,e,r){r.r(e),r.d(e,{default:function(){return l}});var n={},l=(0,r(1001).Z)(n,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},31690:function(t,e,r){r.r(e);var n=r(40290);e.default={props:{ndx:{type:Object,required:!0},title:{type:String,default:""},valueLabel:{type:String,default:"records"},height:{type:Number,default:250},position:{type:Number,required:!0},colorPalette:{type:Array,default:()=>["#bebada","#8dd3c7","#fb8072","#80b1d3","#fdb462","#b3de69","#bc80bd","#ccebc5"]}},data(){return{graphId:"graph_"+this._uid}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{createTextFilterWidget(t,e="Search"){const r=new n.TextFilterWidget(t);return r.placeHolder(this.$t(e)),r}}}},5253:function(t,e,r){r.r(e);var n=r(60194),l=r(40290);l.axisChart=function(t,e){let r;const o=new(l.CapMixin(l.MarginMixin));let c,h,d,f,x=n.axisBottom();const m=["axisBottom","axisTop","axisLeft","axisRight"];function v(){let t=r.select("g.axis");!function(){if(!c||h){const t=n.extent(f,(t=>o.cappedValueAccessor(t)));t[0]>0&&(t[0]=0),t[1]<0&&(t[1]=0),c=n.scaleLinear().domain(t).range([0,o.effectiveWidth()])}x.scale(c)}(),t.empty()&&(t=r.append("g").attr("class","axis")),l.transition(t,o.transitionDuration(),o.transitionDelay()).call(x)}function y(){f=o.data(),v()}return o.axisCap=o.cap,o._doRender=function(){return o.resetSvg(),r=o.svg().append("g").attr("transform","translate("+o.margins().left+","+o.margins().top+")"),y(),o},o.type=function(t){return arguments.length?(-1!==m.indexOf(t)?(x=n[t](),d=t):console.error(t+" is not a valid d3 axis type"),o):d},o.scale=function(t){return arguments.length?(c=t,o):c},o.elastic=function(t){return arguments.length?(h=t,o):h},o.axis=function(){return x},o._doRedraw=function(){return y(),o},o.anchor(t,e)}},59201:function(t,e,r){r.r(e),r.d(e,{addPiePercentage:function(){return f},addXLabel:function(){return o},addYLabel:function(){return c},createCumulativeGroup:function(){return h},removeEmptyBins:function(){return d}});var n=r(60194),l=r(40290);function o(t,e){const r=t.svg().append("text").attr("class","x-axis-label").attr("text-anchor","middle").attr("x",t.width()/2).attr("y",t.height()-10).text(e),n=r.node().getBBox(),l=t.margins();r.attr("x",l.left+(t.width()-l.left-l.right)/2).attr("y",t.height()-Math.ceil(n.height)/2)}function c(t,e){const r=t.svg().append("text").attr("class","y-axis-label").attr("text-anchor","middle").attr("transform","rotate(-90)").attr("x",-t.height()/2).attr("y",10).text(e),n=r.node().getBBox(),l=t.margins();r.attr("x",-l.top-(t.height()-l.top-l.bottom)/2).attr("y",Math.max(Math.ceil(n.height),l.left-Math.ceil(n.height)-5))}function h(t){return{all(){const e={};return t.all().map((function(t){return e[t.key[0]]?e[t.key[0]]+=t.value:e[t.key[0]]=t.value,{key:t.key,value:e[t.key[0]]}}))}}}function d(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}function f(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=n.select(this);let text=e.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+l.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))}}}]);
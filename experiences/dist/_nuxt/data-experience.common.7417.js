"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[7417,8736,1297,9258],{17417:function(t,e,r){r.r(e),r.d(e,{default:function(){return f}});var n=r(60194),l=r(60171),o=r(19258),c=r(21297),d={components:{ChartViewVRowWebShare:r(18736).default},mixins:[c.default],props:{dateAccessor:{type:Object,required:!0},seriesAccessor:{type:Object,required:!0},valueAccessor:{type:String,default:null},valueFormat:{type:String,default:"~s"},yLabel:{type:String,default:"Count"},filters:{type:Array,default:()=>[]},lineWidth:{type:Number,default:2},dotWidth:{type:Number,default:2},dotRadius:{type:Number,default:4},padding:{type:Number,default:5},margin:{type:Number,default:5},adj:{type:Number,default:70},title:{type:String,default:"Title of the Graph"},legendOffset:{type:Number,default:0},legendPadding:{type:Number,default:10},dateFormat:{type:String,default:""},cumSum:{type:Boolean,default:!1}},data:()=>({slices:[],selectedInterval:null,intervals:{},namesInterval:[],settingDialog:!1,filterItems:{},filterModel:{},extentDate:null,dateParser:t=>new Date(t)}),methods:{initFilters(){this.filters.forEach(((filter,i)=>{this.filterItems[filter.value]=[],this.filterItems[filter.value]=this.values.map((i=>i[filter.value])).filter(((t,e,r)=>r.indexOf(t)===e))}))},resetFilters(){this.filters.forEach((filter=>{this.filterModel[filter.value]=null}))},applyFilters(){this.slices.forEach((t=>{const e=this.intervals[this.selectedInterval],r=Object.keys(this.filterModel).filter((t=>null!=this.filterModel[t]));if(t.current=t.values.filter((t=>r.every((e=>this.filterModel[e]===t[e])))),t.current=(0,l.b1)().key((t=>e.parser(this.dateParser(t.date)))).rollup((t=>n.sum(t,(t=>t.value)))).entries(t.current),t.current=(0,o.addMissingDate)(t.current,"key","value",e.parser,0,this.extentDate[0],this.extentDate[1]),t.current=t.current.sort(((t,e)=>this.dateParser(t.key)-this.dateParser(e.key))),this.cumSum){const e=n.cumsum(t.current,(t=>t.value));t.current=t.current.map(((t,r)=>({...t,value:e[r]})))}}))},drawViz(){this.dateFormat&&(this.dateParser=n.timeParse(this.dateFormat)),this.extentDate=n.extent(this.values,(t=>this.dateParser(t[this.dateAccessor.value])));const t=n.timeDay.count(this.extentDate[0],this.extentDate[1]);if(!t)return void console.error("Unrecognized Dates");t<93&&(this.intervals.Day={parser:n.timeDay,format:n.timeFormat("%B %d, %Y")}),t>14&&t<651&&(this.intervals.Week={parser:n.timeWeek,format:n.timeFormat("%B %d, %Y")}),t>62&&t<1800&&(this.intervals.Month={parser:n.timeMonth,format:n.timeFormat("%B %Y")}),t>730&&(this.intervals.Year={parser:n.timeYear,format:n.timeFormat("%Y")}),this.namesInterval=Object.keys(this.intervals).map((t=>({value:t,text:this.$tc(t,2)})));const e=this.values.map((i=>i[this.seriesAccessor.value])).filter(((t,e,r)=>r.indexOf(t)===e));this.slices=e.map((a=>({id:"legend"in this.messages?this.messages.legend[a]:a,values:this.values.filter((t=>a===t[this.seriesAccessor.value])).map((t=>{const e={date:this.dateParser(t[this.dateAccessor.value]),value:this.valueAccessor?+t[this.valueAccessor]:1};return this.filters.forEach((r=>{e[r.value]=t[r.value]})),e})).sort(((t,e)=>t.date-e.date))}))),this.selectedInterval=this.namesInterval.slice(-1)[0].value,this.initFilters(),this.applyFilters(),this.draw()},draw(){const{graphId:t,adj:e}=this;n.select(`#${t} svg`).remove();const svg=n.select(`#${t}`).append("svg").attr("preserveAspectRatio","xMinYMin meet").attr("viewBox",`-${e} -${e} ${800+2*e} ${300+2*e}`).style("padding",this.padding).style("margin",this.margin).classed("svg-content",!0);function r(data,t,e){return n.extent(data.reduce((function(r,l){const o=n.extent(l[t],e);return r.push(o[0]),r.push(o[1]),r}),[]))}const l=n.scaleTime().range([0,800]),o=n.scaleLinear().rangeRound([300,0]);l.domain(r(this.slices,"current",(t=>this.dateParser(t.key)))),o.domain([0,r(this.slices,"current",(t=>t.value))[1]]);const c=n.axisLeft().ticks(5).scale(o),d=n.axisBottom().ticks(8).scale(l);svg.append("g").attr("class","xAxis").attr("transform","translate(0,300)").call(d).selectAll("text").attr("y",0).attr("x",9).attr("dy","2em").attr("transform","rotate(-30)").style("text-anchor","end"),svg.append("g").attr("class","yAxis").call(c).append("text").attr("transform","rotate(-90)").attr("dy",".75em").attr("y",-60).style("text-anchor","end").text(this.yLabel),n.selectAll("#"+t+" g.yAxis g.tick").append("line").attr("class","gridline").attr("x1",0).attr("y1",0).attr("x2",800).attr("y2",0);const f=this.slices.map((t=>t.id)),h=n.scaleOrdinal().domain(f).range(n.schemeDark2),legend=svg.selectAll(".legend").data(f).enter().append("g");legend.append("circle").attr("r",7).attr("cx",-20).attr("cy",-40).attr("fill",(t=>h(t))),legend.append("text").attr("x",-5).attr("y",-37).text((function(t){return t})),legend.attr("transform",((t,i)=>"translate("+(n.sum(f,((t,e)=>e<i?legend.nodes()[e].getBBox().width:0))+this.legendOffset+this.legendPadding*i)+",0)")),n.select("#"+t+".tooltip").remove();const v=n.select("body").append("div").attr("class","tooltip").attr("id",t).style("opacity",0),m=this,y=n.format(this.valueFormat);const line=n.line().curve(n.curveMonotoneX).x((t=>l(this.dateParser(t.key)))).y((t=>o(t.value))),x=svg.selectAll("lines").data(this.slices).enter().append("g");x.append("path").attr("fill","none").attr("stroke",(t=>h(t.id))).attr("stroke-width",this.lineWidth).attr("d",(t=>line(t.current))).attr("stroke-dashoffset",(function(){return n.select(this).node().getTotalLength()})).attr("stroke-dasharray",(function(){return n.select(this).node().getTotalLength()})).transition().duration(5e3).ease(n.easeSin).attr("stroke-dashoffset",0);const k=x.selectAll("circle").data((t=>t.current.map((e=>(e.color=h(t.id),e.name=t.id,e))))).enter().append("circle");k.attr("stroke",(t=>t.color)).attr("fill","white").attr("stroke-width",this.dotWidth).attr("cy",(t=>o(t.value))).attr("cx",(t=>l(this.dateParser(t.key)))).transition().duration(1500).delay(((t,i)=>100*i+500)).ease(n.easeSin).attr("cy",(t=>o(t.value))).attr("cx",(t=>l(this.dateParser(t.key)))).attr("r",this.dotRadius).attr("class","datapoint").attr("id",((t,i)=>i)).style("opacity",1);const V=this.dotRadius;k.on("mouseover",(function(t,e){n.select(this).attr("fill",(t=>t.color)).transition().duration(60).attr("r",V+5),function(t,e){v.transition().duration(60).style("opacity",.98),v.html("<b>"+m.intervals[m.selectedInterval].format(m.dateParser(e.key))+"</b><br/>"+y(e.value)).style("left",t.pageX-55+"px").style("top",t.pageY-45+"px")}(t,e)})),k.on("mouseleave",(function(){n.select(this).attr("fill","white").transition().duration(60).attr("r",V),v.transition().duration(60).style("opacity",0)}))}}},f=(0,r(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VRow",[e("VCol",{attrs:{cols:"12",md:"8","offset-md":"2"}},[e("VRow",{attrs:{dense:""}},[e("VCol",{attrs:{cols:"9"}},[e("p",{staticClass:"text-h6"},[t._v(" "+t._s(t.title)+" ")])]),e("VSpacer"),e("VCol",{staticClass:"text-right",attrs:{cols:"3"}},[0===t.filters.length?e("VSelect",{attrs:{items:t.namesInterval,label:t.$t("Time interval"),dense:""},on:{change:function(e){t.applyFilters(),t.draw()}},model:{value:t.selectedInterval,callback:function(e){t.selectedInterval=e},expression:"selectedInterval"}}):t._e(),t.filters.length>0?e("VDialog",{attrs:{persistent:"","max-width":"300px"},scopedSlots:t._u([{key:"activator",fn:function({on:r,attrs:n}){return[e("VBtn",t._g(t._b({attrs:{color:"primary",dark:"",small:"",fab:""}},"VBtn",n,!1),r),[e("VIcon",{attrs:{small:""}},[t._v(" $vuetify.icons.mdiTuneVariant ")])],1)]}}],null,!1,530295481),model:{value:t.settingDialog,callback:function(e){t.settingDialog=e},expression:"settingDialog"}},[e("VCard",[e("VCardTitle",[e("span",{staticClass:"text-h5"},[t._v(t._s(t.$t("Settings"))+"/"+t._s(t.$t("Filters")))])]),e("VCardText",[e("VContainer",[e("VRow",[e("VCol",{attrs:{cols:"6",sm:"12"}},[e("VSelect",{attrs:{items:t.namesInterval,label:t.$t("Time interval"),dense:""},model:{value:t.selectedInterval,callback:function(e){t.selectedInterval=e},expression:"selectedInterval"}})],1),t._l(t.filters,(function(filter){return e("VCol",{key:filter.value,attrs:{cols:"6",sm:"12"}},[e("VSelect",{attrs:{items:t.filterItems[filter.value]?t.filterItems[filter.value]:[],label:filter.text,dense:""},model:{value:t.filterModel[filter.value],callback:function(e){t.$set(t.filterModel,filter.value,e)},expression:"filterModel[filter.value]"}})],1)}))],2)],1)],1),e("VCardActions",[e("VSpacer"),e("VBtn",{directives:[{name:"t",rawName:"v-t",value:"Reset",expression:"'Reset'"}],attrs:{color:"red darken-1",text:""},on:{click:function(e){return t.resetFilters()}}}),e("VBtn",{directives:[{name:"t",rawName:"v-t",value:"Close",expression:"'Close'"}],attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.settingDialog=!1}}}),e("VBtn",{directives:[{name:"t",rawName:"v-t",value:"Save",expression:"'Save'"}],attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.settingDialog=!1,t.applyFilters(),t.draw()}}})],1)],1)],1):t._e()],1)],1),e("ChartViewVRowWebShare",{attrs:{dense:""}},[e("VCol",{attrs:{cols:"12"}},[e("div",{attrs:{id:t.graphId}})])],1)],1)],1)}),[],!1,null,"eb551ed6",null).exports},18736:function(t,e,r){r.r(e),r.d(e,{default:function(){return f}});var n=r(12555),l=r(37081),o=r(97888),c=r(9934),d={components:{BaseButton:l.Z,BaseButtonDownloadData:o.Z,BaseButtonShare:c.Z},mixins:[(0,n.Z)()]},f=(0,r(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude",attrs:{cols:"12"}},[e("BaseButton",t._b({attrs:{icon:"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1)),e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1)),e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)],2)}),[],!1,null,null,null).exports},60171:function(t,e,r){r.d(e,{XP:function(){return k},b1:function(){return c}});var n="$";function l(){}function map(object,t){var map=new l;if(object instanceof l)object.each((function(t,e){map.set(e,t)}));else if(Array.isArray(object)){var e,i=-1,r=object.length;if(null==t)for(;++i<r;)map.set(i,object[i]);else for(;++i<r;)map.set(t(e=object[i],i,object),e)}else if(object)for(var n in object)map.set(n,object[n]);return map}l.prototype=map.prototype={constructor:l,has:function(t){return n+t in this},get:function(t){return this[n+t]},set:function(t,e){return this[n+t]=e,this},remove:function(t){var e=n+t;return e in this&&delete this[e]},clear:function(){for(var t in this)t[0]===n&&delete this[t]},keys:function(){var t=[];for(var e in this)e[0]===n&&t.push(e.slice(1));return t},values:function(){var t=[];for(var e in this)e[0]===n&&t.push(this[e]);return t},entries:function(){var t=[];for(var e in this)e[0]===n&&t.push({key:e.slice(1),value:this[e]});return t},size:function(){var t=0;for(var e in this)e[0]===n&&++t;return t},empty:function(){for(var t in this)if(t[0]===n)return!1;return!0},each:function(t){for(var e in this)e[0]===n&&t(this[e],e.slice(1),this)}};var o=map;function c(){var t,e,r,n=[],l=[];function c(r,l,d,f){if(l>=n.length)return null!=t&&r.sort(t),null!=e?e(r):r;for(var h,v,m,i=-1,y=r.length,x=n[l++],k=o(),V=d();++i<y;)(m=k.get(h=x(v=r[i])+""))?m.push(v):k.set(h,[v]);return k.each((function(t,e){f(V,e,c(t,l,d,f))})),V}function m(map,t){if(++t>n.length)return map;var r,o=l[t-1];return null!=e&&t>=n.length?r=map.entries():(r=[],map.each((function(e,n){r.push({key:n,values:m(e,t)})}))),null!=o?r.sort((function(a,b){return o(a.key,b.key)})):r}return r={object:function(t){return c(t,0,d,f)},map:function(t){return c(t,0,h,v)},entries:function(t){return m(c(t,0,h,v),0)},key:function(t){return n.push(t),r},sortKeys:function(t){return l[n.length-1]=t,r},sortValues:function(e){return t=e,r},rollup:function(t){return e=t,r}}}function d(){return{}}function f(object,t,e){object[t]=e}function h(){return o()}function v(map,t,e){map.set(t,e)}function m(){}var y=o.prototype;function x(object,t){var e=new m;if(object instanceof m)object.each((function(t){e.add(t)}));else if(object){var i=-1,r=object.length;if(null==t)for(;++i<r;)e.add(object[i]);else for(;++i<r;)e.add(t(object[i],i,object))}return e}m.prototype=x.prototype={constructor:m,has:y.has,add:function(t){return this[n+(t+="")]=t,this},remove:y.remove,clear:y.clear,values:y.keys,size:y.size,empty:y.empty,each:y.each};function k(map){var t=[];for(var e in map)t.push(e);return t}},21297:function(t,e,r){r.r(e);var n=r(40290),l=r(18651),o=r(659);const c={props:{values:{type:Array,default:()=>[]},headers:{type:Array,default:()=>[]},messages:{type:Object,default:()=>({})}},data(){return{graphId:"graph_"+this._uid,totalCount:0,filterCount:0}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{drawViz(){},createTextFilterWidget(t,e="Search"){const r=new n.TextFilterWidget(t);return r.placeHolder(this.$tev(e,e)),r}}};e.default=(0,l.Z)(c,o.Z)},19258:function(t,e,r){r.r(e),r.d(e,{addMissingDate:function(){return l}});var n=r(60194);function l(data,t,e,r,l=0,o=null,c=null){if(data.length<=0)return[];const d=n.extent(data,(e=>new Date(e[t])));return r.range(null!==o?r.floor(o):r.floor(d[0]),null!==c?r.ceil(c):r.ceil(d[1]),1).filter((e=>!data.map((e=>e[t])).includes(e.toString()))).forEach((r=>{const n={...data[0]};n[t]=r,n[e]=l,data.push(n)})),data}}}]);
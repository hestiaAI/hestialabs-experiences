(("undefined"!=typeof self?self:this).webpackChunkDataExperience=("undefined"!=typeof self?self:this).webpackChunkDataExperience||[]).push([[3198,9706],{23198:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return f}});var l=r(60194),n=r(40290),main=r(26641),o=r(74097),c=r(17344),h=r(6497);n.config.defaultColors(l.schemePaired);var d={components:{ChartCaller:c.default,UnitFilterableTable:h.Z},mixins:[o.default],props:{graphs:{type:Array,required:!0},showTable:{type:Boolean,default:!0}},data(){return{ndx:null,results:this.values}},methods:{resetAll(){n.filterAll(),n.renderAll()},drawViz(){this.ndx=(0,main.Z)(this.results);const t=new n.DataCount(`#dc-data-count-${this.graphId}`),e=this.ndx.groupAll();t.crossfilter(this.ndx).groupAll(e).html({some:`<strong>%filter-count</strong> ${this.$t("selected-out-of")} <strong>%total-count</strong> ${this.$t("records")} | <a class='resetAll'>${this.$t("Reset All")}</a>`,all:`Total: <strong>%total-count</strong> ${this.$t("records")}. ${this.$t("click-graph")}`}).on("pretransition",((t,filter)=>{this.results=this.ndx.allFiltered(),l.select(`#dc-data-count-${this.graphId} a.resetAll`).on("click",this.resetAll)})),n.renderAll()}}},f=(0,r(1001).Z)(d,(function(){var t=this,e=t._self._c;return e("VContainer",[e("VRow",[t._l(t.graphs,(function(r,l){return e("VCol",{key:l,attrs:{cols:"12",md:r.cols||"6","offset-md":r.offset||"0"}},[t.ndx&&r.type?e("ChartCaller",{attrs:{type:r.type,"viz-props":{values:t.values||[],ndx:t.ndx,position:l,colorPalette:t.colorPalette,...r}}}):t._e()],1)})),e("VCol",{staticClass:"text-center",attrs:{cols:"12"}},[e("div",{staticClass:"dc-data-count",attrs:{id:`dc-data-count-${t.graphId}`}})]),e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({directives:[{name:"show",rawName:"v-show",value:t.showTable,expression:"showTable"}]},"UnitFilterableTable",{headers:t.headers,items:t.results},!1))],1)],2)],1)}),[],!1,null,null,null).exports},17344:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return n}});var l={props:{type:{type:String,required:!0},vizProps:{type:Object,default:()=>({})}},computed:{component(){return()=>r(40342)(`./${this.type}`)}}},n=(0,r(1001).Z)(l,(function(){var t=this;return(0,t._self._c)(t.component,t._b({tag:"component"},"component",t.vizProps,!1))}),[],!1,null,null,null).exports},40342:function(t,e,r){var map={"./ChartCaller":[17344],"./ChartCaller.vue":[17344],"./ChartViewDcFilterCount":[92027,2027],"./ChartViewDcFilterCount.vue":[92027,2027],"./HourChart":[41734,1734],"./HourChart.vue":[41734,1734],"./PieChart":[19398,9398],"./PieChart.vue":[19398,9398],"./TimelineChart":[5058,5058],"./TimelineChart.vue":[5058,5058],"./TopChart":[17013,7013],"./TopChart.vue":[17013,7013],"./WeekChart":[62934,2934],"./WeekChart.vue":[62934,2934],"./mixin":[27473,7473],"./mixin.js":[27473,7473]};function l(t){if(!r.o(map,t))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=map[t],l=e[0];return Promise.all(e.slice(1).map(r.e)).then((function(){return r(l)}))}l.keys=function(){return Object.keys(map)},l.id=40342,t.exports=l}}]);
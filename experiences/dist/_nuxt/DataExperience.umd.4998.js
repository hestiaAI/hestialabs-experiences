"use strict";(("undefined"!=typeof self?self:this).webpackChunkDataExperience=("undefined"!=typeof self?self:this).webpackChunkDataExperience||[]).push([[4998],{34998:function(t,e,l){l.r(e),l.d(e,{default:function(){return h}});var r=l(74097),n=l(23096),o=l(34610),c={components:{UnitKepler:n.Z,UnitFilterableTable:o.Z},mixins:[r.default],data(){return{filteredRows:this.values,header:[["File","filename"],["Path","path"],["Latitude","latitude"],["Longitude","longitude"],["Description","description"]].map((([text,t])=>({text:text,value:t})))}},computed:{total(){return this.values.length},filtered(){return this.filteredRows.length},keplerData(){return{fields:this.header.map((({text:t})=>({name:t}))),rows:this.filteredRows.map((t=>this.header.map((e=>t[e.value]))))}},keplerArgs(){return{keplerData:this.keplerData,config:null}}},methods:{onTableFilter(t){this.filteredRows=t}}},h=(0,l(1001).Z)(c,(function(){var t=this,e=t._self._c;return t.values.length>0?e("VContainer",[e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("p",{staticClass:"text-h6"},[t._v(" "+t._s(t.$t(t.kViewBlock("graphTitle")))+" ")]),0===t.total?e("p",{staticClass:"text-subtitle-2"},[t._v(" "+t._s(t.$t(t.kViewBlock("graphNoLocation")))+" ")]):e("i18n",{staticClass:"text-subtitle-2",attrs:{path:t.kViewBlock("locations"),tag:"p"},scopedSlots:t._u([{key:"total",fn:function(){return[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.total)}})]},proxy:!0}],null,!1,4258389039)})],1)],1),t.total>0?[e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitKepler",{attrs:{args:t.keplerArgs}})],1)],1),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({on:{"current-items":t.onTableFilter}},"UnitFilterableTable",{headers:t.header,items:t.values,kViewBlock:t.kViewBlock},!1))],1)],1)]:t._e()],2):t._e()}),[],!1,null,null,null).exports}}]);
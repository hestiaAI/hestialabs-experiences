"use strict";(("undefined"!=typeof self?self:this).webpackChunkDataExperience=("undefined"!=typeof self?self:this).webpackChunkDataExperience||[]).push([[9968,5701,6622,5225],{99968:function(t,e,n){n.r(e),n.d(e,{default:function(){return v}});var r=n(60194),o=n(40290),main=n(26641),l=n(74097),d=n(85225),c=n(65701),h=n(96622),f=n(6497);o.config.defaultColors(r.schemePaired);var m={components:{ChartViewVRowWebShare:c.default,ChartViewFilters:h.default,UnitFilterableTable:f.Z},mixins:[l.default],props:{},data:()=>({header:[{text:"App",value:"bundleId"},{text:"Domain",value:"domain"},{text:"Domain Type",value:"domainType"},{text:"Domain Owner",value:"domainOwner"},{text:"Context",value:"context"},{text:"Initated by",value:"initiatedType"},{text:"Hits",value:"hits"}],results:[]}),methods:{resetAll(){o.filterAll(),o.renderAll()},decodeDefault(t){try{return t&&"undefined"!==t?decodeURIComponent(escape(t)):"Unknown"}catch(e){return console.error(e),t||"Unknown"}},createTopRowChart(t,e,n,l){const c=new o.RowChart(`#${e}-chart-${this.graphId}`),h=this.createTextFilterWidget(`#${e}-search-${this.graphId}`);r.select(`#${e}-chart-${this.graphId} a.reset`).on("click",(function(){c.filterAll(),h.filterAll(),o.redrawAll()}));const f=t.dimension((t=>t[e]));h.dimension(t.dimension((t=>t[e].toLowerCase())));const m=f.group().reduceSum((t=>n?t[n]:1)),v=r.select(`#${e}-chart-${this.graphId}`).node().getBoundingClientRect().width;c.width(v).height(252).margins({top:20,left:10,right:10,bottom:20}).group((0,d.removeEmptyBins)(m)).dimension(f).ordinalColors([this.colorPalette[l]]).label((t=>t.key)).data((t=>t.top(10))).title((t=>t.value)).elasticX(!0).xAxis().ticks(4)},createPieChart(t,e,n){const l=new o.PieChart(`#${e}-chart-${this.graphId}`);r.select(`#${e}-chart-${this.graphId} a.reset`).on("click",(function(){l.filterAll(),o.redrawAll()}));const d=t.dimension((t=>t[e])),c=d.group().reduceSum((t=>n?t[n]:1)),h=r.select(`#${e}-chart-${this.graphId}`).node().getBoundingClientRect().width;l.width(h).height(220).radius(h/2.5).innerRadius(h/8).dimension(d).group(c).valueAccessor((t=>t.value)).title((t=>t.value+" records")).ordinalColors(this.colorPalette),l.on("pretransition",(function(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=r.select(this);let text=e.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+o.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))}))},drawViz(){this.results=this.values.map((t=>({app:this.decodeDefault(t.bundleId),domain:this.decodeDefault(t.domain),domainType:"2"===t.domainType||"false"===t.domainType?"No":"Yes",domainOwner:this.decodeDefault(t.domainOwner),context:this.decodeDefault(t.context),initiatedType:"NonAppInitiated"===t.initiatedType||"false"===t.initiatedType?"No":"Yes",hits:+t.hits})));const t=(0,main.Z)(this.results);this.createTopRowChart(t,"app","hits",0),this.createTopRowChart(t,"domain","hits",1),this.createTopRowChart(t,"context","hits",2),this.createTopRowChart(t,"domainOwner","hits",3),this.createPieChart(t,"domainType","hits"),this.createPieChart(t,"initiatedType","hits");const e=t.groupAll(),n=t.dimension((t=>t));new o.DataCount(`#dc-data-count-${this.graphId}`).crossfilter(t).groupAll(e).html({some:"<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records | <a class='resetAll'>Reset All</a>",all:"All <strong>%total-count</strong> records selected. Please click on the graph to apply filters."}).on("pretransition",((t,filter)=>{this.results=n.top(e.value()),r.select(`#dc-data-count-${this.graphId} a.resetAll`).on("click",(()=>{o.filterAll(),o.renderAll()}))})),o.renderAll()}}},v=(0,n(1001).Z)(m,(function(){var t=this,e=t._self._c;return e("VContainer",[e("ChartViewVRowWebShare",[e("VCol",{attrs:{cols:"12"}},[e("VRow",[e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:`app-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("VTooltip",{attrs:{left:"","max-width":"200"},scopedSlots:t._u([{key:"activator",fn:function({on:n,attrs:r}){return[e("strong",t._g(t._b({},"strong",r,!1),n),[t._v("Application ID")])]}}])},[e("span",[t._v("The bundle identifier of the initiating app.")])]),e("VSpacer"),e("div",{attrs:{id:`app-search-${t.graphId}`}})],1),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:`domain-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("VTooltip",{attrs:{left:"","max-width":"200"},scopedSlots:t._u([{key:"activator",fn:function({on:n,attrs:r}){return[e("strong",t._g(t._b({},"strong",r,!1),n),[t._v("Domain")])]}}])},[e("span",[t._v("The domain of the network connection.")])]),e("VSpacer"),e("div",{attrs:{id:`domain-search-${t.graphId}`}})],1),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:`domainType-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("VTooltip",{attrs:{left:"","max-width":"200"},scopedSlots:t._u([{key:"activator",fn:function({on:n,attrs:r}){return[e("strong",t._g(t._b({},"strong",r,!1),n),[t._v("Profiling user")])]}}])},[e("span",[t._v("Whether the domain has been identified as potentially collecting information across apps and sites, and potentially profiling users.")])])],1),e("ChartViewFilters")],1)])],1),e("VRow",[e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:`context-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("VTooltip",{attrs:{left:"","max-width":"200"},scopedSlots:t._u([{key:"activator",fn:function({on:n,attrs:r}){return[e("strong",t._g(t._b({},"strong",r,!1),n),[t._v("Context")])]}}])},[e("span",[t._v("The website that made the connection, if applicable.")])]),e("VSpacer"),e("div",{attrs:{id:`context-search-${t.graphId}`}})],1),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:`domainOwner-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("VTooltip",{attrs:{left:"","max-width":"200"},scopedSlots:t._u([{key:"activator",fn:function({on:n,attrs:r}){return[e("strong",t._g(t._b({},"strong",r,!1),n),[t._v("Domain owner")])]}}])},[e("span",[t._v("The owner of the domain, if applicable.")])]),e("VSpacer"),e("div",{attrs:{id:`domainOwner-search-${t.graphId}`}})],1),e("ChartViewFilters")],1)]),e("VCol",{attrs:{cols:"12",md:"4"}},[e("div",{attrs:{id:`initiatedType-chart-${t.graphId}`}},[e("div",{staticStyle:{display:"flex"}},[e("VTooltip",{attrs:{left:"","max-width":"200"},scopedSlots:t._u([{key:"activator",fn:function({on:n,attrs:r}){return[e("strong",t._g(t._b({},"strong",r,!1),n),[t._v("Initiated by the app")])]}}])},[e("span",[t._v("Whether the app or the user initiated the connection.")])])],1),e("ChartViewFilters")],1)])],1)],1)],1),e("VRow",[e("div",{staticClass:"dc-data-count",attrs:{id:`dc-data-count-${t.graphId}`}})]),e("VRow",[e("VCol",{attrs:{cols:"12"}},[e("UnitFilterableTable",t._b({},"UnitFilterableTable",{headers:t.header,items:t.results},!1))],1)],1)],1)}),[],!1,null,null,null).exports},65701:function(t,e,n){n.r(e),n.d(e,{default:function(){return h}});var r=n(14226),o=n(72514),l=n(97888),d=n(39474),c={components:{BaseButton:o.Z,BaseButtonDownloadData:l.Z,BaseButtonShare:d.Z},mixins:[(0,r.Z)()]},h=(0,n(1001).Z)(c,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude webshare d-flex",attrs:{cols:"12"}},[e("div",{staticClass:"webshare__export-button"},[e("BaseButton",t._b({attrs:{"mdi-icon":"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1))],1),e("div",{staticClass:"webshare__download-button"},[e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1))],1),e("div",{staticClass:"webshare__share-button"},[e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)])],2)}),[],!1,null,null,null).exports},96622:function(t,e,n){n.r(e),n.d(e,{default:function(){return o}});var r={},o=(0,n(1001).Z)(r,(function(){var t=this,e=t._self._c;return e("p",{staticClass:"filters"},[e("span",[t._v(" "+t._s(t.$t("Current filter"))+" "),e("span",{staticClass:"filter"})]),e("a",{directives:[{name:"t",rawName:"v-t",value:"reset",expression:"'reset'"}],staticClass:"reset",staticStyle:{display:"none"}})])}),[],!1,null,null,null).exports},85225:function(t,e,n){n.r(e),n.d(e,{addPiePercentage:function(){return f},addXLabel:function(){return l},addYLabel:function(){return d},createCumulativeGroup:function(){return c},removeEmptyBins:function(){return h}});var r=n(60194),o=n(40290);function l(t,e){const n=t.svg().append("text").attr("class","x-axis-label").attr("text-anchor","middle").attr("x",t.width()/2).attr("y",t.height()-10).text(e),r=n.node().getBBox(),o=t.margins();n.attr("x",o.left+(t.width()-o.left-o.right)/2).attr("y",t.height()-Math.ceil(r.height)/2)}function d(t,e){const n=t.svg().append("text").attr("class","y-axis-label").attr("text-anchor","middle").attr("transform","rotate(-90)").attr("x",-t.height()/2).attr("y",10).text(e),r=n.node().getBBox(),o=t.margins();n.attr("x",-o.top-(t.height()-o.top-o.bottom)/2).attr("y",Math.max(Math.ceil(r.height),o.left-Math.ceil(r.height)-5))}function c(t){return{all(){const e={};return t.all().map((function(t){return e[t.key[0]]?e[t.key[0]]+=t.value:e[t.key[0]]=t.value,{key:t.key,value:e[t.key[0]]}}))}}}function h(t){return{top:e=>t.top(1/0).filter((function(t){return 0!==t.value.count&&0!==t.value})).slice(0,e)}}function f(t){t.selectAll("text.pie-slice.pie-label").call((function(t){t.each((function(t){const e=r.select(this);let text=e.text();text.length>14&&(text=text.substring(0,14)+".. "),text.length>0&&(text=text+" ("+o.utils.printSingleValue((t.endAngle-t.startAngle)/(2*Math.PI)*100)+"%)"),e.text(text)}))}))}}}]);
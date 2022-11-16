"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[3669,1297],{83669:function(e,t,r){r.r(t),r.d(t,{default:function(){return c}});var l=r(60194),n={mixins:[r(21297).default],props:{dateAccessor:{type:String,required:!0},title:{type:String,default:()=>""},cellSize:{type:Number,default:()=>20},cellSpacing:{type:Number,default:()=>2},dateFormat:{type:String,default:()=>""},valueAccessor:{type:String,default:()=>""},borderRadius:{type:Number,default:()=>3},legendPrefNbItems:{type:Number,default:()=>4},legendLabel:{type:String,default:()=>""},includeTotal:{type:Boolean,default:()=>!1}},data:()=>({formatMonth:l.utcFormat("%b"),colorPalette:l.interpolateRdPu}),computed:{width(){return 55*this.cellSize},calendarHeight(){return this.cellSize*(this.$days().length+4)},height(){return this.calendarHeight*this.itemsPerDay.length},viewBox(){return`0 0 ${this.width} ${this.height}`},dateParser(){return this.dateFormat?l.timeParse(this.dateFormat):e=>{const t=new Date(e);return isNaN(t.getTime())?null:t}},items(){return this.values.map((e=>({date:this.dateParser(e[this.dateAccessor]),value:this.valueAccessor?e[this.valueAccessor]:1}))).filter((e=>e.date))},extent(){return l.extent(this.itemsPerDay.flatMap((e=>l.extent(e[1],(i=>i[3])))))},color(){return l.scaleSequential().domain([this.extent[0],this.extent[1]]).nice().interpolator(this.colorPalette)},itemsPerDay(){return l.groups(this.items,(e=>e.date.getUTCFullYear())).sort(((a,b)=>b[0]-a[0])).map((e=>[e[0],l.flatRollup(e[1],(e=>l.sum(e,(e=>e.value))),(e=>e.date.getUTCMonth()),(e=>e.date.getUTCDate()),(e=>e.date.getDay()))]))},monthsPerYear(){return this.itemsPerDay.map((e=>{const t=l.extent(e[1],(i=>new Date(e[0],i[0],i[1])));return{year:e[0],months:l.utcMonths(l.utcMonth(t[0]),t[1])}}))},legendSquares(){return this.color.ticks(this.legendPrefNbItems)},legendNbItems(){return this.legendSquares.length}},methods:{generateTitle:(e,t,r,n)=>l.timeFormat("%a %d %B, %Y")(new Date(e,t,r))+" - "+n+" records",xPos(e,t,r){const n=new Date(e,t,r);return l.utcMonday.count(l.utcYear(n),n)*this.cellSize+.5},xPosMonth(e){return l.utcMonday.count(l.utcYear(e),l.utcMonday.ceil(e))*this.cellSize},legendSquareXPos(e){const{width:t,cellSize:s,legendNbItems:r}=this;return t-2*s*r+e*s*2-2*s}}},c=(0,r(1001).Z)(n,(function(){var e=this,t=e._self._c;return t("VContainer",[t("div",{staticClass:"d-flex"},[t("div",{staticClass:"overline mb-3"},[e._v(" "+e._s(e.title)+" ")]),t("VSpacer"),e.includeTotal?t("div",{staticClass:"overline mb-3"},[e._v(" total: "),t("strong",[e._v(e._s(e.items.length))])]):e._e()],1),t("svg",{staticClass:"graph",attrs:{viewBox:e.viewBox}},[t("g",{attrs:{transform:`translate(40.5,${1.5*e.cellSize})`}},[e._l(e.itemsPerDay,(function(r,l){return t("g",{key:"week-axis"+l,staticClass:"week-axis"},e._l(e.$days(),(function(r,n){return t("text",{key:`d_${n}`,attrs:{x:"-5",y:l*e.calendarHeight+(n+.5)*e.cellSize,dy:"0.35em"}},[e._v(" "+e._s(r)+" ")])})),0)})),e._l(e.monthsPerYear,(function(r,l){return t("g",{key:"month-axis"+l,staticClass:"month-axis"},e._l(r.months,(function(r,n){return t("text",{key:`month_${n}`,attrs:{x:e.xPosMonth(r),y:l*e.calendarHeight-5,dy:"0.35em"}},[e._v(" "+e._s(e.formatMonth(r))+" ")])})),0)})),t("g",{staticClass:"calendars"},e._l(e.itemsPerDay,(function(r,l){return t("g",{key:"year_"+l},[t("text",{staticStyle:{"font-weight":"bold","font-size":"12px"},attrs:{x:.5,y:l*e.calendarHeight-e.cellSize}},[e._v(" "+e._s(r[0])+" ")]),e._l(r[1],(function(n,c){return t("g",{key:"day_"+c},[t("rect",{attrs:{width:e.cellSize-e.cellSpacing,height:e.cellSize-e.cellSpacing,x:e.xPos(r[0],n[0],n[1]),y:l*e.calendarHeight+n[2]*e.cellSize+.5,fill:e.color(n[3]),rx:e.borderRadius,ry:e.borderRadius}}),t("title",[e._v(" "+e._s(e.generateTitle(r[0],n[0],n[1],n[3]))+" ")])])}))],2)})),0),t("g",{staticClass:"legend"},[t("text",{staticStyle:{"text-anchor":"end"},attrs:{x:e.legendSquareXPos(0)-e.cellSize,y:e.height-2.5*e.cellSize,dy:"-.20em"}},[e._v(" "+e._s(e.legendLabel)+" ")]),e._l(e.legendSquares,(function(r,l){return t("g",{key:"legend_"+l},[t("rect",{attrs:{width:2*(e.cellSize-e.cellSpacing),height:(e.cellSize-e.cellSpacing)/2,x:e.legendSquareXPos(l),y:e.height-3*e.cellSize,fill:e.color(r),rx:e.borderRadius,ry:e.borderRadius}}),t("text",{staticStyle:{"text-anchor":"middle"},attrs:{x:e.legendSquareXPos(l)+e.cellSize,y:e.height-2*e.cellSize}},[e._v(" "+e._s(r)+" ")])])}))],2)],2)])])}),[],!1,null,"5d9bc966",null).exports},21297:function(e,t,r){r.r(t);var l=r(40290),n=r(18651),c=r(659);const d={props:{values:{type:Array,default:()=>[]},headers:{type:Array,default:()=>[]},messages:{type:Object,default:()=>({})}},data(){return{graphId:"graph_"+this._uid,totalCount:0,filterCount:0}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{drawViz(){},createTextFilterWidget(e,t="Search"){const r=new l.TextFilterWidget(e);return r.placeHolder(this.$tev(t,t)),r}}};t.default=(0,n.Z)(d,c.Z)}}]);
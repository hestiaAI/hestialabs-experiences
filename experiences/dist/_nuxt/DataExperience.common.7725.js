"use strict";(("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience=("undefined"!=typeof self?self:this).webpackChunk_hestia_ai_data_experience||[]).push([[7725,5701],{7725:function(t,e,n){n.r(e),n.d(e,{default:function(){return H}});var o=n(60194),r=n(60171);function c(t,e){let n=0;if(void 0===e)for(let e of t)(e=+e)&&(n+=e);else{let o=-1;for(let r of t)(r=+e(r,++o,t))&&(n+=r)}return n}function l(t,e){let n;if(void 0===e)for(const e of t)null!=e&&(n<e||void 0===n&&e>=e)&&(n=e);else{let o=-1;for(let r of t)null!=(r=e(r,++o,t))&&(n<r||void 0===n&&r>=r)&&(n=r)}return n}function f(t,e){return t.sourceLinks.length?t.depth:e-1}function h(t){return function(){return t}}function d(a,b){return v(a.source,b.source)||a.index-b.index}function y(a,b){return v(a.target,b.target)||a.index-b.index}function v(a,b){return a.y0-b.y0}function x(t){return t.value}function k(t){return t.index}function _(t){return t.nodes}function m(t){return t.links}function w(t,e){const n=t.get(e);if(!n)throw new Error("missing: "+e);return n}function L({nodes:t}){for(const e of t){let t=e.y0,n=t;for(const link of e.sourceLinks)link.y0=t+link.width/2,t+=link.width;for(const link of e.targetLinks)link.y1=n+link.width/2,n+=link.width}}function M(){let t,e,n,o=0,r=0,M=1,B=1,C=24,V=8,S=k,N=f,T=_,A=m,I=6;function z(){const f={nodes:T.apply(null,arguments),links:A.apply(null,arguments)};return function({nodes:t,links:e}){for(const[i,e]of t.entries())e.index=i,e.sourceLinks=[],e.targetLinks=[];const o=new Map(t.map(((e,i)=>[S(e,i,t),e])));for(const[i,link]of e.entries()){link.index=i;let{source:source,target:t}=link;"object"!=typeof source&&(source=link.source=w(o,source)),"object"!=typeof t&&(t=link.target=w(o,t)),source.sourceLinks.push(link),t.targetLinks.push(link)}if(null!=n)for(const{sourceLinks:e,targetLinks:o}of t)e.sort(n),o.sort(n)}(f),function({nodes:t}){for(const e of t)e.value=void 0===e.fixedValue?Math.max(c(e.sourceLinks,x),c(e.targetLinks,x)):e.fixedValue}(f),function({nodes:t}){const e=t.length;let n=new Set(t),o=new Set,r=0;for(;n.size;){for(const t of n){t.depth=r;for(const{target:e}of t.sourceLinks)o.add(e)}if(++r>e)throw new Error("circular link");n=o,o=new Set}}(f),function({nodes:t}){const e=t.length;let n=new Set(t),o=new Set,r=0;for(;n.size;){for(const t of n){t.height=r;for(const{source:source}of t.targetLinks)o.add(source)}if(++r>e)throw new Error("circular link");n=o,o=new Set}}(f),function(n){const f=function({nodes:t}){const n=l(t,(t=>t.depth))+1,r=(M-o-C)/(n-1),c=new Array(n);for(const e of t){const i=Math.max(0,Math.min(n-1,Math.floor(N.call(null,e,n))));e.layer=i,e.x0=o+i*r,e.x1=e.x0+C,c[i]?c[i].push(e):c[i]=[e]}if(e)for(const t of c)t.sort(e);return c}(n);t=Math.min(V,(B-r)/(l(f,(t=>t.length))-1)),function(e){const n=function(t,e){let n;if(void 0===e)for(const e of t)null!=e&&(n>e||void 0===n&&e>=e)&&(n=e);else{let o=-1;for(let r of t)null!=(r=e(r,++o,t))&&(n>r||void 0===n&&r>=r)&&(n=r)}return n}(e,(e=>(B-r-(e.length-1)*t)/c(e,x)));for(const o of e){let e=r;for(const r of o){r.y0=e,r.y1=e+r.value*n,e=r.y1+t;for(const link of r.sourceLinks)link.width=link.value*n}e=(B-e+t)/(o.length+1);for(let i=0;i<o.length;++i){const t=o[i];t.y0+=e*(i+1),t.y1+=e*(i+1)}D(o)}}(f);for(let i=0;i<I;++i){const t=Math.pow(.99,i),e=Math.max(1-t,(i+1)/I);P(f,t,e),E(f,t,e)}}(f),L(f),f}function E(t,n,o){for(let i=1,r=t.length;i<r;++i){const r=t[i];for(const t of r){let e=0,o=0;for(const{source:source,value:n}of t.targetLinks){let r=n*(t.layer-source.layer);e+=O(source,t)*r,o+=r}if(!(o>0))continue;let r=(e/o-t.y0)*n;t.y0+=r,t.y1+=r,W(t)}void 0===e&&r.sort(v),$(r,o)}}function P(t,n,o){for(let i=t.length-2;i>=0;--i){const r=t[i];for(const source of r){let t=0,e=0;for(const{target:n,value:o}of source.sourceLinks){let r=o*(n.layer-source.layer);t+=j(source,n)*r,e+=r}if(!(e>0))continue;let o=(t/e-source.y0)*n;source.y0+=o,source.y1+=o,W(source)}void 0===e&&r.sort(v),$(r,o)}}function $(e,n){const i=e.length>>1,o=e[i];R(e,o.y0-t,i-1,n),Z(e,o.y1+t,i+1,n),R(e,B,e.length-1,n),Z(e,r,0,n)}function Z(e,n,i,o){for(;i<e.length;++i){const r=e[i],c=(n-r.y0)*o;c>1e-6&&(r.y0+=c,r.y1+=c),n=r.y1+t}}function R(e,n,i,o){for(;i>=0;--i){const r=e[i],c=(r.y1-n)*o;c>1e-6&&(r.y0-=c,r.y1-=c),n=r.y0-t}}function W({sourceLinks:t,targetLinks:e}){if(void 0===n){for(const{source:{sourceLinks:t}}of e)t.sort(y);for(const{target:{targetLinks:e}}of t)e.sort(d)}}function D(t){if(void 0===n)for(const{sourceLinks:e,targetLinks:n}of t)e.sort(y),n.sort(d)}function O(source,e){let n=source.y0-(source.sourceLinks.length-1)*t/2;for(const{target:o,width:r}of source.sourceLinks){if(o===e)break;n+=r+t}for(const{source:t,width:o}of e.targetLinks){if(t===source)break;n-=o}return n}function j(source,e){let n=e.y0-(e.targetLinks.length-1)*t/2;for(const{source:o,width:r}of e.targetLinks){if(o===source)break;n+=r+t}for(const{target:t,width:o}of source.sourceLinks){if(t===e)break;n-=o}return n}return z.update=function(t){return L(t),t},z.nodeId=function(t){return arguments.length?(S="function"==typeof t?t:h(t),z):S},z.nodeAlign=function(t){return arguments.length?(N="function"==typeof t?t:h(t),z):N},z.nodeSort=function(t){return arguments.length?(e=t,z):e},z.nodeWidth=function(t){return arguments.length?(C=+t,z):C},z.nodePadding=function(e){return arguments.length?(V=t=+e,z):V},z.nodes=function(t){return arguments.length?(T="function"==typeof t?t:h(t),z):T},z.links=function(t){return arguments.length?(A="function"==typeof t?t:h(t),z):A},z.linkSort=function(t){return arguments.length?(n=t,z):n},z.size=function(t){return arguments.length?(o=r=0,M=+t[0],B=+t[1],z):[M-o,B-r]},z.extent=function(t){return arguments.length?(o=+t[0][0],M=+t[1][0],r=+t[0][1],B=+t[1][1],z):[[o,r],[M,B]]},z.iterations=function(t){return arguments.length?(I=+t,z):I},z}var B=Math.PI,C=2*B,V=1e-6,S=C-V;function N(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function path(){return new N}N.prototype=path.prototype={constructor:N,moveTo:function(t,e){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+e)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,e){this._+="L"+(this._x1=+t)+","+(this._y1=+e)},quadraticCurveTo:function(t,e,n,o){this._+="Q"+ +t+","+ +e+","+(this._x1=+n)+","+(this._y1=+o)},bezierCurveTo:function(t,e,n,o,r,c){this._+="C"+ +t+","+ +e+","+ +n+","+ +o+","+(this._x1=+r)+","+(this._y1=+c)},arcTo:function(t,e,n,o,r){t=+t,e=+e,n=+n,o=+o,r=+r;var c=this._x1,l=this._y1,f=n-t,h=o-e,d=c-t,y=l-e,v=d*d+y*y;if(r<0)throw new Error("negative radius: "+r);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=e);else if(v>V)if(Math.abs(y*f-h*d)>V&&r){var x=n-c,k=o-l,_=f*f+h*h,m=x*x+k*k,w=Math.sqrt(_),L=Math.sqrt(v),M=r*Math.tan((B-Math.acos((_+v-m)/(2*w*L)))/2),C=M/L,S=M/w;Math.abs(C-1)>V&&(this._+="L"+(t+C*d)+","+(e+C*y)),this._+="A"+r+","+r+",0,0,"+ +(y*x>d*k)+","+(this._x1=t+S*f)+","+(this._y1=e+S*h)}else this._+="L"+(this._x1=t)+","+(this._y1=e);else;},arc:function(t,e,n,o,r,c){t=+t,e=+e,c=!!c;var l=(n=+n)*Math.cos(o),f=n*Math.sin(o),h=t+l,d=e+f,y=1^c,v=c?o-r:r-o;if(n<0)throw new Error("negative radius: "+n);null===this._x1?this._+="M"+h+","+d:(Math.abs(this._x1-h)>V||Math.abs(this._y1-d)>V)&&(this._+="L"+h+","+d),n&&(v<0&&(v=v%C+C),v>S?this._+="A"+n+","+n+",0,1,"+y+","+(t-l)+","+(e-f)+"A"+n+","+n+",0,1,"+y+","+(this._x1=h)+","+(this._y1=d):v>V&&(this._+="A"+n+","+n+",0,"+ +(v>=B)+","+y+","+(this._x1=t+n*Math.cos(r))+","+(this._y1=e+n*Math.sin(r))))},rect:function(t,e,n,o){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+e)+"h"+ +n+"v"+ +o+"h"+-n+"Z"},toString:function(){return this._}};var T=path,A=Array.prototype.slice;function I(t){return function(){return t}}function z(p){return p[0]}function E(p){return p[1]}function P(t){return t.source}function $(t){return t.target}function Z(t){var source=P,e=$,n=z,o=E,r=null;function link(){var c,l=A.call(arguments),s=source.apply(this,l),f=e.apply(this,l);if(r||(r=c=T()),t(r,+n.apply(this,(l[0]=s,l)),+o.apply(this,l),+n.apply(this,(l[0]=f,l)),+o.apply(this,l)),c)return r=null,c+""||null}return link.source=function(t){return arguments.length?(source=t,link):source},link.target=function(t){return arguments.length?(e=t,link):e},link.x=function(t){return arguments.length?(n="function"==typeof t?t:I(+t),link):n},link.y=function(t){return arguments.length?(o="function"==typeof t?t:I(+t),link):o},link.context=function(t){return arguments.length?(r=null==t?null:t,link):r},link}function R(t,e,n,o,r){t.moveTo(e,n),t.bezierCurveTo(e=(e+o)/2,n,e,r,o,r)}function W(t){return[t.source.x1,t.y0]}function D(t){return[t.target.x0,t.y1]}function O(){return Z(R).source(W).target(D)}var j=n(74097),G={name:"ChartViewSankey",components:{ChartViewVRowWebShare:n(65701).default},mixins:[j.default],props:{topN:{type:Number,default:10},displayLinksLabels:{type:Boolean,default:!0},nodeWidth:{type:Number,default:40},nodePadding:{type:Number,default:40}},data:()=>({total:0}),methods:{k:t=>`chart-view.sankey.${t}`,toJSONGraph(data){const t=o.flatRollup(data,(t=>t.length),(t=>t.source),(t=>t.target)).map((t=>({source:t[0],target:t[1],value:t[2]}))).filter((t=>""!==t.source&&""!==t.target&&t.value&&t.source!==t.target)).sort(((a,b)=>o.descending(+a.value,+b.value))).slice(0,this.topN),e={nodes:[],links:[]};return t.forEach((function(t){t.sourceName=t.source,t.targetName=t.target,t.source=t.source+"s",t.target=t.target+"t",e.nodes.push({id:t.source}),e.nodes.push({id:t.target}),e.links.push({source:t.source,target:t.target,sourceName:t.sourceName,targetName:t.targetName,value:t.value})})),e.nodes=(0,r.XP)((0,r.b1)().key((t=>t.id)).object(e.nodes)),e.links.forEach((function(t,i){e.links[i].source=e.nodes.indexOf(e.links[i].source),e.links[i].target=e.nodes.indexOf(e.links[i].target)})),e.nodes.forEach((function(t,i){e.nodes[i]={name:t}})),e},drawViz(){this.total=this.values.length;const t=this.toJSONGraph(this.values),e=50,n=250,r=10,c=250,l=o.select("#"+this.graphId).node().getBoundingClientRect().width-c-n,f=50*this.topN-e-r,h=o.scaleOrdinal().domain(t.nodes.map((t=>t.name.slice(0,-1)))).range(this.colorPalette),d=o.select("#"+this.graphId).append("div").style("opacity",1).html(`(${this.$t(this.k("hoverMessage"))})`).style("left",l/2+c+"px").style("top","0px"),svg=o.select("#"+this.graphId).append("svg").attr("width",l+c+n).attr("height",f+e+r).append("g").attr("transform","translate("+c+","+e+")"),y=o.select("#"+this.graphId).append("div").style("opacity",0).attr("class","tooltip");svg.append("text").attr("class","label").attr("x",0).attr("y",-e/2).text(this.$t(this.kViewBlock("sourceText"))),svg.append("text").attr("class","label").attr("x",l).attr("y",-e/2).attr("text-anchor","end").text(this.$t(this.kViewBlock("targetText")));const v=M().nodeWidth(this.nodeWidth).nodePadding(this.nodePadding).size([l,f]);v.links();const x=v(t),k=svg.append("g").selectAll("#"+this.graphId+".link").data(x.links).enter().append("path").attr("class","link");k.attr("d",O()).attr("stroke-width",(t=>t.width)).attr("opacity",.2).on("mouseover",((t,e)=>{const n=this.$t(this.kViewBlock("linkMouseoverHTML"),e);d.html(n).style("opacity",1),k.filter((t=>t===e)).attr("opacity",.5)})).on("mouseleave",(t=>{k.attr("opacity",.2),d.style("opacity",0)}));const _=svg.append("g").selectAll("#"+this.graphId+".node").data(x.nodes).enter().append("g").attr("class","node");_.append("rect").attr("x",(t=>t.x0)).attr("y",(t=>t.y0)).attr("height",(t=>t.y1-t.y0)).attr("width",v.nodeWidth()).style("fill",(t=>t.color=h(t.name.slice(0,-1)))).style("stroke",(function(t){return o.rgb(t.color).darker(1)})),_.on("mouseover",((t,e)=>{const n=this.$t(this.kViewBlock("nodeMouseoverHTML"),{name:e.name.slice(0,-1),value:e.value,fromTo:this.$t(this.kViewBlock("s"===e.name.slice(-1)?"from":"to"))}),o=d.node().getBoundingClientRect().height;y.html(n).style("left",e.x1+c+8+"px").style("top",e.y0+o+35+"px"),y.style("opacity",1),_.filter((t=>t===e)).attr("opacity",.7),k.attr("opacity",.2),k.filter((link=>e.index===link.source.index||e.index===link.target.index)).attr("opacity",.5)})).on("mouseleave",((t,e)=>{k.attr("opacity",.2),_.attr("opacity",1),y.style("opacity",0)})),this.displayLinksLabels&&_.append("text").attr("x",(t=>t.x1+6)).attr("y",(t=>(t.y1+t.y0)/2)).attr("dy","0.35em").attr("text-anchor","start").text((t=>{let e=t.name.split(",")[0];return e.length>20&&(e=e.slice(0,20)+".."),e})).filter((t=>t.x0<l/2)).attr("x",(t=>t.x0-6)).attr("text-anchor","end")}}},H=(0,n(1001).Z)(G,(function(){var t=this,e=t._self._c;return e("VContainer",[e("ChartViewVRowWebShare",[e("VCol",{staticClass:"text-center",attrs:{cols:"12",md:"12"}},[e("i18n",{attrs:{path:t.kViewBlock("labelTotal"),tag:"p"},scopedSlots:t._u([{key:"total",fn:function(){return[e("span",{staticClass:"font-weight-bold",domProps:{textContent:t._s(t.total)}})]},proxy:!0}])}),e("div",{staticStyle:{position:"relative"},attrs:{id:t.graphId}})],1)],1)],1)}),[],!1,null,"418b736e",null).exports},65701:function(t,e,n){n.r(e),n.d(e,{default:function(){return h}});var o=n(14226),r=n(25593),c=n(97888),l=n(39474),f={components:{BaseButton:r.Z,BaseButtonDownloadData:c.Z,BaseButtonShare:l.Z},mixins:[(0,o.Z)()]},h=(0,n(1001).Z)(f,(function(){var t=this,e=t._self._c;return e("VRow",t._b({ref:"domToImageNode"},"VRow",t.$attrs,!1),[t._t("default"),e("VCol",{staticClass:"dom-to-image-exclude webshare d-flex",attrs:{cols:"12"}},[e("div",{staticClass:"webshare__export-button"},[e("BaseButton",t._b({attrs:{"mdi-icon":"mdiExport",text:"Export"},on:{click:t.exportImage}},"BaseButton",{progress:t.progress,status:t.status,error:t.error},!1))],1),e("div",{staticClass:"webshare__download-button"},[e("BaseButtonDownloadData",t._b({},"BaseButtonDownloadData",{disabled:!t.blob,extension:t.extension,filename:t.filename,data:t.blob},!1))],1),e("div",{staticClass:"webshare__share-button"},[e("BaseButtonShare",t._b({attrs:{"file-share":""}},"BaseButtonShare",{files:t.files,disabled:!t.files},!1))],1)])],2)}),[],!1,null,null,null).exports},60171:function(t,e,n){n.d(e,{XP:function(){return _},b1:function(){return l}});var o="$";function r(){}function map(object,t){var map=new r;if(object instanceof r)object.each((function(t,e){map.set(e,t)}));else if(Array.isArray(object)){var e,i=-1,n=object.length;if(null==t)for(;++i<n;)map.set(i,object[i]);else for(;++i<n;)map.set(t(e=object[i],i,object),e)}else if(object)for(var o in object)map.set(o,object[o]);return map}r.prototype=map.prototype={constructor:r,has:function(t){return o+t in this},get:function(t){return this[o+t]},set:function(t,e){return this[o+t]=e,this},remove:function(t){var e=o+t;return e in this&&delete this[e]},clear:function(){for(var t in this)t[0]===o&&delete this[t]},keys:function(){var t=[];for(var e in this)e[0]===o&&t.push(e.slice(1));return t},values:function(){var t=[];for(var e in this)e[0]===o&&t.push(this[e]);return t},entries:function(){var t=[];for(var e in this)e[0]===o&&t.push({key:e.slice(1),value:this[e]});return t},size:function(){var t=0;for(var e in this)e[0]===o&&++t;return t},empty:function(){for(var t in this)if(t[0]===o)return!1;return!0},each:function(t){for(var e in this)e[0]===o&&t(this[e],e.slice(1),this)}};var c=map;function l(){var t,e,n,o=[],r=[];function l(n,r,f,h){if(r>=o.length)return null!=t&&n.sort(t),null!=e?e(n):n;for(var d,y,v,i=-1,x=n.length,k=o[r++],_=c(),m=f();++i<x;)(v=_.get(d=k(y=n[i])+""))?v.push(y):_.set(d,[y]);return _.each((function(t,e){h(m,e,l(t,r,f,h))})),m}function v(map,t){if(++t>o.length)return map;var n,c=r[t-1];return null!=e&&t>=o.length?n=map.entries():(n=[],map.each((function(e,o){n.push({key:o,values:v(e,t)})}))),null!=c?n.sort((function(a,b){return c(a.key,b.key)})):n}return n={object:function(t){return l(t,0,f,h)},map:function(t){return l(t,0,d,y)},entries:function(t){return v(l(t,0,d,y),0)},key:function(t){return o.push(t),n},sortKeys:function(t){return r[o.length-1]=t,n},sortValues:function(e){return t=e,n},rollup:function(t){return e=t,n}}}function f(){return{}}function h(object,t,e){object[t]=e}function d(){return c()}function y(map,t,e){map.set(t,e)}function v(){}var x=c.prototype;function k(object,t){var e=new v;if(object instanceof v)object.each((function(t){e.add(t)}));else if(object){var i=-1,n=object.length;if(null==t)for(;++i<n;)e.add(object[i]);else for(;++i<n;)e.add(t(object[i],i,object))}return e}v.prototype=k.prototype={constructor:v,has:x.has,add:function(t){return this[o+(t+="")]=t,this},remove:x.remove,clear:x.clear,values:x.keys,size:x.size,empty:x.empty,each:x.each};function _(map){var t=[];for(var e in map)t.push(e);return t}}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[10,71],{1055:function(t,n,e){"use strict";var r=e(929);var o=function(t){return(null==t?0:t.length)?Object(r.a)(t,1):[]},c=e(323),f=e(322);n.a=function(t){return Object(f.a)(Object(c.a)(t,void 0,o),t+"")}},1332:function(t,n,e){"use strict";e.r(n);e(28),e(15),e(3),e(41),e(45),e(75);var r=e(717);function o(t){return function(){return t}}var c=function(t,n,e,r){var c,f,l,d,h,y,v,w,j,x,m=o(.1),k=!0,O=o(Math.min((e-t)/2,(r-n)/2));function A(t,n,e,r,o){return(t-n)*Math.min(2,Math.abs(t-n)/t)*e*o}function F(t){for(var n,i=0,e=c.length;i<e;++i)(n=c[i]).x<d[i]+w[i]||n.x>h[i]-w[i]||n.y<y[i]+w[i]||n.y>v[i]-w[i]?(n.vx+=A(j[i],n.x,f[i],w[i],t),n.vy+=A(x[i],n.y,l[i],w[i],t)):n.y<y[i]+w[i]||(n.y,v[i],w[i]),k&&(n.x>=h[i]&&(n.vx+=h[i]-n.x),n.x<=d[i]&&(n.vx+=d[i]-n.x),n.y>=v[i]&&(n.vy+=v[i]-n.y),n.y<=y[i]&&(n.vy+=y[i]-n.y))}function z(){if(c){var i,o=c.length;for(f=new Array(o),l=new Array(o),d=new Array(o),y=new Array(o),h=new Array(o),v=new Array(o),x=new Array(o),j=new Array(o),w=new Array(o),i=0;i<o;++i)f[i]=isNaN(d[i]=+t(c[i],i,c))||isNaN(h[i]=+e(c[i],i,c))?0:+m(c[i],i,c),l[i]=isNaN(y[i]=+n(c[i],i,c))||isNaN(v[i]=+r(c[i],i,c))?0:+m(c[i],i,c),j[i]=d[i]+(h[i]-d[i])/2,x[i]=y[i]+(v[i]-y[i])/2,w[i]=+O(c[i],i,c)}}return"function"!=typeof t&&(t=o(null==t?-100:+t)),"function"!=typeof e&&(e=o(null==e?100:+e)),"function"!=typeof n&&(n=o(null==n?-100:+n)),"function"!=typeof r&&(r=o(null==r?100:+r)),F.initialize=function(t){c=t,z()},F.x0=function(n){return arguments.length?(t="function"==typeof n?n:o(+n),z(),F):t},F.x1=function(t){return arguments.length?(e="function"==typeof t?t:o(+t),z(),F):e},F.y0=function(t){return arguments.length?(n="function"==typeof t?t:o(+t),z(),F):n},F.y1=function(t){return arguments.length?(r="function"==typeof t?t:o(+t),z(),F):r},F.strength=function(t){return arguments.length?(m="function"==typeof t?t:o(+t),z(),F):m},F.border=function(t){return arguments.length?(O="function"==typeof t?t:o(+t),z(),F):O},F.hardBoundary=function(t){return arguments.length?(k=t,F):k},F},f=e(1569),l={name:"NetworkXGraph",mixins:[e(714).default],props:{width:{type:Number,default:function(){return 900}},height:{type:Number,default:function(){return 400}},padding:{type:Number,default:function(){return 0}},margin:{type:Number,default:function(){return 0}}},computed:{jsonData:function(){var t=["FingerprintingGeneral","FingerprintingInvasive","Advertising"],n=this.values.filter((function(n){return t.includes(n.categ)&"Unknown"!==n.app}));n=n.map((function(t){return Object(f.a)(t,["app","tracker"])}));var e=["Chrome","Firefox","Samsung Internet"],r=(n=n.filter((function(t){return!e.includes(t.app)}))).map((function(t){return{source:t.app,target:t.tracker,weight:1}})),o=n.reduce((function(p,t){return Object.prototype.hasOwnProperty.call(p,t.app)||(p[t.app]=1),Object.prototype.hasOwnProperty.call(p,t.tracker)||(p[t.tracker]=1),p[t.tracker]++,p}),{}),c=[],l=["#655FB5","#8D88C8","#ACA9D8","#CCCBE6","#EBEBF6","#FFFFFF"].reverse();for(var d in o)c.push({id:d,weight:o[d],size:10+o[d]-2,color:l[Math.min(l.length-1,o[d])]});return{nodes:c,links:r}}},methods:{drawViz:function(){r.F("#"+this.graphId+" svg").remove(),this.svg=r.F("#"+this.graphId).append("svg").attr("preserveAspectRatio","xMinYMin meet").attr("viewBox","0 0 "+this.width+" "+this.height).style("padding",this.padding).style("margin",this.margin).classed("svg-content",!0),this.updateViz()},updateViz:function(){var t=r.u(this.jsonData.nodes,(function(t){return+t.size})),n=r.t(this.jsonData.nodes,(function(t){return+t.size})),e=r.z().domain([t,n]).range([10,40]),o=r.n().force("boundary",c(30,30,this.width-30,this.height-30)).force("link",r.l().id((function(t){return t.id}))).force("center",r.j(this.width/2,this.height/2)).force("charge",r.m().strength(-1e3)).force("collide",r.k().radius((function(t){return 16+e(t.size)})).iterations(2)),link=this.svg.append("g").attr("id","links").selectAll("line").data(this.jsonData.links).enter().append("line").attr("stroke-width",(function(t){return 1*t.weight})).attr("stroke","grey").attr("fill","none"),f=this.svg.append("g").attr("class","nodes").selectAll("g").data(this.jsonData.nodes).enter().append("g");f.append("circle").attr("r",(function(t){return e(t.size)})).attr("fill",(function(t){return t.color})).attr("stroke","white").attr("stroke-opacity",1).attr("stroke-width",(function(t){return.05*e(t.size)})).call(r.f().on("start",(function(t){t.active||o.alphaTarget(.3).restart();t.subject.fx=t.subject.x,t.subject.fy=t.subject.y})).on("drag",(function(t){t.subject.fx=t.x,t.subject.fy=t.y})).on("end",(function(t){t.active||o.alphaTarget(0);t.subject.fx=null,t.subject.fy=null}))),f.append("text").text((function(t){return t.id})).attr("x",0).attr("y",3).attr("text-anchor","middle").attr("text-baseline","middle"),f.append("title").text((function(t){return t.id})),o.nodes(this.jsonData.nodes).on("tick",(function(){f.attr("transform",(function(t){return"translate("+t.x+","+t.y+")"})),link.attr("x1",(function(t){return t.source.x})).attr("y1",(function(t){return t.source.y})).attr("x2",(function(t){return t.target.x})).attr("y2",(function(t){return t.target.y}))})),o.force("link").links(this.jsonData.links)}}},d=e(34),h=e(35),y=e.n(h),v=e(666),component=Object(d.a)(l,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("VContainer",[e("div",{staticStyle:{position:"relative"},attrs:{id:t.graphId}}),t._v(" "),e("div",[e("p",[t._v("\n      Please take into account the fact that this graph only shows the link\n      between data flows that are tagged as Fingerprinting or Advertising.\n    ")])])])}),[],!1,null,null,null);n.default=component.exports;y()(component,{VContainer:v.a})},1569:function(t,n,e){"use strict";var r=e(203),o=e(210),c=e(202),f=e(139),l=e(49),d=e(108);var h=function(object,path,t,n){if(!Object(l.a)(object))return object;for(var e=-1,r=(path=Object(c.a)(path,object)).length,h=r-1,y=object;null!=y&&++e<r;){var v=Object(d.a)(path[e]),w=t;if("__proto__"===v||"constructor"===v||"prototype"===v)return object;if(e!=h){var j=y[v];void 0===(w=n?n(j,v,y):void 0)&&(w=Object(l.a)(j)?j:Object(f.a)(path[e+1])?[]:{})}Object(o.a)(y,v,w),y=y[v]}return object};var y=function(object,t,n){for(var e=-1,o=t.length,f={};++e<o;){var path=t[e],l=Object(r.a)(object,path);n(l,path)&&h(f,Object(c.a)(path,object),l)}return f},v=e(334);var w=function(object,t){return y(object,t,(function(t,path){return Object(v.a)(object,path)}))},j=e(1055),x=Object(j.a)((function(object,t){return null==object?{}:w(object,t)}));n.a=x},714:function(t,n,e){"use strict";e.r(n),n.default={props:{values:{type:Array,default:function(){return[]}},headers:{type:Array,default:function(){return[]}}},data:function(){return{graphId:"graph_"+this._uid}},mounted:function(){this.drawViz()},watch:{values:function(){this.drawViz()}}}},929:function(t,n,e){"use strict";var r=e(206),o=e(60),c=e(125),f=e(30),l=o.a?o.a.isConcatSpreadable:void 0;var d=function(t){return Object(f.a)(t)||Object(c.a)(t)||!!(l&&t&&t[l])};n.a=function t(n,e,o,c,f){var l=-1,h=n.length;for(o||(o=d),f||(f=[]);++l<h;){var y=n[l];e>0&&o(y)?e>1?t(y,e-1,o,c,f):Object(r.a)(f,y):c||(f[f.length]=y)}return f}}}]);
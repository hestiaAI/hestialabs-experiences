(window.webpackJsonp=window.webpackJsonp||[]).push([[61],{1209:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return g}));var n=r(1256),o=(r(9),r(75),r(6),r(79),r(50),r(46),r(1257),r(1258),r(1260),r(669),r(670),r(671),r(668),r(10),r(36),r(1261),r(51),r(65),r(29),r(33),r(81),r(130),r(13),r(78),{d:function(e,t){for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}),c={};o.d(c,{Z:function(){return k}});var l=JSON.parse('{"name":"@hestia.ai/fitbit","version":"3.3.2","main":"dist/index.mjs","type":"module","files":["dist","src/fitbit-viewer.json"],"repository":{"type":"git","url":"https://github.com/hestiaai/hestialabs-experiences","directory":"packages/packages/experiences/fitbit"},"publishConfig":{"access":"public"},"author":"","license":"UNLICENSED"}'),f={genericDateViewer:{en:{viewBlocks:{genericDateViewer:{name:"Timeline",title:"Timeline",text:"See all the dated events in your files, corresponding to data that has been collected on you at or concerning a specific date.",graphTitle:"Number of dated events in your files",graphNoDate:"No dated events were found in your file(s).",datedEvents:"From {currMinDate} to {currMaxDate} we found {total} dated events in your file(s).",headers:{"File name":"File name",Date:"Date",Description:"Description"}}}},fr:{viewBlocks:{genericDateViewer:{name:"Chronologie",title:"Chronologie",text:"Voir tous les événements datés dans vos dossiers, correspondant aux données qui ont été collectées sur vous à ou concernant une date spécifique.",graphTitle:"Nombre d'événements datés dans vos dossiers",graphNoDate:"Aucun événement daté n'a été trouvé dans votre (vos) dossier(s).",datedEvents:"De {currMinDate} à {currMaxDate} nous avons trouvé {total} événements datés dans votre (vos) fichier(s).",headers:{"File name":"Nom de fichier",Date:"Date",Description:"Description"}}}}},genericLocationViewer:{en:{viewBlocks:{genericLocationViewer:{name:"Location Observations",title:"Location Observations",text:"See all the location events in your files, corresponding to data that has been collected on you at or concerning a specific location.",graphTitle:"Number of location records in your files",graphNoLocation:"No location were found in your file(s).",locations:"We found {total} locations in your file(s).",headers:{File:"File",Path:"Path",Latitude:"Latitude",Longitude:"Longitude",Description:"Description"}}}},fr:{viewBlocks:{genericLocationViewer:{name:"Positions",title:"Observations de localisation",text:"Voir tous les événements de localisation dans vos fichiers, correspondant aux données qui ont été collectées sur vous à ou concernant un lieu spécifique.",graphTitle:"Nombre de localisation dans vos fichiers",graphNoLocation:"Aucune localisation n'a été trouvé dans votre/vos fichier(s).",locations:"Nous avons trouvé {total} observations de localisation dans votre/vos fichier(s).",headers:{File:"Fichier",Path:"Chemin",Latitude:"Latitude",Longitude:"Longitude",Description:"Description"}}}}}};function d(e){return d="function"==typeof Symbol&&"symbol"==Object(n.a)(Symbol.iterator)?function(e){return Object(n.a)(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":Object(n.a)(e)},d(e)}function s(){s=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n=Object.defineProperty||function(e,t,r){e[t]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",o=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function c(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(e){c=function(e,t,r){return e[t]=r}}function l(e,t,r,o){var i=t&&t.prototype instanceof v?t:v,a=Object.create(i.prototype),s=new P(o||[]);return n(a,"_invoke",{value:k(e,r,s)}),a}function f(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var h={};function v(){}function p(){}function y(){}var m={};c(m,a,(function(){return this}));var g=Object.getPrototypeOf,w=g&&g(g(S([])));w&&w!==t&&r.call(w,a)&&(m=w);var b=y.prototype=v.prototype=Object.create(m);function x(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function L(e,t){function i(n,a,s,o){var u=f(e[n],e,a);if("throw"!==u.type){var c=u.arg,l=c.value;return l&&"object"==d(l)&&r.call(l,"__await")?t.resolve(l.__await).then((function(e){i("next",e,s,o)}),(function(e){i("throw",e,s,o)})):t.resolve(l).then((function(e){c.value=e,s(c)}),(function(e){return i("throw",e,s,o)}))}o(u.arg)}var a;n(this,"_invoke",{value:function(e,r){function n(){return new t((function(t,n){i(e,r,t,n)}))}return a=a?a.then(n,n):n()}})}function k(e,t,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var s=O(a,r);if(s){if(s===h)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var c=f(e,t,r);if("normal"===c.type){if(n=r.done?"completed":"suspendedYield",c.arg===h)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n="completed",r.method="throw",r.arg=c.arg)}}}function O(e,t){var r=t.method,n=e.iterator[r];if(void 0===n)return t.delegate=null,"throw"===r&&e.iterator.return&&(t.method="return",t.arg=void 0,O(e,t),"throw"===t.method)||"return"!==r&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+r+"' method")),h;var o=f(n,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,h;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,h):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,h)}function D(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function E(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function P(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(D,this),this.reset(!0)}function S(e){if(e){var t=e[a];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,o=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:j}}function j(){return{value:void 0,done:!0}}return p.prototype=y,n(b,"constructor",{value:y,configurable:!0}),n(y,"constructor",{value:p,configurable:!0}),p.displayName=c(y,u,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===p||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,y):(e.__proto__=y,c(e,u,"GeneratorFunction")),e.prototype=Object.create(b),e},e.awrap=function(e){return{__await:e}},x(L.prototype),c(L.prototype,o,(function(){return this})),e.AsyncIterator=L,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new L(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},x(b),c(b,u,"Generator"),c(b,a,(function(){return this})),c(b,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},e.values=S,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return a.type="throw",a.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=r.call(i,"catchLoc"),c=r.call(i,"finallyLoc");if(s&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),h},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),E(r),h}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;E(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:S(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},e}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var u=function(e,t,r,n){return new(r||(r=Promise))((function(o,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function s(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,s)}c((n=n.apply(e,t||[])).next())}))},v={showTable:!1},y={preprocessors:{},databaseConfig:void 0,disabled:!1,files:{},keepOnlyFiles:!0},m={collaborator:void 0,dataPortal:void 0,dataPortalMessage:void 0,dataPortalHtml:void 0,dataSamples:[],hideEmptyTabs:!1,hideFileExplorer:!0,hideSummary:!0,messages:{en:{viewBlocks:{}},fr:{viewBlocks:{}}},tutorialVideos:[],url:void 0},w=["viewerVersion","preprocessors","databaseConfig","dataModel","disabled","files","keepOnlyFiles"],x=["title","hideEmptyTabs","hideFileExplorer","hideSummary","icon","messages","subtitle","dataPortal","dataPortalHtml","dataPortalMessage","dataSamples","tutorialVideos","url","viewBlocks","collaborator"];function p(e,t){var r,n={},o=function(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return h(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?h(e,t):void 0}}(e))){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==r.return||r.return()}finally{if(s)throw i}}}}(t);try{for(o.s();!(r=o.n()).done;){var i=r.value;i in e&&(n[i]=e[i])}}catch(e){o.e(e)}finally{o.f()}return n}function L(e,t){return u(this,void 0,void 0,s().mark((function r(){var n,o;return s().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return n="".concat(t,"/").concat(e,"-viewer.json"),r.next=3,fetch(n);case 3:if(!(o=r.sent).ok){r.next=8;break}return r.next=7,o.json();case 7:return r.abrupt("return",r.sent);case 8:return r.abrupt("return",void 0);case 9:case"end":return r.stop()}}),r)})))}var k=new(function(){function e(t,r,n,o){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.loaderOptions=Object.assign(Object.assign({},y),p(t,w)),this.viewerOptions=Object.assign(Object.assign({},m),p(r,x)),this.viewerFunctions=a,this.initializeViewBlocks(this.viewerOptions,this.viewerFunctions);var s=n.name.replace(/@hestia\.?ai\//,"");this.checkPackageDirectory(s,o),this.name=s,this.version=n.version}var t,r;return t=e,(r=[{key:"viewerCompatibilityErrors",value:function(e){if(void 0===e)return"Undefined viewer options passed to experience ".concat(this.name);var t=this.loaderOptions.viewerVersion;if(void 0!==t){var r=e.version;if(!r||r<t)return"Experience ".concat(this.name," ").concat(this.version)+" requires viewerVersion ".concat(t,",")+" which is incompatible with viewerOptions version ".concat(r,".")}return!1}},{key:"configureViewer",value:function(t){var r=this.viewerCompatibilityErrors(t);if(r)throw new Error(r);var n={name:this.name,version:this.version};return new e(this.loaderOptions,t,n,void 0,this.viewerFunctions)}},{key:"provideViewerOptions",value:function(e){return u(this,void 0,void 0,s().mark((function t(){var r;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(void 0!==e){t.next=2;break}return t.abrupt("return",void 0);case 2:if("string"!=typeof e){t.next=4;break}return t.abrupt("return",L(this.name,e));case 4:if("string"!=typeof(r=e[this.name])){t.next=7;break}return t.abrupt("return",L(this.name,r));case 7:return t.abrupt("return",r);case 8:case"end":return t.stop()}}),t,this)})))}},{key:"checkPackageDirectory",value:function(e,t){if(t){var r=t.match(/\/([^/]+)\/src\//);if(!r){var n='Package directory for package "'.concat(e,'" not found');throw new Error(n)}var o=r[1];if(e!==o){var i='Package name "'.concat(e,'" must match directory name "').concat(o,'"');throw new Error(i)}}}},{key:"initializeViewBlocks",value:function(e,t){var r=this;e.viewBlocks.filter((function(e){return e.id in f})).forEach((function(t){var n=t.id;if(r.viewerOptions.messages)for(var i in e.messages){var a=i;r.viewerOptions.messages[a].viewBlocks[n]=f[n][a].viewBlocks[n]}})),e.viewBlocks=e.viewBlocks.map((function(e){return function(e,t){var r=Object.assign(Object.assign({},v),e);return function(e,t){var r,n,o=e.postprocessor;"string"==typeof o&&(e.postprocessor=null===(r=t.postprocessors)||void 0===r?void 0:r[o]);var i=e.customPipeline,a=null===(n=t.customPipelines)||void 0===n?void 0:n[i];"string"==typeof i&&a&&(e.customPipeline=a)}(r,t),r}(e,t)}))}},{key:"options",get:function(){return Object.assign(Object.assign({},this.loaderOptions),this.viewerOptions)}},{key:"config",get:function(){return Object.assign({name:this.name,slug:this.name,version:this.version},this.options)}}])&&function(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(i=function(e,t){if("object"!==d(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==d(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===d(i)?i:String(i)),n)}var i}(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}())({viewerVersion:1},JSON.parse('{"dataPortal":"https://help.fitbit.com/articles/en_US/Help_article/1133.htm","dataPortalMessage":"<strong>Important:</strong> To make the experiment work, please request your <strong>\\"Account Archive\\"</strong> not your <strong>\\"Fitbit Data\\"</strong>.","dataSamples":[],"hideEmptyTabs":false,"hideFileExplorer":false,"hideSummary":true,"messages":{"en":{"viewBlocks":{"genericDateViewer":{"name":"Timeline","title":"Timeline","text":"See all the dated events in your files, corresponding to data that has been collected on you at or concerning a specific date.","graphTitle":"Number of dated events in your files","graphNoDate":"No dated events were found in your file(s).","datedEvents":"From {currMinDate} to {currMaxDate} we found {total} dated events in your file(s).","headers":{"File name":"File name","Date":"Date","Description":"Description"}},"genericLocationViewer":{"name":"Location Observations","title":"Location Observations","text":"See all the location events in your files, corresponding to data that has been collected on you at or concerning a specific location.","graphTitle":"Number of location records in your files","graphNoLocation":"No location were found in your file(s).","locations":"We found {total} locations in your file(s).","headers":{"File":"File","Path":"Path","Latitude":"Latitude","Longitude":"Longitude","Description":"Description"}}}},"fr":{"viewBlocks":{"genericDateViewer":{"name":"Chronologie","title":"Chronologie","text":"Voir tous les événements datés dans vos dossiers, correspondant aux données qui ont été collectées sur vous à ou concernant une date spécifique.","graphTitle":"Nombre d\'événements datés dans vos dossiers","graphNoDate":"Aucun événement daté n\'a été trouvé dans votre (vos) dossier(s).","datedEvents":"De {currMinDate} à {currMaxDate} nous avons trouvé {total} événements datés dans votre (vos) fichier(s).","headers":{"File name":"Nom de fichier","Date":"Date","Description":"Description"}},"genericLocationViewer":{"name":"Positions","title":"Observations de localisation","text":"Voir tous les événements de localisation dans vos fichiers, correspondant aux données qui ont été collectées sur vous à ou concernant un lieu spécifique.","graphTitle":"Nombre de localisation dans vos fichiers","graphNoLocation":"Aucune localisation n\'a été trouvé dans votre/vos fichier(s).","locations":"Nous avons trouvé {total} observations de localisation dans votre/vos fichier(s).","headers":{"File":"Fichier","Path":"Chemin","Latitude":"Latitude","Longitude":"Longitude","Description":"Description"}}}}},"tutorialVideos":[],"title":"Fitbit","icon":"https://raw.githubusercontent.com/hestiaAI/hestialabs-experiences/master/packages/lib/icons/fitbit.jpg","viewBlocks":[{"showTable":false,"id":"genericDateViewer","customPipeline":"genericDateViewer","visualization":"ChartViewGenericDateViewer.vue","title":"Timeline","text":"See all the dated events in your files, corresponding to data that has been collected on you at or concerning a specific date."},{"showTable":false,"id":"genericLocationViewer","customPipeline":"genericLocationViewer","visualization":"ChartViewGenericLocationViewer.vue","title":"Location observations","text":"See all the location events in your files, corresponding to data that has been collected on you at or concerning a specific location."}],"version":1}'),l,"file:///C:/Users/andre/workspace/hestia/hestialabs-experiences/packages/packages/experiences/fitbit/src/index.ts"),g=c.Z},1256:function(e,t,r){"use strict";function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}r.d(t,"a",(function(){return n}))},1257:function(e,t,r){var n=r(371),o=r(667);n("toPrimitive"),o()},1258:function(e,t,r){var n=r(54),o=r(85),c=r(1259),l=r(37)("toPrimitive"),f=Date.prototype;n(f,l)||o(f,l,c)},1259:function(e,t,r){"use strict";var n=r(57),o=r(666),c=TypeError;e.exports=function(e){if(n(this),"string"===e||"default"===e)e="string";else if("number"!==e)throw c("Incorrect hint");return o(this,e)}},1260:function(e,t,r){r(371)("asyncIterator")},1261:function(e,t,r){r(5)({target:"Object",stat:!0},{setPrototypeOf:r(204)})}}]);
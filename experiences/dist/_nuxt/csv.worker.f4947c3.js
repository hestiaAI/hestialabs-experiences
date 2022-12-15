/*! For license information please see LICENSES */
!function(){var e={460:function(e,t){var r,n,i;n=[],r=function e(){"use strict";var t="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==t?t:{},r=!t.document&&!!t.postMessage,n=r&&/blob:/i.test((t.location||{}).protocol),i={},s=0,a={parse:function(r,n){var o=(n=n||{}).dynamicTyping||!1;if(k(o)&&(n.dynamicTypingFunction=o,o={}),n.dynamicTyping=o,n.transform=!!k(n.transform)&&n.transform,n.worker&&a.WORKERS_SUPPORTED){var u=function(){if(!a.WORKERS_SUPPORTED)return!1;var r,n,o=(r=t.URL||t.webkitURL||null,n=e.toString(),a.BLOB_URL||(a.BLOB_URL=r.createObjectURL(new Blob(["(",n,")();"],{type:"text/javascript"})))),u=new t.Worker(o);return u.onmessage=m,u.id=s++,i[u.id]=u}();return u.userStep=n.step,u.userChunk=n.chunk,u.userComplete=n.complete,u.userError=n.error,n.step=k(n.step),n.chunk=k(n.chunk),n.complete=k(n.complete),n.error=k(n.error),delete n.worker,void u.postMessage({input:r,config:n,workerId:u.id})}var l=null;return a.NODE_STREAM_INPUT,"string"==typeof r?l=n.download?new f(n):new d(n):!0===r.readable&&k(r.read)&&k(r.on)?l=new c(n):(t.File&&r instanceof File||r instanceof Object)&&(l=new h(n)),l.stream(r)},unparse:function(e,t){var r=!1,n=!0,i=",",s="\r\n",o='"',u=o+o,f=!1,h=null,d=!1;!function(){if("object"==typeof t){if("string"!=typeof t.delimiter||a.BAD_DELIMITERS.filter((function(e){return-1!==t.delimiter.indexOf(e)})).length||(i=t.delimiter),("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(r=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(f=t.skipEmptyLines),"string"==typeof t.newline&&(s=t.newline),"string"==typeof t.quoteChar&&(o=t.quoteChar),"boolean"==typeof t.header&&(n=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");h=t.columns}void 0!==t.escapeChar&&(u=t.escapeChar+o),("boolean"==typeof t.escapeFormulae||t.escapeFormulae instanceof RegExp)&&(d=t.escapeFormulae instanceof RegExp?t.escapeFormulae:/^[=+\-@\t\r].*$/)}}();var c=new RegExp(p(o),"g");if("string"==typeof e&&(e=JSON.parse(e)),Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return l(null,e,f);if("object"==typeof e[0])return l(h||Object.keys(e[0]),e,f)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||h),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),l(e.fields||[],e.data||[],f);throw new Error("Unable to serialize unrecognized input");function l(e,t,r){var a="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var o=Array.isArray(e)&&0<e.length,u=!Array.isArray(t[0]);if(o&&n){for(var f=0;f<e.length;f++)0<f&&(a+=i),a+=g(e[f],f);0<t.length&&(a+=s)}for(var h=0;h<t.length;h++){var d=o?e.length:t[h].length,c=!1,l=o?0===Object.keys(t[h]).length:0===t[h].length;if(r&&!o&&(c="greedy"===r?""===t[h].join("").trim():1===t[h].length&&0===t[h][0].length),"greedy"===r&&o){for(var p=[],m=0;m<d;m++){var _=u?e[m]:m;p.push(t[h][_])}c=""===p.join("").trim()}if(!c){for(var v=0;v<d;v++){0<v&&!l&&(a+=i);var y=o&&u?e[v]:v;a+=g(t[h][y],v)}h<t.length-1&&(!r||0<d&&!l)&&(a+=s)}}return a}function g(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var n=!1;d&&"string"==typeof e&&d.test(e)&&(e="'"+e,n=!0);var s=e.toString().replace(c,u);return(n=n||!0===r||"function"==typeof r&&r(e,t)||Array.isArray(r)&&r[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return!0;return!1}(s,a.BAD_DELIMITERS)||-1<s.indexOf(i)||" "===s.charAt(0)||" "===s.charAt(s.length-1))?o+s+o:s}}};if(a.RECORD_SEP=String.fromCharCode(30),a.UNIT_SEP=String.fromCharCode(31),a.BYTE_ORDER_MARK="\ufeff",a.BAD_DELIMITERS=["\r","\n",'"',a.BYTE_ORDER_MARK],a.WORKERS_SUPPORTED=!r&&!!t.Worker,a.NODE_STREAM_INPUT=1,a.LocalChunkSize=10485760,a.RemoteChunkSize=5242880,a.DefaultDelimiter=",",a.Parser=g,a.ParserHandle=l,a.NetworkStreamer=f,a.FileStreamer=h,a.StringStreamer=d,a.ReadableStreamStreamer=c,t.jQuery){var o=t.jQuery;o.fn.parse=function(e){var r=e.config||{},n=[];return this.each((function(e){if("INPUT"!==o(this).prop("tagName").toUpperCase()||"file"!==o(this).attr("type").toLowerCase()||!t.FileReader||!this.files||0===this.files.length)return!0;for(var i=0;i<this.files.length;i++)n.push({file:this.files[i],inputElem:this,instanceConfig:o.extend({},r)})})),i(),this;function i(){if(0!==n.length){var t,r,i,u,f=n[0];if(k(e.before)){var h=e.before(f.file,f.inputElem);if("object"==typeof h){if("abort"===h.action)return t="AbortError",r=f.file,i=f.inputElem,u=h.reason,void(k(e.error)&&e.error({name:t},r,i,u));if("skip"===h.action)return void s();"object"==typeof h.config&&(f.instanceConfig=o.extend(f.instanceConfig,h.config))}else if("skip"===h)return void s()}var d=f.instanceConfig.complete;f.instanceConfig.complete=function(e){k(d)&&d(e,f.file,f.inputElem),s()},a.parse(f.file,f.instanceConfig)}else k(e.complete)&&e.complete()}function s(){n.splice(0,1),i()}}}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=y(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new l(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,r){if(this.isFirstChunk&&k(this._config.beforeFirstChunk)){var i=this._config.beforeFirstChunk(e);void 0!==i&&(e=i)}this.isFirstChunk=!1,this._halted=!1;var s=this._partialLine+e;this._partialLine="";var o=this._handle.parse(s,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var u=o.meta.cursor;this._finished||(this._partialLine=s.substring(u-this._baseIndex),this._baseIndex=u),o&&o.data&&(this._rowCount+=o.data.length);var f=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(n)t.postMessage({results:o,workerId:a.WORKER_ID,finished:f});else if(k(this._config.chunk)&&!r){if(this._config.chunk(o,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);o=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(o.data),this._completeResults.errors=this._completeResults.errors.concat(o.errors),this._completeResults.meta=o.meta),this._completed||!f||!k(this._config.complete)||o&&o.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),f||o&&o.meta.paused||this._nextChunk(),o}this._halted=!0},this._sendError=function(e){k(this._config.error)?this._config.error(e):n&&this._config.error&&t.postMessage({workerId:a.WORKER_ID,error:e,finished:!1})}}function f(e){var t;(e=e||{}).chunkSize||(e.chunkSize=a.RemoteChunkSize),u.call(this,e),this._nextChunk=r?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(t=new XMLHttpRequest,this._config.withCredentials&&(t.withCredentials=this._config.withCredentials),r||(t.onload=b(this._chunkLoaded,this),t.onerror=b(this._chunkError,this)),t.open(this._config.downloadRequestBody?"POST":"GET",this._input,!r),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var n in e)t.setRequestHeader(n,e[n])}if(this._config.chunkSize){var i=this._start+this._config.chunkSize-1;t.setRequestHeader("Range","bytes="+this._start+"-"+i)}try{t.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}r&&0===t.status&&this._chunkError()}},this._chunkLoaded=function(){4===t.readyState&&(t.status<200||400<=t.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:t.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");return null===t?-1:parseInt(t.substring(t.lastIndexOf("/")+1))}(t),this.parseChunk(t.responseText)))},this._chunkError=function(e){var r=t.statusText||e;this._sendError(new Error(r))}}function h(e){var t,r;(e=e||{}).chunkSize||(e.chunkSize=a.LocalChunkSize),u.call(this,e);var n="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,r=e.slice||e.webkitSlice||e.mozSlice,n?((t=new FileReader).onload=b(this._chunkLoaded,this),t.onerror=b(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var i=Math.min(this._start+this._config.chunkSize,this._input.size);e=r.call(e,this._start,i)}var s=t.readAsText(e,this._config.encoding);n||this._chunkLoaded({target:{result:s}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function d(e){var t;u.call(this,e=e||{}),this.stream=function(e){return t=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,r=this._config.chunkSize;return r?(e=t.substring(0,r),t=t.substring(r)):(e=t,t=""),this._finished=!t,this.parseChunk(e)}}}function c(e){u.call(this,e=e||{});var t=[],r=!0,n=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){n&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0},this._streamData=b((function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}}),this),this._streamError=b((function(e){this._streamCleanUp(),this._sendError(e)}),this),this._streamEnd=b((function(){this._streamCleanUp(),n=!0,this._streamData("")}),this),this._streamCleanUp=b((function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)}),this)}function l(e){var t,r,n,i=Math.pow(2,53),s=-i,o=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,u=/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/,f=this,h=0,d=0,c=!1,l=!1,m=[],_={data:[],errors:[],meta:{}};if(k(e.step)){var v=e.step;e.step=function(t){if(_=t,E())x();else{if(x(),0===_.data.length)return;h+=t.data.length,e.preview&&h>e.preview?r.abort():(_.data=_.data[0],v(_,f))}}}function b(t){return"greedy"===e.skipEmptyLines?""===t.join("").trim():1===t.length&&0===t[0].length}function x(){return _&&n&&(R("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+a.DefaultDelimiter+"'"),n=!1),e.skipEmptyLines&&(_.data=_.data.filter((function(e){return!b(e)}))),E()&&function(){if(_)if(Array.isArray(_.data[0])){for(var t=0;E()&&t<_.data.length;t++)_.data[t].forEach(r);_.data.splice(0,1)}else _.data.forEach(r);function r(t,r){k(e.transformHeader)&&(t=e.transformHeader(t,r)),m.push(t)}}(),function(){if(!_||!e.header&&!e.dynamicTyping&&!e.transform)return _;function t(t,r){var n,i=e.header?{}:[];for(n=0;n<t.length;n++){var s=n,a=t[n];e.header&&(s=n>=m.length?"__parsed_extra":m[n]),e.transform&&(a=e.transform(a,s)),a=w(s,a),"__parsed_extra"===s?(i[s]=i[s]||[],i[s].push(a)):i[s]=a}return e.header&&(n>m.length?R("FieldMismatch","TooManyFields","Too many fields: expected "+m.length+" fields but parsed "+n,d+r):n<m.length&&R("FieldMismatch","TooFewFields","Too few fields: expected "+m.length+" fields but parsed "+n,d+r)),i}var r=1;return!_.data.length||Array.isArray(_.data[0])?(_.data=_.data.map(t),r=_.data.length):_.data=t(_.data,0),e.header&&_.meta&&(_.meta.fields=m),d+=r,_}()}function E(){return e.header&&0===m.length}function w(t,r){return n=t,e.dynamicTypingFunction&&void 0===e.dynamicTyping[n]&&(e.dynamicTyping[n]=e.dynamicTypingFunction(n)),!0===(e.dynamicTyping[n]||e.dynamicTyping)?"true"===r||"TRUE"===r||"false"!==r&&"FALSE"!==r&&(function(e){if(o.test(e)){var t=parseFloat(e);if(s<t&&t<i)return!0}return!1}(r)?parseFloat(r):u.test(r)?new Date(r):""===r?null:r):r;var n}function R(e,t,r,n){var i={type:e,code:t,message:r};void 0!==n&&(i.row=n),_.errors.push(i)}this.parse=function(i,s,o){var u=e.quoteChar||'"';if(e.newline||(e.newline=function(e,t){e=e.substring(0,1048576);var r=new RegExp(p(t)+"([^]*?)"+p(t),"gm"),n=(e=e.replace(r,"")).split("\r"),i=e.split("\n"),s=1<i.length&&i[0].length<n[0].length;if(1===n.length||s)return"\n";for(var a=0,o=0;o<n.length;o++)"\n"===n[o][0]&&a++;return a>=n.length/2?"\r\n":"\r"}(i,u)),n=!1,e.delimiter)k(e.delimiter)&&(e.delimiter=e.delimiter(i),_.meta.delimiter=e.delimiter);else{var f=function(t,r,n,i,s){var o,u,f,h;s=s||[",","\t","|",";",a.RECORD_SEP,a.UNIT_SEP];for(var d=0;d<s.length;d++){var c=s[d],l=0,p=0,m=0;f=void 0;for(var _=new g({comments:i,delimiter:c,newline:r,preview:10}).parse(t),v=0;v<_.data.length;v++)if(n&&b(_.data[v]))m++;else{var y=_.data[v].length;p+=y,void 0!==f?0<y&&(l+=Math.abs(y-f),f=y):f=y}0<_.data.length&&(p/=_.data.length-m),(void 0===u||l<=u)&&(void 0===h||h<p)&&1.99<p&&(u=l,o=c,h=p)}return{successful:!!(e.delimiter=o),bestDelimiter:o}}(i,e.newline,e.skipEmptyLines,e.comments,e.delimitersToGuess);f.successful?e.delimiter=f.bestDelimiter:(n=!0,e.delimiter=a.DefaultDelimiter),_.meta.delimiter=e.delimiter}var h=y(e);return e.preview&&e.header&&h.preview++,t=i,r=new g(h),_=r.parse(t,s,o),x(),c?{meta:{paused:!0}}:_||{meta:{paused:!1}}},this.paused=function(){return c},this.pause=function(){c=!0,r.abort(),t=k(e.chunk)?"":t.substring(r.getCharIndex())},this.resume=function(){f.streamer._halted?(c=!1,f.streamer.parseChunk(t,!0)):setTimeout(f.resume,3)},this.aborted=function(){return l},this.abort=function(){l=!0,r.abort(),_.meta.aborted=!0,k(e.complete)&&e.complete(_),t=""}}function p(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function g(e){var t,r=(e=e||{}).delimiter,n=e.newline,i=e.comments,s=e.step,o=e.preview,u=e.fastMode,f=t=void 0===e.quoteChar||null===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(f=e.escapeChar),("string"!=typeof r||-1<a.BAD_DELIMITERS.indexOf(r))&&(r=","),i===r)throw new Error("Comment character same as delimiter");!0===i?i="#":("string"!=typeof i||-1<a.BAD_DELIMITERS.indexOf(i))&&(i=!1),"\n"!==n&&"\r"!==n&&"\r\n"!==n&&(n="\n");var h=0,d=!1;this.parse=function(e,a,c){if("string"!=typeof e)throw new Error("Input must be a string");var l=e.length,g=r.length,m=n.length,_=i.length,v=k(s),y=[],b=[],x=[],E=h=0;if(!e)return F();if(u||!1!==u&&-1===e.indexOf(t)){for(var w=e.split(n),R=0;R<w.length;R++){if(x=w[R],h+=x.length,R!==w.length-1)h+=n.length;else if(c)return F();if(!i||x.substring(0,_)!==i){if(v){if(y=[],j(x.split(r)),U(),d)return F()}else j(x.split(r));if(o&&o<=R)return y=y.slice(0,o),F(!0)}}return F()}for(var C=e.indexOf(r,h),O=e.indexOf(n,h),S=new RegExp(p(f)+p(t),"g"),A=e.indexOf(t,h);;)if(e[h]!==t)if(i&&0===x.length&&e.substring(h,h+_)===i){if(-1===O)return F();h=O+m,O=e.indexOf(n,h),C=e.indexOf(r,h)}else if(-1!==C&&(C<O||-1===O))x.push(e.substring(h,C)),h=C+g,C=e.indexOf(r,h);else{if(-1===O)break;if(x.push(e.substring(h,O)),z(O+m),v&&(U(),d))return F();if(o&&y.length>=o)return F(!0)}else for(A=h,h++;;){if(-1===(A=e.indexOf(t,A+1)))return c||b.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:y.length,index:h}),L();if(A===l-1)return L(e.substring(h,A).replace(S,t));if(t!==f||e[A+1]!==f){if(t===f||0===A||e[A-1]!==f){-1!==C&&C<A+1&&(C=e.indexOf(r,A+1)),-1!==O&&O<A+1&&(O=e.indexOf(n,A+1));var I=D(-1===O?C:Math.min(C,O));if(e.substr(A+1+I,g)===r){x.push(e.substring(h,A).replace(S,t)),e[h=A+1+I+g]!==t&&(A=e.indexOf(t,h)),C=e.indexOf(r,h),O=e.indexOf(n,h);break}var T=D(O);if(e.substring(A+1+T,A+1+T+m)===n){if(x.push(e.substring(h,A).replace(S,t)),z(A+1+T+m),C=e.indexOf(r,h),A=e.indexOf(t,h),v&&(U(),d))return F();if(o&&y.length>=o)return F(!0);break}b.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:y.length,index:h}),A++}}else A++}return L();function j(e){y.push(e),E=h}function D(t){var r=0;if(-1!==t){var n=e.substring(A+1,t);n&&""===n.trim()&&(r=n.length)}return r}function L(t){return c||(void 0===t&&(t=e.substring(h)),x.push(t),h=l,j(x),v&&U()),F()}function z(t){h=t,j(x),x=[],O=e.indexOf(n,h)}function F(e){return{data:y,errors:b,meta:{delimiter:r,linebreak:n,aborted:d,truncated:!!e,cursor:E+(a||0)}}}function U(){s(F()),y=[],b=[]}},this.abort=function(){d=!0},this.getCharIndex=function(){return h}}function m(e){var t=e.data,r=i[t.workerId],n=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var s={abort:function(){n=!0,_(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:v,resume:v};if(k(r.userStep)){for(var a=0;a<t.results.data.length&&(r.userStep({data:t.results.data[a],errors:t.results.errors,meta:t.results.meta},s),!n);a++);delete t.results}else k(r.userChunk)&&(r.userChunk(t.results,s,t.file),delete t.results)}t.finished&&!n&&_(t.workerId,t.results)}function _(e,t){var r=i[e];k(r.userComplete)&&r.userComplete(t),r.terminate(),delete i[e]}function v(){throw new Error("Not implemented.")}function y(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=y(e[r]);return t}function b(e,t){return function(){e.apply(t,arguments)}}function k(e){return"function"==typeof e}return n&&(t.onmessage=function(e){var r=e.data;if(void 0===a.WORKER_ID&&r&&(a.WORKER_ID=r.workerId),"string"==typeof r.input)t.postMessage({workerId:a.WORKER_ID,results:a.parse(r.input,r.config),finished:!0});else if(t.File&&r.input instanceof File||r.input instanceof Object){var n=a.parse(r.input,r.config);n&&t.postMessage({workerId:a.WORKER_ID,results:n,finished:!0})}}),(f.prototype=Object.create(u.prototype)).constructor=f,(h.prototype=Object.create(u.prototype)).constructor=h,(d.prototype=Object.create(d.prototype)).constructor=d,(c.prototype=Object.create(u.prototype)).constructor=c,a},void 0===(i="function"==typeof r?r.apply(t,n):r)||(e.exports=i)}},t={};function r(n){var i=t[n];if(void 0!==i)return i.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}!function(){"use strict";var e=r(460),t="object"==typeof global&&global&&global.Object===Object&&global,i="object"==typeof self&&self&&self.Object===Object&&self,u=(t||i||Function("return this")()).Symbol;var n=function(e,t){for(var r=-1,n=null==e?0:e.length,i=Array(n);++r<n;)i[r]=t(e[r],r,e);return i},o=Array.isArray,f=Object.prototype,p=f.hasOwnProperty,g=f.toString,h=u?u.toStringTag:void 0;var d=function(e){var t=p.call(e,h),r=e[h];try{e[h]=void 0;var n=!0}catch(e){}var i=g.call(e);return n&&(t?e[h]=r:delete e[h]),i},b=Object.prototype.toString;var c=function(e){return b.call(e)},l=u?u.toStringTag:void 0;var m=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":l&&l in Object(e)?d(e):c(e)};var _=function(e){return null!=e&&"object"==typeof e};var v=function(e){return"symbol"==typeof e||_(e)&&"[object Symbol]"==m(e)},y=u?u.prototype:void 0,k=y?y.toString:void 0;var x=function e(t){if("string"==typeof t)return t;if(o(t))return n(t,e)+"";if(v(t))return k?k.call(t):"";var r=t+"";return"0"==r&&1/t==-Infinity?"-0":r};var E=function(e){return null==e?"":x(e)};var w=function(e,t,r){var n=-1,i=e.length;t<0&&(t=-t>i?0:i+t),(r=r>i?i:r)<0&&(r+=i),i=t>r?0:r-t>>>0,t>>>=0;for(var s=Array(i);++n<i;)s[n]=e[n+t];return s};var R=function(e,t,r){var n=e.length;return r=void 0===r?n:r,!t&&r>=n?e:w(e,t,r)},C=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");var O=function(e){return C.test(e)};var S=function(e){return e.split("")},A="\\ud800-\\udfff",I="["+A+"]",T="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",j="\\ud83c[\\udffb-\\udfff]",D="[^"+A+"]",L="(?:\\ud83c[\\udde6-\\uddff]){2}",z="[\\ud800-\\udbff][\\udc00-\\udfff]",F="(?:"+T+"|"+j+")"+"?",U="[\\ufe0e\\ufe0f]?",M=U+F+("(?:\\u200d(?:"+[D,L,z].join("|")+")"+U+F+")*"),N="(?:"+[D+T+"?",T,L,z,I].join("|")+")",P=RegExp(j+"(?="+j+")|"+N+M,"g");var B=function(e){return e.match(P)||[]};var H=function(e){return O(e)?B(e):S(e)};var Z=function(e){return function(t){t=E(t);var r=O(t)?H(t):void 0,n=r?r[0]:t.charAt(0),i=r?R(r,1).join(""):t.slice(1);return n[e]()+i}},K=Z("toUpperCase");var W=function(e){return K(E(e).toLowerCase())};var J=function(e,t,r,n){var i=-1,s=null==e?0:e.length;for(n&&s&&(r=e[++i]);++i<s;)r=t(r,e[i],i,e);return r};var Q=function(e){return function(t){return null==e?void 0:e[t]}},$=Q({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),G=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Y=RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]","g");var V=function(e){return(e=E(e))&&e.replace(G,$).replace(Y,"")},X=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;var ee=function(e){return e.match(X)||[]},te=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;var re=function(e){return te.test(e)},ne="\\ud800-\\udfff",ie="\\u2700-\\u27bf",se="a-z\\xdf-\\xf6\\xf8-\\xff",dt="A-Z\\xc0-\\xd6\\xd8-\\xde",ae="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",oe="["+ae+"]",ue="\\d+",fe="["+ie+"]",he="["+se+"]",de="[^"+ne+ae+ue+ie+se+dt+"]",ce="(?:\\ud83c[\\udde6-\\uddff]){2}",le="[\\ud800-\\udbff][\\udc00-\\udfff]",pe="["+dt+"]",ge="(?:"+he+"|"+de+")",me="(?:"+pe+"|"+de+")",_e="(?:['’](?:d|ll|m|re|s|t|ve))?",ve="(?:['’](?:D|LL|M|RE|S|T|VE))?",ye="(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?",be="[\\ufe0e\\ufe0f]?",ke=be+ye+("(?:\\u200d(?:"+["[^"+ne+"]",ce,le].join("|")+")"+be+ye+")*"),xe="(?:"+[fe,ce,le].join("|")+")"+ke,Ee=RegExp([pe+"?"+he+"+"+_e+"(?="+[oe,pe,"$"].join("|")+")",me+"+"+ve+"(?="+[oe,pe+ge,"$"].join("|")+")",pe+"?"+ge+"+"+_e,pe+"+"+ve,"\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",ue,xe].join("|"),"g");var we=function(e){return e.match(Ee)||[]};var Re=function(e,t,r){return e=E(e),void 0===(t=r?void 0:t)?re(e)?we(e):ee(e):e.match(t)||[]},Ce=RegExp("['’]","g");var Oe=function(e){return function(t){return J(Re(V(t).replace(Ce,"")),e,"")}},Se=Oe((function(e,t,r){return t=t.toLowerCase(),e+(r?W(t):t)})),Ae=Se;async function Ie(t){const{headers:r,items:n}=await new Promise(((r,n)=>{e.parse(t,{header:!0,skipEmptyLines:!0,transformHeader:function(e){return Ae(e)},complete:function(e){e.errors.forEach((e=>console.error(e))),r({headers:e.meta.fields,items:e.data})}})}));return{headers:r,items:n}}self.onmessage=async e=>{const t=await Ie(e.data);self.postMessage(t)}}()}();
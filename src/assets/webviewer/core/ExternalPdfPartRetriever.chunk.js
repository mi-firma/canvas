/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see legal.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[6],{342:function(ha,ca,h){h.r(ca);var ba=h(2);ha=h(35);var da=h(131),fa=h(290),aa=h(181),z=window;h=function(){function h(h,f){this.oL=function(f){f=f.split(".");return f[f.length-1].match(/(jpg|jpeg|png|gif)$/i)};f=f||{};this.url=h;this.filename=f.filename||h;this.tf=f.customHeaders;this.C3=!!f.useDownloader;this.withCredentials=!!f.withCredentials}h.prototype.iy=function(h){this.tf=h};h.prototype.getFileData=function(w){var f=
this,n=this,x=new XMLHttpRequest,e=0===this.url.indexOf("blob:")?"blob":"arraybuffer";x.open("GET",this.url,!0);x.withCredentials=this.withCredentials;x.responseType=e;this.tf&&Object.keys(this.tf).forEach(function(e){x.setRequestHeader(e,f.tf[e])});var r=/^https?:/i.test(this.url);x.addEventListener("load",function(e){return Object(ba.b)(this,void 0,void 0,function(){var f,x,y,z,ca,ea,fa;return Object(ba.d)(this,function(ba){switch(ba.label){case 0:if(200!==this.status&&(r||0!==this.status))return[3,
10];n.trigger(h.Events.DOCUMENT_LOADING_PROGRESS,[e.loaded,e.loaded]);if("blob"!==this.responseType)return[3,4];f=this.response;return n.oL(n.filename)?[4,Object(aa.b)(f)]:[3,2];case 1:return x=ba.ka(),n.fileSize=x.byteLength,w(new Uint8Array(x)),[3,3];case 2:y=new FileReader,y.onload=function(e){e=new Uint8Array(e.target.result);n.fileSize=e.length;w(e)},y.readAsArrayBuffer(f),ba.label=3;case 3:return[3,9];case 4:ba.In.push([4,8,,9]);z=new Uint8Array(this.response);if(!n.oL(n.filename))return[3,
6];ca=new Blob([z.buffer]);return[4,Object(aa.b)(ca)];case 5:return x=ba.ka(),n.fileSize=x.byteLength,w(new Uint8Array(x)),[3,7];case 6:n.fileSize=z.length,w(z),ba.label=7;case 7:return[3,9];case 8:return ba.ka(),n.trigger(h.Events.ERROR,["pdfLoad","Out of memory"]),[3,9];case 9:return[3,11];case 10:ea=e.currentTarget,fa=Object(da.a)(ea),n.trigger(h.Events.ERROR,["pdfLoad",this.status+" "+ea.statusText,fa]),ba.label=11;case 11:return n.Rt=null,[2]}})})},!1);x.onprogress=function(e){n.trigger(h.Events.DOCUMENT_LOADING_PROGRESS,
[e.loaded,0<e.total?e.total:0])};x.addEventListener("error",function(){n.trigger(h.Events.ERROR,["pdfLoad","Network failure"]);n.Rt=null},!1);x.send();this.Rt=x};h.prototype.getFile=function(){var h=this;return new Promise(function(f){z.utils.isJSWorker&&f(h.url);if(h.C3){var n=Object(ba.a)({url:h.url},h.tf?{customHeaders:h.tf}:{});f(n)}f(null)})};h.prototype.abort=function(){this.Rt&&(this.Rt.abort(),this.Rt=null)};h.Events={DOCUMENT_LOADING_PROGRESS:"documentLoadingProgress",ERROR:"error"};return h}();
Object(ha.b)(h);Object(fa.a)(h);Object(fa.b)(h);ca["default"]=h}}]);}).call(this || window)
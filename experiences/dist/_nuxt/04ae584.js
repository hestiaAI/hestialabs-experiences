(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{1289:function(n,e){},1290:function(n,e){},1418:function(n,e){},1420:function(n,e){},1430:function(n,e){},1432:function(n,e){},1457:function(n,e){},1459:function(n,e){},1460:function(n,e){},1465:function(n,e){},1467:function(n,e){},1473:function(n,e){},1475:function(n,e){},1494:function(n,e){},1506:function(n,e){},1509:function(n,e){},1555:function(n,e,t){"use strict";t.r(e);var o=t(1132),c=t(23),r=(t(86),t(1161)),f=t.n(r),l=t(1413),y=t.n(l),h=t(1414),k=t.n(h),d={methods:{generateKeys:function(){return Object(c.a)(regeneratorRuntime.mark((function n(){var e,t,o,c,r,content;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,k.a.ready;case 2:return e=k.a,t=e.crypto_box_keypair(),o=e.to_hex(t.publicKey),c=e.to_hex(t.privateKey),(r=new f.a).file("public-key.txt",o),r.file("secret-key.txt",c),n.next=11,r.generateAsync({type:"blob"});case 11:content=n.sent,y.a.saveAs(content,"keys.zip");case 13:case"end":return n.stop()}}),n)})))()}}},v=t(49),component=Object(v.a)(d,(function(){var n=this,e=n._self._c;return e(o.a,[e("h2",[n._v("Key Generation")]),n._v(" "),e("p",[n._v("\n    This step only needs to be done once. Copy the public key in the config\n    and store the secret key in a safe place.\n  ")]),n._v(" "),e("BaseButton",{attrs:{text:"Generate keys"},on:{click:n.generateKeys}})],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{BaseButton:t(622).default})}}]);
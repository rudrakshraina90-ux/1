(function(){
var PAR=function(s){var m=s&&s.match(/rgba?\(([^)]+)\)/);if(!m)return null;var p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return{r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}};
var LUM=function(r,g,b){var a=[r,g,b].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
var CR=function(l1,l2){return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)};
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h=0,s=0,l=(mx+mn)/2;if(mx!=mn){var d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx==r?(g-b)/d+(g<b?6:0):mx==g?(b-r)/d+2:(r-g)/d+4;h/=6}return[h,s,l]}
function hsl2rgb(h,s,l){function f(p,q,t){if(t<0)t+=1;if(t>1)t-=1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p}var r,g,b;if(!s){r=g=b=l}else{var q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;r=f(p,q,h+1/3);g=f(p,q,h);b=f(p,q,h-1/3)}return[Math.round(r*255),Math.round(g*255),Math.round(b*255)]}
function grad(bi){var m=bi.match(/rgba?\([^)]+\)/g);if(!m)return null;var c=m.map(PAR).filter(function(x){return x.a>=.5});if(!c.length)return null;var n=c.length;return{r:c.reduce(function(a,x){return a+x.r},0)/n,g:c.reduce(function(a,x){return a+x.g},0)/n,b:c.reduce(function(a,x){return a+x.b},0)/n,a:1}}
function backdrop(el){var ly=[];for(var n=el;n&&n.nodeType==1;n=n.parentElement){var cs=getComputedStyle(n),bi=cs.backgroundImage,c=PAR(cs.backgroundColor),got=false;
 if(c&&c.a>0){ly.push(c);if(c.a>=.99)got=true}
 if(!got&&bi&&bi!='none'){if(bi.indexOf('url(')>-1)return null;var g=grad(bi);if(g){ly.push(g);got=true}}
 if(got)break;
 if(cs.position=='absolute'||cs.position=='fixed')return null}
 var b={r:255,g:255,b:255};for(var i=ly.length-1;i>=0;i--){var c2=ly[i];b={r:c2.r*c2.a+b.r*(1-c2.a),g:c2.g*c2.a+b.g*(1-c2.a),b:c2.b*c2.a+b.b*(1-c2.a)}}return b}
function neutral(c,bl,el){var h=/^H[1-6]$/.test(el.tagName)||(parseFloat(getComputedStyle(el).fontSize)>=20);return bl<.4?(h?'#ffffff':'#D5DCE8'):(h?'#0B2447':'#44474c')}
function adjust(c,bl,need){var hsl=rgb2hsl(c.r,c.g,c.b),goUp=bl<.4,lo=goUp?hsl[2]:0,hi=goUp?1:hsl[2],best=goUp?1:0;
 for(var i=0;i<22;i++){var mid=(lo+hi)/2,rgb=hsl2rgb(hsl[0],hsl[1],mid),r=CR(LUM(rgb[0],rgb[1],rgb[2]),bl);
  if(r>=need){best=mid;if(goUp)hi=mid;else lo=mid}else{if(goUp)lo=mid;else hi=mid}}
 var o=hsl2rgb(hsl[0],hsl[1],best);return'rgb('+o[0]+','+o[1]+','+o[2]+')'}
var SKIP='svg,script,style,noscript,.mp,.n4';
function fix(){document.querySelectorAll('body *').forEach(function(el){
 if(el.closest(SKIP))return;var t=false;for(var i=0;i<el.childNodes.length;i++){var n=el.childNodes[i];if(n.nodeType==3&&n.textContent.trim()){t=true;break}}if(!t)return;
 var cs=getComputedStyle(el);if(cs.visibility=='hidden'||cs.display=='none')return;
 if(cs.webkitBackgroundClip=='text'||cs.backgroundClip=='text')return;
 var c=PAR(cs.color);if(!c||c.a===0)return;var b=backdrop(el);if(!b)return;
 var tc=c.a<1?{r:c.r*c.a+b.r*(1-c.a),g:c.g*c.a+b.g*(1-c.a),b:c.b*c.a+b.b*(1-c.a)}:c;
 var bl=LUM(b.r,b.g,b.b),cr=CR(LUM(tc.r,tc.g,tc.b),bl),fs=parseFloat(cs.fontSize),fw=parseInt(cs.fontWeight)||400;
 var need=(fs>=24||(fs>=18.66&&fw>=700))?3:4.5;
 if(cr<need){var hs=rgb2hsl(tc.r,tc.g,tc.b),ink=(hs[1]<.3||hs[2]<.25||hs[2]>.85);el.style.setProperty('color',ink?neutral(tc,bl,el):adjust(tc,bl,need+.2),'important')}})}
var tm;function soon(){clearTimeout(tm);tm=setTimeout(fix,60)}
function run(){requestAnimationFrame(function(){requestAnimationFrame(fix)});[700,2200,4500,8000,12000].forEach(function(t){setTimeout(fix,t)})}
addEventListener('hashchange',run);addEventListener('load',run);run();
var a=document.getElementById('app');if(window.MutationObserver){if(a)new MutationObserver(soon).observe(a,{childList:true,subtree:true});new MutationObserver(soon).observe(document.head,{childList:true,subtree:true,characterData:true})}
})();
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(l){if(l.ep)return;l.ep=!0;const n=o(l);fetch(l.href,n)}})();let L=Object,c,a=L.getPrototypeOf,N=document,g,i,d,x={isConnected:1},q=1e3,v,k={},z=a(x),B=a(a),E=(e,t,o,r)=>(e??(setTimeout(o,r),new Set)).add(t),H=(e,t,o)=>{let r=i;i=t;try{return e(o)}catch(l){return console.error(l),o}finally{i=r}},b=e=>e.filter(t=>{var o;return(o=t._dom)==null?void 0:o.isConnected}),$=e=>v=E(v,e,()=>{for(let t of v)t._bindings=b(t._bindings),t._listeners=b(t._listeners);v=c},q),w={get val(){return i==null||i.add(this),this._val},get oldVal(){return i==null||i.add(this),this._oldVal},set val(e){let t=this;if(e!==t._val){t._val=e;let o=[...t._listeners=b(t._listeners)];for(let r of o)R(r.f,r.s,r._dom),r._dom=c;t._bindings.length?g=E(g,t,X):t._oldVal=e}}},G=e=>({__proto__:w,_val:e,_oldVal:e,_bindings:[],_listeners:[]}),M=e=>a(e??0)===w,J=e=>M(e)?e.val:e,Q=e=>M(e)?e.oldVal:e,h=(e,t)=>{let o=new Set,r={f:e},l=d;d=[];let n=H(e,o,t);n=(n??N).nodeType?n:new Text(n);for(let s of o)$(s),s._bindings.push(r);for(let s of d)s._dom=n;return d=l,r._dom=n},R=(e,t=G(),o)=>{let r=new Set,l={f:e,s:t};l._dom=o??(d==null?void 0:d.push(l))??x,t.val=H(e,r);for(let n of r)$(n),n._listeners.push(l);return t},D=(e,...t)=>{for(let o of t.flat(1/0)){let r=a(o??0),l=r===w?h(()=>o.val):r===B?h(o):o;l!=c&&e.append(l)}return e},U=e=>(e._isBindingFunc=1,e),I=e=>new Proxy((t,...o)=>{var s;let[r,...l]=a(o[0]??0)===z?o:[{},...o],n=e?N.createElementNS(e,t):N.createElement(t);for(let[_,p]of L.entries(r)){let A=P=>P?L.getOwnPropertyDescriptor(P,_)??A(a(P)):c,C=t+","+_,V=k[C]??(k[C]=((s=A(a(n)))==null?void 0:s.set)??0),O=V?V.bind(n):n.setAttribute.bind(n,_),F=a(p??0);F===w?h(()=>(O(p.val),n)):F===B&&(!_.startsWith("on")||p._isBindingFunc)?h(()=>(O(p()),n)):O(p)}return D(n,...l)},{get:(t,o)=>t.bind(c,o)}),K=(e,t)=>t?t!==e&&e.replaceWith(t):e.remove(),X=()=>{let e=[...g].filter(t=>t._val!==t._oldVal);g=c;for(let t of new Set(e.flatMap(o=>o._bindings=b(o._bindings))))K(t._dom,h(t.f,t._dom)),t._dom=c;for(let t of e)t._oldVal=t._val},Y=(e,t)=>K(e,h(t,e));const u={add:D,_:U,tags:I(),tagsNS:I,state:G,val:J,oldVal:Q,derive:R,hydrate:Y},{div:Z}=u.tags,W=()=>{const e=location.hash.split("/");return{name:e[1]??"home",args:e.slice(2)}},m=u.state(W());window.addEventListener("hashchange",()=>{m.val=W()});const T=(e,...t)=>{let o=!0;return u.derive(()=>{m.val.name==e.name&&(o&&e.onFirst&&(e.onFirst(m.val),o=!1),e.onLoad&&e.onLoad(m.val))}),Z({hidden:()=>e.name!=m.val.name},t)},y=(e="home",t=[])=>{t.length==0?e=="home"?(location.hash="",history.replaceState(null,"","/")):location.hash=`/${e}`:location.hash=`/${e}/${t.join("/")}`},{button:f,div:j,h2:S,input:ee,p:te}=u.tags,oe=()=>{const e=u.state(0);return T({name:"home"},S("Home"),j({style:"margin-bottom: 20px;"},f({onclick(){y("about")}},"Go To About")),j(f({onclick(){e.val--}},"-"),ee({style:"width: 100px;",value:e,oninput(t){const o=t.target;e.val=parseInt(o.value)}}),f({onclick(){e.val++}},"+"),f({onclick(){y("showNum",[e.val])}},"Show Num")))},ne=()=>T({name:"about"},S("About"),te("This is a great site!"),f({onclick(){y("home")}},"Back To Home")),le=()=>{const e=u.state(0);return T({name:"showNum",onLoad(t){e.val=parseInt(t.args[0])}},S("Show Num"),S({style:"color: red;"},e),f({onclick(){y("home")}},"Back To Home"))};u.add(document.body,oe(),ne(),le());
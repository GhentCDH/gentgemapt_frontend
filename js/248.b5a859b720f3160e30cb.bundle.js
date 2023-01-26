"use strict";(self.webpackChunkwebpack_boilerplate=self.webpackChunkwebpack_boilerplate||[]).push([[248],{72248:function(e,t,n){n.r(t),n.d(t,{default:function(){return J}});var r=n(48035),o=n(49089),a=n(87285),i=n(40962),c=n(35466),s=n(31808),l=n(87036),u=n.n(l),f=n(27314),p=n(27358),d=n(37184),h=n(32354),y=n(63123),v=n(17253),g=n(29383),m=(0,n(84376).Z)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person"),b=c.forwardRef((function(e,t){var n,r=e.alt,o=e.children,a=e.classes,i=e.className,s=e.component,l=void 0===s?"div":s,u=e.imgProps,f=e.sizes,p=e.src,d=e.srcSet,h=e.variant,b=void 0===h?"circular":h,w=(0,v.Z)(e,["alt","children","classes","className","component","imgProps","sizes","src","srcSet","variant"]),O=function(e){var t=e.src,n=e.srcSet,r=c.useState(!1),o=r[0],a=r[1];return c.useEffect((function(){if(t||n){a(!1);var e=!0,r=new Image;return r.src=t,r.srcSet=n,r.onload=function(){e&&a("loaded")},r.onerror=function(){e&&a("error")},function(){e=!1}}}),[t,n]),o}({src:p,srcSet:d}),C=p||d,j=C&&"error"!==O;return n=j?c.createElement("img",(0,y.Z)({alt:r,src:p,srcSet:d,sizes:f,className:a.img},u)):null!=o?o:C&&r?r[0]:c.createElement(m,{className:a.fallback}),c.createElement(l,(0,y.Z)({className:(0,g.default)(a.root,a.system,a[b],i,!j&&a.colorDefault),ref:t},w),n)})),w=(0,a.Z)((function(e){return{root:{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,width:40,height:40,fontFamily:e.typography.fontFamily,fontSize:e.typography.pxToRem(20),lineHeight:1,borderRadius:"50%",overflow:"hidden",userSelect:"none"},colorDefault:{color:e.palette.background.default,backgroundColor:"light"===e.palette.type?e.palette.grey[400]:e.palette.grey[600]},circle:{},circular:{},rounded:{borderRadius:e.shape.borderRadius},square:{borderRadius:0},img:{width:"100%",height:"100%",textAlign:"center",objectFit:"cover",color:"transparent",textIndent:1e4},fallback:{width:"75%",height:"75%"}}}),{name:"MuiAvatar"})(b),O=n(94778),C=n(77754),j=n(15418),k=n(92703),x=n.n(k),E=(n(70950),n(11754)),I=n(40),P=n(68608);function S(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function A(e,t){return A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},A(e,t)}function R(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return _(e)}function _(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Z(e){return Z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},Z(e)}var N=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(i,e);var t,n,r,o,a=(r=i,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=Z(r);if(o){var n=Z(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return R(this,e)});function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=a.call(this,e)).state={requestedAnnotations:!1},t.handleSelect=t.handleSelect.bind(_(t)),t.handleKey=t.handleKey.bind(_(t)),t.handleIntersection=t.handleIntersection.bind(_(t)),t}return t=i,n=[{key:"handleSelect",value:function(){var e=this.props,t=e.canvas,n=e.selected,r=e.setCanvas,o=e.focusOnCanvas;n?o():r(t.id)}},{key:"handleKey",value:function(e){var t=this.props,n=t.canvas,r=t.setCanvas,o=t.focusOnCanvas;this.keys={enter:"Enter",space:" "},this.chars={enter:13,space:32},e.key===this.keys.enter||e.which===this.chars.enter||e.key===this.keys.space||e.which===this.chars.space?o():r(n.id)}},{key:"handleIntersection",value:function(e){var t=e.isIntersecting,n=this.props,r=n.annotationsCount,o=n.requestCanvasAnnotations,a=this.state.requestedAnnotations;!t||void 0===r||r>0||a||(this.setState({requestedAnnotations:!0}),o())}},{key:"render",value:function(){var e=this.props,t=e.annotationsCount,n=e.searchAnnotationsCount,r=e.canvas,o=e.classes,a=e.config,i=e.selected,s=new I.Z(r);return c.createElement(E.ZP,{onChange:this.handleIntersection},c.createElement("div",{key:r.index,className:x()(o.galleryViewItem,i?o.selected:"",n>0?o.hasAnnotations:""),onClick:this.handleSelect,onKeyUp:this.handleKey,role:"button",tabIndex:0},c.createElement(P.Z,{resource:r,labelled:!0,variant:"outside",maxWidth:a.width,maxHeight:a.height,style:{margin:"0 auto",maxWidth:"".concat(Math.ceil(a.height*s.aspectRatio),"px")}},c.createElement("div",{className:o.chips},n>0&&c.createElement(O.Z,{avatar:c.createElement(w,{className:o.avatar,classes:{circle:o.avatarIcon}},c.createElement(j.Z,{fontSize:"small"})),label:n,className:x()(o.searchChip),size:"small"}),(t||0)>0&&c.createElement(O.Z,{avatar:c.createElement(w,{className:o.avatar,classes:{circle:o.avatarIcon}},c.createElement(C.Z,{className:o.annotationIcon})),label:t,className:x()(o.annotationsChip),size:"small"})))))}}],n&&S(t.prototype,n),i}(c.Component);N.defaultProps={annotationsCount:void 0,config:{height:100,width:null},requestCanvasAnnotations:function(){},searchAnnotationsCount:0,selected:!1};var D=n(12910),q=n(73127),z=n(32518),T=n(26021),$=n(50991);function K(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function B(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?K(Object(n),!0).forEach((function(t){M(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):K(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function M(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var V=(0,r.qC)((0,o.$j)((function(e,t){var n=t.canvas,r=t.windowId,o=(0,D.Pm)(e,{windowId:r}),a=(0,q.kM)(e,{windowId:r}),i=u()(a.map((function(e){return e.resources}))).filter((function(e){return e.targetId===n.id})),c=(0,z.ig)(e,{content:"annotations",windowId:r}).length>0;return{annotationsCount:function(){if(c)return(0,T.A7)(e,{canvasId:n.id}).reduce((function(e,t){return e+t.resources.filter((function(e){return e.targetId===n.id})).length}),0)}(),config:(0,$.iE)(e).galleryView,searchAnnotationsCount:i.length,selected:o&&o.id===n.id}}),(function(e,t){var n=t.canvas,r=(t.id,t.windowId);return{focusOnCanvas:function(){return e(f.cx(r,"single"))},requestCanvasAnnotations:function(){return e(p.pj(r,n.id))},setCanvas:function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return e(d.ji.apply(h,[r].concat(n)))}}})),(0,a.Z)((function(e){return{annotationIcon:{height:"1rem",width:"1rem"},annotationsChip:B({},e.typography.caption),avatar:{backgroundColor:"transparent"},chips:{opacity:.875,position:"absolute",right:0,textAlign:"right",top:0},galleryViewItem:{"&$hasAnnotations":{border:"2px solid ".concat(e.palette.action.selected)},"&$selected,&$selected$hasAnnotations":{border:"2px solid ".concat(e.palette.primary.main)},"&:focus":{outline:"none"},"&:hover":{backgroundColor:e.palette.action.hover},border:"2px solid transparent",cursor:"pointer",display:"inline-block",margin:"".concat(e.spacing(1),"px ").concat(e.spacing(.5),"px"),maxHeight:function(e){return e.config.height+45},minWidth:"60px",overflow:"hidden",padding:e.spacing(.5),position:"relative",width:"min-content"},hasAnnotations:{},searchChip:B(B({},e.typography.caption),{},{"&$selected $avatar":{backgroundColor:e.palette.highlights.primary},marginTop:2}),selected:{}}}))),W=V(N);function F(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function H(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function U(e,t){return U=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},U(e,t)}function X(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function G(e){return G=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},G(e)}var L=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&U(e,t)}(i,e);var t,n,r,o,a=(r=i,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=G(r);if(o){var n=G(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return X(this,e)});function i(){return F(this,i),a.apply(this,arguments)}return t=i,n=[{key:"render",value:function(){var e=this.props,t=e.canvases,n=e.classes,r=e.viewingDirection,o=e.windowId,a="right-to-left"===r?"rtl":"ltr";return c.createElement(s.Z,{component:"section",dir:a,square:!0,elevation:0,className:n.galleryContainer,id:"".concat(o,"-gallery")},t.map((function(e){return c.createElement(W,{key:e.id,windowId:o,canvas:e})})))}}],n&&H(t.prototype,n),i}(c.Component);L.defaultProps={classes:{},viewingDirection:""};var Y=n(56125),J=(0,r.qC)((0,a.Z)((function(e){return{galleryContainer:{alignItems:"flex-start",display:"flex",flexDirection:"row",flexWrap:"wrap",overflowX:"hidden",overflowY:"scroll",padding:"50px 0 50px 20px",width:"100%"}}})),(0,o.$j)((function(e,t){var n=t.windowId;return{canvases:(0,D.LU)(e,{windowId:n}),viewingDirection:(0,Y.Xf)(e,{windowId:n})}})),(0,i.A)("GalleryView"))(L)}}]);
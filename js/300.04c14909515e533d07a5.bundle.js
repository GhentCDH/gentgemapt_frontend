"use strict";(self.webpackChunkwebpack_boilerplate=self.webpackChunkwebpack_boilerplate||[]).push([[300],{28300:function(e,t,n){n.r(t),n.d(t,{default:function(){return h}});var r=n(49089),o=n(48035),i=n(20966),c=n(87285),u=n(40962),a=n(35466);function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t){return l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},l(e,t)}function p(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function d(e){return d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},d(e)}var y=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(c,e);var t,n,r,o,i=(r=c,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=d(r);if(o){var n=d(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return p(this,e)});function c(){return s(this,c),i.apply(this,arguments)}return t=c,(n=[{key:"render",value:function(){var e=this.props,t=e.captions,n=e.classes,r=e.videoOptions,o=e.videoResources;return a.createElement("div",{className:n.container},a.createElement("video",Object.assign({className:n.video},r),o.map((function(e){return a.createElement(a.Fragment,{key:e.id},a.createElement("source",{src:e.id,type:e.getFormat()}))})),t.map((function(e){return a.createElement(a.Fragment,{key:e.id},a.createElement("track",{src:e.id,label:e.getDefaultLabel(),srcLang:e.getProperty("language")}))}))))}}])&&f(t.prototype,n),c}(a.Component);y.defaultProps={captions:[],videoOptions:{},videoResources:[]};var v=n(12910),b=n(50991),h=(0,o.qC)((0,i.Z)(),(0,c.Z)((function(){return{container:{alignItems:"center",display:"flex",width:"100%"},video:{maxHeight:"100%",width:"100%"}}})),(0,r.$j)((function(e,t){var n=t.windowId;return{captions:(0,v.U$)(e,{windowId:n})||[],videoOptions:(0,b.iE)(e).videoOptions,videoResources:(0,v.e0)(e,{windowId:n})||[]}}),null),(0,u.A)("VideoViewer"))(y)}}]);
"use strict";(self.webpackChunkgent_gemapt=self.webpackChunkgent_gemapt||[]).push([[736],{91736:function(e,t,n){n.r(t),n.d(t,{default:function(){return b}});var r=n(4542),o=n(39700),i=n(14204),u=n(80760),c=n(1528),a=n(68028);function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t){return f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},f(e,t)}function l(e){return l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},l(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(u,e);var t,n,r,o,i=(r=u,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=l(r);if(o){var n=l(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return function(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(this,e)});function u(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),i.apply(this,arguments)}return t=u,(n=[{key:"render",value:function(){var e=this.props,t=e.captions,n=e.classes,r=e.audioOptions,o=e.audioResources;return a.createElement("div",{className:n.container},a.createElement("audio",Object.assign({className:n.audio},r),o.map((function(e){return a.createElement(a.Fragment,{key:e.id},a.createElement("source",{src:e.id,type:e.getFormat()}))})),t.map((function(e){return a.createElement(a.Fragment,{key:e.id},a.createElement("track",{src:e.id,label:e.getDefaultLabel(),srcLang:e.getProperty("language")}))}))))}}])&&s(t.prototype,n),u}(a.Component);p.defaultProps={audioOptions:{},audioResources:[],captions:[]};var d=n(63672),y=n(616),b=(0,o.Jn)((0,i.A)(),(0,u.c)((function(){return{audio:{width:"100%"},container:{alignItems:"center",display:"flex",width:"100%"}}})),(0,r.Ul)((function(e,t){var n=t.windowId;return{audioOptions:(0,d.eE)(e).audioOptions,audioResources:(0,y.ag)(e,{windowId:n})||[],captions:(0,y.MJ)(e,{windowId:n})||[]}}),null),(0,c.A)("AudioViewer"))(p)}}]);
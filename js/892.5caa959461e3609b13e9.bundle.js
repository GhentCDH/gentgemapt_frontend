"use strict";
(self["webpackChunkgent_gemapt"] = self["webpackChunkgent_gemapt"] || []).push([[892],{

/***/ 67892:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ containers_AudioViewer; }
});

// EXTERNAL MODULE: ./node_modules/react-redux/es/index.js + 20 modules
var es = __webpack_require__(49089);
// EXTERNAL MODULE: ./node_modules/redux/es/redux.js + 1 modules
var redux = __webpack_require__(48035);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/withTranslation.js + 2 modules
var withTranslation = __webpack_require__(20966);
// EXTERNAL MODULE: ./node_modules/@material-ui/core/esm/styles/withStyles.js + 6 modules
var withStyles = __webpack_require__(87285);
// EXTERNAL MODULE: ./node_modules/mirador/dist/es/src/extend/withPlugins.js
var withPlugins = __webpack_require__(40962);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(35466);
;// CONCATENATED MODULE: ./node_modules/mirador/dist/es/src/components/AudioViewer.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}


/** */
var AudioViewer = /*#__PURE__*/function (_Component) {
  _inherits(AudioViewer, _Component);
  var _super = _createSuper(AudioViewer);
  function AudioViewer() {
    _classCallCheck(this, AudioViewer);
    return _super.apply(this, arguments);
  }
  _createClass(AudioViewer, [{
    key: "render",
    value: /* eslint-disable jsx-a11y/media-has-caption */

    /** */
    function render() {
      var _this$props = this.props,
        captions = _this$props.captions,
        classes = _this$props.classes,
        audioOptions = _this$props.audioOptions,
        audioResources = _this$props.audioResources;
      return /*#__PURE__*/react.createElement("div", {
        className: classes.container
      }, /*#__PURE__*/react.createElement("audio", Object.assign({
        className: classes.audio
      }, audioOptions), audioResources.map(function (audio) {
        return /*#__PURE__*/react.createElement(react.Fragment, {
          key: audio.id
        }, /*#__PURE__*/react.createElement("source", {
          src: audio.id,
          type: audio.getFormat()
        }));
      }), captions.map(function (caption) {
        return /*#__PURE__*/react.createElement(react.Fragment, {
          key: caption.id
        }, /*#__PURE__*/react.createElement("track", {
          src: caption.id,
          label: caption.getDefaultLabel(),
          srcLang: caption.getProperty('language')
        }));
      })));
    }
    /* eslint-enable jsx-a11y/media-has-caption */
  }]);

  return AudioViewer;
}(react.Component);
AudioViewer.defaultProps = {
  audioOptions: {},
  audioResources: [],
  captions: []
};
// EXTERNAL MODULE: ./node_modules/mirador/dist/es/src/state/selectors/config.js
var config = __webpack_require__(50991);
// EXTERNAL MODULE: ./node_modules/mirador/dist/es/src/state/selectors/canvases.js + 1 modules
var canvases = __webpack_require__(12910);
;// CONCATENATED MODULE: ./node_modules/mirador/dist/es/src/containers/AudioViewer.js







/** */

var mapStateToProps = function mapStateToProps(state, _ref) {
  var windowId = _ref.windowId;
  return {
    audioOptions: (0,config/* getConfig */.iE)(state).audioOptions,
    audioResources: (0,canvases/* getVisibleCanvasAudioResources */.Ul)(state, {
      windowId: windowId
    }) || [],
    captions: (0,canvases/* getVisibleCanvasCaptions */.U$)(state, {
      windowId: windowId
    }) || []
  };
};
/** */

var styles = function styles() {
  return {
    audio: {
      width: '100%'
    },
    container: {
      alignItems: 'center',
      display: 'flex',
      width: '100%'
    }
  };
};
var enhance = (0,redux/* compose */.qC)((0,withTranslation/* withTranslation */.Z)(), (0,withStyles/* default */.Z)(styles), (0,es/* connect */.$j)(mapStateToProps, null), (0,withPlugins/* withPlugins */.A)('AudioViewer'));
/* harmony default export */ var containers_AudioViewer = (enhance(AudioViewer));

/***/ })

}]);
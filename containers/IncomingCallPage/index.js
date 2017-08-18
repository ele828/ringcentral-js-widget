'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Brand = require('ringcentral-integration/modules/Brand');

var _Brand2 = _interopRequireDefault(_Brand);

var _formatNumber = require('ringcentral-integration/lib/formatNumber');

var _formatNumber2 = _interopRequireDefault(_formatNumber);

var _Webphone = require('ringcentral-integration/modules/Webphone');

var _Webphone2 = _interopRequireDefault(_Webphone);

var _Locale = require('ringcentral-integration/modules/Locale');

var _Locale2 = _interopRequireDefault(_Locale);

var _RegionSettings = require('ringcentral-integration/modules/RegionSettings');

var _RegionSettings2 = _interopRequireDefault(_RegionSettings);

var _ForwardingNumber = require('ringcentral-integration/modules/ForwardingNumber');

var _ForwardingNumber2 = _interopRequireDefault(_ForwardingNumber);

var _callDirections = require('ringcentral-integration/enums/callDirections');

var _callDirections2 = _interopRequireDefault(_callDirections);

var _IncomingCallPanel = require('../../components/IncomingCallPanel');

var _IncomingCallPanel2 = _interopRequireDefault(_IncomingCallPanel);

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IncomingCallPage = function (_Component) {
  (0, _inherits3.default)(IncomingCallPage, _Component);

  function IncomingCallPage(props) {
    (0, _classCallCheck3.default)(this, IncomingCallPage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (IncomingCallPage.__proto__ || (0, _getPrototypeOf2.default)(IncomingCallPage)).call(this, props));

    _this.state = {
      selectedMatcherIndex: 0,
      avatarUrl: null
    };

    _this.onSelectMatcherName = function (option) {
      var nameMatches = _this.props.nameMatches || [];
      var selectedMatcherIndex = nameMatches.findIndex(function (match) {
        return match.id === option.id;
      });
      if (selectedMatcherIndex < 0) {
        selectedMatcherIndex = 0;
      }
      _this.setState({
        selectedMatcherIndex: selectedMatcherIndex,
        avatarUrl: null
      });
      var contact = nameMatches[selectedMatcherIndex];
      if (contact) {
        _this.props.updateSessionMatchedContact(_this.props.session.id, contact);
        _this.props.getAvatarUrl(contact).then(function (avatarUrl) {
          _this.setState({ avatarUrl: avatarUrl });
        });
      }
    };

    _this.answer = function () {
      return _this.props.answer(_this.props.session.id);
    };
    _this.reject = function () {
      return _this.props.reject(_this.props.session.id);
    };
    _this.toVoiceMail = function () {
      return _this.props.toVoiceMail(_this.props.session.id);
    };
    _this.replyWithMessage = function (message) {
      return _this.props.replyWithMessage(_this.props.session.id, message);
    };
    _this.onForward = function (forwardNumber) {
      return _this.props.onForward(_this.props.session.id, forwardNumber);
    };
    _this.toggleMinimized = function () {
      return _this.props.toggleMinimized(_this.props.session.id);
    };
    return _this;
  }

  (0, _createClass3.default)(IncomingCallPage, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updateAvatarAndMatchIndex(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.session.id !== nextProps.session.id) {
        this._updateAvatarAndMatchIndex(nextProps);
      }
    }
  }, {
    key: '_updateAvatarAndMatchIndex',
    value: function _updateAvatarAndMatchIndex(props) {
      var _this2 = this;

      var selectedMatcherIndex = 0;
      var contact = props.session.contactMatch;
      if (!contact) {
        contact = props.nameMatches && props.nameMatches[0];
      } else {
        selectedMatcherIndex = props.nameMatches.findIndex(function (match) {
          return match.id === contact.id;
        });
      }
      this.setState({
        selectedMatcherIndex: selectedMatcherIndex,
        avatarUrl: null
      });
      if (contact) {
        props.getAvatarUrl(contact).then(function (avatarUrl) {
          _this2.setState({ avatarUrl: avatarUrl });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var session = this.props.session;
      var active = !!session.id;
      if (!active) {
        return null;
      }
      if (session.minimized) {
        return null;
      }
      var phoneNumber = session.direction === _callDirections2.default.outbound ? session.to : session.from;
      var fallbackUserName = void 0;
      if (session.direction === _callDirections2.default.inbound && session.from === 'anonymous') {
        fallbackUserName = _i18n2.default.getString('anonymous', this.props.currentLocale);
      }
      if (!fallbackUserName) {
        fallbackUserName = _i18n2.default.getString('unknown', this.props.currentLocale);
      }
      return _react2.default.createElement(
        _IncomingCallPanel2.default,
        {
          currentLocale: this.props.currentLocale,
          nameMatches: this.props.nameMatches,
          fallBackName: fallbackUserName,
          phoneNumber: phoneNumber,
          answer: this.answer,
          reject: this.reject,
          replyWithMessage: this.replyWithMessage,
          toVoiceMail: this.toVoiceMail,
          formatPhone: this.props.formatPhone,
          areaCode: this.props.areaCode,
          countryCode: this.props.countryCode,
          selectedMatcherIndex: this.state.selectedMatcherIndex,
          onSelectMatcherName: this.onSelectMatcherName,
          avatarUrl: this.state.avatarUrl,
          onBackButtonClick: this.toggleMinimized,
          forwardingNumbers: this.props.forwardingNumbers,
          onForward: this.onForward,
          brand: this.props.brand,
          showContactDisplayPlaceholder: this.props.showContactDisplayPlaceholder
        },
        this.props.children
      );
    }
  }]);
  return IncomingCallPage;
}(_react.Component);

IncomingCallPage.propTypes = {
  session: _propTypes2.default.shape({
    id: _propTypes2.default.string,
    direction: _propTypes2.default.string,
    startTime: _propTypes2.default.number,
    isOnMute: _propTypes2.default.bool,
    isOnHold: _propTypes2.default.bool,
    isOnRecord: _propTypes2.default.bool,
    to: _propTypes2.default.string,
    from: _propTypes2.default.string,
    contactMatch: _propTypes2.default.object
  }).isRequired,
  currentLocale: _propTypes2.default.string.isRequired,
  toggleMinimized: _propTypes2.default.func.isRequired,
  answer: _propTypes2.default.func.isRequired,
  reject: _propTypes2.default.func.isRequired,
  toVoiceMail: _propTypes2.default.func.isRequired,
  replyWithMessage: _propTypes2.default.func.isRequired,
  formatPhone: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node,
  nameMatches: _propTypes2.default.array.isRequired,
  areaCode: _propTypes2.default.string.isRequired,
  countryCode: _propTypes2.default.string.isRequired,
  getAvatarUrl: _propTypes2.default.func.isRequired,
  forwardingNumbers: _propTypes2.default.array.isRequired,
  onForward: _propTypes2.default.func.isRequired,
  updateSessionMatchedContact: _propTypes2.default.func.isRequired,
  showContactDisplayPlaceholder: _propTypes2.default.bool.isRequired,
  brand: _propTypes2.default.string.isRequired
};

IncomingCallPage.defaultProps = {
  children: undefined
};

function mapToProps(_, _ref) {
  var webphone = _ref.webphone,
      locale = _ref.locale,
      contactMatcher = _ref.contactMatcher,
      regionSettings = _ref.regionSettings,
      forwardingNumber = _ref.forwardingNumber,
      brand = _ref.brand,
      showContactDisplayPlaceholder = _ref.showContactDisplayPlaceholder;

  var currentSession = webphone.ringSession || {};
  var contactMapping = contactMatcher && contactMatcher.dataMapping;
  var fromMatches = contactMapping && contactMapping[currentSession.from] || [];
  var toMatches = contactMapping && contactMapping[currentSession.to] || [];
  var nameMatches = currentSession.direction === _callDirections2.default.outbound ? toMatches : fromMatches;
  return {
    brand: brand.fullName,
    nameMatches: nameMatches,
    currentLocale: locale.currentLocale,
    session: currentSession,
    areaCode: regionSettings.areaCode,
    countryCode: regionSettings.countryCode,
    forwardingNumbers: forwardingNumber.forwardingNumbers,
    showContactDisplayPlaceholder: showContactDisplayPlaceholder
  };
}

function mapToFunctions(_, _ref2) {
  var webphone = _ref2.webphone,
      regionSettings = _ref2.regionSettings,
      getAvatarUrl = _ref2.getAvatarUrl;

  return {
    formatPhone: function formatPhone(phoneNumber) {
      return (0, _formatNumber2.default)({
        phoneNumber: phoneNumber,
        areaCode: regionSettings.areaCode,
        countryCode: regionSettings.countryCode
      });
    },
    answer: function answer(sessionId) {
      return webphone.answer(sessionId);
    },
    reject: function reject(sessionId) {
      return webphone.reject(sessionId);
    },
    toVoiceMail: function toVoiceMail(sessionId) {
      return webphone.toVoiceMail(sessionId);
    },
    onForward: function onForward(sessionId, forwardNumber) {
      return webphone.forward(sessionId, forwardNumber);
    },
    replyWithMessage: function replyWithMessage(sessionId, message) {
      return webphone.replyWithMessage(sessionId, message);
    },
    toggleMinimized: function toggleMinimized(sessionId) {
      return webphone.toggleMinimized(sessionId);
    },
    updateSessionMatchedContact: function updateSessionMatchedContact(sessionId, contact) {
      return webphone.updateSessionMatchedContact(sessionId, contact);
    },
    getAvatarUrl: getAvatarUrl
  };
}

var IncomingCallContainer = (0, _reactRedux.connect)(mapToProps, mapToFunctions)(IncomingCallPage);

IncomingCallContainer.propTypes = {
  showContactDisplayPlaceholder: _propTypes2.default.bool,
  webphone: _propTypes2.default.instanceOf(_Webphone2.default).isRequired,
  locale: _propTypes2.default.instanceOf(_Locale2.default).isRequired,
  brand: _propTypes2.default.instanceOf(_Brand2.default).isRequired,
  regionSettings: _propTypes2.default.instanceOf(_RegionSettings2.default).isRequired,
  forwardingNumber: _propTypes2.default.instanceOf(_ForwardingNumber2.default).isRequired,
  getAvatarUrl: _propTypes2.default.func,
  children: _propTypes2.default.node
};

IncomingCallContainer.defaultProps = {
  getAvatarUrl: function getAvatarUrl() {
    return null;
  },
  showContactDisplayPlaceholder: false,
  children: undefined
};

exports.default = IncomingCallContainer;
//# sourceMappingURL=index.js.map

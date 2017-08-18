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

var _formatNumber = require('ringcentral-integration/lib/formatNumber');

var _formatNumber2 = _interopRequireDefault(_formatNumber);

var _Webphone = require('ringcentral-integration/modules/Webphone');

var _Webphone2 = _interopRequireDefault(_Webphone);

var _Brand = require('ringcentral-integration/modules/Brand');

var _Brand2 = _interopRequireDefault(_Brand);

var _Locale = require('ringcentral-integration/modules/Locale');

var _Locale2 = _interopRequireDefault(_Locale);

var _RegionSettings = require('ringcentral-integration/modules/RegionSettings');

var _RegionSettings2 = _interopRequireDefault(_RegionSettings);

var _callDirections = require('ringcentral-integration/enums/callDirections');

var _callDirections2 = _interopRequireDefault(_callDirections);

var _ForwardingNumber = require('ringcentral-integration/modules/ForwardingNumber');

var _ForwardingNumber2 = _interopRequireDefault(_ForwardingNumber);

var _CallCtrlPanel = require('../../components/CallCtrlPanel');

var _CallCtrlPanel2 = _interopRequireDefault(_CallCtrlPanel);

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CallCtrlPage = function (_Component) {
  (0, _inherits3.default)(CallCtrlPage, _Component);

  function CallCtrlPage(props) {
    (0, _classCallCheck3.default)(this, CallCtrlPage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CallCtrlPage.__proto__ || (0, _getPrototypeOf2.default)(CallCtrlPage)).call(this, props));

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

    _this.onMute = function () {
      return _this.props.onMute(_this.props.session.id);
    };
    _this.onUnmute = function () {
      return _this.props.onUnmute(_this.props.session.id);
    };
    _this.onHold = function () {
      return _this.props.onHold(_this.props.session.id);
    };
    _this.onUnhold = function () {
      return _this.props.onUnhold(_this.props.session.id);
    };
    _this.onRecord = function () {
      return _this.props.onRecord(_this.props.session.id);
    };
    _this.onStopRecord = function () {
      return _this.props.onStopRecord(_this.props.session.id);
    };
    _this.hangup = function () {
      return _this.props.hangup(_this.props.session.id);
    };
    _this.onKeyPadChange = function (value) {
      return _this.props.sendDTMF(value, _this.props.session.id);
    };
    _this.flip = function (value) {
      return _this.props.flip(value, _this.props.session.id);
    };
    _this.transfer = function (value) {
      return _this.props.transfer(value, _this.props.session.id);
    };
    return _this;
  }

  (0, _createClass3.default)(CallCtrlPage, [{
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

      var contact = props.session.contactMatch;
      var selectedMatcherIndex = 0;
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
      console.log('re-render');
      var session = this.props.session;
      if (!session.id) {
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
      // The label of back button is customizable
      // the property `backButtonLabel` should be internationalizational
      var backButtonLabel = this.props.backButtonLabel ? this.props.backButtonLabel : _i18n2.default.getString('activeCalls', this.props.currentLocale);
      return _react2.default.createElement(
        _CallCtrlPanel2.default,
        {
          backButtonLabel: backButtonLabel,
          currentLocale: this.props.currentLocale,
          formatPhone: this.props.formatPhone,
          phoneNumber: phoneNumber,
          sessionId: session.id,
          callStatus: session.callStatus,
          startTime: session.startTime,
          isOnMute: session.isOnMute,
          isOnHold: session.isOnHold,
          isOnFlip: session.isOnFlip,
          isOnTransfer: session.isOnTransfer,
          recordStatus: session.recordStatus,
          onBackButtonClick: this.props.onBackButtonClick,
          onMute: this.onMute,
          onUnmute: this.onUnmute,
          onHold: this.onHold,
          onUnhold: this.onUnhold,
          onRecord: this.onRecord,
          onStopRecord: this.onStopRecord,
          onKeyPadChange: this.onKeyPadChange,
          hangup: this.hangup,
          onAdd: this.props.onAdd,
          flip: this.flip,
          transfer: this.transfer,
          nameMatches: this.props.nameMatches,
          fallBackName: fallbackUserName,
          areaCode: this.props.areaCode,
          countryCode: this.props.countryCode,
          selectedMatcherIndex: this.state.selectedMatcherIndex,
          onSelectMatcherName: this.onSelectMatcherName,
          avatarUrl: this.state.avatarUrl,
          brand: this.props.brand,
          showContactDisplayPlaceholder: this.props.showContactDisplayPlaceholder,
          flipNumbers: this.props.flipNumbers
        },
        this.props.children
      );
    }
  }]);
  return CallCtrlPage;
}(_react.Component);

CallCtrlPage.propTypes = {
  session: _propTypes2.default.shape({
    id: _propTypes2.default.string,
    direction: _propTypes2.default.string,
    startTime: _propTypes2.default.number,
    isOnMute: _propTypes2.default.bool,
    isOnHold: _propTypes2.default.bool,
    isOnFlip: _propTypes2.default.bool,
    isOnTransfer: _propTypes2.default.bool,
    recordStatus: _propTypes2.default.string,
    to: _propTypes2.default.string,
    from: _propTypes2.default.string,
    contactMatch: _propTypes2.default.object
  }).isRequired,
  currentLocale: _propTypes2.default.string.isRequired,
  onMute: _propTypes2.default.func.isRequired,
  onUnmute: _propTypes2.default.func.isRequired,
  onHold: _propTypes2.default.func.isRequired,
  onUnhold: _propTypes2.default.func.isRequired,
  onRecord: _propTypes2.default.func.isRequired,
  onStopRecord: _propTypes2.default.func.isRequired,
  hangup: _propTypes2.default.func.isRequired,
  sendDTMF: _propTypes2.default.func.isRequired,
  formatPhone: _propTypes2.default.func.isRequired,
  onAdd: _propTypes2.default.func.isRequired,
  flip: _propTypes2.default.func.isRequired,
  transfer: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node,
  nameMatches: _propTypes2.default.array.isRequired,
  areaCode: _propTypes2.default.string.isRequired,
  countryCode: _propTypes2.default.string.isRequired,
  getAvatarUrl: _propTypes2.default.func.isRequired,
  onBackButtonClick: _propTypes2.default.func.isRequired,
  updateSessionMatchedContact: _propTypes2.default.func.isRequired,
  backButtonLabel: _propTypes2.default.string,
  brand: _propTypes2.default.string.isRequired,
  showContactDisplayPlaceholder: _propTypes2.default.bool.isRequired,
  flipNumbers: _propTypes2.default.array.isRequired
};

CallCtrlPage.defaultProps = {
  children: undefined,
  backButtonLabel: null
};

function mapToProps(_, _ref) {
  var webphone = _ref.webphone,
      locale = _ref.locale,
      contactMatcher = _ref.contactMatcher,
      regionSettings = _ref.regionSettings,
      brand = _ref.brand,
      forwardingNumber = _ref.forwardingNumber;

  var currentSession = webphone.activeSession || {};
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
    flipNumbers: forwardingNumber.flipNumbers
  };
}

var _onAdd = null;
function mapToFunctions(_, _ref2) {
  var webphone = _ref2.webphone,
      regionSettings = _ref2.regionSettings,
      getAvatarUrl = _ref2.getAvatarUrl,
      onBackButtonClick = _ref2.onBackButtonClick,
      onAdd = _ref2.onAdd;

  if (!_onAdd) _onAdd = onAdd;
  if (_onAdd) console.log('onAdd', _onAdd === onAdd);
  return {
    formatPhone: function formatPhone(phoneNumber) {
      return (0, _formatNumber2.default)({
        phoneNumber: phoneNumber,
        areaCode: regionSettings.areaCode,
        countryCode: regionSettings.countryCode
      });
    },
    hangup: function hangup(sessionId) {
      return webphone.hangup(sessionId);
    },
    onMute: function onMute(sessionId) {
      return webphone.mute(sessionId);
    },
    onUnmute: function onUnmute(sessionId) {
      return webphone.unmute(sessionId);
    },
    onHold: function onHold(sessionId) {
      return webphone.hold(sessionId);
    },
    onUnhold: function onUnhold(sessionId) {
      return webphone.unhold(sessionId);
    },
    onRecord: function onRecord(sessionId) {
      return webphone.startRecord(sessionId);
    },
    onStopRecord: function onStopRecord(sessionId) {
      return webphone.stopRecord(sessionId);
    },
    sendDTMF: function sendDTMF(value, sessionId) {
      return webphone.sendDTMF(value, sessionId);
    },
    updateSessionMatchedContact: function updateSessionMatchedContact(sessionId, contact) {
      return webphone.updateSessionMatchedContact(sessionId, contact);
    },
    getAvatarUrl: getAvatarUrl,
    onBackButtonClick: onBackButtonClick,
    onAdd: onAdd,
    flip: function flip(flipNumber, sessionId) {
      return webphone.flip(flipNumber, sessionId);
    },
    transfer: function transfer(transferNumber, sessionId) {
      return webphone.transfer(transferNumber, sessionId);
    }
  };
}

var CallCtrlContainer = (0, _reactRedux.connect)(mapToProps, mapToFunctions)(CallCtrlPage);

CallCtrlContainer.propTypes = {
  webphone: _propTypes2.default.instanceOf(_Webphone2.default).isRequired,
  locale: _propTypes2.default.instanceOf(_Locale2.default).isRequired,
  brand: _propTypes2.default.instanceOf(_Brand2.default).isRequired,
  regionSettings: _propTypes2.default.instanceOf(_RegionSettings2.default).isRequired,
  forwardingNumber: _propTypes2.default.instanceOf(_ForwardingNumber2.default).isRequired,
  getAvatarUrl: _propTypes2.default.func,
  onBackButtonClick: _propTypes2.default.func.isRequired,
  onAdd: _propTypes2.default.func.isRequired,
  backButtonLabel: _propTypes2.default.string,
  children: _propTypes2.default.node,
  showContactDisplayPlaceholder: _propTypes2.default.bool
};

CallCtrlContainer.defaultProps = {
  getAvatarUrl: function getAvatarUrl() {
    return null;
  },
  showContactDisplayPlaceholder: false,
  children: undefined
};

exports.default = CallCtrlContainer;
//# sourceMappingURL=index.js.map

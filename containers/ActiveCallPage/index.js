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

var _Locale = require('ringcentral-integration/modules/Locale');

var _Locale2 = _interopRequireDefault(_Locale);

var _RegionSettings = require('ringcentral-integration/modules/RegionSettings');

var _RegionSettings2 = _interopRequireDefault(_RegionSettings);

var _ForwardingNumber = require('ringcentral-integration/modules/ForwardingNumber');

var _ForwardingNumber2 = _interopRequireDefault(_ForwardingNumber);

var _callDirections = require('ringcentral-integration/enums/callDirections');

var _callDirections2 = _interopRequireDefault(_callDirections);

var _sessionStatus = require('ringcentral-integration/modules/Webphone/sessionStatus');

var _sessionStatus2 = _interopRequireDefault(_sessionStatus);

var _ActiveCallPanel = require('../../components/ActiveCallPanel');

var _ActiveCallPanel2 = _interopRequireDefault(_ActiveCallPanel);

var _IncomingCallPanel = require('../../components/IncomingCallPanel');

var _IncomingCallPanel2 = _interopRequireDefault(_IncomingCallPanel);

var _ActiveCallBadge = require('../../components/ActiveCallBadge');

var _ActiveCallBadge2 = _interopRequireDefault(_ActiveCallBadge);

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActiveCallPage = function (_Component) {
  (0, _inherits3.default)(ActiveCallPage, _Component);

  function ActiveCallPage(props) {
    (0, _classCallCheck3.default)(this, ActiveCallPage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ActiveCallPage.__proto__ || (0, _getPrototypeOf2.default)(ActiveCallPage)).call(this, props));

    _this.state = {
      badgeOffsetX: 0,
      badgeOffsetY: 0,
      selectedMatcherIndex: 0,
      avatarUrl: null
    };

    _this.onSelectMatcherName = function (_, index) {
      // `remember last matcher contact` will finish in next ticket
      _this.setState({
        selectedMatcherIndex: index - 1,
        avatarUrl: null
      });
      var nameMatches = _this.props.session.direction === _callDirections2.default.outbound ? _this.props.toMatches : _this.props.fromMatches;
      var contact = nameMatches && nameMatches[index - 1];
      if (contact) {
        _this.props.getAvatarUrl(contact).then(function (avatarUrl) {
          _this.setState({ avatarUrl: avatarUrl });
        });
      }
    };

    _this.updatePositionOffset = function (x, y) {
      _this.setState({
        badgeOffsetX: x,
        badgeOffsetY: y
      });
    };

    _this.answer = function () {
      return _this.props.answer(_this.props.session.id);
    };
    _this.reject = function () {
      return _this.props.reject(_this.props.session.id);
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
    _this.toVoiceMail = function () {
      return _this.props.toVoiceMail(_this.props.session.id);
    };
    _this.replyWithMessage = function (message) {
      return _this.props.replyWithMessage(_this.props.session.id, message);
    };
    _this.onForward = function (forwardNumber) {
      return _this.props.onForward(_this.props.session.id, forwardNumber);
    };
    return _this;
  }

  (0, _createClass3.default)(ActiveCallPage, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (this.props.session.id !== nextProps.session.id) {
        this.setState({
          selectedMatcherIndex: 0,
          avatarUrl: null
        });
        var nameMatches = nextProps.session.direction === _callDirections2.default.outbound ? nextProps.toMatches : nextProps.fromMatches;
        var contact = nameMatches && nameMatches[0];
        if (contact) {
          nextProps.getAvatarUrl(contact).then(function (avatarUrl) {
            _this2.setState({ avatarUrl: avatarUrl });
          });
        }
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
      if (this.props.minimized) {
        return _react2.default.createElement(_ActiveCallBadge2.default, {
          onClick: this.props.toggleMinimized,
          offsetX: this.state.badgeOffsetX,
          offsetY: this.state.badgeOffsetY,
          updatePositionOffset: this.updatePositionOffset,
          title: _i18n2.default.getString('activeCall', this.props.currentLocale)
        });
      }
      var isRinging = false;
      if (session.direction === _callDirections2.default.inbound && session.callStatus === _sessionStatus2.default.connecting) {
        isRinging = true;
      }
      // isRinging = true;
      var phoneNumber = session.direction === _callDirections2.default.outbound ? session.to : session.from;
      var nameMatches = session.direction === _callDirections2.default.outbound ? this.props.toMatches : this.props.fromMatches;
      var fallbackUserName = void 0;
      if (session.direction === _callDirections2.default.inbound && session.from === 'anonymous') {
        fallbackUserName = _i18n2.default.getString('anonymous', this.props.currentLocale);
      }
      if (!fallbackUserName) {
        fallbackUserName = _i18n2.default.getString('unknown', this.props.currentLocale);
      }
      if (isRinging) {
        return _react2.default.createElement(
          _IncomingCallPanel2.default,
          {
            currentLocale: this.props.currentLocale,
            nameMatches: nameMatches,
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
            onBackButtonClick: this.props.toggleMinimized,
            forwardingNumbers: this.props.forwardingNumbers,
            onForward: this.onForward
          },
          this.props.children
        );
      }
      return _react2.default.createElement(
        _ActiveCallPanel2.default,
        {
          backButtonLabel: _i18n2.default.getString('activeCalls', this.props.currentLocale),
          currentLocale: this.props.currentLocale,
          formatPhone: this.props.formatPhone,
          phoneNumber: phoneNumber,
          sessionId: session.id,
          callStatus: session.callStatus,
          startTime: session.startTime,
          isOnMute: session.isOnMute,
          isOnHold: session.isOnHold,
          isOnRecord: session.isOnRecord,
          onBackButtonClick: this.props.toggleMinimized,
          onMute: this.onMute,
          onUnmute: this.onUnmute,
          onHold: this.onHold,
          onUnhold: this.onUnhold,
          onRecord: this.onRecord,
          onStopRecord: this.onStopRecord,
          onKeyPadChange: this.onKeyPadChange,
          hangup: this.hangup,
          onAdd: this.props.onAdd,
          nameMatches: nameMatches,
          fallBackName: fallbackUserName,
          areaCode: this.props.areaCode,
          countryCode: this.props.countryCode,
          selectedMatcherIndex: this.state.selectedMatcherIndex,
          onSelectMatcherName: this.onSelectMatcherName,
          avatarUrl: this.state.avatarUrl
        },
        this.props.children
      );
    }
  }]);
  return ActiveCallPage;
}(_react.Component);

ActiveCallPage.propTypes = {
  session: _propTypes2.default.shape({
    id: _propTypes2.default.string,
    direction: _propTypes2.default.string,
    startTime: _propTypes2.default.number,
    isOnMute: _propTypes2.default.bool,
    isOnHold: _propTypes2.default.bool,
    isOnRecord: _propTypes2.default.bool,
    to: _propTypes2.default.string,
    from: _propTypes2.default.string
  }).isRequired,
  currentLocale: _propTypes2.default.string.isRequired,
  minimized: _propTypes2.default.bool.isRequired,
  toggleMinimized: _propTypes2.default.func.isRequired,
  onMute: _propTypes2.default.func.isRequired,
  onUnmute: _propTypes2.default.func.isRequired,
  onHold: _propTypes2.default.func.isRequired,
  onUnhold: _propTypes2.default.func.isRequired,
  onRecord: _propTypes2.default.func.isRequired,
  onStopRecord: _propTypes2.default.func.isRequired,
  hangup: _propTypes2.default.func.isRequired,
  answer: _propTypes2.default.func.isRequired,
  reject: _propTypes2.default.func.isRequired,
  sendDTMF: _propTypes2.default.func.isRequired,
  toVoiceMail: _propTypes2.default.func.isRequired,
  replyWithMessage: _propTypes2.default.func.isRequired,
  formatPhone: _propTypes2.default.func.isRequired,
  onAdd: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node,
  toMatches: _propTypes2.default.array.isRequired,
  fromMatches: _propTypes2.default.array.isRequired,
  areaCode: _propTypes2.default.string.isRequired,
  countryCode: _propTypes2.default.string.isRequired,
  getAvatarUrl: _propTypes2.default.func.isRequired,
  forwardingNumbers: _propTypes2.default.array.isRequired,
  onForward: _propTypes2.default.func.isRequired
};

ActiveCallPage.defaultProps = {
  children: undefined
};

function mapToProps(_, _ref) {
  var webphone = _ref.webphone,
      locale = _ref.locale,
      contactMatcher = _ref.contactMatcher,
      regionSettings = _ref.regionSettings,
      forwardingNumber = _ref.forwardingNumber;

  var currentSession = webphone.currentSession || {};
  var contactMapping = contactMatcher && contactMatcher.dataMapping;
  return {
    fromMatches: contactMapping && contactMapping[currentSession.from] || [],
    toMatches: contactMapping && contactMapping[currentSession.to] || [],
    currentLocale: locale.currentLocale,
    session: currentSession,
    minimized: webphone.minimized,
    areaCode: regionSettings.areaCode,
    countryCode: regionSettings.countryCode,
    forwardingNumbers: forwardingNumber.forwardingNumbers
  };
}

function mapToFunctions(_, _ref2) {
  var webphone = _ref2.webphone,
      regionSettings = _ref2.regionSettings,
      router = _ref2.router,
      getAvatarUrl = _ref2.getAvatarUrl;

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
    answer: function answer(sessionId) {
      return webphone.answer(sessionId);
    },
    reject: function reject(sessionId) {
      return webphone.reject(sessionId);
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
    onAdd: function onAdd() {
      router.push('/dialer');
      webphone.toggleMinimized();
    },
    sendDTMF: function sendDTMF(value, sessionId) {
      return webphone.sendDTMF(value, sessionId);
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
    toggleMinimized: function toggleMinimized() {
      return webphone.toggleMinimized();
    },
    getAvatarUrl: getAvatarUrl
  };
}

var ActiveCallContainer = (0, _reactRedux.connect)(mapToProps, mapToFunctions)(ActiveCallPage);

ActiveCallContainer.propTypes = {
  webphone: _propTypes2.default.instanceOf(_Webphone2.default).isRequired,
  locale: _propTypes2.default.instanceOf(_Locale2.default).isRequired,
  regionSettings: _propTypes2.default.instanceOf(_RegionSettings2.default).isRequired,
  forwardingNumber: _propTypes2.default.instanceOf(_ForwardingNumber2.default).isRequired,
  getAvatarUrl: _propTypes2.default.func
};

ActiveCallContainer.defaultProps = {
  getAvatarUrl: function getAvatarUrl() {
    return null;
  }
};

exports.default = ActiveCallContainer;
//# sourceMappingURL=index.js.map

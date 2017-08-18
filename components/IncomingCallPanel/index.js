'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IncomingCallPanel;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _IncomingCallPad = require('../IncomingCallPad');

var _IncomingCallPad2 = _interopRequireDefault(_IncomingCallPad);

var _ContactDisplay = require('../ContactDisplay');

var _ContactDisplay2 = _interopRequireDefault(_ContactDisplay);

var _DynamicsFont = require('../../assets/DynamicsFont/DynamicsFont.scss');

var _DynamicsFont2 = _interopRequireDefault(_DynamicsFont);

var _styles = require('./styles.scss');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UserInfo(props) {
  var avatar = void 0;
  if (props.avatarUrl) {
    avatar = _react2.default.createElement('img', { src: props.avatarUrl, alt: 'avatar' });
  } else {
    avatar = _react2.default.createElement('i', { className: (0, _classnames2.default)(_DynamicsFont2.default.portrait, _styles2.default.icon) });
  }
  return _react2.default.createElement(
    'div',
    { className: _styles2.default.userInfo },
    _react2.default.createElement(
      'div',
      { className: _styles2.default.avatarContainer },
      _react2.default.createElement(
        'div',
        { className: _styles2.default.avatarHolder },
        _react2.default.createElement('div', { className: (0, _classnames2.default)(_styles2.default.ringOutside, _styles2.default.ringing) }),
        _react2.default.createElement('div', { className: (0, _classnames2.default)(_styles2.default.ringInner, _styles2.default.ringing) }),
        _react2.default.createElement(
          'div',
          { className: _styles2.default.avatar },
          avatar
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { className: _styles2.default.userNameContainer },
      _react2.default.createElement(_ContactDisplay2.default, {
        className: _styles2.default.userName,
        contactMatches: props.nameMatches,
        phoneNumber: props.phoneNumber,
        fallBackName: props.fallBackName,
        currentLocale: props.currentLocale,
        areaCode: props.areaCode,
        countryCode: props.countryCode,
        showType: false,
        disabled: false,
        selected: props.selectedMatcherIndex,
        onSelectContact: props.onSelectMatcherName,
        isLogging: false,
        enableContactFallback: true,
        brand: props.brand,
        showPlaceholder: props.showContactDisplayPlaceholder
      })
    ),
    _react2.default.createElement(
      'div',
      { className: _styles2.default.userPhoneNumber },
      props.formatPhone(props.phoneNumber)
    )
  );
}

UserInfo.propTypes = {
  phoneNumber: _propTypes2.default.string,
  currentLocale: _propTypes2.default.string.isRequired,
  formatPhone: _propTypes2.default.func.isRequired,
  nameMatches: _propTypes2.default.array.isRequired,
  fallBackName: _propTypes2.default.string.isRequired,
  areaCode: _propTypes2.default.string.isRequired,
  countryCode: _propTypes2.default.string.isRequired,
  selectedMatcherIndex: _propTypes2.default.number.isRequired,
  onSelectMatcherName: _propTypes2.default.func.isRequired,
  avatarUrl: _propTypes2.default.string,
  brand: _propTypes2.default.string,
  showContactDisplayPlaceholder: _propTypes2.default.bool
};

UserInfo.defaultProps = {
  className: null,
  phoneNumber: null,
  avatarUrl: null,
  brand: 'RingCentral',
  showContactDisplayPlaceholder: true
};

function IncomingCallPanel(props) {
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)(_styles2.default.root, props.className) },
    _react2.default.createElement(
      'span',
      { className: _styles2.default.backButton, onClick: props.onBackButtonClick },
      _react2.default.createElement('i', { className: (0, _classnames2.default)(_DynamicsFont2.default.arrow, _styles2.default.backIcon) })
    ),
    _react2.default.createElement(UserInfo, {
      phoneNumber: props.phoneNumber,
      currentLocale: props.currentLocale,
      className: _styles2.default.userInfo,
      formatPhone: props.formatPhone,
      nameMatches: props.nameMatches,
      fallBackName: props.fallBackName,
      areaCode: props.areaCode,
      countryCode: props.countryCode,
      selectedMatcherIndex: props.selectedMatcherIndex,
      onSelectMatcherName: props.onSelectMatcherName,
      avatarUrl: props.avatarUrl,
      brand: props.brand,
      showContactDisplayPlaceholder: props.showContactDisplayPlaceholder
    }),
    _react2.default.createElement(_IncomingCallPad2.default, {
      className: _styles2.default.callPad,
      forwardingNumbers: props.forwardingNumbers,
      formatPhone: props.formatPhone,
      answer: props.answer,
      reject: props.reject,
      toVoiceMail: props.toVoiceMail,
      replyWithMessage: props.replyWithMessage,
      onForward: props.onForward,
      currentLocale: props.currentLocale
    }),
    props.children
  );
}

IncomingCallPanel.propTypes = {
  currentLocale: _propTypes2.default.string.isRequired,
  phoneNumber: _propTypes2.default.string,
  className: _propTypes2.default.string,
  answer: _propTypes2.default.func.isRequired,
  reject: _propTypes2.default.func.isRequired,
  toVoiceMail: _propTypes2.default.func.isRequired,
  replyWithMessage: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node,
  formatPhone: _propTypes2.default.func.isRequired,
  nameMatches: _propTypes2.default.array.isRequired,
  fallBackName: _propTypes2.default.string.isRequired,
  areaCode: _propTypes2.default.string.isRequired,
  countryCode: _propTypes2.default.string.isRequired,
  selectedMatcherIndex: _propTypes2.default.number.isRequired,
  onSelectMatcherName: _propTypes2.default.func.isRequired,
  avatarUrl: _propTypes2.default.string,
  onBackButtonClick: _propTypes2.default.func.isRequired,
  forwardingNumbers: _propTypes2.default.array.isRequired,
  onForward: _propTypes2.default.func.isRequired,
  brand: _propTypes2.default.string,
  showContactDisplayPlaceholder: _propTypes2.default.bool
};

IncomingCallPanel.defaultProps = {
  className: null,
  phoneNumber: null,
  children: undefined,
  avatarUrl: null,
  brand: 'RingCentral',
  showContactDisplayPlaceholder: true
};
//# sourceMappingURL=index.js.map

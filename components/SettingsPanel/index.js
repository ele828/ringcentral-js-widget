'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SettingsPanel;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _DynamicsFont = require('../../assets/DynamicsFont/DynamicsFont.scss');

var _DynamicsFont2 = _interopRequireDefault(_DynamicsFont);

var _Header = require('../Header');

var _Header2 = _interopRequireDefault(_Header);

var _Panel = require('../Panel');

var _Panel2 = _interopRequireDefault(_Panel);

var _Line = require('../Line');

var _Line2 = _interopRequireDefault(_Line);

var _LinkLine = require('../LinkLine');

var _LinkLine2 = _interopRequireDefault(_LinkLine);

var _IconLine = require('../IconLine');

var _IconLine2 = _interopRequireDefault(_IconLine);

var _Eula = require('../Eula');

var _Eula2 = _interopRequireDefault(_Eula);

var _SpinnerOverlay = require('../SpinnerOverlay');

var _SpinnerOverlay2 = _interopRequireDefault(_SpinnerOverlay);

var _PresenceSettingSection = require('../PresenceSettingSection');

var _PresenceSettingSection2 = _interopRequireDefault(_PresenceSettingSection);

var _styles = require('./styles.scss');

var _styles2 = _interopRequireDefault(_styles);

var _Switch = require('../Switch');

var _Switch2 = _interopRequireDefault(_Switch);

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SettingsPanel(_ref) {
  var children = _ref.children,
      className = _ref.className,
      onLogoutButtonClick = _ref.onLogoutButtonClick,
      loginNumber = _ref.loginNumber,
      version = _ref.version,
      currentLocale = _ref.currentLocale,
      brandId = _ref.brandId,
      EulaRenderer = _ref.EulaRenderer,
      onCallingSettingsLinkClick = _ref.onCallingSettingsLinkClick,
      onRegionSettingsLinkClick = _ref.onRegionSettingsLinkClick,
      showAutoLog = _ref.showAutoLog,
      autoLogEnabled = _ref.autoLogEnabled,
      onAutoLogChange = _ref.onAutoLogChange,
      showAutoLogSMS = _ref.showAutoLogSMS,
      autoLogSMSEnabled = _ref.autoLogSMSEnabled,
      onAutoLogSMSChange = _ref.onAutoLogSMSChange,
      showClickToDial = _ref.showClickToDial,
      clickToDialEnabled = _ref.clickToDialEnabled,
      onClickToDialChange = _ref.onClickToDialChange,
      showRegion = _ref.showRegion,
      showHeader = _ref.showHeader,
      ringoutEnabled = _ref.ringoutEnabled,
      outboundSMS = _ref.outboundSMS,
      showSpinner = _ref.showSpinner,
      dndStatus = _ref.dndStatus,
      userStatus = _ref.userStatus,
      setAvailable = _ref.setAvailable,
      setBusy = _ref.setBusy,
      setDoNotDisturb = _ref.setDoNotDisturb,
      setInvisible = _ref.setInvisible,
      toggleAcceptCallQueueCalls = _ref.toggleAcceptCallQueueCalls,
      isCallQueueMember = _ref.isCallQueueMember,
      showPresenceSettings = _ref.showPresenceSettings;

  if (showSpinner) {
    return _react2.default.createElement(_SpinnerOverlay2.default, null);
  }
  var region = showRegion ? _react2.default.createElement(
    _LinkLine2.default,
    {
      onClick: onRegionSettingsLinkClick },
    _i18n2.default.getString('region', currentLocale)
  ) : null;
  var presenceSetting = dndStatus && userStatus ? _react2.default.createElement(_PresenceSettingSection2.default, {
    currentLocale: currentLocale,
    dndStatus: dndStatus,
    userStatus: userStatus,
    isCallQueueMember: isCallQueueMember,
    setAvailable: setAvailable,
    setBusy: setBusy,
    setDoNotDisturb: setDoNotDisturb,
    setInvisible: setInvisible,
    toggleAcceptCallQueueCalls: toggleAcceptCallQueueCalls,
    showPresenceSettings: showPresenceSettings
  }) : null;
  var clickToDialText = void 0;
  if (outboundSMS && ringoutEnabled) {
    clickToDialText = _i18n2.default.getString('clickToDialSMS', currentLocale);
  } else if (!outboundSMS && ringoutEnabled) {
    clickToDialText = _i18n2.default.getString('clickToDial', currentLocale);
  } else if (outboundSMS && !ringoutEnabled) {
    clickToDialText = _i18n2.default.getString('clickToSMS', currentLocale);
  } else {
    clickToDialText = '';
  }
  var clickToDial = showClickToDial && (outboundSMS || ringoutEnabled) ? _react2.default.createElement(
    _IconLine2.default,
    {
      icon: _react2.default.createElement(_Switch2.default, {
        checked: clickToDialEnabled,
        onChange: onClickToDialChange
      })
    },
    clickToDialText
  ) : null;
  var autoLog = showAutoLog ? _react2.default.createElement(
    _IconLine2.default,
    {
      icon: _react2.default.createElement(_Switch2.default, {
        checked: autoLogEnabled,
        onChange: onAutoLogChange
      })
    },
    _i18n2.default.getString('autoLogCalls', currentLocale)
  ) : null;
  var autoLogSMS = showAutoLogSMS ? _react2.default.createElement(
    _IconLine2.default,
    {
      icon: _react2.default.createElement(_Switch2.default, {
        checked: autoLogSMSEnabled,
        onChange: onAutoLogSMSChange
      })
    },
    _i18n2.default.getString('autoLogSMS', currentLocale)
  ) : null;
  var header = showHeader ? _react2.default.createElement(
    _Header2.default,
    null,
    _i18n2.default.getString('settings', currentLocale)
  ) : null;
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)(_styles2.default.root, className) },
    header,
    _react2.default.createElement(
      _Panel2.default,
      {
        className: (0, _classnames2.default)(_styles2.default.content, showHeader && _styles2.default.contentWithHeader) },
      _react2.default.createElement(
        _LinkLine2.default,
        {
          onClick: onCallingSettingsLinkClick },
        _i18n2.default.getString('calling', currentLocale)
      ),
      region,
      presenceSetting,
      children,
      autoLog,
      autoLogSMS,
      clickToDial,
      _react2.default.createElement(
        'section',
        { className: _styles2.default.section },
        _react2.default.createElement(
          _Line2.default,
          null,
          _react2.default.createElement(EulaRenderer, {
            className: _styles2.default.eula,
            currentLocale: currentLocale,
            brandId: brandId })
        )
      ),
      _react2.default.createElement(
        'section',
        { className: _styles2.default.section },
        _react2.default.createElement(
          _IconLine2.default,
          {
            onClick: onLogoutButtonClick,
            icon: _react2.default.createElement('span', { className: _DynamicsFont2.default.logout }) },
          _i18n2.default.getString('logout', currentLocale),
          _react2.default.createElement(
            'span',
            { className: _styles2.default.loginNumber },
            ' ' + loginNumber
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: _styles2.default.versionContainer },
        _i18n2.default.getString('version', currentLocale),
        ' ',
        version
      )
    )
  );
}

SettingsPanel.propTypes = {
  brandId: _propTypes2.default.string.isRequired,
  onCallingSettingsLinkClick: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  currentLocale: _propTypes2.default.string.isRequired,
  EulaRenderer: _propTypes2.default.func,
  loginNumber: _propTypes2.default.string.isRequired,
  onLogoutButtonClick: _propTypes2.default.func.isRequired,
  onRegionSettingsLinkClick: _propTypes2.default.func.isRequired,
  showAutoLog: _propTypes2.default.bool,
  autoLogEnabled: _propTypes2.default.bool,
  onAutoLogChange: _propTypes2.default.func,
  showAutoLogSMS: _propTypes2.default.bool,
  autoLogSMSEnabled: _propTypes2.default.bool,
  onAutoLogSMSChange: _propTypes2.default.func,
  showRegion: _propTypes2.default.bool.isRequired,
  showClickToDial: _propTypes2.default.bool,
  clickToDialEnabled: _propTypes2.default.bool,
  onClickToDialChange: _propTypes2.default.func,
  version: _propTypes2.default.string.isRequired,
  showHeader: _propTypes2.default.bool,
  ringoutEnabled: _propTypes2.default.bool,
  outboundSMS: _propTypes2.default.bool,
  showSpinner: _propTypes2.default.bool,
  dndStatus: _propTypes2.default.string,
  userStatus: _propTypes2.default.string,
  isCallQueueMember: _propTypes2.default.bool,
  setAvailable: _propTypes2.default.func,
  setBusy: _propTypes2.default.func,
  setDoNotDisturb: _propTypes2.default.func,
  setInvisible: _propTypes2.default.func,
  toggleAcceptCallQueueCalls: _propTypes2.default.func,
  showPresenceSettings: _propTypes2.default.bool
};
SettingsPanel.defaultProps = {
  className: null,
  EulaRenderer: _Eula2.default,
  children: null,
  showClickToDial: false,
  clickToDialEnabled: false,
  onClickToDialChange: undefined,
  showAutoLog: false,
  autoLogEnabled: false,
  onAutoLogChange: undefined,
  showAutoLogSMS: false,
  autoLogSMSEnabled: false,
  onAutoLogSMSChange: undefined,
  showHeader: false,
  ringoutEnabled: false,
  outboundSMS: false,
  showSpinner: false,
  dndStatus: undefined,
  userStatus: undefined,
  isCallQueueMember: false,
  setAvailable: function setAvailable() {
    return null;
  },
  setBusy: function setBusy() {
    return null;
  },
  setDoNotDisturb: function setDoNotDisturb() {
    return null;
  },
  setInvisible: function setInvisible() {
    return null;
  },
  toggleAcceptCallQueueCalls: function toggleAcceptCallQueueCalls() {
    return null;
  },
  showPresenceSettings: false
};
//# sourceMappingURL=index.js.map

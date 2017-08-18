'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _callDirections = require('ringcentral-integration/enums/callDirections');

var _callDirections2 = _interopRequireDefault(_callDirections);

var _RecentActivityPanel = require('../../components/RecentActivityPanel');

var _RecentActivityPanel2 = _interopRequireDefault(_RecentActivityPanel);

var _DynamicsFont = require('../../assets/DynamicsFont/DynamicsFont.scss');

var _DynamicsFont2 = _interopRequireDefault(_DynamicsFont);

var _RecentActivityMessages = require('../../components/RecentActivityMessages');

var _RecentActivityMessages2 = _interopRequireDefault(_RecentActivityMessages);

var _RecentActivityCalls = require('../../components/RecentActivityCalls');

var _RecentActivityCalls2 = _interopRequireDefault(_RecentActivityCalls);

var _VoicemailIcon = require('../../assets/images/VoicemailIcon.svg');

var _VoicemailIcon2 = _interopRequireDefault(_VoicemailIcon);

var _Fax = require('../../assets/images/Fax.svg');

var _Fax2 = _interopRequireDefault(_Fax);

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTabs(_ref) {
  var ready = _ref.ready,
      currentLocale = _ref.currentLocale,
      dateTimeFormatter = _ref.dateTimeFormatter,
      navigateTo = _ref.navigateTo,
      recentMessages = _ref.recentMessages,
      recentCalls = _ref.recentCalls,
      currentContact = _ref.currentContact;

  if (!ready) return [];
  var messages = [];
  var calls = [];
  var unreadMessageCounts = 0;
  if (currentContact && currentContact.id) {
    var contactId = currentContact.id;
    if (recentMessages.messages[contactId]) {
      messages = recentMessages.messages[contactId];
    }
    if (recentCalls.calls[contactId]) {
      calls = recentCalls.calls[contactId];
    }
    if (recentMessages.unreadMessageCounts[contactId]) {
      unreadMessageCounts = recentMessages.unreadMessageCounts[contactId];
    }
  }
  return [{
    icon: _react2.default.createElement(_VoicemailIcon2.default, { width: 23, height: 23 }),
    label: _i18n2.default.getString('voicemail', currentLocale),
    path: 'voicemails',
    isActive: function isActive(path) {
      return path === 'voicemails';
    },
    view: null,
    getData: function getData() {},
    cleanUp: function cleanUp() {}
  }, {
    icon: _react2.default.createElement('span', { className: _DynamicsFont2.default.composeText }),
    label: _i18n2.default.getString('text', currentLocale),
    path: 'recentMessages',
    noticeCounts: unreadMessageCounts,
    isActive: function isActive(path) {
      return path === 'recentMessages';
    },
    view: _react2.default.createElement(_RecentActivityMessages2.default, {
      messages: messages,
      navigateTo: navigateTo,
      dateTimeFormatter: dateTimeFormatter,
      currentLocale: currentLocale,
      isMessagesLoaded: recentMessages.isMessagesLoaded
    }),
    getData: function getData() {
      recentMessages.getMessages(currentContact);
    },
    cleanUp: function cleanUp() {
      return recentMessages.cleanUpMessages(currentContact);
    }
  }, {
    icon: _react2.default.createElement(_Fax2.default, { width: 23, height: 23 }),
    label: _i18n2.default.getString('fax', currentLocale),
    path: 'faxes',
    isActive: function isActive(path) {
      return path === 'faxes';
    },
    view: null,
    getData: function getData() {},
    cleanUp: function cleanUp() {}
  }, {
    icon: _react2.default.createElement('span', { className: _DynamicsFont2.default.active }),
    label: _i18n2.default.getString('call', currentLocale),
    path: 'recentCalls',
    isActive: function isActive(path) {
      return path === 'recentCalls';
    },
    view: _react2.default.createElement(_RecentActivityCalls2.default, {
      calls: calls,
      dateTimeFormatter: dateTimeFormatter,
      currentLocale: currentLocale,
      isCallsLoaded: recentCalls.isCallsLoaded
    }),
    getData: function getData() {
      recentCalls.getCalls(currentContact);
    },
    cleanUp: function cleanUp() {
      return recentCalls.cleanUpCalls(currentContact);
    }
  }];
}

function mapToProps(_, _ref2) {
  var locale = _ref2.locale,
      _ref2$currentLocale = _ref2.currentLocale,
      currentLocale = _ref2$currentLocale === undefined ? locale.currentLocale : _ref2$currentLocale,
      dateTimeFormat = _ref2.dateTimeFormat,
      navigateTo = _ref2.navigateTo,
      _ref2$dateTimeFormatt = _ref2.dateTimeFormatter,
      dateTimeFormatter = _ref2$dateTimeFormatt === undefined ? function () {
    return dateTimeFormat.formatDateTime.apply(dateTimeFormat, arguments);
  } : _ref2$dateTimeFormatt,
      recentMessages = _ref2.recentMessages,
      recentCalls = _ref2.recentCalls,
      contactMatcher = _ref2.contactMatcher,
      getSession = _ref2.getSession;

  var session = getSession();
  var currentContact = session.contactMatch;
  var contactMapping = contactMatcher && contactMatcher.dataMapping;
  var phoneNumber = session.direction === _callDirections2.default.outbound ? session.to : session.from;
  if (!currentContact) {
    currentContact = contactMapping && contactMapping[phoneNumber];
    if (currentContact && currentContact.length >= 1) {
      currentContact = currentContact[0];
    }
  }
  var ready = dateTimeFormat.ready && locale.ready && contactMatcher.ready && recentMessages.ready && recentCalls.ready;
  return {
    currentLocale: currentLocale,
    title: _i18n2.default.getString('recentActivities', locale.currentLocale),
    showSpinner: !ready,
    currentContact: currentContact,
    calls: recentCalls.calls || [],
    tabs: getTabs({
      ready: ready,
      currentLocale: currentLocale,
      dateTimeFormatter: dateTimeFormatter,
      navigateTo: navigateTo,
      currentContact: currentContact,
      recentMessages: recentMessages,
      recentCalls: recentCalls
    }),
    defaultTab: 'recentCalls'
  };
}

exports.default = (0, _reactRedux.connect)(mapToProps)(_RecentActivityPanel2.default);
//# sourceMappingURL=index.js.map

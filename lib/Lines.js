"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _MapGroup = require("./MapGroup");

var _MapGroup2 = _interopRequireDefault(_MapGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Lines = function Lines(_ref) {
  var groupName = _ref.groupName,
      itemName = _ref.itemName,
      componentIdentifier = _ref.componentIdentifier,
      restProps = _objectWithoutProperties(_ref, ["groupName", "itemName", "componentIdentifier"]);

  return _react2.default.createElement(_MapGroup2.default, _extends({
    groupName: groupName,
    itemName: itemName
  }, restProps));
};

Lines.defaultProps = {
  componentIdentifier: "Lines",
  groupName: "lines",
  itemName: "line"
};

exports.default = Lines;
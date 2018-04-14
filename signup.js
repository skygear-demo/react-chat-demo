webpackJsonp([1],{

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28);

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(27);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _config = __webpack_require__(26);

var _config2 = _interopRequireDefault(_config);

var _Authenticate = __webpack_require__(35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_skygear2.default.config(_config2.default.skygearConfig).then(function () {
  var root = document.createElement('div');
  document.body.appendChild(root);
  _reactDom2.default.render(_react2.default.createElement(_Authenticate.Signup, null), root);
});

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Signup = exports.Login = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _skygear = __webpack_require__(8);

var _skygear2 = _interopRequireDefault(_skygear);

var _Modal = __webpack_require__(20);

var _Modal2 = _interopRequireDefault(_Modal);

var _Authenticate = __webpack_require__(46);

var _Authenticate2 = _interopRequireDefault(_Authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function InputField(_ref) {
  var label = _ref.label,
      type = _ref.type,
      required = _ref.required,
      disabled = _ref.disabled,
      hidden = _ref.hidden;

  if (hidden) {
    return null;
  }
  return _react2.default.createElement(
    'p',
    {
      style: _Authenticate2.default.formElement },
    _react2.default.createElement(
      'label',
      null,
      label
    ),
    _react2.default.createElement('input', {
      style: _Authenticate2.default.formInput,
      required: required,
      disabled: disabled,
      type: type })
  );
}

function ErrorModal(_ref2) {
  var message = _ref2.message,
      onClose = _ref2.onClose;

  return _react2.default.createElement(
    _Modal2.default,
    {
      header: 'Error',
      onClose: onClose },
    _react2.default.createElement(
      'div',
      {
        style: _Authenticate2.default.modelContainer },
      _react2.default.createElement(
        'p',
        null,
        message
      ),
      _react2.default.createElement(
        'button',
        { onClick: onClose },
        'OK'
      )
    )
  );
}

var Login = exports.Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login(props) {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

    _this.state = {
      loading: false, // loading state (boolean)
      errorMessage: null // error message (shown in error modal if non-null)
    };
    return _this;
  }

  _createClass(Login, [{
    key: 'login',
    value: function login(username, password) {
      var _this2 = this;

      this.setState({ loading: true });
      _skygear2.default.auth.loginWithUsername(username, password).then(function () {
        window.location.href = 'app.html';
      }).catch(function (result) {
        _this2.setState({
          loading: false,
          errorMessage: result.error.message
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state = this.state,
          loading = _state.loading,
          errorMessage = _state.errorMessage;


      return _react2.default.createElement(
        'div',
        {
          style: _Authenticate2.default.container },
        _react2.default.createElement(
          'form',
          {
            onSubmit: function onSubmit(e) {
              e.preventDefault();
              _this3.login(e.target[0].value, e.target[1].value);
            },
            style: _Authenticate2.default.form },
          _react2.default.createElement(
            'h1',
            { style: { textAlign: 'center' } },
            'Welcome!'
          ),
          _react2.default.createElement(InputField, {
            required: true,
            type: 'text',
            label: 'Username',
            disabled: loading }),
          _react2.default.createElement(InputField, {
            required: true,
            type: 'password',
            label: 'Password',
            disabled: loading }),
          _react2.default.createElement('input', {
            style: _Authenticate2.default.formButton,
            type: 'submit',
            disabled: loading,
            value: 'Login' }),
          _react2.default.createElement(
            'a',
            {
              style: {
                textAlign: 'center'
              },
              href: 'signup.html' },
            'Sign Up'
          )
        ),
        errorMessage && _react2.default.createElement(ErrorModal, {
          message: errorMessage,
          onClose: function onClose() {
            return _this3.setState({ errorMessage: null });
          } })
      );
    }
  }]);

  return Login;
}(_react2.default.Component);

var Signup = exports.Signup = function (_React$Component2) {
  _inherits(Signup, _React$Component2);

  function Signup(props) {
    _classCallCheck(this, Signup);

    var _this4 = _possibleConstructorReturn(this, (Signup.__proto__ || Object.getPrototypeOf(Signup)).call(this, props));

    _this4.state = {
      loading: false, // loading state (boolean)
      errorMessage: null // error message (shown in error modal if non-null)
    };
    return _this4;
  }

  _createClass(Signup, [{
    key: 'signup',
    value: function signup(username, password, passwordConfirm) {
      var _this5 = this;

      if (password !== passwordConfirm) {
        this.setState({ errorMessage: 'Passwords do not match.' });
        return;
      }
      this.setState({ loading: true });
      _skygear2.default.auth.signupWithUsername(username, password).then(function (user) {
        return _skygear2.default.publicDB.save(new _skygear2.default.UserRecord({
          _id: 'user/' + user.id,
          displayName: username
        }));
      }).then(function () {
        window.location.href = 'app.html';
      }).catch(function (result) {
        _this5.setState({
          loading: false,
          errorMessage: result.error.message
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _state2 = this.state,
          loading = _state2.loading,
          errorMessage = _state2.errorMessage;


      return _react2.default.createElement(
        'div',
        {
          style: _Authenticate2.default.container },
        _react2.default.createElement(
          'form',
          {
            onSubmit: function onSubmit(e) {
              e.preventDefault();
              _this6.signup(e.target[0].value, e.target[1].value, e.target[2].value);
            },
            style: _Authenticate2.default.form },
          _react2.default.createElement(
            'h1',
            { style: { textAlign: 'center' } },
            'Signup'
          ),
          _react2.default.createElement(InputField, {
            required: true,
            type: 'text',
            label: 'Username',
            disabled: loading }),
          _react2.default.createElement(InputField, {
            required: true,
            type: 'password',
            label: 'Password',
            disabled: loading }),
          _react2.default.createElement(InputField, {
            required: true,
            type: 'password',
            label: 'Confirm Password',
            disabled: loading }),
          _react2.default.createElement('input', {
            style: _Authenticate2.default.formButton,
            type: 'submit',
            disabled: loading,
            value: 'Sign Up' }),
          _react2.default.createElement(
            'a',
            {
              style: {
                textAlign: 'center'
              },
              href: 'login.html' },
            'Login'
          )
        ),
        errorMessage && _react2.default.createElement(ErrorModal, {
          message: errorMessage,
          onClose: function onClose() {
            return _this6.setState({ errorMessage: null });
          } })
      );
    }
  }]);

  return Signup;
}(_react2.default.Component);

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    height: '100%',
    width: '100%'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px'
  },

  formElement: {
    margin: '0.5rem 0',
    display: 'flex',
    flexDirection: 'column'
  },

  formInput: {
    border: '1px solid #000',
    padding: '0.5rem',
    fontSize: '1rem'
  },

  formButton: {
    margin: '1rem 0',
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem'
  },

  modelContainer: {
    width: '16rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

exports.default = Styles;

/***/ }),

/***/ 68:
/***/ (function(module, exports) {

module.exports = undefined;

/***/ })

},[132]);
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var accept = require('attr-accept');

var Dropzone = (function (_React$Component) {
  _inherits(Dropzone, _React$Component);

  function Dropzone(props, context) {
    _classCallCheck(this, Dropzone);

    _React$Component.call(this, props, context);
    this.onClick = this.onClick.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      isDragActive: false
    };
  }

  Dropzone.prototype.componentDidMount = function componentDidMount() {
    this.enterCounter = 0;
  };

  Dropzone.prototype.allFilesAccepted = function allFilesAccepted(files) {
    var _this = this;

    return files.every(function (file) {
      return accept(file, _this.props.accept);
    });
  };

  Dropzone.prototype.onDragEnter = function onDragEnter(e) {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter;

    // This is tricky. During the drag even the dataTransfer.files is null
    // But Chrome implements some drag store, which is accesible via dataTransfer.items
    var dataTransferItems = e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [];

    // Now we need to convert the DataTransferList to Array
    var itemsArray = Array.prototype.slice.call(dataTransferItems);
    var allFilesAccepted = this.allFilesAccepted(itemsArray);

    this.setState({
      isDragActive: allFilesAccepted,
      isDragReject: !allFilesAccepted
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter(e);
    }
  };

  Dropzone.prototype.onDragOver = function onDragOver(e) {
    e.preventDefault();
  };

  Dropzone.prototype.onDragLeave = function onDragLeave(e) {
    e.preventDefault();

    // Only deactivate once the dropzone and all children was left.
    if (--this.enterCounter > 0) {
      return;
    }

    this.setState({
      isDragActive: false,
      isDragReject: false
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave(e);
    }
  };

  Dropzone.prototype.onDrop = function onDrop(e) {
    e.preventDefault();

    // Reset the counter along with the drag on a drop.
    this.enterCounter = 0;

    this.setState({
      isDragActive: false,
      isDragReject: false
    });

    var droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    var max = droppedFiles.length;
    if (max > 1 && !this.props.multiple) {
      max = 1;
    }
    var files = [];

    for (var i = 0; i < max; i++) {
      var file = droppedFiles[i];
      file.preview = window.URL.createObjectURL(file);
      files.push(file);
    }

    if (this.props.onDrop) {
      this.props.onDrop(files, e);
    }

    if (this.allFilesAccepted(files)) {
      if (this.props.onDropAccepted) {
        this.props.onDropAccepted(files, e);
      }
    } else {
      if (this.props.onDropRejected) {
        this.props.onDropRejected(files, e);
      }
    }
  };

  Dropzone.prototype.onClick = function onClick() {
    if (!this.props.disableClick) {
      this.open();
    }
  };

  Dropzone.prototype.open = function open() {
    var fileInput = this.refs.fileInput;
    fileInput.value = null;
    fileInput.click();
  };

  Dropzone.prototype.render = function render() {
    var className, style, activeStyle, rejectStyle;

    if (this.props.className) {
      className = this.props.className;
      if (this.state.isDragActive && this.props.activeClassName) {
        className += ' ' + this.props.activeClassName;
      }
      if (this.state.isDragReject && this.props.rejectClassName) {
        className += ' ' + this.props.rejectClassName;
      }
    }

    if (this.props.style || this.props.activeStyle || this.props.rejectStyle) {
      if (this.props.style) {
        style = this.props.style;
      }
      if (this.props.activeStyle) {
        activeStyle = this.props.activeStyle;
      }
      if (this.props.rejectStyle) {
        rejectStyle = this.props.rejectStyle;
      }
    } else if (!className) {
      style = {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5
      };
      activeStyle = {
        borderStyle: 'solid',
        backgroundColor: '#eee'
      };
      rejectStyle = {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd'
      };
    }

    var appliedStyle;
    if (activeStyle && this.state.isDragActive) {
      appliedStyle = _extends({}, style, activeStyle);
    } else if (rejectStyle && this.state.isDragReject) {
      appliedStyle = _extends({}, style, rejectStyle);
    } else {
      appliedStyle = _extends({}, style);
    }

    var inputAttr = {};
    if (this.props.name) {
      inputAttr.name = this.props.name;
    }

    return React.createElement(
      'div',
      {
        className: className,
        style: appliedStyle,
        onClick: this.onClick,
        onDragEnter: this.onDragEnter,
        onDragOver: this.onDragOver,
        onDragLeave: this.onDragLeave,
        onDrop: this.onDrop
      },
      this.props.children,
      React.createElement('input', _extends({
        type: 'file',
        ref: 'fileInput',
        style: { display: 'none' },
        multiple: this.props.multiple,
        accept: this.props.accept,
        onChange: this.onDrop
      }, inputAttr))
    );
  };

  return Dropzone;
})(React.Component);

Dropzone.defaultProps = {
  disableClick: false,
  multiple: true
};

Dropzone.propTypes = {
  onDrop: React.PropTypes.func,
  onDropAccepted: React.PropTypes.func,
  onDropRejected: React.PropTypes.func,
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,

  style: React.PropTypes.object,
  activeStyle: React.PropTypes.object,
  rejectStyle: React.PropTypes.object,
  className: React.PropTypes.string,
  activeClassName: React.PropTypes.string,
  rejectClassName: React.PropTypes.string,

  disableClick: React.PropTypes.bool,
  multiple: React.PropTypes.bool,
  accept: React.PropTypes.string,
  name: React.PropTypes.string
};

module.exports = Dropzone;

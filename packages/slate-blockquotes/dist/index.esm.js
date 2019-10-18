import React from "react";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }

    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }

  return target;
}

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default")
    ? x["default"]
    : x;
}

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  /**
   * Constants.
   */

  var IS_MAC =
    typeof window != "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

  var MODIFIERS = {
    alt: "altKey",
    control: "ctrlKey",
    meta: "metaKey",
    shift: "shiftKey"
  };

  var ALIASES = {
    add: "+",
    break: "pause",
    cmd: "meta",
    command: "meta",
    ctl: "control",
    ctrl: "control",
    del: "delete",
    down: "arrowdown",
    esc: "escape",
    ins: "insert",
    left: "arrowleft",
    mod: IS_MAC ? "meta" : "control",
    opt: "alt",
    option: "alt",
    return: "enter",
    right: "arrowright",
    space: " ",
    spacebar: " ",
    up: "arrowup",
    win: "meta",
    windows: "meta"
  };

  var CODES = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    control: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    " ": 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    meta: 91,
    numlock: 144,
    scrolllock: 145,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222
  };

  for (var f = 1; f < 20; f++) {
    CODES["f" + f] = 111 + f;
  }

  /**
   * Is hotkey?
   */

  function isHotkey(hotkey, options, event) {
    if (options && !("byKey" in options)) {
      event = options;
      options = null;
    }

    if (!Array.isArray(hotkey)) {
      hotkey = [hotkey];
    }

    var array = hotkey.map(function(string) {
      return parseHotkey(string, options);
    });
    var check = function check(e) {
      return array.some(function(object) {
        return compareHotkey(object, e);
      });
    };
    var ret = event == null ? check : check(event);
    return ret;
  }

  function isCodeHotkey(hotkey, event) {
    return isHotkey(hotkey, event);
  }

  function isKeyHotkey(hotkey, event) {
    return isHotkey(hotkey, { byKey: true }, event);
  }

  /**
   * Parse.
   */

  function parseHotkey(hotkey, options) {
    var byKey = options && options.byKey;
    var ret = {};

    // Special case to handle the `+` key since we use it as a separator.
    hotkey = hotkey.replace("++", "+add");
    var values = hotkey.split("+");
    var length = values.length;

    // Ensure that all the modifiers are set to false unless the hotkey has them.

    for (var k in MODIFIERS) {
      ret[MODIFIERS[k]] = false;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (
        var _iterator = values[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true
      ) {
        var value = _step.value;

        var optional = value.endsWith("?") && value.length > 1;

        if (optional) {
          value = value.slice(0, -1);
        }

        var name = toKeyName(value);
        var modifier = MODIFIERS[name];

        if (length === 1 || !modifier) {
          if (byKey) {
            ret.key = name;
          } else {
            ret.which = toKeyCode(value);
          }
        }

        if (modifier) {
          ret[modifier] = optional ? null : true;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return ret;
  }

  /**
   * Compare.
   */

  function compareHotkey(object, event) {
    for (var key in object) {
      var expected = object[key];
      var actual = void 0;

      if (expected == null) {
        continue;
      }

      if (key === "key" && event.key != null) {
        actual = event.key.toLowerCase();
      } else if (key === "which") {
        actual = expected === 91 && event.which === 93 ? 91 : event.which;
      } else {
        actual = event[key];
      }

      if (actual == null && expected === false) {
        continue;
      }

      if (actual !== expected) {
        return false;
      }
    }

    return true;
  }

  /**
   * Utils.
   */

  function toKeyCode(name) {
    name = toKeyName(name);
    var code = CODES[name] || name.toUpperCase().charCodeAt(0);
    return code;
  }

  function toKeyName(name) {
    name = name.toLowerCase();
    name = ALIASES[name] || name;
    return name;
  }

  /**
   * Export.
   */

  exports.default = isHotkey;
  exports.isHotkey = isHotkey;
  exports.isCodeHotkey = isCodeHotkey;
  exports.isKeyHotkey = isKeyHotkey;
  exports.parseHotkey = parseHotkey;
  exports.compareHotkey = compareHotkey;
  exports.toKeyCode = toKeyCode;
  exports.toKeyName = toKeyName;
});

var isHotkey = unwrapExports(lib);
var lib_1 = lib.isHotkey;
var lib_2 = lib.isCodeHotkey;
var lib_3 = lib.isKeyHotkey;
var lib_4 = lib.parseHotkey;
var lib_5 = lib.compareHotkey;
var lib_6 = lib.toKeyCode;
var lib_7 = lib.toKeyName;

var Keymap = function Keymap(shortcuts, options) {
  var config = _objectSpread2(
    {
      if: function _if() {
        return true;
      }
    },
    options
  );

  var functions = Object.keys(shortcuts).map(function(key) {
    var isKeyPressed = isHotkey(key);
    var command = shortcuts[key];

    var check = function check(event, editor) {
      return isKeyPressed(event) && config["if"](editor);
    };

    var handler =
      typeof command == "string"
        ? function(event, editor) {
            event.preventDefault();
            editor.command(command);
          }
        : command;
    return {
      check: check,
      handler: handler
    };
  });
  return {
    onKeyDown: function onKeyDown(event, editor, next) {
      var shortcut = functions.find(function(shortcut) {
        return shortcut.check(event, editor);
      });

      if (shortcut) {
        return shortcut.handler(event, editor, next);
      } else {
        return next();
      }
    }
  };
};

var wrapWithOptions = function wrapWithOptions(fn, options) {
  return function() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return fn.apply(void 0, [options].concat(args));
  };
};

var wrapBlockquote = function wrapBlockquote(_ref, editor) {
  var blocks = _ref.blocks;
  var rootBlocks = editor.value.document.getRootBlocksAtRange(
    editor.value.selection
  );
  editor.withoutNormalizing(function() {
    if (rootBlocks.size === 1) {
      editor.wrapBlockByKey(editor.value.startBlock.key, blocks.blockquote);
      return;
    }

    rootBlocks.forEach(function(block) {
      editor.wrapBlockByKey(block.key, blocks.blockquote_line);
    });
    editor.wrapBlock(blocks.blockquote);
  });
};

var unwrapBlockquote = function unwrapBlockquote(_ref2, editor) {
  var blocks = _ref2.blocks;
  var startBlock = editor.value.startBlock;

  if (startBlock.type === blocks.blockquote_line) {
    var parent = editor.value.document.getParent(startBlock.key);
    editor.withoutNormalizing(function() {
      editor.unwrapBlockByKey(parent.key, {
        type: blocks.blockquote
      });
      parent.nodes.forEach(function(block) {
        editor.setNodeByKey(block.key, {
          type: blocks.default
        });
      });
    });
  }
};

var toggleBlockquote = function toggleBlockquote(_ref3, editor) {
  var blocks = _ref3.blocks;
  var block = editor.value.startBlock;

  if (block.type == blocks.blockquote_line) {
    editor.unwrapBlockquote();
  } else {
    editor.wrapBlockquote();
  }
};

var createCommands = function(options) {
  return {
    wrapBlockquote: wrapWithOptions(wrapBlockquote, options),
    unwrapBlockquote: wrapWithOptions(unwrapBlockquote, options),
    toggleBlockquote: wrapWithOptions(toggleBlockquote, options)
  };
};

var createRenderBlock = function(_ref) {
  var blocks = _ref.blocks,
    classNames = _ref.classNames;
  return function(props, editor, next) {
    var node = props.node;

    switch (node.type) {
      case blocks.blockquote:
        return React.createElement(
          "blockquote",
          _extends(
            {
              className: classNames.blockquote
            },
            props.attributes
          ),
          props.children
        );

      case blocks.blockquote_line: {
        return React.createElement(
          "div",
          _extends(
            {
              className: classNames.blockquote_line
            },
            props.attributes
          ),
          props.children
        );
      }

      default:
        return next();
    }
  };
};

var createSchema = function(_ref) {
  var _blocks;

  var blocks = _ref.blocks;
  return {
    blocks: ((_blocks = {}),
    _defineProperty(_blocks, blocks.blockquote, {
      nodes: [
        {
          match: {
            type: blocks.blockquote_line
          },
          min: 1
        }
      ],
      normalize: function normalize(editor, error) {
        switch (error.code) {
          case "child_min_invalid":
            editor.insertNodeByKey(error.node.key, 0, {
              object: "block",
              type: blocks.blockquote_line
            });

          case "child_type_invalid":
            editor.wrapBlockByKey(error.child.key, {
              type: blocks.blockquote_line
            });
            return;

          case "parent_type_invalid":
            editor.wrapBlock(blocks.blockquote);
            return;

          default:
            return;
        }
      }
    }),
    _defineProperty(_blocks, blocks.blockquote_line, {
      parent: [
        {
          type: blocks.blockquote
        }
      ],
      nodes: [
        {
          match: [
            {
              object: "text"
            },
            {
              object: "inline"
            }
          ]
        }
      ],
      normalize: function normalize(editor, error) {
        switch (error.code) {
          case "child_object_invalid":
            error.child.nodes.forEach(function(node, index) {
              editor.moveNodeByKey(node.key, error.node.key, index);
            });
            editor.removeNodeByKey(error.child.key);
            return;

          default:
            return;
        }
      }
    }),
    _blocks)
  };
};

var index = function() {
  var options =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = _objectSpread({}, options);

  var blocks = _objectSpread(
    {
      blockquote: "blockquote",
      blockquote_line: "blockquote-line",
      default: "paragraph"
    },
    config.blocks
  );

  var classNames = _objectSpread(
    {
      blockquote: "blockquote",
      blockquote_line: "blockquote-line"
    },
    config.classNames
  );

  var onEnter = function onEnter(event, editor, next) {
    var _editor$value = editor.value,
      selection = _editor$value.selection,
      startBlock = _editor$value.startBlock;

    if (selection.start.offset === 0 && startBlock.getText() === "") {
      event.preventDefault();
      if (selection.isExpanded) editor.delete();
      console.log("unwrap");
      editor.unwrapBlockquote();
      return;
    }

    return next();
  };

  var onBackspace = function onBackspace(event, editor, next) {
    var _editor$value2 = editor.value,
      selection = _editor$value2.selection,
      startBlock = _editor$value2.startBlock;
    if (selection.isExpanded) return next();
    if (selection.start.offset !== 0) return next();
    var parent = editor.value.document.getParent(startBlock.key);
    if (parent.nodes.first().key !== startBlock.key) return next();
    event.preventDefault();
    editor.unwrapBlockquote();
  };

  var isBlockquoteLine = function isBlockquoteLine(editor) {
    return editor.value.startBlock.type === blocks.blockquote_line;
  };

  var renderBlock = createRenderBlock({
    blocks: blocks,
    classNames: classNames
  });
  var commands = createCommands({
    blocks: blocks
  });
  var schema = createSchema({
    blocks: blocks
  });
  return [
    {
      commands: commands,
      renderBlock: renderBlock,
      renderNode: renderBlock,
      // COMPAT: renderNode is removed in slate
      schema: schema
    },
    Keymap(
      {
        enter: onEnter,
        backspace: onBackspace
      },
      {
        if: isBlockquoteLine
      }
    )
  ];
};

export default index;

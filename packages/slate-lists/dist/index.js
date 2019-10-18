"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var slate = require("slate");
var React = _interopDefault(require("react"));

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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
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

function _objectSpread$1(target) {
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
      _defineProperty$1(target, key, source[key]);
    });
  }

  return target;
}

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default")
    ? x.default
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

        var optional = value.endsWith("?");

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

      if (key === "key") {
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
  var config = _objectSpread$1(
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
      return isKeyPressed(event) && config.if(editor);
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

var isList = function isList(blocks, block) {
  return (
    block.type == blocks.unordered_list || block.type == blocks.ordered_list
  );
};

var wrapList = function(_ref, editor) {
  var blocks = _ref.blocks;
  var options =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var type = options.type || blocks.unordered_list;
  var rootBlocks = editor.value.document.getRootBlocksAtRange(
    editor.value.selection
  );
  editor.withoutNormalizing(function() {
    rootBlocks.forEach(function(block) {
      if (isList(blocks, block)) return;
      editor.wrapBlockByKey(block.key, type);
      editor.wrapBlockByKey(block.key, blocks.list_item);
      editor.setNodeByKey(block.key, blocks.list_item_child);
    });
  });
};

var unwrapListByKey = function(_ref, editor, key) {
  var blocks = _ref.blocks;
  var listItem = editor.value.document.getNode(key);
  editor.withoutNormalizing(function() {
    editor.unwrapNodeByKey(listItem.key);
    var parent = editor.value.document.getParent(listItem.key);
    var itemIndex = parent.nodes.findIndex(function(node) {
      return node.key === listItem.key;
    });
    listItem.nodes.forEach(function(itemChild, index) {
      editor.moveNodeByKey(itemChild.key, parent.key, index + itemIndex);

      if (itemChild.type == blocks.list_item_child) {
        editor.setNodeByKey(itemChild.key, {
          type: blocks.default
        });
      }
    });
    editor.removeNodeByKey(listItem.key);
  });
};

var unwrapList = function(_ref, editor) {
  var blocks = _ref.blocks;
  var listItemChildren = editor.value.document
    .getNodesAtRange(editor.value.selection)
    .filter(function(node) {
      return node.type == blocks.list_item_child;
    });
  var furthestListItems = listItemChildren
    .map(function(listItemChild) {
      return editor.value.document.getFurthest(listItemChild.key, function(
        node
      ) {
        return node.type == blocks.list_item;
      });
    })
    .filter(function(listItemChild, index, array) {
      return array.indexOf(listItemChild) == index;
    });
  furthestListItems.forEach(function(listItem) {
    unwrapListByKey(
      {
        blocks: blocks
      },
      editor,
      listItem.key
    );
  });
};

var toggleList = function(_ref, editor) {
  var blocks = _ref.blocks;
  var options =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _editor$value = editor.value,
    document = _editor$value.document,
    startBlock = _editor$value.startBlock;
  var type = options.type || blocks.unordered_list;
  var parent = document.getParent(startBlock.key);
  var isList = parent.type == blocks.list_item;
  if (!isList)
    return editor.wrapList({
      type: type
    });
  var list = document.getParent(parent.key);
  var sameType = list.type == type;

  if (sameType) {
    editor.unwrapList();
  } else {
    editor.setNodeByKey(list.key, type);
  }
};

var decreaseListItemDepth = function(_ref, editor) {
  var blocks = _ref.blocks;
  var _editor$value = editor.value,
    document = _editor$value.document,
    startBlock = _editor$value.startBlock;
  var listItem = document.getParent(startBlock.key);
  if (listItem.type != blocks.list_item) return;
  var list = document.getParent(listItem.key);
  var parentListItem = document.getParent(list.key);
  if (parentListItem.type != blocks.list_item) return;
  var parentList = document.getParent(parentListItem.key);
  var index = parentList.nodes.indexOf(parentListItem);
  var otherItems = list.nodes
    .skipUntil(function(item) {
      return item === listItem;
    })
    .rest();

  if (!otherItems.isEmpty()) {
    var newList = slate.Block.create({
      object: "block",
      type: list.type
    });
    editor.withoutNormalizing(function() {
      editor.insertNodeByKey(listItem.key, listItem.nodes.size, newList);
      editor.moveNodeByKey(listItem.key, parentList.key, index + 1);
      otherItems.forEach(function(item, index) {
        return editor.moveNodeByKey(
          item.key,
          newList.key,
          newList.nodes.size + index
        );
      });
    });
  } else {
    editor.moveNodeByKey(listItem.key, parentList.key, index + 1);
  }
};

var increaseListItemDepth = function(_ref, editor) {
  var blocks = _ref.blocks;
  var _editor$value = editor.value,
    document = _editor$value.document,
    startBlock = _editor$value.startBlock;
  var listItem = document.getParent(startBlock.key);
  var previousListItem = document.getPreviousSibling(listItem.key);
  var list = document.getParent(listItem.key);
  if (!listItem) return;
  if (!previousListItem) return; // Because of our schema constraints, we know that the second item must be a
  // list if it exists.

  var existingList = previousListItem.nodes.get(1);

  if (existingList) {
    editor.withoutNormalizing(function() {
      editor.moveNodeByKey(
        listItem.key,
        existingList.key,
        existingList.nodes.size
      );
    });
  } else {
    var newList = slate.Block.create({
      object: "block",
      type: list.type
    });
    editor.withoutNormalizing(function() {
      editor.insertNodeByKey(
        previousListItem.key,
        previousListItem.nodes.size,
        newList
      );
      editor.moveNodeByKey(listItem.key, newList.key, 0);
    });
  }
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

var createCommands = function(options) {
  return {
    wrapList: wrapWithOptions(wrapList, options),
    unwrapList: wrapWithOptions(unwrapList, options),
    toggleList: wrapWithOptions(toggleList, options),
    unwrapListByKey: wrapWithOptions(unwrapListByKey, options),
    decreaseListItemDepth: wrapWithOptions(decreaseListItemDepth, options),
    increaseListItemDepth: wrapWithOptions(increaseListItemDepth, options)
  };
};

var sameType = function sameType(node, other) {
  return node.type == other.type;
};

var createNormalizeNode = function(_ref) {
  var blocks = _ref.blocks;

  var isList = function isList(block) {
    return (
      block &&
      (block.type == blocks.unordered_list || block.type == blocks.ordered_list)
    );
  };

  return function(node, editor, next) {
    if (node.object !== "document" && node.object !== "block") return next();
    var mergable = node.nodes
      .map(function(child, index) {
        if (!isList(child)) {
          return null;
        }

        var adjacent = node.nodes.get(index + 1);

        if (!adjacent || !isList(adjacent) || !sameType(child, adjacent)) {
          return null;
        }

        return [child, adjacent];
      })
      .filter(function(node) {
        return node;
      });
    if (mergable.isEmpty()) return next();
    return function(editor) {
      mergable.reverse().forEach(function(_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          list = _ref3[0],
          adjacent = _ref3[1];

        var updatedAdjacent = editor.value.document.getDescendant(adjacent.key);
        updatedAdjacent.nodes.forEach(function(child, index) {
          editor.withoutNormalizing(function() {
            editor.moveNodeByKey(child.key, list.key, list.nodes.size + index);
          });
        });
        editor.withoutNormalizing(function() {
          editor.removeNodeByKey(adjacent.key);
        });
      });
    };
  };
};

var createRenderBlock = function(_ref) {
  var blocks = _ref.blocks,
    classNames = _ref.classNames;
  return function(props, editor, next) {
    var node = props.node;

    switch (node.type) {
      case blocks.unordered_list:
        return React.createElement(
          "ul",
          _extends(
            {
              className: classNames.unordered_list
            },
            props.attributes
          ),
          props.children
        );

      case blocks.ordered_list: {
        return React.createElement(
          "ol",
          _extends(
            {
              className: classNames.ordered_list
            },
            props.attributes
          ),
          props.children
        );
      }

      case blocks.list_item: {
        return React.createElement(
          "li",
          _extends(
            {
              className: classNames.list_item
            },
            props.attributes
          ),
          props.children
        );
      }

      case blocks.list_item_child: {
        return React.createElement(
          "div",
          _extends(
            {
              className: classNames.list_item_child
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
    _defineProperty(_blocks, blocks.unordered_list, {
      nodes: [
        {
          match: {
            type: blocks.list_item
          }
        }
      ]
    }),
    _defineProperty(_blocks, blocks.ordered_list, {
      nodes: [
        {
          match: {
            type: blocks.list_item
          }
        }
      ]
    }),
    _defineProperty(_blocks, blocks.list_item, {
      parent: [
        {
          type: blocks.unordered_list
        },
        {
          type: blocks.ordered_list
        }
      ],
      nodes: [
        {
          match: {
            type: blocks.list_item_child
          },
          min: 1,
          max: 1
        },
        {
          match: [
            {
              type: blocks.unordered_list
            },
            {
              type: blocks.ordered_list
            }
          ],
          min: 0,
          max: 1
        }
      ],
      normalize: function normalize(editor, error) {
        switch (error.code) {
          case "child_min_invalid":
            editor.insertNodeByKey(
              error.node.key,
              0,
              slate.Block.create({
                type: blocks.list_item_child,
                nodes: [slate.Text.create()]
              })
            );
            return;

          case "child_type_invalid":
            editor.wrapBlockByKey(error.child.key, {
              type: blocks.list_item_child
            });
            return;

          case "parent_type_invalid":
            editor.wrapBlockByKey(error.node.key, blocks.unordered_list);
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
      unordered_list: "unordered-list",
      ordered_list: "ordered-list",
      list_item: "list-item",
      list_item_child: "list-item-child",
      default: "paragraph"
    },
    config.blocks
  );

  var classNames = _objectSpread(
    {
      unordered_list: "unordered-list",
      ordered_list: "ordered-list",
      list_item: "list-item",
      list_item_child: "list-item-child"
    },
    config.classNames
  );

  var commands = createCommands({
    blocks: blocks
  });

  var isListItem = function isListItem(block) {
    return block && block.type == blocks.list_item;
  };

  var getListItem = function getListItem(editor, block) {
    var possibleListItem = editor.value.document.getParent(block.key);
    return isListItem(possibleListItem) ? possibleListItem : null;
  };

  var isList = function isList(block) {
    return (
      block &&
      (block.type == blocks.unordered_list || block.type == blocks.ordered_list)
    );
  };

  var getList = function getList(editor, block) {
    var possibleList = editor.value.document.getParent(block.key);
    return isList(possibleList) ? possibleList : null;
  };

  var onBackspace = function onBackspace(event, editor, next) {
    var selection = editor.value.selection;
    if (selection.isExpanded) return next();
    if (selection.start.offset !== 0) return next();
    var listItem = getListItem(editor, editor.value.startBlock);
    var list = getList(editor, listItem);
    var parentListItem = getListItem(editor, list);

    if (parentListItem) {
      editor.decreaseListItemDepth();
      return;
    }

    editor.unwrapList();
  };

  var onEnter = function onEnter(event, editor, next) {
    var _editor$value = editor.value,
      selection = _editor$value.selection,
      startBlock = _editor$value.startBlock;
    event.preventDefault();
    if (selection.isExpanded) editor.delete();

    if (selection.start.offset === 0 && startBlock.getText() === "") {
      var _listItem = getListItem(editor, editor.value.startBlock);

      var list = getList(editor, _listItem);
      var parentListItem = getListItem(editor, list);

      if (parentListItem) {
        editor.decreaseListItemDepth();
        return;
      }

      editor.unwrapList();
      return;
    }

    var listItem = getListItem(editor, editor.value.startBlock);
    editor.splitDescendantsByKey(
      listItem.key,
      selection.start.key,
      selection.start.offset
    );
  };

  var onShiftEnter = function onShiftEnter(event, editor, next) {
    event.preventDefault();
    editor.insertText("\n");
  };

  var schema = createSchema({
    blocks: blocks
  });
  var normalizeNode = createNormalizeNode({
    blocks: blocks
  });
  var renderBlock = createRenderBlock({
    blocks: blocks,
    classNames: classNames
  });
  return [
    {
      commands: {
        wrapList: commands.wrapList,
        unwrapList: commands.unwrapList,
        toggleList: commands.toggleList,
        decreaseListItemDepth: commands.decreaseListItemDepth,
        increaseListItemDepth: commands.increaseListItemDepth
      },
      normalizeNode: normalizeNode,
      renderBlock: renderBlock,
      renderNode: renderBlock,
      // COMPAT: renderNode is removed in slate
      schema: schema
    },
    Keymap(
      {
        backspace: onBackspace,
        enter: onEnter,
        "shift+enter": onShiftEnter,
        tab: "increaseListItemDepth",
        "shift+tab": "decreaseListItemDepth"
      },
      {
        if: function _if(editor) {
          return !!getListItem(editor, editor.value.startBlock);
        }
      }
    )
  ];
};

module.exports = index;

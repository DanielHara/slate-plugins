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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var commonjsGlobal =
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : {};

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

var prism = createCommonjsModule(function(module) {
  /* **********************************************
     Begin prism-core.js
********************************************** */

  var _self =
    typeof window !== "undefined"
      ? window // if in browser
      : typeof WorkerGlobalScope !== "undefined" &&
        self instanceof WorkerGlobalScope
      ? self // if in worker
      : {}; // if in node js

  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   * MIT license http://www.opensource.org/licenses/mit-license.php/
   * @author Lea Verou http://lea.verou.me
   */

  var Prism = (function() {
    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;

    var _ = (_self.Prism = {
      manual: _self.Prism && _self.Prism.manual,
      disableWorkerMessageHandler:
        _self.Prism && _self.Prism.disableWorkerMessageHandler,
      util: {
        encode: function(tokens) {
          if (tokens instanceof Token) {
            return new Token(
              tokens.type,
              _.util.encode(tokens.content),
              tokens.alias
            );
          } else if (_.util.type(tokens) === "Array") {
            return tokens.map(_.util.encode);
          } else {
            return tokens
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/\u00a0/g, " ");
          }
        },

        type: function(o) {
          return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
        },

        objId: function(obj) {
          if (!obj["__id"]) {
            Object.defineProperty(obj, "__id", { value: ++uniqueId });
          }
          return obj["__id"];
        },

        // Deep clone a language definition (e.g. to extend it)
        clone: function(o, visited) {
          var type = _.util.type(o);
          visited = visited || {};

          switch (type) {
            case "Object":
              if (visited[_.util.objId(o)]) {
                return visited[_.util.objId(o)];
              }
              var clone = {};
              visited[_.util.objId(o)] = clone;

              for (var key in o) {
                if (o.hasOwnProperty(key)) {
                  clone[key] = _.util.clone(o[key], visited);
                }
              }

              return clone;

            case "Array":
              if (visited[_.util.objId(o)]) {
                return visited[_.util.objId(o)];
              }
              var clone = [];
              visited[_.util.objId(o)] = clone;

              o.forEach(function(v, i) {
                clone[i] = _.util.clone(v, visited);
              });

              return clone;
          }

          return o;
        }
      },

      languages: {
        extend: function(id, redef) {
          var lang = _.util.clone(_.languages[id]);

          for (var key in redef) {
            lang[key] = redef[key];
          }

          return lang;
        },

        /**
         * Insert a token before another token in a language literal
         * As this needs to recreate the object (we cannot actually insert before keys in object literals),
         * we cannot just provide an object, we need anobject and a key.
         * @param inside The key (or language id) of the parent
         * @param before The key to insert before. If not provided, the function appends instead.
         * @param insert Object with the key/value pairs to insert
         * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
         */
        insertBefore: function(inside, before, insert, root) {
          root = root || _.languages;
          var grammar = root[inside];

          if (arguments.length == 2) {
            insert = arguments[1];

            for (var newToken in insert) {
              if (insert.hasOwnProperty(newToken)) {
                grammar[newToken] = insert[newToken];
              }
            }

            return grammar;
          }

          var ret = {};

          for (var token in grammar) {
            if (grammar.hasOwnProperty(token)) {
              if (token == before) {
                for (var newToken in insert) {
                  if (insert.hasOwnProperty(newToken)) {
                    ret[newToken] = insert[newToken];
                  }
                }
              }

              ret[token] = grammar[token];
            }
          }

          // Update references in other language definitions
          _.languages.DFS(_.languages, function(key, value) {
            if (value === root[inside] && key != inside) {
              this[key] = ret;
            }
          });

          return (root[inside] = ret);
        },

        // Traverse a language definition with Depth First Search
        DFS: function(o, callback, type, visited) {
          visited = visited || {};
          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              callback.call(o, i, o[i], type || i);

              if (
                _.util.type(o[i]) === "Object" &&
                !visited[_.util.objId(o[i])]
              ) {
                visited[_.util.objId(o[i])] = true;
                _.languages.DFS(o[i], callback, null, visited);
              } else if (
                _.util.type(o[i]) === "Array" &&
                !visited[_.util.objId(o[i])]
              ) {
                visited[_.util.objId(o[i])] = true;
                _.languages.DFS(o[i], callback, i, visited);
              }
            }
          }
        }
      },
      plugins: {},

      highlightAll: function(async, callback) {
        _.highlightAllUnder(document, async, callback);
      },

      highlightAllUnder: function(container, async, callback) {
        var env = {
          callback: callback,
          selector:
            'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };

        _.hooks.run("before-highlightall", env);

        var elements = env.elements || container.querySelectorAll(env.selector);

        for (var i = 0, element; (element = elements[i++]); ) {
          _.highlightElement(element, async === true, env.callback);
        }
      },

      highlightElement: function(element, async, callback) {
        // Find language
        var language,
          grammar,
          parent = element;

        while (parent && !lang.test(parent.className)) {
          parent = parent.parentNode;
        }

        if (parent) {
          language = (parent.className.match(lang) || [, ""])[1].toLowerCase();
          grammar = _.languages[language];
        }

        // Set language on the element, if not present
        element.className =
          element.className.replace(lang, "").replace(/\s+/g, " ") +
          " language-" +
          language;

        if (element.parentNode) {
          // Set language on the parent, for styling
          parent = element.parentNode;

          if (/pre/i.test(parent.nodeName)) {
            parent.className =
              parent.className.replace(lang, "").replace(/\s+/g, " ") +
              " language-" +
              language;
          }
        }

        var code = element.textContent;

        var env = {
          element: element,
          language: language,
          grammar: grammar,
          code: code
        };

        _.hooks.run("before-sanity-check", env);

        if (!env.code || !env.grammar) {
          if (env.code) {
            _.hooks.run("before-highlight", env);
            env.element.textContent = env.code;
            _.hooks.run("after-highlight", env);
          }
          _.hooks.run("complete", env);
          return;
        }

        _.hooks.run("before-highlight", env);

        if (async && _self.Worker) {
          var worker = new Worker(_.filename);

          worker.onmessage = function(evt) {
            env.highlightedCode = evt.data;

            _.hooks.run("before-insert", env);

            env.element.innerHTML = env.highlightedCode;

            callback && callback.call(env.element);
            _.hooks.run("after-highlight", env);
            _.hooks.run("complete", env);
          };

          worker.postMessage(
            JSON.stringify({
              language: env.language,
              code: env.code,
              immediateClose: true
            })
          );
        } else {
          env.highlightedCode = _.highlight(
            env.code,
            env.grammar,
            env.language
          );

          _.hooks.run("before-insert", env);

          env.element.innerHTML = env.highlightedCode;

          callback && callback.call(element);

          _.hooks.run("after-highlight", env);
          _.hooks.run("complete", env);
        }
      },

      highlight: function(text, grammar, language) {
        var env = {
          code: text,
          grammar: grammar,
          language: language
        };
        _.hooks.run("before-tokenize", env);
        env.tokens = _.tokenize(env.code, env.grammar);
        _.hooks.run("after-tokenize", env);
        return Token.stringify(_.util.encode(env.tokens), env.language);
      },

      matchGrammar: function(
        text,
        strarr,
        grammar,
        index,
        startPos,
        oneshot,
        target
      ) {
        var Token = _.Token;

        for (var token in grammar) {
          if (!grammar.hasOwnProperty(token) || !grammar[token]) {
            continue;
          }

          if (token == target) {
            return;
          }

          var patterns = grammar[token];
          patterns = _.util.type(patterns) === "Array" ? patterns : [patterns];

          for (var j = 0; j < patterns.length; ++j) {
            var pattern = patterns[j],
              inside = pattern.inside,
              lookbehind = !!pattern.lookbehind,
              greedy = !!pattern.greedy,
              lookbehindLength = 0,
              alias = pattern.alias;

            if (greedy && !pattern.pattern.global) {
              // Without the global flag, lastIndex won't work
              var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
              pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
            }

            pattern = pattern.pattern || pattern;

            // Don’t cache length as it changes during the loop
            for (
              var i = index, pos = startPos;
              i < strarr.length;
              pos += strarr[i].length, ++i
            ) {
              var str = strarr[i];

              if (strarr.length > text.length) {
                // Something went terribly wrong, ABORT, ABORT!
                return;
              }

              if (str instanceof Token) {
                continue;
              }

              if (greedy && i != strarr.length - 1) {
                pattern.lastIndex = pos;
                var match = pattern.exec(text);
                if (!match) {
                  break;
                }

                var from = match.index + (lookbehind ? match[1].length : 0),
                  to = match.index + match[0].length,
                  k = i,
                  p = pos;

                for (
                  var len = strarr.length;
                  k < len &&
                  (p < to || (!strarr[k].type && !strarr[k - 1].greedy));
                  ++k
                ) {
                  p += strarr[k].length;
                  // Move the index i to the element in strarr that is closest to from
                  if (from >= p) {
                    ++i;
                    pos = p;
                  }
                }

                // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
                if (strarr[i] instanceof Token) {
                  continue;
                }

                // Number of tokens to delete and replace with the new match
                delNum = k - i;
                str = text.slice(pos, p);
                match.index -= pos;
              } else {
                pattern.lastIndex = 0;

                var match = pattern.exec(str),
                  delNum = 1;
              }

              if (!match) {
                if (oneshot) {
                  break;
                }

                continue;
              }

              if (lookbehind) {
                lookbehindLength = match[1] ? match[1].length : 0;
              }

              var from = match.index + lookbehindLength,
                match = match[0].slice(lookbehindLength),
                to = from + match.length,
                before = str.slice(0, from),
                after = str.slice(to);

              var args = [i, delNum];

              if (before) {
                ++i;
                pos += before.length;
                args.push(before);
              }

              var wrapped = new Token(
                token,
                inside ? _.tokenize(match, inside) : match,
                alias,
                match,
                greedy
              );

              args.push(wrapped);

              if (after) {
                args.push(after);
              }

              Array.prototype.splice.apply(strarr, args);

              if (delNum != 1)
                _.matchGrammar(text, strarr, grammar, i, pos, true, token);

              if (oneshot) break;
            }
          }
        }
      },

      tokenize: function(text, grammar, language) {
        var strarr = [text];

        var rest = grammar.rest;

        if (rest) {
          for (var token in rest) {
            grammar[token] = rest[token];
          }

          delete grammar.rest;
        }

        _.matchGrammar(text, strarr, grammar, 0, 0, false);

        return strarr;
      },

      hooks: {
        all: {},

        add: function(name, callback) {
          var hooks = _.hooks.all;

          hooks[name] = hooks[name] || [];

          hooks[name].push(callback);
        },

        run: function(name, env) {
          var callbacks = _.hooks.all[name];

          if (!callbacks || !callbacks.length) {
            return;
          }

          for (var i = 0, callback; (callback = callbacks[i++]); ) {
            callback(env);
          }
        }
      }
    });

    var Token = (_.Token = function(type, content, alias, matchedStr, greedy) {
      this.type = type;
      this.content = content;
      this.alias = alias;
      // Copy of the full string this token was created from
      this.length = (matchedStr || "").length | 0;
      this.greedy = !!greedy;
    });

    Token.stringify = function(o, language, parent) {
      if (typeof o == "string") {
        return o;
      }

      if (_.util.type(o) === "Array") {
        return o
          .map(function(element) {
            return Token.stringify(element, language, o);
          })
          .join("");
      }

      var env = {
        type: o.type,
        content: Token.stringify(o.content, language, parent),
        tag: "span",
        classes: ["token", o.type],
        attributes: {},
        language: language,
        parent: parent
      };

      if (o.alias) {
        var aliases = _.util.type(o.alias) === "Array" ? o.alias : [o.alias];
        Array.prototype.push.apply(env.classes, aliases);
      }

      _.hooks.run("wrap", env);

      var attributes = Object.keys(env.attributes)
        .map(function(name) {
          return (
            name +
            '="' +
            (env.attributes[name] || "").replace(/"/g, "&quot;") +
            '"'
          );
        })
        .join(" ");

      return (
        "<" +
        env.tag +
        ' class="' +
        env.classes.join(" ") +
        '"' +
        (attributes ? " " + attributes : "") +
        ">" +
        env.content +
        "</" +
        env.tag +
        ">"
      );
    };

    if (!_self.document) {
      if (!_self.addEventListener) {
        // in Node.js
        return _self.Prism;
      }

      if (!_.disableWorkerMessageHandler) {
        // In worker
        _self.addEventListener(
          "message",
          function(evt) {
            var message = JSON.parse(evt.data),
              lang = message.language,
              code = message.code,
              immediateClose = message.immediateClose;

            _self.postMessage(_.highlight(code, _.languages[lang], lang));
            if (immediateClose) {
              _self.close();
            }
          },
          false
        );
      }

      return _self.Prism;
    }

    //Get current script and highlight
    var script =
      document.currentScript ||
      [].slice.call(document.getElementsByTagName("script")).pop();

    if (script) {
      _.filename = script.src;

      if (!_.manual && !script.hasAttribute("data-manual")) {
        if (document.readyState !== "loading") {
          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(_.highlightAll);
          } else {
            window.setTimeout(_.highlightAll, 16);
          }
        } else {
          document.addEventListener("DOMContentLoaded", _.highlightAll);
        }
      }
    }

    return _self.Prism;
  })();

  if (module.exports) {
    module.exports = Prism;
  }

  // hack for components to work correctly in node.js
  if (typeof commonjsGlobal !== "undefined") {
    commonjsGlobal.Prism = Prism;
  }

  /* **********************************************
     Begin prism-markup.js
********************************************** */

  Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
      greedy: true,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/i,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "attr-value": {
          pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
          inside: {
            punctuation: [
              /^=/,
              {
                pattern: /(^|[^\\])["']/,
                lookbehind: true
              }
            ]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: /&#?[\da-z]{1,8};/i
  };

  Prism.languages.markup["tag"].inside["attr-value"].inside["entity"] =
    Prism.languages.markup["entity"];

  // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add("wrap", function(env) {
    if (env.type === "entity") {
      env.attributes["title"] = env.content.replace(/&amp;/, "&");
    }
  });

  Prism.languages.xml = Prism.languages.markup;
  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;

  /* **********************************************
     Begin prism-css.js
********************************************** */

  Prism.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
      inside: {
        rule: /@[\w-]+/
        // See rest below
      }
    },
    url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    selector: /[^{}\s][^{};]*?(?=\s*\{)/,
    string: {
      pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /\B!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:]/
  };

  Prism.languages.css["atrule"].inside.rest = Prism.languages.css;

  if (Prism.languages.markup) {
    Prism.languages.insertBefore("markup", "tag", {
      style: {
        pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
        lookbehind: true,
        inside: Prism.languages.css,
        alias: "language-css",
        greedy: true
      }
    });

    Prism.languages.insertBefore(
      "inside",
      "attr-value",
      {
        "style-attr": {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            "attr-name": {
              pattern: /^\s*style/i,
              inside: Prism.languages.markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": {
              pattern: /.+/i,
              inside: Prism.languages.css
            }
          },
          alias: "language-css"
        }
      },
      Prism.languages.markup.tag
    );
  }

  /* **********************************************
     Begin prism-clike.js
********************************************** */

  Prism.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true
      }
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    "class-name": {
      pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
      lookbehind: true,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /[a-z0-9_]+(?=\()/i,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
  };

  /* **********************************************
     Begin prism-javascript.js
********************************************** */

  Prism.languages.javascript = Prism.languages.extend("clike", {
    keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
  });

  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: true,
      greedy: true
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    "function-variable": {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
      alias: "function"
    },
    constant: /\b[A-Z][A-Z\d_]*\b/
  });

  Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
      pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
      greedy: true,
      inside: {
        interpolation: {
          pattern: /\${[^}]+}/,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\${|}$/,
              alias: "punctuation"
            },
            rest: null // See below
          }
        },
        string: /[\s\S]+/
      }
    }
  });
  Prism.languages.javascript["template-string"].inside[
    "interpolation"
  ].inside.rest = Prism.languages.javascript;

  if (Prism.languages.markup) {
    Prism.languages.insertBefore("markup", "tag", {
      script: {
        pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: true,
        inside: Prism.languages.javascript,
        alias: "language-javascript",
        greedy: true
      }
    });
  }

  Prism.languages.js = Prism.languages.javascript;

  /* **********************************************
     Begin prism-file-highlight.js
********************************************** */

  (function() {
    if (
      typeof self === "undefined" ||
      !self.Prism ||
      !self.document ||
      !document.querySelector
    ) {
      return;
    }

    self.Prism.fileHighlight = function() {
      var Extensions = {
        js: "javascript",
        py: "python",
        rb: "ruby",
        ps1: "powershell",
        psm1: "powershell",
        sh: "bash",
        bat: "batch",
        h: "c",
        tex: "latex"
      };

      Array.prototype.slice
        .call(document.querySelectorAll("pre[data-src]"))
        .forEach(function(pre) {
          var src = pre.getAttribute("data-src");

          var language,
            parent = pre;
          var lang = /\blang(?:uage)?-([\w-]+)\b/i;
          while (parent && !lang.test(parent.className)) {
            parent = parent.parentNode;
          }

          if (parent) {
            language = (pre.className.match(lang) || [, ""])[1];
          }

          if (!language) {
            var extension = (src.match(/\.(\w+)$/) || [, ""])[1];
            language = Extensions[extension] || extension;
          }

          var code = document.createElement("code");
          code.className = "language-" + language;

          pre.textContent = "";

          code.textContent = "Loading…";

          pre.appendChild(code);

          var xhr = new XMLHttpRequest();

          xhr.open("GET", src, true);

          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              if (xhr.status < 400 && xhr.responseText) {
                code.textContent = xhr.responseText;

                Prism.highlightElement(code);
              } else if (xhr.status >= 400) {
                code.textContent =
                  "✖ Error " +
                  xhr.status +
                  " while fetching file: " +
                  xhr.statusText;
              } else {
                code.textContent = "✖ Error: File does not exist or is empty";
              }
            }
          };

          xhr.send(null);
        });

      if (Prism.plugins.toolbar) {
        Prism.plugins.toolbar.registerButton("download-file", function(env) {
          var pre = env.element.parentNode;
          if (
            !pre ||
            !/pre/i.test(pre.nodeName) ||
            !pre.hasAttribute("data-src") ||
            !pre.hasAttribute("data-download-link")
          ) {
            return;
          }
          var src = pre.getAttribute("data-src");
          var a = document.createElement("a");
          a.textContent =
            pre.getAttribute("data-download-link-label") || "Download";
          a.setAttribute("download", "");
          a.href = src;
          return a;
        });
      }
    };

    document.addEventListener("DOMContentLoaded", self.Prism.fileHighlight);
  })();
});

var createDecoration = function createDecoration(_ref) {
  var text = _ref.text,
    textStart = _ref.textStart,
    textEnd = _ref.textEnd,
    start = _ref.start,
    end = _ref.end,
    data = _ref.data;

  if (start >= textEnd || end <= textStart) {
    return null;
  } // Shrink to this text boundaries

  start = Math.max(start, textStart);
  end = Math.min(end, textEnd); // Now shift offsets to be relative to this text

  start -= textStart;
  end -= textStart;
  return {
    anchor: {
      key: text.key,
      offset: start
    },
    focus: {
      key: text.key,
      offset: end
    },
    mark: {
      type: "code-token",
      data: data
    }
  };
  return {
    anchorKey: text.key,
    anchorOffset: start,
    focusKey: text.key,
    focusOffset: end,
    marks: [
      {
        type: "prism-token",
        data: {
          className: className
        }
      }
    ]
  };
};

var SyntaxHighlight = function(_ref2) {
  var block = _ref2.block,
    line = _ref2.line;
  return {
    renderMark: function renderMark(props, editor, next) {
      var children = props.children,
        mark = props.mark,
        attributes = props.attributes;

      switch (mark.type) {
        case "code-token":
          var type = mark.data.get("type");
          return React.createElement(
            "span",
            _extends({}, attributes, {
              className: "token ".concat(type)
            }),
            children
          );

        default:
          return next();
      }
    },
    decorateNode: function decorateNode(node, editor, next) {
      var others = next() || [];
      if (node.type != block) return others;
      var texts = node.getTexts().toArray();
      var string = texts
        .map(function(t) {
          return t.text;
        })
        .join("\n");
      var language = node.data.get("language") || "html";
      var grammar = prism.languages[language];
      var tokens = prism.tokenize(string, grammar);
      var decorations = [];
      var textStart = 0;
      var textEnd = 0;
      texts.forEach(function(text) {
        textEnd = textStart + text.text.length;
        var offset = 0;

        function processToken(token, type) {
          if (typeof token === "string") {
            if (type) {
              var decoration = createDecoration({
                text: text,
                textStart: textStart,
                textEnd: textEnd,
                start: offset,
                end: offset + token.length,
                data: {
                  type: type
                }
              });

              if (decoration) {
                decorations.push(decoration);
              }
            }

            offset += token.length;
          } else {
            if (typeof token.content === "string") {
              var _decoration = createDecoration({
                text: text,
                textStart: textStart,
                textEnd: textEnd,
                start: offset,
                end: offset + token.content.length,
                data: {
                  type: token.type
                }
              });

              if (_decoration) {
                decorations.push(_decoration);
              }

              offset += token.content.length;
            } else {
              // When using token.content instead of token.matchedStr, token can be deep
              for (var i = 0; i < token.content.length; i += 1) {
                processToken(token.content[i], token.type);
              }
            }
          }
        }

        tokens.forEach(function(token) {
          processToken(token);
        });
        textStart = textEnd + 1; // account for added `\n`
      });
      return decorations;
      return [].concat(_toConsumableArray(others), decorations);
    }
  };
};

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

function createCommonjsModule$1(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule$1(function(module, exports) {
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

var getNextIndent = function getNextIndent(text) {
  return Math.max(text.search(/\S/), 0);
};

var index = function() {
  var options =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = _objectSpread(
    {
      highlight: true,
      block: "code",
      line: "code-line"
    },
    options
  );

  var classNames = _objectSpread(
    {
      block: "code",
      line: "code-line"
    },
    config.classNames
  );

  var isCodeLine = function isCodeLine(editor) {
    return editor.value.startBlock.type == config.line;
  };

  var onEnter = function onEnter(event, editor, next) {
    event.preventDefault();
    var indent = getNextIndent(editor.value.startBlock.text);
    var spaces = " ".repeat(indent);
    editor
      .splitBlock()
      .setBlocks(config.line)
      .insertText(spaces);
  };

  var onTab = function onTab(event, editor, next) {
    event.preventDefault();
    editor.insertText("  ");
  };

  var onSelectAll = function onSelectAll(event, editor, next) {
    event.preventDefault();
    var startBlock = editor.value.startBlock;
    var document = editor.value.document;
    var parent = document.getParent(startBlock.key);
    editor.moveToRangeOfNode(parent);
  };

  var schema = {
    blocks: {
      code: {
        nodes: [
          {
            match: {
              type: config.line
            }
          }
        ]
      },
      code_line: {
        nodes: [
          {
            match: {
              object: "text"
            }
          }
        ]
      }
    }
  };
  return [
    {
      commands: {
        insertCode: function insertCode(editor, _ref) {
          var code = _ref.code,
            language = _ref.language;
          editor.insertBlock({
            object: "block",
            type: config.block,
            data: {
              language: language
            },
            nodes: [
              {
                object: "block",
                type: config.line,
                nodes: [
                  {
                    object: "text",
                    leaves: [code]
                  }
                ]
              }
            ]
          });
        }
      },
      renderNode: function renderNode(props, editor, next) {
        var node = props.node;

        switch (node.type) {
          case config.block:
            var language = node.data.get("language") || "html";
            return React.createElement(
              "div",
              _extends(
                {
                  className: ""
                    .concat(classNames.block, " language-")
                    .concat(language)
                },
                props.attributes
              ),
              React.createElement(
                "div",
                {
                  className: "language-".concat(language)
                },
                props.children
              )
            );

          case config.line: {
            return React.createElement(
              "div",
              _extends(
                {
                  className: classNames.line
                },
                props.attributes
              ),
              props.children
            );
          }

          default:
            return next();
        }
      },
      schema: schema
    }
  ].concat(
    _toConsumableArray(
      config.highlight
        ? [
            SyntaxHighlight({
              block: config.block,
              line: config.line
            })
          ]
        : []
    ),
    [
      Keymap(
        {
          "mod+a": onSelectAll,
          tab: onTab,
          enter: onEnter
        },
        {
          if: isCodeLine
        }
      )
    ]
  );
};

export default index;

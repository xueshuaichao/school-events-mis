/*!
 * UEditor
 * version: ueditor
 * build: Wed Aug 10 2016 11:06:03 GMT+0800 (CST)
 */

(function() {
    (function() {
        UE = window.UE || {};
        const isIE = !!window.ActiveXObject;
        // 定义utils工具
        var utils = {
            removeLastbs(url) {
                return url.replace(/\/$/, "");
            },
            extend(t, s) {
                const a = arguments;
                const notCover = this.isBoolean(a[a.length - 1])
                    ? a[a.length - 1]
                    : false;
                const len = this.isBoolean(a[a.length - 1])
                    ? a.length - 1
                    : a.length;
                for (let i = 1; i < len; i++) {
                    const x = a[i];
                    for (const k in x) {
                        if (!notCover || !t.hasOwnProperty(k)) {
                            t[k] = x[k];
                        }
                    }
                }
                return t;
            },
            isIE,
            cssRule: isIE
                ? function(key, style, doc) {
                      let indexList;
                      let index;
                      doc = doc || document;
                      if (doc.indexList) {
                          indexList = doc.indexList;
                      } else {
                          indexList = doc.indexList = {};
                      }
                      let sheetStyle;
                      if (!indexList[key]) {
                          if (style === undefined) {
                              return "";
                          }
                          sheetStyle = doc.createStyleSheet(
                              "",
                              (index = doc.styleSheets.length)
                          );
                          indexList[key] = index;
                      } else {
                          sheetStyle = doc.styleSheets[indexList[key]];
                      }
                      if (style === undefined) {
                          return sheetStyle.cssText;
                      }
                      sheetStyle.cssText = `${sheetStyle.cssText}\n${style ||
                          ""}`;
                  }
                : function(key, style, doc) {
                      doc = doc || document;
                      const head = doc.getElementsByTagName("head")[0];
                      let node;
                      if (!(node = doc.getElementById(key))) {
                          if (style === undefined) {
                              return "";
                          }
                          node = doc.createElement("style");
                          node.id = key;
                          head.appendChild(node);
                      }
                      if (style === undefined) {
                          return node.innerHTML;
                      }
                      if (style !== "") {
                          node.innerHTML = `${node.innerHTML}\n${style}`;
                      } else {
                          head.removeChild(node);
                      }
                  },
            domReady(onready) {
                const doc = window.document;
                if (doc.readyState === "complete") {
                    onready();
                } else if (isIE) {
                    (function() {
                        if (doc.isReady) return;
                        try {
                            doc.documentElement.doScroll("left");
                        } catch (error) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        onready();
                    })();
                    window.attachEvent("onload", () => {
                        onready();
                    });
                } else {
                    doc.addEventListener(
                        "DOMContentLoaded",
                        function() {
                            doc.removeEventListener(
                                "DOMContentLoaded",
                                arguments.callee,
                                false
                            );
                            onready();
                        },
                        false
                    );
                    window.addEventListener(
                        "load",
                        () => {
                            onready();
                        },
                        false
                    );
                }
            },
            each(obj, iterator, context) {
                if (obj == null) return;
                if (obj.length === +obj.length) {
                    for (let i = 0, l = obj.length; i < l; i++) {
                        if (iterator.call(context, obj[i], i, obj) === false)
                            return false;
                    }
                } else {
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            if (
                                iterator.call(context, obj[key], key, obj) ===
                                false
                            )
                                return false;
                        }
                    }
                }
            },
            inArray(arr, item) {
                let index = -1;
                this.each(arr, (v, i) => {
                    if (v === item) {
                        index = i;
                        return false;
                    }
                });
                return index;
            },
            pushItem(arr, item) {
                if (this.inArray(arr, item) == -1) {
                    arr.push(item);
                }
            },
            trim(str) {
                return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, "");
            },
            indexOf(array, item, start) {
                let index = -1;
                start = this.isNumber(start) ? start : 0;
                this.each(array, (v, i) => {
                    if (i >= start && v === item) {
                        index = i;
                        return false;
                    }
                });
                return index;
            },
            hasClass(element, className) {
                className = className
                    .replace(/(^[ ]+)|([ ]+$)/g, "")
                    .replace(/[ ]{2,}/g, " ")
                    .split(" ");
                for (
                    var i = 0, ci, cls = element.className;
                    (ci = className[i++]);

                ) {
                    if (!new RegExp(`\\b${ci}\\b`, "i").test(cls)) {
                        return false;
                    }
                }
                return i - 1 == className.length;
            },
            addClass(elm, classNames) {
                if (!elm) return;
                classNames = this.trim(classNames)
                    .replace(/[ ]{2,}/g, " ")
                    .split(" ");
                for (
                    var i = 0, ci, cls = elm.className;
                    (ci = classNames[i++]);

                ) {
                    if (!new RegExp(`\\b${ci}\\b`).test(cls)) {
                        cls += ` ${ci}`;
                    }
                }
                elm.className = utils.trim(cls);
            },
            removeClass(elm, classNames) {
                classNames = this.isArray(classNames)
                    ? classNames
                    : this.trim(classNames)
                          .replace(/[ ]{2,}/g, " ")
                          .split(" ");
                for (
                    var i = 0, ci, cls = elm.className;
                    (ci = classNames[i++]);

                ) {
                    cls = cls.replace(new RegExp(`\\b${ci}\\b`), "");
                }
                cls = this.trim(cls).replace(/[ ]{2,}/g, " ");
                elm.className = cls;
                !cls && elm.removeAttribute("className");
            },
            on(element, type, handler) {
                const types = this.isArray(type) ? type : type.split(/\s+/);
                let k = types.length;
                if (k) {
                    while (k--) {
                        type = types[k];
                        if (element.addEventListener) {
                            element.addEventListener(type, handler, false);
                        } else {
                            if (!handler._d) {
                                handler._d = {
                                    els: []
                                };
                            }
                            const key = type + handler.toString();
                            const index = utils.indexOf(
                                handler._d.els,
                                element
                            );
                            if (!handler._d[key] || index == -1) {
                                if (index == -1) {
                                    handler._d.els.push(element);
                                }
                                if (!handler._d[key]) {
                                    handler._d[key] = function(evt) {
                                        return handler.call(
                                            evt.srcElement,
                                            evt || window.event
                                        );
                                    };
                                }

                                element.attachEvent(
                                    `on${type}`,
                                    handler._d[key]
                                );
                            }
                        }
                    }
                }
                element = null;
            },
            off(element, type, handler) {
                const types = this.isArray(type) ? type : type.split(/\s+/);
                let k = types.length;
                if (k) {
                    while (k--) {
                        type = types[k];
                        if (element.removeEventListener) {
                            element.removeEventListener(type, handler, false);
                        } else {
                            const key = type + handler.toString();
                            try {
                                element.detachEvent(
                                    `on${type}`,
                                    handler._d ? handler._d[key] : handler
                                );
                            } catch (e) {}
                            if (handler._d && handler._d[key]) {
                                const index = utils.indexOf(
                                    handler._d.els,
                                    element
                                );
                                if (index != -1) {
                                    handler._d.els.splice(index, 1);
                                }
                                handler._d.els.length == 0 &&
                                    delete handler._d[key];
                            }
                        }
                    }
                }
            },
            loadFile: (function() {
                const tmpList = [];

                function getItem(doc, obj) {
                    try {
                        for (var i = 0, ci; (ci = tmpList[i++]); ) {
                            if (
                                ci.doc === doc &&
                                ci.url == (obj.src || obj.href)
                            ) {
                                return ci;
                            }
                        }
                    } catch (e) {
                        return null;
                    }
                }

                return function(doc, obj, fn) {
                    let item = getItem(doc, obj);
                    if (item) {
                        if (item.ready) {
                            fn && fn();
                        } else {
                            item.funs.push(fn);
                        }
                        return;
                    }
                    tmpList.push({
                        doc,
                        url: obj.src || obj.href,
                        funs: [fn]
                    });
                    if (!doc.body) {
                        const html = [];
                        for (var p in obj) {
                            if (p == "tag") continue;
                            html.push(`${p}="${obj[p]}"`);
                        }
                        doc.write(
                            `<${obj.tag} ${html.join(" ")} ></${obj.tag}>`
                        );
                        return;
                    }
                    if (obj.id && doc.getElementById(obj.id)) {
                        return;
                    }
                    const element = doc.createElement(obj.tag);
                    delete obj.tag;
                    for (var p in obj) {
                        element.setAttribute(p, obj[p]);
                    }
                    element.onload = element.onreadystatechange = function() {
                        if (
                            !this.readyState ||
                            /loaded|complete/.test(this.readyState)
                        ) {
                            item = getItem(doc, obj);
                            if (item.funs.length > 0) {
                                item.ready = 1;
                                for (var fi; (fi = item.funs.pop()); ) {
                                    fi();
                                }
                            }
                            element.onload = element.onreadystatechange = null;
                        }
                    };
                    element.onerror = function() {
                        throw Error(
                            `The load ${obj.href ||
                                obj.src} fails,check the url`
                        );
                    };
                    doc.getElementsByTagName("head")[0].appendChild(element);
                };
            })()
        };
        utils.each(
            [
                "String",
                "Function",
                "Array",
                "Number",
                "RegExp",
                "Object",
                "Boolean"
            ],
            v => {
                utils[`is${v}`] = function(obj) {
                    return (
                        Object.prototype.toString.apply(obj) == `[object ${v}]`
                    );
                };
            }
        );
        const parselist = {};
        UE.parse = {
            register(parseName, fn) {
                parselist[parseName] = fn;
            },
            load(opt) {
                utils.each(parselist, v => {
                    v.call(opt, utils);
                });
            }
        };
        window.uParse = function(selector, opt) {
            utils.domReady(() => {
                var contents;
                if (document.querySelectorAll) {
                    contents = document.querySelectorAll(selector);
                } else if (/^#/.test(selector)) {
                    contents = [
                        document.getElementById(selector.replace(/^#/, ""))
                    ];
                } else if (/^\./.test(selector)) {
                    var contents = [];
                    utils.each(document.getElementsByTagName("*"), node => {
                        if (
                            node.className &&
                            new RegExp(
                                `\\b${selector.replace(/^\./, "")}\\b`,
                                "i"
                            ).test(node.className)
                        ) {
                            contents.push(node);
                        }
                    });
                } else {
                    contents = document.getElementsByTagName(selector);
                }
                utils.each(contents, v => {
                    UE.parse.load(utils.extend({ root: v, selector }, opt));
                });
            });
        };
    })();
})();

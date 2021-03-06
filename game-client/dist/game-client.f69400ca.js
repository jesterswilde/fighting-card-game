// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/preact/dist/preact.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.h = h;
exports.cloneElement = cloneElement;
exports.createRef = createRef;
exports.Component = Component;
exports.render = render;
exports.rerender = rerender;
exports.options = exports.default = void 0;

var VNode = function VNode() {};

var options = {};
exports.options = options;
var stack = [];
var EMPTY_CHILDREN = [];

function h(nodeName, attributes) {
  var children = EMPTY_CHILDREN,
      lastSimple,
      child,
      simple,
      i;

  for (i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  if (attributes && attributes.children != null) {
    if (!stack.length) stack.push(attributes.children);
    delete attributes.children;
  }

  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--;) {
        stack.push(child[i]);
      }
    } else {
      if (typeof child === 'boolean') child = null;

      if (simple = typeof nodeName !== 'function') {
        if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
      }

      if (simple && lastSimple) {
        children[children.length - 1] += child;
      } else if (children === EMPTY_CHILDREN) {
        children = [child];
      } else {
        children.push(child);
      }

      lastSimple = simple;
    }
  }

  var p = new VNode();
  p.nodeName = nodeName;
  p.children = children;
  p.attributes = attributes == null ? undefined : attributes;
  p.key = attributes == null ? undefined : attributes.key;
  if (options.vnode !== undefined) options.vnode(p);
  return p;
}

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }

  return obj;
}

function applyRef(ref, value) {
  if (ref) {
    if (typeof ref == 'function') ref(value);else ref.current = value;
  }
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
  return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
var items = [];

function enqueueRender(component) {
  if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    (options.debounceRendering || defer)(rerender);
  }
}

function rerender() {
  var p;

  while (p = items.pop()) {
    if (p._dirty) renderComponent(p);
  }
}

function isSameNodeType(node, vnode, hydrating) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.splitText !== undefined;
  }

  if (typeof vnode.nodeName === 'string') {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  }

  return hydrating || node._componentConstructor === vnode.nodeName;
}

function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
  var props = extend({}, vnode.attributes);
  props.children = vnode.children;
  var defaultProps = vnode.nodeName.defaultProps;

  if (defaultProps !== undefined) {
    for (var i in defaultProps) {
      if (props[i] === undefined) {
        props[i] = defaultProps[i];
      }
    }
  }

  return props;
}

function createNode(nodeName, isSvg) {
  var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
  node.normalizedNodeName = nodeName;
  return node;
}

function removeNode(node) {
  var parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function setAccessor(node, name, old, value, isSvg) {
  if (name === 'className') name = 'class';

  if (name === 'key') {} else if (name === 'ref') {
    applyRef(old, null);
    applyRef(value, node);
  } else if (name === 'class' && !isSvg) {
    node.className = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old === 'string') {
      node.style.cssText = value || '';
    }

    if (value && typeof value === 'object') {
      if (typeof old !== 'string') {
        for (var i in old) {
          if (!(i in value)) node.style[i] = '';
        }
      }

      for (var i in value) {
        node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
      }
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (value) node.innerHTML = value.__html || '';
  } else if (name[0] == 'o' && name[1] == 'n') {
    var useCapture = name !== (name = name.replace(/Capture$/, ''));
    name = name.toLowerCase().substring(2);

    if (value) {
      if (!old) node.addEventListener(name, eventProxy, useCapture);
    } else {
      node.removeEventListener(name, eventProxy, useCapture);
    }

    (node._listeners || (node._listeners = {}))[name] = value;
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    try {
      node[name] = value == null ? '' : value;
    } catch (e) {}

    if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
  } else {
    var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

    if (value == null || value === false) {
      if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    } else if (typeof value !== 'function') {
      if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    }
  }
}

function eventProxy(e) {
  return this._listeners[e.type](options.event && options.event(e) || e);
}

var mounts = [];
var diffLevel = 0;
var isSvgMode = false;
var hydrating = false;

function flushMounts() {
  var c;

  while (c = mounts.shift()) {
    if (options.afterMount) options.afterMount(c);
    if (c.componentDidMount) c.componentDidMount();
  }
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
  if (!diffLevel++) {
    isSvgMode = parent != null && parent.ownerSVGElement !== undefined;
    hydrating = dom != null && !('__preactattr_' in dom);
  }

  var ret = idiff(dom, vnode, context, mountAll, componentRoot);
  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  if (! --diffLevel) {
    hydrating = false;
    if (!componentRoot) flushMounts();
  }

  return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
  var out = dom,
      prevSvgMode = isSvgMode;
  if (vnode == null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
      if (dom.nodeValue != vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom) {
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
        recollectNodeTree(dom, true);
      }
    }

    out['__preactattr_'] = true;
    return out;
  }

  var vnodeName = vnode.nodeName;

  if (typeof vnodeName === 'function') {
    return buildComponentFromVNode(dom, vnode, context, mountAll);
  }

  isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;
  vnodeName = String(vnodeName);

  if (!dom || !isNamedNode(dom, vnodeName)) {
    out = createNode(vnodeName, isSvgMode);

    if (dom) {
      while (dom.firstChild) {
        out.appendChild(dom.firstChild);
      }

      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
      recollectNodeTree(dom, true);
    }
  }

  var fc = out.firstChild,
      props = out['__preactattr_'],
      vchildren = vnode.children;

  if (props == null) {
    props = out['__preactattr_'] = {};

    for (var a = out.attributes, i = a.length; i--;) {
      props[a[i].name] = a[i].value;
    }
  }

  if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    if (fc.nodeValue != vchildren[0]) {
      fc.nodeValue = vchildren[0];
    }
  } else if (vchildren && vchildren.length || fc != null) {
    innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
  }

  diffAttributes(out, vnode.attributes, props);
  isSvgMode = prevSvgMode;
  return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
  var originalChildren = dom.childNodes,
      children = [],
      keyed = {},
      keyedLen = 0,
      min = 0,
      len = originalChildren.length,
      childrenLen = 0,
      vlen = vchildren ? vchildren.length : 0,
      j,
      c,
      f,
      vchild,
      child;

  if (len !== 0) {
    for (var i = 0; i < len; i++) {
      var _child = originalChildren[i],
          props = _child['__preactattr_'],
          key = vlen && props ? _child._component ? _child._component.__key : props.key : null;

      if (key != null) {
        keyedLen++;
        keyed[key] = _child;
      } else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
        children[childrenLen++] = _child;
      }
    }
  }

  if (vlen !== 0) {
    for (var i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null;
      var key = vchild.key;

      if (key != null) {
        if (keyedLen && keyed[key] !== undefined) {
          child = keyed[key];
          keyed[key] = undefined;
          keyedLen--;
        }
      } else if (min < childrenLen) {
        for (j = min; j < childrenLen; j++) {
          if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      child = idiff(child, vchild, context, mountAll);
      f = originalChildren[i];

      if (child && child !== dom && child !== f) {
        if (f == null) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  }

  if (keyedLen) {
    for (var i in keyed) {
      if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    }
  }

  while (min <= childrenLen) {
    if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
  }
}

function recollectNodeTree(node, unmountOnly) {
  var component = node._component;

  if (component) {
    unmountComponent(component);
  } else {
    if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

    if (unmountOnly === false || node['__preactattr_'] == null) {
      removeNode(node);
    }

    removeChildren(node);
  }
}

function removeChildren(node) {
  node = node.lastChild;

  while (node) {
    var next = node.previousSibling;
    recollectNodeTree(node, true);
    node = next;
  }
}

function diffAttributes(dom, attrs, old) {
  var name;

  for (name in old) {
    if (!(attrs && attrs[name] != null) && old[name] != null) {
      setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    }
  }

  for (name in attrs) {
    if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
      setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
  }
}

var recyclerComponents = [];

function createComponent(Ctor, props, context) {
  var inst,
      i = recyclerComponents.length;

  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props, context);
    Component.call(inst, props, context);
  } else {
    inst = new Component(props, context);
    inst.constructor = Ctor;
    inst.render = doRender;
  }

  while (i--) {
    if (recyclerComponents[i].constructor === Ctor) {
      inst.nextBase = recyclerComponents[i].nextBase;
      recyclerComponents.splice(i, 1);
      return inst;
    }
  }

  return inst;
}

function doRender(props, state, context) {
  return this.constructor(props, context);
}

function setComponentProps(component, props, renderMode, context, mountAll) {
  if (component._disable) return;
  component._disable = true;
  component.__ref = props.ref;
  component.__key = props.key;
  delete props.ref;
  delete props.key;

  if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
    if (!component.base || mountAll) {
      if (component.componentWillMount) component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
      component.componentWillReceiveProps(props, context);
    }
  }

  if (context && context !== component.context) {
    if (!component.prevContext) component.prevContext = component.context;
    component.context = context;
  }

  if (!component.prevProps) component.prevProps = component.props;
  component.props = props;
  component._disable = false;

  if (renderMode !== 0) {
    if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
      renderComponent(component, 1, mountAll);
    } else {
      enqueueRender(component);
    }
  }

  applyRef(component.__ref, component);
}

function renderComponent(component, renderMode, mountAll, isChild) {
  if (component._disable) return;
  var props = component.props,
      state = component.state,
      context = component.context,
      previousProps = component.prevProps || props,
      previousState = component.prevState || state,
      previousContext = component.prevContext || context,
      isUpdate = component.base,
      nextBase = component.nextBase,
      initialBase = isUpdate || nextBase,
      initialChildComponent = component._component,
      skip = false,
      snapshot = previousContext,
      rendered,
      inst,
      cbase;

  if (component.constructor.getDerivedStateFromProps) {
    state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
    component.state = state;
  }

  if (isUpdate) {
    component.props = previousProps;
    component.state = previousState;
    component.context = previousContext;

    if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
      skip = true;
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state, context);
    }

    component.props = props;
    component.state = state;
    component.context = context;
  }

  component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
  component._dirty = false;

  if (!skip) {
    rendered = component.render(props, state, context);

    if (component.getChildContext) {
      context = extend(extend({}, context), component.getChildContext());
    }

    if (isUpdate && component.getSnapshotBeforeUpdate) {
      snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
    }

    var childComponent = rendered && rendered.nodeName,
        toUnmount,
        base;

    if (typeof childComponent === 'function') {
      var childProps = getNodeProps(rendered);
      inst = initialChildComponent;

      if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
        setComponentProps(inst, childProps, 1, context, false);
      } else {
        toUnmount = inst;
        component._component = inst = createComponent(childComponent, childProps, context);
        inst.nextBase = inst.nextBase || nextBase;
        inst._parentComponent = component;
        setComponentProps(inst, childProps, 0, context, false);
        renderComponent(inst, 1, mountAll, true);
      }

      base = inst.base;
    } else {
      cbase = initialBase;
      toUnmount = initialChildComponent;

      if (toUnmount) {
        cbase = component._component = null;
      }

      if (initialBase || renderMode === 1) {
        if (cbase) cbase._component = null;
        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
      }
    }

    if (initialBase && base !== initialBase && inst !== initialChildComponent) {
      var baseParent = initialBase.parentNode;

      if (baseParent && base !== baseParent) {
        baseParent.replaceChild(base, initialBase);

        if (!toUnmount) {
          initialBase._component = null;
          recollectNodeTree(initialBase, false);
        }
      }
    }

    if (toUnmount) {
      unmountComponent(toUnmount);
    }

    component.base = base;

    if (base && !isChild) {
      var componentRef = component,
          t = component;

      while (t = t._parentComponent) {
        (componentRef = t).base = base;
      }

      base._component = componentRef;
      base._componentConstructor = componentRef.constructor;
    }
  }

  if (!isUpdate || mountAll) {
    mounts.push(component);
  } else if (!skip) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate(previousProps, previousState, snapshot);
    }

    if (options.afterUpdate) options.afterUpdate(component);
  }

  while (component._renderCallbacks.length) {
    component._renderCallbacks.pop().call(component);
  }

  if (!diffLevel && !isChild) flushMounts();
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
  var c = dom && dom._component,
      originalComponent = c,
      oldDom = dom,
      isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
      isOwner = isDirectOwner,
      props = getNodeProps(vnode);

  while (c && !isOwner && (c = c._parentComponent)) {
    isOwner = c.constructor === vnode.nodeName;
  }

  if (c && isOwner && (!mountAll || c._component)) {
    setComponentProps(c, props, 3, context, mountAll);
    dom = c.base;
  } else {
    if (originalComponent && !isDirectOwner) {
      unmountComponent(originalComponent);
      dom = oldDom = null;
    }

    c = createComponent(vnode.nodeName, props, context);

    if (dom && !c.nextBase) {
      c.nextBase = dom;
      oldDom = null;
    }

    setComponentProps(c, props, 1, context, mountAll);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      recollectNodeTree(oldDom, false);
    }
  }

  return dom;
}

function unmountComponent(component) {
  if (options.beforeUnmount) options.beforeUnmount(component);
  var base = component.base;
  component._disable = true;
  if (component.componentWillUnmount) component.componentWillUnmount();
  component.base = null;
  var inner = component._component;

  if (inner) {
    unmountComponent(inner);
  } else if (base) {
    if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);
    component.nextBase = base;
    removeNode(base);
    recyclerComponents.push(component);
    removeChildren(base);
  }

  applyRef(component.__ref, null);
}

function Component(props, context) {
  this._dirty = true;
  this.context = context;
  this.props = props;
  this.state = this.state || {};
  this._renderCallbacks = [];
}

extend(Component.prototype, {
  setState: function setState(state, callback) {
    if (!this.prevState) this.prevState = this.state;
    this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  },
  forceUpdate: function forceUpdate(callback) {
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, 2);
  },
  render: function render() {}
});

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

function createRef() {
  return {};
}

var preact = {
  h: h,
  createElement: h,
  cloneElement: cloneElement,
  createRef: createRef,
  Component: Component,
  render: render,
  rerender: rerender,
  options: options
};
var _default = preact;
exports.default = _default;
},{}],"node_modules/preact-context/dist/context.min.js":[function(require,module,exports) {
var define;
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("preact")):"function"==typeof define&&define.amd?define(["exports","preact"],t):t((n=n||self).preactContext={},n.preact)}(this,function(n,t){"use strict";var i=function(n,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])})(n,t)};function r(n,t){function r(){this.constructor=n}i(n,t),n.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var e={register:function(n){console.warn("Consumer used without a Provider")},unregister:function(n){},val:function(n){}};function u(n){var t=n.children;return{child:1===t.length?t[0]:null,children:t}}function o(n){return u(n).child||"render"in n&&n.render}var c=1073741823,f=function(){return c},s=0;function a(n,i){var a="_preactContextProvider-"+s++;return{Provider:function(n){function e(t){var r=n.call(this,t)||this;return r.t=function(n,t){var i=[],r=n,e=function(n){return 0|t(r,n)};return{register:function(n){i.push(n),n(r,e(r))},unregister:function(n){i=i.filter(function(t){return t!==n})},val:function(n){if(void 0===n||n==r)return r;var t=e(n);return r=n,i.forEach(function(i){return i(n,t)}),r}}}(t.value,i||f),r}return r(e,n),e.prototype.getChildContext=function(){var n;return(n={})[a]=this.t,n},e.prototype.componentDidUpdate=function(){this.t.val(this.props.value)},e.prototype.render=function(){var n=u(this.props),i=n.child,r=n.children;return i||t.h("span",null,r)},e}(t.Component),Consumer:function(t){function i(i,r){var e=t.call(this,i,r)||this;return e.i=function(n,t){var i=e.props.unstable_observedBits,r=void 0===i||null===i?c:i;0!=((r|=0)&t)&&e.setState({value:n})},e.state={value:e.u().val()||n},e}return r(i,t),i.prototype.componentDidMount=function(){this.u().register(this.i)},i.prototype.shouldComponentUpdate=function(n,t){return this.state.value!==t.value||o(this.props)!==o(n)},i.prototype.componentWillUnmount=function(){this.u().unregister(this.i)},i.prototype.componentDidUpdate=function(n,t,i){var r=i[a];r!==this.context[a]&&((r||e).unregister(this.i),this.componentDidMount())},i.prototype.render=function(){var n="render"in this.props&&this.props.render,t=o(this.props);if(n&&n!==t&&console.warn("Both children and a render function are defined. Children will be used"),"function"==typeof t)return t(this.state.value);console.warn("Consumer is expecting a function as one and only child but didn't find any")},i.prototype.u=function(){return this.context[a]||e},i}(t.Component)}}var h=a;n.default=a,n.createContext=h,Object.defineProperty(n,"__esModule",{value:!0})});
},{"preact":"node_modules/preact/dist/preact.mjs"}],"node_modules/symbol-observable/es/ponyfill.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = symbolObservablePonyfill;

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol('observable');
      Symbol.observable = result;
    }
  } else {
    result = '@@observable';
  }

  return result;
}

;
},{}],"node_modules/symbol-observable/es/index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ponyfill = _interopRequireDefault(require("./ponyfill.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill.default)(root);
var _default = result;
exports.default = _default;
},{"./ponyfill.js":"node_modules/symbol-observable/es/ponyfill.js"}],"node_modules/redux/es/redux.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyMiddleware = applyMiddleware;
exports.bindActionCreators = bindActionCreators;
exports.combineReducers = combineReducers;
exports.compose = compose;
exports.createStore = createStore;
exports.__DO_NOT_USE__ActionTypes = void 0;

var _symbolObservable = _interopRequireDefault(require("symbol-observable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */

exports.__DO_NOT_USE__ActionTypes = ActionTypes;

function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */


function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[_symbolObservable.default] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable.default] = observable, _ref2;
}
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */


function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if ("development" !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if ("development" !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if ("development" !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */


function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}
/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */


function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */


function isCrushed() {}

if ("development" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}
},{"symbol-observable":"node_modules/symbol-observable/es/index.js"}],"node_modules/preact-redux/dist/preact-redux.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectAdvanced = connectAdvanced;
exports.connect = exports.ReactReduxContext = exports.Provider = exports.default = void 0;

var _preact = require("preact");

var _preactContext = require("preact-context");

var _redux = require("redux");

function _extends() {
  _extends = Object.assign || function (target) {
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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function invariant() {}

var React = {
  createContext: _preactContext.createContext,
  forwardRef: invariant,
  createElement: _preact.h
};
var ReactReduxContext = React.createContext(null);
exports.ReactReduxContext = ReactReduxContext;

var Provider = function (_Component) {
  _inheritsLoose(Provider, _Component);

  function Provider(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    var store = props.store;
    _this.state = {
      storeState: store.getState(),
      store: store
    };
    return _this;
  }

  var _proto = Provider.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._isMounted = true;
    this.subscribe();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this._isMounted = false;
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.store !== prevProps.store) {
      if (this.unsubscribe) this.unsubscribe();
      this.subscribe();
    }
  };

  _proto.subscribe = function subscribe() {
    var _this2 = this;

    var store = this.props.store;
    this.unsubscribe = store.subscribe(function () {
      var newStoreState = store.getState();

      if (!_this2._isMounted) {
        return;
      }

      _this2.setState(function (providerState) {
        if (providerState.storeState === newStoreState) {
          return null;
        }

        return {
          storeState: newStoreState
        };
      });
    });
    var postMountStoreState = store.getState();

    if (postMountStoreState !== this.state.storeState) {
      this.setState({
        storeState: postMountStoreState
      });
    }
  };

  _proto.render = function render() {
    var Context = this.props.context || ReactReduxContext;
    return React.createElement(Context.Provider, {
      value: this.state
    }, this.props.children);
  };

  return Provider;
}(_preact.Component);

exports.Provider = Provider;

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var reactIs_production_min = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  var c = 60103,
      d = 60106,
      e = 60107,
      f = 60108,
      g = 60114,
      h = 60109,
      k = 60110,
      l = 60111,
      m = 60111,
      n = 60112,
      p = 60113,
      q = 60115,
      r = 60116;

  function t(a) {
    if ("object" === typeof a && null !== a) {
      var u = a.$$typeof;

      switch (u) {
        case c:
          switch (a = a.type, a) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
              return a;

            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case n:
                case h:
                  return a;

                default:
                  return u;
              }

          }

        case r:
        case q:
        case d:
          return u;
      }
    }
  }

  function v(a) {
    return t(a) === m;
  }

  exports.typeOf = t;
  exports.AsyncMode = l;
  exports.ConcurrentMode = m;
  exports.ContextConsumer = k;
  exports.ContextProvider = h;
  exports.Element = c;
  exports.ForwardRef = n;
  exports.Fragment = e;
  exports.Lazy = r;
  exports.Memo = q;
  exports.Portal = d;
  exports.Profiler = g;
  exports.StrictMode = f;
  exports.Suspense = p;

  exports.isValidElementType = function (a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || "object" === typeof a && null !== a && (a.$$typeof === r || a.$$typeof === q || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n);
  };

  exports.isAsyncMode = function (a) {
    return v(a) || t(a) === l;
  };

  exports.isConcurrentMode = v;

  exports.isContextConsumer = function (a) {
    return t(a) === k;
  };

  exports.isContextProvider = function (a) {
    return t(a) === h;
  };

  exports.isElement = function (a) {
    return "object" === typeof a && null !== a && a.$$typeof === c;
  };

  exports.isForwardRef = function (a) {
    return t(a) === n;
  };

  exports.isFragment = function (a) {
    return t(a) === e;
  };

  exports.isLazy = function (a) {
    return t(a) === r;
  };

  exports.isMemo = function (a) {
    return t(a) === q;
  };

  exports.isPortal = function (a) {
    return t(a) === d;
  };

  exports.isProfiler = function (a) {
    return t(a) === g;
  };

  exports.isStrictMode = function (a) {
    return t(a) === f;
  };

  exports.isSuspense = function (a) {
    return t(a) === p;
  };
});
unwrapExports(reactIs_production_min);
var reactIs_production_min_1 = reactIs_production_min.typeOf;
var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
var reactIs_production_min_6 = reactIs_production_min.Element;
var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
var reactIs_production_min_8 = reactIs_production_min.Fragment;
var reactIs_production_min_9 = reactIs_production_min.Lazy;
var reactIs_production_min_10 = reactIs_production_min.Memo;
var reactIs_production_min_11 = reactIs_production_min.Portal;
var reactIs_production_min_12 = reactIs_production_min.Profiler;
var reactIs_production_min_13 = reactIs_production_min.StrictMode;
var reactIs_production_min_14 = reactIs_production_min.Suspense;
var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
var reactIs_production_min_20 = reactIs_production_min.isElement;
var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
var reactIs_production_min_22 = reactIs_production_min.isFragment;
var reactIs_production_min_23 = reactIs_production_min.isLazy;
var reactIs_production_min_24 = reactIs_production_min.isMemo;
var reactIs_production_min_25 = reactIs_production_min.isPortal;
var reactIs_production_min_26 = reactIs_production_min.isProfiler;
var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
var reactIs_production_min_28 = reactIs_production_min.isSuspense;
var reactIs = createCommonjsModule(function (module) {
  {
    module.exports = reactIs_production_min;
  }
});
var reactIs_1 = reactIs.isValidElementType;
var reactIs_2 = reactIs.isContextConsumer;
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;

function getStatics(component) {
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  }

  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;

function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }

    return targetComponent;
  }

  return targetComponent;
}

var hoistNonReactStatics_cjs = hoistNonReactStatics;

function connectAdvanced(selectorFactory, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$getDisplayName = _ref.getDisplayName,
      getDisplayName = _ref$getDisplayName === void 0 ? function (name) {
    return "ConnectAdvanced(" + name + ")";
  } : _ref$getDisplayName,
      _ref$methodName = _ref.methodName,
      methodName = _ref$methodName === void 0 ? 'connectAdvanced' : _ref$methodName,
      _ref$renderCountProp = _ref.renderCountProp,
      renderCountProp = _ref$renderCountProp === void 0 ? undefined : _ref$renderCountProp,
      _ref$shouldHandleStat = _ref.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref$shouldHandleStat === void 0 ? true : _ref$shouldHandleStat,
      _ref$storeKey = _ref.storeKey,
      storeKey = _ref$storeKey === void 0 ? 'store' : _ref$storeKey,
      _ref$withRef = _ref.withRef,
      _ref$forwardRef = _ref.forwardRef,
      forwardRef = _ref$forwardRef === void 0 ? false : _ref$forwardRef,
      _ref$context = _ref.context,
      context = _ref$context === void 0 ? ReactReduxContext : _ref$context,
      connectOptions = _objectWithoutPropertiesLoose(_ref, ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"]);

  var customStoreWarningMessage = 'To use a custom Redux store for specific components,  create a custom React context with ' + "React.createContext(), and pass the context object to React Redux's Provider and specific components" + ' like:  <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. ' + 'You may also pass a {context : MyContext} option to connect';
  var Context = context;
  return function wrapWithConnect(WrappedComponent) {
    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent
    });

    var pure = connectOptions.pure;
    var OuterBaseComponent = _preact.Component;

    if (pure) {
      OuterBaseComponent = _preact.Component;
    }

    function makeDerivedPropsSelector() {
      var lastProps;
      var lastState;
      var lastDerivedProps;
      var lastStore;
      var lastSelectorFactoryOptions;
      var sourceSelector;
      return function selectDerivedProps(state, props, store, selectorFactoryOptions) {
        if (pure && lastProps === props && lastState === state) {
          return lastDerivedProps;
        }

        if (store !== lastStore || lastSelectorFactoryOptions !== selectorFactoryOptions) {
          lastStore = store;
          lastSelectorFactoryOptions = selectorFactoryOptions;
          sourceSelector = selectorFactory(store.dispatch, selectorFactoryOptions);
        }

        lastProps = props;
        lastState = state;
        var nextProps = sourceSelector(state, props);
        lastDerivedProps = nextProps;
        return lastDerivedProps;
      };
    }

    function makeChildElementSelector() {
      var lastChildProps, lastForwardRef, lastChildElement, lastComponent;
      return function selectChildElement(WrappedComponent, childProps, forwardRef) {
        if (childProps !== lastChildProps || forwardRef !== lastForwardRef || lastComponent !== WrappedComponent) {
          lastChildProps = childProps;
          lastForwardRef = forwardRef;
          lastComponent = WrappedComponent;
          lastChildElement = React.createElement(WrappedComponent, _extends({}, childProps, {
            ref: forwardRef
          }));
        }

        return lastChildElement;
      };
    }

    var Connect = function (_OuterBaseComponent) {
      _inheritsLoose(Connect, _OuterBaseComponent);

      function Connect(props) {
        var _this;

        _this = _OuterBaseComponent.call(this, props) || this;
        invariant(forwardRef ? !props.wrapperProps[storeKey] : !props[storeKey], 'Passing redux store in props has been removed and does not do anything. ' + customStoreWarningMessage);
        _this.selectDerivedProps = makeDerivedPropsSelector();
        _this.selectChildElement = makeChildElementSelector();
        _this.indirectRenderWrappedComponent = _this.indirectRenderWrappedComponent.bind(_assertThisInitialized(_this));
        return _this;
      }

      var _proto = Connect.prototype;

      _proto.indirectRenderWrappedComponent = function indirectRenderWrappedComponent(value) {
        return this.renderWrappedComponent(value);
      };

      _proto.renderWrappedComponent = function renderWrappedComponent(value) {
        var storeState = value.storeState,
            store = value.store;
        var wrapperProps = this.props;
        var forwardedRef;

        if (forwardRef) {
          wrapperProps = this.props.wrapperProps;
          forwardedRef = this.props.forwardedRef;
        }

        var derivedProps = this.selectDerivedProps(storeState, wrapperProps, store, selectorFactoryOptions);
        return this.selectChildElement(WrappedComponent, derivedProps, forwardedRef);
      };

      _proto.render = function render() {
        var ContextToUse = this.props.context && this.props.context.Consumer && reactIs_2(React.createElement(this.props.context.Consumer, null)) ? this.props.context : Context;
        return React.createElement(ContextToUse.Consumer, null, this.indirectRenderWrappedComponent);
      };

      return Connect;
    }(OuterBaseComponent);

    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;

    if (forwardRef) {
      var forwarded = React.forwardRef(function forwardConnectRef(props, ref) {
        return React.createElement(Connect, {
          wrapperProps: props,
          forwardedRef: ref
        });
      });
      forwarded.displayName = displayName;
      forwarded.WrappedComponent = WrappedComponent;
      return hoistNonReactStatics_cjs(forwarded, WrappedComponent);
    }

    return hoistNonReactStatics_cjs(Connect, WrappedComponent);
  };
}

var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }

    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
}

function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}

function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    };

    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      return props;
    };

    return proxy;
  };
}

function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}

function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
    return {
      dispatch: dispatch
    };
  }) : undefined;
}

function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(function (dispatch) {
    return (0, _redux.bindActionCreators)(mapDispatchToProps, dispatch);
  }) : undefined;
}

var defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}

function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function () {
    return {};
  }) : undefined;
}

var defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, ownProps, stateProps, dispatchProps);
}

function wrapMergePropsFunc(mergeProps) {
  return function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;
    var hasRunOnce = false;
    var mergedProps;
    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;
      }

      return mergedProps;
    };
  };
}

function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}

function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function () {
    return defaultMergeProps;
  } : undefined;
}

var defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}

function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;
  var hasRunAtLeastOnce = false;
  var state;
  var ownProps;
  var stateProps;
  var dispatchProps;
  var mergedProps;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;
    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;
    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
}

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutPropertiesLoose(_ref2, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);
  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
  };
}

function strictEqual(a, b) {
  return a === b;
}

function createConnect(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? defaultMapStateToPropsFactories : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? defaultMapDispatchToPropsFactories : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === void 0 ? defaultMergePropsFactories : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === void 0 ? finalPropsSelectorFactory : _ref$selectorFactory;

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _temp2) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$pure = _ref2.pure,
        pure = _ref2$pure === void 0 ? true : _ref2$pure,
        _ref2$areStatesEqual = _ref2.areStatesEqual,
        areStatesEqual = _ref2$areStatesEqual === void 0 ? strictEqual : _ref2$areStatesEqual,
        _ref2$areOwnPropsEqua = _ref2.areOwnPropsEqual,
        areOwnPropsEqual = _ref2$areOwnPropsEqua === void 0 ? shallowEqual : _ref2$areOwnPropsEqua,
        _ref2$areStatePropsEq = _ref2.areStatePropsEqual,
        areStatePropsEqual = _ref2$areStatePropsEq === void 0 ? shallowEqual : _ref2$areStatePropsEq,
        _ref2$areMergedPropsE = _ref2.areMergedPropsEqual,
        areMergedPropsEqual = _ref2$areMergedPropsE === void 0 ? shallowEqual : _ref2$areMergedPropsE,
        extraOptions = _objectWithoutPropertiesLoose(_ref2, ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"]);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    return connectHOC(selectorFactory, _extends({
      methodName: 'connect',
      getDisplayName: function getDisplayName(name) {
        return "Connect(" + name + ")";
      },
      shouldHandleStateChanges: Boolean(mapStateToProps),
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual
    }, extraOptions));
  };
}

var connect = createConnect();
exports.connect = connect;
var index = {
  Provider: Provider,
  connect: connect,
  connectAdvanced: connectAdvanced,
  ReactReduxContext: ReactReduxContext
};
var _default = index;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","preact-context":"node_modules/preact-context/dist/context.min.js","redux":"node_modules/redux/es/redux.js"}],"src/game/interface.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DistanceEnum = exports.MotionEnum = exports.StandingEnum = exports.PoiseEnum = exports.PredictionEnum = void 0;
var PredictionEnum;
exports.PredictionEnum = PredictionEnum;

(function (PredictionEnum) {
  PredictionEnum["NONE"] = "None";
  PredictionEnum["DISTANCE"] = "Distance";
  PredictionEnum["STANDING"] = "Standing";
  PredictionEnum["MOTION"] = "Motion";
})(PredictionEnum || (exports.PredictionEnum = PredictionEnum = {}));

var PoiseEnum;
exports.PoiseEnum = PoiseEnum;

(function (PoiseEnum) {
  PoiseEnum[PoiseEnum["BALANCED"] = 0] = "BALANCED";
  PoiseEnum[PoiseEnum["UNBALANCED"] = 1] = "UNBALANCED";
  PoiseEnum[PoiseEnum["ANTICIPATING"] = 2] = "ANTICIPATING";
})(PoiseEnum || (exports.PoiseEnum = PoiseEnum = {}));

var StandingEnum;
exports.StandingEnum = StandingEnum;

(function (StandingEnum) {
  StandingEnum[StandingEnum["PRONE"] = 0] = "PRONE";
  StandingEnum[StandingEnum["STANDING"] = 1] = "STANDING";
})(StandingEnum || (exports.StandingEnum = StandingEnum = {}));

var MotionEnum;
exports.MotionEnum = MotionEnum;

(function (MotionEnum) {
  MotionEnum[MotionEnum["STILL"] = 0] = "STILL";
  MotionEnum[MotionEnum["MOVING"] = 1] = "MOVING";
})(MotionEnum || (exports.MotionEnum = MotionEnum = {}));

var DistanceEnum;
exports.DistanceEnum = DistanceEnum;

(function (DistanceEnum) {
  DistanceEnum[DistanceEnum["GRAPPLED"] = 0] = "GRAPPLED";
  DistanceEnum[DistanceEnum["CLOSE"] = 1] = "CLOSE";
  DistanceEnum[DistanceEnum["FAR"] = 2] = "FAR";
})(DistanceEnum || (exports.DistanceEnum = DistanceEnum = {}));
},{}],"src/game/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameActionEnum = void 0;
var GameActionEnum;
exports.GameActionEnum = GameActionEnum;

(function (GameActionEnum) {
  GameActionEnum["REPLACE_STATE"] = "replaceGameState";
  GameActionEnum["START_GAME"] = "startGame";
  GameActionEnum["PICKED_CARD"] = "pickedCard";
  GameActionEnum["MADE_PREDICTION"] = "madePrediction";
  GameActionEnum["SHOULD_PICK_ONE"] = "shouldPickOne";
  GameActionEnum["DID_PICK_ONE"] = "didPickOne";
  GameActionEnum["SHOULD_PICK_FORCEFUL"] = "shouldPickForceful";
  GameActionEnum["DID_PICK_FORCEFUL"] = "didPickForceful";
  GameActionEnum["SWAPPED_CARD_DISPLAY_MODE"] = "swapCardDisplayMode";
})(GameActionEnum || (exports.GameActionEnum = GameActionEnum = {}));
},{}],"src/game/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gameReducer = void 0;

var _interface = require("./interface");

var _actions = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var gameReducer = function gameReducer(state, action) {
  if (state === void 0) {
    state = makeDefaultGameState();
  }

  switch (action.type) {
    case _actions.GameActionEnum.REPLACE_STATE:
      return __assign(__assign(__assign({}, state), action.gameState), {
        hasGameState: true
      });

    case _actions.GameActionEnum.START_GAME:
      return __assign(__assign({}, state), {
        player: action.player
      });

    case _actions.GameActionEnum.SHOULD_PICK_ONE:
      return __assign(__assign({}, state), {
        choices: action.choices
      });

    case _actions.GameActionEnum.DID_PICK_ONE:
      return __assign(__assign({}, state), {
        choices: undefined
      });

    case _actions.GameActionEnum.SHOULD_PICK_FORCEFUL:
      return __assign(__assign({}, state), {
        forceful: action.option
      });

    case _actions.GameActionEnum.DID_PICK_FORCEFUL:
      return __assign(__assign({}, state), {
        forceful: undefined
      });

    case _actions.GameActionEnum.SWAPPED_CARD_DISPLAY_MODE:
      return swapDisplayMode(state, action);

    default:
      return state;
  }
};

exports.gameReducer = gameReducer;

var swapDisplayMode = function swapDisplayMode(state, _a) {
  var _b = _a.cardLoc,
      turn = _b.turn,
      player = _b.player,
      index = _b.index;

  var queue = __spreadArrays(state.queue);

  var turnColumn = __spreadArrays(queue[turn]);

  var playerCards = __spreadArrays(turnColumn[player]);

  var card = __assign({}, playerCards[index]);

  card.showFullCard = !card.showFullCard;
  playerCards[index] = card;
  turnColumn[player] = playerCards;
  queue[turn] = turnColumn;
  return __assign(__assign({}, state), {
    queue: queue
  });
};

var makeDefaultGameState = function makeDefaultGameState() {
  return {
    health: [],
    playerStates: [],
    stateDurations: [],
    block: [],
    queue: [],
    distance: _interface.DistanceEnum.FAR,
    currentPlayer: 0,
    damaged: [],
    player: 0,
    turnNumber: 0,
    lockedState: {
      distance: null,
      players: [{
        motion: null,
        poise: null,
        stance: null
      }, {
        motion: null,
        poise: null,
        stance: null
      }]
    }
  };
};
},{"./interface":"src/game/interface.ts","./actions":"src/game/actions.ts"}],"src/hand/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandActionEnum = void 0;
var HandActionEnum;
exports.HandActionEnum = HandActionEnum;

(function (HandActionEnum) {
  HandActionEnum["PICKED_CARD"] = "pickCard";
  HandActionEnum["GOT_HAND_STATE"] = "gotHandState";
  HandActionEnum["OPPONENT_GOT_CARDS"] = "opponentGotCards";
  HandActionEnum["OPPONENT_PICKED_CARD"] = "opponentPickedCard";
})(HandActionEnum || (exports.HandActionEnum = HandActionEnum = {}));
},{}],"node_modules/parseuri/index.js":[function(require,module,exports) {
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],"node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],"node_modules/debug/src/common.js":[function(require,module,exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":"node_modules/ms/index.js"}],"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log(...args) {
  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return typeof console === 'object' && console.log && console.log(...args);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  let r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
const {
  formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
},{"./common":"node_modules/debug/src/common.js","process":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/process/browser.js"}],"node_modules/socket.io-client/lib/url.js":[function(require,module,exports) {

/**
 * Module dependencies.
 */

var parseuri = require('parseuri');
var debug = require('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url (uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || (typeof location !== 'undefined' && location);
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

  return obj;
}

},{"parseuri":"node_modules/parseuri/index.js","debug":"node_modules/debug/src/browser.js"}],"node_modules/socket.io-parser/node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],"node_modules/socket.io-parser/node_modules/debug/src/debug.js":[function(require,module,exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":"node_modules/socket.io-parser/node_modules/ms/index.js"}],"node_modules/socket.io-parser/node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */
exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */


exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  var useColors = this.useColors;
  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);
  if (!useColors) return;
  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;

    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.debug;
  } catch (e) {} // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */


exports.enable(load());
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
},{"./debug":"node_modules/socket.io-parser/node_modules/debug/src/debug.js","process":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/process/browser.js"}],"node_modules/component-emitter/index.js":[function(require,module,exports) {

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/base64-js/index.js","ieee754":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/ieee754/index.js","isarray":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/isarray/index.js","buffer":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/buffer/index.js"}],"node_modules/socket.io-parser/is-buffer.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;

module.exports = isBuf;

var withNativeBuffer = typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function';
var withNativeArrayBuffer = typeof ArrayBuffer === 'function';

var isView = function (obj) {
  return typeof ArrayBuffer.isView === 'function' ? ArrayBuffer.isView(obj) : (obj.buffer instanceof ArrayBuffer);
};

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (withNativeBuffer && Buffer.isBuffer(obj)) ||
          (withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)));
}

},{"buffer":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/buffer/index.js"}],"node_modules/socket.io-parser/binary.js":[function(require,module,exports) {
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = require('isarray');
var isBuf = require('./is-buffer');
var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === 'function' || (typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]');
var withNativeFile = typeof File === 'function' || (typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (isBuf(data)) {
    var placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (isArray(data)) {
    var newData = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === 'object' && !(data instanceof Date)) {
    var newData = {};
    for (var key in data) {
      newData[key] = _deconstructPacket(data[key], buffers);
    }
    return newData;
  }
  return data;
}

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful
  return packet;
};

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === 'object') {
    for (var key in data) {
      data[key] = _reconstructPacket(data[key], buffers);
    }
  }

  return data;
}

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (typeof obj === 'object' && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

},{"isarray":"node_modules/isarray/index.js","./is-buffer":"node_modules/socket.io-parser/is-buffer.js"}],"node_modules/socket.io-parser/index.js":[function(require,module,exports) {

/**
 * Module dependencies.
 */

var debug = require('debug')('socket.io-parser');
var Emitter = require('component-emitter');
var binary = require('./binary');
var isArray = require('isarray');
var isBuf = require('./is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

var ERROR_PACKET = exports.ERROR + '"encode error"';

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    encodeAsBinary(obj, callback);
  } else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    var payload = tryStringify(obj.data);
    if (payload !== false) {
      str += payload;
    } else {
      return ERROR_PACKET;
    }
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

function tryStringify(str) {
  try {
    return JSON.stringify(str);
  } catch(e){
    return false;
  }
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an encoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if (typeof obj === 'string') {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  } else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  } else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) {
    return error('unknown packet type ' + p.type);
  }

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var buf = '';
    while (str.charAt(++i) !== '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      p.nsp += c;
      if (i === str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i === str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    var payload = tryParse(str.substr(i));
    var isPayloadValid = payload !== false && (p.type === exports.ERROR || isArray(payload));
    if (isPayloadValid) {
      p.data = payload;
    } else {
      return error('invalid payload');
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch(e){
    return false;
  }
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(msg) {
  return {
    type: exports.ERROR,
    data: 'parser error: ' + msg
  };
}

},{"debug":"node_modules/socket.io-parser/node_modules/debug/src/browser.js","component-emitter":"node_modules/component-emitter/index.js","./binary":"node_modules/socket.io-parser/binary.js","isarray":"node_modules/isarray/index.js","./is-buffer":"node_modules/socket.io-parser/is-buffer.js"}],"node_modules/has-cors/index.js":[function(require,module,exports) {

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{}],"node_modules/engine.io-client/lib/xmlhttprequest.js":[function(require,module,exports) {
// browser shim for xmlhttprequest module

var hasCORS = require('has-cors');

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new self[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) { }
  }
};

},{"has-cors":"node_modules/has-cors/index.js"}],"node_modules/engine.io-parser/lib/keys.js":[function(require,module,exports) {

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],"node_modules/has-binary2/index.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
/* global Blob File */

/*
 * Module requirements.
 */

var isArray = require('isarray');

var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === 'function' ||
                        typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]';
var withNativeFile = typeof File === 'function' ||
                        typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]';

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary (obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }

  if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
    (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
    (withNativeBlob && obj instanceof Blob) ||
    (withNativeFile && obj instanceof File)
  ) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}

},{"isarray":"node_modules/isarray/index.js","buffer":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/buffer/index.js"}],"node_modules/arraybuffer.slice/index.js":[function(require,module,exports) {
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],"node_modules/after/index.js":[function(require,module,exports) {
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],"node_modules/engine.io-parser/lib/utf8.js":[function(require,module,exports) {
/*! https://mths.be/utf8js v2.1.2 by @mathias */

var stringFromCharCode = String.fromCharCode;

// Taken from https://mths.be/punycode
function ucs2decode(string) {
	var output = [];
	var counter = 0;
	var length = string.length;
	var value;
	var extra;
	while (counter < length) {
		value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// high surrogate, and there is a next character
			extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // low surrogate
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// unmatched surrogate; only append this code unit, in case the next
				// code unit is the high surrogate of a surrogate pair
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

// Taken from https://mths.be/punycode
function ucs2encode(array) {
	var length = array.length;
	var index = -1;
	var value;
	var output = '';
	while (++index < length) {
		value = array[index];
		if (value > 0xFFFF) {
			value -= 0x10000;
			output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
			value = 0xDC00 | value & 0x3FF;
		}
		output += stringFromCharCode(value);
	}
	return output;
}

function checkScalarValue(codePoint, strict) {
	if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
		if (strict) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
		return false;
	}
	return true;
}
/*--------------------------------------------------------------------------*/

function createByte(codePoint, shift) {
	return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}

function encodeCodePoint(codePoint, strict) {
	if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
		return stringFromCharCode(codePoint);
	}
	var symbol = '';
	if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
		symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
	}
	else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
		if (!checkScalarValue(codePoint, strict)) {
			codePoint = 0xFFFD;
		}
		symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
		symbol += createByte(codePoint, 6);
	}
	else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
		symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
		symbol += createByte(codePoint, 12);
		symbol += createByte(codePoint, 6);
	}
	symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
	return symbol;
}

function utf8encode(string, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	var codePoints = ucs2decode(string);
	var length = codePoints.length;
	var index = -1;
	var codePoint;
	var byteString = '';
	while (++index < length) {
		codePoint = codePoints[index];
		byteString += encodeCodePoint(codePoint, strict);
	}
	return byteString;
}

/*--------------------------------------------------------------------------*/

function readContinuationByte() {
	if (byteIndex >= byteCount) {
		throw Error('Invalid byte index');
	}

	var continuationByte = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	if ((continuationByte & 0xC0) == 0x80) {
		return continuationByte & 0x3F;
	}

	// If we end up here, it’s not a continuation byte
	throw Error('Invalid continuation byte');
}

function decodeSymbol(strict) {
	var byte1;
	var byte2;
	var byte3;
	var byte4;
	var codePoint;

	if (byteIndex > byteCount) {
		throw Error('Invalid byte index');
	}

	if (byteIndex == byteCount) {
		return false;
	}

	// Read first byte
	byte1 = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	// 1-byte sequence (no continuation bytes)
	if ((byte1 & 0x80) == 0) {
		return byte1;
	}

	// 2-byte sequence
	if ((byte1 & 0xE0) == 0xC0) {
		byte2 = readContinuationByte();
		codePoint = ((byte1 & 0x1F) << 6) | byte2;
		if (codePoint >= 0x80) {
			return codePoint;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 3-byte sequence (may include unpaired surrogates)
	if ((byte1 & 0xF0) == 0xE0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
		if (codePoint >= 0x0800) {
			return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 4-byte sequence
	if ((byte1 & 0xF8) == 0xF0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		byte4 = readContinuationByte();
		codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
			(byte3 << 0x06) | byte4;
		if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
			return codePoint;
		}
	}

	throw Error('Invalid UTF-8 detected');
}

var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	byteArray = ucs2decode(byteString);
	byteCount = byteArray.length;
	byteIndex = 0;
	var codePoints = [];
	var tmp;
	while ((tmp = decodeSymbol(strict)) !== false) {
		codePoints.push(tmp);
	}
	return ucs2encode(codePoints);
}

module.exports = {
	version: '2.1.2',
	encode: utf8encode,
	decode: utf8decode
};

},{}],"node_modules/base64-arraybuffer/lib/base64-arraybuffer.js":[function(require,module,exports) {
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function () {
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // Use a lookup table to find the index.

  var lookup = new Uint8Array(256);

  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function (arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
        i,
        len = bytes.length,
        base64 = "";

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
      base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
      base64 += chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode = function (base64) {
    var bufferLength = base64.length * 0.75,
        len = base64.length,
        i,
        p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;

      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return arraybuffer;
  };
})();
},{}],"node_modules/blob/index.js":[function(require,module,exports) {
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
  typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
  false;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  return ary.map(function(chunk) {
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      return buf;
    }

    return chunk;
  });
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary).forEach(function(part) {
    bb.append(part);
  });

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  return new Blob(mapArrayBufferViews(ary), options || {});
};

if (typeof Blob !== 'undefined') {
  BlobBuilderConstructor.prototype = Blob.prototype;
  BlobConstructor.prototype = Blob.prototype;
}

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

},{}],"node_modules/engine.io-parser/lib/browser.js":[function(require,module,exports) {
/**
 * Module dependencies.
 */

var keys = require('./keys');
var hasBinary = require('has-binary2');
var sliceBuffer = require('arraybuffer.slice');
var after = require('after');
var utf8 = require('./utf8');

var base64encoder;
if (typeof ArrayBuffer !== 'undefined') {
  base64encoder = require('base64-arraybuffer');
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = require('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (typeof Blob !== 'undefined' && packet.data instanceof Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data === 'string') {
    if (data.charAt(0) === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '', n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || (length != (n = Number(length)))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var ret = callback(packet, i + n, l);
      if (false === ret) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] === 255) break;

      // 310 = char length of Number.MAX_VALUE
      if (msgLength.length > 310) {
        return callback(err, 0, 1);
      }

      msgLength += tailArray[i];
    }

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

},{"./keys":"node_modules/engine.io-parser/lib/keys.js","has-binary2":"node_modules/has-binary2/index.js","arraybuffer.slice":"node_modules/arraybuffer.slice/index.js","after":"node_modules/after/index.js","./utf8":"node_modules/engine.io-parser/lib/utf8.js","base64-arraybuffer":"node_modules/base64-arraybuffer/lib/base64-arraybuffer.js","blob":"node_modules/blob/index.js"}],"node_modules/engine.io-client/lib/transport.js":[function(require,module,exports) {
/**
 * Module dependencies.
 */

var parser = require('engine.io-parser');
var Emitter = require('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;
  this.withCredentials = opts.withCredentials;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // results of ReactNative environment detection
  this.isReactNative = opts.isReactNative;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"engine.io-parser":"node_modules/engine.io-parser/lib/browser.js","component-emitter":"node_modules/component-emitter/index.js"}],"node_modules/parseqs/index.js":[function(require,module,exports) {
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],"node_modules/component-inherit/index.js":[function(require,module,exports) {

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],"node_modules/yeast/index.js":[function(require,module,exports) {
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

},{}],"node_modules/engine.io-client/lib/transports/polling.js":[function(require,module,exports) {
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parseqs = require('parseqs');
var parser = require('engine.io-parser');
var inherit = require('component-inherit');
var yeast = require('yeast');
var debug = require('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = require('xmlhttprequest-ssl');
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

},{"../transport":"node_modules/engine.io-client/lib/transport.js","parseqs":"node_modules/parseqs/index.js","engine.io-parser":"node_modules/engine.io-parser/lib/browser.js","component-inherit":"node_modules/component-inherit/index.js","yeast":"node_modules/yeast/index.js","debug":"node_modules/debug/src/browser.js","xmlhttprequest-ssl":"node_modules/engine.io-client/lib/xmlhttprequest.js"}],"node_modules/engine.io-client/lib/transports/polling-xhr.js":[function(require,module,exports) {
/* global attachEvent */

/**
 * Module requirements.
 */

var XMLHttpRequest = require('xmlhttprequest-ssl');
var Polling = require('./polling');
var Emitter = require('component-emitter');
var inherit = require('component-inherit');
var debug = require('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = (typeof location !== 'undefined' && opts.hostname !== location.hostname) ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;
  opts.withCredentials = this.withCredentials;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.withCredentials = opts.withCredentials;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = this.withCredentials;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          try {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (self.supportsBinary && contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
              xhr.responseType = 'arraybuffer';
            }
          } catch (e) {}
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(typeof xhr.status === 'number' ? xhr.status : 0);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (typeof document !== 'undefined') {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (typeof document !== 'undefined') {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (typeof document !== 'undefined') {
  if (typeof attachEvent === 'function') {
    attachEvent('onunload', unloadHandler);
  } else if (typeof addEventListener === 'function') {
    var terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';
    addEventListener(terminationEvent, unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

},{"xmlhttprequest-ssl":"node_modules/engine.io-client/lib/xmlhttprequest.js","./polling":"node_modules/engine.io-client/lib/transports/polling.js","component-emitter":"node_modules/component-emitter/index.js","component-inherit":"node_modules/component-inherit/index.js","debug":"node_modules/debug/src/browser.js"}],"node_modules/engine.io-client/lib/transports/polling-jsonp.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Module requirements.
 */

var Polling = require('./polling');
var inherit = require('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty () { }

/**
 * Until https://github.com/tc39/proposal-global is shipped.
 */
function glob () {
  return typeof self !== 'undefined' ? self
      : typeof window !== 'undefined' ? window
      : typeof global !== 'undefined' ? global : {};
}

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    var global = glob();
    callbacks = global.___eio = (global.___eio || []);
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (typeof addEventListener === 'function') {
    addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

},{"./polling":"node_modules/engine.io-client/lib/transports/polling.js","component-inherit":"node_modules/component-inherit/index.js"}],"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/engine.io-client/lib/transports/websocket.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parser = require('engine.io-parser');
var parseqs = require('parseqs');
var inherit = require('component-inherit');
var yeast = require('yeast');
var debug = require('debug')('engine.io-client:websocket');

var BrowserWebSocket, NodeWebSocket;

if (typeof WebSocket !== 'undefined') {
  BrowserWebSocket = WebSocket;
} else if (typeof self !== 'undefined') {
  BrowserWebSocket = self.WebSocket || self.MozWebSocket;
}

if (typeof window === 'undefined') {
  try {
    NodeWebSocket = require('ws');
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocketImpl = BrowserWebSocket || NodeWebSocket;

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocketImpl = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws =
      this.usingBrowserWebSocket && !this.isReactNative
        ? protocols
          ? new WebSocketImpl(uri, protocols)
          : new WebSocketImpl(uri)
        : new WebSocketImpl(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
};

},{"../transport":"node_modules/engine.io-client/lib/transport.js","engine.io-parser":"node_modules/engine.io-parser/lib/browser.js","parseqs":"node_modules/parseqs/index.js","component-inherit":"node_modules/component-inherit/index.js","yeast":"node_modules/yeast/index.js","debug":"node_modules/debug/src/browser.js","ws":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/src/builtins/_empty.js","buffer":"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/node_modules/buffer/index.js"}],"node_modules/engine.io-client/lib/transports/index.js":[function(require,module,exports) {
/**
 * Module dependencies
 */

var XMLHttpRequest = require('xmlhttprequest-ssl');
var XHR = require('./polling-xhr');
var JSONP = require('./polling-jsonp');
var websocket = require('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

},{"xmlhttprequest-ssl":"node_modules/engine.io-client/lib/xmlhttprequest.js","./polling-xhr":"node_modules/engine.io-client/lib/transports/polling-xhr.js","./polling-jsonp":"node_modules/engine.io-client/lib/transports/polling-jsonp.js","./websocket":"node_modules/engine.io-client/lib/transports/websocket.js"}],"node_modules/indexof/index.js":[function(require,module,exports) {

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],"node_modules/engine.io-client/lib/socket.js":[function(require,module,exports) {
/**
 * Module dependencies.
 */

var transports = require('./transports/index');
var Emitter = require('component-emitter');
var debug = require('debug')('engine.io-client:socket');
var index = require('indexof');
var parser = require('engine.io-parser');
var parseuri = require('parseuri');
var parseqs = require('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (typeof location !== 'undefined' && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (typeof location !== 'undefined' ? location.hostname : 'localhost');
  this.port = opts.port || (typeof location !== 'undefined' && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.withCredentials = false !== opts.withCredentials;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // detect ReactNative environment
  this.isReactNative = (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative');

  // other options for Node.js or ReactNative client
  if (typeof self === 'undefined' || this.isReactNative) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = require('./transport');
Socket.transports = require('./transports/index');
Socket.parser = require('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    withCredentials: options.withCredentials || this.withCredentials,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void (0),
    isReactNative: this.isReactNative
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(JSON.parse(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

},{"./transports/index":"node_modules/engine.io-client/lib/transports/index.js","component-emitter":"node_modules/component-emitter/index.js","debug":"node_modules/debug/src/browser.js","indexof":"node_modules/indexof/index.js","engine.io-parser":"node_modules/engine.io-parser/lib/browser.js","parseuri":"node_modules/parseuri/index.js","parseqs":"node_modules/parseqs/index.js","./transport":"node_modules/engine.io-client/lib/transport.js"}],"node_modules/engine.io-client/lib/index.js":[function(require,module,exports) {

module.exports = require('./socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = require('engine.io-parser');

},{"./socket":"node_modules/engine.io-client/lib/socket.js","engine.io-parser":"node_modules/engine.io-parser/lib/browser.js"}],"node_modules/to-array/index.js":[function(require,module,exports) {
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}],"node_modules/socket.io-client/lib/on.js":[function(require,module,exports) {

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on (obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function () {
      obj.removeListener(ev, fn);
    }
  };
}

},{}],"node_modules/component-bind/index.js":[function(require,module,exports) {
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],"node_modules/socket.io-client/lib/socket.js":[function(require,module,exports) {

/**
 * Module dependencies.
 */

var parser = require('socket.io-parser');
var Emitter = require('component-emitter');
var toArray = require('to-array');
var on = require('./on');
var bind = require('component-bind');
var debug = require('debug')('socket.io-client:socket');
var parseqs = require('parseqs');
var hasBin = require('has-binary2');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket (io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  this.flags = {};
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var packet = {
    type: (this.flags.binary !== undefined ? this.flags.binary : hasBin(args)) ? parser.BINARY_EVENT : parser.EVENT,
    data: args
  };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  this.flags = {};

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
      debug('sending connect packet with query %s', query);
      this.packet({type: parser.CONNECT, query: query});
    } else {
      this.packet({type: parser.CONNECT});
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  var sameNamespace = packet.nsp === this.nsp;
  var rootNamespaceError = packet.type === parser.ERROR && packet.nsp === '/';

  if (!sameNamespace && !rootNamespaceError) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    self.packet({
      type: hasBin(args) ? parser.BINARY_ACK : parser.ACK,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags.compress = compress;
  return this;
};

/**
 * Sets the binary flag
 *
 * @param {Boolean} whether the emitted data contains binary
 * @return {Socket} self
 * @api public
 */

Socket.prototype.binary = function (binary) {
  this.flags.binary = binary;
  return this;
};

},{"socket.io-parser":"node_modules/socket.io-parser/index.js","component-emitter":"node_modules/component-emitter/index.js","to-array":"node_modules/to-array/index.js","./on":"node_modules/socket.io-client/lib/on.js","component-bind":"node_modules/component-bind/index.js","debug":"node_modules/debug/src/browser.js","parseqs":"node_modules/parseqs/index.js","has-binary2":"node_modules/has-binary2/index.js"}],"node_modules/backo2/index.js":[function(require,module,exports) {

/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};


},{}],"node_modules/socket.io-client/lib/manager.js":[function(require,module,exports) {

/**
 * Module dependencies.
 */

var eio = require('engine.io-client');
var Socket = require('./socket');
var Emitter = require('component-emitter');
var parser = require('socket.io-parser');
var on = require('./on');
var bind = require('component-bind');
var debug = require('debug')('socket.io-client:manager');
var indexOf = require('indexof');
var Backoff = require('backo2');

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager (uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  var _parser = opts.parser || parser;
  this.encoder = new _parser.Encoder();
  this.decoder = new _parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.generateId(nsp);
    }
  }
};

/**
 * generate `socket.id` for the given `nsp`
 *
 * @param {String} nsp
 * @return {String}
 * @api private
 */

Manager.prototype.generateId = function (nsp) {
  return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function (fn, opts) {
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function () {
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.generateId(nsp);
    });

    if (this.autoConnect) {
      // manually call here since connecting event is fired before listening
      onConnecting();
    }
  }

  function onConnecting () {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function () {
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

},{"engine.io-client":"node_modules/engine.io-client/lib/index.js","./socket":"node_modules/socket.io-client/lib/socket.js","component-emitter":"node_modules/component-emitter/index.js","socket.io-parser":"node_modules/socket.io-parser/index.js","./on":"node_modules/socket.io-client/lib/on.js","component-bind":"node_modules/component-bind/index.js","debug":"node_modules/debug/src/browser.js","indexof":"node_modules/indexof/index.js","backo2":"node_modules/backo2/index.js"}],"node_modules/socket.io-client/lib/index.js":[function(require,module,exports) {

/**
 * Module dependencies.
 */

var url = require('./url');
var parser = require('socket.io-parser');
var Manager = require('./manager');
var debug = require('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = require('./manager');
exports.Socket = require('./socket');

},{"./url":"node_modules/socket.io-client/lib/url.js","socket.io-parser":"node_modules/socket.io-parser/index.js","./manager":"node_modules/socket.io-client/lib/manager.js","debug":"node_modules/debug/src/browser.js","./socket":"node_modules/socket.io-client/lib/socket.js"}],"src/shared/socket.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameOverEnum = exports.SocketEnum = void 0;
var SocketEnum;
exports.SocketEnum = SocketEnum;

(function (SocketEnum) {
  SocketEnum["PICKED_CARD"] = "pickedCard";
  SocketEnum["GOT_CARDS"] = "gotCards";
  SocketEnum["JOINED_LOBBY"] = "joinedLobby";
  SocketEnum["FOUND_GAME"] = "foundGame";
  SocketEnum["START_GAME"] = "startGame";
  SocketEnum["GOT_DECK_OPTIONS"] = "gotDeckOptions";
  SocketEnum["PICKED_DECK"] = "pickedDeck";
  SocketEnum["GOT_STATE"] = "gotState";
  SocketEnum["SHOULD_PREDICT"] = "shouldPredict";
  SocketEnum["MADE_PREDICTION"] = "madePrediction";
  SocketEnum["SHOULD_PICK_ONE"] = "shouldPickOne";
  SocketEnum["PICKED_ONE"] = "pickedOne";
  SocketEnum["GOT_EVENTS"] = "gotEvents";
  SocketEnum["GOT_FORCEFUL_CHOICE"] = "gotForcefulChoice";
  SocketEnum["PICKED_FORCEFUL"] = "pickedForceful";
  SocketEnum["OPPONENT_GOT_CARDS"] = "opponentGotCards";
  SocketEnum["OPPONENT_PICKED_CARDS"] = "opponentPickedCards";
  SocketEnum["OPPONENT_IS_MAKING_CHOICES"] = "opponentIsMakingChoices";
  SocketEnum["OPPONENT_MADE_CHOICE"] = "opponentMadeChoice";
  SocketEnum["AUTHORIZATION"] = "authorization";
  SocketEnum["GAME_OVER"] = "gameOver";
  SocketEnum["END_GAME_CHOICE"] = "endGameChoice";
  SocketEnum["OPPONENT_LEFT"] = "opponentLeft";
})(SocketEnum || (exports.SocketEnum = SocketEnum = {}));

var GameOverEnum;
exports.GameOverEnum = GameOverEnum;

(function (GameOverEnum) {
  GameOverEnum["FIND_NEW_OPP_WITH_SAME_DECK"] = "findOppWithSameDeck";
  GameOverEnum["FIND_NEW_OPP_WITH_NEW_DECK"] = "findNewOppWithNewDeck";
})(GameOverEnum || (exports.GameOverEnum = GameOverEnum = {}));
},{}],"src/hand/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchGotHandState = exports.dispatchPickedCard = exports.dispatchOppPickedCard = exports.dispatchOppGotCards = void 0;

var _store = require("../state/store");

var _actions = require("./actions");

var _socket = require("../socket/socket");

var _socket2 = require("../shared/socket");

var dispatchOppGotCards = function dispatchOppGotCards(cards) {
  var action = {
    type: _actions.HandActionEnum.OPPONENT_GOT_CARDS,
    cards: cards
  };

  _store.store.dispatch(action);
};

exports.dispatchOppGotCards = dispatchOppGotCards;

var dispatchOppPickedCard = function dispatchOppPickedCard() {
  var action = {
    type: _actions.HandActionEnum.OPPONENT_PICKED_CARD
  };

  _store.store.dispatch(action);
};

exports.dispatchOppPickedCard = dispatchOppPickedCard;

var dispatchPickedCard = function dispatchPickedCard(cardNumber) {
  _socket.socket.emit(_socket2.SocketEnum.PICKED_CARD, cardNumber);

  var action = {
    type: _actions.HandActionEnum.PICKED_CARD,
    index: cardNumber
  };

  _store.store.dispatch(action);
};

exports.dispatchPickedCard = dispatchPickedCard;

var dispatchGotHandState = function dispatchGotHandState(handState) {
  var action = {
    type: _actions.HandActionEnum.GOT_HAND_STATE,
    handState: handState
  };

  _store.store.dispatch(action);
};

exports.dispatchGotHandState = dispatchGotHandState;
},{"../state/store":"src/state/store.ts","./actions":"src/hand/actions.ts","../socket/socket":"src/socket/socket.ts","../shared/socket":"src/shared/socket.ts"}],"src/display/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisplayActionEnum = void 0;
var DisplayActionEnum;
exports.DisplayActionEnum = DisplayActionEnum;

(function (DisplayActionEnum) {
  DisplayActionEnum["SWITCH_SCREEN"] = "switchScreen";
})(DisplayActionEnum || (exports.DisplayActionEnum = DisplayActionEnum = {}));
},{}],"src/display/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchSwitchScreen = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var dispatchSwitchScreen = function dispatchSwitchScreen(screen) {
  var action = {
    type: _actions.DisplayActionEnum.SWITCH_SCREEN,
    screen: screen
  };

  _store.store.dispatch(action);
};

exports.dispatchSwitchScreen = dispatchSwitchScreen;
},{"./actions":"src/display/actions.ts","../state/store":"src/state/store.ts"}],"src/display/interface.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenEnum = void 0;
var ScreenEnum;
exports.ScreenEnum = ScreenEnum;

(function (ScreenEnum) {
  ScreenEnum[ScreenEnum["CHOOSE_DECK"] = 0] = "CHOOSE_DECK";
  ScreenEnum[ScreenEnum["LOOKING_FOR_GAME"] = 1] = "LOOKING_FOR_GAME";
  ScreenEnum[ScreenEnum["CONNECTING"] = 2] = "CONNECTING";
  ScreenEnum[ScreenEnum["GAME_STARTED"] = 3] = "GAME_STARTED";
})(ScreenEnum || (exports.ScreenEnum = ScreenEnum = {}));
},{}],"src/game/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchDidPickForecful = exports.dispatchShouldPickForecful = exports.dispatchDidPickOne = exports.dispatchShouldPickOne = exports.dispatchStartGame = exports.dispatchGameState = exports.dispatchMadePrediction = exports.dispatchSwitchCardDisplayMode = void 0;

var _store = require("../state/store");

var _actions = require("./actions");

var _socket = require("../socket/socket");

var _socket2 = require("../shared/socket");

var dispatchSwitchCardDisplayMode = function dispatchSwitchCardDisplayMode(turn, player, index) {
  var action = {
    type: _actions.GameActionEnum.SWAPPED_CARD_DISPLAY_MODE,
    cardLoc: {
      turn: turn,
      player: player,
      index: index
    }
  };

  _store.store.dispatch(action);
};

exports.dispatchSwitchCardDisplayMode = dispatchSwitchCardDisplayMode;

var dispatchMadePrediction = function dispatchMadePrediction(prediction) {
  var action = {
    type: _actions.GameActionEnum.MADE_PREDICTION,
    prediction: prediction
  };

  _socket.socket.emit(_socket2.SocketEnum.MADE_PREDICTION, prediction);

  _store.store.dispatch(action);
};

exports.dispatchMadePrediction = dispatchMadePrediction;

var dispatchGameState = function dispatchGameState(gameState) {
  var action = {
    type: _actions.GameActionEnum.REPLACE_STATE,
    gameState: gameState
  };

  _store.store.dispatch(action);
};

exports.dispatchGameState = dispatchGameState;

var dispatchStartGame = function dispatchStartGame(player) {
  var action = {
    type: _actions.GameActionEnum.START_GAME,
    player: player
  };

  _store.store.dispatch(action);
};

exports.dispatchStartGame = dispatchStartGame;

var dispatchShouldPickOne = function dispatchShouldPickOne(choices) {
  var action = {
    type: _actions.GameActionEnum.SHOULD_PICK_ONE,
    choices: choices
  };

  _store.store.dispatch(action);
};

exports.dispatchShouldPickOne = dispatchShouldPickOne;

var dispatchDidPickOne = function dispatchDidPickOne(choice) {
  var action = {
    type: _actions.GameActionEnum.DID_PICK_ONE,
    choice: choice
  };
  console.log("sending picked one");

  _socket.socket.emit(_socket2.SocketEnum.PICKED_ONE, choice);

  _store.store.dispatch(action);
};

exports.dispatchDidPickOne = dispatchDidPickOne;

var dispatchShouldPickForecful = function dispatchShouldPickForecful(option) {
  var action = {
    type: _actions.GameActionEnum.SHOULD_PICK_FORCEFUL,
    option: option
  };

  _store.store.dispatch(action);
};

exports.dispatchShouldPickForecful = dispatchShouldPickForecful;

var dispatchDidPickForecful = function dispatchDidPickForecful(choice) {
  var action = {
    type: _actions.GameActionEnum.DID_PICK_FORCEFUL,
    choice: choice
  };

  _socket.socket.emit(_socket2.SocketEnum.PICKED_FORCEFUL, choice);

  _store.store.dispatch(action);
};

exports.dispatchDidPickForecful = dispatchDidPickForecful;
},{"../state/store":"src/state/store.ts","./actions":"src/game/actions.ts","../socket/socket":"src/socket/socket.ts","../shared/socket":"src/shared/socket.ts"}],"src/lobby/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LobbyActionEnum = void 0;
var LobbyActionEnum;
exports.LobbyActionEnum = LobbyActionEnum;

(function (LobbyActionEnum) {
  LobbyActionEnum["GOT_DECK_CHOICES"] = "gotDeckChoices";
  LobbyActionEnum["PICKED_DECK"] = "pickedDeck";
})(LobbyActionEnum || (exports.LobbyActionEnum = LobbyActionEnum = {}));
},{}],"src/lobby/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchPickedDeck = exports.dispatchGotDeckChoices = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var _socket = require("../socket/socket");

var _socket2 = require("../shared/socket");

var dispatchGotDeckChoices = function dispatchGotDeckChoices(choices) {
  var action = {
    type: _actions.LobbyActionEnum.GOT_DECK_CHOICES,
    choices: choices
  };

  _store.store.dispatch(action);
};

exports.dispatchGotDeckChoices = dispatchGotDeckChoices;

var dispatchPickedDeck = function dispatchPickedDeck(choice) {
  var action = {
    type: _actions.LobbyActionEnum.PICKED_DECK,
    choice: choice
  };

  _socket.socket.emit(_socket2.SocketEnum.PICKED_DECK, choice);

  _store.store.dispatch(action);
};

exports.dispatchPickedDeck = dispatchPickedDeck;
},{"./actions":"src/lobby/actions.ts","../state/store":"src/state/store.ts","../socket/socket":"src/socket/socket.ts","../shared/socket":"src/shared/socket.ts"}],"src/gameDisplay/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameDisplayActionEnum = void 0;
var GameDisplayActionEnum;
exports.GameDisplayActionEnum = GameDisplayActionEnum;

(function (GameDisplayActionEnum) {
  GameDisplayActionEnum["SHOULD_PREDICT"] = "shouldPredict";
  GameDisplayActionEnum["SET_HAND_CARD_DISPLAY"] = "setHandCardDisplay";
  GameDisplayActionEnum["PICK_FORCE"] = "pickForce";
})(GameDisplayActionEnum || (exports.GameDisplayActionEnum = GameDisplayActionEnum = {}));
},{}],"src/gameDisplay/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchSetHandCardDisplay = exports.dispatchShouldPredict = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var dispatchShouldPredict = function dispatchShouldPredict() {
  var action = {
    type: _actions.GameDisplayActionEnum.SHOULD_PREDICT
  };

  _store.store.dispatch(action);
};

exports.dispatchShouldPredict = dispatchShouldPredict;

var dispatchSetHandCardDisplay = function dispatchSetHandCardDisplay(value) {
  var action = {
    type: _actions.GameDisplayActionEnum.SET_HAND_CARD_DISPLAY,
    value: value
  };

  _store.store.dispatch(action);
};

exports.dispatchSetHandCardDisplay = dispatchSetHandCardDisplay;
},{"./actions":"src/gameDisplay/actions.ts","../state/store":"src/state/store.ts"}],"src/events/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventActionEnum = void 0;
var EventActionEnum;
exports.EventActionEnum = EventActionEnum;

(function (EventActionEnum) {
  EventActionEnum["GOT_EVENTS"] = "gotEvents";
  EventActionEnum["FINISHED_DISPLAYING_EVENTS"] = "finishedDisplayingEvents";
  EventActionEnum["DISPLAY_EVENT_HISTORY"] = "displayEventHistory";
})(EventActionEnum || (exports.EventActionEnum = EventActionEnum = {}));
},{}],"src/events/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchDisplayEventHistory = exports.dispatchFinishedDisplayingEvents = exports.dispatchGotEvents = void 0;

var _store = require("../state/store");

var _actions = require("./actions");

var dispatchGotEvents = function dispatchGotEvents(events) {
  var action = {
    type: _actions.EventActionEnum.GOT_EVENTS,
    events: events
  };

  _store.store.dispatch(action);
};

exports.dispatchGotEvents = dispatchGotEvents;

var dispatchFinishedDisplayingEvents = function dispatchFinishedDisplayingEvents() {
  var action = {
    type: _actions.EventActionEnum.FINISHED_DISPLAYING_EVENTS
  };

  _store.store.dispatch(action);
};

exports.dispatchFinishedDisplayingEvents = dispatchFinishedDisplayingEvents;

var dispatchDisplayEventHistory = function dispatchDisplayEventHistory(index) {
  var action = {
    type: _actions.EventActionEnum.DISPLAY_EVENT_HISTORY,
    index: index
  };

  _store.store.dispatch(action);
};

exports.dispatchDisplayEventHistory = dispatchDisplayEventHistory;
},{"../state/store":"src/state/store.ts","./actions":"src/events/actions.ts"}],"src/socket/socketMessages.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSockets = void 0;

var _dispatch = require("../hand/dispatch");

var _dispatch2 = require("../display/dispatch");

var _interface = require("../display/interface");

var _dispatch3 = require("../game/dispatch");

var _socket = require("../shared/socket");

var _dispatch4 = require("../lobby/dispatch");

var _dispatch5 = require("../gameDisplay/dispatch");

var _dispatch6 = require("../events/dispatch");

var setupSockets = function setupSockets(socket) {
  console.log("running socket messsages"); // socket.emit(SocketEnum.AUTHORIZATION, store.getState().user.token || null);

  socket.on(_socket.SocketEnum.JOINED_LOBBY, function () {
    console.log("joined lobby");
    (0, _dispatch2.dispatchSwitchScreen)(_interface.ScreenEnum.LOOKING_FOR_GAME);
  });
  socket.on(_socket.SocketEnum.GOT_CARDS, function (handState) {
    console.log("got hand State", handState);
    (0, _dispatch.dispatchGotHandState)(handState);
  });
  socket.on(_socket.SocketEnum.START_GAME, function (_a) {
    var player = _a.player;
    console.log("game started");
    (0, _dispatch3.dispatchStartGame)(player);
  });
  socket.on(_socket.SocketEnum.GOT_DECK_OPTIONS, function (choices) {
    console.log("got deck options: ", choices);
    (0, _dispatch4.dispatchGotDeckChoices)(choices);
  });
  socket.on(_socket.SocketEnum.GOT_STATE, function (state) {
    console.log("gotState", state);
    (0, _dispatch3.dispatchGameState)(state);
  });
  socket.on(_socket.SocketEnum.SHOULD_PREDICT, function () {
    console.log("should predict");
    (0, _dispatch5.dispatchShouldPredict)();
  });
  socket.on(_socket.SocketEnum.SHOULD_PICK_ONE, function (choices) {
    console.log("pick one", choices);
    (0, _dispatch3.dispatchShouldPickOne)(choices);
  });
  socket.on(_socket.SocketEnum.GOT_EVENTS, function (events) {
    console.log("gotEvents", events);
    (0, _dispatch6.dispatchGotEvents)(events);
  });
  socket.on(_socket.SocketEnum.GOT_FORCEFUL_CHOICE, function (options) {
    (0, _dispatch3.dispatchShouldPickForecful)(options);
  });
  socket.on(_socket.SocketEnum.OPPONENT_GOT_CARDS, function (cards) {
    console.log("opponent got cards");
    (0, _dispatch.dispatchOppGotCards)(cards);
  });
  socket.on(_socket.SocketEnum.OPPONENT_PICKED_CARDS, function () {
    console.log("opponent picked cards");
    (0, _dispatch.dispatchOppPickedCard)();
  });
};

exports.setupSockets = setupSockets;
},{"../hand/dispatch":"src/hand/dispatch.ts","../display/dispatch":"src/display/dispatch.ts","../display/interface":"src/display/interface.ts","../game/dispatch":"src/game/dispatch.ts","../shared/socket":"src/shared/socket.ts","../lobby/dispatch":"src/lobby/dispatch.ts","../gameDisplay/dispatch":"src/gameDisplay/dispatch.ts","../events/dispatch":"src/events/dispatch.ts"}],"src/socket/socket.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disconnectSocket = exports.connectSocket = exports.socket = void 0;

var socketClient = _interopRequireWildcard(require("socket.io-client"));

var _socketMessages = require("./socketMessages");

var _store = require("../state/store");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var url;

if (location.host.split(':')[0] === 'localhost') {
  url = 'localhost:8080';
}

var socket;
exports.socket = socket;

var connectSocket = function connectSocket() {
  var token = _store.store.getState().user.token; //Token is in b64. This contains a couple characters (= and +) that are not URI safe. 


  exports.socket = socket = socketClient.connect(url, {
    query: {
      token: token
    }
  });
  (0, _socketMessages.setupSockets)(socket);
  return socket;
};

exports.connectSocket = connectSocket;

var disconnectSocket = function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }

  exports.socket = socket = null;
  return null;
};

exports.disconnectSocket = disconnectSocket;
},{"socket.io-client":"node_modules/socket.io-client/lib/index.js","./socketMessages":"src/socket/socketMessages.ts","../state/store":"src/state/store.ts"}],"src/hand/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handReducer = void 0;

var _actions = require("./actions");

var _socket = require("../socket/socket");

var _socket2 = require("../shared/socket");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var handReducer = function handReducer(state, action) {
  if (state === void 0) {
    state = makeDefaultState();
  }

  switch (action.type) {
    case _actions.HandActionEnum.GOT_HAND_STATE:
      return __assign(__assign(__assign({}, state), action.handState), {
        showHand: true
      });

    case _actions.HandActionEnum.PICKED_CARD:
      return pickedCardReducer(state, action);

    default:
      return state;
  }
};

exports.handReducer = handReducer;

var pickedCardReducer = function pickedCardReducer(state, _a) {
  var index = _a.index;

  _socket.socket.send(_socket2.SocketEnum.PICKED_CARD, index);

  return __assign(__assign({}, state), {
    showHand: false
  });
};

var makeDefaultState = function makeDefaultState() {
  return {
    hands: [],
    showHand: false
  };
};
},{"./actions":"src/hand/actions.ts","../socket/socket":"src/socket/socket.ts","../shared/socket":"src/shared/socket.ts"}],"src/display/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayReducer = void 0;

var _interface = require("./interface");

var _actions = require("./actions");

var _actions2 = require("../game/actions");

var _actions3 = require("../lobby/actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var displayReducer = function displayReducer(state, action) {
  if (state === void 0) {
    state = {
      url: location.pathname,
      screen: _interface.ScreenEnum.CONNECTING
    };
  }

  switch (action.type) {
    case _actions.DisplayActionEnum.SWITCH_SCREEN:
      return __assign(__assign({}, state), {
        screen: action.screen
      });

    case _actions3.LobbyActionEnum.GOT_DECK_CHOICES:
      return __assign(__assign({}, state), {
        screen: _interface.ScreenEnum.CHOOSE_DECK
      });

    case _actions2.GameActionEnum.START_GAME:
      return __assign(__assign({}, state), {
        screen: _interface.ScreenEnum.GAME_STARTED
      });

    default:
      return state;
  }
};

exports.displayReducer = displayReducer;
},{"./interface":"src/display/interface.ts","./actions":"src/display/actions.ts","../game/actions":"src/game/actions.ts","../lobby/actions":"src/lobby/actions.ts"}],"src/lobby/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lobbyReducer = void 0;

var _actions = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var lobbyReducer = function lobbyReducer(state, action) {
  if (state === void 0) {
    state = {};
  }

  switch (action.type) {
    case _actions.LobbyActionEnum.GOT_DECK_CHOICES:
      return __assign(__assign({}, state), {
        deckChoices: action.choices
      });

    case _actions.LobbyActionEnum.PICKED_DECK:
      var deckChoices = state.deckChoices;
      var choice = action.choice;
      return __assign(__assign({}, state), {
        deckName: deckChoices[choice].name,
        deckChoices: undefined
      });

    default:
      return state;
  }
};

exports.lobbyReducer = lobbyReducer;
},{"./actions":"src/lobby/actions.ts"}],"src/gameDisplay/interface.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameDisplayEnum = void 0;
var GameDisplayEnum;
exports.GameDisplayEnum = GameDisplayEnum;

(function (GameDisplayEnum) {
  GameDisplayEnum[GameDisplayEnum["NORMAL"] = 0] = "NORMAL";
  GameDisplayEnum[GameDisplayEnum["PREDICT"] = 1] = "PREDICT";
  GameDisplayEnum[GameDisplayEnum["PICK_ONE"] = 2] = "PICK_ONE";
  GameDisplayEnum[GameDisplayEnum["FORCEFUL"] = 3] = "FORCEFUL";
})(GameDisplayEnum || (exports.GameDisplayEnum = GameDisplayEnum = {}));
},{}],"src/gameDisplay/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gameDisplayReducer = void 0;

var _interface = require("./interface");

var _actions = require("../game/actions");

var _actions2 = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var gameDisplayReducer = function gameDisplayReducer(state, action) {
  if (state === void 0) {
    state = {
      showFullCard: false,
      screen: _interface.GameDisplayEnum.NORMAL
    };
  }

  switch (action.type) {
    case _actions.GameActionEnum.MADE_PREDICTION:
      return __assign(__assign({}, state), {
        screen: _interface.GameDisplayEnum.NORMAL
      });

    case _actions2.GameDisplayActionEnum.SHOULD_PREDICT:
      return __assign(__assign({}, state), {
        screen: _interface.GameDisplayEnum.PREDICT
      });

    case _actions2.GameDisplayActionEnum.SET_HAND_CARD_DISPLAY:
      return __assign(__assign({}, state), {
        showFullCard: action.value
      });

    case _actions.GameActionEnum.SHOULD_PICK_ONE:
      return __assign(__assign({}, state), {
        screen: _interface.GameDisplayEnum.PICK_ONE
      });

    case _actions.GameActionEnum.DID_PICK_ONE:
      return __assign(__assign({}, state), {
        screen: _interface.GameDisplayEnum.NORMAL
      });

    case _actions.GameActionEnum.SHOULD_PICK_FORCEFUL:
      return __assign(__assign({}, state), {
        screen: _interface.GameDisplayEnum.FORCEFUL
      });

    case _actions.GameActionEnum.DID_PICK_FORCEFUL:
      return __assign(__assign({}, state), {
        screen: _interface.GameDisplayEnum.NORMAL
      });

    default:
      return state;
  }
};

exports.gameDisplayReducer = gameDisplayReducer;
},{"./interface":"src/gameDisplay/interface.ts","../game/actions":"src/game/actions.ts","./actions":"src/gameDisplay/actions.ts"}],"src/events/interface.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HappensEnum = exports.EventTypeEnum = exports.EVENT_REPLAY_SPEED = exports.EVENT_PLAY_SPEED = void 0;
var EVENT_PLAY_SPEED = 500;
exports.EVENT_PLAY_SPEED = EVENT_PLAY_SPEED;
var EVENT_REPLAY_SPEED = 200;
exports.EVENT_REPLAY_SPEED = EVENT_REPLAY_SPEED;
var EventTypeEnum;
exports.EventTypeEnum = EventTypeEnum;

(function (EventTypeEnum) {
  EventTypeEnum[EventTypeEnum["CARD_NAME"] = 0] = "CARD_NAME";
  EventTypeEnum[EventTypeEnum["EFFECT"] = 1] = "EFFECT";
  EventTypeEnum[EventTypeEnum["MECHANIC"] = 2] = "MECHANIC";
  EventTypeEnum[EventTypeEnum["ADDED_MECHANIC"] = 3] = "ADDED_MECHANIC";
  EventTypeEnum[EventTypeEnum["REVEAL_PREDICTION"] = 4] = "REVEAL_PREDICTION";
  EventTypeEnum[EventTypeEnum["GAME_OVER"] = 5] = "GAME_OVER";
  EventTypeEnum[EventTypeEnum["MULTIPLE"] = 6] = "MULTIPLE";
  EventTypeEnum[EventTypeEnum["EVENT_SECTION"] = 7] = "EVENT_SECTION";
  EventTypeEnum[EventTypeEnum["CARD_NAME_SECTION"] = 8] = "CARD_NAME_SECTION";
  EventTypeEnum[EventTypeEnum["PREDICTION_SECTION"] = 9] = "PREDICTION_SECTION";
})(EventTypeEnum || (exports.EventTypeEnum = EventTypeEnum = {}));

var HappensEnum;
exports.HappensEnum = HappensEnum;

(function (HappensEnum) {
  HappensEnum[HappensEnum["NEVER_AFFECTED"] = 0] = "NEVER_AFFECTED";
  HappensEnum[HappensEnum["HAPPENS"] = 1] = "HAPPENS";
  HappensEnum[HappensEnum["BLOCKED"] = 2] = "BLOCKED";
})(HappensEnum || (exports.HappensEnum = HappensEnum = {}));
},{}],"src/gameSettings.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_STYLES_PER_DECK = exports.ANTICIPATING_POISE = exports.UNBALANCED_POISE = exports.MIN_POISE = exports.MAX_POISE = exports.STARTING_POISE = exports.HAND_SIZE = exports.QUEUE_LENGTH = exports.BLOODIED_HP = exports.STARTING_HEALTH = void 0;
var STARTING_HEALTH = 50;
exports.STARTING_HEALTH = STARTING_HEALTH;
var BLOODIED_HP = 25;
exports.BLOODIED_HP = BLOODIED_HP;
var QUEUE_LENGTH = 6;
exports.QUEUE_LENGTH = QUEUE_LENGTH;
var HAND_SIZE = 3;
exports.HAND_SIZE = HAND_SIZE;
var STARTING_POISE = 4;
exports.STARTING_POISE = STARTING_POISE;
var MAX_POISE = 10;
exports.MAX_POISE = MAX_POISE;
var MIN_POISE = 0;
exports.MIN_POISE = MIN_POISE;
var UNBALANCED_POISE = 3;
exports.UNBALANCED_POISE = UNBALANCED_POISE;
var ANTICIPATING_POISE = 8;
exports.ANTICIPATING_POISE = ANTICIPATING_POISE;
var MAX_STYLES_PER_DECK = 3;
exports.MAX_STYLES_PER_DECK = MAX_STYLES_PER_DECK;
},{}],"src/events/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventReducer = void 0;

var _interface = require("./interface");

var _actions = require("./actions");

var _gameSettings = require("../gameSettings");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var eventReducer = function eventReducer(state, action) {
  if (state === void 0) {
    state = {
      isDisplaying: false,
      events: [],
      history: []
    };
  }

  switch (action.type) {
    case _actions.EventActionEnum.GOT_EVENTS:
      return gotEventsReducer(state, action);

    case _actions.EventActionEnum.FINISHED_DISPLAYING_EVENTS:
      return __assign(__assign({}, state), {
        isDisplaying: false,
        events: []
      });

    case _actions.EventActionEnum.DISPLAY_EVENT_HISTORY:
      return displayEventHistoryReducer(state, action);

    default:
      return state;
  }
};

exports.eventReducer = eventReducer;

var displayEventHistoryReducer = function displayEventHistoryReducer(state, _a) {
  var index = _a.index;
  var events = state.history[index];

  if (events) {
    events = __spreadArrays(events);
  } else {
    events = [];
  }

  return __assign(__assign({}, state), {
    isDisplaying: true,
    events: events,
    playSpeed: _interface.EVENT_REPLAY_SPEED
  });
};

var gotEventsReducer = function gotEventsReducer(state, action) {
  var history = __spreadArrays([action.events], state.history);

  history = history.slice(0, _gameSettings.QUEUE_LENGTH);
  return __assign(__assign({}, state), {
    isDisplaying: true,
    events: action.events,
    history: history,
    playSpeed: _interface.EVENT_PLAY_SPEED
  });
};
},{"./interface":"src/events/interface.ts","./actions":"src/events/actions.ts","../gameSettings":"src/gameSettings.ts"}],"src/path/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PathActionEnum = void 0;
var PathActionEnum;
exports.PathActionEnum = PathActionEnum;

(function (PathActionEnum) {
  PathActionEnum["TO_PATH_STRING"] = "toPathString";
  PathActionEnum["TO_PATH_ARRAY"] = "toPathArray";
  PathActionEnum["APPEND_TO_PATH"] = "appendToPath";
  PathActionEnum["POP_PATH"] = "popPath";
})(PathActionEnum || (exports.PathActionEnum = PathActionEnum = {}));
},{}],"src/path/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathReducer = void 0;

var _actions = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var pathReducer = function pathReducer(state, action) {
  if (state === void 0) {
    state = makeDefaultState();
  }

  switch (action.type) {
    case _actions.PathActionEnum.APPEND_TO_PATH:
      var pathArr;

      if (Array.isArray(action.toAppend)) {
        pathArr = __spreadArrays(state.pathArr, action.toAppend);
      } else {
        pathArr = __spreadArrays(state.pathArr, [action.toAppend]);
      }

      history.pushState(null, null, '/' + pathArr.join('/'));
      return __assign(__assign({}, state), {
        pathArr: pathArr
      });

    case _actions.PathActionEnum.POP_PATH:
      var pathArr = state.pathArr.slice(0, -1);
      history.pushState(null, null, '/' + pathArr.join('/'));
      return __assign(__assign({}, state), {
        pathArr: pathArr
      });

    case _actions.PathActionEnum.TO_PATH_ARRAY:
      history.pushState(null, null, '/' + action.path.join('/'));
      return __assign(__assign({}, state), {
        pathArr: action.path
      });

    case _actions.PathActionEnum.TO_PATH_STRING:
      history.pushState(null, null, action.path);
      var pathArr = action.path.split('/').filter(function (el) {
        return el !== '';
      });
      return __assign(__assign({}, state), {
        pathArr: pathArr
      });

    default:
      return state;
  }
};

exports.pathReducer = pathReducer;

var makeDefaultState = function makeDefaultState() {
  return {
    pathArr: location.pathname.split('/').filter(function (el) {
      return el !== '';
    })
  };
};
},{"./actions":"src/path/actions.ts"}],"src/socket/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketActionEnum = void 0;
var SocketActionEnum;
exports.SocketActionEnum = SocketActionEnum;

(function (SocketActionEnum) {
  SocketActionEnum["CONNECT"] = "connectSocket";
  SocketActionEnum["DISCONNECT"] = "disconnectSocket";
})(SocketActionEnum || (exports.SocketActionEnum = SocketActionEnum = {}));
},{}],"src/socket/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socketReducer = void 0;

var _actions = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var socketReducer = function socketReducer(state, action) {
  if (state === void 0) {
    state = {
      socket: null
    };
  }

  switch (action.type) {
    case _actions.SocketActionEnum.CONNECT:
      return __assign(__assign({}, state), {
        socket: action.socket
      });

    case _actions.SocketActionEnum.DISCONNECT:
      return __assign(__assign({}, state), {
        socket: null
      });

    default:
      return state;
  }
};

exports.socketReducer = socketReducer;
},{"./actions":"src/socket/actions.ts"}],"src/deckViewer/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeckViewerEnum = void 0;
var DeckViewerEnum;
exports.DeckViewerEnum = DeckViewerEnum;

(function (DeckViewerEnum) {
  DeckViewerEnum["GOT_DECK"] = "gotDeck";
  DeckViewerEnum["GOT_DECK_LIST"] = "gotDeckList";
  DeckViewerEnum["FAILED_TO_GET_DECK"] = "failedToGetDeck";
  DeckViewerEnum["FAILED_TO_GET_DECKLIST"] = "faileToGetDecklist";
  DeckViewerEnum["LOADING_DECK"] = "loadingDeck";
  DeckViewerEnum["LOADING_DECK_LIST"] = "loadingDeckList";
})(DeckViewerEnum || (exports.DeckViewerEnum = DeckViewerEnum = {}));
},{}],"src/deckViewer/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deckViewerReducer = void 0;

var _actions = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var deckViewerReducer = function deckViewerReducer(state, action) {
  if (state === void 0) {
    state = {
      deck: null,
      deckList: [],
      isLoadingDeckList: false,
      isLoadingDeck: false
    };
  }

  switch (action.type) {
    case _actions.DeckViewerEnum.LOADING_DECK:
      return __assign(__assign({}, state), {
        isLoadingDeck: true
      });

    case _actions.DeckViewerEnum.GOT_DECK:
      return __assign(__assign({}, state), {
        deck: action.deck,
        isLoadingDeck: false
      });

    case _actions.DeckViewerEnum.LOADING_DECK_LIST:
      return __assign(__assign({}, state), {
        isLoadingDeckList: true
      });

    case _actions.DeckViewerEnum.GOT_DECK_LIST:
      return __assign(__assign({}, state), {
        deckList: action.deckList,
        isLoadingDeckList: false
      });

    default:
      return state;
  }
};

exports.deckViewerReducer = deckViewerReducer;
},{"./actions":"src/deckViewer/actions.ts"}],"src/fightingStyles/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FightingStyleEnum = void 0;
var FightingStyleEnum;
exports.FightingStyleEnum = FightingStyleEnum;

(function (FightingStyleEnum) {
  FightingStyleEnum["LOADING_STYLE"] = "loadingFightingStyle";
  FightingStyleEnum["GOT_STYLE"] = "gotFightingStyle";
  FightingStyleEnum["LOADING_STYLE_NAMES"] = "loadingFightingStyleNames";
  FightingStyleEnum["GOT_STYLE_NAMES"] = "gotFightingStyleNames";
  FightingStyleEnum["VIEWING_FROM_DECK_EDIT"] = "viewingFromDeckEdit";
})(FightingStyleEnum || (exports.FightingStyleEnum = FightingStyleEnum = {}));
},{}],"src/fightingStyles/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fightingStyleReducer = void 0;

var _actions = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var fightingStyleReducer = function fightingStyleReducer(state, action) {
  if (state === void 0) {
    state = makeDefaultState();
  }

  switch (action.type) {
    case _actions.FightingStyleEnum.VIEWING_FROM_DECK_EDIT:
      return __assign(__assign({}, state), {
        isEditingDeck: action.isEditingDeck
      });

    case _actions.FightingStyleEnum.GOT_STYLE:
      return __assign(__assign({}, state), {
        loadingStyle: false,
        style: action.style
      });

    case _actions.FightingStyleEnum.GOT_STYLE_NAMES:
      return __assign(__assign({}, state), {
        loadingStyleNames: false,
        styleDescriptions: action.styleDescriptions
      });

    case _actions.FightingStyleEnum.LOADING_STYLE:
      return __assign(__assign({}, state), {
        loadingStyle: true
      });

    case _actions.FightingStyleEnum.LOADING_STYLE_NAMES:
      return __assign(__assign({}, state), {
        loadingStyleNames: true
      });

    default:
      return state;
  }
};

exports.fightingStyleReducer = fightingStyleReducer;

var makeDefaultState = function makeDefaultState() {
  return {
    style: null,
    styleDescriptions: [],
    loadingStyle: false,
    loadingStyleNames: false
  };
};
},{"./actions":"src/fightingStyles/actions.ts"}],"src/state/localStorage.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadState = exports.saveLogin = void 0;

var saveLogin = function saveLogin(user) {
  try {
    var stringified = JSON.stringify({
      user: user
    });
    localStorage.setItem("storeState", stringified);
  } catch (err) {}
};

exports.saveLogin = saveLogin;

var loadState = function loadState() {
  try {
    var stringified = localStorage.getItem("storeState");

    if (stringified) {
      return JSON.parse(stringified);
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
};

exports.loadState = loadState;
},{}],"src/user/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserActionEnum = void 0;
var UserActionEnum;
exports.UserActionEnum = UserActionEnum;

(function (UserActionEnum) {
  UserActionEnum["LOGIN"] = "userLogin";
  UserActionEnum["LOGOUT"] = "userLogout";
})(UserActionEnum || (exports.UserActionEnum = UserActionEnum = {}));
},{}],"src/user/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userReducer = void 0;

var _actions = require("./actions");

var _localStorage = require("../state/localStorage");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var userReducer = function userReducer(state, action) {
  if (state === void 0) {
    state = {};
  }

  var newState;

  switch (action.type) {
    case _actions.UserActionEnum.LOGIN:
      newState = __assign(__assign({}, state), {
        token: action.token,
        username: action.username
      });
      (0, _localStorage.saveLogin)(newState);
      return newState;

    case _actions.UserActionEnum.LOGOUT:
      newState = __assign(__assign({}, state), {
        token: undefined,
        username: undefined
      });
      (0, _localStorage.saveLogin)(newState);
      return newState;

    default:
      return state;
  }
};

exports.userReducer = userReducer;
},{"./actions":"src/user/actions.ts","../state/localStorage":"src/state/localStorage.ts"}],"src/deckBuilder/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeckEditorEnum = void 0;
var DeckEditorEnum;
exports.DeckEditorEnum = DeckEditorEnum;

(function (DeckEditorEnum) {
  DeckEditorEnum["CHANGE_NAME"] = "deckEditChangeName";
  DeckEditorEnum["ADD_STYLE"] = "deckEditAddStyle";
  DeckEditorEnum["REMOVE_STYLE"] = "deckEditRemoveStyle";
  DeckEditorEnum["ADD_CARD"] = "deckEditAddCard";
  DeckEditorEnum["REMOVE_CARD"] = "deckEditRemoveCard";
  DeckEditorEnum["GOT_DECKS"] = "deckEditGotDecks";
  DeckEditorEnum["CHOSE_DECK"] = "deckEditChoseDeck";
  DeckEditorEnum["UPDATE_DECK"] = "deckEditUpdateDeck";
  DeckEditorEnum["CREATE_DECK"] = "deckEditCreateDeck";
  DeckEditorEnum["DELETE_DECK"] = "deckEditDelteDeck";
  DeckEditorEnum["REVERT_DECK"] = "deckEditRevertDeck";
  DeckEditorEnum["EXTERNALLY_VIEWING"] = "deckEditIsExternallyViewing";
  DeckEditorEnum["GOT_POSSIBLE_CARDS"] = "gotPossibleCards";
  DeckEditorEnum["SHOWING_UNUSED_STYLES"] = "showingUnusedStyles";
})(DeckEditorEnum || (exports.DeckEditorEnum = DeckEditorEnum = {}));
},{}],"src/deckBuilder/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deckEditorReducer = void 0;

var _actions = require("./actions");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var deckEditorReducer = function deckEditorReducer(state, action) {
  if (state === void 0) {
    state = makeDefaultState();
  }

  switch (action.type) {
    case _actions.DeckEditorEnum.CHANGE_NAME:
      return __assign(__assign({}, state), {
        deck: __assign(__assign({}, state.deck), {
          name: action.name
        }),
        canUpdate: true
      });

    case _actions.DeckEditorEnum.CHOSE_DECK:
      var showing = action.deck.styles.length < 3;

      var possibleCards = __assign(__assign({}, state.possibleCards), action.possibleCards);

      return __assign(__assign({}, state), {
        possibleCards: possibleCards,
        deck: action.deck,
        uneditedDeck: action.deck,
        canUpdate: false,
        showingUnusedStyles: showing
      });

    case _actions.DeckEditorEnum.GOT_DECKS:
      return __assign(__assign({}, state), {
        allDecks: action.decks
      });

    case _actions.DeckEditorEnum.ADD_CARD:
      var cards = __spreadArrays(state.deck.cards, [action.card]);

      return __assign(__assign({}, state), {
        deck: __assign(__assign({}, state.deck), {
          cards: cards
        }),
        canUpdate: true
      });

    case _actions.DeckEditorEnum.REMOVE_CARD:
      var cards = state.deck.cards.filter(function (card) {
        return card !== action.card;
      });
      return __assign(__assign({}, state), {
        deck: __assign(__assign({}, state.deck), {
          cards: cards
        }),
        canUpdate: true
      });

    case _actions.DeckEditorEnum.ADD_STYLE:
      var styles = __spreadArrays(state.deck.styles, [action.style]);

      return __assign(__assign({}, state), {
        deck: __assign(__assign({}, state.deck), {
          styles: styles
        }),
        canUpdate: true
      });

    case _actions.DeckEditorEnum.REMOVE_STYLE:
      var styles = state.deck.styles.filter(function (style) {
        return style !== action.style;
      });
      return __assign(__assign({}, state), {
        deck: __assign(__assign({}, state.deck), {
          styles: styles
        }),
        canUpdate: true
      });

    case _actions.DeckEditorEnum.UPDATE_DECK:
      return __assign(__assign({}, state), {
        uneditedDeck: __assign({}, state.deck),
        canUpdate: false
      });

    case _actions.DeckEditorEnum.REVERT_DECK:
      return __assign(__assign({}, state), {
        deck: __assign({}, state.uneditedDeck),
        canUpdate: false
      });

    case _actions.DeckEditorEnum.DELETE_DECK:
      var allDecks = state.allDecks.filter(function (_a) {
        var id = _a.id;
        return id !== action.id;
      });
      return __assign(__assign({}, state), {
        allDecks: allDecks
      });

    case _actions.DeckEditorEnum.GOT_POSSIBLE_CARDS:
      var possibleCards = __assign(__assign({}, state.possibleCards), action.possibleCards);

      return __assign(__assign({}, state), {
        possibleCards: possibleCards
      });

    case _actions.DeckEditorEnum.SHOWING_UNUSED_STYLES:
      return __assign(__assign({}, state), {
        showingUnusedStyles: action.showing
      });

    default:
      return state;
  }
};

exports.deckEditorReducer = deckEditorReducer;

var makeDefaultState = function makeDefaultState() {
  return {
    canUpdate: false,
    deck: null,
    allDecks: [],
    savedStyles: {},
    allStyleDesc: [],
    uneditedDeck: null,
    showingUnusedStyles: false,
    possibleCards: {}
  };
};
},{"./actions":"src/deckBuilder/actions.ts"}],"src/filters/actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterEnum = void 0;
var FilterEnum;
exports.FilterEnum = FilterEnum;

(function (FilterEnum) {
  FilterEnum["UPDATED_FILTER"] = "updateDeckViewerFilter";
  FilterEnum["ADDED_FILTER"] = "addDeckViewerFilter";
  FilterEnum["REMOVED_FILTER"] = "removeDeckViewerFilter";
})(FilterEnum || (exports.FilterEnum = FilterEnum = {}));
},{}],"src/shared/card.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerEnum = exports.getMechDisplay = exports.MechanicEnum = exports.AxisEnum = void 0;

var _a;

var AxisEnum;
exports.AxisEnum = AxisEnum;

(function (AxisEnum) {
  AxisEnum["DAMAGE"] = "Damage";
  AxisEnum["PRONE"] = "Prone";
  AxisEnum["STANDING"] = "Standing";
  AxisEnum["MOVING"] = "Moving";
  AxisEnum["STILL"] = "Still";
  AxisEnum["GRAPPLED"] = "Grappled";
  AxisEnum["NOT_GRAPPLED"] = "Not Grappled";
  AxisEnum["CLOSE"] = "Close";
  AxisEnum["NOT_CLOSE"] = "Not Close";
  AxisEnum["FAR"] = "Far";
  AxisEnum["NOT_FAR"] = "Not Far";
  AxisEnum["BALANCED"] = "Balanced";
  AxisEnum["UNBALANCED"] = "Unbalanced";
  AxisEnum["ANTICIPATING"] = "Anticipating";
  AxisEnum["NOT_ANTICIPATING"] = "Not Anticipating";
  AxisEnum["CLOSER"] = "Closer";
  AxisEnum["FURTHER"] = "Further";
  AxisEnum["BLOODIED"] = "Bloodied";
  AxisEnum["FRESH"] = "Fresh";
  AxisEnum["MOTION"] = "Motion";
  AxisEnum["DISTANCE"] = "Distance";
  AxisEnum["POISE"] = "Poise";
  AxisEnum["LOSE_POISE"] = "Lose Poise";
  AxisEnum["STANCE"] = "Stance";
})(AxisEnum || (exports.AxisEnum = AxisEnum = {}));

var MechanicEnum;
exports.MechanicEnum = MechanicEnum;

(function (MechanicEnum) {
  MechanicEnum["TELEGRAPH"] = "Telegraph";
  MechanicEnum["FOCUS"] = "Focus";
  MechanicEnum["PREDICT"] = "Predict";
  MechanicEnum["PARRY"] = "Parry";
  MechanicEnum["BLOCK"] = "Block";
  MechanicEnum["LOCK"] = "Lock";
  MechanicEnum["REFLEX"] = "Reflex";
  MechanicEnum["BUFF"] = "Buff";
  MechanicEnum["CRIPPLE"] = "Cripple";
  MechanicEnum["PICK_ONE"] = "Pick One";
  MechanicEnum["FORCEFUL"] = "Forceful";
  MechanicEnum["ENHANCE"] = "Enhance";
  MechanicEnum["CLUTCH"] = "Clutch";
  MechanicEnum["SETUP"] = "Setup";
  MechanicEnum["RIGID"] = "Rigid";
  MechanicEnum["FLUID"] = "Fluid";
})(MechanicEnum || (exports.MechanicEnum = MechanicEnum = {}));

var getMechDisplay = function getMechDisplay(mech) {
  var defaultValue = {
    state: true,
    value: true
  };

  if (mech === undefined) {
    return defaultValue;
  }

  var comp = MechanicDisplay[mech];

  if (comp) {
    return comp;
  }

  return defaultValue;
};

exports.getMechDisplay = getMechDisplay;
var MechanicDisplay = (_a = {}, _a[MechanicEnum.TELEGRAPH] = {
  req: true,
  eff: true
}, _a[MechanicEnum.FOCUS] = {
  req: true,
  eff: true
}, _a[MechanicEnum.PREDICT] = {
  eff: true
}, _a[MechanicEnum.BUFF] = {
  valueString: true,
  eff: true
}, _a[MechanicEnum.ENHANCE] = {
  valueString: true,
  eff: true
}, _a[MechanicEnum.BLOCK] = {
  value: true
}, _a[MechanicEnum.PARRY] = {
  value: true
}, _a[MechanicEnum.LOCK] = {
  state: true,
  value: true
}, _a[MechanicEnum.REFLEX] = {}, _a[MechanicEnum.CRIPPLE] = {
  valueString: true
}, _a[MechanicEnum.PICK_ONE] = {
  pick: true
}, _a[MechanicEnum.FORCEFUL] = {
  value: true,
  eff: true
}, _a[MechanicEnum.CLUTCH] = {
  value: true
}, _a[MechanicEnum.SETUP] = {
  value: true
}, _a[MechanicEnum.FLUID] = {
  player: true,
  value: true
}, _a[MechanicEnum.RIGID] = {
  player: true,
  value: true
}, _a);
var PlayerEnum;
exports.PlayerEnum = PlayerEnum;

(function (PlayerEnum) {
  PlayerEnum[PlayerEnum["PLAYER"] = 0] = "PLAYER";
  PlayerEnum[PlayerEnum["OPPONENT"] = 1] = "OPPONENT";
  PlayerEnum[PlayerEnum["BOTH"] = 2] = "BOTH";
})(PlayerEnum || (exports.PlayerEnum = PlayerEnum = {}));
},{}],"src/filters/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterReducer = void 0;

var _actions = require("./actions");

var _card = require("../shared/card");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var filterReducer = function filterReducer(state, action) {
  if (state === void 0) {
    state = {
      filters: []
    };
  }

  switch (action.type) {
    case _actions.FilterEnum.UPDATED_FILTER:
      return updateFilter(state, action);

    case _actions.FilterEnum.ADDED_FILTER:
      return addFilter(state, action);

    case _actions.FilterEnum.REMOVED_FILTER:
      return removeFilter(state, action);
  }

  return state;
};

exports.filterReducer = filterReducer;

var updateFilter = function updateFilter(state, action) {
  var filters = __spreadArrays(state.filters);

  filters[action.index] = action.filter;
  return __assign(__assign({}, state), {
    filters: filters
  });
};

var addFilter = function addFilter(state, action) {
  var filters = __spreadArrays(state.filters, [{
    axis: _card.AxisEnum.CLOSE,
    player: _card.PlayerEnum.BOTH
  }]);

  return __assign(__assign({}, state), {
    filters: filters
  });
};

var removeFilter = function removeFilter(state, action) {
  var filters = state.filters.filter(function (_, i) {
    return i !== action.index;
  });
  return __assign(__assign({}, state), {
    filters: filters
  });
};
},{"./actions":"src/filters/actions.ts","../shared/card":"src/shared/card.ts"}],"src/state/store.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _redux = require("redux");

var _reducer = require("../game/reducer");

var _reducer2 = require("../hand/reducer");

var _reducer3 = require("../display/reducer");

var _reducer4 = require("../lobby/reducer");

var _reducer5 = require("../gameDisplay/reducer");

var _reducer6 = require("../events/reducer");

var _reducer7 = require("../path/reducer");

var _reducer8 = require("../socket/reducer");

var _reducer9 = require("../deckViewer/reducer");

var _reducer10 = require("../fightingStyles/reducer");

var _localStorage = require("./localStorage");

var _reducer11 = require("../user/reducer");

var _reducer12 = require("../deckBuilder/reducer");

var _reducer13 = require("../filters/reducer");

var rootReducer = (0, _redux.combineReducers)({
  game: _reducer.gameReducer,
  hand: _reducer2.handReducer,
  display: _reducer3.displayReducer,
  lobby: _reducer4.lobbyReducer,
  gameDisplay: _reducer5.gameDisplayReducer,
  events: _reducer6.eventReducer,
  deckViewer: _reducer9.deckViewerReducer,
  path: _reducer7.pathReducer,
  socket: _reducer8.socketReducer,
  fightingStyle: _reducer10.fightingStyleReducer,
  user: _reducer11.userReducer,
  deckEditor: _reducer12.deckEditorReducer,
  filter: _reducer13.filterReducer
});
var devToolsExtension = window['devToolsExtension'] ? window['devToolsExtension']() : function (f) {
  return f;
};
var loadedState = (0, _localStorage.loadState)();
var store = (0, _redux.createStore)(rootReducer, loadedState, devToolsExtension);
exports.store = store;
},{"redux":"node_modules/redux/es/redux.js","../game/reducer":"src/game/reducer.ts","../hand/reducer":"src/hand/reducer.ts","../display/reducer":"src/display/reducer.ts","../lobby/reducer":"src/lobby/reducer.ts","../gameDisplay/reducer":"src/gameDisplay/reducer.ts","../events/reducer":"src/events/reducer.ts","../path/reducer":"src/path/reducer.ts","../socket/reducer":"src/socket/reducer.ts","../deckViewer/reducer":"src/deckViewer/reducer.ts","../fightingStyles/reducer":"src/fightingStyles/reducer.ts","./localStorage":"src/state/localStorage.ts","../user/reducer":"src/user/reducer.ts","../deckBuilder/reducer":"src/deckBuilder/reducer.ts","../filters/reducer":"src/filters/reducer.ts"}],"src/images/grapple.png":[function(require,module,exports) {
module.exports = "/grapple.b390bafe.png";
},{}],"src/images/close.png":[function(require,module,exports) {
module.exports = "/close.9d2dba97.png";
},{}],"src/images/far.png":[function(require,module,exports) {
module.exports = "/far.2950107d.png";
},{}],"src/images/moving.png":[function(require,module,exports) {
module.exports = "/moving.a4871359.png";
},{}],"src/images/not_close.png":[function(require,module,exports) {
module.exports = "/not_close.b0803724.png";
},{}],"src/images/not_grapple.png":[function(require,module,exports) {
module.exports = "/not_grapple.fe33e5f8.png";
},{}],"src/images/not_far.png":[function(require,module,exports) {
module.exports = "/not_far.cb70b38a.png";
},{}],"src/images/bloodied.png":[function(require,module,exports) {
module.exports = "/bloodied.7c44d386.png";
},{}],"src/images/still.png":[function(require,module,exports) {
module.exports = "/still.ae2418c3.png";
},{}],"src/images/standing.png":[function(require,module,exports) {
module.exports = "/standing.cab69b03.png";
},{}],"src/images/prone.png":[function(require,module,exports) {
module.exports = "/prone.5291de5f.png";
},{}],"src/images/balanced.png":[function(require,module,exports) {
module.exports = "/balanced.013e74b1.png";
},{}],"src/images/not_anticipating.png":[function(require,module,exports) {
module.exports = "/not_anticipating.4e08ca44.png";
},{}],"src/images/anticipating.png":[function(require,module,exports) {
module.exports = "/anticipating.ec051de8.png";
},{}],"src/images/unbalanced.png":[function(require,module,exports) {
module.exports = "/unbalanced.163a091e.png";
},{}],"src/images/upArrow.png":[function(require,module,exports) {
module.exports = "/upArrow.36ba1f7f.png";
},{}],"src/images/downArrow.png":[function(require,module,exports) {
module.exports = "/downArrow.e0e20d12.png";
},{}],"src/images/bothArrow.png":[function(require,module,exports) {
module.exports = "/bothArrow.2dedb92f.png";
},{}],"src/images/damage.png":[function(require,module,exports) {
module.exports = "/damage.8dcb1185.png";
},{}],"src/images/further.png":[function(require,module,exports) {
module.exports = "/further.d4b8f7c0.png";
},{}],"src/images/closer.png":[function(require,module,exports) {
module.exports = "/closer.ec89e5b5.png";
},{}],"src/images/poise.png":[function(require,module,exports) {
module.exports = "/poise.37e12899.png";
},{}],"src/images/losePoise.png":[function(require,module,exports) {
module.exports = "/losePoise.6aa41db3.png";
},{}],"node_modules/react-is/cjs/react-is.development.js":[function(require,module,exports) {
/** @license React v16.12.0
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

if ("development" !== "production") {
  (function () {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
      value: true
    }); // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.

    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

    function isValidElementType(type) {
      return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
    }
    /**
     * Forked from fbjs/warning:
     * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
     *
     * Only change is we use console.warn instead of console.error,
     * and do nothing when 'console' is not supported.
     * This really simplifies the code.
     * ---
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */


    var lowPriorityWarningWithoutStack = function () {};

    {
      var printWarning = function (format) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });

        if (typeof console !== 'undefined') {
          console.warn(message);
        }

        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };

      lowPriorityWarningWithoutStack = function (condition, format) {
        if (format === undefined) {
          throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
        }

        if (!condition) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          printWarning.apply(void 0, [format].concat(args));
        }
      };
    }
    var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof;

        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type;

            switch (type) {
              case REACT_ASYNC_MODE_TYPE:
              case REACT_CONCURRENT_MODE_TYPE:
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
                return type;

              default:
                var $$typeofType = type && type.$$typeof;

                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType;

                  default:
                    return $$typeof;
                }

            }

          case REACT_PORTAL_TYPE:
            return $$typeof;
        }
      }

      return undefined;
    } // AsyncMode is deprecated along with isAsyncMode


    var AsyncMode = REACT_ASYNC_MODE_TYPE;
    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    var ContextConsumer = REACT_CONTEXT_TYPE;
    var ContextProvider = REACT_PROVIDER_TYPE;
    var Element = REACT_ELEMENT_TYPE;
    var ForwardRef = REACT_FORWARD_REF_TYPE;
    var Fragment = REACT_FRAGMENT_TYPE;
    var Lazy = REACT_LAZY_TYPE;
    var Memo = REACT_MEMO_TYPE;
    var Portal = REACT_PORTAL_TYPE;
    var Profiler = REACT_PROFILER_TYPE;
    var StrictMode = REACT_STRICT_MODE_TYPE;
    var Suspense = REACT_SUSPENSE_TYPE;
    var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true;
          lowPriorityWarningWithoutStack$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
        }
      }
      return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
    }

    function isConcurrentMode(object) {
      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
    }

    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE;
    }

    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE;
    }

    function isElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }

    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE;
    }

    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE;
    }

    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE;
    }

    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE;
    }

    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE;
    }

    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE;
    }

    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE;
    }

    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE;
    }

    exports.typeOf = typeOf;
    exports.AsyncMode = AsyncMode;
    exports.ConcurrentMode = ConcurrentMode;
    exports.ContextConsumer = ContextConsumer;
    exports.ContextProvider = ContextProvider;
    exports.Element = Element;
    exports.ForwardRef = ForwardRef;
    exports.Fragment = Fragment;
    exports.Lazy = Lazy;
    exports.Memo = Memo;
    exports.Portal = Portal;
    exports.Profiler = Profiler;
    exports.StrictMode = StrictMode;
    exports.Suspense = Suspense;
    exports.isValidElementType = isValidElementType;
    exports.isAsyncMode = isAsyncMode;
    exports.isConcurrentMode = isConcurrentMode;
    exports.isContextConsumer = isContextConsumer;
    exports.isContextProvider = isContextProvider;
    exports.isElement = isElement;
    exports.isForwardRef = isForwardRef;
    exports.isFragment = isFragment;
    exports.isLazy = isLazy;
    exports.isMemo = isMemo;
    exports.isPortal = isPortal;
    exports.isProfiler = isProfiler;
    exports.isStrictMode = isStrictMode;
    exports.isSuspense = isSuspense;
  })();
}
},{}],"node_modules/react-is/index.js":[function(require,module,exports) {
'use strict';

if ("development" === 'production') {
  module.exports = require('./cjs/react-is.production.min.js');
} else {
  module.exports = require('./cjs/react-is.development.js');
}
},{"./cjs/react-is.development.js":"node_modules/react-is/cjs/react-is.development.js"}],"node_modules/object-assign/index.js":[function(require,module,exports) {
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};
},{}],"node_modules/prop-types/lib/ReactPropTypesSecret.js":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],"node_modules/prop-types/checkPropTypes.js":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var printWarning = function () {};

if ("development" !== 'production') {
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function (text) {
    var message = 'Warning: ' + text;

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}
/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */


function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if ("development" !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }

        if (error && !(error instanceof Error)) {
          printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
        }

        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;
          var stack = getStack ? getStack() : '';
          printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
        }
      }
    }
  }
}
/**
 * Resets warning cache when testing.
 *
 * @private
 */


checkPropTypes.resetWarningCache = function () {
  if ("development" !== 'production') {
    loggedTypeFailures = {};
  }
};

module.exports = checkPropTypes;
},{"./lib/ReactPropTypesSecret":"node_modules/prop-types/lib/ReactPropTypesSecret.js"}],"node_modules/prop-types/factoryWithTypeCheckers.js":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var ReactIs = require('react-is');

var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

var checkPropTypes = require('./checkPropTypes');

var has = Function.call.bind(Object.prototype.hasOwnProperty);

var printWarning = function () {};

if ("development" !== 'production') {
  printWarning = function (text) {
    var message = 'Warning: ' + text;

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */

  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);

    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }
  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */


  var ANONYMOUS = '<<anonymous>>'; // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.

  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),
    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };
  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */

  /*eslint-disable no-self-compare*/

  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */


  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  } // Make `instanceof Error` still work for returned errors.


  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if ("development" !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }

    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
          err.name = 'Invariant Violation';
          throw err;
        } else if ("development" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;

          if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            printWarning('You are manually calling a React.PropTypes validation ' + 'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.');
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }

      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }

          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }

        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }

      var propValue = props[propName];

      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }

      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);

        if (error instanceof Error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if ("development" !== 'production') {
        if (arguments.length > 1) {
          printWarning('Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' + 'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).');
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }

      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);

        if (type === 'symbol') {
          return String(value);
        }

        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }

      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }

      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

          if (error instanceof Error) {
            return error;
          }
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      "development" !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];

      if (typeof checker !== 'function') {
        printWarning('Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.');
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];

        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }

      for (var key in shapeTypes) {
        var checker = shapeTypes[key];

        if (!checker) {
          continue;
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      } // We need to check all keys in case some are required but missing from
      // props.


      var allKeys = assign({}, props[propName], shapeTypes);

      for (var key in allKeys) {
        var checker = shapeTypes[key];

        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;

      case 'boolean':
        return !propValue;

      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }

        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);

        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;

          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;

              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;

      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    } // falsy value can't be a Symbol


    if (!propValue) {
      return false;
    } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    } // Fallback for non-spec compliant Symbols which are polyfilled.


    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  } // Equivalent of `typeof` but with special handling for array and regexp.


  function getPropType(propValue) {
    var propType = typeof propValue;

    if (Array.isArray(propValue)) {
      return 'array';
    }

    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }

    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }

    return propType;
  } // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.


  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }

    var propType = getPropType(propValue);

    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }

    return propType;
  } // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"


  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);

    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;

      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;

      default:
        return type;
    }
  } // Returns class name of the object, if any.


  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }

    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
},{"react-is":"node_modules/react-is/index.js","object-assign":"node_modules/object-assign/index.js","./lib/ReactPropTypesSecret":"node_modules/prop-types/lib/ReactPropTypesSecret.js","./checkPropTypes":"node_modules/prop-types/checkPropTypes.js"}],"node_modules/prop-types/index.js":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
if ("development" !== 'production') {
  var ReactIs = require('react-is'); // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod


  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}
},{"react-is":"node_modules/react-is/index.js","./factoryWithTypeCheckers":"node_modules/prop-types/factoryWithTypeCheckers.js"}],"node_modules/preact-compat/dist/preact-compat.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hydrate = exports.render = render$1;
exports.createClass = createClass;
exports.createPortal = createPortal;
exports.createFactory = createFactory;
exports.createElement = createElement;
exports.cloneElement = cloneElement$1;
exports.isValidElement = isValidElement;
exports.findDOMNode = findDOMNode;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.Component = Component$1;
exports.PureComponent = PureComponent;
exports.unstable_renderSubtreeIntoContainer = renderSubtreeIntoContainer;
exports.unstable_batchedUpdates = unstable_batchedUpdates;
exports.__spread = extend;
Object.defineProperty(exports, "PropTypes", {
  enumerable: true,
  get: function () {
    return _propTypes.default;
  }
});
Object.defineProperty(exports, "createRef", {
  enumerable: true,
  get: function () {
    return _preact.createRef;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _preactContext.createContext;
  }
});
exports.Children = exports.DOM = exports.version = exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _preact = require("preact");

var _preactContext = require("preact-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = '15.1.0'; // trick libraries to think we are react

exports.version = version;
var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(' ');
var REACT_ELEMENT_TYPE = typeof Symbol !== 'undefined' && Symbol.for && Symbol.for('react.element') || 0xeac7;
var COMPONENT_WRAPPER_KEY = typeof Symbol !== 'undefined' && Symbol.for ? Symbol.for('__preactCompatWrapper') : '__preactCompatWrapper'; // don't autobind these methods since they already have guaranteed context.

var AUTOBIND_BLACKLIST = {
  constructor: 1,
  render: 1,
  shouldComponentUpdate: 1,
  componentWillReceiveProps: 1,
  componentWillUpdate: 1,
  componentDidUpdate: 1,
  componentWillMount: 1,
  componentDidMount: 1,
  componentWillUnmount: 1,
  componentDidUnmount: 1
};
var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;
var BYPASS_HOOK = {};
/*global process*/

var DEV = false;

try {
  DEV = "development" !== 'production';
} catch (e) {} // a component that renders nothing. Used to replace components for unmountComponentAtNode.


function EmptyComponent() {
  return null;
} // make react think we're react.


var VNode = (0, _preact.h)('a', null).constructor;
VNode.prototype.$$typeof = REACT_ELEMENT_TYPE;
VNode.prototype.preactCompatUpgraded = false;
VNode.prototype.preactCompatNormalized = false;
Object.defineProperty(VNode.prototype, 'type', {
  get: function () {
    return this.nodeName;
  },
  set: function (v) {
    this.nodeName = v;
  },
  configurable: true
});
Object.defineProperty(VNode.prototype, 'props', {
  get: function () {
    return this.attributes;
  },
  set: function (v) {
    this.attributes = v;
  },
  configurable: true
});
var oldEventHook = _preact.options.event;

_preact.options.event = function (e) {
  if (oldEventHook) {
    e = oldEventHook(e);
  }

  e.persist = Object;
  e.nativeEvent = e;
  return e;
};

var oldVnodeHook = _preact.options.vnode;

_preact.options.vnode = function (vnode) {
  if (!vnode.preactCompatUpgraded) {
    vnode.preactCompatUpgraded = true;
    var tag = vnode.nodeName,
        attrs = vnode.attributes = vnode.attributes == null ? {} : extend({}, vnode.attributes);

    if (typeof tag === 'function') {
      if (tag[COMPONENT_WRAPPER_KEY] === true || tag.prototype && 'isReactComponent' in tag.prototype) {
        if (vnode.children && String(vnode.children) === '') {
          vnode.children = undefined;
        }

        if (vnode.children) {
          attrs.children = vnode.children;
        }

        if (!vnode.preactCompatNormalized) {
          normalizeVNode(vnode);
        }

        handleComponentVNode(vnode);
      }
    } else {
      if (vnode.children && String(vnode.children) === '') {
        vnode.children = undefined;
      }

      if (vnode.children) {
        attrs.children = vnode.children;
      }

      if (attrs.defaultValue) {
        if (!attrs.value && attrs.value !== 0) {
          attrs.value = attrs.defaultValue;
        }

        delete attrs.defaultValue;
      }

      handleElementVNode(vnode, attrs);
    }
  }

  if (oldVnodeHook) {
    oldVnodeHook(vnode);
  }
};

function handleComponentVNode(vnode) {
  var tag = vnode.nodeName,
      a = vnode.attributes;
  vnode.attributes = {};

  if (tag.defaultProps) {
    extend(vnode.attributes, tag.defaultProps);
  }

  if (a) {
    extend(vnode.attributes, a);
  }
}

function handleElementVNode(vnode, a) {
  var shouldSanitize, attrs, i;

  if (a) {
    for (i in a) {
      if (shouldSanitize = CAMEL_PROPS.test(i)) {
        break;
      }
    }

    if (shouldSanitize) {
      attrs = vnode.attributes = {};

      for (i in a) {
        if (a.hasOwnProperty(i)) {
          attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = a[i];
        }
      }
    }
  }
} // proxy render() since React returns a Component reference.


function render$1(vnode, parent, callback) {
  var prev = parent && parent._preactCompatRendered && parent._preactCompatRendered.base; // ignore impossible previous renders

  if (prev && prev.parentNode !== parent) {
    prev = null;
  } // default to first Element child


  if (!prev && parent) {
    prev = parent.firstElementChild;
  } // remove unaffected siblings


  for (var i = parent.childNodes.length; i--;) {
    if (parent.childNodes[i] !== prev) {
      parent.removeChild(parent.childNodes[i]);
    }
  }

  var out = (0, _preact.render)(vnode, parent, prev);

  if (parent) {
    parent._preactCompatRendered = out && (out._component || {
      base: out
    });
  }

  if (typeof callback === 'function') {
    callback();
  }

  return out && out._component || out;
}

var ContextProvider = function () {};

ContextProvider.prototype.getChildContext = function () {
  return this.props.context;
};

ContextProvider.prototype.render = function (props) {
  return props.children[0];
};

function renderSubtreeIntoContainer(parentComponent, vnode, container, callback) {
  var wrap = (0, _preact.h)(ContextProvider, {
    context: parentComponent.context
  }, vnode);
  var renderContainer = render$1(wrap, container);
  var component = renderContainer._component || renderContainer.base;

  if (callback) {
    callback.call(component, renderContainer);
  }

  return component;
}

function Portal(props) {
  renderSubtreeIntoContainer(this, props.vnode, props.container);
}

function createPortal(vnode, container) {
  return (0, _preact.h)(Portal, {
    vnode: vnode,
    container: container
  });
}

function unmountComponentAtNode(container) {
  var existing = container._preactCompatRendered && container._preactCompatRendered.base;

  if (existing && existing.parentNode === container) {
    (0, _preact.render)((0, _preact.h)(EmptyComponent), container, existing);
    return true;
  }

  return false;
}

var ARR = []; // This API is completely unnecessary for Preact, so it's basically passthrough.

var Children = {
  map: function (children, fn, ctx) {
    if (children == null) {
      return null;
    }

    children = Children.toArray(children);

    if (ctx && ctx !== children) {
      fn = fn.bind(ctx);
    }

    return children.map(fn);
  },
  forEach: function (children, fn, ctx) {
    if (children == null) {
      return null;
    }

    children = Children.toArray(children);

    if (ctx && ctx !== children) {
      fn = fn.bind(ctx);
    }

    children.forEach(fn);
  },
  count: function (children) {
    return children && children.length || 0;
  },
  only: function (children) {
    children = Children.toArray(children);

    if (children.length !== 1) {
      throw new Error('Children.only() expects only one child.');
    }

    return children[0];
  },
  toArray: function (children) {
    if (children == null) {
      return [];
    }

    return ARR.concat(children);
  }
};
/** Track current render() component for ref assignment */

exports.Children = Children;
var currentComponent;

function createFactory(type) {
  return createElement.bind(null, type);
}

var DOM = {};
exports.DOM = DOM;

for (var i = ELEMENTS.length; i--;) {
  DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
}

function upgradeToVNodes(arr, offset) {
  for (var i = offset || 0; i < arr.length; i++) {
    var obj = arr[i];

    if (Array.isArray(obj)) {
      upgradeToVNodes(obj);
    } else if (obj && typeof obj === 'object' && !isValidElement(obj) && (obj.props && obj.type || obj.attributes && obj.nodeName || obj.children)) {
      arr[i] = createElement(obj.type || obj.nodeName, obj.props || obj.attributes, obj.children);
    }
  }
}

function isStatelessComponent(c) {
  return typeof c === 'function' && !(c.prototype && c.prototype.render);
} // wraps stateless functional components in a PropTypes validator


function wrapStatelessComponent(WrappedComponent) {
  return createClass({
    displayName: WrappedComponent.displayName || WrappedComponent.name,
    render: function () {
      return WrappedComponent(this.props, this.context);
    }
  });
}

function statelessComponentHook(Ctor) {
  var Wrapped = Ctor[COMPONENT_WRAPPER_KEY];

  if (Wrapped) {
    return Wrapped === true ? Ctor : Wrapped;
  }

  Wrapped = wrapStatelessComponent(Ctor);
  Object.defineProperty(Wrapped, COMPONENT_WRAPPER_KEY, {
    configurable: true,
    value: true
  });
  Wrapped.displayName = Ctor.displayName;
  Wrapped.propTypes = Ctor.propTypes;
  Wrapped.defaultProps = Ctor.defaultProps;
  Object.defineProperty(Ctor, COMPONENT_WRAPPER_KEY, {
    configurable: true,
    value: Wrapped
  });
  return Wrapped;
}

function createElement() {
  var args = [],
      len = arguments.length;

  while (len--) args[len] = arguments[len];

  upgradeToVNodes(args, 2);
  return normalizeVNode(_preact.h.apply(void 0, args));
}

function normalizeVNode(vnode) {
  vnode.preactCompatNormalized = true;
  applyClassName(vnode);

  if (isStatelessComponent(vnode.nodeName)) {
    vnode.nodeName = statelessComponentHook(vnode.nodeName);
  }

  var ref = vnode.attributes.ref,
      type = ref && typeof ref;

  if (currentComponent && (type === 'string' || type === 'number')) {
    vnode.attributes.ref = createStringRefProxy(ref, currentComponent);
  }

  applyEventNormalization(vnode);
  return vnode;
}

function cloneElement$1(element, props) {
  var children = [],
      len = arguments.length - 2;

  while (len-- > 0) children[len] = arguments[len + 2];

  if (!isValidElement(element)) {
    return element;
  }

  var elementProps = element.attributes || element.props;
  var node = (0, _preact.h)(element.nodeName || element.type, extend({}, elementProps), element.children || elementProps && elementProps.children); // Only provide the 3rd argument if needed.
  // Arguments 3+ overwrite element.children in preactCloneElement

  var cloneArgs = [node, props];

  if (children && children.length) {
    cloneArgs.push(children);
  } else if (props && props.children) {
    cloneArgs.push(props.children);
  }

  return normalizeVNode(_preact.cloneElement.apply(void 0, cloneArgs));
}

function isValidElement(element) {
  return element && (element instanceof VNode || element.$$typeof === REACT_ELEMENT_TYPE);
}

function createStringRefProxy(name, component) {
  return component._refProxies[name] || (component._refProxies[name] = function (resolved) {
    if (component && component.refs) {
      component.refs[name] = resolved;

      if (resolved === null) {
        delete component._refProxies[name];
        component = null;
      }
    }
  });
}

function applyEventNormalization(ref) {
  var nodeName = ref.nodeName;
  var attributes = ref.attributes;

  if (!attributes || typeof nodeName !== 'string') {
    return;
  }

  var props = {};

  for (var i in attributes) {
    props[i.toLowerCase()] = i;
  }

  if (props.ondoubleclick) {
    attributes.ondblclick = attributes[props.ondoubleclick];
    delete attributes[props.ondoubleclick];
  } // for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:


  if (props.onchange && (nodeName === 'textarea' || nodeName.toLowerCase() === 'input' && !/^fil|che|rad/i.test(attributes.type))) {
    var normalized = props.oninput || 'oninput';

    if (!attributes[normalized]) {
      attributes[normalized] = multihook([attributes[normalized], attributes[props.onchange]]);
      delete attributes[props.onchange];
    }
  }
}

function applyClassName(vnode) {
  var a = vnode.attributes || (vnode.attributes = {});
  classNameDescriptor.enumerable = 'className' in a;

  if (a.className) {
    a.class = a.className;
  }

  Object.defineProperty(a, 'className', classNameDescriptor);
}

var classNameDescriptor = {
  configurable: true,
  get: function () {
    return this.class;
  },
  set: function (v) {
    this.class = v;
  }
};

function extend(base, props) {
  var arguments$1 = arguments;

  for (var i = 1, obj = void 0; i < arguments.length; i++) {
    if (obj = arguments$1[i]) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          base[key] = obj[key];
        }
      }
    }
  }

  return base;
}

function shallowDiffers(a, b) {
  for (var i in a) {
    if (!(i in b)) {
      return true;
    }
  }

  for (var i$1 in b) {
    if (a[i$1] !== b[i$1]) {
      return true;
    }
  }

  return false;
}

function findDOMNode(component) {
  return component && (component.base || component.nodeType === 1 && component) || null;
}

function F() {}

function createClass(obj) {
  function cl(props, context) {
    bindAll(this);
    Component$1.call(this, props, context, BYPASS_HOOK);
    newComponentHook.call(this, props, context);
  }

  obj = extend({
    constructor: cl
  }, obj); // We need to apply mixins here so that getDefaultProps is correctly mixed

  if (obj.mixins) {
    applyMixins(obj, collateMixins(obj.mixins));
  }

  if (obj.statics) {
    extend(cl, obj.statics);
  }

  if (obj.propTypes) {
    cl.propTypes = obj.propTypes;
  }

  if (obj.defaultProps) {
    cl.defaultProps = obj.defaultProps;
  }

  if (obj.getDefaultProps) {
    cl.defaultProps = obj.getDefaultProps.call(cl);
  }

  F.prototype = Component$1.prototype;
  cl.prototype = extend(new F(), obj);
  cl.displayName = obj.displayName || 'Component';
  return cl;
} // Flatten an Array of mixins to a map of method name to mixin implementations


function collateMixins(mixins) {
  var keyed = {};

  for (var i = 0; i < mixins.length; i++) {
    var mixin = mixins[i];

    for (var key in mixin) {
      if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
        (keyed[key] || (keyed[key] = [])).push(mixin[key]);
      }
    }
  }

  return keyed;
} // apply a mapping of Arrays of mixin methods to a component prototype


function applyMixins(proto, mixins) {
  for (var key in mixins) {
    if (mixins.hasOwnProperty(key)) {
      proto[key] = multihook(mixins[key].concat(proto[key] || ARR), key === 'getDefaultProps' || key === 'getInitialState' || key === 'getChildContext');
    }
  }
}

function bindAll(ctx) {
  for (var i in ctx) {
    var v = ctx[i];

    if (typeof v === 'function' && !v.__bound && !AUTOBIND_BLACKLIST.hasOwnProperty(i)) {
      (ctx[i] = v.bind(ctx)).__bound = true;
    }
  }
}

function callMethod(ctx, m, args) {
  if (typeof m === 'string') {
    m = ctx.constructor.prototype[m];
  }

  if (typeof m === 'function') {
    return m.apply(ctx, args);
  }
}

function multihook(hooks, skipDuplicates) {
  return function () {
    var arguments$1 = arguments;
    var this$1 = this;
    var ret;

    for (var i = 0; i < hooks.length; i++) {
      var r = callMethod(this$1, hooks[i], arguments$1);

      if (skipDuplicates && r != null) {
        if (!ret) {
          ret = {};
        }

        for (var key in r) {
          if (r.hasOwnProperty(key)) {
            ret[key] = r[key];
          }
        }
      } else if (typeof r !== 'undefined') {
        ret = r;
      }
    }

    return ret;
  };
}

function newComponentHook(props, context) {
  propsHook.call(this, props, context);
  this.componentWillReceiveProps = multihook([propsHook, this.componentWillReceiveProps || 'componentWillReceiveProps']);
  this.render = multihook([propsHook, beforeRender, this.render || 'render', afterRender]);
}

function propsHook(props, context) {
  if (!props) {
    return;
  } // React annoyingly special-cases single children, and some react components are ridiculously strict about this.


  var c = props.children;

  if (c && Array.isArray(c) && c.length === 1 && (typeof c[0] === 'string' || typeof c[0] === 'function' || c[0] instanceof VNode)) {
    props.children = c[0]; // but its totally still going to be an Array.

    if (props.children && typeof props.children === 'object') {
      props.children.length = 1;
      props.children[0] = props.children;
    }
  } // add proptype checking


  if (DEV) {
    var ctor = typeof this === 'function' ? this : this.constructor,
        propTypes = this.propTypes || ctor.propTypes;
    var displayName = this.displayName || ctor.name;

    if (propTypes) {
      _propTypes.default.checkPropTypes(propTypes, props, 'prop', displayName);
    }
  }
}

function beforeRender(props) {
  currentComponent = this;
}

function afterRender() {
  if (currentComponent === this) {
    currentComponent = null;
  }
}

function Component$1(props, context, opts) {
  _preact.Component.call(this, props, context);

  this.state = this.getInitialState ? this.getInitialState() : {};
  this.refs = {};
  this._refProxies = {};

  if (opts !== BYPASS_HOOK) {
    newComponentHook.call(this, props, context);
  }
}

extend(Component$1.prototype = new _preact.Component(), {
  constructor: Component$1,
  isReactComponent: {},
  replaceState: function (state, callback) {
    var this$1 = this;
    this.setState(state, callback);

    for (var i in this$1.state) {
      if (!(i in state)) {
        delete this$1.state[i];
      }
    }
  },
  getDOMNode: function () {
    return this.base;
  },
  isMounted: function () {
    return !!this.base;
  }
});

function PureComponent(props, context) {
  Component$1.call(this, props, context);
}

F.prototype = Component$1.prototype;
PureComponent.prototype = new F();
PureComponent.prototype.isPureReactComponent = true;

PureComponent.prototype.shouldComponentUpdate = function (props, state) {
  return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
};

function unstable_batchedUpdates(callback) {
  callback();
}

var index = {
  version: version,
  DOM: DOM,
  PropTypes: _propTypes.default,
  Children: Children,
  render: render$1,
  hydrate: render$1,
  createClass: createClass,
  createContext: _preactContext.createContext,
  createPortal: createPortal,
  createFactory: createFactory,
  createElement: createElement,
  cloneElement: cloneElement$1,
  createRef: _preact.createRef,
  isValidElement: isValidElement,
  findDOMNode: findDOMNode,
  unmountComponentAtNode: unmountComponentAtNode,
  Component: Component$1,
  PureComponent: PureComponent,
  unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer,
  unstable_batchedUpdates: unstable_batchedUpdates,
  __spread: extend
};
var _default = index;
exports.default = _default;
},{"prop-types":"node_modules/prop-types/index.js","preact":"node_modules/preact/dist/preact.mjs","preact-context":"node_modules/preact-context/dist/context.min.js"}],"node_modules/react-lightweight-tooltip/dist-modules/components/tooltip.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tooltip = function (_React$Component) {
  _inherits(Tooltip, _React$Component);

  function Tooltip(props) {
    _classCallCheck(this, Tooltip);

    var _this = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, props));

    _this.styles = {
      wrapper: {
        position: 'relative',
        display: 'inline-block',
        zIndex: '98',
        color: '#555',
        cursor: 'help'
      },
      tooltip: {
        position: 'absolute',
        zIndex: '99',
        minWidth: '200px',
        maxWidth: '420px',
        background: '#000',
        bottom: '100%',
        left: '50%',
        marginBottom: '10px',
        padding: '5px',
        WebkitTransform: 'translateX(-50%)',
        msTransform: 'translateX(-50%)',
        OTransform: 'translateX(-50%)',
        transform: 'translateX(-50%)'
      },
      content: {
        background: '#000',
        color: '#fff',
        display: 'inline',
        fontSize: '.8em',
        padding: '.3em 1em'
      },
      arrow: {
        position: 'absolute',
        width: '0',
        height: '0',
        bottom: '-5px',
        left: '50%',
        marginLeft: '-5px',
        borderLeft: 'solid transparent 5px',
        borderRight: 'solid transparent 5px',
        borderTop: 'solid #000 5px'
      },
      gap: {
        position: 'absolute',
        width: '100%',
        height: '20px',
        bottom: '-20px'
      }
    };

    _this.mergeStyles = function (userStyles) {
      Object.keys(_this.styles).forEach(function (name) {
        Object.assign(_this.styles[name], userStyles[name]);
      });
    };

    _this.show = function () {
      return _this.setVisibility(true);
    };

    _this.hide = function () {
      return _this.setVisibility(false);
    };

    _this.setVisibility = function (visible) {
      _this.setState(Object.assign({}, _this.state, {
        visible: visible
      }));
    };

    _this.handleTouch = function () {
      _this.show();
      _this.assignOutsideTouchHandler();
    };

    _this.assignOutsideTouchHandler = function () {
      var handler = function handler(e) {
        var currentNode = e.target;
        var componentNode = _reactDom2.default.findDOMNode(_this.refs.instance);
        while (currentNode.parentNode) {
          if (currentNode === componentNode) return;
          currentNode = currentNode.parentNode;
        }
        if (currentNode !== document) return;
        _this.hide();
        document.removeEventListener('touchstart', handler);
      };
      document.addEventListener('touchstart', handler);
    };

    _this.state = {
      visible: false
    };
    if (props.styles) _this.mergeStyles(props.styles);
    return _this;
  }

  _createClass(Tooltip, [{
    key: 'render',
    value: function render() {
      var props = this.props;
      var state = this.state;
      var styles = this.styles;
      var show = this.show;
      var hide = this.hide;
      var handleTouch = this.handleTouch;

      return _react2.default.createElement(
        'div',
        {
          onMouseEnter: show,
          onMouseLeave: hide,
          onTouchStart: handleTouch,
          ref: 'wrapper',
          style: styles.wrapper },
        props.children,
        state.visible && _react2.default.createElement(
          'div',
          { ref: 'tooltip', style: styles.tooltip },
          _react2.default.createElement(
            'div',
            { ref: 'content', style: styles.content },
            props.content
          ),
          _react2.default.createElement('div', { ref: 'arrow', style: styles.arrow }),
          _react2.default.createElement('div', { ref: 'gap', style: styles.gap })
        )
      );
    }
  }]);

  return Tooltip;
}(_react2.default.Component);

Tooltip.propTypes = {
  children: _propTypes2.default.any.isRequired,
  content: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
  styles: _propTypes2.default.object
};
exports.default = Tooltip;
},{"react":"node_modules/preact-compat/dist/preact-compat.es.js","react-dom":"node_modules/preact-compat/dist/preact-compat.es.js","prop-types":"node_modules/prop-types/index.js"}],"node_modules/react-lightweight-tooltip/dist-modules/index.js":[function(require,module,exports) {
'use strict';

var _tooltip = require('./components/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = { Tooltip: _tooltip2.default };
},{"./components/tooltip":"node_modules/react-lightweight-tooltip/dist-modules/components/tooltip.js"}],"src/util.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeAuthHeader = exports.printMotion = exports.printStanding = exports.printDistance = exports.getUUID = exports.cleanConnect = exports.nRange = exports.splitEffects = exports.HOST_URL = void 0;

var _store = require("./state/store");

var _preactRedux = require("preact-redux");

var _interface = require("./game/interface");

var _card = require("./shared/card");

var _a, _b, _c;

var HOST_URL = '/api';
exports.HOST_URL = HOST_URL;

if (location.host.split(':')[0] === 'localhost') {
  exports.HOST_URL = HOST_URL = 'http://localhost:8080/api';
}

var splitEffects = function splitEffects(mechs) {
  return mechs.reduce(function (result, mech) {
    var eff = (0, _card.getMechDisplay)(mech.mechanic).eff;

    if (eff) {
      result.mechanics.push(mech);
    } else {
      result.effects.push(mech);
    }

    return result;
  }, {
    effects: [],
    mechanics: []
  });
};

exports.splitEffects = splitEffects;

var nRange = function nRange(n) {
  return Array.apply(null, {
    length: n
  }).map(Number.call, Number);
};

exports.nRange = nRange;

var cleanConnect = function cleanConnect(selector, comp) {
  return (0, _preactRedux.connect)(selector)(comp);
};

exports.cleanConnect = cleanConnect;
var uuid = 0;

var getUUID = function getUUID(obj) {
  if (obj.uuid === undefined) {
    obj.uuid = uuid;
    uuid++;
  }

  return obj.uuid;
};

exports.getUUID = getUUID;

var printDistance = function printDistance(distance) {
  var result = distanceRouter[distance];
  return result || null;
};

exports.printDistance = printDistance;
var distanceRouter = (_a = {}, _a[_interface.DistanceEnum.CLOSE] = "Close", _a[_interface.DistanceEnum.FAR] = "Far", _a[_interface.DistanceEnum.GRAPPLED] = "Grappled", _a);

var printStanding = function printStanding(standing) {
  var result = standingRouter[standing];
  return result || null;
};

exports.printStanding = printStanding;
var standingRouter = (_b = {}, _b[_interface.StandingEnum.PRONE] = "Prone", _b[_interface.StandingEnum.STANDING] = "Standing", _b);

var printMotion = function printMotion(motion) {
  var result = motionRouter[motion];
  return result || null;
};

exports.printMotion = printMotion;
var motionRouter = (_c = {}, _c[_interface.MotionEnum.MOVING] = "Moving", _c[_interface.MotionEnum.STILL] = "Still", _c);

var makeAuthHeader = function makeAuthHeader() {
  var token = _store.store.getState().user.token;

  var header = new Headers();

  if (token) {
    header.set("Authorization", token);
  }

  return header;
};

exports.makeAuthHeader = makeAuthHeader;
},{"./state/store":"src/state/store.ts","preact-redux":"node_modules/preact-redux/dist/preact-redux.esm.js","./game/interface":"src/game/interface.ts","./shared/card":"src/shared/card.ts"}],"src/images/index.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = exports.Arrow = void 0;

var _preact = require("preact");

var _card = require("../shared/card");

var _grapple = _interopRequireDefault(require("./grapple.png"));

var _close = _interopRequireDefault(require("./close.png"));

var _far = _interopRequireDefault(require("./far.png"));

var _moving = _interopRequireDefault(require("./moving.png"));

var _not_close = _interopRequireDefault(require("./not_close.png"));

var _not_grapple = _interopRequireDefault(require("./not_grapple.png"));

var _not_far = _interopRequireDefault(require("./not_far.png"));

var _bloodied = _interopRequireDefault(require("./bloodied.png"));

var _still = _interopRequireDefault(require("./still.png"));

var _standing = _interopRequireDefault(require("./standing.png"));

var _prone = _interopRequireDefault(require("./prone.png"));

var _balanced = _interopRequireDefault(require("./balanced.png"));

var _not_anticipating = _interopRequireDefault(require("./not_anticipating.png"));

var _anticipating = _interopRequireDefault(require("./anticipating.png"));

var _unbalanced = _interopRequireDefault(require("./unbalanced.png"));

var _upArrow = _interopRequireDefault(require("./upArrow.png"));

var _downArrow = _interopRequireDefault(require("./downArrow.png"));

var _bothArrow = _interopRequireDefault(require("./bothArrow.png"));

var _damage = _interopRequireDefault(require("./damage.png"));

var _further = _interopRequireDefault(require("./further.png"));

var _closer = _interopRequireDefault(require("./closer.png"));

var _poise = _interopRequireDefault(require("./poise.png"));

var _losePoise = _interopRequireDefault(require("./losePoise.png"));

var _reactLightweightTooltip = require("react-lightweight-tooltip");

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _a, _b, _c; /// <reference path='./index.d.tsx'/>


var playerRouter = (_a = {}, _a[_card.PlayerEnum.PLAYER] = _downArrow.default, _a[_card.PlayerEnum.OPPONENT] = _upArrow.default, _a[_card.PlayerEnum.BOTH] = _bothArrow.default, _a);
var iconRouter = (_b = {}, _b[_card.AxisEnum.GRAPPLED] = _grapple.default, _b[_card.AxisEnum.CLOSE] = _close.default, _b[_card.AxisEnum.FAR] = _far.default, _b[_card.AxisEnum.MOVING] = _moving.default, _b[_card.AxisEnum.STILL] = _still.default, _b[_card.AxisEnum.STANDING] = _standing.default, _b[_card.AxisEnum.PRONE] = _prone.default, _b[_card.AxisEnum.BALANCED] = _balanced.default, _b[_card.AxisEnum.ANTICIPATING] = _anticipating.default, _b[_card.AxisEnum.UNBALANCED] = _unbalanced.default, _b[_card.AxisEnum.NOT_ANTICIPATING] = _not_anticipating.default, _b[_card.AxisEnum.DAMAGE] = _damage.default, _b[_card.AxisEnum.CLOSER] = _closer.default, _b[_card.AxisEnum.FURTHER] = _further.default, _b[_card.AxisEnum.POISE] = _poise.default, _b[_card.AxisEnum.LOSE_POISE] = _losePoise.default, _b[_card.AxisEnum.NOT_GRAPPLED] = _not_grapple.default, _b[_card.AxisEnum.NOT_CLOSE] = _not_close.default, _b[_card.AxisEnum.NOT_FAR] = _not_far.default, _b[_card.AxisEnum.BLOODIED] = _bloodied.default, _b[_card.AxisEnum.FRESH] = _bloodied.default, _b);
var classRouter = (_c = {}, _c[_card.AxisEnum.GRAPPLED] = 'distance', _c[_card.AxisEnum.CLOSE] = 'distance', _c[_card.AxisEnum.FAR] = 'distance', _c[_card.AxisEnum.CLOSER] = 'distance', _c[_card.AxisEnum.FURTHER] = 'distance', _c[_card.AxisEnum.NOT_GRAPPLED] = 'distance', _c[_card.AxisEnum.NOT_CLOSE] = 'distance', _c[_card.AxisEnum.NOT_FAR] = 'distance', _c[_card.AxisEnum.MOVING] = 'motion', _c[_card.AxisEnum.STILL] = 'motion', _c[_card.AxisEnum.STANDING] = 'standing', _c[_card.AxisEnum.PRONE] = 'standing', _c[_card.AxisEnum.BALANCED] = 'balance', _c[_card.AxisEnum.ANTICIPATING] = 'balance', _c[_card.AxisEnum.NOT_ANTICIPATING] = 'balance', _c[_card.AxisEnum.UNBALANCED] = 'balance', _c[_card.AxisEnum.POISE] = 'balance', _c[_card.AxisEnum.LOSE_POISE] = 'balance', _c[_card.AxisEnum.DAMAGE] = 'damage', _c[_card.AxisEnum.BLOODIED] = 'damage', _c[_card.AxisEnum.FRESH] = 'invert-damage', _c);

var Arrow = function Arrow(_a) {
  var player = _a.player,
      shouldFlip = _a.shouldFlip;

  if (shouldFlip) {
    if (player === _card.PlayerEnum.OPPONENT) {
      player = _card.PlayerEnum.PLAYER;
    } else if (player === _card.PlayerEnum.PLAYER) {
      player = _card.PlayerEnum.OPPONENT;
    }
  }

  return (0, _preact.h)("div", {
    class: 'inline'
  }, (0, _preact.h)("img", {
    class: 'player-icon',
    src: playerRouter[player]
  }));
};

exports.Arrow = Arrow;
var iconStyle = {
  wrapper: {
    cursor: 'default'
  },
  tooltip: {
    minWidth: '80px',
    whiteSpace: "nowrap"
  },
  arrow: {},
  gap: {},
  content: {
    zIndex: 100
  }
};

var Icon = function Icon(props) {
  var name = props.name;
  var id = String((0, _util.getUUID)(props));
  return (0, _preact.h)("div", {
    class: 'inline'
  }, (0, _preact.h)(_reactLightweightTooltip.Tooltip, {
    content: name,
    styles: iconStyle
  }, (0, _preact.h)("div", {
    class: "inline axis-bg " + classRouter[name]
  }, (0, _preact.h)("img", {
    class: 'axis-icon',
    src: iconRouter[name]
  }))));
};

exports.Icon = Icon;
},{"preact":"node_modules/preact/dist/preact.mjs","../shared/card":"src/shared/card.ts","./grapple.png":"src/images/grapple.png","./close.png":"src/images/close.png","./far.png":"src/images/far.png","./moving.png":"src/images/moving.png","./not_close.png":"src/images/not_close.png","./not_grapple.png":"src/images/not_grapple.png","./not_far.png":"src/images/not_far.png","./bloodied.png":"src/images/bloodied.png","./still.png":"src/images/still.png","./standing.png":"src/images/standing.png","./prone.png":"src/images/prone.png","./balanced.png":"src/images/balanced.png","./not_anticipating.png":"src/images/not_anticipating.png","./anticipating.png":"src/images/anticipating.png","./unbalanced.png":"src/images/unbalanced.png","./upArrow.png":"src/images/upArrow.png","./downArrow.png":"src/images/downArrow.png","./bothArrow.png":"src/images/bothArrow.png","./damage.png":"src/images/damage.png","./further.png":"src/images/further.png","./closer.png":"src/images/closer.png","./poise.png":"src/images/poise.png","./losePoise.png":"src/images/losePoise.png","react-lightweight-tooltip":"node_modules/react-lightweight-tooltip/dist-modules/index.js","../util":"src/util.ts"}],"src/components/game/card/Requirement.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _index = require("../../../images/index");

var _default = function _default(props) {
  return (0, _preact.h)("div", {
    class: 'requirement'
  }, (0, _preact.h)(_index.Arrow, {
    player: props.requirement.player,
    shouldFlip: props.shouldFlip
  }), " ", (0, _preact.h)(_index.Icon, {
    name: props.requirement.axis
  }));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../../images/index":"src/images/index.tsx"}],"src/extras/mechanicDescriptions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMechanicDescription = void 0;

var _card = require("../shared/card");

var _a;

var descObj = (_a = {}, _a[_card.MechanicEnum.BLOCK] = 'Reduces damage by X amount next turn', _a[_card.MechanicEnum.PARRY] = 'Reduces damage by X amount this turn', _a[_card.MechanicEnum.BUFF] = 'Permanently buffs card for future uses', _a[_card.MechanicEnum.CRIPPLE] = 'Permanently adds a terrible card to your opponent\'s deck', _a[_card.MechanicEnum.FOCUS] = 'While on the queue, at the end of your turn, if the condition is met, the effect happens', _a[_card.MechanicEnum.FORCEFUL] = 'Allows you to spend X Poise to get the effect', _a[_card.MechanicEnum.LOCK] = 'That state cannot change for X turns', _a[_card.MechanicEnum.PICK_ONE] = 'You choose which one of the listed effects will happen', _a[_card.MechanicEnum.PREDICT] = 'Guess what the opponent will change with their next card, if correct, you get the effect', _a[_card.MechanicEnum.REFLEX] = 'Plays a random, valid, card from your deck', _a[_card.MechanicEnum.TELEGRAPH] = 'If the condition is met at the end of a turn (besides the turn this is played), the effect happens', _a[_card.MechanicEnum.ENHANCE] = 'All future cards with this tag, will be enhanced by this effect', _a[_card.MechanicEnum.CLUTCH] = 'Increases the cards Priority by X (this turn only)', _a[_card.MechanicEnum.SETUP] = 'Increases the priority of the card played next turn by X (that turn only)', _a[_card.MechanicEnum.RIGID] = 'Decreases hand size by X, next turn only', _a[_card.MechanicEnum.FLUID] = 'Increases hand size by X, next turn only.', _a);

var getMechanicDescription = function getMechanicDescription(mech) {
  return descObj[mech] || null;
};

exports.getMechanicDescription = getMechanicDescription;
},{"../shared/card":"src/shared/card.ts"}],"src/components/game/card/effect.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _Requirement = _interopRequireDefault(require("./Requirement"));

var _card = require("../../../shared/card");

var _images = require("../../../images");

var _mechanicDescriptions = require("../../../extras/mechanicDescriptions");

var _reactLightweightTooltip = require("react-lightweight-tooltip");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Effect = function Effect(_a) {
  var effect = _a.effect,
      shouldFlip = _a.shouldFlip;
  var _b = effect.mechanicRequirements,
      reqs = _b === void 0 ? [] : _b,
      _c = effect.choices,
      choices = _c === void 0 ? [] : _c,
      _d = effect.mechanicEffects,
      effs = _d === void 0 ? [] : _d;

  var _e = (0, _card.getMechDisplay)(effect.mechanic),
      displayEff = _e.eff,
      displayReq = _e.req,
      valueString = _e.valueString,
      displayPick = _e.pick,
      displayState = _e.state,
      value = _e.value;

  var mechClass = displayEff || displayPick ? 'mechanic' : 'icon-section';
  return (0, _preact.h)("div", {
    class: 'small-pad ' + mechClass
  }, effect.mechanic !== undefined && mechWithTooltip(effect.mechanic), displayState && (0, _preact.h)(_images.Arrow, {
    player: effect.player,
    shouldFlip: shouldFlip
  }), displayState && (0, _preact.h)(_images.Icon, {
    name: effect.axis
  }), (displayState || value || valueString) && effect.amount !== undefined && (0, _preact.h)("b", null, effect.amount), (displayEff || displayReq || displayPick) && (0, _preact.h)("span", null, (0, _preact.h)("div", {
    class: 'h-divider'
  }), (0, _preact.h)("div", null, displayReq && (0, _preact.h)("div", {
    class: "req-parent"
  }, reqs.map(function (req, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_Requirement.default, {
      requirement: req,
      shouldFlip: shouldFlip
    }));
  })), displayEff && (0, _preact.h)("div", {
    class: 'h-divider thin'
  }), displayEff && (0, _preact.h)("div", {
    class: "effect-parent"
  }, effs.map(function (eff, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(Effect, {
      effect: eff,
      shouldFlip: shouldFlip
    }));
  })), displayPick && (0, _preact.h)("div", {
    class: "pick-one"
  }, choices.map(function (category, i) {
    return (0, _preact.h)("div", {
      class: "choices",
      key: i
    }, category.map(function (choice, j) {
      return (0, _preact.h)("div", {
        class: "choice",
        key: j
      }, (0, _preact.h)(Effect, {
        effect: choice,
        shouldFlip: shouldFlip
      }), " ");
    }));
  })))));
};

var mechWithTooltip = function mechWithTooltip(mech) {
  var description = (0, _mechanicDescriptions.getMechanicDescription)(mech);
  return (0, _preact.h)(_reactLightweightTooltip.Tooltip, {
    content: description
  }, (0, _preact.h)("div", {
    class: "ml-1 mr-1"
  }, (0, _preact.h)("b", null, mech)));
};

var _default = Effect;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./Requirement":"src/components/game/card/Requirement.tsx","../../../shared/card":"src/shared/card.ts","../../../images":"src/images/index.tsx","../../../extras/mechanicDescriptions":"src/extras/mechanicDescriptions.ts","react-lightweight-tooltip":"node_modules/react-lightweight-tooltip/dist-modules/index.js"}],"src/components/game/card/queueCard.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _effect = _interopRequireDefault(require("./effect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QueueCard = function QueueCard(_a) {
  var identity = _a.identity,
      name = _a.name,
      _b = _a.telegraphs,
      telegraphs = _b === void 0 ? [] : _b,
      _c = _a.focuses,
      focuses = _c === void 0 ? [] : _c,
      player = _a.player;
  var shouldFlip = identity !== player;
  return (0, _preact.h)("div", null, (0, _preact.h)("div", null, name), telegraphs.map(function (eff, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      shouldFlip: shouldFlip,
      effect: eff
    }));
  }), focuses.map(function (eff, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      shouldFlip: shouldFlip,
      effect: eff
    }));
  }));
};

var _default = QueueCard;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./effect":"src/components/game/card/effect.tsx"}],"src/components/game/card/requirement.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _index = require("../../../images/index");

var _default = function _default(props) {
  return (0, _preact.h)("div", {
    class: 'requirement'
  }, (0, _preact.h)(_index.Arrow, {
    player: props.requirement.player,
    shouldFlip: props.shouldFlip
  }), " ", (0, _preact.h)(_index.Icon, {
    name: props.requirement.axis
  }));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../../images/index":"src/images/index.tsx"}],"src/components/game/card/optional.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _requirement = _interopRequireDefault(require("./requirement"));

var _effect = _interopRequireDefault(require("./effect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(props) {
  var unusuable = !props.canPlay;
  return (0, _preact.h)("div", {
    className: "optional " + (unusuable ? 'unusable' : '')
  }, (0, _preact.h)("div", null, props.requirements.map(function (req, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_requirement.default, {
      shouldFlip: props.shouldFlip,
      requirement: req
    }));
  })), (0, _preact.h)("div", {
    class: 'h-divider'
  }), (0, _preact.h)("div", null, props.effects.map(function (eff, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      effect: eff,
      shouldFlip: props.shouldFlip
    }));
  })));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./requirement":"src/components/game/card/requirement.tsx","./effect":"src/components/game/card/effect.tsx"}],"src/components/game/card/fullQueueCard.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _effect = _interopRequireDefault(require("./effect"));

var _Requirement = _interopRequireDefault(require("./Requirement"));

var _optional = _interopRequireDefault(require("./optional"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var FullQueueCard = function FullQueueCard(_a) {
  var identity = _a.identity,
      name = _a.name,
      _b = _a.requirements,
      requirements = _b === void 0 ? [] : _b,
      _c = _a.effects,
      effects = _c === void 0 ? [] : _c,
      _d = _a.optional,
      optional = _d === void 0 ? [] : _d,
      player = _a.player;
  var shouldFlip = identity !== player;
  return (0, _preact.h)("div", null, (0, _preact.h)("div", null, name), (0, _preact.h)("div", {
    class: 'card-section req'
  }, requirements.map(function (req, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_Requirement.default, {
      requirement: req,
      shouldFlip: shouldFlip
    }));
  })), (0, _preact.h)("div", {
    class: 'card-section'
  }, optional.map(function (opt, i) {
    return (0, _preact.h)("span", {
      key: i
    }, " ", (0, _preact.h)(_optional.default, __assign({}, opt, {
      shouldFlip: shouldFlip,
      greyUnusable: true
    })), " ");
  })), (0, _preact.h)("div", {
    class: 'card-section effect'
  }, effects.map(function (effect, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      shouldFlip: shouldFlip,
      effect: effect
    }));
  })));
};

var _default = FullQueueCard;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./effect":"src/components/game/card/effect.tsx","./Requirement":"src/components/game/card/Requirement.tsx","./optional":"src/components/game/card/optional.tsx"}],"src/components/game/board.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _queueCard = _interopRequireDefault(require("./card/queueCard"));

var _dispatch = require("../../game/dispatch");

var _fullQueueCard = _interopRequireDefault(require("./card/fullQueueCard"));

var _dispatch2 = require("../../events/dispatch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var selector = function selector(state) {
  var player = state.player;
  var opponent = state.player === 0 ? 1 : 0;
  var queue = state.queue.map(function (turnArr) {
    return [turnArr[opponent], turnArr[player]];
  });
  return {
    queue: queue,
    player: player
  };
};

var board = function board(props) {
  var _a = props.queue,
      queue = _a === void 0 ? [] : _a,
      player = props.player;
  return (0, _preact.h)("div", {
    class: "queue"
  }, renderBoard(queue, player));
};

var cardNames = function cardNames(cards) {
  if (cards === void 0) {
    cards = [];
  }

  return cards.reduce(function (total, current) {
    return total + "-" + current.id;
  }, "");
};

var cardPlayerKey = function cardPlayerKey(cardsByPlayer) {
  if (cardsByPlayer === void 0) {
    cardsByPlayer = [];
  }

  return cardsByPlayer.reduce(function (total, cards) {
    return total + cardNames(cards);
  }, "");
};

var renderBoard = function renderBoard(queue, identity) {
  if (queue === void 0) {
    queue = [];
  }

  return queue.map(function (cardByPlayer, i) {
    if (cardByPlayer === void 0) {
      cardByPlayer = [];
    }

    var key = cardPlayerKey(cardByPlayer);
    return (0, _preact.h)("div", {
      key: key,
      class: "queue-turn"
    }, (0, _preact.h)("div", {
      class: "history-btn"
    }, (0, _preact.h)("button", {
      onClick: function onClick() {
        return (0, _dispatch2.dispatchDisplayEventHistory)(i);
      }
    }, "H")), cardByPlayer.map(function (cards, j) {
      return cards.map(function (card, k) {
        var opponent = card.player !== identity ? "opponent" : "";
        var shouldAnimate = card.telegraphs && card.telegraphs.length > 0 || card.focuses && card.focuses.length > 0 ? "has-effects" : "";
        return (0, _preact.h)("div", {
          key: card.id
        }, (0, _preact.h)("div", {
          class: "text-center queue-card " + opponent + " " + shouldAnimate,
          onClick: function onClick() {
            return (0, _dispatch.dispatchSwitchCardDisplayMode)(i, j, k);
          }
        }, (0, _preact.h)("div", {
          class: card.showFullCard ? "" : "collapsed"
        }, (0, _preact.h)(_fullQueueCard.default, __assign({}, card, {
          identity: identity
        }))), (0, _preact.h)("div", {
          class: (card.showFullCard ? "collapsed" : "") + " ongoing"
        }, (0, _preact.h)(_queueCard.default, __assign({}, card, {
          identity: identity
        })))));
      });
    }));
  });
};

var _default = function _default(state) {
  return board(selector(state));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./card/queueCard":"src/components/game/card/queueCard.tsx","../../game/dispatch":"src/game/dispatch.ts","./card/fullQueueCard":"src/components/game/card/fullQueueCard.tsx","../../events/dispatch":"src/events/dispatch.ts"}],"src/components/cards/requirement.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _index = require("../../images/index");

var _default = function _default(props) {
  return (0, _preact.h)("div", {
    class: 'requirement'
  }, (0, _preact.h)(_index.Arrow, {
    player: props.requirement.player,
    shouldFlip: props.shouldFlip
  }), " ", (0, _preact.h)(_index.Icon, {
    name: props.requirement.axis
  }));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../images/index":"src/images/index.tsx"}],"src/components/cards/Requirement.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _index = require("../../images/index");

var _default = function _default(props) {
  return (0, _preact.h)("div", {
    class: 'requirement'
  }, (0, _preact.h)(_index.Arrow, {
    player: props.requirement.player,
    shouldFlip: props.shouldFlip
  }), " ", (0, _preact.h)(_index.Icon, {
    name: props.requirement.axis
  }));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../images/index":"src/images/index.tsx"}],"src/components/cards/effect.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _Requirement = _interopRequireDefault(require("./Requirement"));

var _card = require("../../shared/card");

var _images = require("../../images");

var _mechanicDescriptions = require("../../extras/mechanicDescriptions");

var _reactLightweightTooltip = require("react-lightweight-tooltip");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Effect = function Effect(_a) {
  var effect = _a.effect,
      shouldFlip = _a.shouldFlip;
  var _b = effect.mechanicRequirements,
      reqs = _b === void 0 ? [] : _b,
      _c = effect.choices,
      choices = _c === void 0 ? [] : _c,
      _d = effect.mechanicEffects,
      effs = _d === void 0 ? [] : _d;

  var _e = (0, _card.getMechDisplay)(effect.mechanic),
      displayPlayer = _e.player,
      displayAxis = _e.axis,
      displayEff = _e.eff,
      displayReq = _e.req,
      valueString = _e.valueString,
      displayPick = _e.pick,
      displayState = _e.state,
      value = _e.value;

  var mechClass = displayEff || displayPick ? 'mechanic' : 'icon-section';
  if (effect.mechanic === "Rigid") console.log(effect.mechanic, (0, _card.getMechDisplay)(effect.mechanic));
  return (0, _preact.h)("div", {
    class: mechClass
  }, effect.mechanic !== undefined && mechWithTooltip(effect.mechanic), (displayState || displayPlayer) && (0, _preact.h)(_images.Arrow, {
    player: effect.player,
    shouldFlip: shouldFlip
  }), (displayState || displayAxis) && (0, _preact.h)(_images.Icon, {
    name: effect.axis
  }), (displayState || value || valueString) && effect.amount !== undefined && (0, _preact.h)("b", null, effect.amount), (displayEff || displayReq || displayPick) && (0, _preact.h)("div", {
    class: "recurse"
  }, displayReq && (0, _preact.h)("div", {
    class: "req-parent"
  }, reqs.map(function (req, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_Requirement.default, {
      requirement: req,
      shouldFlip: shouldFlip
    }));
  })), displayEff && displayReq && (0, _preact.h)("div", {
    class: 'h-divider thin'
  }), displayEff && (0, _preact.h)("div", {
    class: "eff-parent"
  }, effs.map(function (eff, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(Effect, {
      effect: eff,
      shouldFlip: shouldFlip
    }));
  })), displayPick && (0, _preact.h)("div", {
    class: "pick-one"
  }, choices.map(function (category, i) {
    return (0, _preact.h)("div", {
      class: "choices",
      key: i
    }, category.map(function (choice, j) {
      return (0, _preact.h)("div", {
        class: "choice",
        key: j
      }, (0, _preact.h)(Effect, {
        effect: choice,
        shouldFlip: shouldFlip
      }), " ");
    }));
  }))));
};

var mechWithTooltip = function mechWithTooltip(mech) {
  var description = (0, _mechanicDescriptions.getMechanicDescription)(mech);
  return (0, _preact.h)(_reactLightweightTooltip.Tooltip, {
    content: description
  }, (0, _preact.h)("div", {
    class: "ml-1 mr-1"
  }, (0, _preact.h)("b", null, mech)));
};

var _default = Effect;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./Requirement":"src/components/cards/Requirement.tsx","../../shared/card":"src/shared/card.ts","../../images":"src/images/index.tsx","../../extras/mechanicDescriptions":"src/extras/mechanicDescriptions.ts","react-lightweight-tooltip":"node_modules/react-lightweight-tooltip/dist-modules/index.js"}],"src/components/cards/optional.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _requirement = _interopRequireDefault(require("./requirement"));

var _effect = _interopRequireDefault(require("./effect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(props) {
  var unusuable = !props.canPlay;
  return (0, _preact.h)("div", {
    className: "optional mechanic " + (unusuable ? 'unusable' : '')
  }, (0, _preact.h)("div", null, (0, _preact.h)("b", null, "Optional:")), (0, _preact.h)("div", null, (0, _preact.h)("div", {
    class: "req-parent"
  }, props.requirements.map(function (req, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_requirement.default, {
      shouldFlip: props.shouldFlip,
      requirement: req
    }));
  })), (0, _preact.h)("div", {
    class: 'h-divider'
  }), (0, _preact.h)("div", {
    class: "eff-parent"
  }, props.effects.map(function (eff, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      effect: eff,
      shouldFlip: props.shouldFlip
    }));
  }))));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./requirement":"src/components/cards/requirement.tsx","./effect":"src/components/cards/effect.tsx"}],"src/components/cards/fullCard.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _card = require("../../shared/card");

var _requirement = _interopRequireDefault(require("./requirement"));

var _optional = _interopRequireDefault(require("./optional"));

var _effect = _interopRequireDefault(require("./effect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var splitDisplays = function splitDisplays(effects) {
  var icons = [];
  var mechs = [];
  effects.forEach(function (eff) {
    var display = (0, _card.getMechDisplay)(eff.mechanic);

    if (display.eff || display.pick) {
      mechs.push(eff);
    } else {
      icons.push(eff);
    }
  });
  return [icons, mechs];
};

var _default = function _default(_a) {
  var card = _a.card,
      shouldFlip = _a.shouldFlip;

  var _b = splitDisplays(card.effects),
      icons = _b[0],
      mechs = _b[1];

  var titleChange = card.name.length > 12 ? " small" : '';
  var mechSize = mechs.length >= 3 ? ' small' : '';
  var tags = card.tags || [];
  return (0, _preact.h)("div", {
    class: "full-card"
  }, (0, _preact.h)("div", {
    class: "title-bar"
  }, (0, _preact.h)("div", {
    class: "title" + titleChange
  }, " ", card.name), (0, _preact.h)("div", {
    class: "requirements"
  }, " ", card.requirements.map(function (req, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_requirement.default, {
      requirement: req,
      shouldFlip: shouldFlip
    }));
  }))), (0, _preact.h)("div", {
    class: "effects"
  }, icons.map(function (eff, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      effect: eff,
      shouldFlip: shouldFlip
    }));
  })), (0, _preact.h)("div", {
    class: "effects" + mechSize
  }, card.optional.map(function (opt, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_optional.default, {
      shouldFlip: shouldFlip,
      effects: opt.effects,
      requirements: opt.requirements
    }));
  }), mechs.map(function (eff, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      effect: eff,
      shouldFlip: shouldFlip
    }));
  })), (0, _preact.h)("div", {
    class: "tags"
  }, tags.map(function (tag) {
    return (0, _preact.h)("div", null, tag.value);
  })), (0, _preact.h)("div", {
    class: 'priority'
  }, card.priority));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../shared/card":"src/shared/card.ts","./requirement":"src/components/cards/requirement.tsx","./optional":"src/components/cards/optional.tsx","./effect":"src/components/cards/effect.tsx"}],"src/components/game/card/viewer.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.playerRouter = void 0;

var _preact = require("preact");

var _card = require("../../../shared/card");

var _effect = _interopRequireDefault(require("./effect"));

var _requirement = _interopRequireDefault(require("./requirement"));

var _optional = _interopRequireDefault(require("./optional"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var _a;

var playerRouter = (_a = {}, _a[_card.PlayerEnum.PLAYER] = '↓', _a[_card.PlayerEnum.OPPONENT] = '↑', _a[_card.PlayerEnum.BOTH] = '↕', _a);
exports.playerRouter = playerRouter;

var _default = function _default(_a) {
  var name = _a.name,
      optional = _a.optional,
      requirements = _a.requirements,
      effects = _a.effects;
  return (0, _preact.h)("div", {
    class: 'game-card text-center'
  }, (0, _preact.h)("div", {
    class: 'title'
  }, name), (0, _preact.h)("div", {
    class: 'card-section req'
  }, requirements.map(function (req, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_requirement.default, {
      requirement: req
    }));
  })), (0, _preact.h)("div", {
    class: 'card-section'
  }, optional.map(function (opt, i) {
    return (0, _preact.h)("span", {
      key: i
    }, " ", (0, _preact.h)(_optional.default, __assign({}, opt)), " ");
  })), (0, _preact.h)("div", {
    class: 'card-section effect'
  }, effects.map(function (effect, i) {
    return (0, _preact.h)("span", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      effect: effect
    }));
  })));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../../shared/card":"src/shared/card.ts","./effect":"src/components/game/card/effect.tsx","./requirement":"src/components/game/card/requirement.tsx","./optional":"src/components/game/card/optional.tsx"}],"src/components/game/hand.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../hand/dispatch");

var _fullCard = _interopRequireDefault(require("../cards/fullCard"));

var _viewer = _interopRequireDefault(require("./card/viewer"));

var _util = require("../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var selector = function selector(state) {
  var hand;

  if (state.hand.showHand) {
    hand = state.hand.hands[state.game.player] || [];
  } else {
    hand = [];
  }

  return {
    hand: hand,
    showFullCard: state.gameDisplay.showFullCard
  };
};

var Hand = function Hand(_a) {
  var hand = _a.hand,
      showFullCard = _a.showFullCard;
  return (0, _preact.h)("div", {
    class: 'card-container player'
  }, hand.map(function (card, i) {
    var key = card === undefined ? 'blank' : card.name;
    return (0, _preact.h)("div", {
      class: 'inline',
      key: key,
      onClick: function onClick() {
        return (0, _dispatch.dispatchPickedCard)(i);
      }
    }, showFullCard && (0, _preact.h)(_viewer.default, __assign({}, card)), showFullCard || (0, _preact.h)(_fullCard.default, {
      card: card
    }));
  }));
};

var _default = (0, _util.cleanConnect)(selector, Hand);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../hand/dispatch":"src/hand/dispatch.ts","../cards/fullCard":"src/components/cards/fullCard.tsx","./card/viewer":"src/components/game/card/viewer.tsx","../../util":"src/util.ts"}],"src/components/game/predictChoices.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../game/dispatch");

var _interface = require("../../game/interface");

var _interface2 = require("../../gameDisplay/interface");

var _util = require("../../util");

var _reactLightweightTooltip = require("react-lightweight-tooltip");

var selector = function selector(state) {
  return {
    display: state.gameDisplay.screen
  };
};

var tooltipStyle = {
  wrapper: {
    cursor: 'default',
    transform: 'translate(200px, 40px)'
  },
  tooltip: {
    width: '1.5rem'
  },
  arrow: {},
  gap: {},
  content: {
    zIndex: 100
  }
};

var Choices = function Choices(_a) {
  var display = _a.display;

  switch (display) {
    case _interface2.GameDisplayEnum.PREDICT:
      return (0, _preact.h)("div", null, (0, _preact.h)(Prediction, null));

    default:
      return (0, _preact.h)("span", null);
  }
};

var Prediction = function Prediction() {
  return (0, _preact.h)("div", {
    class: "prediction-wrapper"
  }, (0, _preact.h)(_reactLightweightTooltip.Tooltip, {
    styles: tooltipStyle,
    content: "Guess correctly what state will be on your opponents card this turn to get prediction effect"
  }, (0, _preact.h)("div", {
    class: "help"
  }, "?")), (0, _preact.h)("div", {
    class: "prediction-choices"
  }, (0, _preact.h)("h2", {
    class: "title"
  }, "Predict: "), (0, _preact.h)("div", {
    class: "prediction-offset"
  }, (0, _preact.h)("div", {
    class: "prediction-choice",
    onClick: function onClick() {
      return (0, _dispatch.dispatchMadePrediction)(_interface.PredictionEnum.DISTANCE);
    }
  }, "Distance"), (0, _preact.h)("div", {
    class: "prediction-offset"
  }, (0, _preact.h)("div", {
    class: "prediction-choice",
    onClick: function onClick() {
      return (0, _dispatch.dispatchMadePrediction)(_interface.PredictionEnum.MOTION);
    }
  }, "Motion"), (0, _preact.h)("div", {
    class: "prediction-offset"
  }, (0, _preact.h)("div", {
    class: "prediction-choice",
    onClick: function onClick() {
      return (0, _dispatch.dispatchMadePrediction)(_interface.PredictionEnum.STANDING);
    }
  }, "Standing"), (0, _preact.h)("div", {
    class: "prediction-offset"
  }, (0, _preact.h)("div", {
    class: "prediction-choice",
    onClick: function onClick() {
      return (0, _dispatch.dispatchMadePrediction)(_interface.PredictionEnum.NONE);
    }
  }, "None")))))));
};

var _default = (0, _util.cleanConnect)(selector, Choices);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../game/dispatch":"src/game/dispatch.ts","../../game/interface":"src/game/interface.ts","../../gameDisplay/interface":"src/gameDisplay/interface.ts","../../util":"src/util.ts","react-lightweight-tooltip":"node_modules/react-lightweight-tooltip/dist-modules/index.js"}],"src/components/game/stateMachine/poise.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _images = require("../../../images");

var _card = require("../../../shared/card");

var selector = function selector(state) {
  return {
    poise: state.playerStates[state.playerIndex].poise
  };
};

var Poise = function Poise(_a) {
  var poise = _a.poise;
  var unbalancedArr = [0, 1, 2];
  var balancedArr = [3, 4, 5, 6];
  var anticipatingArr = [7, 8, 9];
  return (0, _preact.h)("div", {
    class: "poise-section"
  }, (0, _preact.h)("div", {
    class: poiseTitleClass(poise)
  }, "Poise: ", poiseLevel(poise)), (0, _preact.h)("div", {
    class: "poise-container"
  }, (0, _preact.h)("div", {
    class: "unbalanced"
  }, (0, _preact.h)("div", null, "Unbalanced"), (0, _preact.h)("div", {
    class: 'poise-icon'
  }, unbalancedArr.map(function (i) {
    var hasPoise = i < poise;
    return (0, _preact.h)("div", {
      class: 'axis-icon',
      key: '' + i + hasPoise
    }, (0, _preact.h)(PoiseIcon, {
      hasPoise: hasPoise
    }));
  }))), (0, _preact.h)("div", {
    class: "balanced"
  }, (0, _preact.h)("div", null, "Balanced"), (0, _preact.h)("div", {
    class: 'poise-icon'
  }, balancedArr.map(function (i) {
    var hasPoise = i < poise;
    return (0, _preact.h)("div", {
      key: '' + i + hasPoise
    }, (0, _preact.h)(PoiseIcon, {
      hasPoise: hasPoise
    }));
  }))), (0, _preact.h)("div", {
    class: "anticipating"
  }, (0, _preact.h)("div", null, "Anticipating"), (0, _preact.h)("div", {
    class: 'poise-icon'
  }, anticipatingArr.map(function (i) {
    var hasPoise = i < poise;
    return (0, _preact.h)("div", {
      key: '' + i + hasPoise
    }, (0, _preact.h)(PoiseIcon, {
      hasPoise: hasPoise
    }));
  })))));
};

var poiseTitleClass = function poiseTitleClass(poise) {
  return "poise-title " + poiseLevel(poise).toLowerCase();
};

var poiseLevel = function poiseLevel(poise) {
  if (poise <= 3) return 'Unbalanced';
  if (poise >= 8) return 'Anticipating';
  return 'Balanced';
};

var PoiseIcon = function PoiseIcon(_a) {
  var hasPoise = _a.hasPoise;

  if (hasPoise) {
    return (0, _preact.h)(_images.Icon, {
      name: _card.AxisEnum.POISE
    });
  }

  return (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.LOSE_POISE
  });
};

var _default = function _default(state) {
  return Poise(selector(state));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../../images":"src/images/index.tsx","../../../shared/card":"src/shared/card.ts"}],"src/components/game/stateMachine/statesPieces.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Distance = exports.Standing = exports.Motion = exports.Health = exports.Block = void 0;

var _preact = require("preact");

var _card = require("../../../shared/card");

var _util = require("../../../util");

var _interface = require("../../../game/interface");

var _images = require("../../../images");

var Block = function Block(_a) {
  var block = _a.block,
      playerIndex = _a.playerIndex;
  return (0, _preact.h)("div", {
    class: "state-piece-container health"
  }, (0, _preact.h)("div", {
    class: "state-piece-title"
  }, "Block"), (0, _preact.h)("div", {
    class: "state-content"
  }, block[playerIndex]));
};

exports.Block = Block;

var Health = function Health(_a) {
  var health = _a.health,
      playerIndex = _a.playerIndex;
  return (0, _preact.h)("div", {
    class: 'state-piece-container health'
  }, (0, _preact.h)("div", {
    class: "state-piece-title"
  }, "Health"), (0, _preact.h)("div", {
    class: "state-content"
  }, health[playerIndex]));
};

exports.Health = Health;

var Motion = function Motion(_a) {
  var _b = _a.playerIndex,
      playerIndex = _b === void 0 ? 0 : _b,
      _c = _a.stateDurations,
      stateDurations = _c === void 0 ? [] : _c,
      _d = _a.playerStates,
      playerStates = _d === void 0 ? [] : _d;
  var motion = playerStates[playerIndex].motion;
  var duration = stateDurations[playerIndex].motion;
  return (0, _preact.h)("div", {
    class: 'state-piece-container'
  }, (0, _preact.h)("div", {
    class: 'state-piece-title motion'
  }, (0, _util.printMotion)(motion)), (0, _preact.h)("div", {
    class: 'state-pieces'
  }, (0, _preact.h)("div", {
    class: "state-piece motion " + (motion === _interface.MotionEnum.STILL ? '' : 'inactive')
  }, (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.STILL
  })), (0, _preact.h)("div", {
    class: "state-piece motion " + (motion === _interface.MotionEnum.MOVING ? '' : 'inactive')
  }, (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.MOVING
  }), " ", duration)));
};

exports.Motion = Motion;

var Standing = function Standing(_a) {
  var _b = _a.playerStates,
      playerStates = _b === void 0 ? [] : _b,
      _c = _a.stateDurations,
      stateDurations = _c === void 0 ? [] : _c,
      _d = _a.playerIndex,
      playerIndex = _d === void 0 ? 0 : _d;
  var standing = playerStates[playerIndex].standing;
  var duration = stateDurations[playerIndex].standing;
  return (0, _preact.h)("div", {
    class: 'state-piece-container'
  }, (0, _preact.h)("div", {
    class: 'state-piece-title standing'
  }, (0, _util.printStanding)(standing)), (0, _preact.h)("div", {
    class: 'state-pieces'
  }, (0, _preact.h)("div", {
    class: "state-piece standing " + (standing === _interface.StandingEnum.STANDING ? '' : 'inactive')
  }, (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.STANDING
  })), (0, _preact.h)("div", {
    class: "state-piece standing " + (standing === _interface.StandingEnum.PRONE ? '' : 'inactive')
  }, (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.PRONE
  }), " ", duration)));
};

exports.Standing = Standing;

var Distance = function Distance(_a) {
  var distance = _a.distance;
  return (0, _preact.h)("div", {
    class: 'distance container-distance'
  }, (0, _preact.h)("div", {
    class: 'distance-title'
  }, (0, _util.printDistance)(distance)), (0, _preact.h)("div", {
    class: 'distance-pieces'
  }, (0, _preact.h)("div", {
    class: "state-piece distance " + (distance === _interface.DistanceEnum.FAR ? '' : 'inactive')
  }, (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.FAR
  })), (0, _preact.h)("div", {
    class: "state-piece distance " + (distance === _interface.DistanceEnum.CLOSE ? '' : 'inactive')
  }, (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.CLOSE
  })), (0, _preact.h)("div", {
    class: "state-piece distance " + (distance === _interface.DistanceEnum.GRAPPLED ? '' : 'inactive')
  }, (0, _preact.h)(_images.Icon, {
    name: _card.AxisEnum.GRAPPLED
  }))));
};

exports.Distance = Distance;
},{"preact":"node_modules/preact/dist/preact.mjs","../../../shared/card":"src/shared/card.ts","../../../util":"src/util.ts","../../../game/interface":"src/game/interface.ts","../../../images":"src/images/index.tsx"}],"src/components/game/stateMachine/playerStates.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _poise = _interopRequireDefault(require("./poise"));

var _statesPieces = require("./statesPieces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

;

var _default = function _default(props) {
  return (0, _preact.h)("div", {
    class: 'state-machine'
  }, (0, _preact.h)("div", {
    class: "poise"
  }, (0, _preact.h)(_poise.default, __assign({}, props, {
    playerIndex: props.identity
  }))), (0, _preact.h)("div", {
    class: "axis"
  }, (0, _preact.h)(_statesPieces.Standing, __assign({}, props, {
    playerIndex: props.identity
  })), (0, _preact.h)(_statesPieces.Motion, __assign({}, props, {
    playerIndex: props.identity
  }))), (0, _preact.h)("div", {
    class: "health"
  }, (0, _preact.h)(_statesPieces.Health, __assign({}, props, {
    playerIndex: props.identity
  })), (0, _preact.h)(_statesPieces.Block, __assign({}, props, {
    playerIndex: props.identity
  }))));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./poise":"src/components/game/stateMachine/poise.tsx","./statesPieces":"src/components/game/stateMachine/statesPieces.tsx"}],"src/components/game/predictions.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _effect = _interopRequireDefault(require("./card/effect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selector = function selector(state) {
  var predictions = state.predictions || [];
  return {
    predictions: predictions.map(function (pred, player) {
      if (!pred) return null;
      return {
        isMine: player === state.player,
        prediction: pred.prediction,
        mechanics: pred.mechanics
      };
    })
  };
};

var Prediction = function Prediction(_a) {
  var predictions = _a.predictions;

  if (predictions.length > 0) {
    return (0, _preact.h)("div", {
      class: 'predictions'
    }, (0, _preact.h)("div", {
      class: "title"
    }, "Predictions: "), predictions.map(function (pred, i) {
      if (!pred) return null;
      var isMine = pred.isMine ? '' : 'opponent';
      return (0, _preact.h)("div", {
        class: 'prediction ' + isMine,
        key: i
      }, pred.prediction && (0, _preact.h)("div", {
        class: "guess"
      }, "Prediction: ", pred.prediction), pred.mechanics.map(function (mech, i) {
        return (0, _preact.h)("div", {
          key: i
        }, (0, _preact.h)(_effect.default, {
          effect: mech,
          shouldFlip: !pred.isMine
        }), " ");
      }));
    }));
  } else {
    return (0, _preact.h)("div", null);
  }
};

var _default = function _default(props) {
  return Prediction(selector(props));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./card/effect":"src/components/game/card/effect.tsx"}],"src/components/game/card/handCard.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _optional = _interopRequireDefault(require("./optional"));

var _effect = _interopRequireDefault(require("./effect"));

var _Requirement = _interopRequireDefault(require("./Requirement"));

var _util = require("../../../util");

var _reactLightweightTooltip = require("react-lightweight-tooltip");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var HandCard = function HandCard(card) {
  var name = card.name,
      optional = card.optional,
      effects = card.effects,
      requirements = card.requirements,
      _a = card.tags,
      tags = _a === void 0 ? [] : _a,
      priority = card.priority,
      shouldFlip = card.shouldFlip;

  var _b = (0, _util.splitEffects)(effects),
      effOnly = _b.effects,
      mechanics = _b.mechanics;

  return (0, _preact.h)("div", {
    class: 'game-card text-center'
  }, (0, _preact.h)("div", {
    class: 'title'
  }, (0, _preact.h)("div", null), (0, _preact.h)("div", null, name), " ", (0, _preact.h)("div", {
    class: "priority"
  }, renderPriority(priority)), " "), (0, _preact.h)("div", {
    class: 'card-section req'
  }, requirements.map(function (req, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_Requirement.default, {
      shouldFlip: shouldFlip,
      requirement: req
    }));
  })), (0, _preact.h)("div", {
    class: "tags"
  }, tags.map(function (_a, i) {
    var value = _a.value;
    return (0, _preact.h)("div", {
      key: i
    }, value);
  })), (0, _preact.h)("div", {
    class: 'card-section '
  }, optional.map(function (opt, i) {
    return (0, _preact.h)("div", {
      key: i
    }, " ", (0, _preact.h)(_optional.default, __assign({}, opt, {
      shouldFlip: shouldFlip,
      greyUnusable: true
    })), " ");
  })), (0, _preact.h)("div", {
    class: 'card-section effect'
  }, (0, _preact.h)("div", null, effOnly.map(function (effect, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      shouldFlip: shouldFlip,
      effect: effect
    }));
  })), (0, _preact.h)("div", null, mechanics.map(function (effect, i) {
    return (0, _preact.h)("div", {
      key: i
    }, (0, _preact.h)(_effect.default, {
      shouldFlip: shouldFlip,
      effect: effect
    }));
  }))));
};

var renderPriority = function renderPriority(priority) {
  return (0, _preact.h)(_reactLightweightTooltip.Tooltip, {
    content: "Priority: When 2 cards say conflicting things, the one with the higher number wins",
    styles: priorityStyle
  }, priority);
};

var priorityStyle = {
  wrapper: {
    cursor: 'default'
  },
  tooltip: {
    minWidth: '80px',
    whiteSpace: "nowrap"
  },
  arrow: {},
  gap: {},
  content: {
    zIndex: 100
  }
};
var _default = HandCard;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./optional":"src/components/game/card/optional.tsx","./effect":"src/components/game/card/effect.tsx","./Requirement":"src/components/game/card/Requirement.tsx","../../../util":"src/util.ts","react-lightweight-tooltip":"node_modules/react-lightweight-tooltip/dist-modules/index.js"}],"src/components/game/pickOne.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _handCard = _interopRequireDefault(require("./card/handCard"));

var _dispatch = require("../../game/dispatch");

var _util = require("../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var selector = function selector(state) {
  var choices = state.game.choices.map(function (choice, i) {
    var card = {
      name: "Choice " + i,
      requirements: [],
      optional: [],
      effects: choice
    };
    return card;
  });
  return {
    choices: choices
  };
};

var PickOne = function PickOne(_a) {
  var choices = _a.choices;
  return (0, _preact.h)("div", null, "Pick One", (0, _preact.h)("div", null, choices.map(function (choice, i) {
    return (0, _preact.h)("div", {
      class: "inline",
      onClick: function onClick() {
        return (0, _dispatch.dispatchDidPickOne)(i);
      }
    }, (0, _preact.h)(_handCard.default, __assign({}, choice)));
  })));
};

var _default = (0, _util.cleanConnect)(selector, PickOne);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./card/handCard":"src/components/game/card/handCard.tsx","../../game/dispatch":"src/game/dispatch.ts","../../util":"src/util.ts"}],"src/components/game/forceful.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _card = require("../../shared/card");

var _handCard = _interopRequireDefault(require("./card/handCard"));

var _util = require("../../util");

var _dispatch = require("../../game/dispatch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var selector = function selector(state) {
  return state.game.forceful;
};

var forceful = function forceful(_a) {
  var cardName = _a.cardName,
      mechanic = _a.mechanic;
  var dontUse = makeDontUse();
  var use = makeUse(mechanic);
  return (0, _preact.h)("div", null, (0, _preact.h)("h3", null, " ", cardName, " use ", (0, _preact.h)("b", null, "Forceful?")), (0, _preact.h)("div", {
    class: 'card-container'
  }, (0, _preact.h)("div", {
    class: 'inline',
    onClick: function onClick() {
      return (0, _dispatch.dispatchDidPickForecful)(false);
    }
  }, (0, _preact.h)(_handCard.default, __assign({}, dontUse))), (0, _preact.h)("div", {
    class: 'card-container',
    onClick: function onClick() {
      return (0, _dispatch.dispatchDidPickForecful)(true);
    }
  }, (0, _preact.h)(_handCard.default, __assign({}, use)))));
};

var makeDontUse = function makeDontUse() {
  return {
    name: "Don't Use",
    effects: [],
    requirements: [],
    optional: []
  };
};

var makeUse = function makeUse(mechanic) {
  return {
    name: 'Use',
    requirements: [],
    effects: __spreadArrays([{
      axis: _card.AxisEnum.LOSE_POISE,
      player: _card.PlayerEnum.PLAYER,
      amount: mechanic.amount
    }], mechanic.mechanicEffects),
    optional: []
  };
};

var _default = (0, _util.cleanConnect)(selector, forceful);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../shared/card":"src/shared/card.ts","./card/handCard":"src/components/game/card/handCard.tsx","../../util":"src/util.ts","../../game/dispatch":"src/game/dispatch.ts"}],"src/extras/gameOverMessages.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBothLoseMessage = exports.getLosingMessage = exports.getWinningMessage = void 0;
var winningMessages = ['Daaammnnn, he got wrecked', 'I think that was illegal', 'Congrats, I think that\'s murder', 'Too easy', 'It\'s like they were standing still'];
var losingMessages = ['Got wrekt', 'I don\'t think it\' supposed to bend that way', 'You should call a lawyer...and a doctor', 'Get good', 'That looked...unpleasant', 'Pollock or Picasso, I can\'t tell'];
var bothLoseMessages = ['Violence is not the answer', 'Everybody loses!', 'That was MAD', 'Have you considered words?'];

var getWinningMessage = function getWinningMessage() {
  var index = Math.floor(Math.random() * winningMessages.length);
  return winningMessages[index];
};

exports.getWinningMessage = getWinningMessage;

var getLosingMessage = function getLosingMessage() {
  var index = Math.floor(Math.random() * losingMessages.length);
  return losingMessages[index];
};

exports.getLosingMessage = getLosingMessage;

var getBothLoseMessage = function getBothLoseMessage() {
  var index = Math.floor(Math.random() * bothLoseMessages.length);
  return bothLoseMessages[index];
};

exports.getBothLoseMessage = getBothLoseMessage;
},{}],"src/components/game/events.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _interface = require("../../events/interface");

var _preactRedux = require("preact-redux");

var _images = require("../../images");

var _dispatch = require("../../events/dispatch");

var _gameOverMessages = require("../../extras/gameOverMessages");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var selector = function selector(state) {
  return __assign(__assign({}, state.events), {
    player: state.game.player
  });
};

var Events =
/** @class */
function (_super) {
  __extends(Events, _super);

  function Events(props) {
    var _this = _super.call(this, props) || this;

    _this.addEvent = function () {
      var _a = _this.state,
          counter = _a.counter,
          events = _a.events;

      if (counter < _this.props.events.length) {
        var cancelTimeout = setTimeout(function () {
          _this.addEvent();
        }, _this.props.playSpeed || _interface.EVENT_PLAY_SPEED);

        _this.setState({
          cancelTimeout: cancelTimeout,
          events: __spreadArrays(events, [_this.props.events[counter]]),
          counter: counter + 1
        });
      }
    };

    _this.reducer = function (event, opponent) {
      if (event === null) return null;

      switch (event.eventType) {
        case _interface.EventTypeEnum.CARD_NAME:
          return _this.renderCard(event, opponent);

        case _interface.EventTypeEnum.EFFECT:
          return _this.renderEffect(event, opponent);

        case _interface.EventTypeEnum.MECHANIC:
          return _this.renderMechanic(event, opponent);

        case _interface.EventTypeEnum.ADDED_MECHANIC:
          return _this.renderAddedMechanic(event, opponent);

        case _interface.EventTypeEnum.REVEAL_PREDICTION:
          return _this.renderRevealPrediction(event, opponent);

        case _interface.EventTypeEnum.GAME_OVER:
          return _this.renderGameOver(event);

        case _interface.EventTypeEnum.EVENT_SECTION:
          return _this.renderEventSection(event);

        case _interface.EventTypeEnum.CARD_NAME_SECTION:
          return _this.renderCardNameSection(event);

        case _interface.EventTypeEnum.PREDICTION_SECTION:
          return _this.renderPredictionSection(event);

        default:
          return null;
      }
    };

    _this.renderGameOver = function (event) {
      var lost = event.winner !== _this.props.player;

      if (event.winner < 0) {
        return (0, _preact.h)("div", {
          class: "event-game-over opponent"
        }, "Everybody Loses!", (0, _preact.h)("div", {
          class: "note"
        }, (0, _gameOverMessages.getBothLoseMessage)()));
      }

      if (lost) {
        return (0, _preact.h)("div", {
          class: "event-game-over opponent"
        }, "You Lose!", (0, _preact.h)("div", {
          class: "note"
        }, (0, _gameOverMessages.getLosingMessage)()));
      }

      return (0, _preact.h)("div", {
        class: "event-game-over"
      }, "You Win!", (0, _preact.h)("div", {
        class: "note"
      }, (0, _gameOverMessages.getWinningMessage)()));
    };

    _this.renderAddedMechanic = function (event, opponent) {
      return (0, _preact.h)("div", {
        class: "event-effect " + (opponent ? "opponent" : "")
      }, "Added: ", event.mechanicName);
    };

    _this.renderRevealPrediction = function (event, opponent) {
      var prediction = event.prediction,
          correct = event.correct,
          _a = event.correctGuesses,
          correctGuesses = _a === void 0 ? [] : _a;
      return (0, _preact.h)("div", {
        class: "event-predict " + (opponent ? "opponent" : "")
      }, (0, _preact.h)("div", null, "Prediction: ", prediction, " ", (0, _preact.h)("div", {
        class: "inline small"
      }, correct ? "Correct" : "Incorrect")), (0, _preact.h)("div", {
        class: "changed"
      }, "Correct Prediction(s): ", correctGuesses.map(function (guess, i) {
        return (0, _preact.h)("div", {
          key: i,
          class: "inline"
        }, " ", guess, " ");
      })));
    };

    _this.renderCard = function (event, opponent) {
      return (0, _preact.h)("div", {
        class: "event-card " + (opponent ? "opponent" : "")
      }, " ", (0, _preact.h)("div", null), (0, _preact.h)("div", null, event.cardName), " ", (0, _preact.h)("div", {
        class: "priority"
      }, event.priority), " ");
    };

    _this.renderEffect = function (event, opponent) {
      var _a = event.effect,
          player = _a.player,
          axis = _a.axis,
          mechanic = _a.mechanic,
          amount = _a.amount;
      var _b = event.happenedTo,
          happenedTo = _b === void 0 ? [] : _b;
      var blocked = happenedTo.some(function (value) {
        return value === _interface.HappensEnum.BLOCKED;
      }) ? "blocked" : "";
      return (0, _preact.h)("div", {
        class: "event-effect " + (opponent ? "opponent" : "") + " " + blocked
      }, mechanic !== undefined && mechanic, mechanic !== undefined && " ", player !== undefined && (0, _preact.h)(_images.Arrow, {
        player: player,
        shouldFlip: opponent
      }), axis !== undefined && (0, _preact.h)(_images.Icon, {
        name: axis
      }), axis !== undefined && " ", amount !== undefined && amount);
    };

    _this.renderMechanic = function (event, opponent) {
      return (0, _preact.h)("div", {
        class: "event-mechanic " + (opponent ? "opponent" : "")
      }, event.cardName, ": ", event.mechanicName);
    };

    _this.renderEventSection = function (eventSection) {
      return (0, _preact.h)("div", {
        class: "event-section"
      }, eventSection.gameEvents.map(function (playerEvent, playerIndex) {
        return (0, _preact.h)("div", {
          class: "players-events",
          key: playerIndex
        }, playerEvent.gameEvents.map(function (event) {
          if (event === null) {
            return (0, _preact.h)("div", null);
          }

          var opponent = event.playedBy !== _this.props.player;
          return _this.reducer(event, opponent);
        }));
      }));
    };

    _this.renderPredictionSection = function (_a) {
      var _b = _a.gameEvents,
          events = _b === void 0 ? [] : _b;
      return (0, _preact.h)("div", {
        class: "event-section"
      }, events.map(function (playerEvent, player) {
        if (!playerEvent) return (0, _preact.h)("div", null);
        var opponent = player !== _this.props.player;
        return (0, _preact.h)("div", {
          class: "players-events",
          key: player
        }, _this.renderRevealPrediction(playerEvent, opponent));
      }));
    };

    _this.renderCardNameSection = function (eventSection) {
      return (0, _preact.h)("div", {
        class: "event-section"
      }, eventSection.gameEvents.map(function (cardEvent, playerIndex) {
        if (cardEvent) {
          var opponent = cardEvent.playedBy !== _this.props.player;
          return (0, _preact.h)("div", {
            class: "card-names"
          }, _this.renderCard(cardEvent, opponent));
        }

        return (0, _preact.h)("div", {
          class: "card-names",
          key: playerIndex
        });
      }));
    };

    _this.state = {
      events: [],
      counter: 0,
      startingEvents: props.events
    };

    _this.addEvent();

    return _this;
  }

  Events.prototype.componentWillReceiveProps = function (nextProps) {
    var _this = this;

    if (nextProps.events !== this.state.startingEvents) {
      if (this.state.cancelTimeout) {
        clearTimeout(this.state.cancelTimeout);
      }

      this.setState({
        startingEvents: nextProps.events,
        events: [],
        counter: 0
      });
      setTimeout(function () {
        _this.addEvent();
      }, _interface.EVENT_PLAY_SPEED);
    }
  };

  Events.prototype.render = function () {
    var _this = this;

    var _a = this.state.events,
        events = _a === void 0 ? [] : _a;
    return (0, _preact.h)("div", {
      class: "event-modal"
    }, (0, _preact.h)("div", {
      class: "event-background",
      onClick: _dispatch.dispatchFinishedDisplayingEvents
    }), (0, _preact.h)("div", {
      class: "event-container"
    }, events.map(function (event, i) {
      return (0, _preact.h)("div", {
        class: "event",
        key: JSON.stringify(event) + i
      }, _this.reducer(event));
    })));
  };

  return Events;
}(_preact.Component);

var _default = (0, _preactRedux.connect)(selector)(Events);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../events/interface":"src/events/interface.ts","preact-redux":"node_modules/preact-redux/dist/preact-redux.esm.js","../../images":"src/images/index.tsx","../../events/dispatch":"src/events/dispatch.ts","../../extras/gameOverMessages":"src/extras/gameOverMessages.ts"}],"src/components/game/oppHand.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _util = require("../../util");

var _fullCard = _interopRequireDefault(require("../cards/fullCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selector = function selector(state) {
  var opponent = state.game.player === 0 ? 1 : 0;
  var cards = state.hand.hands[opponent];

  if (cards === null || cards === undefined) {
    return {
      cards: []
    };
  }

  return {
    cards: cards
  };
};

var oppCards = function oppCards(_a) {
  var cards = _a.cards;
  return (0, _preact.h)("div", {
    class: "card-container opp"
  }, cards.map(function (card, i) {
    if (card === null) {
      return (0, _preact.h)("div", {
        key: i,
        class: "game-card"
      });
    }

    return (0, _preact.h)(_fullCard.default, {
      shouldFlip: true,
      card: card
    });
  }));
};

var _default = (0, _util.cleanConnect)(selector, oppCards);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../util":"src/util.ts","../cards/fullCard":"src/components/cards/fullCard.tsx"}],"src/components/game/gameScreen.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _board = _interopRequireDefault(require("./board"));

var _hand = _interopRequireDefault(require("./hand"));

var _predictChoices = _interopRequireDefault(require("./predictChoices"));

var _playerStates = _interopRequireDefault(require("./stateMachine/playerStates"));

var _predictions = _interopRequireDefault(require("./predictions"));

var _pickOne = _interopRequireDefault(require("./pickOne"));

var _forceful = _interopRequireDefault(require("./forceful"));

var _events = _interopRequireDefault(require("./events"));

var _oppHand = _interopRequireDefault(require("./oppHand"));

var _statesPieces = require("./stateMachine/statesPieces");

var _interface = require("../../gameDisplay/interface");

var _util = require("../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var selector = function selector(state) {
  var game = state.game,
      hand = state.hand,
      gameDisplay = state.gameDisplay;
  var opponent = game.player === 0 ? 1 : 0;
  return {
    game: game,
    opponent: opponent,
    hand: hand,
    screen: gameDisplay.screen,
    shouldDisplayEvents: state.events.isDisplaying
  };
};

var game = function game(_a) {
  var game = _a.game,
      screen = _a.screen,
      opponent = _a.opponent,
      shouldDisplayEvents = _a.shouldDisplayEvents;
  var currentPlayer = game.currentPlayer,
      queue = game.queue,
      player = game.player,
      hasGameState = game.hasGameState;

  if (!hasGameState) {
    return null;
  }

  return (0, _preact.h)("div", {
    class: "game"
  }, (0, _preact.h)("div", {
    class: "opponent-section"
  }, (0, _preact.h)(_playerStates.default, __assign({}, game, {
    identity: opponent
  })), (0, _preact.h)(_oppHand.default, null)), shouldDisplayEvents && (0, _preact.h)(_events.default, null), (0, _preact.h)("div", {
    class: "board-section"
  }, (0, _preact.h)(_predictions.default, __assign({}, game)), (0, _preact.h)(_board.default, {
    player: player,
    currentPlayer: currentPlayer,
    queue: queue
  }), (0, _preact.h)(_statesPieces.Distance, __assign({}, game))), (0, _preact.h)("div", {
    className: "player-section"
  }, (0, _preact.h)("div", {
    class: "card-container-parent"
  }, (0, _preact.h)(PlayerHand, {
    screen: screen
  })), (0, _preact.h)(_playerStates.default, __assign({}, game, {
    identity: player
  }))));
};

var PlayerHand = function PlayerHand(_a) {
  var screen = _a.screen;
  return (0, _preact.h)("div", null, screen === _interface.GameDisplayEnum.NORMAL && (0, _preact.h)(_hand.default, null), screen === _interface.GameDisplayEnum.PREDICT && (0, _preact.h)(_predictChoices.default, null), screen === _interface.GameDisplayEnum.PICK_ONE && (0, _preact.h)(_pickOne.default, null), screen === _interface.GameDisplayEnum.FORCEFUL && (0, _preact.h)(_forceful.default, null));
};

var _default = (0, _util.cleanConnect)(selector, game);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./board":"src/components/game/board.tsx","./hand":"src/components/game/hand.tsx","./predictChoices":"src/components/game/predictChoices.tsx","./stateMachine/playerStates":"src/components/game/stateMachine/playerStates.tsx","./predictions":"src/components/game/predictions.tsx","./pickOne":"src/components/game/pickOne.tsx","./forceful":"src/components/game/forceful.tsx","./events":"src/components/game/events.tsx","./oppHand":"src/components/game/oppHand.tsx","./stateMachine/statesPieces":"src/components/game/stateMachine/statesPieces.tsx","../../gameDisplay/interface":"src/gameDisplay/interface.ts","../../util":"src/util.ts"}],"src/components/lobby/pickDeck.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../lobby/dispatch");

var _util = require("../../util");

var selector = function selector(state) {
  console.log(state);
  return {
    decks: state.lobby.deckChoices
  };
};

var PickDeck = function PickDeck(_a) {
  var decks = _a.decks;

  if (decks) {
    return (0, _preact.h)("div", {
      class: 'container mt-3'
    }, (0, _preact.h)("h1", {
      class: 'mb-3 mt-3'
    }, "Choose Deck"), decks.map(function (deck, i) {
      return (0, _preact.h)("div", {
        class: "mb-3 ml-2 deck-choice",
        onClick: function onClick() {
          return (0, _dispatch.dispatchPickedDeck)(i);
        }
      }, (0, _preact.h)("h3", null, deck.name), (0, _preact.h)("div", {
        class: 'ml-2'
      }, deck.description));
    }));
  }

  return (0, _preact.h)("div", null, (0, _preact.h)("h2", null, "Waiting For Opponent To Pick Deck"));
};

var _default = (0, _util.cleanConnect)(selector, PickDeck);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../lobby/dispatch":"src/lobby/dispatch.ts","../../util":"src/util.ts"}],"src/components/lobby/loading.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _default = function _default() {
  return (0, _preact.h)("h1", null, "Connnecting");
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs"}],"src/components/lobby/searching.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _default = function _default() {
  return (0, _preact.h)("h1", null, "Looking for Opponent...");
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs"}],"src/socket/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchDisconnectSocket = exports.dispatchConnectSocket = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var _socket = require("./socket");

var dispatchConnectSocket = function dispatchConnectSocket() {
  var socket = (0, _socket.connectSocket)();
  var action = {
    type: _actions.SocketActionEnum.CONNECT,
    socket: socket
  };

  _store.store.dispatch(action);
};

exports.dispatchConnectSocket = dispatchConnectSocket;

var dispatchDisconnectSocket = function dispatchDisconnectSocket() {
  var action = {
    type: _actions.SocketActionEnum.DISCONNECT
  };
  (0, _socket.disconnectSocket)();

  _store.store.dispatch(action);
};

exports.dispatchDisconnectSocket = dispatchDisconnectSocket;
},{"./actions":"src/socket/actions.ts","../state/store":"src/state/store.ts","./socket":"src/socket/socket.ts"}],"src/components/game.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _gameScreen = _interopRequireDefault(require("./game/gameScreen"));

var _pickDeck = _interopRequireDefault(require("./lobby/pickDeck"));

var _loading = _interopRequireDefault(require("./lobby/loading"));

var _searching = _interopRequireDefault(require("./lobby/searching"));

var _interface = require("../display/interface");

var _dispatch = require("../socket/dispatch");

var _preactRedux = require("preact-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var selector = function selector(state) {
  return {
    screen: state.display.screen
  };
};

var GameViewer =
/** @class */
function (_super) {
  __extends(GameViewer, _super);

  function GameViewer(props) {
    return _super.call(this, props) || this;
  }

  GameViewer.prototype.componentDidMount = function () {
    (0, _dispatch.dispatchConnectSocket)();
  };

  GameViewer.prototype.componentWillUnmount = function () {
    (0, _dispatch.dispatchDisconnectSocket)();
  };

  GameViewer.prototype.render = function () {
    var screen = this.props.screen;

    switch (screen) {
      case _interface.ScreenEnum.CONNECTING:
        return (0, _preact.h)(_loading.default, null);

      case _interface.ScreenEnum.LOOKING_FOR_GAME:
        return (0, _preact.h)(_searching.default, null);

      case _interface.ScreenEnum.CHOOSE_DECK:
        return (0, _preact.h)(_pickDeck.default, null);

      default:
        return (0, _preact.h)(_gameScreen.default, null);
    }
  };

  return GameViewer;
}(_preact.Component);

var _default = (0, _preactRedux.connect)(selector)(GameViewer);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./game/gameScreen":"src/components/game/gameScreen.tsx","./lobby/pickDeck":"src/components/lobby/pickDeck.tsx","./lobby/loading":"src/components/lobby/loading.tsx","./lobby/searching":"src/components/lobby/searching.tsx","../display/interface":"src/display/interface.ts","../socket/dispatch":"src/socket/dispatch.ts","preact-redux":"node_modules/preact-redux/dist/preact-redux.esm.js"}],"src/deckViewer/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchGetDeckList = exports.dispatchGetDeckWithName = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var _util = require("../util");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var dispatchGetDeckWithName = function dispatchGetDeckWithName(deckName) {
  return __awaiter(void 0, void 0, void 0, function () {
    var deck, action, action;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , getDeckWithName(deckName)];

        case 1:
          deck = _a.sent();

          if (deck) {
            action = {
              type: _actions.DeckViewerEnum.GOT_DECK,
              deck: deck
            };

            _store.store.dispatch(action);
          } else {
            action = {
              type: _actions.DeckViewerEnum.FAILED_TO_GET_DECK
            };

            _store.store.dispatch(action);
          }

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchGetDeckWithName = dispatchGetDeckWithName;

var getDeckWithName = function getDeckWithName(deckName) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, deck, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4,, 5]);

          _store.store.dispatch({
            type: _actions.DeckViewerEnum.LOADING_DECK
          });

          return [4
          /*yield*/
          , fetch(_util.HOST_URL + "/deck/" + deckName)];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          deck = _a.sent();
          console.log("deck", deck);
          return [2
          /*return*/
          , deck];

        case 3:
          return [2
          /*return*/
          , null];

        case 4:
          err_1 = _a.sent();
          return [2
          /*return*/
          , null];

        case 5:
          return [2
          /*return*/
          ];
      }
    });
  });
};

var dispatchGetDeckList = function dispatchGetDeckList() {
  return __awaiter(void 0, void 0, void 0, function () {
    var deckList, action;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , getDeckList()];

        case 1:
          deckList = _a.sent();

          if (deckList) {
            action = {
              type: _actions.DeckViewerEnum.GOT_DECK_LIST,
              deckList: deckList
            };

            _store.store.dispatch(action);
          }

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchGetDeckList = dispatchGetDeckList;

var getDeckList = function getDeckList() {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, deckList, err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4,, 5]);

          _store.store.dispatch({
            type: _actions.DeckViewerEnum.LOADING_DECK_LIST
          });

          return [4
          /*yield*/
          , fetch(_util.HOST_URL + "/deckList")];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          deckList = _a.sent();
          return [2
          /*return*/
          , deckList];

        case 3:
          return [2
          /*return*/
          , null];

        case 4:
          err_2 = _a.sent();
          return [2
          /*return*/
          , null];

        case 5:
          return [2
          /*return*/
          ];
      }
    });
  });
};
},{"./actions":"src/deckViewer/actions.ts","../state/store":"src/state/store.ts","../util":"src/util.ts"}],"src/filters/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchRemoveFilter = exports.dispatchAddFilter = exports.dispatchUpdateFilter = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var dispatchUpdateFilter = function dispatchUpdateFilter(filter, index) {
  var action = {
    type: _actions.FilterEnum.UPDATED_FILTER,
    filter: filter,
    index: index
  };

  _store.store.dispatch(action);
};

exports.dispatchUpdateFilter = dispatchUpdateFilter;

var dispatchAddFilter = function dispatchAddFilter() {
  var action = {
    type: _actions.FilterEnum.ADDED_FILTER
  };

  _store.store.dispatch(action);
};

exports.dispatchAddFilter = dispatchAddFilter;

var dispatchRemoveFilter = function dispatchRemoveFilter(index) {
  var action = {
    type: _actions.FilterEnum.REMOVED_FILTER,
    index: index
  };

  _store.store.dispatch(action);
};

exports.dispatchRemoveFilter = dispatchRemoveFilter;
},{"./actions":"src/filters/actions.ts","../state/store":"src/state/store.ts"}],"src/components/filter.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../filters/dispatch");

var _card = require("../shared/card");

var _util = require("../util");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var selector = function selector(state) {
  return {
    filters: state.filter.filters
  };
};

var Filter = function Filter(_a) {
  var filters = _a.filters;
  return (0, _preact.h)("div", {
    class: "filter-section section"
  }, (0, _preact.h)("div", {
    class: "title"
  }, (0, _preact.h)("h3", null, "Filters:  "), (0, _preact.h)("button", {
    class: "btn remove justify-end"
  }, "Clear Filters")), (0, _preact.h)("div", {
    class: "filters"
  }, (0, _preact.h)("button", {
    class: 'btn add',
    onClick: _dispatch.dispatchAddFilter
  }, "Add Filter"), filters.map(function (filter, i) {
    return (0, _preact.h)("div", {
      class: "filter"
    }, (0, _preact.h)("select", {
      onChange: function onChange(e) {
        return handlePlayerChange(e, filter, i);
      },
      value: filter.player
    }, (0, _preact.h)("option", {
      value: _card.PlayerEnum.OPPONENT
    }, " \u2191 "), (0, _preact.h)("option", {
      value: _card.PlayerEnum.PLAYER
    }, " \u2193 "), (0, _preact.h)("option", {
      value: _card.PlayerEnum.BOTH
    }, " \u2195 ")), (0, _preact.h)("select", {
      onChange: function onChange(e) {
        return handleAxisChange(e, filter, i);
      },
      value: filter.axis
    }, Object.keys(_card.AxisEnum).map(function (key) {
      return (0, _preact.h)("option", {
        value: _card.AxisEnum[key],
        key: key
      }, " ", _card.AxisEnum[key]);
    })), (0, _preact.h)("button", {
      class: 'btn remove',
      onClick: function onClick() {
        return (0, _dispatch.dispatchRemoveFilter)(i);
      }
    }, "-"));
  })));
};

var handleAxisChange = function handleAxisChange(e, filter, index) {
  var target = e.currentTarget;
  (0, _dispatch.dispatchUpdateFilter)(__assign(__assign({}, filter), {
    axis: target.value
  }), index);
};

var handlePlayerChange = function handlePlayerChange(e, filter, index) {
  var target = e.currentTarget;
  var player = Number(target.value);
  (0, _dispatch.dispatchUpdateFilter)(__assign(__assign({}, filter), {
    player: player
  }), index);
};

var _default = (0, _util.cleanConnect)(selector, Filter);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../filters/dispatch":"src/filters/dispatch.ts","../shared/card":"src/shared/card.ts","../util":"src/util.ts"}],"src/filters/util.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterInvalidCards = void 0;

var _card = require("../shared/card");

var _a;

var filterInvalidCards = function filterInvalidCards(cards, filters) {
  if (cards === void 0) {
    cards = [];
  }

  var validStates = createValidStates(filters);
  return cards.filter(function (card) {
    return isCardValid(card, validStates);
  });
};

exports.filterInvalidCards = filterInvalidCards;

var isCardValid = function isCardValid(card, invalidStates) {
  return card.requirements.every(function (req) {
    return getWhoToModify(req).every(function (player) {
      if (card.name === "Groin Stomp") console.log(player, req, invalidStates[player][req.axis]);
      return !invalidStates[player][req.axis];
    });
  });
};

var createValidStates = function createValidStates(filters) {
  var statesArr = [{}, {}];
  filters.forEach(function (filter) {
    getWhoToModify(filter).forEach(function (player) {
      updateFilterPiece(statesArr[player], filter);
    });
  });
  return statesArr;
};

var updateFilterPiece = function updateFilterPiece(state, filter) {
  var func = stateRouter[filter.axis];

  if (func) {
    func(state);
  } else {
    console.log("no filter for ", filter.axis);
  }
};

var stateRouter = (_a = {}, _a[_card.AxisEnum.ANTICIPATING] = function (state) {
  state[_card.AxisEnum.UNBALANCED] = true;
  state[_card.AxisEnum.BALANCED] = true;
}, _a[_card.AxisEnum.UNBALANCED] = function (state) {
  state[_card.AxisEnum.ANTICIPATING] = true;
  state[_card.AxisEnum.BALANCED] = true;
}, _a[_card.AxisEnum.BALANCED] = function (state) {
  return state[_card.AxisEnum.UNBALANCED] = true;
}, _a[_card.AxisEnum.NOT_ANTICIPATING] = function (state) {
  return state[_card.AxisEnum.ANTICIPATING] = true;
}, _a[_card.AxisEnum.GRAPPLED] = function (state) {
  state[_card.AxisEnum.CLOSE] = true;
  state[_card.AxisEnum.FAR] = true;
  state[_card.AxisEnum.NOT_GRAPPLED] = true;
}, _a[_card.AxisEnum.CLOSE] = function (state) {
  state[_card.AxisEnum.GRAPPLED] = true;
  state[_card.AxisEnum.FAR] = true;
  state[_card.AxisEnum.NOT_CLOSE] = true;
}, _a[_card.AxisEnum.FAR] = function (state) {
  state[_card.AxisEnum.CLOSE] = true;
  state[_card.AxisEnum.GRAPPLED] = true;
  state[_card.AxisEnum.NOT_FAR] = true;
}, _a[_card.AxisEnum.NOT_FAR] = function (state) {
  return state[_card.AxisEnum.FAR] = true;
}, _a[_card.AxisEnum.NOT_CLOSE] = function (state) {
  return state[_card.AxisEnum.CLOSE] = true;
}, _a[_card.AxisEnum.NOT_GRAPPLED] = function (state) {
  return state[_card.AxisEnum.GRAPPLED] = true;
}, _a[_card.AxisEnum.STANDING] = function (state) {
  return state[_card.AxisEnum.PRONE] = true;
}, _a[_card.AxisEnum.PRONE] = function (state) {
  return state[_card.AxisEnum.STANDING] = true;
}, _a[_card.AxisEnum.STILL] = function (state) {
  return state[_card.AxisEnum.MOVING] = true;
}, _a[_card.AxisEnum.MOVING] = function (state) {
  return state[_card.AxisEnum.STILL] = true;
}, _a);

var getWhoToModify = function getWhoToModify(filter) {
  switch (filter.player) {
    case _card.PlayerEnum.PLAYER:
      return [0];

    case _card.PlayerEnum.OPPONENT:
      return [1];

    default:
      return [0, 1];
  }
};
},{"../shared/card":"src/shared/card.ts"}],"src/components/deckViewer/cards.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _handCard = _interopRequireDefault(require("../game/card/handCard"));

var _filter = _interopRequireDefault(require("../filter"));

var _util = require("../../filters/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var _default = function _default(_a) {
  var isLoading = _a.isLoading,
      _b = _a.cards,
      cards = _b === void 0 ? [] : _b,
      description = _a.description,
      name = _a.name,
      back = _a.back,
      filters = _a.filters;

  if (isLoading) {
    return (0, _preact.h)("h3", null, "Loading...");
  }

  return (0, _preact.h)("div", {
    class: "card-list"
  }, (0, _preact.h)("h3", null, name), (0, _preact.h)("div", {
    class: 'description'
  }, description), (0, _preact.h)(_filter.default, null), (0, _preact.h)("div", {
    class: 'cards'
  }, (0, _util.filterInvalidCards)(cards, filters).map(function (card, i) {
    return (0, _preact.h)("div", {
      key: card.name + i
    }, (0, _preact.h)(_handCard.default, __assign({}, card)));
  })), (0, _preact.h)("button", {
    onClick: back,
    class: 'btn btn-primary mt-3 mb-3'
  }, "Back To Decks"));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../game/card/handCard":"src/components/game/card/handCard.tsx","../filter":"src/components/filter.tsx","../../filters/util":"src/filters/util.ts"}],"src/path/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchToPathArray = exports.dispatchToPathString = exports.dispatchAppendPath = exports.dispatchPopPath = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var dispatchPopPath = function dispatchPopPath() {
  var action = {
    type: _actions.PathActionEnum.POP_PATH
  };

  _store.store.dispatch(action);
};

exports.dispatchPopPath = dispatchPopPath;

var dispatchAppendPath = function dispatchAppendPath(toAppend) {
  var action = {
    type: _actions.PathActionEnum.APPEND_TO_PATH,
    toAppend: toAppend
  };

  _store.store.dispatch(action);
};

exports.dispatchAppendPath = dispatchAppendPath;

var dispatchToPathString = function dispatchToPathString(path) {
  var action = {
    type: _actions.PathActionEnum.TO_PATH_STRING,
    path: path
  };

  _store.store.dispatch(action);
};

exports.dispatchToPathString = dispatchToPathString;

var dispatchToPathArray = function dispatchToPathArray(path) {
  var action = {
    type: _actions.PathActionEnum.TO_PATH_ARRAY,
    path: path
  };

  _store.store.dispatch(action);
};
/*

         Store
        {State}
        /     \
   Dispatch  Get State (returns state)
      |
  Reducers(action)


 */


exports.dispatchToPathArray = dispatchToPathArray;

window.onpopstate = function (ev) {
  console.log("popping state");
  dispatchToPathString(location.pathname);
};
},{"./actions":"src/path/actions.ts","../state/store":"src/state/store.ts"}],"src/components/deckViewer/deckItem.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _default = function _default(_a) {
  var deck = _a.deck,
      action = _a.action;
  var name = deck.name,
      description = deck.description,
      id = deck.id;
  return (0, _preact.h)("div", {
    class: "ml-2 deck-choice",
    onClick: function onClick() {
      return action(deck);
    }
  }, (0, _preact.h)("h3", {
    class: "name"
  }, name), (0, _preact.h)("div", {
    class: "ml-2"
  }, description));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs"}],"src/components/deckViewer/deckList.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _deckItem = _interopRequireDefault(require("./deckItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_a) {
  var _b = _a.decks,
      decks = _b === void 0 ? [] : _b,
      isLoading = _a.isLoading,
      chooseDeck = _a.chooseDeck;

  if (isLoading) {
    return (0, _preact.h)("div", null, "Loading Deck list...");
  }

  return (0, _preact.h)("div", {
    class: 'container mt-3'
  }, (0, _preact.h)("h1", {
    class: 'mb-3 mt-3'
  }, "Choose Deck"), decks.map(function (deck, i) {
    return (0, _preact.h)("div", {
      class: "deck-item"
    }, (0, _preact.h)(_deckItem.default, {
      deck: deck,
      action: function action(chosenDeck) {
        return chooseDeck(chosenDeck.name);
      }
    }), " ");
  }));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./deckItem":"src/components/deckViewer/deckItem.tsx"}],"src/components/deckViewer.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../deckViewer/dispatch");

var _cards = _interopRequireDefault(require("./deckViewer/cards"));

var _dispatch2 = require("../path/dispatch");

var _preactRedux = require("preact-redux");

var _deckList = _interopRequireDefault(require("./deckViewer/deckList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var selector = function selector(state) {
  return {
    isLoadingDeck: state.deckViewer.isLoadingDeck,
    isLoadingDeckList: state.deckViewer.isLoadingDeckList,
    deckList: state.deckViewer.deckList,
    deck: state.deckViewer.deck,
    filters: state.filter.filters
  };
};

var DeckViewer =
/** @class */
function (_super) {
  __extends(DeckViewer, _super);

  function DeckViewer() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.componentDidMount = function () {
      (0, _dispatch.dispatchGetDeckList)();

      if (_this.props.path.length > 0) {
        var deckName = _this.props.path[1];

        if (deckName) {
          (0, _dispatch.dispatchGetDeckWithName)(deckName);
        }
      }
    };

    _this.render = function () {
      var _a = _this.props,
          path = _a.path,
          pathPrepend = _a.pathPrepend,
          deck = _a.deck,
          deckList = _a.deckList,
          isLoadingDeck = _a.isLoadingDeck,
          isLoadingDeckList = _a.isLoadingDeckList,
          filters = _a.filters;
      var viewingDeck = path.length > 0;

      if (viewingDeck) {
        return (0, _preact.h)(_cards.default, __assign({
          filters: filters,
          isLoading: isLoadingDeck
        }, deck, {
          back: function back() {
            return (0, _dispatch2.dispatchToPathArray)(pathPrepend);
          }
        }));
      } else {
        return (0, _preact.h)(_deckList.default, {
          decks: deckList,
          isLoading: isLoadingDeckList,
          chooseDeck: _this.chooseDeck
        });
      }
    };

    _this.chooseDeck = function (name) {
      (0, _dispatch2.dispatchToPathArray)(__spreadArrays(_this.props.pathPrepend, ["deck", name]));
      (0, _dispatch.dispatchGetDeckWithName)(name);
    };

    return _this;
  }

  return DeckViewer;
}(_preact.Component);

var _default = (0, _preactRedux.connect)(selector)(DeckViewer);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../deckViewer/dispatch":"src/deckViewer/dispatch.ts","./deckViewer/cards":"src/components/deckViewer/cards.tsx","../path/dispatch":"src/path/dispatch.ts","preact-redux":"node_modules/preact-redux/dist/preact-redux.esm.js","./deckViewer/deckList":"src/components/deckViewer/deckList.tsx"}],"src/fightingStyles/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFightingStyles = exports.dispatchGetFightingStyleByName = exports.dispatchFromStyleToDeckEdit = exports.dispatchViewStyleFromDeck = void 0;

var _store = require("../state/store");

var _actions = require("./actions");

var _util = require("../util");

var _dispatch = require("../path/dispatch");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var dispatchViewStyleFromDeck = function dispatchViewStyleFromDeck(styleName) {
  (0, _dispatch.dispatchToPathArray)(['styles', styleName]);
  viewingFromDeckEdit(true);
};

exports.dispatchViewStyleFromDeck = dispatchViewStyleFromDeck;

var dispatchFromStyleToDeckEdit = function dispatchFromStyleToDeckEdit() {
  var deckID = _store.store.getState().deckEditor.deck.id;

  (0, _dispatch.dispatchToPathArray)(['builder', deckID.toString()]);
  viewingFromDeckEdit(false);
};

exports.dispatchFromStyleToDeckEdit = dispatchFromStyleToDeckEdit;

var viewingFromDeckEdit = function viewingFromDeckEdit(isEditingDeck) {
  var action = {
    type: _actions.FightingStyleEnum.VIEWING_FROM_DECK_EDIT,
    isEditingDeck: isEditingDeck
  };

  _store.store.dispatch(action);
};

var dispatchGetFightingStyleByName = function dispatchGetFightingStyleByName(styleName) {
  return __awaiter(void 0, void 0, void 0, function () {
    var style, action;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , getFightingStyle(styleName)];

        case 1:
          style = _a.sent();
          action = {
            type: _actions.FightingStyleEnum.GOT_STYLE,
            style: style
          };

          _store.store.dispatch(action);

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchGetFightingStyleByName = dispatchGetFightingStyleByName;

var getFightingStyle = function getFightingStyle(styleName) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, style;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _store.store.dispatch({
            type: _actions.FightingStyleEnum.LOADING_STYLE
          });

          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/styles/' + styleName)];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          style = _a.sent();
          return [2
          /*return*/
          , style];

        case 3:
          return [2
          /*return*/
          , null];
      }
    });
  });
};

var getFightingStyles = function getFightingStyles() {
  return __awaiter(void 0, void 0, void 0, function () {
    var currentStyles, styleDescriptions, action;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          currentStyles = _store.store.getState().fightingStyle.styleDescriptions;

          if (currentStyles && currentStyles.length > 0) {
            return [2
            /*return*/
            ];
          }

          _store.store.dispatch({
            type: _actions.FightingStyleEnum.LOADING_STYLE_NAMES
          });

          return [4
          /*yield*/
          , getFightingStyleDescriptions()];

        case 1:
          styleDescriptions = _a.sent();
          action = {
            type: _actions.FightingStyleEnum.GOT_STYLE_NAMES,
            styleDescriptions: styleDescriptions
          };

          _store.store.dispatch(action);

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.getFightingStyles = getFightingStyles;

var getFightingStyleDescriptions = function getFightingStyleDescriptions() {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, styles;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/styles')];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          styles = _a.sent();
          return [2
          /*return*/
          , styles];

        case 3:
          return [2
          /*return*/
          , null];
      }
    });
  });
};
},{"../state/store":"src/state/store.ts","./actions":"src/fightingStyles/actions.ts","../util":"src/util.ts","../path/dispatch":"src/path/dispatch.ts"}],"src/components/styleViewer/revert.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../fightingStyles/dispatch");

var _default = function _default() {
  return (0, _preact.h)("div", {
    class: "revert"
  }, (0, _preact.h)("button", {
    class: "btn",
    onClick: _dispatch.dispatchFromStyleToDeckEdit
  }, "Return To Deck"));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../fightingStyles/dispatch":"src/fightingStyles/dispatch.ts"}],"src/components/styleViewer/style.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _fullCard = _interopRequireDefault(require("../cards/fullCard"));

var _revert = _interopRequireDefault(require("./revert"));

var _dispatch = require("../../path/dispatch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_a) {
  var isLoading = _a.isLoading,
      _b = _a.cards,
      cards = _b === void 0 ? [] : _b,
      isEditingDeck = _a.isEditingDeck,
      description = _a.description,
      identity = _a.identity,
      strengths = _a.strengths,
      name = _a.name;

  if (isLoading) {
    return (0, _preact.h)("h3", null, "Loading...");
  }

  return (0, _preact.h)("div", {
    class: "style-viewer cards-section pad-bottom"
  }, (0, _preact.h)("h3", null, name), (0, _preact.h)("div", {
    class: 'description'
  }, description), (0, _preact.h)("div", {
    class: 'identity'
  }, identity), (0, _preact.h)("div", {
    class: 'strengths'
  }, strengths), (0, _preact.h)("div", {
    class: 'cards'
  }, cards.map(function (card, i) {
    if (card === null) {
      return (0, _preact.h)("div", null, " Null Card");
    }

    return (0, _preact.h)("div", {
      key: card.name + i
    }, (0, _preact.h)(_fullCard.default, {
      card: card
    }));
  })), !isEditingDeck && (0, _preact.h)("button", {
    onClick: _dispatch.dispatchPopPath,
    class: 'btn back-btn'
  }, "Back To Decks"), isEditingDeck && (0, _preact.h)(_revert.default, null));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../cards/fullCard":"src/components/cards/fullCard.tsx","./revert":"src/components/styleViewer/revert.tsx","../../path/dispatch":"src/path/dispatch.ts"}],"src/components/styleViewer/styleNames.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var description = (0, _preact.h)("div", null, (0, _preact.h)("p", null, "Decks are built out of these styles, three per deck."), (0, _preact.h)("p", null, "Once you've chosen the styles for a deck, you choose which cards make the cut."), (0, _preact.h)("p", null, "One card can make a huge difference!"));

var _default = function _default(_a) {
  var _b = _a.styles,
      styles = _b === void 0 ? [] : _b,
      isLoading = _a.isLoading,
      chooseStyle = _a.chooseStyle;

  if (isLoading) {
    return (0, _preact.h)("div", null, description, "Loading Deck list...");
  }

  return (0, _preact.h)("div", {
    class: 'container mt-3'
  }, (0, _preact.h)("h1", {
    class: 'mb-3 mt-3'
  }, "Styles"), description, styles.map(function (style, i) {
    return (0, _preact.h)("div", {
      key: style.name,
      class: "mb-3 ml-2 deck-choice",
      onClick: function onClick() {
        return chooseStyle(style.name);
      }
    }, (0, _preact.h)("h3", null, style.name), (0, _preact.h)("div", {
      class: 'ml-2'
    }, style.description));
  }));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs"}],"src/components/styleViewer.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../path/dispatch");

var _preactRedux = require("preact-redux");

var _dispatch2 = require("../fightingStyles/dispatch");

var _style = _interopRequireDefault(require("./styleViewer/style"));

var _styleNames = _interopRequireDefault(require("./styleViewer/styleNames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var selector = function selector(state) {
  return {
    isEditingDeck: state.fightingStyle.isEditingDeck,
    isLoadingStyle: state.fightingStyle.loadingStyle,
    isLoadingStyles: state.fightingStyle.loadingStyleNames,
    styleDescriptions: state.fightingStyle.styleDescriptions,
    style: state.fightingStyle.style
  };
};

var StyleViewer =
/** @class */
function (_super) {
  __extends(StyleViewer, _super);

  function StyleViewer() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.componentDidMount = function () {
      (0, _dispatch2.getFightingStyles)();

      if (_this.props.path.length > 0) {
        var styleName = _this.props.path[0];

        if (styleName) {
          (0, _dispatch2.dispatchGetFightingStyleByName)(styleName);
        }
      }
    };

    _this.render = function () {
      var _a = _this.props,
          path = _a.path,
          style = _a.style,
          isEditingDeck = _a.isEditingDeck,
          styleDescriptions = _a.styleDescriptions,
          isLoadingStyle = _a.isLoadingStyle,
          isLoadingStyles = _a.isLoadingStyles;
      var viewingDeck = path.length > 0;

      if (viewingDeck) {
        return (0, _preact.h)(_style.default, __assign({
          isEditingDeck: isEditingDeck,
          isLoading: isLoadingStyle
        }, style));
      } else {
        return (0, _preact.h)(_styleNames.default, {
          styles: styleDescriptions,
          isLoading: isLoadingStyles,
          chooseStyle: _this.chooseStyle
        });
      }
    };

    _this.chooseStyle = function (name) {
      (0, _dispatch.dispatchAppendPath)(name);
      (0, _dispatch2.dispatchGetFightingStyleByName)(name);
    };

    return _this;
  }

  return StyleViewer;
}(_preact.Component);

var _default = (0, _preactRedux.connect)(selector)(StyleViewer);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../path/dispatch":"src/path/dispatch.ts","preact-redux":"node_modules/preact-redux/dist/preact-redux.esm.js","../fightingStyles/dispatch":"src/fightingStyles/dispatch.ts","./styleViewer/style":"src/components/styleViewer/style.tsx","./styleViewer/styleNames":"src/components/styleViewer/styleNames.tsx"}],"src/listeners/index.ts":[function(require,module,exports) {
"use strict";

var _dispatch = require("../gameDisplay/dispatch");

var tabDown = function tabDown(ev) {
  if (ev.keyCode === 192) {
    (0, _dispatch.dispatchSetHandCardDisplay)(true);
  }
};

var tabUp = function tabUp(ev) {
  if (ev.keyCode === 192) {
    (0, _dispatch.dispatchSetHandCardDisplay)(false);
  }
};

document.addEventListener("keydown", tabDown);
document.addEventListener("keyup", tabUp);
},{"../gameDisplay/dispatch":"src/gameDisplay/dispatch.ts"}],"src/components/landing.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../path/dispatch");

var _default = function _default() {
  return (0, _preact.h)("div", {
    class: 'landing'
  }, (0, _preact.h)("h2", null, "Fighting Card Game ", (0, _preact.h)("small", null, "Without a name")), (0, _preact.h)("div", {
    class: 'section'
  }, (0, _preact.h)("div", null, (0, _preact.h)("a", {
    class: 'link',
    onClick: function onClick() {
      return (0, _dispatch.dispatchToPathString)('/game');
    }
  }, "Play Game")), (0, _preact.h)("div", null, (0, _preact.h)("a", {
    class: 'link',
    onClick: function onClick() {
      return (0, _dispatch.dispatchToPathString)('/decks');
    }
  }, "Starter Decks")), (0, _preact.h)("div", null, (0, _preact.h)("a", {
    class: 'link',
    onClick: function onClick() {
      return (0, _dispatch.dispatchToPathString)('/styles');
    }
  }, "Fighting Styles")), (0, _preact.h)("div", null, (0, _preact.h)("a", {
    class: "link",
    onClick: function onClick() {
      return (0, _dispatch.dispatchToPathString)('/builder');
    }
  }, "Deck Builder"))));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../path/dispatch":"src/path/dispatch.ts"}],"src/user/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchUserLogout = exports.dispatchUserLogin = exports.createUserWithEmail = exports.loginWithEmail = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var _util = require("../util");

var _dispatch = require("../path/dispatch");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var loginWithEmail = function loginWithEmail(email, password) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, token, baseToken, stringified, username, errorMessage;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/users/login', {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password
            }),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.text()];

        case 2:
          token = _a.sent();
          baseToken = token.split('.')[0];
          stringified = atob(baseToken);
          console.log(stringified);
          username = JSON.parse(stringified).username;
          dispatchUserLogin(username, token);
          (0, _dispatch.dispatchToPathArray)([]);
          return [3
          /*break*/
          , 5];

        case 3:
          return [4
          /*yield*/
          , fetched.text()];

        case 4:
          errorMessage = _a.sent();
          return [2
          /*return*/
          , errorMessage];

        case 5:
          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.loginWithEmail = loginWithEmail;

var createUserWithEmail = function createUserWithEmail(email, password) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, token, baseToken, stringified, username, errorMessage;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/users/create', {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: password
            })
          })];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.text()];

        case 2:
          token = _a.sent();
          baseToken = token.split('.')[0];
          stringified = atob(baseToken);
          username = JSON.parse(stringified).username;
          dispatchUserLogin(username, token);
          (0, _dispatch.dispatchToPathArray)([]);
          return [3
          /*break*/
          , 5];

        case 3:
          return [4
          /*yield*/
          , fetched.text()];

        case 4:
          errorMessage = _a.sent();
          return [2
          /*return*/
          , errorMessage];

        case 5:
          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.createUserWithEmail = createUserWithEmail;

var dispatchUserLogin = function dispatchUserLogin(username, token) {
  var action = {
    type: _actions.UserActionEnum.LOGIN,
    username: username,
    token: token
  };

  _store.store.dispatch(action);
};

exports.dispatchUserLogin = dispatchUserLogin;

var dispatchUserLogout = function dispatchUserLogout() {
  var action = {
    type: _actions.UserActionEnum.LOGOUT
  };

  _store.store.dispatch(action);
};

exports.dispatchUserLogout = dispatchUserLogout;
},{"./actions":"src/user/actions.ts","../state/store":"src/state/store.ts","../util":"src/util.ts","../path/dispatch":"src/path/dispatch.ts"}],"src/components/nav.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../path/dispatch");

var _util = require("../util");

var _dispatch2 = require("../user/dispatch");

var selector = function selector(_a) {
  var user = _a.user;
  return {
    isLoggedIn: !!user.username,
    username: user.username
  };
};

var nav = function nav(_a) {
  var isLoggedIn = _a.isLoggedIn,
      username = _a.username;
  return (0, _preact.h)("nav", {
    class: "navbar"
  }, (0, _preact.h)("div", {
    class: "home"
  }, (0, _preact.h)("a", {
    onClick: function onClick() {
      return (0, _dispatch.dispatchToPathArray)([""]);
    }
  }, "Home")), !isLoggedIn && (0, _preact.h)("div", {
    class: "right-side"
  }, (0, _preact.h)("a", {
    class: "mr-4",
    onClick: function onClick() {
      return (0, _dispatch.dispatchToPathArray)(["user", "login"]);
    }
  }, " ", "Login", " "), (0, _preact.h)("a", {
    onClick: function onClick() {
      return (0, _dispatch.dispatchToPathArray)(["user", "create"]);
    }
  }, " Create Account ")), isLoggedIn && (0, _preact.h)("div", {
    class: "right-side"
  }, (0, _preact.h)("div", {
    class: "mr-4"
  }, username), (0, _preact.h)("a", {
    onClick: _dispatch2.dispatchUserLogout
  }, "Logout")));
};

var _default = (0, _util.cleanConnect)(selector, nav);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../path/dispatch":"src/path/dispatch.ts","../util":"src/util.ts","../user/dispatch":"src/user/dispatch.ts"}],"src/components/login/login.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../path/dispatch");

var _dispatch2 = require("../../user/dispatch");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var Login =
/** @class */
function (_super) {
  __extends(Login, _super);

  function Login() {
    var _this = _super.call(this) || this;

    _this.emailChange = function (e) {
      var el = e.target;

      _this.setState({
        email: el.value
      });
    };

    _this.passwordChange = function (e) {
      var el = e.target;

      _this.setState({
        password: el.value
      });
    };

    _this.state = {
      email: '',
      password: '',
      error: ''
    };
    return _this;
  }

  Login.prototype.render = function () {
    var _this = this;

    console.log(this.state);
    return (0, _preact.h)("div", {
      class: "login"
    }, (0, _preact.h)("div", {
      class: "title"
    }, "Login: "), (0, _preact.h)("form", {
      class: "form"
    }, (0, _preact.h)("label", {
      for: "email"
    }, "Email: "), (0, _preact.h)("input", {
      type: "text",
      id: "email",
      placeholder: "you@host.com",
      onChange: this.emailChange,
      value: this.state.email
    }), (0, _preact.h)("label", {
      for: "pass"
    }, "Password: "), (0, _preact.h)("input", {
      type: "password",
      id: "pass",
      onChange: this.passwordChange,
      value: this.state.password
    }), (0, _preact.h)("button", {
      class: "btn btn-primary mt-4",
      onClick: function onClick(e) {
        return __awaiter(_this, void 0, void 0, function () {
          var error;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                e.preventDefault();
                return [4
                /*yield*/
                , (0, _dispatch2.loginWithEmail)(this.state.email, this.state.password)];

              case 1:
                error = _a.sent();

                if (error) {
                  this.setState({
                    error: error
                  });
                }

                return [2
                /*return*/
                ];
            }
          });
        });
      }
    }, "Login"), this.state.error && (0, _preact.h)("div", {
      class: "error"
    }, "Error: ", this.state.error), (0, _preact.h)("div", {
      class: 'mt-2    '
    }, "Don't have an account? Create one instead.", (0, _preact.h)("button", {
      class: "btn btn-sml btn-primary",
      onClick: function onClick() {
        return (0, _dispatch.dispatchToPathString)('/user/create');
      }
    }, "Create Account"))));
  };

  return Login;
}(_preact.Component);

var _default = Login;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../path/dispatch":"src/path/dispatch.ts","../../user/dispatch":"src/user/dispatch.ts"}],"src/components/login/create.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../path/dispatch");

var _dispatch2 = require("../../user/dispatch");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var Login =
/** @class */
function (_super) {
  __extends(Login, _super);

  function Login(props) {
    var _this = _super.call(this, props) || this;

    _this.emailChange = function (e) {
      var el = e.target;

      _this.setState({
        email: el.value
      });
    };

    _this.passwordChange = function (e) {
      var el = e.target;

      _this.setState({
        password: el.value
      });
    };

    _this.state = {
      email: '',
      password: '',
      error: ''
    };
    return _this;
  }

  Login.prototype.render = function () {
    var _this = this;

    return (0, _preact.h)("div", {
      class: "login"
    }, (0, _preact.h)("div", {
      class: "title"
    }, "Create Account: "), (0, _preact.h)("form", {
      class: "form"
    }, (0, _preact.h)("label", {
      for: "email"
    }, "Email: "), (0, _preact.h)("input", {
      type: "text",
      id: "email",
      placeholder: "you@host.com",
      onChange: this.emailChange,
      value: this.state.email
    }), (0, _preact.h)("label", {
      for: "pass"
    }, "Password: "), (0, _preact.h)("input", {
      type: "password",
      id: "pass",
      onChange: this.passwordChange,
      value: this.state.password
    }), (0, _preact.h)("button", {
      class: "btn btn-primary mt-4",
      onClick: function onClick(e) {
        return __awaiter(_this, void 0, void 0, function () {
          var error;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                e.preventDefault();
                return [4
                /*yield*/
                , (0, _dispatch2.createUserWithEmail)(this.state.email, this.state.password)];

              case 1:
                error = _a.sent();

                if (error) {
                  this.setState({
                    error: error
                  });
                }

                return [2
                /*return*/
                ];
            }
          });
        });
      }
    }, "Create Account"), this.state.error && (0, _preact.h)("div", {
      class: "error"
    }, "Error: ", this.state.error), (0, _preact.h)("div", {
      class: 'mt-2'
    }, "Already have an account?", (0, _preact.h)("button", {
      class: "btn btn-sml btn-primary",
      onClick: function onClick() {
        return (0, _dispatch.dispatchToPathString)('/user/login');
      }
    }, " Login "))));
  };

  return Login;
}(_preact.Component);

var _default = Login;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../path/dispatch":"src/path/dispatch.ts","../../user/dispatch":"src/user/dispatch.ts"}],"src/components/login/user.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _login = _interopRequireDefault(require("./login"));

var _create = _interopRequireDefault(require("./create"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_a) {
  var path = _a.path;

  if (path.length === 0) {
    return (0, _preact.h)("h2", null, "Unimplemented Dashboard");
  }

  if (path[0] === 'login') {
    return (0, _preact.h)(_login.default, null);
  }

  if (path[0] === 'create') {
    return (0, _preact.h)(_create.default, null);
  }
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./login":"src/components/login/login.tsx","./create":"src/components/login/create.tsx"}],"node_modules/lodash/_listCacheClear.js":[function(require,module,exports) {
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],"node_modules/lodash/eq.js":[function(require,module,exports) {
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],"node_modules/lodash/_assocIndexOf.js":[function(require,module,exports) {
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":"node_modules/lodash/eq.js"}],"node_modules/lodash/_listCacheDelete.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_listCacheGet.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_listCacheHas.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_listCacheSet.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_ListCache.js":[function(require,module,exports) {
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":"node_modules/lodash/_listCacheClear.js","./_listCacheDelete":"node_modules/lodash/_listCacheDelete.js","./_listCacheGet":"node_modules/lodash/_listCacheGet.js","./_listCacheHas":"node_modules/lodash/_listCacheHas.js","./_listCacheSet":"node_modules/lodash/_listCacheSet.js"}],"node_modules/lodash/_stackClear.js":[function(require,module,exports) {
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":"node_modules/lodash/_ListCache.js"}],"node_modules/lodash/_stackDelete.js":[function(require,module,exports) {
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],"node_modules/lodash/_stackGet.js":[function(require,module,exports) {
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],"node_modules/lodash/_stackHas.js":[function(require,module,exports) {
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],"node_modules/lodash/_freeGlobal.js":[function(require,module,exports) {
var global = arguments[3];
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

},{}],"node_modules/lodash/_root.js":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":"node_modules/lodash/_freeGlobal.js"}],"node_modules/lodash/_Symbol.js":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_getRawTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js"}],"node_modules/lodash/_objectToString.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],"node_modules/lodash/_baseGetTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js","./_getRawTag":"node_modules/lodash/_getRawTag.js","./_objectToString":"node_modules/lodash/_objectToString.js"}],"node_modules/lodash/isObject.js":[function(require,module,exports) {
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],"node_modules/lodash/isFunction.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isObject":"node_modules/lodash/isObject.js"}],"node_modules/lodash/_coreJsData.js":[function(require,module,exports) {
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_isMasked.js":[function(require,module,exports) {
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":"node_modules/lodash/_coreJsData.js"}],"node_modules/lodash/_toSource.js":[function(require,module,exports) {
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],"node_modules/lodash/_baseIsNative.js":[function(require,module,exports) {
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./isFunction":"node_modules/lodash/isFunction.js","./_isMasked":"node_modules/lodash/_isMasked.js","./isObject":"node_modules/lodash/isObject.js","./_toSource":"node_modules/lodash/_toSource.js"}],"node_modules/lodash/_getValue.js":[function(require,module,exports) {
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],"node_modules/lodash/_getNative.js":[function(require,module,exports) {
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":"node_modules/lodash/_baseIsNative.js","./_getValue":"node_modules/lodash/_getValue.js"}],"node_modules/lodash/_Map.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_nativeCreate.js":[function(require,module,exports) {
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":"node_modules/lodash/_getNative.js"}],"node_modules/lodash/_hashClear.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_hashDelete.js":[function(require,module,exports) {
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],"node_modules/lodash/_hashGet.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_hashHas.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_hashSet.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_Hash.js":[function(require,module,exports) {
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":"node_modules/lodash/_hashClear.js","./_hashDelete":"node_modules/lodash/_hashDelete.js","./_hashGet":"node_modules/lodash/_hashGet.js","./_hashHas":"node_modules/lodash/_hashHas.js","./_hashSet":"node_modules/lodash/_hashSet.js"}],"node_modules/lodash/_mapCacheClear.js":[function(require,module,exports) {
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":"node_modules/lodash/_Hash.js","./_ListCache":"node_modules/lodash/_ListCache.js","./_Map":"node_modules/lodash/_Map.js"}],"node_modules/lodash/_isKeyable.js":[function(require,module,exports) {
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],"node_modules/lodash/_getMapData.js":[function(require,module,exports) {
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":"node_modules/lodash/_isKeyable.js"}],"node_modules/lodash/_mapCacheDelete.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_mapCacheGet.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_mapCacheHas.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_mapCacheSet.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_MapCache.js":[function(require,module,exports) {
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":"node_modules/lodash/_mapCacheClear.js","./_mapCacheDelete":"node_modules/lodash/_mapCacheDelete.js","./_mapCacheGet":"node_modules/lodash/_mapCacheGet.js","./_mapCacheHas":"node_modules/lodash/_mapCacheHas.js","./_mapCacheSet":"node_modules/lodash/_mapCacheSet.js"}],"node_modules/lodash/_stackSet.js":[function(require,module,exports) {
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":"node_modules/lodash/_ListCache.js","./_Map":"node_modules/lodash/_Map.js","./_MapCache":"node_modules/lodash/_MapCache.js"}],"node_modules/lodash/_Stack.js":[function(require,module,exports) {
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":"node_modules/lodash/_ListCache.js","./_stackClear":"node_modules/lodash/_stackClear.js","./_stackDelete":"node_modules/lodash/_stackDelete.js","./_stackGet":"node_modules/lodash/_stackGet.js","./_stackHas":"node_modules/lodash/_stackHas.js","./_stackSet":"node_modules/lodash/_stackSet.js"}],"node_modules/lodash/_setCacheAdd.js":[function(require,module,exports) {
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],"node_modules/lodash/_setCacheHas.js":[function(require,module,exports) {
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],"node_modules/lodash/_SetCache.js":[function(require,module,exports) {
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":"node_modules/lodash/_MapCache.js","./_setCacheAdd":"node_modules/lodash/_setCacheAdd.js","./_setCacheHas":"node_modules/lodash/_setCacheHas.js"}],"node_modules/lodash/_arraySome.js":[function(require,module,exports) {
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],"node_modules/lodash/_cacheHas.js":[function(require,module,exports) {
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],"node_modules/lodash/_equalArrays.js":[function(require,module,exports) {
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":"node_modules/lodash/_SetCache.js","./_arraySome":"node_modules/lodash/_arraySome.js","./_cacheHas":"node_modules/lodash/_cacheHas.js"}],"node_modules/lodash/_Uint8Array.js":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_mapToArray.js":[function(require,module,exports) {
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],"node_modules/lodash/_setToArray.js":[function(require,module,exports) {
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],"node_modules/lodash/_equalByTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js","./_Uint8Array":"node_modules/lodash/_Uint8Array.js","./eq":"node_modules/lodash/eq.js","./_equalArrays":"node_modules/lodash/_equalArrays.js","./_mapToArray":"node_modules/lodash/_mapToArray.js","./_setToArray":"node_modules/lodash/_setToArray.js"}],"node_modules/lodash/_arrayPush.js":[function(require,module,exports) {
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],"node_modules/lodash/isArray.js":[function(require,module,exports) {
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],"node_modules/lodash/_baseGetAllKeys.js":[function(require,module,exports) {
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":"node_modules/lodash/_arrayPush.js","./isArray":"node_modules/lodash/isArray.js"}],"node_modules/lodash/_arrayFilter.js":[function(require,module,exports) {
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],"node_modules/lodash/stubArray.js":[function(require,module,exports) {
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],"node_modules/lodash/_getSymbols.js":[function(require,module,exports) {
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":"node_modules/lodash/_arrayFilter.js","./stubArray":"node_modules/lodash/stubArray.js"}],"node_modules/lodash/_baseTimes.js":[function(require,module,exports) {
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],"node_modules/lodash/isObjectLike.js":[function(require,module,exports) {
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],"node_modules/lodash/_baseIsArguments.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/isArguments.js":[function(require,module,exports) {
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":"node_modules/lodash/_baseIsArguments.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/stubFalse.js":[function(require,module,exports) {
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],"node_modules/lodash/isBuffer.js":[function(require,module,exports) {

var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":"node_modules/lodash/_root.js","./stubFalse":"node_modules/lodash/stubFalse.js"}],"node_modules/lodash/_isIndex.js":[function(require,module,exports) {
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],"node_modules/lodash/isLength.js":[function(require,module,exports) {
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],"node_modules/lodash/_baseIsTypedArray.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isLength":"node_modules/lodash/isLength.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/_baseUnary.js":[function(require,module,exports) {
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],"node_modules/lodash/_nodeUtil.js":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":"node_modules/lodash/_freeGlobal.js"}],"node_modules/lodash/isTypedArray.js":[function(require,module,exports) {
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":"node_modules/lodash/_baseIsTypedArray.js","./_baseUnary":"node_modules/lodash/_baseUnary.js","./_nodeUtil":"node_modules/lodash/_nodeUtil.js"}],"node_modules/lodash/_arrayLikeKeys.js":[function(require,module,exports) {
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":"node_modules/lodash/_baseTimes.js","./isArguments":"node_modules/lodash/isArguments.js","./isArray":"node_modules/lodash/isArray.js","./isBuffer":"node_modules/lodash/isBuffer.js","./_isIndex":"node_modules/lodash/_isIndex.js","./isTypedArray":"node_modules/lodash/isTypedArray.js"}],"node_modules/lodash/_isPrototype.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],"node_modules/lodash/_overArg.js":[function(require,module,exports) {
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],"node_modules/lodash/_nativeKeys.js":[function(require,module,exports) {
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":"node_modules/lodash/_overArg.js"}],"node_modules/lodash/_baseKeys.js":[function(require,module,exports) {
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":"node_modules/lodash/_isPrototype.js","./_nativeKeys":"node_modules/lodash/_nativeKeys.js"}],"node_modules/lodash/isArrayLike.js":[function(require,module,exports) {
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":"node_modules/lodash/isFunction.js","./isLength":"node_modules/lodash/isLength.js"}],"node_modules/lodash/keys.js":[function(require,module,exports) {
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":"node_modules/lodash/_arrayLikeKeys.js","./_baseKeys":"node_modules/lodash/_baseKeys.js","./isArrayLike":"node_modules/lodash/isArrayLike.js"}],"node_modules/lodash/_getAllKeys.js":[function(require,module,exports) {
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":"node_modules/lodash/_baseGetAllKeys.js","./_getSymbols":"node_modules/lodash/_getSymbols.js","./keys":"node_modules/lodash/keys.js"}],"node_modules/lodash/_equalObjects.js":[function(require,module,exports) {
var getAllKeys = require('./_getAllKeys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./_getAllKeys":"node_modules/lodash/_getAllKeys.js"}],"node_modules/lodash/_DataView.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_Promise.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_Set.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_WeakMap.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_getTag.js":[function(require,module,exports) {
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":"node_modules/lodash/_DataView.js","./_Map":"node_modules/lodash/_Map.js","./_Promise":"node_modules/lodash/_Promise.js","./_Set":"node_modules/lodash/_Set.js","./_WeakMap":"node_modules/lodash/_WeakMap.js","./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./_toSource":"node_modules/lodash/_toSource.js"}],"node_modules/lodash/_baseIsEqualDeep.js":[function(require,module,exports) {
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":"node_modules/lodash/_Stack.js","./_equalArrays":"node_modules/lodash/_equalArrays.js","./_equalByTag":"node_modules/lodash/_equalByTag.js","./_equalObjects":"node_modules/lodash/_equalObjects.js","./_getTag":"node_modules/lodash/_getTag.js","./isArray":"node_modules/lodash/isArray.js","./isBuffer":"node_modules/lodash/isBuffer.js","./isTypedArray":"node_modules/lodash/isTypedArray.js"}],"node_modules/lodash/_baseIsEqual.js":[function(require,module,exports) {
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":"node_modules/lodash/_baseIsEqualDeep.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/isEqual.js":[function(require,module,exports) {
var baseIsEqual = require('./_baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;

},{"./_baseIsEqual":"node_modules/lodash/_baseIsEqual.js"}],"src/deckBuilder/util.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStylesToRequest = exports.getUpdateDeckObj = void 0;

var _store = require("../state/store");

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUpdateDeckObj = function getUpdateDeckObj() {
  var updateDeckObj = {};

  var _a = _store.store.getState().deckEditor,
      deck = _a.deck,
      uneditedDeck = _a.uneditedDeck,
      possibleCards = _a.possibleCards;

  var cardsChanged = !(0, _isEqual.default)(deck.cards, uneditedDeck.cards);
  var stylesChanged = !(0, _isEqual.default)(deck.styles, uneditedDeck.styles);

  if (stylesChanged) {
    updateDeckObj.styles = deck.styles;
  }

  if (stylesChanged || cardsChanged) {
    updateDeckObj.cards = filterOutOfStyleCards(deck.styles, deck.cards);
  }

  if (deck.name !== uneditedDeck.name) {
    updateDeckObj.name = deck.name;
  }

  if (deck.description !== uneditedDeck.description) {
    updateDeckObj.description = deck.description;
  }

  return {
    updateDeckObj: updateDeckObj,
    id: deck.id
  };
};

exports.getUpdateDeckObj = getUpdateDeckObj;

var filterOutOfStyleCards = function filterOutOfStyleCards(styles, cards) {
  var possibleCards = _store.store.getState().deckEditor.possibleCards;

  var cardsObj = styles.reduce(function (obj, style) {
    possibleCards[style].forEach(function (_a) {
      var name = _a.name;
      return obj[name] = true;
    });
    return obj;
  }, {});
  return cards.filter(function (cardName) {
    return cardsObj[cardName];
  });
};

var getStylesToRequest = function getStylesToRequest(styles) {
  var possibleCards = _store.store.getState().deckEditor.possibleCards;

  var shouldAddGeneric = possibleCards['Generic'] === undefined;
  var stylesToRequest = styles.filter(function (style) {
    return possibleCards[style] === undefined;
  });

  if (shouldAddGeneric) {
    stylesToRequest.push("Generic");
  }

  return stylesToRequest;
};

exports.getStylesToRequest = getStylesToRequest;
},{"../state/store":"src/state/store.ts","lodash/isEqual":"node_modules/lodash/isEqual.js"}],"src/deckBuilder/dispatch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchShowingUnusedStyles = exports.dispatchChangeDeckName = exports.dispatchRevertDeck = exports.dispatchDeleteDeck = exports.dispatchChoseDeck = exports.dispatchGetDecks = exports.dispatchUpdateDeck = exports.dispatchCreateDeck = void 0;

var _util = require("../util");

var _actions = require("./actions");

var _store = require("../state/store");

var _util2 = require("./util");

var _dispatch = require("../path/dispatch");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var dispatchCreateDeck = function dispatchCreateDeck() {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, deck, possibleCards, action;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , createDeck()];

        case 1:
          _a = _b.sent(), deck = _a.deck, possibleCards = _a.possibleCards;
          action = {
            type: _actions.DeckEditorEnum.CHOSE_DECK,
            deck: deck,
            possibleCards: possibleCards
          };

          _store.store.dispatch(action);

          (0, _dispatch.dispatchAppendPath)(String(deck.id));
          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchCreateDeck = dispatchCreateDeck;

var createDeck = function createDeck() {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, results;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/decks/new', {
            headers: (0, _util.makeAuthHeader)(),
            method: 'POST'
          })];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          results = _a.sent();
          return [2
          /*return*/
          , results];

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
};

var dispatchUpdateDeck = function dispatchUpdateDeck() {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, updateDeckObj, id, success, action;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = (0, _util2.getUpdateDeckObj)(), updateDeckObj = _a.updateDeckObj, id = _a.id;
          return [4
          /*yield*/
          , updateDeck(id, updateDeckObj)];

        case 1:
          success = _b.sent();

          if (success) {
            action = {
              type: _actions.DeckEditorEnum.UPDATE_DECK
            };

            _store.store.dispatch(action);
          }

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchUpdateDeck = dispatchUpdateDeck;

var updateDeck = function updateDeck(id, deck) {
  return __awaiter(void 0, void 0, void 0, function () {
    var headers, fetched;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          headers = (0, _util.makeAuthHeader)();
          headers.append('Accept', 'application/json');
          headers.append('Content-Type', 'application/json');
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/decks/' + id, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(deck)
          })];

        case 1:
          fetched = _a.sent();

          if (fetched.ok) {
            return [2
            /*return*/
            , true];
          }

          return [2
          /*return*/
          , false];
      }
    });
  });
};

var dispatchGetDecks = function dispatchGetDecks() {
  return __awaiter(void 0, void 0, void 0, function () {
    var decks, action;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetchDecks()];

        case 1:
          decks = _a.sent();
          action = {
            type: _actions.DeckEditorEnum.GOT_DECKS,
            decks: decks
          };

          _store.store.dispatch(action);

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchGetDecks = dispatchGetDecks;

var fetchDecks = function fetchDecks() {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, decks;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/decks/', {
            headers: (0, _util.makeAuthHeader)(),
            method: "GET"
          })];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          decks = _a.sent();
          return [2
          /*return*/
          , decks];

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
};

var dispatchChoseDeck = function dispatchChoseDeck(deckID) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, deck, possibleCards, action;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , getDeckByID(deckID)];

        case 1:
          _a = _b.sent(), deck = _a.deck, possibleCards = _a.possibleCards;
          action = {
            type: _actions.DeckEditorEnum.CHOSE_DECK,
            deck: deck,
            possibleCards: possibleCards
          };

          _store.store.dispatch(action);

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchChoseDeck = dispatchChoseDeck;

var getDeckByID = function getDeckByID(deckID) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched, results;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/decks/' + deckID, {
            headers: (0, _util.makeAuthHeader)(),
            method: "GET"
          })];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          results = _a.sent();
          return [2
          /*return*/
          , results];

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
};

var dispatchDeleteDeck = function dispatchDeleteDeck(deckID) {
  return __awaiter(void 0, void 0, void 0, function () {
    var success, action;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , deleteDeck(deckID)];

        case 1:
          success = _a.sent();

          if (success) {
            action = {
              type: _actions.DeckEditorEnum.DELETE_DECK,
              id: deckID
            };

            _store.store.dispatch(action);
          }

          dispatchGetDecks();
          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.dispatchDeleteDeck = dispatchDeleteDeck;

var deleteDeck = function deleteDeck(deckID) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fetched;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/decks/' + deckID, {
            method: "DELETE",
            headers: (0, _util.makeAuthHeader)()
          })];

        case 1:
          fetched = _a.sent();

          if (fetched.ok) {
            return [2
            /*return*/
            , true];
          }

          return [2
          /*return*/
          , false];
      }
    });
  });
};

var dispatchRevertDeck = function dispatchRevertDeck() {
  var action = {
    type: _actions.DeckEditorEnum.REVERT_DECK
  };

  _store.store.dispatch(action);
};

exports.dispatchRevertDeck = dispatchRevertDeck;

var dispatchChangeDeckName = function dispatchChangeDeckName(name) {
  var action = {
    type: _actions.DeckEditorEnum.CHANGE_NAME,
    name: name
  };

  _store.store.dispatch(action);
};

exports.dispatchChangeDeckName = dispatchChangeDeckName;

var dispatchShowingUnusedStyles = function dispatchShowingUnusedStyles(showing) {
  var action = {
    type: _actions.DeckEditorEnum.SHOWING_UNUSED_STYLES,
    showing: showing
  };

  _store.store.dispatch(action);
};

exports.dispatchShowingUnusedStyles = dispatchShowingUnusedStyles;
},{"../util":"src/util.ts","./actions":"src/deckBuilder/actions.ts","../state/store":"src/state/store.ts","./util":"src/deckBuilder/util.ts","../path/dispatch":"src/path/dispatch.ts"}],"src/components/deckBuilder/deckList.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../path/dispatch");

var _dispatch2 = require("../../deckBuilder/dispatch");

var _deckItem = _interopRequireDefault(require("../deckViewer/deckItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var DeckList =
/** @class */
function (_super) {
  __extends(DeckList, _super);

  function DeckList() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  DeckList.prototype.componentDidMount = function () {
    (0, _dispatch2.dispatchGetDecks)();
  };

  DeckList.prototype.render = function (_a) {
    var decks = _a.decks;
    return (0, _preact.h)("div", {
      class: "main deck-builder-list"
    }, (0, _preact.h)("h2", null, "Decks"), decks.map(function (deck) {
      return (0, _preact.h)("div", {
        key: deck.id,
        class: 'deck-item'
      }, (0, _preact.h)(_deckItem.default, {
        deck: deck,
        action: function action(chosenDeck) {
          {
            (0, _dispatch2.dispatchChoseDeck)(chosenDeck.id);
            (0, _dispatch.dispatchAppendPath)(chosenDeck.id.toString());
          }
        }
      }), (0, _preact.h)("button", {
        class: 'btn delete',
        onClick: function onClick() {
          return (0, _dispatch2.dispatchDeleteDeck)(deck.id);
        }
      }, "Delete"));
    }), (0, _preact.h)("button", {
      class: "make-button",
      onClick: _dispatch2.dispatchCreateDeck
    }, "New Deck"));
  };

  return DeckList;
}(_preact.Component);

var _default = DeckList;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../path/dispatch":"src/path/dispatch.ts","../../deckBuilder/dispatch":"src/deckBuilder/dispatch.ts","../deckViewer/deckItem":"src/components/deckViewer/deckItem.tsx"}],"src/deckBuilder/dispatchEditDeck.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchDEToggleStyle = exports.dispatchDERemoveStyle = exports.dispatchDEAddStyle = exports.dispatchDEToggleCard = void 0;

var _actions = require("./actions");

var _store = require("../state/store");

var _util = require("../util");

var _util2 = require("./util");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var dispatchDEAddCard = function dispatchDEAddCard(card) {
  var action = {
    type: _actions.DeckEditorEnum.ADD_CARD,
    card: card
  };

  _store.store.dispatch(action);
};

var dispatchDERemoveCard = function dispatchDERemoveCard(card) {
  var action = {
    type: _actions.DeckEditorEnum.REMOVE_CARD,
    card: card
  };

  _store.store.dispatch(action);
};

var dispatchDEToggleCard = function dispatchDEToggleCard(card, hasCard) {
  if (!hasCard) {
    dispatchDEAddCard(card);
  } else {
    dispatchDERemoveCard(card);
  }
};

exports.dispatchDEToggleCard = dispatchDEToggleCard;

var dispatchDEAddStyle = function dispatchDEAddStyle(style) {
  var action = {
    type: _actions.DeckEditorEnum.ADD_STYLE,
    style: style
  };

  _store.store.dispatch(action);
};

exports.dispatchDEAddStyle = dispatchDEAddStyle;

var dispatchDERemoveStyle = function dispatchDERemoveStyle(style) {
  var action = {
    type: _actions.DeckEditorEnum.REMOVE_STYLE,
    style: style
  };

  _store.store.dispatch(action);
};

exports.dispatchDERemoveStyle = dispatchDERemoveStyle;

var dispatchDEToggleStyle = function dispatchDEToggleStyle(style, addStyle) {
  if (addStyle) {
    dispatchDEAddStyle(style);
  } else {
    dispatchDERemoveStyle(style);
  }

  getPossibleCards();
};

exports.dispatchDEToggleStyle = dispatchDEToggleStyle;

var getPossibleCards = function getPossibleCards() {
  return __awaiter(void 0, void 0, void 0, function () {
    var styles, unfetchedStyles, fetched, possibleCards, action;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          styles = _store.store.getState().deckEditor.deck.styles;
          unfetchedStyles = (0, _util2.getStylesToRequest)(styles);
          if (!(unfetchedStyles.length > 0)) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetch(_util.HOST_URL + '/decks/possibleCards?styles=' + unfetchedStyles.join(','), {
            method: "GET"
          })];

        case 1:
          fetched = _a.sent();
          if (!fetched.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , fetched.json()];

        case 2:
          possibleCards = _a.sent();
          action = {
            type: _actions.DeckEditorEnum.GOT_POSSIBLE_CARDS,
            possibleCards: possibleCards
          };

          _store.store.dispatch(action);

          _a.label = 3;

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
};
},{"./actions":"src/deckBuilder/actions.ts","../state/store":"src/state/store.ts","../util":"src/util.ts","./util":"src/deckBuilder/util.ts"}],"src/components/deckBuilder/styleList.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatchEditDeck = require("../../deckBuilder/dispatchEditDeck");

var _dispatch = require("../../fightingStyles/dispatch");

var _dispatch2 = require("../../deckBuilder/dispatch");

var _reactLightweightTooltip = require("react-lightweight-tooltip");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var StyleList =
/** @class */
function (_super) {
  __extends(StyleList, _super);

  function StyleList(props) {
    return _super.call(this, props) || this;
  }

  StyleList.prototype.checkStyle = function (e, style) {
    var el = e.target;
    var checked = el.checked;
    (0, _dispatchEditDeck.dispatchDEToggleStyle)(style, checked);
  };

  StyleList.prototype.render = function (_a) {
    var _this = this;

    var maxCards = _a.maxCards,
        totalCards = _a.totalCards,
        showingUnusedStyles = _a.showingUnusedStyles,
        unselectedStyles = _a.unselectedStyles,
        selectedStyles = _a.selectedStyles,
        stylesUsed = _a.stylesUsed;
    var showing = showingUnusedStyles ? "hide" : "show";
    return (0, _preact.h)("div", {
      class: "style-container"
    }, (0, _preact.h)("div", {
      class: "section"
    }, (0, _preact.h)("div", {
      class: "split-title"
    }, (0, _preact.h)("h2", null, " Chosen Styles:  ", selectedStyles.length, "/3"), (0, _preact.h)("h4", null, "Cards: ", totalCards, "/", maxCards)), (0, _preact.h)("div", {
      class: "style-list"
    }, selectedStyles.map(function (style) {
      return _this.RenderStyle({
        isChecked: true,
        style: style
      });
    }))), (0, _preact.h)("div", {
      class: "section"
    }, (0, _preact.h)("div", {
      class: "unused-styles"
    }, (0, _preact.h)("h3", null, "Unused Styles:"), (0, _preact.h)("button", {
      class: "btn",
      onClick: function onClick() {
        return (0, _dispatch2.dispatchShowingUnusedStyles)(!showingUnusedStyles);
      }
    }, showing)), (0, _preact.h)("div", {
      class: "style-list"
    }, showingUnusedStyles && unselectedStyles.map(function (style) {
      var isDisabled = stylesUsed >= 3;
      return _this.RenderStyle({
        isChecked: false,
        isDisabled: isDisabled,
        style: style
      });
    }))));
  };

  StyleList.prototype.RenderTooltip = function (style) {
    if (!style.identity && !style.strengths && !style.mainMechanics) {
      return (0, _preact.h)("div", null, "No style information yet.");
    }

    return (0, _preact.h)("div", null, style.identity && (0, _preact.h)("div", {
      class: "mb-2"
    }, "Identity: ", style.identity), style.strengths && (0, _preact.h)("div", {
      class: "mb-2"
    }, "Strong State: ", style.strengths), style.mainMechanics && (0, _preact.h)("div", {
      class: "mb-2"
    }, "Main Mechanics: ", style.mainMechanics.reduce(function (str, mech) {
      return str + ' ' + mech;
    }, '')));
  };

  StyleList.prototype.RenderStyle = function (_a) {
    var isChecked = _a.isChecked,
        isDisabled = _a.isDisabled,
        style = _a.style;
    return (0, _preact.h)(_reactLightweightTooltip.Tooltip, {
      content: this.RenderTooltip(style)
    }, (0, _preact.h)("div", {
      class: "style-item" + (isDisabled ? ' disabled' : '') + (isChecked ? ' active' : ''),
      key: style.name,
      onClick: function onClick() {
        if (!isDisabled) {
          (0, _dispatchEditDeck.dispatchDEToggleStyle)(style.name, !isChecked);
        }
      }
    }, (0, _preact.h)("div", {
      class: "style-title"
    }, (0, _preact.h)("div", null, " ", style.name, " "), (0, _preact.h)("button", {
      class: "view-button btn",
      onClick: function onClick(e) {
        e.stopPropagation();
        (0, _dispatch.dispatchViewStyleFromDeck)(style.name);
      }
    }, "View")), (0, _preact.h)("div", {
      class: "style-description"
    }, " ", style.description)));
  };

  return StyleList;
}(_preact.Component);

var _default = function _default(_a) {
  var maxCards = _a.maxCards,
      totalCards = _a.totalCards,
      deck = _a.deck,
      _b = _a.allStyles,
      allStyles = _b === void 0 ? [] : _b,
      showingUnusedStyles = _a.showingUnusedStyles;
  var chosenStyles = deck.styles.reduce(function (obj, name) {
    obj[name] = true;
    return obj;
  }, {});
  var selectedStyles = [];
  var unselectedStyles = [];
  allStyles.forEach(function (style) {
    if (style.isGeneric) {
      return;
    }

    if (chosenStyles[style.name]) {
      selectedStyles.push(style);
    } else {
      unselectedStyles.push(style);
    }
  });
  var props = {
    unselectedStyles: unselectedStyles,
    selectedStyles: selectedStyles,
    chosenStylesObj: chosenStyles,
    stylesUsed: deck.styles.length,
    showingUnusedStyles: showingUnusedStyles,
    maxCards: maxCards,
    totalCards: totalCards
  };
  return (0, _preact.h)(StyleList, __assign({}, props));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../deckBuilder/dispatchEditDeck":"src/deckBuilder/dispatchEditDeck.ts","../../fightingStyles/dispatch":"src/fightingStyles/dispatch.ts","../../deckBuilder/dispatch":"src/deckBuilder/dispatch.ts","react-lightweight-tooltip":"node_modules/react-lightweight-tooltip/dist-modules/index.js"}],"src/components/deckBuilder/revert.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../deckBuilder/dispatch");

var _default = function _default() {
  return (0, _preact.h)("div", {
    class: "revert"
  }, (0, _preact.h)("button", {
    class: "btn-primary btn",
    onClick: _dispatch.dispatchUpdateDeck
  }, "Update"), (0, _preact.h)("button", {
    class: "btn",
    onClick: _dispatch.dispatchRevertDeck
  }, "Revert"));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../deckBuilder/dispatch":"src/deckBuilder/dispatch.ts"}],"node_modules/decko/dist/decko.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function(global,factory){if(typeof define === 'function' && define.amd){define(['exports'],factory);}else if(typeof exports !== 'undefined'){factory(exports);}else {var mod={exports:{}};factory(mod.exports);global.decko = mod.exports;}})(this,function(exports){'use strict';exports.__esModule = true;var EMPTY={};var HOP=Object.prototype.hasOwnProperty;var fns={memoize:function memoize(fn){var opt=arguments.length <= 1 || arguments[1] === undefined?EMPTY:arguments[1];var cache=opt.cache || {};return function(){for(var _len=arguments.length,a=Array(_len),_key=0;_key < _len;_key++) {a[_key] = arguments[_key];}var k=String(a[0]);if(opt.caseSensitive === false)k = k.toLowerCase();return HOP.call(cache,k)?cache[k]:cache[k] = fn.apply(this,a);};},debounce:function debounce(fn,opts){if(typeof opts === 'function'){var p=fn;fn = opts;opts = p;}var delay=opts && opts.delay || opts || 0,args=undefined,context=undefined,timer=undefined;return function(){for(var _len2=arguments.length,a=Array(_len2),_key2=0;_key2 < _len2;_key2++) {a[_key2] = arguments[_key2];}args = a;context = this;if(!timer)timer = setTimeout(function(){fn.apply(context,args);args = context = timer = null;},delay);};},bind:function bind(target,key,_ref){var fn=_ref.value;return {configurable:true,get:function get(){var value=fn.bind(this);Object.defineProperty(this,key,{value:value,configurable:true,writable:true});return value;}};}};var memoize=multiMethod(fns.memoize),debounce=multiMethod(fns.debounce),bind=multiMethod(function(f,c){return f.bind(c);},function(){return fns.bind;});exports.memoize = memoize;exports.debounce = debounce;exports.bind = bind;exports['default'] = {memoize:memoize,debounce:debounce,bind:bind};function multiMethod(inner,deco){deco = deco || inner.decorate || decorator(inner);var d=deco();return function(){for(var _len3=arguments.length,args=Array(_len3),_key3=0;_key3 < _len3;_key3++) {args[_key3] = arguments[_key3];}var l=args.length;return (l < 2?deco:l > 2?d:inner).apply(undefined,args);};}function decorator(fn){return function(opt){return typeof opt === 'function'?fn(opt):function(target,key,desc){desc.value = fn(desc.value,opt,target,key,desc);};};}});


},{}],"src/components/deckBuilder/deckViewer.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatchEditDeck = require("../../deckBuilder/dispatchEditDeck");

var _styleList = _interopRequireDefault(require("./styleList"));

var _revert = _interopRequireDefault(require("./revert"));

var _decko = require("decko");

var _dispatch = require("../../deckBuilder/dispatch");

var _fullCard = _interopRequireDefault(require("../cards/fullCard"));

var _filter = _interopRequireDefault(require("../filter"));

var _util = require("../../filters/util");

var _dispatch2 = require("../../path/dispatch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DeckViewer =
/** @class */
function (_super) {
  __extends(DeckViewer, _super);

  function DeckViewer() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  DeckViewer.prototype.handleNameChange = function (e) {
    var el = e.target;
    (0, _dispatch.dispatchChangeDeckName)(el.value);
  };

  DeckViewer.prototype.render = function (_a) {
    var _this = this;

    var totalCards = _a.totalCards,
        maxCards = _a.maxCards,
        showingUnusedStyles = _a.showingUnusedStyles,
        deck = _a.deck,
        styleDescriptions = _a.styleDescriptions,
        canUpdate = _a.canUpdate;

    if (!deck) {
      return (0, _preact.h)("div", null, "Loading...");
    }

    var name = deck.name;
    return (0, _preact.h)("div", {
      class: 'deck-builder pad-bottom'
    }, (0, _preact.h)("div", {
      class: "deck-name section"
    }, (0, _preact.h)("label", {
      for: "deck-name"
    }, "Deck Name"), (0, _preact.h)("input", {
      id: "deck-name",
      value: name,
      onChange: this.handleNameChange
    })), (0, _preact.h)(_styleList.default, {
      totalCards: totalCards,
      maxCards: maxCards,
      showingUnusedStyles: showingUnusedStyles,
      deck: deck,
      allStyles: styleDescriptions
    }), (0, _preact.h)(_filter.default, null), (0, _preact.h)("div", {
      class: 'deck'
    }, deck.styles.map(function (style, i) {
      return _this.RenderStyle(style);
    }), this.RenderStyle('Generic')), !canUpdate && (0, _preact.h)("button", {
      onClick: _dispatch2.dispatchPopPath,
      class: 'btn back-btn'
    }, "Back To Decks"), "}", canUpdate && (0, _preact.h)(_revert.default, null));
  };

  DeckViewer.prototype.RenderStyle = function (style) {
    var _this = this;

    var possibleCards = this.props.possibleCards;
    var cards = this.props.deck.cards;
    var styleCards = possibleCards[style];

    if (!styleCards) {
      return (0, _preact.h)("div", null, " Loading Style...");
    }

    var maxCards = styleCards.length;
    var cardsObj = styleCards.reduce(function (obj, card) {
      obj[card.name] = true;
      return obj;
    }, {});
    var usedCards = cards.reduce(function (count, name) {
      if (cardsObj[name]) {
        return count + 1;
      }

      return count;
    }, 0);
    return (0, _preact.h)("div", {
      class: "cards-section section",
      key: style
    }, (0, _preact.h)("div", {
      class: "split-title"
    }, (0, _preact.h)("h3", {
      class: "style"
    }, style), (0, _preact.h)("h4", null, "Cards: ", usedCards, "/", maxCards)), (0, _preact.h)("div", {
      class: "cards"
    }, (0, _util.filterInvalidCards)(styleCards, this.props.filters).map(function (card) {
      return _this.RenderCard({
        card: card,
        cardsObj: _this.props.cardsObj
      });
    })));
  };

  DeckViewer.prototype.RenderCard = function (_a) {
    var card = _a.card,
        cardsObj = _a.cardsObj;
    var hasCard = card ? cardsObj[card.name] : false;
    return (0, _preact.h)("div", {
      key: card.name,
      class: hasCard ? '' : 'greyed',
      onClick: function onClick() {
        return (0, _dispatchEditDeck.dispatchDEToggleCard)(card.name, hasCard);
      }
    }, (0, _preact.h)(_fullCard.default, {
      card: card
    }));
  };

  var _a;

  __decorate([(0, _decko.debounce)(30), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof (_a = typeof Event !== "undefined" && Event) === "function" ? _a : Object]), __metadata("design:returntype", void 0)], DeckViewer.prototype, "handleNameChange", null);

  __decorate([_decko.bind, __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", void 0)], DeckViewer.prototype, "RenderStyle", null);

  __decorate([_decko.bind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], DeckViewer.prototype, "RenderCard", null);

  return DeckViewer;
}(_preact.Component);

var _default = function _default(props) {
  var cards = !props.deck ? [] : props.deck.cards;
  var cardsObj = cards.reduce(function (obj, name) {
    obj[name] = true;
    return obj;
  }, {});
  var totalCards;
  var maxCards;

  if (props.deck) {
    var possibleCards_1 = props.possibleCards;
    totalCards = props.deck.cards.length;
    maxCards = Object.keys(possibleCards_1).reduce(function (max, style) {
      return possibleCards_1[style].length + max;
    }, 0);
  } else {
    totalCards = 0;
    maxCards = 0;
  }

  return (0, _preact.h)(DeckViewer, __assign({}, props, {
    cardsObj: cardsObj,
    totalCards: totalCards,
    maxCards: maxCards
  }));
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../deckBuilder/dispatchEditDeck":"src/deckBuilder/dispatchEditDeck.ts","./styleList":"src/components/deckBuilder/styleList.tsx","./revert":"src/components/deckBuilder/revert.tsx","decko":"node_modules/decko/dist/decko.js","../../deckBuilder/dispatch":"src/deckBuilder/dispatch.ts","../cards/fullCard":"src/components/cards/fullCard.tsx","../filter":"src/components/filter.tsx","../../filters/util":"src/filters/util.ts","../../path/dispatch":"src/path/dispatch.ts"}],"src/components/deckBuilder/index.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _dispatch = require("../../fightingStyles/dispatch");

var _deckList = _interopRequireDefault(require("./deckList"));

var _deckViewer = _interopRequireDefault(require("./deckViewer"));

var _preactRedux = require("preact-redux");

var _dispatch2 = require("../../path/dispatch");

var _dispatch3 = require("../../deckBuilder/dispatch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var selector = function selector(state) {
  return {
    possibleCards: state.deckEditor.possibleCards,
    isLoggedIn: Boolean(state.user.token),
    styleDecriptions: state.fightingStyle.styleDescriptions,
    decks: state.deckEditor.allDecks,
    isLoadingDecks: !Array.isArray(state.deckEditor.allDecks),
    deck: state.deckEditor.deck,
    canUpdate: state.deckEditor.canUpdate,
    filters: state.filter.filters,
    showingUnusedStyles: state.deckEditor.showingUnusedStyles
  };
};

var DeckEditor =
/** @class */
function (_super) {
  __extends(DeckEditor, _super);

  function DeckEditor() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  DeckEditor.prototype.componentDidMount = function () {
    var deckID = this.props.path[0];
    var shouldLoadDeck = !this.props.deck || this.props.deck.id.toString() !== deckID;

    if (deckID && shouldLoadDeck) {
      (0, _dispatch3.dispatchChoseDeck)(Number(deckID));
    }

    (0, _dispatch.getFightingStyles)();
  };

  DeckEditor.prototype.render = function (_a) {
    var possibleCards = _a.possibleCards,
        filters = _a.filters,
        isLoadingDecks = _a.isLoadingDecks,
        showingUnusedStyles = _a.showingUnusedStyles,
        _b = _a.decks,
        decks = _b === void 0 ? [] : _b,
        path = _a.path,
        styleDecriptions = _a.styleDecriptions,
        deck = _a.deck,
        isLoggedIn = _a.isLoggedIn,
        canUpdate = _a.canUpdate;
    var root = path[0],
        remainingPath = path.slice(1);

    if (!isLoggedIn) {
      (0, _preact.h)(MustLogIn, null);
    }

    if (isLoadingDecks) {
      return (0, _preact.h)("div", null, "Loading ...");
    }

    if (root) {
      return (0, _preact.h)(_deckViewer.default, {
        possibleCards: possibleCards,
        showingUnusedStyles: showingUnusedStyles,
        filters: filters,
        canUpdate: canUpdate,
        styleDescriptions: styleDecriptions,
        deck: deck
      });
    }

    return (0, _preact.h)(_deckList.default, {
      decks: decks
    });
  };

  return DeckEditor;
}(_preact.Component);

var MustLogIn = function MustLogIn() {
  return (0, _preact.h)("div", {
    class: "main"
  }, "In order to make decks you must be logged in. Create an account or log in.", (0, _preact.h)("div", null, (0, _preact.h)("a", {
    class: "link",
    onClick: function onClick() {
      return (0, _dispatch2.dispatchToPathString)('/user/login');
    }
  }, "Login")), (0, _preact.h)("div", null, (0, _preact.h)("a", {
    class: "link",
    onClick: function onClick() {
      return (0, _dispatch2.dispatchToPathString)('/user/create');
    }
  }, "Create Account")));
};

var _default = (0, _preactRedux.connect)(selector)(DeckEditor);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","../../fightingStyles/dispatch":"src/fightingStyles/dispatch.ts","./deckList":"src/components/deckBuilder/deckList.tsx","./deckViewer":"src/components/deckBuilder/deckViewer.tsx","preact-redux":"node_modules/preact-redux/dist/preact-redux.esm.js","../../path/dispatch":"src/path/dispatch.ts","../../deckBuilder/dispatch":"src/deckBuilder/dispatch.ts"}],"src/components/app.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _game = _interopRequireDefault(require("./game"));

var _deckViewer = _interopRequireDefault(require("./deckViewer"));

var _styleViewer = _interopRequireDefault(require("./styleViewer"));

require("../listeners");

var _util = require("../util");

var _landing = _interopRequireDefault(require("./landing"));

var _nav = _interopRequireDefault(require("./nav"));

var _user = _interopRequireDefault(require("./login/user"));

var _deckBuilder = _interopRequireDefault(require("./deckBuilder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selector = function selector(state) {
  var path = state.path.pathArr || [];
  var root = path[0],
      remainingPath = path.slice(1);
  return {
    showGame: root === 'game',
    showDeckViewer: root === 'decks',
    showDeckBuilder: root === 'builder',
    showStyleViewer: root === 'styles',
    showUserViewer: root === 'user',
    prepend: [root],
    remainingPath: remainingPath
  };
};

var App = function App(_a) {
  var showDeckViewer = _a.showDeckViewer,
      showStyleViewer = _a.showStyleViewer,
      showUserViewer = _a.showUserViewer,
      showGame = _a.showGame,
      prepend = _a.prepend,
      remainingPath = _a.remainingPath,
      showDeckBuilder = _a.showDeckBuilder;

  if (showGame) {
    return (0, _preact.h)(_game.default, null);
  }

  return (0, _preact.h)("div", null, (0, _preact.h)(_nav.default, null), showDeckViewer && (0, _preact.h)(_deckViewer.default, {
    pathPrepend: prepend,
    path: remainingPath
  }), showStyleViewer && (0, _preact.h)(_styleViewer.default, {
    pathPrepend: prepend,
    path: remainingPath
  }), showUserViewer && (0, _preact.h)(_user.default, {
    path: remainingPath
  }), showDeckBuilder && (0, _preact.h)(_deckBuilder.default, {
    path: remainingPath
  }), !showDeckViewer && !showStyleViewer && !showUserViewer && !showDeckBuilder && (0, _preact.h)(_landing.default, null));
};

var _default = (0, _util.cleanConnect)(selector, App);

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.mjs","./game":"src/components/game.tsx","./deckViewer":"src/components/deckViewer.tsx","./styleViewer":"src/components/styleViewer.tsx","../listeners":"src/listeners/index.ts","../util":"src/util.ts","./landing":"src/components/landing.tsx","./nav":"src/components/nav.tsx","./login/user":"src/components/login/user.tsx","./deckBuilder":"src/components/deckBuilder/index.tsx"}],"index.tsx":[function(require,module,exports) {
"use strict";

var _preact = require("preact");

var _preactRedux = require("preact-redux");

var _store = require("./src/state/store");

var _app = _interopRequireDefault(require("./src/components/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Prov = _preactRedux.Provider;

var renderApp = function renderApp() {
  var rootNode = document.getElementById('root');
  (0, _preact.render)((0, _preact.h)(Prov, {
    store: _store.store
  }, (0, _preact.h)(_app.default, null)), rootNode, rootNode.lastChild);
};

document.addEventListener('DOMContentLoaded', renderApp);
module.hot.accept(renderApp);
},{"preact":"node_modules/preact/dist/preact.mjs","preact-redux":"node_modules/preact-redux/dist/preact-redux.esm.js","./src/state/store":"src/state/store.ts","./src/components/app":"src/components/app.tsx"}],"C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53935" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/wolff/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js","index.tsx"], null)
//# sourceMappingURL=/game-client.f69400ca.js.map
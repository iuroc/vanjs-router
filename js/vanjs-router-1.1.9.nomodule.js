var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import van from 'vanjs-core';
var div = van.tags.div;
/** 从 `location.hash` 获取当前路由 */
var nowRoute = function () {
    var _a;
    var li = location.hash.split('/');
    var route = { name: (_a = li[1]) !== null && _a !== void 0 ? _a : 'home', args: li.slice(2) };
    return route;
};
var activeRoute = van.state(nowRoute());
window.addEventListener('hashchange', function () {
    activeRoute.val = nowRoute();
});
var Route = function (config) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    var name = config.name, onFirst = config.onFirst, onLoad = config.onLoad, otherProp = __rest(config, ["name", "onFirst", "onLoad"]);
    var firstLoad = true;
    van.derive(function () {
        if (activeRoute.val.name == config.name) {
            if (firstLoad && config.onFirst) {
                config.onFirst(activeRoute.val);
                firstLoad = false;
            }
            if (config.onLoad)
                config.onLoad(activeRoute.val);
        }
    });
    return div(__assign({ hidden: function () { return config.name != activeRoute.val.name; } }, otherProp), rest);
};
var routeTo = function (name, args) {
    if (name === void 0) { name = 'home'; }
    if (args === void 0) { args = []; }
    if (args.length == 0) {
        if (name == 'home') {
            location.hash = '';
            history.replaceState(null, '', './');
        }
        else
            location.hash = "/".concat(name);
    }
    else
        location.hash = "/".concat(name, "/").concat(args.join('/'));
};
// export { Route, routeTo }
Object.defineProperty(window, 'Route', Route);
Object.defineProperty(window, 'routeTo', routeTo);

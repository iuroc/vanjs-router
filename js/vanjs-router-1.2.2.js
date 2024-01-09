const { div } = van.tags;
/** 从 `location.hash` 获取当前路由 */
const nowRoute = () => {
    const li = location.hash.split('/');
    const route = { name: li[1] ?? 'home', args: li.slice(2) };
    return route;
};
const activeRoute = van.state(nowRoute());
window.addEventListener('hashchange', () => {
    activeRoute.val = nowRoute();
});
const Route = (first, ...rest) => {
    const { name, onFirst, onLoad, ...otherProp } = first;
    let firstLoad = true;
    van.derive(() => {
        if (activeRoute.val.name == first.name) {
            if (firstLoad && first.onFirst) {
                first.onFirst(activeRoute.val);
                firstLoad = false;
            }
            if (first.onLoad)
                first.onLoad(activeRoute.val);
        }
    });
    return div({ hidden: () => first.name != activeRoute.val.name, ...otherProp }, rest);
};
const routeTo = (name = 'home', args = []) => {
    if (args.length == 0) {
        if (name == 'home') {
            location.hash = '';
            history.replaceState(null, '', './');
        }
        else
            location.hash = `/${name}`;
    }
    else
        location.hash = `/${name}/${args.join('/')}`;
};
window.Route = Route;
window.routeTo = routeTo;
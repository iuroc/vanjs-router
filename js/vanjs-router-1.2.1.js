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
const Route = (config, ...rest) => {
    let firstLoad = true;
    van.derive(() => {
        if (activeRoute.val.name == config.name) {
            if (firstLoad && config.onFirst) {
                config.onFirst(activeRoute.val);
                firstLoad = false;
            }
            if (config.onLoad)
                config.onLoad(activeRoute.val);
        }
    });
    return div({ hidden: () => config.name != activeRoute.val.name }, rest);
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
Window.routeTo = routeTo;
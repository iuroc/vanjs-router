import van from 'vanjs-core';
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
    const dom = div({ hidden: () => config.name != activeRoute.val.name }, rest);
    van.derive(() => {
        if (activeRoute.val.name == config.name) {
            if (firstLoad && config.onFirst) {
                config.onFirst({ ...activeRoute.val, dom });
                firstLoad = false;
            }
            if (config.onLoad)
                config.onLoad({ ...activeRoute.val, dom });
        }
    });
    return dom;
};
const routeTo = (name = 'home', args = []) => {
    if (args.length == 0) {
        if (name == 'home') {
            location.hash = '';
            history.replaceState(null, '', '/');
        }
        else
            location.hash = `/${name}`;
    }
    else
        location.hash = `/${name}/${args.join('/')}`;
};
export { Route, routeTo };

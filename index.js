import van from 'vanjs-core';
const { div } = van.tags;
van.derive(() => {
    location.hash = routeId.val.toString();
});
const routeEvents = [];
const getRouteId = () => {
    let value = parseInt(location.hash.substring(1));
    return isNaN(value) ? 0 : value;
};
const routeId = van.state(getRouteId());
export const Route = (id, ...rest) => {
    return div({ hidden: () => routeId.val != id }, ...rest);
};
export const router = (event) => {
    const add = (id, handle) => routeEvents.push({ id, handle });
    routeId.val = getRouteId();
    if (event instanceof Event == false) {
        window.addEventListener('hashchange', router);
        if (event != undefined)
            event(add);
    }
    routeEvents.forEach(event => {
        const { id, handle } = event;
        if (routeId.val == id)
            handle(add);
    });
    return routeId;
};

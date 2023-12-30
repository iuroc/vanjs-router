import van, { ChildDom } from 'vanjs-core'

const { div } = van.tags

/** 来自 `location.hash` 的路由信息 */
interface Route {
    /** 路由名称 */
    readonly name: string
    /** 路由参数 */
    readonly args: readonly string[]
}

interface RouteWithDom extends Route {
    dom: HTMLDivElement
}

interface RouteSetting {
    /** 路由名称 */
    readonly name: string
    /** 初次路由载入 */
    onFirst?: (route: RouteWithDom) => void
    /** 每次路由载入 */
    onLoad?: (route: RouteWithDom) => void
}
/** 从 `location.hash` 获取当前路由 */
const nowRoute = () => {
    const li = location.hash.split('/')
    const route: Route = { name: li[1] ?? 'home', args: li.slice(2) }
    return route
}

const activeRoute = van.state(nowRoute())

window.addEventListener('hashchange', () => {
    activeRoute.val = nowRoute()
})

const Route = (config: RouteSetting, ...rest: readonly ChildDom[]) => {
    let firstLoad = true
    const dom = div({ hidden: () => config.name != activeRoute.val.name }, rest)
    van.derive(() => {
        if (activeRoute.val.name == config.name) {
            if (firstLoad && config.onFirst) {
                config.onFirst({ ...activeRoute.val, dom })
                firstLoad = false
            }
            if (config.onLoad) config.onLoad({ ...activeRoute.val, dom })
        }
    })
    return dom
}

const routeTo = (name: Route['name'] = 'home', args: Route['args'] = []) => {
    if (args.length == 0) {
        if (name == 'home') {
            location.hash = ''
            history.replaceState(null, '', '/')
        } else location.hash = `/${name}`
    } else location.hash = `/${name}/${args.join('/')}`
}

export { Route, routeTo }
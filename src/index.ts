import van, { ChildDom, PropValueOrDerived, Props, PropsWithKnownKeys } from 'vanjs-core'

const { div } = van.tags

/** 来自 `location.hash` 的路由信息 */
interface Route {
    /** 路由名称 */
    readonly name: string
    /** 路由参数 */
    readonly args: readonly string[]
}

interface RouteSetting {
    /** 路由名称 */
    readonly name: string
    /** 初次路由载入 */
    onFirst?: (route: Route) => void
    /** 每次路由载入 */
    onLoad?: (route: Route) => void
    [key: string]: PropValueOrDerived | undefined
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

const Route = (first: RouteSetting & Props & PropsWithKnownKeys<HTMLDivElement>, ...rest: readonly ChildDom[]) => {
    const { name, onFirst, onLoad, ...otherProp } = first
    let firstLoad = true
    van.derive(() => {
        if (activeRoute.val.name == first.name) {
            if (firstLoad && first.onFirst) {
                first.onFirst(activeRoute.val)
                firstLoad = false
            }
            if (first.onLoad) first.onLoad(activeRoute.val)
        }
    })
    return div({ hidden: () => first.name != activeRoute.val.name, ...otherProp }, rest)
}

const routeTo = (name: Route['name'] = 'home', args: any[] = []) => {
    if (args.length == 0) {
        if (name == 'home') {
            location.hash = ''
            history.replaceState(null, '', './')
        } else location.hash = `/${name}`
    } else location.hash = `/${name}/${args.join('/')}`
}

export { Route, routeTo }
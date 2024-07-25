import van from 'vanjs-core'

export const nowHash = () => location.hash ? location.hash.slice(1) : 'home'

export const now = van.state(nowHash())

window.addEventListener('hashchange', event => {
    now.val = nowHash()
})

export type HandlerConfig<E extends HTMLElement = HTMLElement> = {
    /** 当前路由的命中规则
     * - 如果传入字符串，则只匹配 Hash 以 `/` 分割后的首项，其余项作为 `args`。
     * - 如果传入正则，则匹配正则，捕获分组作为 `args`。
     * 
     * 例如：
     * ```ts
     * { rule: 'about' }
     * { rule: /list_(\d+)/ }
     * ```
     */
    rule: Handler<E>['rule']
    /** 当前路由页面的构建方法 */
    Loader: Handler<E>['Loader']
    /** 延迟加载页面，需要显示调用 `show()` 方法显示页面。 */
    delayed?: Handler<E>['delayed']
    /** 首次路由命中事件，在 `onLoad` 之前执行。 */
    onFirst?: Handler<E>['onFirst']
    /** 路由命中事件，在 `await onFirst()` 之后执行。 */
    onLoad?: Handler<E>['onLoad']
}

export class Handler<E extends HTMLElement = HTMLElement> {
    private rule: string | RegExp
    /** 当前路由被命中后接收到的路由参数 */
    public args: string[] = []
    private Loader: (this: Handler<E>) => E
    private delayed = false
    private onFirst: (this: Handler<E>) => any
    private onLoad: (this: Handler<E>) => any
    /** 路由根元素，对外导出，可直接添加到 DOM 树 */
    public element: HTMLElement
    /** 记录当前是否初次命中路由，决定是否执行 `onFirst` 事件。 */
    private isFirstLoad = true

    constructor(config: HandlerConfig<E>) {
        if (!config) throw new Error('config 不能为空')
        if (!config.rule) throw new Error('rule 不能为空')
        if (!config.Loader) throw new Error('Loader 不能为空')
        // 载入路由的基础配置
        this.rule = config.rule
        this.Loader = config.Loader
        this.delayed = config.delayed || false
        this.onFirst = config.onFirst || (async () => { })
        this.onLoad = config.onLoad || (async () => { })
        // 创建页面元素
        this.element = this.Loader()
        this.element.hidden = true
        // 根据 Hash 的变化，自动更新路由状态
        van.derive(() => {
            // 获取当前路由的命中状态
            const match = this.matchHash()
            const hidden = !match
            if (!match) {
                // 未被命中，刷新路由，页面隐藏。
                this.hide()
            } else {
                // 路由命中
                const func = async () => {
                    // 将接收到的路由参数保存起来
                    this.args.splice(0)
                    this.args.push(...match.args)
                    if (this.isFirstLoad) {
                        this.isFirstLoad = false
                        await this.onFirst()
                    }
                    await this.onLoad()
                    if (!this.delayed) this.show()
                }
                func()
            }
        })
    }

    private matchHash(): false | { hash: string, args: string[] } {
        if (this.rule instanceof RegExp) {
            const match = now.val.match(this.rule)
            if (!match) return false
            return { hash: now.val, args: [...match].slice(1) }
        }
        const parts = now.val.split('/').filter(i => i.length > 0)
        if (parts.length < 1) parts.push('home')
        return parts[0] == this.rule ? { hash: now.val, args: parts.slice(1) } : false
    }

    public show() {
        this.element.hidden = false
    }

    public hide() {
        this.element.hidden = true
    }
}

/** 创建一个自动管理路由状态的 DOM 元素 */
export const Route = <E extends HTMLElement = HTMLElement>(config: HandlerConfig<E>) => new Handler(config).element

/**
 * 
 * @param name 需要前往的路由名称，对应字符串类型的 rule
 * @param args 路由参数
 */
export const goto = (name: string, ...args: any[]): void => {
    location.hash = `/${[name, ...args].join('/')}`
}

export default { nowHash, now, Handler, Route, goto }
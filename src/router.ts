import van, { TagFunc } from 'vanjs-core'

export const nowHash = () => location.hash ? location.hash.slice(1) : 'home'

export const now = van.state(nowHash())

window.addEventListener('hashchange', event => {
    now.val = nowHash()
})

export class Handler {
    private rule: string | RegExp
    private args: string[] = []
    private Loader: TagFunc<HTMLElement>
    private delayed = false
    private onFirst: (handler: Handler) => Promise<any>
    private onLoad: (handler: Handler) => Promise<any>
    private hidden = van.state(true)
    public element: HTMLElement
    private isFirstLoad = true

    constructor(config: {
        /** 匹配规则
         * - 如果传入字符串，则只匹配 Hash 以 `/` 分割后的首项，其余项作为 `args`。
         * - 如果传入正则，则匹配正则，捕获分组作为 `args`。
         */
        rule: Handler['rule']
        /** 元素加载器 */
        Loader: Handler['Loader']
        /** 延迟加载页面，需要显示调用 `show()` 方法显示页面。 */
        delayed?: Handler['delayed']
        onFirst?: Handler['onFirst']
        onLoad?: Handler['onLoad']
    }) {
        this.rule = config.rule
        this.Loader = config.Loader
        this.delayed = config.delayed || false
        this.onFirst = config.onFirst || (async () => { })
        this.onLoad = config.onLoad || (async () => { })
        this.element = this.Loader()
        van.derive(() => this.element.hidden = this.hidden.val)
        van.derive(() => {
            if (!this.matchHash()) {
                this.update()
            } else {
                (async _ => {
                    if (this.isFirstLoad) {
                        this.isFirstLoad = false
                        await this.onFirst(this)
                    }
                    await this.onLoad(this)
                    if (!this.delayed) this.update()
                })(now.val)
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

    public update() {
        this.hidden.val = !this.matchHash()
    }
}
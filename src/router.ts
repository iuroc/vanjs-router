import van, { State } from 'vanjs-core'

/** Returns the current value of `location.hash` after the `#/` prefix; returns `home` if empty */
export const nowHash = (): string => location.hash ? location.hash.slice(2) : 'home'

/** Current hash value without the leading #, value provided by `nowHash()` */
export const now: State<string> = van.state(nowHash())

window.addEventListener('hashchange', () => {
    now.val = nowHash()
})

/** Configuration options for initializing a route handler */
export type HandlerConfig<E extends HTMLElement = HTMLElement> = {
    /** Matching rule for the current route
     * - If a string is provided, matches the first segment of the Hash split by `/`, the rest are `args`.
     * - If a RegExp is provided, it matches the regex and captures groups as `args`.
     * 
     * Example:
     * ```ts
     * { rule: 'about' }
     * { rule: /list_(\d+)/ }
     * ```
     */
    rule: Handler<E>['rule']
    /** Loader function to build the current route page */
    Loader: Handler<E>['Loader']
    /** Lazy load the page; requires explicitly calling `show()` to display the page */
    delayed?: Handler<E>['delayed']
    /** Event triggered on first route match, executed before `onLoad` */
    onFirst?: Handler<E>['onFirst']
    /** Event triggered on route match, executed after awaiting `onFirst()` */
    onLoad?: Handler<E>['onLoad']
}

/** Route handler instance */
export class Handler<E extends HTMLElement = HTMLElement> {
    private rule: string | RegExp
    /** Route parameters received after the current route is matched */
    public args: string[] = []
    private Loader: (this: Handler<E>) => E
    private delayed = false
    private onFirst: (this: Handler<E>) => any
    private onLoad: (this: Handler<E>) => any
    /** Root element of the route, exported publicly and can be directly added to the DOM */
    public element: E
    /** Tracks whether this is the first time the route is matched to determine if `onFirst` should run */
    private isFirstLoad = true

    constructor(config: HandlerConfig<E>) {
        if (!config) throw new Error('config cannot be empty')
        if (!config.rule) throw new Error('rule cannot be empty')
        if (!config.Loader) throw new Error('Loader cannot be empty')
        // Load basic route configuration
        this.rule = config.rule
        this.Loader = config.Loader
        this.delayed = config.delayed || false
        this.onFirst = config.onFirst || (async () => { })
        this.onLoad = config.onLoad || (async () => { })
        // Create the page element
        this.element = this.Loader()
        this.element.hidden = true
        // Auto update route state on hash changes
        const func = async () => {
            // Check if the current route matches this handler's rule
            const match = this.matchHash()
            if (!match) {
                // Not matched, hide the page element
                this.hide()
            } else {
                // Route matched
                // Save the received route parameters
                this.args.splice(0) // clear old arguments
                this.args.push(...match.args)
                if (this.isFirstLoad) {
                    this.isFirstLoad = false
                    await this.onFirst()
                }
                await this.onLoad()
                if (!this.delayed) this.show()
            }
        }
        window.addEventListener('hashchange', func)
        func()
    }

    /** Check if the current Hash matches this route's rule */
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

    /** Show the route element */
    public show() {
        this.element.hidden = false
    }

    /** Hide the route element */
    public hide() {
        this.element.hidden = true
    }
}

/** Create a DOM element that automatically manages route state */
export const Route = <E extends HTMLElement = HTMLElement>(config: HandlerConfig<E>): E => new Handler(config).element

/**
 * Navigate to a specified hash route
 * @param name Route name to navigate to, corresponds to a string-type rule
 * @param args Route parameters
 */
export const goto = (name: string, ...args: any[]): void => {
    location.hash = name == 'home' && args.length == 0 ? '' : `/${[name, ...args].join('/')}`
}

/**
 * Redirect from one route to another
 * @param from Source route rule, used as the `rule` property
 * @param to Target route rule, used to call `goto` for navigation
 */
export const redirect = (from: string | RegExp, to: string) => {
    Route({
        rule: from,
        Loader: van.tags.div,
        onLoad() {
            goto(to)
        },
    })
}
import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'

const { button, div, h2, input, p } = van.tags

const Home = () => {
    const num = van.state(0)
    return Route({ name: 'home' },
        h2('Home'),
        div({ style: 'margin-bottom: 20px;' },
            button({
                onclick() {
                    routeTo('about')
                }
            }, 'Go To About'),
        ),
        div(
            button({
                onclick() {
                    num.val--
                }
            }, '-'),
            input({
                style: 'width: 100px;',
                value: num, oninput(event) {
                    const target = event.target as HTMLInputElement
                    num.val = parseInt(target.value)
                }
            }),
            button({
                onclick() {
                    num.val++
                }
            }, '+'),
            button({
                onclick() {
                    routeTo('showNum', [num.val.toString()])
                }
            }, 'Show Num')
        )
    )
}

const About = () => {

    return Route({ name: 'about' },
        h2('About'),
        p('This is a great site!'),
        button({
            onclick() {
                routeTo('home')
            }
        }, 'Back To Home')
    )
}

const ShowNum = () => {
    const num = van.state(0)
    return Route({
        name: 'showNum',
        onLoad(route) {
            num.val = parseInt(route.args[0])
        }
    },
        h2('Show Num'),
        h2({ style: 'color: red;' }, num),
        button({
            onclick() {
                routeTo('home')
            }
        }, 'Back To Home')
    )
}

van.add(document.body, Home(), About(), ShowNum())
import router from './router'
import van from 'vanjs-core'

Object.defineProperty(window, 'router', { value: router })
Object.defineProperty(window, 'van', { value: van })
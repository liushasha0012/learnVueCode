/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep { // Dep这个类主要是建立了数据和watcher之间的桥梁
  static target: ?Watcher; // Dep的静态属性，是一个全局的watcher，表示当前正在渲染的watcher
  id: number;
  subs: Array<Watcher>; // 订阅数据变化的watcher都会保存到subs中（也就是所谓的订阅者）

  constructor () {
    this.id = uid++
    this.subs = [] // 所有的watcher
  }

  addSub (sub: Watcher) {
    this.subs.push(sub) // 把watcher添加到subs，相当于这个watcher是数据的一个订阅者
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null // 静态属性，当前正在渲染的watcher
const targetStack = []  // 定义了一个栈，用来存放当前正在渲染的watcher

export function pushTarget (_target: ?Watcher) {
  // 将当前渲染的watcher保存到临时栈中，然后再把传进来的watcher赋值给Dep.target
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}

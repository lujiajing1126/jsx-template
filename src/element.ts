/// <reference path="../typings/tsd.d.ts" />
import * as _ from 'lodash'
/**
 * VirtualElement
 */
import { default as BaseObject } from  './object'
import { Dictionary } from 'ds'

enum TagName {
    DIV,
    P,
    TABLE,
    SPAN,
    I,
    A,
    UL,
    LI
}

interface IVirtualElement {
    properties: Dictionary<string>
    tagName: string
    parentNode: IVirtualElement
    childNodes: Array<string|VirtualElement>
    key: string|number
    count: number
    render(): HTMLElement;
}
class VirtualElement extends BaseObject implements IVirtualElement {
    parentNode: IVirtualElement
    childNodes: Array<string|VirtualElement>
    properties: Dictionary<string>
    tagName: string
    key: string|number = NaN
    count: number
    constructor(tagName: TagName,params: Dictionary<string>,children?: Array<string|VirtualElement>) {
        super()
        this.tagName = TagName[tagName].toLocaleLowerCase()
        this.properties = params
        this.childNodes = children
        if (params['key']) {
            this.key = params['key']
        }
        
        var count = 0
        _.each(this.childNodes,(child,index) => {
            if (child instanceof VirtualElement) {
                count += child.count
            }
            count ++
        })
        
        this.count = count
    }
    render() {
        var el = document.createElement(this.tagName)
        for (let propName in this.properties) {
            el.setAttribute(propName,this.properties[propName])
        }
        var children = this.childNodes || []
        for (let child of children) {
            let childEl: Node = (child instanceof VirtualElement) ? child.render() : document.createTextNode(child)
            el.appendChild(childEl)
        }
        return el
    }
}

export default VirtualElement
export { TagName }
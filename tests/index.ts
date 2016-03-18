import { default as VirtualElement,TagName } from '../src/element'
import { diff } from '../src/diff'
var ul = new VirtualElement(TagName.UL, {id: 'list',key: 'list1'}, [
  new VirtualElement(TagName.LI, {class: 'item',key: 'item1'}, ['Item 1']),
  new VirtualElement(TagName.LI, {class: 'item',key: 'item2'}, ['Item 2']),
  new VirtualElement(TagName.LI, {class: 'item',key: 'item3'}, ['Item 3'])
])

var ul2 = new VirtualElement(TagName.UL, {id: 'list',key: 'list1'}, [
  new VirtualElement(TagName.LI, {class: 'item',key: "item1"}, ['Item 1']),
  new VirtualElement(TagName.LI, {class: 'item',key: "item2"}, ['Item 2']),
  new VirtualElement(TagName.LI, {class: 'item',key: "item5"}, ['Item 5'])
])

console.log(diff(ul,ul2))
console.log(ul.render())
document.body.appendChild(ul.render())
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../lib/list-diff2.d.ts" />
import { default as VirtualElement } from './element'
import { Dictionary, NumberKeyedDictionary } from './ds'
import * as _ from 'lodash'
import { default as listDiff } from 'list-diff2'

enum DiffType {
    REPLACE,
    REORDER,
    PROPS,
    TEXT
}

interface DiffInterface {
    type: DiffType
    content?: string
    node?: VirtualElement|string
    props?: Dictionary<string>
    moves?: any
}

function diffProps(oldNode: VirtualElement,newNode: VirtualElement): Dictionary<string> {
  var count = 0
  var oldProps = oldNode.properties
  var newProps = newNode.properties
  
  var propsPatches: Dictionary<string> = {}
  
  for (let key in oldProps) {
      let value = oldProps[key]
      if(newProps[key] !== value) {
          count ++
          propsPatches[key] = newProps[key]
      }
  }
  
  for (let key in newProps) {
      let value = newProps[key]
      if (!oldProps.hasOwnProperty(key)) {
          count++
          propsPatches[key] = newProps[key]
      }
  }
  
  if (count === 0) {
      return null
  }
  
  return propsPatches
  
}

function isIgnoreChildren (node: VirtualElement): boolean {
  return (node.properties && node.properties.hasOwnProperty('ignore'))
}

function dfsWalk (oldNode: VirtualElement|string, newNode: VirtualElement|string, index: number, patches: NumberKeyedDictionary<Array<DiffInterface>>) {
  // 对比oldNode和newNode的不同，记录下来
  var currentPatch: Array<DiffInterface> = []
  if(newNode === null) {
      // Do Nothing, old node will be replaced in the final else-clause
  } else if(_.isString(oldNode) && _.isString(newNode)) {/* Text Content Replace */
      // both string
      if(newNode !== oldNode) {
          console.log(`[INFO] ${index} diff: type - TEXT`)
          currentPatch.push({type: DiffType.TEXT, content: newNode })
      }
  // type cast, check props
  } else if (oldNode instanceof VirtualElement && newNode instanceof VirtualElement && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // Diff Props
      var propsDiff: Dictionary<string> = diffProps(oldNode,newNode)
      if(propsDiff) {
          currentPatch.push({type: DiffType.PROPS, props: propsDiff})
      }
      // Diff children. If the node has a `ignore` property, do not diff children
      if (!isIgnoreChildren(newNode)) {
          diffChildren(oldNode.childNodes, newNode.childNodes, index, patches, currentPatch)
      }
  } else {
      console.log(`[INFO] ${index} diff: type - REPLACE`)
      // old node is totally different from the new one
      currentPatch.push({ type: DiffType.REPLACE, node: newNode })
  }
  if (currentPatch.length) {
      patches[index] = currentPatch
  }
}

// 遍历子节点
function diffChildren (oldChildren: Array<VirtualElement|string>, newChildren: Array<VirtualElement|string>, index: number, patches: NumberKeyedDictionary<Array<DiffInterface>>,currentPatch: Array<DiffInterface>) {
  var diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children
  
  if (diffs.moves.length) {
    var reorderPatch = { type: DiffType.REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }
  
  var leftNode: VirtualElement|string = null
  var currentNodeIndex = index
  _.each(oldChildren, (child, i) => {
    var newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode instanceof VirtualElement && leftNode.count) // 计算节点的标识
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches) // 深度遍历子节点
    leftNode = child
  })
}

export function diff(oldTree: VirtualElement, newTree: VirtualElement): NumberKeyedDictionary<Array<DiffInterface>> {
    var index = 0
    var patches: NumberKeyedDictionary<Array<DiffInterface>> = {}
    dfsWalk(oldTree,newTree,index,patches)
    return patches
}
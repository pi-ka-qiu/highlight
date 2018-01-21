import {MarkRange} from './MarkRange'
import {classList} from '@ge-ge/utils'

export default class Mark {
    static PREFIX = 'mark-highlight-'
    static START = Mark.PREFIX + 'start'
    static END = Mark.PREFIX + 'end'
    static ID = 0
    range: Range
    backup: Node

    constructor(range: Range) {
        this.range = range
        this.backup = range.commonAncestorContainer.cloneNode(true)
        console.log(this.backup)
    }

    /**
     * @description 高亮选中的区间
     */
    public mark() {

        Mark.markID(this.range.startContainer, Mark.START + Mark.ID)
        Mark.markID(this.range.endContainer, Mark.END + Mark.ID)
        let new_range_list = MarkRange.splitRange(this.range)
        new_range_list.forEach((new_range) => {
            let docFragment = new_range.range.extractContents()
            if (new_range.id === 'center') {
                let start = docFragment.querySelector('.' + Mark.START + Mark.ID)
                let end = docFragment.querySelector('.' + Mark.END + Mark.ID)
                if (start && end) Mark.highLight(docFragment, start, end)
            } else {
                Mark.highLight(docFragment)
            }
            new_range.range.insertNode(docFragment)
        })
        Mark.ID++
    }

    /** TODO: 必须解决事件失效的问题
     * @description 恢复到没有高亮之前的样子
     */
    public reset() {
        if (this.range.commonAncestorContainer.parentNode) {
            let parent = this.range.commonAncestorContainer.parentNode
            parent.replaceChild(this.backup, this.range.commonAncestorContainer)   // 这种写法会使dom元素上通过addEventListener添加的事件失效
        }
    }

    /**
     * @description 为一个节点添加class名,并且返回被添加的node
     * @param {Element} ele
     * @param {string} id
     */
    static markID(ele: Node, id: string) {
        let r = function (node: Node) {
            if (Mark.isText(node) && node.parentNode) {
                r(node.parentNode)
            } else {
                let class_list = new classList(<Element>node)
                class_list.addClass(id)
            }
        }
        r(ele)
    }


    static isText(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return true
        }
        return false
    }

    /**
     *
     * @param {Node} ele   高亮的元素
     * @param {Node} start 开始高亮的元素
     * @param {Node} end   结束高亮的元素
     * @description 使传入的Node节点高亮，
     */
    static highLight(ele: Node, start?: Node, end?: Node) { //ele 为text节点或者document
        let node = ele
        let flag = start ? false : true
        let recursion = function (node: Node) {
            if (node.nodeName === 'MARK') return
            if (end && node === end) {
                flag = false
            }
            if (node.hasChildNodes()) {
                // NodeList is not an Array,
                for (let i = 0; i < node.childNodes.length; i++) {
                    recursion(node.childNodes[i]);
                }
            } else {
                if (flag && node.nodeType === Node.TEXT_NODE && node.textContent) {
                    if (node.textContent.trim().length === 0) return
                    Mark.highLightText(<Text>node)
                }
            }
            if (start && node === start) {
                flag = true
            }
        }
        recursion(node)
    }

    /**
     * @param {Text} node     文本节点
     * @param {number} start  开始的位置，默认从0开始
     * @param {number} count  高亮文字的数量，默认为 从开始位置之后的全部文字
     * @description 使TextNode高亮
     */
    static highLightText(node: Text, start = 0, count?: number) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            if (node.textContent.trim().length === 0) return
            count = count || node.textContent.trim().length - start
            let mark = Mark.getMarkElement(node, start, count)  // 生成highlight的元素
            let range = document.createRange()
            range.setStart(node, start)
            range.setEnd(node, start + count)             // TODO：把选取内的文字移入mark，而不是删除
            range.deleteContents()                              // 删除选中的文字，之后插入高亮元素
            if (mark) range.insertNode(mark)
            range.detach()
        }
    }

    /**TODO: 应该改成接受一个string类型的参数，直接返回 mark element
     * @description 返回高亮的mark Element
     * @param {Node} node
     * @param {number} start 开始的位置
     * @param {number} count 文字长度
     * @returns {Element}
     */
    static getMarkElement(node: Node, start = 0, count?: number) {
        if (!node.textContent) return       // 如果节点内容为空，直接return
        let text: string = node.textContent.trim()
        count = count || text.length - start
        let mark: Element = document.createElement('mark')
        mark.textContent = text.substr(start, count)
        return mark
    }

}
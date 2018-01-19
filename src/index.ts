import {MarkRange} from './MarkRange'
import {classList} from '@ge-ge/utils'
class Mark {
    static PREFIX = 'mark-highlight-'
    static START = Mark.PREFIX + 'start'
    static END = Mark.PREFIX + 'end'
    static ID = 0
    range: Range
    backup: Node
    constructor(range: Range) {
        this.range = range
        this.backup = range.commonAncestorContainer.cloneNode()
    }

    /**
     * @description 高亮选中的区间
     */
    public mark() {

        Mark.markID(this.range.startContainer, Mark.START + Mark.ID)
        Mark.markID(this.range.endContainer, Mark.END + Mark.ID)
        let new_range_list = MarkRange.splitRange(this.range)
        new_range_list.forEach((new_range) => {
            let backup = new_range.range.cloneContents()
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
                    Mark.highLightText(node)
                }
            }
            if (start && node === start) {
                flag = true
            }
        }
        recursion(node)
    }

    static highLightText (node: Node, start = 0, count?: number) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            if (node.textContent.trim().length === 0) return
            count = count || node.textContent.trim().length - start
            let mark = Mark.getMarkElement(node, start, count)
            let range = document.createRange()
            range.setStart(node, start)
            range.setEnd(node,start + count)
            range.deleteContents()
            if (mark) range.insertNode(mark)
            range.detach()
            }
    }

    /**
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

export { Mark }
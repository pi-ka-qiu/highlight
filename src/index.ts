import MarkRange from './markRange'
import HighLight from './highlight'
import {ClassList} from '@ge-ge/utils'

export default class Mark {
    static PREFIX = 'mark--highlight__'
    static START = Mark.PREFIX + 'start'
    static END = Mark.PREFIX + 'end'
    static ID = 0
    range: Range
    highlight: HighLight
    marks: Array<HTMLElement>

    constructor(range: Range) {
        this.range = range
        this.highlight = new HighLight()
        this.marks = []
    }

    /**
     * @description 高亮选中的区间
     */
    public mark() {

        Mark.markID(this.range.startContainer, Mark.START + Mark.ID)  // 标记开始的节点
        Mark.markID(this.range.endContainer, Mark.END + Mark.ID)      //    结束的节点
        let new_range_list = MarkRange.splitRange(this.range)
        new_range_list.forEach((new_range) => {
            let docFragment = new_range.range.extractContents()          // 将选区内的元素移出到documentFragment
            if (new_range.id === 'center') {
                let start = docFragment.querySelector('.' + Mark.START + Mark.ID)
                let end = docFragment.querySelector('.' + Mark.END + Mark.ID)
                console.log(this.range.startContainer)
                if (start && end) {
                    let markNode = this.highlight.highLight(docFragment, start, end)
                    this.marks = this.marks.concat(markNode)
                }
            } else {
                let markNode = this.highlight.highLight(docFragment)
                this.marks = this.marks.concat(markNode)
            }
            new_range.range.insertNode(docFragment)
        })
        Mark.ID++
    }

    /**
     * @description 恢复到没有高亮之前的样子
     */
    public reset() {
        let container = this.range.commonAncestorContainer
        if (container.nodeType === Node.ELEMENT_NODE || container.nodeType === Node.DOCUMENT_NODE) {
            let mark_list = (<Element>container).getElementsByTagName('mark')
            for (let i = mark_list.length - 1; i >= 0; i--) {
                HighLight.reset(mark_list[i])
            }
        }
    }

    /**
     * @description 为一个节点添加class名,并且返回被添加的node
     * @param {Element} ele
     * @param {string} id
     */
    static markID(ele: Node, id: string): Node {
        let r = function (node: Node): Node {
            if (HighLight.isText(node) && node.parentNode) {
                r(node.parentNode)
            } else {
                let class_list = new ClassList(<Element>node)
                class_list.addClass(id)
            }
            return node
        }
        return r(ele)
    }

}

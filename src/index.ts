import MarkRange from './markRange'
import HighLight from './highlight'
import {ClassList} from '@ge-ge/utils'
import MarkElement from './markElement'
export default class Mark {
    static PREFIX = 'mark--highlight__'
    static START = Mark.PREFIX + 'start'
    static END = Mark.PREFIX + 'end'
    static ID = 0
    range: Range                            // range被高亮的区域，在对range之内的node进行处理之后，range对象会改变。
    highlight: HighLight
    marks: Array<MarkElement>               // 高亮后，mark元素集合
    start: Node | null
    end: Node | null
    /**
     * @param {Range} range
     */
    constructor(range: Range) {
        this.range = document.createRange()
        this.highlight = new HighLight()
        this.marks = []
        this.start = null
        this.end = null
        this.mark(range)
    }

    /**
     * @description 高亮选中的区间
     */
    private mark(range:Range) {
        let new_range_list = MarkRange.splitRange(range)            // 分割成3个range
        new_range_list.forEach((new_range) => {
            let docFragment = new_range.range.extractContents()          // 将选区内的元素移出到documentFragment
            // 对docFragment进行处理
            if (new_range.id === 'center' && this.start && this.end) {
                    let markNode = this.highlight.highLight(docFragment, this.start, this.end)
                    this.marks = this.marks.concat(markNode)
            } else {
                let markNode = this.highlight.highLight(docFragment)
                this.marks = this.marks.concat(markNode)
                if (new_range.id === 'start') {
                    this.start = markNode[0].el
                }else if (new_range.id === 'end') {
                    this.end = markNode[0].el
                }
            }
            // 处理完成后插入到对应的range,range被修改没有参考意义
            new_range.range.insertNode(docFragment)
        })
        // 设置高亮后的range
        if (this.start && this.end) {
            this.range.setStartBefore(this.start)
            this.range.setEndAfter(this.end)
        }
        Mark.ID++
    }

    /**
     * @description 恢复到没有高亮之前的样子
     */
    public reset() {
        // TODO 改为根据marks恢复
        for (let mark of this.marks) {
            HighLight.reset(mark.el)
        }
        this.start = this.end =null
        this.marks = []
        this.range.detach()
    }

    /**
     * @description 为一个节点添加class名,并且返回被添加的node
     * @param {Node} ele
     * @param {string} id
     * @returns {Node}
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

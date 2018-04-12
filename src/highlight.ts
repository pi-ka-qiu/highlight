import {ClassList} from '@ge-ge/utils'

export default class Highlight {
    static CLASS_NAME = 'highlight'
    private THEME: string = 'highlight-theme'

    constructor(options?: { className?: string, theme?: string }) {
        if (options) {
            Highlight.CLASS_NAME = options.className || Highlight.CLASS_NAME
            this.THEME = options.theme || this.THEME
        }
    }

    /**
     *
     * @param {HTMLElement} ele
     * @description 将<mark>this is text content</mark> 转为 文字，并插入到原来的位置
     */
    static reset(ele: HTMLElement) {
        if (ele.nodeName === 'MARK' && ele.parentNode) {
            ele.parentNode.textContent = ele.parentNode.textContent
        }
    }


    /**
     *
     * @description 使传入的Node节点高亮
     * @param {Node} ele   高亮的元素
     * @param {Node} start 开始高亮的元素
     * @param {Node} end   结束高亮的元素
     */
    highLight(ele: Node, start?: Node, end?: Node): Array<HTMLElement> { //ele 为text节点或者document
        let node = ele
        let flag = start ? false : true
        let markNode: Array<HTMLElement> = []
        let recursion = (node: Node) => {
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
                    let mark = this.highLightText(<Text>node)
                    markNode.push(mark)
                }
            }
            if (start && node === start) {
                flag = true
            }
        }
        recursion(node)
        return markNode
    }

    /**
     * @description 是否为文本节点
     * @param {Node} node
     * @returns {boolean}
     */
    static isText(node: Node): boolean {
        if (node.nodeType === Node.TEXT_NODE) {
            return true
        }
        return false
    }

    /**
     * @description 使TextNode高亮
     * @param {Text} node     文本节点
     * @param {number} start  开始的位置，默认从0开始
     * @param {number} count  高亮文字的数量，默认为 从开始位置之后的全部文字
     */
    private highLightText(node: Text, start = 0, count?: number): any {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            if (node.textContent.trim().length === 0) return
            count = count || node.textContent.trim().length - start
            let textContent = node.textContent.substr(start, count)
            let mark = this.getMarkElement(textContent)  // 生成highlight的元素
            let range = document.createRange()
            range.setStart(node, start)
            range.setEnd(node, start + count)             // TODO：把选取内的文字移入mark，而不是删除
            range.deleteContents()                              // 删除选中的文字，之后插入高亮元素
            if (mark) range.insertNode(mark)
            range.detach()
            // console.log(mark)
            return mark
        }
    }

    /**
     *
     * @description 返回高亮的mark Element
     * @param {string} text
     * @returns {HTMLElement}
     */
    private getMarkElement(text: string): HTMLElement {
        let content = text.trim()
        let mark: HTMLElement = document.createElement('mark')
        let class_list = new ClassList(mark)
        class_list.addClass(Highlight.CLASS_NAME)       // 添加默认className
        class_list.addClass(this.THEME)            // 添加自定义className
        mark.textContent = content
        return mark
    }

}
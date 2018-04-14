export default class MarkRange {
    /**
     * @description 在firefox上,用户可以有多个range，chrome 只有一个
     * @param {Selection} selection
     * @returns {Array<Range>}
     */
    static getRanges(selection: Selection): Array<Range> {
        let count: number = selection.rangeCount
        let range: Array<Range> = []
        for (let i = 0; i < count; i++) {
            range.push(selection.getRangeAt(i))
        }
        return range
    }

    /**TODO 中间部分range应该不包含开头结尾
     * @description 将Range分成三部分
     * @return Array
     * */
    static splitRange(range: Range) {
        let ranges = []
        let start: Range = document.createRange()
        let center: Range = document.createRange()
        let end: Range = document.createRange()
        // 当开头结尾为同一个元素时
        if (range.startContainer === range.endContainer) {
            start.setStart(range.startContainer, range.startOffset)
            start.setEnd(range.endContainer, range.endOffset)
        } else {
            if (range.startContainer.textContent) {
                start.setStart(range.startContainer, range.startOffset)
                start.setEndAfter(range.startContainer)
            }
            end.setStart(range.endContainer, 0)
            end.setEnd(range.endContainer, range.endOffset)

            center.setStartAfter(range.startContainer)
            center.setEndBefore(range.endContainer)
        }
        if (!center.collapsed) ranges.push({
            id: 'center',
            range: center
        })
        if (!start.collapsed) ranges.push({
            id: 'start',
            range: start
        })
        if (!end.collapsed) ranges.push({
            id: 'end',
            range: end
        })
        return ranges
    }
}

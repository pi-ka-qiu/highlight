export default class MarkRange {
    /**
     * @description 在firefox上,用户可以有多个range，chrome 只有一个
     * @param {Selection} selection
     * @returns {Array<Range>}
     */
    static getRanges(selection: Selection): Array<Range>;
    /**TODO 中间部分range应该不包含开头结尾
     * @description 将Range分成三部分
     * @return Array
     * */
    static splitRange(range: Range): {
        id: string;
        range: Range;
    }[];
}

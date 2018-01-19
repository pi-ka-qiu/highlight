"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MarkRange = /** @class */ (function () {
    function MarkRange() {
    }
    /**
     * @description 在firefox上,用户可以有多个range，chrome 只有一个
     * @param {Selection} selection
     * @returns {Array<Range>}
     */
    MarkRange.getRanges = function (selection) {
        var count = selection.rangeCount;
        var range = [];
        for (var i = 0; i < count; i++) {
            range.push(selection.getRangeAt(i));
        }
        return range;
    };
    /**
     * @descriptionn
     * @return Array
     * */
    MarkRange.splitRange = function (range) {
        var ranges = [];
        var start = document.createRange();
        var center = document.createRange();
        var end = document.createRange();
        // 当开头结尾为同一个元素时
        if (range.startContainer === range.endContainer) {
            start.setStart(range.startContainer, range.startOffset);
            start.setEnd(range.endContainer, range.endOffset);
        }
        else {
            if (range.startContainer.textContent) {
                start.setStart(range.startContainer, range.startOffset);
                start.setEndAfter(range.startContainer);
            }
            end.setStart(range.endContainer, 0);
            end.setEnd(range.endContainer, range.endOffset);
            center.selectNodeContents(range.commonAncestorContainer);
        }
        if (!start.collapsed)
            ranges.push({
                id: 'start',
                range: start
            });
        if (!end.collapsed)
            ranges.push({
                id: 'end',
                range: end
            });
        if (!center.collapsed)
            ranges.push({
                id: 'center',
                range: center
            });
        return ranges;
    };
    return MarkRange;
}());
exports.MarkRange = MarkRange;

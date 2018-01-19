"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MarkRange_1 = require("./MarkRange");
var utils_1 = require("@ge-ge/utils");
var Mark = /** @class */ (function () {
    function Mark(range) {
        this.range = range;
        this.backup = range.commonAncestorContainer.cloneNode();
    }
    /**
     * @description 高亮选中的区间
     */
    Mark.prototype.mark = function () {
        Mark.markID(this.range.startContainer, Mark.START + Mark.ID);
        Mark.markID(this.range.endContainer, Mark.END + Mark.ID);
        var new_range_list = MarkRange_1.MarkRange.splitRange(this.range);
        new_range_list.forEach(function (new_range) {
            var backup = new_range.range.cloneContents();
            var docFragment = new_range.range.extractContents();
            if (new_range.id === 'center') {
                var start = docFragment.querySelector('.' + Mark.START + Mark.ID);
                var end = docFragment.querySelector('.' + Mark.END + Mark.ID);
                if (start && end)
                    Mark.highLight(docFragment, start, end);
            }
            else {
                Mark.highLight(docFragment);
            }
            new_range.range.insertNode(docFragment);
        });
        Mark.ID++;
    };
    /**
     * @description 为一个节点添加class名,并且返回被添加的node
     * @param {Element} ele
     * @param {string} id
     */
    Mark.markID = function (ele, id) {
        var r = function (node) {
            if (Mark.isText(node) && node.parentNode) {
                r(node.parentNode);
            }
            else {
                var class_list = new utils_1.classList(node);
                class_list.addClass(id);
            }
        };
        r(ele);
    };
    Mark.isText = function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return true;
        }
        return false;
    };
    Mark.highLight = function (ele, start, end) {
        var node = ele;
        var flag = start ? false : true;
        var recursion = function (node) {
            if (node.nodeName === 'MARK')
                return;
            if (end && node === end) {
                flag = false;
            }
            if (node.hasChildNodes()) {
                // NodeList is not an Array,
                for (var i = 0; i < node.childNodes.length; i++) {
                    recursion(node.childNodes[i]);
                }
            }
            else {
                if (flag && node.nodeType === Node.TEXT_NODE && node.textContent) {
                    if (node.textContent.trim().length === 0)
                        return;
                    Mark.highLightText(node);
                }
            }
            if (start && node === start) {
                flag = true;
            }
        };
        recursion(node);
    };
    Mark.highLightText = function (node, start, count) {
        if (start === void 0) { start = 0; }
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            if (node.textContent.trim().length === 0)
                return;
            count = count || node.textContent.trim().length - start;
            var mark = Mark.getMarkElement(node, start, count);
            var range = document.createRange();
            range.setStart(node, start);
            range.setEnd(node, start + count);
            range.deleteContents();
            if (mark)
                range.insertNode(mark);
            range.detach();
        }
    };
    /**
     * @description 返回高亮的mark Element
     * @param {Node} node
     * @param {number} start 开始的位置
     * @param {number} count 文字长度
     * @returns {Element}
     */
    Mark.getMarkElement = function (node, start, count) {
        if (start === void 0) { start = 0; }
        if (!node.textContent)
            return; // 如果节点内容为空，直接return
        var text = node.textContent.trim();
        count = count || text.length - start;
        var mark = document.createElement('mark');
        mark.textContent = text.substr(start, count);
        return mark;
    };
    Mark.PREFIX = 'mark-highlight-';
    Mark.START = Mark.PREFIX + 'start';
    Mark.END = Mark.PREFIX + 'end';
    Mark.ID = 0;
    return Mark;
}());
exports.Mark = Mark;

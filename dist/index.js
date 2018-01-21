"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var markRange_1 = require("./markRange");
var highlight_1 = require("./highlight");
var utils_1 = require("@ge-ge/utils");
var Mark = /** @class */ (function () {
    function Mark(range) {
        this.range = range;
        this.highlight = new highlight_1.default();
    }
    /**
     * @description 高亮选中的区间
     */
    Mark.prototype.mark = function () {
        var _this = this;
        Mark.markID(this.range.startContainer, Mark.START + Mark.ID); // 标记开始的节点
        Mark.markID(this.range.endContainer, Mark.END + Mark.ID); //    结束的节点
        var new_range_list = markRange_1.default.splitRange(this.range);
        new_range_list.forEach(function (new_range) {
            var docFragment = new_range.range.extractContents(); // 将选区内的元素移出到documentFragment
            if (new_range.id === 'center') {
                var start = docFragment.querySelector('.' + Mark.START + Mark.ID);
                var end = docFragment.querySelector('.' + Mark.END + Mark.ID);
                console.log(_this.range.startContainer);
                if (start && end)
                    _this.highlight.highLight(docFragment, start, end);
            }
            else {
                _this.highlight.highLight(docFragment);
            }
            new_range.range.insertNode(docFragment);
        });
        Mark.ID++;
    };
    /**
     * @description 恢复到没有高亮之前的样子
     */
    Mark.prototype.reset = function () {
        var container = this.range.commonAncestorContainer;
        if (container.nodeType === Node.ELEMENT_NODE || container.nodeType === Node.DOCUMENT_NODE) {
            var mark_list = container.getElementsByTagName('mark');
            for (var i = mark_list.length - 1; i >= 0; i--) {
                highlight_1.default.reset(mark_list[i]);
            }
        }
    };
    /**
     * @description 为一个节点添加class名,并且返回被添加的node
     * @param {Element} ele
     * @param {string} id
     */
    Mark.markID = function (ele, id) {
        var r = function (node) {
            if (highlight_1.default.isText(node) && node.parentNode) {
                r(node.parentNode);
            }
            else {
                var class_list = new utils_1.classList(node);
                class_list.addClass(id);
            }
            return node;
        };
        return r(ele);
    };
    Mark.PREFIX = 'mark--highlight__';
    Mark.START = Mark.PREFIX + 'start';
    Mark.END = Mark.PREFIX + 'end';
    Mark.ID = 0;
    return Mark;
}());
exports.default = Mark;

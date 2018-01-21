"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var classList_1 = require("@ge-ge/utils/types/classList");
var Highlight = /** @class */ (function () {
    function Highlight(options) {
        this.THEME = 'highlight-theme';
        if (options) {
            Highlight.CLASS_NAME = options.className || Highlight.CLASS_NAME;
            this.THEME = options.theme || this.THEME;
        }
    }
    /**
     *
     * @param {HTMLElement} ele
     * @description 将<mark>this is text content</mark> 转为 文字，并插入到原来的位置
     */
    Highlight.reset = function (ele) {
        if (ele.nodeName === 'MARK' && ele.parentNode) {
            ele.parentNode.textContent = ele.parentNode.textContent;
        }
    };
    /**
     *
     * @description 使传入的Node节点高亮
     * @param {Node} ele   高亮的元素
     * @param {Node} start 开始高亮的元素
     * @param {Node} end   结束高亮的元素
     */
    Highlight.prototype.highLight = function (ele, start, end) {
        var _this = this;
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
                    _this.highLightText(node);
                }
            }
            if (start && node === start) {
                flag = true;
            }
        };
        recursion(node);
    };
    /**
     * @description 是否为文本节点
     * @param {Node} node
     * @returns {boolean}
     */
    Highlight.isText = function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return true;
        }
        return false;
    };
    /**
     * @description 使TextNode高亮
     * @param {Text} node     文本节点
     * @param {number} start  开始的位置，默认从0开始
     * @param {number} count  高亮文字的数量，默认为 从开始位置之后的全部文字
     */
    Highlight.prototype.highLightText = function (node, start, count) {
        if (start === void 0) { start = 0; }
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            if (node.textContent.trim().length === 0)
                return;
            count = count || node.textContent.trim().length - start;
            var textContent = node.textContent.substr(start, count);
            var mark = this.getMarkElement(textContent); // 生成highlight的元素
            var range = document.createRange();
            range.setStart(node, start);
            range.setEnd(node, start + count); // TODO：把选取内的文字移入mark，而不是删除
            range.deleteContents(); // 删除选中的文字，之后插入高亮元素
            if (mark)
                range.insertNode(mark);
            range.detach();
        }
    };
    /**
     *
     * @description 返回高亮的mark Element
     * @param {string} text
     * @returns {HTMLElement}
     */
    Highlight.prototype.getMarkElement = function (text) {
        var content = text.trim();
        var mark = document.createElement('mark');
        var class_list = new classList_1.default(mark);
        class_list.addClass(Highlight.CLASS_NAME); // 添加默认className
        class_list.addClass(this.THEME); // 添加自定义className
        mark.textContent = content;
        return mark;
    };
    Highlight.CLASS_NAME = 'highlight';
    return Highlight;
}());
exports.default = Highlight;

import MarkElement from './markElement';
export default class Highlight {
    static CLASS_NAME: string;
    private THEME;
    /**
     *
     * @param {{className?: string; theme?: string}} options
     */
    constructor(options?: {
        className?: string;
        theme?: string;
    });
    /**
     *
     * @param {HTMLElement} ele
     * @description 将<mark>this is text content</mark> 转为 文字，并插入到原来的位置
     */
    static reset(ele: HTMLElement): void;
    /**
     *
     * @description 使传入的Node节点高亮
     * @param {Node} ele   高亮的元素
     * @param {Node} start 开始高亮的元素
     * @param {Node} end   结束高亮的元素
     */
    highLight(ele: Node, start?: Node, end?: Node): Array<MarkElement>;
    /**
     * @description 是否为文本节点
     * @param {Node} node
     * @returns {boolean}
     */
    static isText(node: Node): boolean;
    /**
     * @description 使TextNode高亮
     * @param {Text} node     文本节点
     * @param {number} start  开始的位置，默认从0开始
     * @param {number} count  高亮文字的数量，默认为 从开始位置之后的全部文字
     */
    private highLightText;
    /**
     *
     * @description 返回高亮的mark Element
     * @param {string} text
     * @returns {HTMLElement}
     */
    private getMarkElement;
}

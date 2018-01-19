declare class Mark {
    static PREFIX: string;
    static START: string;
    static END: string;
    static ID: number;
    range: Range;
    backup: Node;
    constructor(range: Range);
    /**
     * @description 高亮选中的区间
     */
    mark(): void;
    /**
     * @description 为一个节点添加class名,并且返回被添加的node
     * @param {Element} ele
     * @param {string} id
     */
    static markID(ele: Node, id: string): void;
    static isText(node: Node): boolean;
    static highLight(ele: Node, start?: Node, end?: Node): void;
    static highLightText(node: Node, start?: number, count?: number): void;
    /**
     * @description 返回高亮的mark Element
     * @param {Node} node
     * @param {number} start 开始的位置
     * @param {number} count 文字长度
     * @returns {Element}
     */
    static getMarkElement(node: Node, start?: number, count?: number): Element | undefined;
}
export { Mark };

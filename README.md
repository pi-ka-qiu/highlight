
# Overview
使html元素高亮的js库

# Options

可选参数

| Option | Description |
| ----- | ----- |
| theme | 自定义class名，用于修改样式 |


方法

| Method | params | Description |
| ----- | ----- |  ----- |
|mark()|Range|使Range内的元素高亮，返回包含高亮的元素的array|
|reset()|去除高亮|

# Usage
```$xslt
npm i @ge-ge/highlight
```
```JavaScript
import Highlight from '@ge-ge/highlight'
 let range = window.getSelection().getRangeAt(0)
 let highlight = new Highlight({theme: 'custom-className'})
 
 highlight.mark(range)
```


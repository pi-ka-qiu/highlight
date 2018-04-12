
# Overview
使html元素高亮

# Options

可选参数

| Option | Description |
| ----- | ----- |
| Range | 选区 |


方法

| Method | Description |
| ----- | ----- |
|mark()|使元素高亮|
|reset()|去除高亮|

# Usage
```$xslt
npm i @ge-ge/highlight
```
```JavaScript
import Highlight from '@ge-ge/highlight'
 let range = window.getSelection().getRangeAt(0)
 let highlight = new Highlight(range)
 
 highlight.mark()
```


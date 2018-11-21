const cheerio = require('cheerio')

let html ='<ul id="fruits"><li class="apple" >Apple</li ><li class="orange">Orange</li><li class="pear">Pear</li></ul >'

let $ = cheerio.load(html)
let ul = $('ul')
let li = $('li')
let li2 = $('.apple', 'ul')
let li3 = $('a').text()

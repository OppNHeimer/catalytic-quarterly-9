const wrap = (text, width) => {
  let dy, dx
  text.each(function() {
    let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, 
        tspan = text.text(null)
          .append('tspan')
          .attr('dy', '0px')
          .attr('dx', '0px')
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        const lineNum = ++lineNumber
        dy = lineNum == 0 ? 0: lineHeight
        dx = lineNum == 0 ? 0 : -width
 
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text.append('tspan')
          .attr('dy', dy + 'em')
          .attr('dx', dx + 'px')
          .text(word)
      }
    }
  })
}
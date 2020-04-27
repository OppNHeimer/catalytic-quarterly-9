/*
 * drag simulation for nodes
 */
const drag = simulation => {
  const dragstarted  = d => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
    d.cursor = 'grabbing'
  }

  const dragged = d => {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  const dragended = d => {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
    d.cursor = 'grab'
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

/*
 * set up d3 data
 * filter image from text nodes
 */
const root = d3.hierarchy(data)
const links = root.links()
const nodes = root.descendants()
const imageNodes = nodes.filter(node => node.data.img)
const textNodes = nodes.filter(node => !node.data.img)
const height = window.innerHeight - 6
const width = window.innerWidth


const body = d3.select('body')
body.style('margin', '0').style('padding', '0')

/*
 * generate random link distance
 */
const generateDistance = d => {
  const distance = d.target.data.distance
  return distance + (Math.random() * distance)
}

/*
 * set up d3 force
 */
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
  .id(d => d.id)
  .distance(d => generateDistance(d))
  .strength(1))
  .force('charge', d3.forceManyBody().strength(-2000))
  .force('x', d3.forceX())
  .force('y', d3.forceY())

/*
 * zoom controls on container
 */
const handleZoom = () => {
  container.attr('transform', d3.event.transform)
}

/*
 * set up main svg, canvas, links and nodes
 */
const svg = body.append('svg')
  .attr('viewBox', [-width / 2, -height / 2, width, height]).attr('cursor', 'move')
  .call(d3.zoom().on('zoom', handleZoom))

const container = svg.append('g')

const link = container.append('g')
  .attr('stroke', '#999')
  .attr('stroke-opacity', 0.6)
  .selectAll('line')
  .data(links)
  .join('line')

const svgImageNodes = container.append('g')
  .selectAll('image')
  .data(imageNodes)
  .join('image')
  .attr('xlink:href', d => d.data.img)
  .attr('height', 150)
  .attr('width', 150)
  .call(drag(simulation))

const svgTextNodes = container.append('g')
  .selectAll('text')
  .data(textNodes)
  .join('text')
  .text(d => d.data.name)
  .attr('font-family', 'Marion')
  .attr('font-size', d => d.data.size || '40px')
  .attr('fill', 'black')
  .call(wrap, 400)
  .call(drag(simulation))


const zoom = d3.zoom()
  .scaleExtent([1, 40])
  .on('zoom', handleZoom);

/*
 * click handler to center image nodes
 */
let centered
const isCentered = d => d === centered

const handleClick = d => {
  let x, y, k

  if (d && !isCentered(d)) {
    x = d.x
    y = d.y
    k = 4
    centered = d
  } else {
    x = 0
    y = 0
    k = .5
    centered = null
  }

  svg
    .transition()
    .ease(d3.easeCubic).duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.scale(k).translate(-x, -y),
    )
}

/*
 * image nodes behavior
 * enlarge on hover
 * zoom in on click
 */
svgImageNodes
  .on('mouseenter', function() {
    d3.select(this)
      .attr('height', 155)
      .attr('width', 155)
      .raise()
  })
  .on('mouseleave', function() {
    d3.select( this )
      .attr('height', 150)
      .attr('width', 150)
  })
  .on('click', handleClick)

/*
 * breathe life into the long legged beast
 */
simulation.on('tick', () => {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)

  svgImageNodes
    .attr('x', d => d.x - 75)
    .attr('y', d => d.y - 75)
    .attr('cursor', d => d.cursor || 'grab')

  svgTextNodes
    .attr('x', function (d) { 
      const length = d3.select(this).node().getComputedTextLength()
      const offset = length > 400 ? 200 : length / 2
      return d.x - offset 
    })
    .attr('y', d => d.y)
    .attr('cursor', d => d.cursor || 'grab')
})

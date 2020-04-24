
// joe morris png? who's is this? is joe morris an artist with only one pic?
let centered

const drag = simulation => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }
  
  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
  
  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

const root = d3.hierarchy(data)
const links = root.links()
const nodes = root.descendants()
const imageNodes = nodes.filter(node => node.data.img)
const textNodes = nodes.filter(node => !node.data.img)

const generateDistance = d => {
  const distance = d.target.data.distance
  return distance + (Math.random() * distance)
}

const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
  .id(d => d.id)
  .distance(d => generateDistance(d))
  .strength(1))
  .force('charge', d3.forceManyBody().strength(-2000))
  .force('x', d3.forceX())
  .force('y', d3.forceY())

const height = window.innerHeight - 6
const width = window.innerWidth

const body = d3.select('body')
body.style('margin', '0').style('padding', '0')

const zoomActions = () => {
  container.attr('transform', d3.event.transform)
}

const svg = body.append('svg')
  .attr('viewBox', [-width / 2, -height / 2, width, height])
  .call(d3.zoom().on('zoom', zoomActions))

const container = svg.append('g') 

const link = container.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")

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
  .attr('font-size', '40px')
  .attr('fill', 'black')
  .call(drag(simulation))

function zoomed() {
  container.attr("transform", d3.event.transform);
}

const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .on("zoom", zoomed);

function clicked(d) {
  let x, y, k

  if (d && centered !== d) {
    x = d.x 
    y = d.y 
    k = 5
    centered = d
  } else {
    x = 0
    y = 0
    k = .5
    centered = null
  }
 
  container.selectAll("image")
    .classed("active", centered && function(d) { return d === centered })

  svg
    .transition()
    .ease(d3.easeCubic).duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.scale(k).translate(-x, -y),
    )
}


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
  .on('click', clicked)

simulation.on('tick', () => {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)

  svgImageNodes
    .attr('x', d => d.x - 75)
    .attr('y', d => d.y - 75)
  
    svgTextNodes
    .attr('x', d => d.x)
    .attr('y', d => d.y)
})

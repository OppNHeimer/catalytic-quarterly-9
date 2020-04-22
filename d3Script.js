const data = {
  name: "CATALYTIC QUARTERLY",
  children: [
    {
      name: "Andy",
      children: [
        {
          name: "image 1",
          img: "images/Andy/00EB08B2-C477-412C-B751-3DE14727F306.jpeg"
        },
        {
          name: "image 2",
          img: "images/Andy/36FBE2F8-3E91-46EB-87FE-6BED0BCED6D8.jpeg"
        },
        {
          name: "image 3",
          img: "images/Andy/C70E3BA5-9A1F-4248-8E2C-C617CDF5CA69.jpeg"
        },
      ]
    },
    {
      name: "artist 2",
      children: [
        {
          name: "image 1",
          img: "images/Luke/20200301_143621.jpg"
        },
        {
          name: "image 2",
          img: "/Users/maxoppenheimer/Projects/catalytic-quarterly-9/images/Luke/20200301_151602.jpg"
        }
      ]
    },
    {
      name: "artist 3"
    }
  ]
}

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
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
}

const root = d3.hierarchy(data)
const links = root.links()
const nodes = root.descendants()
const imageNodes = nodes.filter(node => node.data.img)
const textNodes = nodes.filter(node => !node.data.img)

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150).strength(1))
  .force("charge", d3.forceManyBody().strength(-1000))
  .force("x", d3.forceX())
  .force("y", d3.forceY())

const height = window.innerHeight - 6
const width = window.innerWidth


const body = d3.select('body')
body.style("margin", "0").style("padding", "0")

const svg = body.append('svg')
  .attr("viewBox", [-width / 2, -height / 2, width, height])

const link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")

const svgImageNodes = svg.append("g")
  .selectAll("image")
  .data(imageNodes)
  .join("image")
  .attr("xlink:href", d => d.data.img)
  .attr("height", 150)
  .attr("width", 150)
  .call(drag(simulation))

const svgTextNodes = svg.append("g")
  .selectAll("text")
  .data(textNodes)
  .join("text")
  .text(d => d.data.name)
  .attr("font-family", "Marion")
  .attr("font-size", "40px")
  .attr("fill", "black")
  .call(drag(simulation))


svgImageNodes.on('mouseenter', () => {
  d3.select(this)
    .attr("height", 155)
    .attr("width", 155);
  })
  .on( 'mouseleave', () => {
    d3.select( this )
      .attr("height", 150)
      .attr("width", 150);
  });

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)

  svgImageNodes
    .attr("x", d => d.x - 75)
    .attr("y", d => d.y - 75)
  
    svgTextNodes
    .attr("x", d => d.x)
    .attr("y", d => d.y)
})

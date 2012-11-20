window.addEventListener('load', function() {
var subtract = function(a, b) {
        var result = [];
        for(var i = 0; i < Math.min(a.length, b.length); i++) {
            result.push(a[i] - b[i]);
        }
        return result;
    },
    data1 = (function getData() {
        var res = [];
        for(var i = 0; i < 500/10; i++) {
            res.push((i*10 + 60 * (i % 2)) % 200)
        }
        return res;
    })(),
    data2 = (function shiftData(data) {
        var res = data.slice();
        res.unshift(0);
        res.pop();
        return res;
    })(data1),
    difference = subtract(data1, data2).map(function(i) {return i+130}),
    g1 = new SawGraph('#graph1', 'steelblue'),
    g2 = new SawGraph('#graph2', 'green'),
    g3 = new SawGraph('#graph3', 'yellow');

    g1.draw(data1);
    g2.draw(data2);
    g3.draw(difference);
});

function SawGraph(selector, color) {
    var container = d3.select(selector);
    this.svg =  container.append('svg');
    this.color = color;
    this.width = container.node().offsetWidth;
    this.height = container.node().offsetHeight;
}
SawGraph.prototype = {
    draw: function(data) {
        var me = this,
        rect = this.svg.selectAll().data(data)
            .enter().append("rect")
            .style('fill', this.color)
            .attr("y", me.height - 100)
            .attr("width", 10)
            .attr("x", function(d,i){return 10*i})
            .attr("height", 100),
        t = rect.transition()
            .duration(750)
            .attr("height", function(d) {return d})
            .attr("y", function(d) {return me.height-d});

    }
};
"use strict";
var WIDTH = 500,
    PULSE_WIDTH = 10,
    RESET_VALUE = 200,
    INCREMENT = 10,
    DELTA = 60;
window.addEventListener('load', function() {
var incrementInput = d3.select('#increment');
    incrementInput.on('change', function() {
        updateData();
        redraw();
    });
var data1,data2,difference,
    redraw = function() {
        g1.draw(data1);
        g2.draw(data2);
        g3.draw(difference);
    },
    updateData = function() {
        INCREMENT = incrementInput.node().value;
        data1 = (function getData() {
                var res = [];
                for(var i = 0; i < WIDTH/PULSE_WIDTH; i++) {
                    res.push((i*INCREMENT  + DELTA * ((i+1) % 2)) % RESET_VALUE)
                }
                return res;
        })();
        data2 = (function shiftData(data) {
                var res = data.slice();
                res.unshift(0);
                res.pop();
                return res;
        })(data1);
        difference = (function subtract(a, b) {
            var result = [];
            for(var i = 0; i < Math.min(a.length, b.length); i++) {
                result.push(a[i] - b[i]);
            }
            return result;
        })(data1, data2).map(function(i) {return (i+200)%200});
    },

    g1 = new SawGraph('#graph1', 'steelblue'),
    g2 = new SawGraph('#graph2', 'green'),
    g3 = new SawGraph('#graph3', 'red');
    updateData();
    g1.init(data1);
    g2.init(data2);
    g3.init(difference);
    redraw();
});

function SawGraph(selector, color) {
    var me = this,
        container = d3.select(selector);
    this.svg =  container.append('svg');
    this.color = color;
    this.width = container.node().offsetWidth;
    this.height = container.node().offsetHeight;
    this.x = function(x) {return x;};
    this.y = function(y) {return me.height - y};

    this.hline = d3.svg.line().x(function(d, i) {
        return me.x(PULSE_WIDTH*i);
    }).y(function() {
            return me.y(me.height/2);
    }).interpolate("linear");
    this.line = function(data) {
        var result = '';
        data.forEach(function(d, i) {
            result += (i===0?'M'+me.x(PULSE_WIDTH*i)+','+me.y(d):'V'+me.y(d))+'H'+me.x(PULSE_WIDTH*(i+1));
        });
        return result;
    };
}
SawGraph.prototype = {
    draw: function(data) {
        this.svg.selectAll('path').transition().duration(750).attr('d', this.line(data));
    },
    init: function(data) {
        this.svg.append("path").attr("d", this.hline(data))
            .style('fill','transparent').style('stroke', this.color)
    }
};
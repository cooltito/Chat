var dataX = [ [ 10, 75 ], [ 20, 20 ], [ 30, 30 ], [ 40, 10 ], [ 50, 9 ],
			[ 60, 50 ] ];
	$(document).ready(function() {
		$("#myinput1").knob({
			angleArc : 120,
			angleOffset : -60,
			thickness : ".2",
			width : "100",
			fgColor : "#66CC66",
			change : function() {
				changeKnob(this, 0);
			}
		});

		$("#myinput2").knob({
			angleArc : 120,
			angleOffset : -60,
			thickness : ".2",
			width : "100",
			fgColor : "#66CC66",
			change : function() {
				changeKnob(this, 1);
			}
		});

		$("#myinput3").knob({
			angleArc : 120,
			angleOffset : -60,
			thickness : ".2",
			width : "100",
			fgColor : "#66CC66",
			change : function() {
				changeKnob(this, 2);
			}
		});

		$("#myinput4").knob({
			angleArc : 120,
			angleOffset : -60,
			thickness : ".2",
			width : "100",
			fgColor : "#66CC66",
			change : function() {
				changeKnob(this, 3);
			}
		});

		$("#myinput5").knob({
			angleArc : 120,
			angleOffset : -60,
			thickness : ".2",
			width : "100",
			fgColor : "#66CC66",
			change : function() {
				changeKnob(this, 4);
			}
		});

		$("#myinput6").knob({
			angleArc : 120,
			angleOffset : -60,
			thickness : ".2",
			width : "100",
			fgColor : "#66CC66",
			change : function() {
				changeKnob(this, 5);
			}
		});
		var linePlot = drawGraph("placeholder1", "line");
		var barPlot = drawGraph("placeholder2", "bar");
		$("#placeholder1").bind("plothover", function(event, pos, item) {
			barPlot.setCrosshair({
				x : pos.x
			});
			$("div[name='tooltip']").remove();
			if (true) {
                    
                    $("#tooltip").remove();
                    var x = pos.x.toFixed(2);
                    var y = calculateY(x,linePlot)
                    var coords = linePlot.pointOffset({x:x,y:y})
                    showTooltip(coords.left, coords.top,
                                "function of " + parseFloat(x).toFixed(2) + " = " + parseFloat(y).toFixed(2), $("#placeholder1"));
                    y = calculateY(x,barPlot)
                    coords = barPlot.pointOffset({x:x,y:y})
                    showTooltip(coords.left, coords.top,
                                "function of " + parseFloat(x).toFixed(2) + " = " + parseFloat(y).toFixed(2), $("#placeholder2"));
            }

  
		});
		
		$("#placeholder1").bind("mouseout", function(){
			$("div[name='tooltip']").remove();
		});

		$("#placeholder2").bind("plothover", function(event, pos, item) {
			linePlot.setCrosshair({
				x : pos.x
			});
			$("div[name='tooltip']").remove();
			if (true) {
                    
                    $("#tooltip").remove();
                    var x = pos.x.toFixed(2);  
                    var y = calculateY(x,barPlot)
                    var coords = barPlot.pointOffset({x:x,y:y})
                    showTooltip(coords.left, coords.top,
                    		"function of " + parseFloat(x).toFixed(2) + " = " + parseFloat(y).toFixed(2),$("#placeholder2"));
                    y = calculateY(x,linePlot)
                    var coords = linePlot.pointOffset({x:x,y:y})
                    showTooltip(coords.left, coords.top,
                    		"function of " + parseFloat(x).toFixed(2) + " = " + parseFloat(y).toFixed(2),$("#placeholder1"));
            }
		});
		
		$("#placeholder2").bind("mouseout", function(){
			$("div[name='tooltip']").remove();
		});

	});

	var drawGraph = function(placeholder, type) {
		var ser = {};
		if (type === "line") {
			ser.lines = {
				show : true,
				fill : true,
				fillColor : "#66CC66"
			};
		} else if (type === "bar") {
			ser.bars = {
				show : true,
				fill : true,
				fillColor : "#66CC66"
			};
		}
		ser.points = {
			show : false
		};
		var plot = $.plot($("#" + placeholder), [ {
			color : "33CC00",
			data : dataX,
			label : "dummyX"
		} ], {
			series : ser,
			grid : {
				hoverable : true,
				clickable : true,
				backgroundColor : null,
				color : "#00FF00",
				show : true
			},
			yaxis : {
				min : 0,
				max : 120
			},
			crosshair : {
				mode : "x",
				color : "#FFFFFF"
			}
		})
		return plot;
	}

	var changeKnob = function(currentObj, num) {
		var fgColor;
		dataX[num][1] = currentObj.cv;
		drawGraph("placeholder1", "line");
		drawGraph("placeholder2", "bar");
		var transform = "";
		if($.browser.webkit){
			transform = "-webkit-transform";
		} else if($.browser.mozilla){
			transform = "-moz-transform";
		}
		degrees = (parseInt(currentObj.cv)*360)/100;
		$("#knobDiv"+num).css(transform, "rotate("+degrees+"deg)");
		if (currentObj.cv < 30) {
			fgColor = "#FFCC11";
		} else if (currentObj.cv >= 30 && currentObj.cv <= 80) {
			fgColor = "#66CC66";
		} else {
			fgColor = "#FF0000";
		}
		num = num + 1;
		$("#myinput" + num).trigger('configure', {
			"fgColor" : fgColor
		}).trigger('change');
	};
	
	var showTooltip = function(x, y, contents, placeholder) {
        $('<div name="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo(placeholder).fadeIn(200);
    };
    
    function calculateY(x, plot) {
                
        var axes = plot.getAxes();
        if (x < axes.xaxis.min || x > axes.xaxis.max)
            return;

        var i, j, dataset = plot.getData();
        for (i = 0; i < dataset.length; ++i) {
            var series = dataset[i];

            // find the nearest points, x-wise
            for (j = 0; j < series.data.length; ++j)
                if (series.data[j][0] > x)
                    break;
            
            // now interpolate
            var y, p1 = series.data[j - 1], p2 = series.data[j];
            if (p1 == null)
                y = p2[1];
            else if (p2 == null)
                y = p1[1];
            else
                y = p1[1] + (p2[1] - p1[1]) * (x - p1[0]) / (p2[0] - p1[0]);

            return y;
        }
    }
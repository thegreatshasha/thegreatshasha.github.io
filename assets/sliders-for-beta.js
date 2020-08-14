var alphaslider = document.getElementById("alpha");
var betaslider = document.getElementById("beta");
var aslider = document.getElementById("a");
var nslider = document.getElementById("n");
function sample_beta(alpha=1, beta=1, n=1000){
  var x = [];
  for (var i = 0; i < 1000; i ++) {
    x[i] = jStat.beta.sample(alpha, beta);
  }
  return x
}

function redraw(){
  var trace_prior = {
      x: sample_beta(alphaslider.value,betaslider.value),
			type: 'histogram',
			histnorm: 'probability',
    	name: 'Prior',
    };
   var trace_posterior = {
      x: sample_beta(alphaslider.value+aslider.value,nslider.value-aslider.value+betaslider.value),
			type: 'histogram',
			histnorm: 'probability',
      name: 'Posterior',
    };
  var data = [trace_prior,trace_posterior];
  var layout = {
  title: "",
  xaxis: {
    range: [0,1]
	},
	yaxis: {
		range: [0,1]
	}
  }
  Plotly.newPlot('graph', data, layout);
}
// Update the current slider value (each time you drag the slider handle)
alphaslider.oninput = function() {
	redraw();
}

betaslider.oninput = function() {
	redraw();
}

aslider.oninput = function() {
	redraw();
}

nslider.oninput = function() {
	redraw();
}

var alphaslider = document.getElementById("alpha");
var betaslider = document.getElementById("beta");
var propslider = document.getElementById("prop");
var nslider = document.getElementById("n");
function sample_beta(alpha=1, beta=1, n=10000){
  console.log(alpha);
  console.log(beta);
  var x = [];
  for (var i = 0; i < n; i ++) {
    x[i] = jStat.beta.sample(alpha, beta);
  }
  return x
}

function redraw(){
  var a = Math.floor((parseInt(propslider.value,10) / 100.0) * parseInt(nslider.value,10));
  var trace_prior = {
      x: sample_beta(parseInt(alphaslider.value,10),parseInt(betaslider.value,10)),
			type: 'histogram',
			histnorm: 'probability',
    	name: 'Prior',
      xbins: {
    	end: 1,
    	size: 0.01,
    	start: 0
    }
    };
   var trace_posterior = {
      x: sample_beta(parseInt(alphaslider.value,10)+a,parseInt(nslider.value,10)-a+parseInt(betaslider.value,10)),
			type: 'histogram',
			histnorm: 'probability',
      name: 'Posterior',
      xbins: {
    	end: 1,
    	size: 0.01,
    	start: 0
    }
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
  document.getElementById("alpha-label").innerHTML = "Alpha "+document.getElementById("alpha").value
	redraw();
}

betaslider.oninput = function() {
  document.getElementById("beta-label").innerHTML = "Beta "+document.getElementById("beta").value
	redraw();
}

propslider.oninput = function() {
  document.getElementById("prop-label").innerHTML = "% Success "+document.getElementById("prop").value
	redraw();
}

nslider.oninput = function() {
  document.getElementById("n-label").innerHTML = "n "+document.getElementById("n").value
	redraw();
}

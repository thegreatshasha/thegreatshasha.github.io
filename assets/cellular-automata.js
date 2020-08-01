// sorry I'm terrible at commenting...
// TODO: commenting

function sum_arr(arr){
    var sum = 0;
    var n = 1;
    if (typeof arr[0] != "number"){
        var n = arr[0].length;
    }
    for (var j =0; j<n;j++){
        for (var i=0;i<arr.length;i++){
            if(n==1){
                sum += arr[i]
            }
            else{
            sum+=arr[j][i]
            }
        }
    }
    return sum;
}

function incase(grid){
    var n = grid.length;
    var G = [n+2];
    for (var i=0; i<n+2;i++){
        G[i] = [n+2];
    }
    for (var i=0;i<n+2; i++){
        for (j=0;j<n+2;j++){
            G[i][j] = 0;
        }
    }
    for (var i=1;i<n+1; i++){
        for (var j=1;j<n+1;j++){
            G[i][j] = grid[i-1][j-1];
        }
    }
    for (var i = 0; i < n; i++){
        G[i+1][0] = grid[i][n-1];
        G[i+1][n+1] = grid[i][0];
    }
    for (var j = 0; j < n; j++){
        G[0][j+1] = grid[n-1][j];
        G[n+1][j+1] = grid[0][j];
    }
    G[0][0] = grid[n-1][n-1];
    G[n+1][0] = grid[0][n-1];
    G[0][n+1] = grid[n-1][0];
    G[n+1][n+1] = grid[0][0];
    return G;
}

function get_3x3_block(grid,i,j){
    var ret = [3];
    for (var k=0;k<3;k++){
        ret[k] = [3];
    }
    ret[0][0] = grid[i-1][j-1];
    ret[1][0] = grid[i][j-1];
    ret[2][0] = grid[i+1][j-1];
    ret[0][1] = grid[i-1][j];
    ret[1][1] = grid[i][j];
    ret[2][1] = grid[i+1][j];
    ret[0][2] = grid[i-1][j+1];
    ret[1][2] = grid[i][j+1];
    ret[2][2] = grid[i+1][j+1];
    return ret;
}

function alive_conway(neighbours){
    var count = sum_arr(neighbours)-neighbours[1][1];
    if(neighbours[1][1] == 1){
        if(count <2){
            return 0;
        }
        if(count == 2 || count == 3){
            return 1;
        }
        if(count >3){
            return 0;
        }
    }
    if(neighbours[1][1] == 0){
        if(count==3)
            return 1;
    }
    return 0;
}

// a class I believe
function Cellular_automaton(grid, size, stage, layer){
        this.grid_matrix = grid;
        this.size = size;
        this.stage = stage;
        this.layer = layer;
        this.update_stage();
        this.steady = 0;
    }

Cellular_automaton.prototype.get_next_grid = function(){
  this.steady=0;
    var G = incase(this.grid_matrix);
    n=G.length;
    for (var i=0;i<n-1;i++){
        for (var j=0; j<n-1;j++){
            if (i != 0 && j != 0){
                neighbours = get_3x3_block(G,i,j);
                var prev = this.grid_matrix[i-1][j-1];
                this.grid_matrix[i-1][j-1] = alive_conway(neighbours);
                if (this.grid_matrix[i-1][j-1] == prev){
                  this.steady++;
                }
            }
        }
    }
    console.log(this.steady)
}

Cellular_automaton.prototype.update_grid = function(){
  for (var i =0; i<this.size; i++){
    for (var j=0; j<this.size; j++){
      var cell = this.stage.find('#cell'+i+'-'+j);
      if (cell[0].fill() == 'black'){
        this.grid_matrix[i][j] = 0;
      }
      if (cell[0].fill() == 'white') {
        this.grid_matrix[i][j] = 1;
      }
    }
  }
}

Cellular_automaton.prototype.black_grid = function(){
  for (var i =0; i<this.size; i++){
    for (var j =0; j<this.size;j++){
      var cell = this.stage.find('#cell'+i+'-'+j);
      cell.fill('black');
    }
  }
}


Cellular_automaton.prototype.update_stage = function(){
  for (var i = 0; i<this.size;i++){
    for (var j = 0; j<this.size;j++){
      var cell = this.stage.find('#cell'+i+'-'+j);
      if (this.grid_matrix[i][j] == 0){
        cell.fill('black');
      }
      if (this.grid_matrix[i][j]==1){
        cell.fill('white');
      }
    }
  }
}

Cellular_automaton.prototype.random_grid = function(){
  for (i=0;i<this.size;i++){
      for (j=0;j<this.size;j++){
          this.grid_matrix[i][j] = Math.floor((Math.random()*2));
      }
    }
}

Cellular_automaton.prototype.set_plus = function(){
  this.black_grid()
  this.update_grid()
  this.grid_matrix[9][9] = 1
  this.grid_matrix[9][10] = 1
  this.grid_matrix[10][9] = 1
  this.grid_matrix[8][9] = 1
  this.grid_matrix[9][8] = 1
  this.update_stage()
}

Cellular_automaton.prototype.get_grid_matrix = function(){
    return this.grid_matrix;
}

Cellular_automaton.prototype.get_steady = function(){
  return this.steady;
}

var size = 20
var cell_size = 15

var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var layer = new Konva.Layer();

var border = new Konva.Rect({
  x: 0,
  y: 25,
  width: cell_size*size,
  height: cell_size*size,
  stroke: 'black',
  strokewidth: 1
});
layer.add(border);


for (var i = 0; i<size; i++){
  for (var j = 0; j<size; j++){
    var cell = new Konva.Rect({
      x: cell_size*i,
      y: 25+cell_size*j,
      width: cell_size,
      height: cell_size,
      fill: 'black',
      id: 'cell'+i+'-'+j
    });

    cell.on('click', function(){
      var fill = this.fill() == 'black' ? 'white' : 'black';
      this.fill(fill);
      layer.draw();
    });

    layer.add(cell);
  }
}

stage.add(layer);

var grid = [];
for (i=0; i<size;i++){
    grid[i] = [size];
}
for (i=0;i<size;i++){
    for (j=0;j<size;j++){
        grid[i][j] = 0;
    }
  }

var G = new Cellular_automaton(grid, size, stage, layer);

var anim = new Konva.Animation(function(frame){
    if (frame.time > 100){
      frame.time=0;
      G.update_grid();
      G.get_next_grid();
      G.update_stage();
      if (G.get_steady() == size*size){
        console.log("s")
        this.stop()
      }
    }
    G.update_grid();
}, layer);

document.getElementById("start").addEventListener('click',function() {
    anim.start();
  }, false);
document.getElementById("stop").addEventListener('click',function() {anim.stop();}, false);
document.getElementById("clear").addEventListener('click',function(){
  G.black_grid();
  anim.start();
});
document.getElementById("example").addEventListener('click',function() {
  anim.stop();
  G.set_plus();
  anim.start();
});
document.getElementById("random").addEventListener('click',function() {
  anim.stop();
  G.random_grid();
  G.update_stage();
  anim.start();
});


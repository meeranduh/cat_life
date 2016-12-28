var width = 688;
var height = 480;
var cell_size = 16;
var max_x = Math.floor(width / cell_size) - 1;
var max_y = Math.floor(height / cell_size) - 1;
var cells = {};
var is_active = true;
var actionButton;
var clearButton;

var anim;
function preload() {
	anim = loadAnimation("assets/cat1.png",
	"assets/cat2.png");
}

function setup() {
	createCanvas(688, 480);
	frameRate(10);

	for(var i = 0; i < 600; i++) {
		createCat(Math.random() * width, Math.random() * height);
	}
	
	actionButton = createButton("Stop");
	actionButton.position(25, 25);
	actionButton.mousePressed(updateAction); 
	
	clearButton = createButton("Clear");
	clearButton.position(100, 25);
	clearButton.mousePressed(clearCats); 
	
}

function updateAction() {
	is_active = !is_active;
	actionButton.html(is_active ? "Stop" : "Go");
}

function clearCats() {
	is_active = false;
	actionButton.html("Go");
	
	// remove all animation and reset cells
	Object.keys(cells).forEach(function(key) {
		cells[key].remove();
	});
	cells = {};
}


function draw() {
	background(50);
	drawSprites();

	if (is_active) {
		var next_gen = {};
		var related = findRelated();
		cells = createNextGen(related);
	}
}

function findRelated() {
	var related = {};
	Object.keys(cells).forEach(function(key) {
		related[key] = key;

		var point = JSON.parse(key);
		var x = point.x;
		var y = point.y;

		var x1 = x - 1 < 0 ? max_x : x - 1;
		var y1 = y - 1 < 0 ? max_y : y - 1;

		var x2 = x + 1 > max_x ? 0 : x + 1;
		var y2 = y + 1 > max_y ? 0 : y + 1;

		// add the 8 points to the related
		var key = JSON.stringify({"x" : x1, "y" : y1});
		related[key] = key;
		key = JSON.stringify({"x" : x1, "y" : y});
		related[key] = key;
		key = JSON.stringify({"x" : x1, "y" : y2});
		related[key] = key;
		key = JSON.stringify({"x" : x, "y" : y1});
		related[key] = key;
		key = JSON.stringify({"x" : x, "y" : y2});
		related[key] = key;
		key = JSON.stringify({"x" : x2, "y" : y1});
		related[key] = key;
		key = JSON.stringify({"x" : x2, "y" : y});
		related[key] = key;
		key = JSON.stringify({"x" : x2, "y" : y2});
		related[key] = key;
	})

	return related;
}

function createNextGen(related) {
	var next_gen = {}

	Object.keys(related).forEach(function(key) {
		var is_alived = cells[key];
		var num_of_neighbours = countNeighbours(key);
		
		// stay alive
		if (is_alived && (num_of_neighbours == 2 || num_of_neighbours == 3)) { // lonely
			next_gen[key] = cells[key];
		} else if (is_alived && (num_of_neighbours < 2 || num_of_neighbours > 3)) { // overpopulated
			cells[key].remove();
		} else if (!is_alived &&  num_of_neighbours == 3) { // reproduced
			var point = JSON.parse(key)
			var x = point.x;
			var y = point.y;
			var cat = createSprite(
					x * cell_size + cell_size / 2, y * cell_size + cell_size / 2, cell_size, cell_size);
			cat.addAnimation("default", anim);
			next_gen[key] = cat;
		}
	});

	return next_gen;
}

function countNeighbours(key) {
	var point = JSON.parse(key)
	var x = point.x;
	var y = point.y;

	var x1 = x - 1 < 0 ? max_x : x - 1;
	var y1 = y - 1 < 0 ? max_y : y - 1;

	var x2 = x + 1 > max_x ? 0 : x + 1;
	var y2 = y + 1 > max_y ? 0 : y + 1;

	neighbours = [];
	neighbours.push({"x" : x1, "y" : y1});
	neighbours.push({"x" : x1, "y" : y});
	neighbours.push({"x" : x1, "y" : y2});
	neighbours.push({"x" : x, "y" : y1});
	neighbours.push({"x" : x, "y" : y2});
	neighbours.push({"x" : x2, "y" : y1});
	neighbours.push({"x" : x2, "y" : y});
	neighbours.push({"x" : x2, "y" : y2});
	
	var count = 0;
	neighbours.forEach(function(point){
		if (cells[JSON.stringify(point)]) {
			count += 1;
		}
	});
		
	return count;
}


function createCat(x, y) {
	var x = Math.floor(x / cell_size);
	var y = Math.floor(y / cell_size);
	var key = JSON.stringify({
		"x" : x,
		"y" : y
	});
	
	if (cells[key]) {
		cells[key].remove();
		delete cells[key];
	} else {
		var cat = createSprite(
				x * cell_size + cell_size / 2, y * cell_size + cell_size / 2, cell_size, cell_size);
		cat.addAnimation("default", anim);
		cells[key] = cat;
	}
}

function mousePressed() {
	var x = Math.floor(mouseX / cell_size);
	var y = Math.floor(mouseY / cell_size);
	var key = JSON.stringify({
		"x" : x,
		"y" : y
	});

	if (cells[key]) {
		cells[key].remove();
		delete cells[key];
	} else {
		var cat = createSprite(
				x * cell_size + cell_size / 2, y * cell_size + cell_size / 2, cell_size, cell_size);
		cat.addAnimation("default", anim);
		cells[key] = cat;
	}

}

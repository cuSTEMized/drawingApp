// Globals
var canvas,
    context,
    canvasWidth,
    canvasHeight,
    outlineImage = new Image(),
    crayonImage = new Image(),
    markerImage = new Image(),
    eraserImage = new Image(),
    clickX = [],
    clickY = [],
    clickDrag = [],
    clickColor = [],
    clickSize = [],
    paint = false,
    curLoadResNum = 0,
    color = 'black',
    radius = 15,
    totalLoadResources = 1,
    outlineImage = new Image();

// Resize the canvas
function resizeCanvas() {
    canvas.width = canvasWidth = window.innerWidth;
    canvas.height = canvasHeight = window.innerHeight;
    redraw();
};

// Clears the canvas.
function clearCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
};

// Adds a point to the drawing array.
// @param x
// @param y
// @param dragging
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(color);
    clickSize.push(radius);
};

function redraw(color, radius){
    context.lineJoin = "round";
    context.imageSmoothingEnabled = true;
    
    for(var i=0; i < clickX.length; i++)
    {
	context.beginPath();
	if(clickDrag[i] && i){
	    context.moveTo(clickX[i-1], clickY[i-1]);
	}else{
	    context.moveTo(clickX[i]-1, clickY[i]);
	}
	context.lineTo(clickX[i], clickY[i]);
	context.closePath();
	
	context.strokeStyle = clickColor[i];
	context.lineWidth = clickSize[i];
	
	// smooth
	//context.shadowColor = clickColor[i];
	//context.shadowBlur = 5;
	
	context.stroke();
    }

    // scale image
    var minSide = Math.min(canvasWidth, canvasHeight-80) // 80 for offset of palette
    var sx, sy;
    if(canvasWidth > canvasHeight) {
	sy = 0;
	sx = (canvasWidth - minSide)/2;
    } else {
	sx = 0;
	sy = (canvasHeight - 80 - minSide * outlineImage.height / outlineImage.width)/2;
    }
    context.drawImage(outlineImage,
		      sx, sy,
		      minSide, minSide * outlineImage.height / outlineImage.width
		     );    
}

// Add mouse and touch event listeners to the canvas
function createUserEvents() {

    var press = function (e) {
 	    // Mouse down location
	    var sizeHotspotStartX,
	    mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
	    mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
	
	    console.log('pressing');
	    paint = true;
	    addClick(mouseX, mouseY, false);
	    redraw(color, radius);
        },
	
	drag = function (e) {	    
	    var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
		mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
	    
	    if (paint) {
		addClick(mouseX, mouseY, true);
		redraw(color, radius);
	    }
	    // Prevent the whole page from dragging if on mobile
	    e.preventDefault();
	},

	release = function () {
	    paint = false;
	},

	cancel = function () {
	    paint = false;
	};
    
    // Add mouse event listeners to canvas element
    canvas.addEventListener("mousedown", press, false);
    canvas.addEventListener("mousemove", drag, false);
    canvas.addEventListener("mouseup", release);
    canvas.addEventListener("mouseout", cancel, false);

    // Add touch event listeners to canvas element
    canvas.addEventListener("touchstart", press, false);
    canvas.addEventListener("touchmove", drag, false);
    canvas.addEventListener("touchend", release, false);
    canvas.addEventListener("touchcancel", cancel, false);
};

// Calls the redraw function after all neccessary resources are loaded.
function resourceLoaded() {
    curLoadResNum += 1;
    if (curLoadResNum >= totalLoadResources) {
	redraw();
	createUserEvents();
    }
};

// Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
function initCanvas() {

    // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    document.getElementById('canvasDiv').appendChild(canvas);
    if (typeof G_vmlCanvasManager !== "undefined") {
	canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d"); // Grab the 2d canvas context
    // Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
    //     context = document.getElementById('canvas').getContext("2d");

    // Load image
    outlineImage.onload = resourceLoaded;
    outlineImage.src = "img/cat.png";
    
    // Ensure images and resources are loaded
    //createUserEvents();
    resourceLoaded();

};


// Globals
var canvas1, canvas2,
    context1, context2,
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
    canvas2.width = canvas1.width = canvasWidth = window.innerWidth;
    canvas2.height = canvas1.height = canvasHeight = window.innerHeight;
    redraw();
};

// Clears the canvas.
function clearCanvas() {
    context1.clearRect(0, 0, canvasWidth, canvasHeight);
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

function redraw(){
    context1.lineJoin = "round";
    context1.imageSmoothingEnabled = true;
    
    for(var i=0; i < clickX.length; i++)
    {
	context1.beginPath();
	if(clickDrag[i] && i){
	    context1.moveTo(clickX[i-1], clickY[i-1]);
	}else{
	    context1.moveTo(clickX[i]-1, clickY[i]);
	}
	context1.lineTo(clickX[i], clickY[i]);
	context1.closePath();
	
	context1.strokeStyle = clickColor[i];
	context1.lineWidth = clickSize[i];
	
	// smooth
	context1.shadowColor = clickColor[i];
	context1.shadowBlur = 5;
	
	context1.stroke();
    }

    // scale image
    var minSide = Math.min(canvasWidth, canvasHeight-80); // 80 for offset of palette
    var sx, sy;
    context2.clearRect(0,0,canvasWidth,canvasHeight); // clear
    if(canvasWidth > canvasHeight) {
	sy = 0;
	sx = (canvasWidth - minSide)/2;
	context2.drawImage(outlineImage,
			   sx, sy,
			   minSide * outlineImage.width/outlineImage.height, minSide
			  );    
    } else {
	sx = 0;
	sy = (canvasHeight - 80 - minSide * outlineImage.height / outlineImage.width)/2;
	context2.drawImage(outlineImage,
			   sx, sy,
			   minSide, minSide * outlineImage.height / outlineImage.width
			  );    
    }
}

// Add mouse and touch event listeners to the canvas
function createUserEvents() {

    var press = function (e) {
 	    // Mouse down location
	    var sizeHotspotStartX,
	    mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
	    mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
	
	    //console.log('pressing');
	    paint = true;
	    addClick(mouseX, mouseY, false);
	    redraw();
        },
	
	drag = function (e) {	    
	    var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
		mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
	    
	    //console.log('dragging');
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
    
    // Add mouse event listeners to canvas2 element since it's the one on top
    canvas2.addEventListener("mousedown", press, false);
    canvas2.addEventListener("mousemove", drag, false);
    canvas2.addEventListener("mouseup", release);
    canvas2.addEventListener("mouseout", cancel, false);
    // Add touch event listeners
    canvas2.addEventListener("touchstart", press, false);
    canvas2.addEventListener("touchmove", drag, false);
    canvas2.addEventListener("touchend", release, false);
    canvas2.addEventListener("touchcancel", cancel, false);
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

    // canvas 2 will be the image layer
    canvas2 = document.createElement('canvas');
    canvas2.setAttribute('width', canvasWidth);
    canvas2.setAttribute('height', canvasHeight);
    canvas2.setAttribute('id', 'layer2');
    canvas2.setAttribute('style', 'z-index: 2');
    document.getElementById('canvasDiv').appendChild(canvas2);

    // canvas 1 will be the drawing layer
    canvas1 = document.createElement('canvas');
    canvas1.setAttribute('width', canvasWidth);
    canvas1.setAttribute('height', canvasHeight);
    canvas1.setAttribute('id', 'layer1');
    canvas1.setAttribute('style', 'z-index: 1');
    document.getElementById('canvasDiv').appendChild(canvas1);

    if (typeof G_vmlCanvasManager !== "undefined") {
	canvas1 = G_vmlCanvasManager.initElement(canvas1);
	canvas2 = G_vmlCanvasManager.initElement(canvas2);
    }
    context1 = canvas1.getContext("2d");
    context2 = canvas2.getContext("2d"); 
    // Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
    //     context = document.getElementById('canvas').getContext("2d");

    resizeCanvas();
    
    // Load image
    outlineImage.onload = resourceLoaded;
    outlineImage.src = "img/cat.png";
    
    // Ensure images and resources are loaded
    //createUserEvents();
    resourceLoaded();

};


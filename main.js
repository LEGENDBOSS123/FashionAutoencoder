var drawCanvas = document.getElementById("drawCanvas");
var aiCanvas = document.getElementById("aiCanvas");
var drawCtx = drawCanvas.getContext("2d");
var aiCtx = aiCanvas.getContext("2d");
aiCtx.imageSmoothingEnabled = false;


var isDrawing = false;

drawCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
});


drawCanvas.addEventListener('mouseup', (e) => {
    isDrawing = false;
});

drawCanvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        var x = e.offsetX,
        y = e.offsetY,
        radius = drawCanvas.width/25;

        var gradient = drawCtx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
        drawCtx.beginPath();
        drawCtx.arc(x, y, radius, 0, 2 * Math.PI);

        drawCtx.fillStyle = gradient;
        drawCtx.fill();
    }
})

function clearCanvas() {
    drawCtx.fillStyle = "black";
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    aiCtx.fillStyle = "black";
    aiCtx.fillRect(0, 0, aiCanvas.width, aiCanvas.height);
}
clearCanvas();

function resizeImageData(ctx, imageData, width, height) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    ctx.scale(width/tempCanvas.width, height/tempCanvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.resetTransform();
}

function getData() {
    var dataCanvas = document.createElement("canvas");
    var dataCtx = dataCanvas.getContext("2d");
    dataCanvas.width = 28;
    dataCanvas.height = 28;
    resizeImageData(dataCtx, drawCtx.getImageData(0,0,drawCanvas.width,drawCanvas.height), 28, 28);
    var data = dataCtx.getImageData(0, 0, dataCanvas.width, dataCanvas.height).data;
    var newdata = [];
    for (var i = 0; i < data.length; i += 4) {
        newdata[i/4] = data[i] / 255;
    }
    return newdata;
}

function setData(x){
    
}

var decoder = new AI(decoderRaw);
var encoder = new AI(encoderRaw);


function forward(x){
    return decoder.predict(encoder.predict(x));
}

function getOutputImage() {
    var data = getData();
    var decoded = forward(data);
    //decoded = data;
    var reshaped = [];
    for (var i of decoded) {
        for(var e = 0;e<3;e++){
            reshaped.push(Math.min(i*255,255));
        }
        reshaped.push(255);
    }
    var image_data = new ImageData(28, 28);
    image_data.data.set(reshaped);
    resizeImageData(aiCtx, image_data, aiCanvas.width, aiCanvas.height);
}


function draw(){
    getOutputImage();
    requestAnimationFrame(draw);
}

draw();
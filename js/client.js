// Initialize client
var Client = {};
Client.socket = io.connect();


/*
* Converts the image currently in the drawing canvas to a grayscale array of length 784
* to represent a 28x28 image. The processed image is then sent to the network for
* testing.
*/
Client.predict = function() {

    // Get the image data from the sketchpad
    var el = $('#sketchpad > canvas');
    var padContext = el[0].getContext('2d');
    var imageData = padContext.getImageData(0, 0, 280, 280);

    // Put the image data from the sketchpad into the hidden canvas
    var hiddenCanvas = document.getElementById("hiddenCanvas");
    var hiddenContext = hiddenCanvas.getContext("2d");
    hiddenContext.putImageData(imageData, 0, 0);

    // Resize the hidden canvas image to 28x28
    var HERMITE = new Hermite_class();
    HERMITE.resample_single(hiddenCanvas, 28, 28);
    imageData = hiddenContext.getImageData(0, 0, 28, 28);
    console.log(imageData);

    // Put resized image onto resized canvas
    var resizedCanvas = document.getElementById('resizedCanvas');
    var resizedContext = resizedCanvas.getContext('2d');
    var image = new Image();
    var dataURL = hiddenCanvas.toDataURL();
    image.onload = function() {
        // Fit resized 28x28 image to fill 280x280 canvas
        resizedContext.clearRect(0, 0, 280, 280);
        resizedContext.drawImage(image,0,0,28,28,0,0,280,280);
    }
    image.src = dataURL;

    // Disable smoothing so pixels are clear
    resizedContext.webkitImageSmoothingEnabled = false;
    resizedContext.mozImageSmoothingEnabled = false;
    resizedContext.imageSmoothingEnabled = false;

/*
    // Get the 28x28 image data from the hidden canvas
    var canvas = document.getElementById("imageCanvas"); 
    var context = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    var imageData = context.createImageData(width, height);
*/  


    // Process each pixel
    var grayscale = [];
    for (var x = 0; x < 28; x++) {
        for (var y = 0; y < 28; y++) {
            var pixels = [];

            /**
            * Convert each RGBA pixel from the canvas to a grayscale
            * equivalent value between [0 - 255], and add all pixels
            * to an array to be used as input for the network.
            */
            var pixelColor = 0;
            var pixelIndex = (x * 28 + y) * 4;
            pixelColor += imageData.data[pixelIndex + 3]; // Alpha
            grayscale.push(pixelColor);
        }

    }
    Client.socket.emit('getPrediction', grayscale);
};


Client.socket.on('prediction', function(result) {
    var confidence = parseFloat(result.confidence * 100).toFixed(2);
    var output = $('<h1></h1>').text('I\'m ' + confidence + '% sure you drew a ' + result.digit + '!');
    $('#result').html(output);
    console.log(result);

    for(var i = 0; i < 10; i++) {
        $('#bar' + i).width((result.outputs[i] * 100) - 5 + '%');
    }
});

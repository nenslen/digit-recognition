$(function() {

    // Initialize canvas for drawing
	var el = document.getElementById('sketchpad');
	var pad = new Sketchpad(el);
	pad.canvas.setAttribute('width', 280);
    pad.canvas.setAttribute('height', 280);
    pad.canvas.style.width = 280 + 'px';
    pad.canvas.style.height = 280 + 'px';
    pad.setLineSize(20);

    // Initialize network values from data in json file
    var network = new Network();
    network.inputLayer.neurons = layers.inputLayer.neurons;
    network.inputLayer.weights = layers.inputLayer.weights;
    network.hiddenLayer1.neurons = layers.hidden1.neurons;
    network.hiddenLayer1.weights = layers.hidden1.weights;
    network.hiddenLayer2.neurons = layers.hidden2.neurons;
    network.hiddenLayer2.weights = layers.hidden2.weights;
    network.outputLayer.neurons = layers.outputLayer.neurons;
    network.outputLayer.weights = layers.outputLayer.weights;


    // Undo the last action on the canvas
    $('#undoButton').click(function() {
    	pad.undo();
    });


    // Redo the last action on the canvas
    $('#redoButton').click(function() {
    	pad.redo();
    });


    // Clears the contents of the canvas
    $('#clearButton').click(function() {
    	pad.clear();
    });


    /**
    * Get's the network's prediction, then shows user the network's prediction, updates the
    * bar chart and small canvas
    */
    function update() {

        // Get user's drawing and resize it to 28x28 pixels
        var drawing = getDrawing();
        var resizedDrawing = resizeDrawing(drawing);

        // Show user how the network sees their drawing
        updateSmallCanvas();

        // Get network's prediction
        var pixels = getPixelValues(resizedDrawing);
        var results = network.getPrediction(pixels);

        // Show user the results
        updatePrediction(results.confidence, results.digit);
        updateBarChart(results.outputs);
    }


    /**
    * Updates the prediction area by showing the network's confidence in its guess
    * @param confidence: How sure the network was with its prediction, as a percentage
    * @param prediction: The digit (0 - 9) that the network guessed
    */
    function updatePrediction(confidence, prediction) {
        confidence = parseFloat(confidence * 100).toFixed(2);
        var output = $('<h1></h1>').text('I\'m ' + confidence + '% sure you drew a ' + prediction + '!');
        $('#result').html(output);
    }


    /**
    * Updates the bar chart to show the user how confident the network was with each digit
    * @param percentages: An array of percentages for each digit
    */
    function updateBarChart(percentages) {
        for(var i = 0; i < 10; i++) {
            $('#bar' + i).width((percentages[i] * 100) - 5 + '%');
        }
    }


    /**
    * Updates the small canvas to show the user how the network sees their drawing. Uses
    * the hidden canvas to get the image data.
    */
    function updateSmallCanvas() {

        // Get image from hidden canvas
        var resizedCanvas = document.getElementById('resizedCanvas');
        var resizedContext = resizedCanvas.getContext('2d');
        var image = new Image();
        var dataURL = hiddenCanvas.toDataURL();


        // Stretch 28x28 image to fill 280x280 canvas
        image.onload = function() {
            resizedContext.clearRect(0, 0, 280, 280);
            resizedContext.drawImage(image,0,0,28,28,0,0,280,280);
        }
        image.src = dataURL;


        // Disable smoothing so pixels are clear
        resizedContext.webkitImageSmoothingEnabled = false;
        resizedContext.mozImageSmoothingEnabled = false;
        resizedContext.imageSmoothingEnabled = false;
    }


    /**
    * Gets the user's drawing from the canvas
    * @return: The user-made drawing currently in the drawing canvas
    */
    function getDrawing() {
        var el = $('#sketchpad > canvas');
        var padContext = el[0].getContext('2d');
        var drawing = padContext.getImageData(0, 0, 280, 280);

        return drawing;
    }


    /**
    * Takes a drawing and returns a resized 28x28 version
    * @param drawing: The drawing to resize
    * @return: A 28x28 pixel version of the input drawing
    */
    function resizeDrawing(drawing) {

        // Put the image into the hidden canvas
        var hiddenCanvas = document.getElementById("hiddenCanvas");
        var hiddenContext = hiddenCanvas.getContext("2d");
        hiddenContext.putImageData(drawing, 0, 0);

        // Resize the hidden canvas image to 28x28
        var HERMITE = new Hermite_class();
        HERMITE.resample_single(hiddenCanvas, 28, 28);
        var resizedDrawing = hiddenContext.getImageData(0, 0, 28, 28);

        return resizedDrawing;
    }


    /**
    * Takes a drawing and returns a 2D array, representing the grayscale values
    * of each pixel.
    * @param drawing: The drawing the process
    * @return: A 2D array of integers from 0 - 255
    */
    function getPixelValues(drawing) {
        var pixels = [];

        // Convert each pixel in the drawing to a grayscale value between 0 - 255
        for (var x = 0; x < 28; x++) {
            for (var y = 0; y < 28; y++) {
                var pixelColor = 0;
                var pixelIndex = (x * 28 + y) * 4;
                pixelColor += drawing.data[pixelIndex + 3]; // Alpha
                pixels.push(pixelColor);
            }
        }

        return pixels;
    }


    // Get network's prediction 60 times per second
    setInterval(update, 17);
});

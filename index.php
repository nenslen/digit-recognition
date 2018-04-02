<!DOCTYPE html>
<?php require '../../../functions.php'; ?>
<html lang="en">
<head>
    <?php drawHead('Neural Network for Handwritten Digits', '../../../'); ?>

    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="js/network.json"></script>
    <script src="js/neuralNet.js"></script>
    <script src="js/controller.js"></script>
    <script src="js/imageResize.js"></script>
    <script src="js/responsiveSketchpad.js"></script>
</head>
<body>
    <?php drawHeader('small'); ?>


    <div class="wrapper wrapper-no-margin-top">
        <div class='section-wrapper'>
            <div class="section">
                <h1 class="section-header top-header">Neural Network for Handwritten Digits</h1>
                <div class="section-content">
                    
                    <div id="canvas-container" class="grid grid-2-1-1">
                        <div id="sketchpad"></div>
                        <div id='resizedCanvasOuter'>
                            <canvas id='resizedCanvas' width="280" height="280"></canvas>
                        </div>
                    </div>

                    <div id="controls" class="grid grid-3-3-3">
                        <button class="button button-blue" id="undoButton">Undo</button>
                        <button class="button button-blue" id="redoButton">Redo</button>
                        <button class="button button-blue" id="clearButton">Clear</button>
                    </div>
                    
                    <div id="result" class="card center"><h1>&nbsp</h1></div>
                    
                    <div id="chart">
                        <div id="bars">
                            <div class="bar"><div class="barLabel">0</div><div class="barValue" id="bar0">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">1</div><div class="barValue" id="bar1">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">2</div><div class="barValue" id="bar2">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">3</div><div class="barValue" id="bar3">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">4</div><div class="barValue" id="bar4">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">5</div><div class="barValue" id="bar5">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">6</div><div class="barValue" id="bar6">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">7</div><div class="barValue" id="bar7">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">8</div><div class="barValue" id="bar8">&nbsp</div></div>
                            <div class="bar"><div class="barLabel">9</div><div class="barValue" id="bar9">&nbsp</div></div>
                        </div>
                    </div>


                    <h1 class="section-header top-header">About</h1>

                    <p>This is a university project that uses a neural network to recognize handwritten digits.
                    Try it out by drawing a digit (0 to 9) in the box above and see if the network can guess which one you drew!</p>
                    

                    <h1 class="section-header top-header">Details</h1>

                    <h2 class="section-header section-header-small">How it works</h2>
                    <p>As you are drawing an image above, the network is constantly analyzing it (about 60 times every second) and "guessing" what digit you are drawing. To do this, your image is resized to 28x28 pixels and then given to the network. The resized image (shown alongside the original) represents how the network sees your drawing.</p>
                    
                    <p>Each time the network looks at your drawing, it will decide how much it looks like each digit (0 - 9). This is represented by the bars above labeled 0 through 9, which show how confident the network is that you drew that number. So for example, if the network is pretty sure that you are drawing a '3', the bar labeled '3' above will be much larger than the other bars.</p>

                    <h2 class="section-header section-header-small">Training</h2>
                    <p>The network was trained using the MNIST database. The MNIST database is a large collection of handwritten digits, which were collected from high school students and Census Bureau employees. It consists of 60,000 images for training and 10,000 images for testing. A sample of what these images look like is shown below. You can find out more on the <a href="http://yann.lecun.com/exdb/mnist/" target="_blank">MNIST Database Website</a>.</p>
                    <div class="grid">
                        <img src="images/mnist.jpeg">
                    </div>
                    

                    <h2 class="section-header section-header-small">Results</h2>
                    <p>When asked to classify all 60,000 training digits in the MNIST database, the network is about 86% accurate. For images that I've drawn, it's right about 75% of the time. This obviously isn't ideal, and couldn't be used in the real world (eg. automatically process checks at a bank). Regardless, I think it's a good first step for entering the world of neural networks, and I'm excited to improve this version in the future.</p>

                    <h2 class="section-header section-header-small">Implementation</h2>
                    <p>I used a NodeJS server to create and train the network. The learned values of the network were saved in a json file so they could be used later. The interface you see here was created using standard web tools (jquery/js/css/html). There are some serious limitations when using javascript for a project like this (mainly speed), but I chose it anyways. The main reason is that I wanted to have a live demo for people to try, and a web-based version let me do that quickly and easily with no issues.</p>
                    
                    <p>For source code, visit the <a href="https://github.com/nenslen/NeuralNetMNIST">github page for this project</a>.</p>
                    
                    <canvas id="hiddenCanvas" width="280" height="280" style="display: none"></canvas>
                </div>
            </div>
        </div>
    </div>

    <?php drawFooter(); ?>
</body>
</html>

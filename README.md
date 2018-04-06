# Digit Recognition
A neural network that can recognize handwritten digits.

## Demo
[Try the demo now!](http://nicolasenslen.com/projects/demos/digit-recognition/)

## Overview
As a digit is being drawn, the network analyzes it about 60 times per second and guesses which digit you are drawing.

## Implementation
The network was trained on a Node server using the MNIST data set. This project is a local version that uses the pre-trained model produced by the Node version. Generally javascript isn't used for machine learning, but creating a demo that people can try by simply going to a web page made javascript a good candidate for this project.

## Results
When asked to classify all 60,000 training digits in the MNIST database, the network is about 86% accurate. For images that I've drawn, it's right about 75% of the time (higher on mobile since drawing with your finger is easier than with a mouse). This obviously isn't ideal, and couldn't be used in the real world (eg. automatically process checks at a bank). Regardless, I think it's a good first step for entering the world of neural networks, and I'm excited to improve this version in the future.

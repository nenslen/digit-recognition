/**
* Nic Enslen
* https://github.com/nenslen
*
* Parts of the code are heavily commented because this is a university
* project. Also, I wanted this to be a resource for future neural net
* projects that I'm able to come back to and reference.
*
* The equations that are referenced can be found in the equations.pdf
* document in the github repository for this project.
*/



/**
* Represents a layer in the network
*/
function Layer() {
	
	/**
	* An array of Neuron objects that represent the neurons in this layer
	*/
	this.neurons = [];

	/**
	* A 2D matrix that represents the weights between the neurons in this layer
	* and the next. It has the form weights[j][k], where j is a neuron
	* in the next layer, and k is a neuron in this layer, meaning that weights[j][k].value
	* is the value of the weight between the two neurons.
	*/
	this.weights = [];

	/**
	* The type of layer this is. Possible values are input, hidden, and output
	*/
	this.layerType;


	/**
	* Initializes the layer by creating neurons and assigning random weights & biases to them
	* @param size: The number of neurons in this layer
	* @param sizeNext: The number of neurons in the next layer
	* @param layerType: The LayerType enum specifying the type of layer (input, hidden, output)
	*/
	this.initialize = function(size, sizeNext, layerType) {
		
		// Set layer type
		this.layerType = layerType;

		// Create neurons
		for(var i = 0; i < size; i++) {
			this.neurons[i] = new Neuron();
		}

		/**
		* We only create weights for input and hidden layers. Output layers have no need
		* for weights since weights represent connections between neurons in this layer
		* and neurons in the next layer.
		*/
		if(this.layerType != LayerType.OUTPUT) {
			for(var i = 0; i < sizeNext; i++) {
				this.weights[i] = [];
				for(var j = 0; j < size; j++) {
					this.weights[i][j] = new Weight();
				}
			}
		}
	}


	/**
	* Activates the neurons in this layer. The weighted sum and activation are calculated
	* and stored at each neuron, as they are needed now during forward propagation and
	* also later for backpropagation.
	* @param input: An array representing the inputs (only used for input layer)
	* @param prevLayer: The previous layer (used for all other layers)
	*/
	this.activate = function(input, prevLayer) {
		
		/**
		* For input layer neurons, the weighted sum is simply the given input value.
		* We don't need to do any special calculations for it. The activation is done the
		* same was as other layers (sigmoid).
		*/
		if(this.layerType == LayerType.INPUT) {
			for(var i = 0; i < input.length; i++) {
				this.neurons[i].weightedSum = input[i];
				this.neurons[i].activation = sigmoid(input[i]); // Equation 2
			}
			return;
		}

		
		/**
		* For hidden and output layers, the weighted sum of a neuron is computed by multiplying the
		* activation of each neuron in the previous layer with its corresponding weight to the neuron.
		* The activation of each neuron is then calculated by applying the activation function (sigmoid) to 
		* the weighted sum of that neuron.
		*/
		for(var i = 0; i < this.neurons.length; i++) {
			this.neurons[i].weightedSum = 0;

			// Equation 1
			for(var j = 0; j < prevLayer.neurons.length; j++) {
				this.neurons[i].weightedSum += prevLayer.neurons[j].activation * prevLayer.weights[i][j].value;
			}

			// Equation 2
			this.neurons[i].activation = sigmoid(this.neurons[i].weightedSum + this.neurons[i].bias);
		}
	}
}


/**
* Represents a neuron in a layer
*/
function Neuron() {
	this.error = 0;
	this.weightedSum = 0;
	this.activation = 0;
	this.bias = Math.random() * .2 - .1;
	this.biasGradient = 0;
}


/**
* Represents a weight between neurons
*/
function Weight() {
	this.value = Math.random() * .2 - .1;
	this.gradient = 0;
}


/**
* Represents the neural network
* @param options: An array of options for the network
*/
function Network() {

	// Initialize layers
	this.inputLayer = new Layer();
	this.hiddenLayer1 = new Layer();
	this.hiddenLayer2 = new Layer();
	this.outputLayer = new Layer();
	this.inputLayer.initialize(784, 16, LayerType.INPUT);
	this.hiddenLayer1.initialize(16, 16, LayerType.HIDDEN);
	this.hiddenLayer2.initialize(16, 10, LayerType.HIDDEN);
	this.outputLayer.initialize(10, 0, LayerType.OUTPUT);


	/**
	* Accepts an input and propagates it forward through the network
	* @param inputs: An array containing the input values for the input layer
	* @return: An array containing the output values of the output layer
	*/
	this.input = function(inputs) {

		// Activate the layers
		this.inputLayer.activate(inputs, 0);
		this.hiddenLayer1.activate(0, this.inputLayer);
		this.hiddenLayer2.activate(0, this.hiddenLayer1);
		this.outputLayer.activate(0, this.hiddenLayer2);

		// Return the output
		var result = [];
		for(var i = 0; i < this.outputLayer.neurons.length; i++) {
			result.push(this.outputLayer.neurons[i].activation);
		}
		return result;
	}


	/**
	* Gets the network's prediction for an input drawing
	* @param inputPixels: The 2D array of input pixels
	* @return: The network's prediction, confidence, and output values
	*/
	this.getPrediction = function(inputPixels) {
		
		// The result object
		var result = {
			digit: 0,
			confidence: 0,
			outputs: 0
		};

		// Get output from network
		var out = this.input(inputPixels);

		// Get the network's prediction
		var digit = 0;
		var maxActivation = 0;
	    for(var j = 0; j < 10; j++) {
	        if(out[j] > maxActivation) {
	            digit = j;
	            maxActivation = out[j];
	        }
	    }
	    result.digit = digit;
	    result.confidence = maxActivation;
	    result.outputs = out;
	    
	    return result;
	}
};


// The sigmoid activation function
function sigmoid(value) {
	return 1 / (1 + Math.pow(Math.E, -value));
}


// The sigmoid prime function
function sigmoidPrime(value) {
	return sigmoid(value) * (1 - (sigmoid(value)));
}

// LayerType enum
var LayerType = Object.freeze({INPUT: 0, HIDDEN: 1, OUTPUT: 2});

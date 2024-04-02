class ACTIVATION_FUNCTIONS {
    static RELU(x) {
        return x > 0 ? x : 0;
    }
    static SIGMOID(x) {
        return 1 / (1 + Math.exp(-x));
    }
    static TANH(x) {
        return Math.tanh(x);
    }
    static LINEAR(x) {
        return x;
    }
    static LEAKY_RELU(x) {
        return x > 0 ? x : 0.01 * x;
    }
    static ELU(x) {
        return x > 0 ? x : Math.exp(x) - 1;
    }
    static SOFTPLUS(x) {
        return Math.log(1 + Math.exp(x));
    }
}

class DERIVATIVE_ACTIVATION_FUNCTIONS {
    static RELU(x) {
        return x > 0 ? 1 : 0;
    }
    static SIGMOID(x) {
        return ACTIVATION_FUNCTIONS.SIGMOID(x) * (1 - ACTIVATION_FUNCTIONS.SIGMOID(x));
    }
    static TANH(x) {
        return 1 - Math.pow(ACTIVATION_FUNCTIONS.TANH(x), 2);
    }
    static LINEAR(x) {
        return 1;
    }
    static LEAKY_RELU(x) {
        return x > 0 ? 1 : 0.01;
    }
    static ELU(x) {
        return x > 0 ? 1 : Math.exp(x);
    }
    static SOFTPLUS(x) {
        return ACTIVATION_FUNCTIONS.SIGMOID(x);
    }
}

class NUERON {
    constructor(options) {
        this.weights = options.weights || new Array(options.number_of_weights).fill(0);
        this.bias = options.bias || 0;
        this.activation_function = options.activation_function || "RELU";
    }
    dot(weights) {
        var sum = 0;
        for (var i = 0; i < this.weights.length; i++) {
            sum += weights[i] * this.weights[i];
        }
        return ACTIVATION_FUNCTIONS[this.activation_function](sum + this.bias);
    }
    copy() {
        return new NUERON({ weights: [...this.weights], bias: this.bias, activation_function: this.activation_function });
    }
}
class AI {
    constructor(options) {
        this.layers = options.layers || [];
        this.activation_functions = options.activation_functions || [];
        this.layer_lengths = options.layer_lengths || [];

        if (this.layers.length == 0) {
            for (var i = 1; i < this.layer_lengths.length; i++) {
                var layer = [];
                for (var j = 0; j < this.layer_lengths[i]; j++) {
                    layer.push(new NUERON({ number_of_weights: this.layer_lengths[i - 1], bias: 0, activation_function: this.activation_functions[i - 1] }));
                }
                this.layers.push(layer);
            }
        }
        else {
            for (var i = 0; i < this.layers.length; i++) {
                for (var j = 0; j < this.layers[i].length; j++) {
                    this.layers[i][j] = new NUERON(this.layers[i][j]);
                }
            }
        }
    }
    feed_forward(layer_index, inputs) {
        var output = [];
        for (var i = 0; i < this.layers[layer_index].length; i++) {
            output.push(this.layers[layer_index][i].dot(inputs));
        }
        return output;
    }
    predict(inputs) {
        var inp = inputs;
        for (var i = 0; i < this.layers.length; i++) {
            inp = this.feed_forward(i, inp);
        }
        return inp;
    }
    mutate(weight_amount, weight_rate, bias_amount, bias_rate) {
        for (var nueron of this.layers.flat()) {
            for (var w in nueron.weights) {
                if (Math.random() < weight_rate) {
                    nueron.weights[w] += (Math.random() - 0.5) * weight_amount;
                }
            }
            if (Math.random() < bias_rate) {
                nueron.bias += (Math.random() - 0.5) * bias_amount;
            }
        }
        return this;
    }
    copy() {
        var layers = [];
        for (var i of this.layers) {
            var layer = [];
            for (var j of i) {
                layer.push(j.copy());
            }
            layers.push(layer);
        }
        var copy = new AI({ layers: layers, activation_functions: [...this.activation_functions], layer_lengths: [...this.layer_lengths] });
        return copy;
    }
    crossOver(other) {
        var myflat = this.copy().layers.flat();
        var otherflat = other.copy().layers.flat();
        var cutIndex = Math.floor(Math.random() * myflat.length);
        for (var i = 0; i < myflat.length; i++) {
            if (i < cutIndex) {
                myflat[i].weights = [...otherflat[i].weights];
                myflat[i].bias = otherflat[i].bias;
            }
            else {
                myflat[i].weights = [...myflat[i].weights];
                myflat[i].bias = myflat[i].bias;
            }
        }
        return this;
    }
    crossOver2(other) {
        var myflat = this.copy().layers.flat();
        var otherflat = other.copy().layers.flat();
        for (var i = 0; i < myflat.length; i++) {
            for (var j in myflat[i].weights) {
                myflat[i].weights[j] = (otherflat[i].weights[j] + myflat[i].weights[j]) / 2;
            }
            myflat[i].bias = (otherflat[i].bias + myflat[i].bias) / 2;
        }
        return this;
    }
}



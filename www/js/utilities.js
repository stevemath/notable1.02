util = {

    parseJWT: function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    },
}

var events = (function () {
    var topics = {};
    var hOP = topics.hasOwnProperty;

    return {
        subscribe: function (topic, listener) {
            // Create the topic's object if not yet created
            if (!hOP.call(topics, topic)) topics[topic] = [];

            // Add the listener to queue
            var index = topics[topic].push(listener) - 1;

            // Provide handle back for removal of topic
            return {
                remove: function () {
                    delete topics[topic][index];
                }
            };
        },
        publish: function (topic, info) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if (!hOP.call(topics, topic)) return;

            // Cycle through topics queue, fire!
            topics[topic].forEach(function (item) {
                item(info != undefined ? info : {});
            });
        }
    };
})();


var filterArray = function (valArr, obs) {

   // var arr = [2, 2, 10, 12, 50, 10, 2, 100, 2, 2, 2, 2, 10, 2, 4, 500, 2, 2, 2, 2, 2, 2, 10, 12, 2, 10, 2, 0, 2, -12, 2, 2, 10, -52, 4, 10, 2, -20, 2, 2]

    //var arrVals = [4, 4, 10, 14, 4, 10, 4, 0, 4, 4,-10, 4, 4, 10, 4, 4, 10, 4, 4, -14, 4, 4, 4, 10, 14, 4, 10, 4, 0, 4, 4, 4, 4, 10, 4, 4, 10, 4, 4, 4, 4]

    

  
    var options = {
        offset: 0,
        stateTransition: 1,
        observation: obs,
        initialCovariance: 40.0,
        processError: 0.01,
        measurementError: 0.0001,
        iterations: valArr.length,
        observationCutoff: 1000
    };


    var arrVals = valArr;

    var stateTransitionMatrix = $M([[options.stateTransition]]),      // A
        controlMatrix = $M([[0]]),                            // B
        observationMatrix = $M([[options.observation]]),          // H
        initialStateEstimate = $M([[options.initialState]]),         // X
        initialCovarianceEstimate = $M([[options.initialCovariance]]),    // P
        processErrorEstimate = $M([[options.processError]]),         // Q
        measurementErrorEstimate = $M([[options.measurementError]]),     // R
        controlVector = $M([[0]]),                            // C
        measurementVector,
        filter = new LinearKalmanFilter(
            stateTransitionMatrix,
            controlMatrix,
            observationMatrix,
            initialStateEstimate,
            initialCovarianceEstimate,
            processErrorEstimate,
            measurementErrorEstimate
        ),

        measuredValues = [],
        filteredValues = [],
        predictedStateValues = [],
        predictionProbabilityValues = [],
        covarianceValues = [],
        gainValues = [],
        innovationValues = [],
        measuredValue,
        filteredValue,
        predictedState,
        predictedProbability,
        covariance,

        i;

    for (i = 0; i < options.iterations; i++) {
        measuredValue = arrVals[i];
        console.log(options.iterations)
        measurementVector = $M([[measuredValue]]);

        filter.predict(controlVector);
        filter.observe(i < options.observationCutoff ? measurementVector : null);
        filter.update();

        filteredValue = filter.getStateEstimate().e(1, 1);

        predictedState = filter.predictedStateEstimate.e(1, 1);
        predictedProbability = filter.predictedProbabilityEstimate.e(1, 1);
        covariance = filter.covarianceEstimate.e(1, 1);
        measuredValues.push(measuredValue);
        filteredValues.push(filteredValue);

        predictedStateValues.push(predictedState);
        predictionProbabilityValues.push(predictedProbability);


       

    }

        window.filter = filter;
        console.log(filteredValues);
        arrfvals = filteredValues.splice(0, 5)
        var arravg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

        console.log(arravg(filteredValues));
        console.log(arravg(arrfvals))

    return (arravg(arrfvals))
}

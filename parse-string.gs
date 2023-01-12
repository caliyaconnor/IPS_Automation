// declare variables from Google Sheet
let riskTolerance = e.values[6];

// In the example below, the function assignScore takes a string variable as an input and assigns a score based on the value of the string. The function uses an if-else statement to check the value of the string, and assigns a corresponding score based on the conditions.

function assignRiskScore(riskTolerance) {
    var score = 0;
    if (stringValue === "a real gambler") {
        score = 4;
    } else if (stringValue === "willing to take risks after completing adequate research") {
        score = 3;
    } else if (stringValue === "Cautious") {
        score = 2;
    } else if (stringValue === "plays it safe, avoids risk") {
        score = 1;
    } else {
        score = 0;
    }
    return score;
}

// Another way to assign scores based on a string value is by using a lookup object, also known as a dictionary, where the keys are the possible string values and the values are the scores.

var scores = {
  "A": 4,
  "B": 3,
  "C": 2,
  "D": 1,
  "F": 0
};

function assignScore(stringValue) {
  return scores[stringValue] || 0;
}

//In this example, the lookup object is defined with the possible values as keys and the corresponding scores as values. Then when calling the function, the value passed as a parameter is used as a key to look up the corresponding score, and if the key is not present in the object, the function return 0 as a default value.

var stringValue = "A";
var score = assignScore(stringValue);
console.log(score); // Output: 4

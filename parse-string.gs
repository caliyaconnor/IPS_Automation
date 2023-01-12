// In this example, the function assignScore takes a string variable as an input and assigns a score based on the value of the string. The function uses an if-else statement to check the value of the string, and assigns a corresponding score based on the conditions.

function assignScore(stringValue) {
    var score = 0;
    if (stringValue === "A") {
        score = 4;
    } else if (stringValue === "B") {
        score = 3;
    } else if (stringValue === "C") {
        score = 2;
    } else if (stringValue === "D") {
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

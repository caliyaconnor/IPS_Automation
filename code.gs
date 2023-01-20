function autoFillIPSTemplateGoogleDoc(e) {
// email subject
const subject = "Your Investment Policy";

// email body
const emailBody = "See attached for your Investment Policy";

// ID for Google Doc which is the template file that is modified by the code
const templateID = '1i4WSnzaTpMchUcjzF85rbRRpWbJ4lFOl_PfDfY13C58'

// ID for the folder that contains the generated IPS files 
const folderID = '1DMfEB-XvlV6QHCyLpq0Z2ft7XjJeX2YB'

// declare variables from Google Sheet
let investorName = e.values[1];
let timeStamp = e.values[0];
let emailID = e.values[2];
let description = e.values[27];

// convert date string into a date format
let date = new Date(timeStamp);
let options = { year: 'numeric', month: 'long', day: 'numeric' };
let formattedDate = date.toLocaleDateString("en-US", options);

  // convert values from column 3 of Google Sheet to string
  const goals = e.values[4].toString();

  // declare goal variables
  let goal1 = ""
  let goal2 = ""
  let goal3 = ""

  //create an array and parse values from CSV format, store them in an array
  goalsArr = goals.split(',')
  if (goalsArr.length >= 1)
    goal1 = goalsArr[0]
  if (goalsArr.length >= 2)
    goal2 = goalsArr[1]
  if (goalsArr.length >= 3)
    goal3 = goalsArr[2]

// assign score to risk tolerance

// the function assignRiskScore takes a string variable as an input and assigns a score based on the value of the string. The function uses an if-else statement to check the value of the string, and assigns a corresponding score based on the conditions.

let questionSix = e.values[5];
let riskTolerance = assignRiskTolerance(assignRiskScore(questionSix));

function assignRiskScore(questionSix) {
    var riskScore = 0;
    if (questionSix === "a real gambler") {
        riskScore = 4;
    } else if (questionSix === "willing to take risks after completing adequate research") {
        riskScore = 3;
    } else if (questionSix === "Cautious") {
        riskScore = 2;
    } else if (questionSix === "plays it safe, avoids risk") {
        riskScore = 1;
    } else {
        riskScore = 0;
    }
    return riskScore;
}

// the function assignRiskTolerance takes the riskScore that was determined based on question responses and converts those values into text that can be logged to the template file

function assignRiskTolerance(riskScore) {
    let riskTolerance;

    if (riskScore === 4) {
        riskTolerance = "high";
    } else if (riskScore === 3) {
        riskTolerance = "medium";
    } else if (riskScore === 2) {
        riskTolerance = "low";
    } else if (riskScore === 1) {
        riskTolerance = "low";
    } else {
        riskTolerance = "medium";
    }
    return riskTolerance;
}

//assign a value to what types of securities are permissible

let securityType;
securityType = riskTolerance === "high" ? "The portfolio should be concentrated in liquid marketable securities but may contain some long-term investments with less liquidity." : "The portfolio should only contain liquid marketable securities.";

//asset allocation
let cash;
let fixedIncome;
let domesticStocks;
let internationalStocks;
let realEstate;

cash = riskTolerance === "high" ? "5%" : "10%";
fixedIncome = riskTolerance === "high" ? "10%" : "50%";
domesticStocks = riskTolerance === "high" ? "65%" : "25%";
internationalStocks = riskTolerance === "high" ? "10%" : "0%"
realEstate = riskTolerance === "high" ? "10%" : "15%";

// assign score to time horizon

let questionFour = e.values[3];
let timeHorizon = assignTimeHorizon(assignTimeHorizon(questionFour));

function assignTimeHorizon(questionFour) {
    var timeScore = 0;
    if (questionFour === "over 71") {
        timeScore = 1;
    } else {
        timeScore = 0;
    }
    return timeScore;
}

// the function assignTimeHorizon takes the riskScore that was determined based on question responses and converts those values into text that can be logged to the template file

function assignTimeHorizon(timeScore) {
    let timeHorizon;

    if (timeScore === 1) {
        timeHorizon = "short-term";
    } else {
        timeHorizon = "long-term";
    }
    return timeHorizon;
}

//determine home market
let index;
let currency;
let benchmark;
let consumer;

let locationAnswer = e.values[29];

index = locationAnswer === "Canada" ? "iShares S&P/TSX 60 Index ETF" : "Vanguard S&P 500 Index ETF";
consumer = riskTolerance === "high" ? "Stocks" : "Consumer Price Index";
currency = locationAnswer === "Canada" ? "The base currency of the portfolio is Canadian dollars." : "The base currency of the portfolio is US dollars.";
benchmark = riskTolerance === "high" ? index : consumer;

//determine review frequency
let reviewFrequency = e.values[23];

//grab the template file ID to modify
  const file = DriveApp.getFileById(templateID);

//grab the Google Drive folder ID to place the modied file into
  var folder = DriveApp.getFolderById(folderID)

//create a copy of the template file to modify, save using the naming conventions below
  var copy = file.makeCopy(investorName + ' Investment Policy', folder);

//modify the Google Drive file
  var doc = DocumentApp.openById(copy.getId());

  var body = doc.getBody();

  body.replaceText('%InvestorName%', investorName);
  body.replaceText('%Date%', formattedDate);
  body.replaceText('%Description%', description);

  body.replaceText('%Goal1%', goal1.trim())
  body.replaceText('%Goal2%', goal2.trim())
  body.replaceText('%Goal3%', goal3.trim())

  body.replaceText('%RiskTolerance%', riskTolerance);
  body.replaceText('%TimeHorizon%', timeHorizon);
  body.replaceText('%SecurityType%', securityType);

  body.replaceText('%Cash%', cash);
  body.replaceText('%FixedInc%', fixedIncome);
  body.replaceText('%Domestic%', domesticStocks);
  body.replaceText('%International%', internationalStocks);
  body.replaceText('%RealEstate%', realEstate);

  body.replaceText('%Currency%', currency);
  body.replaceText('%Benchmark%', benchmark);

  body.replaceText('%Frequency%', reviewFrequency);

  doc.saveAndClose();

//find the file that was just modified, convert to PDF, attach to e-mail, send e-mail
  var attach = DriveApp.getFileById(copy.getId());
  var pdfattach = attach.getAs(MimeType.PDF);
  MailApp.sendEmail(emailID, subject, emailBody, { attachments: [pdfattach] });
}

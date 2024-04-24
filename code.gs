// Defining the point system for each answer
const questionScoring = {
    ageGroup: {
      "18 to 30": { DE: 2, IE: 2, RE: 1 },
      "31 to 40": { DE: 2, IE: 2, RE: 1 },
      "41 to 50": { DE: 1, IE: 1, RE: 1 },
      "51 to 60": { DE: 1, IE: 1, RE: 1 },
      "61 to 70": { FI: 1, CA: 1 },
      "over 71": { FI: 1, CA: 1 }
    },
    investmentGoal: {
      "Save for a down-payment on a home" : {FI: 1, CA: 1},
      "Save for future retirement" : {DE: 1, IE : 1},
      "Create a financial emergency fund" : {CA : 3},
      "Fund my children's education" : {DE: 1, FI : 1},
      "Support for charity" : {DE : 1},
      "Generate retirement income" : {FI : 1, CA : 1},
      "Generate income" : {FI : 1},
      "Support my heirs" : {DE : 1},
      "Other" : {}
    },
    riskDescription: {
      "a real gambler": { DE: 3, IE: 3, RE: 1 },
      "willing to take risks after completing adequate research": {},
      "Cautious": { FI: 1, CA: 1 },
      "plays it safe, avoids risk": { CA: 2 }
    },
    unexpectedInvestment: {
        "Deposit it in a bank account, money market, or CD/GIC": { CA: 1 },
        "Invest in safe, high quality bonds or bond mutual funds": { FI: 1 },
        "Invest in stocks or stock mutual funds": { DE: 1 }
    },
    riskWordAssociation: {
        "Loss": { CA: 1 },
        "Uncertainty": { FI: 1 },
        "Opportunity": { DE: 1, RE: 1},
        "Thrill": { IE: 1 }
    },
    inheritanceInvestment: {
        "Savings account": { CA: 1 },
        "A mutual fund owning stocks & bonds": { FI: 1, DE: 1 },
        "A portfolio of 15 common stocks": { DE: 2 },
        "Commodities like gold, silver, and oil": { RE: 1 }
    },
    stockInvestmentExperience: {
        "very confident": { DE: 2, IE: 1 },
        "neutral": {},
        "nervous": { CA: 1 }
    },
    retiredStatus: {
        "Yes": { FI: 2 },
        "No": { DE: 1, IE: 1, RE: 1 }
    },
    homeownerStatus: {
        "Yes": { RE: -2, DE: 1 },
        "No" : {}
    },
    wealthStatus: {
        "Yes": { DE: 1, IE: 1, RE: 1 },
        "No" : {},
        "Not Sure" : {}
    },
    emergencyFundMonths: {
        "Less than 1 month": { CA: 2 },
        "between 1 and 2 months": { CA: 1.5 },
        "between 2 and 6 months": { CA: 1 },
        "between 6 months and 1 year" : {},
        "More than 1 year" : {}
    },
    returnExpectations: {
        "I don’t care if my portfolio keeps pace with inflation; I just want to preserve my capital and minimize volatility": { CA: 2, FI: 3 },
        "My return should keep pace with inflation, with minimum volatility": { FI: 1, DE: 1 },
        "My return should be slightly more than inflation, with average volatility": {},
        "I want my return to significantly exceed market averages, even if this could mean significant volatility and risking my capital": { IE: 2 }
    },
    healthStatus: {
        "Good": { DE: 1 },
        "Poor": { CA: 1, FI: 1 },
        "Other": {}
    }
};

// Function to autofill IPS Template
function autoFillIPSTemplateGoogleDoc(e) {
  // Email subject
  const subject = "Your Investment Policy";
  // ID for Google Doc template
  const templateID = '1i4WSnzaTpMchUcjzF85rbRRpWbJ4lFOl_PfDfY13C58'
  // ID for the folder that contains the generated IPS files 
  const folderID = '1DMfEB-XvlV6QHCyLpq0Z2ft7XjJeX2YB'

  // Declare variables from Google Sheet
  let investorName = e.values[1];
  let timeStamp = e.values[0];
  let emailID = e.values[2];
  let description = e.values[27];

  // Email body
  const emailBody = "Hello, " + investorName + "!\n\n" +
    "See attached for your Investment Policy.\n\n" +
    "Best regards,\n" +
    "James Dunne\n" +
    "https://markdalefinancialmanagement.com/blog/";

  // Convert date string into a date format
  let date = new Date(timeStamp);
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  let formattedDate = date.toLocaleDateString("en-US", options);

  // Convert values from column 3 of Google Sheet to string
  const goals = e.values[4].toString();

  // Goals can have multiple responses, so split and process each one (for google doc)
  let goalsList = "";
  goalsArr = goals.split(',');
  goalsArr.forEach((goal, index) => {
    goalsList += `• ${goal.trim()}\n`; // Using Unicode bullet point character
  });
  let formattedGoals = goalsList;

  // Declare variables from Google Sheet
  let ageGroupResponse = e.values[3]; 
  let investmentGoalResponse = e.values[4]; 
  let riskDescriptionResponse = e.values[5]; 
  let unexpectedInvestmentResponse = e.values[8]; 
  let riskWordAssociationResponse = e.values[9]; 
  let stockInvestmentExperienceResponse = e.values[17];
  let retiredStatusResponse = e.values[20]; 
  let homeownerStatusResponse = e.values[21]; 
  let wealthStatusResponse = e.values[22]; 
  let emergencyFundMonthsResponse = e.values[25];
  let returnExpectationsResponse = e.values[26]; 
  let healthStatusResponse = e.values[28];
  let inheritanceInvestmentResponse = e.values[14];

  // Asset allocation computation
  // Initialize object to store points for each variable
  let totalPoints = {
    DE: 0,
    IE: 0,
    RE: 0,
    FI: 0,
    CA: 0
  };

  // InvestmentGoals can have multiple responses, so split and process each one (for calculations)
  const investmentGoalsResponse = e.values[4].split(',');
  investmentGoalsResponse.forEach(goal => {
    calculatePoints(goal.trim(), 'investmentGoal');
  });

  // Functino to calculate points for each response
  function calculatePoints(response, questionType) {
    let points = questionScoring[questionType][response];
    if (points) {
      for (let variable in points) {
        totalPoints[variable] += points[variable];
      }
    }
  }

  // Calcualte points for each question
  calculatePoints(ageGroupResponse, 'ageGroup');
  calculatePoints(investmentGoalResponse, 'investmentGoal');
  calculatePoints(riskDescriptionResponse, 'riskDescription');
  calculatePoints(unexpectedInvestmentResponse, 'unexpectedInvestment');
  calculatePoints(riskWordAssociationResponse, 'riskWordAssociation');
  calculatePoints(stockInvestmentExperienceResponse, 'stockInvestmentExperience');
  calculatePoints(retiredStatusResponse, 'retiredStatus');
  calculatePoints(homeownerStatusResponse, 'homeownerStatus');
  calculatePoints(wealthStatusResponse, 'wealthStatus');
  calculatePoints(emergencyFundMonthsResponse, 'emergencyFundMonths');
  calculatePoints(returnExpectationsResponse, 'returnExpectations');
  calculatePoints(healthStatusResponse, 'healthStatus');
  calculatePoints(inheritanceInvestmentResponse, 'inheritanceInvestment');

  // Calculate total points
  let total = Object.values(totalPoints).reduce((acc, val) => acc + val, 0);

  // Calculate relative percentages
  let relativePercentages = {};
  for (let variable in totalPoints) {
    relativePercentages[variable] = (totalPoints[variable] / total) * 100;
  }

  // Display results
  let cash = Math.round(relativePercentages.CA) + "%";
  let fixedIncome = Math.round(relativePercentages.FI) + "%";
  let domesticStocks = Math.round(relativePercentages.DE) + "%";
  let internationalStocks = Math.round(relativePercentages.IE) + "%";
  let realEstate = Math.round(relativePercentages.RE) + "%";

  // Insert the generated chart into the document
  var doc = DocumentApp.openById(templateID);
  var chart = generatePieChart(relativePercentages);
  var base64ImageData = convertChartToBase64(chart);
  insertChartIntoDoc(doc, base64ImageData);

  // Assign score to risk tolerance
  // The function assignRiskScore assigns a score based on the response to question6
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

  // The function assignRiskTolerance takes the riskScore and converts into text that can be logged to the template file
  function assignRiskTolerance(riskScore) {
      let riskTolerance;

      if (riskScore === 4) {
          riskTolerance = "High";
      } else if (riskScore === 3) {
          riskTolerance = "Medium";
      } else if (riskScore === 2) {
          riskTolerance = "Low";
      } else if (riskScore === 1) {
          riskTolerance = "Low";
      } else {
          riskTolerance = "Medium";
      }
      return riskTolerance;
  }

  // Assign a value to what types of securities are permissible
  let securityType;
  securityType = riskTolerance === "High" ? "The portfolio should be concentrated in liquid marketable securities but may contain some long-term investments with less liquidity." : "The portfolio should only contain liquid marketable securities.";

  // Assign score to time horizon
  let questionFour = e.values[3];
  let timeHorizon = assignTimeHorizon(assignTimeHorizon(questionFour));

  // The function assignTimeHorizon assigns a score based on the response to questionFour
  function assignTimeHorizon(questionFour) {
      var timeScore = 0;
      if (questionFour === "over 71") {
          timeScore = 1;
      } else {
          timeScore = 0;
      }
      return timeScore;
  }

  // The function assignTimeHorizon converts the time score into text that can be logged to the template file
  function assignTimeHorizon(timeScore) {
      let timeHorizon;

      if (timeScore === 1) {
          timeHorizon = "Short-term";
      } else {
          timeHorizon = "Long-term";
      }
      return timeHorizon;
  }

  // Determine home market
  let index;
  let currency;
  let benchmark;
  let consumer;

  let locationAnswer = e.values[29];

  index = locationAnswer === "Canada" ? "iShares S&P/TSX 60 Index ETF" : "Vanguard S&P 500 Index ETF";
  consumer = riskTolerance === "High" ? "Stocks" : "Consumer Price Index";
  currency = locationAnswer === "Canada" ? "Canadian" : "American";
  benchmark = riskTolerance === "High" ? index : consumer;

  // Determine review frequency
  let reviewFrequency = e.values[23];

  // Grab the template file ID to modify
  const file = DriveApp.getFileById(templateID);

  // Grab the Google Drive folder ID to place the modied file into
  var folder = DriveApp.getFolderById(folderID)

  // Create a copy of the template file to modify, save using the naming conventions below
  var copy = file.makeCopy(investorName + ' Investment Policy', folder);

  // Modify the Google Drive file
  var doc = DocumentApp.openById(copy.getId());
  var body = doc.getBody();

  // Replace placeholders with actual data
  body.replaceText('%InvestorName%', investorName);
  body.replaceText('%Date%', formattedDate);
  body.replaceText('%Description%', description);

  body.replaceText('%Goals%', formattedGoals);


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
  
  // Find the file that was just modified, convert to PDF, attach to e-mail, send e-mail
  var attach = DriveApp.getFileById(copy.getId());
  var pdfattach = attach.getAs(MimeType.PDF);
  MailApp.sendEmail(emailID, subject, emailBody, { attachments: [pdfattach], name: 'James Dunne'});
}

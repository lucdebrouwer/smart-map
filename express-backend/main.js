const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Returns all journey data in region Eindhoven
// The region code is CXX
async function getJourneyData() {
  const allowedRegionCode = ["CXX"];
  let dataAllRegions = await fetch("http://v0.ovapi.nl/journey/").then(res =>
    res.json()
  );

  // Here is where the magic happens.
  // The data that is retrieved from the api comes in a key value pair
  // <company>_<date>_<public_line_number> : amount_of_stops
  // We need to convert this data to an array in order to filter through the data we need
  let filtered = Object.keys(dataAllRegions).filter(key => {
    /* This was a debugging purpose line whether the object keys are included */
    // console.log(
    //   "my data was: "
    //   key + " and outcome of include was: ",
    //   key.includes(allowedRegionCode)
    // );
    const newData = key.includes(allowedRegionCode);
    return newData;
  });
  return { ...filtered };
}

// We only want the complete data so we have a function that returns the API data when its processed
// the data is returned in a custom data object and sent back to who ever requests the resource
async function getProcessedJourneyData() {
  let data = {};
  try {
    data = await getJourneyData();
  } catch (err) {
    data = {
      error: err.message
    };
  }
  return data;
}
//   let filtered = Object.values(journeyData).filter(key => {
//     //   return (newData = key.includes(allowedLines[i]));
//     // }
//     //for(let index in data) {}

//     // return console.log
//     //   "my data was: ",
//     //   key + " and outcome of include was: ",
//     //   key.includes(allowedLines)
//     // );
//     return newData;
//   });

async function getJourneyLines() {
  const journeyData = await getProcessedJourneyData();
  const lineNumbers = ["400", "401", "402"];
  let newData;
  const data = Object.values(journeyData).filter(key => {
    newData = key;
    //return (newData = key.includes(lineNumbers[i]));
    // if (key.includes(lineNumbers[i])) {
    //   return key;
    // } else {
    //   return { error: "Not found" };
    // }
  });
  let arrToDataObj = { ...newData };
  return arrToDataObj;
  //return Object.values(journeyData); //console.log(typeof filtered, typeof journeyData);

  //return filtered;
}

// Main route that retrieves the journeyData
app.get("/", async (req, res, next) => {
  try {
    const data = await getProcessedJourneyData();
    res.json({ data });
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/journey/lines", async (req, res, next) => {
  try {
    const data = await getJourneyLines();
    res.json({ data });
    next();
  } catch (error) {
    next(error);
  }
});

// Setup our server

// app.listen(process.env.port || 6000, () => {
//   console.log("API listening on port 3000");
// });

app.listen(3000, () => console.log(process.env.port));

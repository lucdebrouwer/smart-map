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

// This function will retrieve all JourneyKeys from Eindhoven
async function getJourneyLines() {
  const journeyData = await getProcessedJourneyData();
  const lineNumbers = [
    "L400",
    "L401",
    "L402",
    "L403",
    "L404",
    "L405",
    "L406",
    "L407"
  ];
  const data = Object.values(journeyData).reduce((acc, key) => {
    lineNumbers.map(n => {
      if (key.includes(n)) {
        acc.push(key);
      }
    });
    return acc;
  }, []);
  let newData = data;
  let arrToDataObj = { ...newData };
  return arrToDataObj;
}

async function getActualsData(journeyLineKeys, lineNumbers) {
  // We need to search through the journeyLineKeys whether the query matches with one of the keys
  const data = Object.values(journeyLineKeys).reduce((acc, key) => {
    // Loop over the lineNumbers
    // if match is found push it into an array
    lineNumbers.map(n => {
      if (key.includes(n)) {
        acc.push(key);
      }
    });
    return acc;
  }, []);
  let newData = data;

  // Use the spread operator to turn an array into an object
  let arrToDataObj = { ...newData };

  // as "https://github.com/skywave/KV78Turbo-OVAPI/wiki/Journey" defines,
  // we need to add a comma seperated list to the fetch call if we want the data for more than one journeykey
  // so we create a new array from the object, loop over the values and join the keys together with a ","
  let arrToDataObjSpliced = Object.keys(arrToDataObj)
    .map(function(k) {
      return arrToDataObj[k];
    })
    .join(",");

  // Retrieve the data we need
  let actualsData = await fetch(
    `http://v0.ovapi.nl/journey/${arrToDataObjSpliced}`
  )
    .then(res => res.json())
    .catch(err => {
      return {
        error: "Something went wrong fetching the actuals data " + err.message
      };
    });
  return actualsData;
}

async function getLineData() {
  const data = await fetch("http://v0.ovapi.nl/line/").then(res => res.json());
  if (data > 0) {
    return data;
  } else {
    return {
      error: "Something went wrong"
    };
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the smart-map API",
    possibleRoutes: [
      "/journey",
      "/journey/eindhoven",
      "/actuals/eindhoven/:journeykey",
      "/lines/",
      "/lines/:region",
      "/lines/:region/:line"
    ]
  });
});

// Main route that retrieves all journeyData keys
app.get("/journey", async (req, res, next) => {
  try {
    const data = await getProcessedJourneyData();
    res.json({ data });
    next();
  } catch (error) {
    res.json({ error: error.message });
    next(error);
  }
});

// Route that retrieves the JourneyKeys from the region Eindhoven [400, 401, 402, 403, 404, 405, 407]
app.get("/journey/eindhoven", async (req, res, next) => {
  try {
    const data = await getJourneyLines();
    res.json({ data });
    next();
  } catch (error) {
    res.json({ error: error.message });
    next(error);
  }
});

// Route that retrieves the actual data from the given line
// Data like stops that contain the actual timestamps, altitude & lattitude data
app.get("/actuals/eindhoven/:journeykey", async (req, res, next) => {
  try {
    // We retrieve all journey keys from eindhoven
    // A journeykey represents a bus that is driving, or is planned to drive in real time.
    // if no busses are driving, the data will return "false" don't be surprised.
    let journeyLineKeys = await getJourneyLines();

    // We retrieve the query which is just a line number and pass it to data fetching function
    let query = req.params.journeykey;
    const lineNumbers = [query];

    let actualsData = await getActualsData(journeyLineKeys, lineNumbers);
    res.json({ actualsData });
    next();
  } catch (error) {
    res.json({ error: error.message });
    next(error);
  }
});

app.get("/lines", async (req, res, next) => {
  try {
    let lineData = await getLineData();
    res.json(lineData);
  } catch (error) {
    res.json({ error: error.message });
    next(error);
  }
});

// Setup our server
app.listen(3000, () => console.log("Api Server is listening on port 3000"));

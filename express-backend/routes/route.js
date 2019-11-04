const express = require("express");
app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const data = require("../data/data.json");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// Route that will retrieve all our line data
router.get("/route", async (req, res, next) => {
  try {
    res.json({ data });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Route that will retrieve the individual line data so we can build a line on the map
router.get("/route/:line", (req, res, next) => {
  let query = req.params.line;
  let myData;

  // We need to check whether the user has put an L before the linenumber, otherwise it won't work
  if (!query.includes("L")) {
    myData = {
      error: "Did you add an L like L400 for the linenumber?"
    };
  } else {
    // We need to check whether data is not empty
    if (!data[query]) {
      myData = {
        error:
          "Line not found, options are: [L400, L401, L402, L403, L404, L405, L406, L407]"
      };
    } else {
      // If the user presented an L in the query and the line was found, fill the dataObj with the proper data.
      myData = data[query];
    }
  }

  try {
    res.json({ myData });
  } catch (error) {
    res.json({ error: error.message });
  }
});

let stops = {
  shouldStop: 0
};

router.get("/route/stop", async (req, res, next) => {
  res.json({ stops });
});

router.post("/route/stops", (req, res, next) => {
  let stopCode = req.body.stopcode;
  stops.shouldStop = stopCode;
  res.json({ stops });
  // next();
  // if (stopCode === 1) {
  //   shouldStop = 1;
  //   res.json(shouldStop);
  // } else if (stopCode === 0) {
  //   res.json(shouldStop);
  // } else {
  //   res.json({ error: "stopcode is not 0 or 1" });
  // }
});
module.exports = router;

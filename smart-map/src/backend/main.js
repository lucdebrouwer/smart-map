let urls = []; // Will store url's that retrieve "actuals" data from the linenumbers.

// Function that does:
 // Retrieve all line data
 // Filter line data so we get back the 8 lines we chose to provide information on
 // Pass this data to getActuals to fetch the actual data per line
async function getLines(url) {
  return await fetch(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    mode: "cors"
  })
    .then(res => res.json())
    .then(res => doSomething(res))
    .catch(err => console.log("something went wrong", err));
}

async function doSomething(data) {
  const lineNumbers = ["400", "401", "402", "403", "404", "405", "406", "407"]; // LineNumbers we want the data from

  // Filter through the data
  const filtered = Object.values(data)
    .filter(key => {
      // If the public linenumber was found in the dataset, put it in our dataset
      return lineNumbers.includes(key.LinePublicNumber);
    })
    // Multiple values can collide with each other, we only want the data from Eindhoven so we filter the data further by adding the DataOwnerCode to the dataset.
    .filter(key => {
      return key.DataOwnerCode === "CXX";
    });
  await getActuals(filtered);
}

getLines("http://v0.ovapi.nl/line/");

async function getActuals(data) {
  data.map(line => {
    // console.log(
    //   line.DataOwnerCode,
    //   line.LinePlanningNumber,
    //   line.LineDirection
    // );

    // Construct the URLs for each public line so we can fetch the actuals
    urls.push(
      `http://v0.ovapi.nl/line/${line.DataOwnerCode}_${line.LinePlanningNumber}_${line.LineDirection}`
    );
    //console.log(urls);
  });

  // Fetch the actuals data for the first public line in our dataset.
  fetch(urls[0]).then(res =>
    res
      .json()
      .then(res => console.log(res))
      .catch(err => console.error(err))
  );


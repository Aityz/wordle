const date = document.getElementById("date");

function update() {
  const game = document.getElementById("game").value;

  const date_val = new Date(date.value);

  let url = "https://cors-anywhere.herokuapp.com/";

  if (game === "wordle") {
    console.log("Getting data for wordle");

    url += "https://www.nytimes.com/svc/wordle/v2/";
  } else if (game === "connections") {
    console.log("Getting data for connections");

    url += "https://www.nytimes.com/svc/connections/v2/";
  } else if (game === "strands") {
    console.log("Getting strands data");

    url += "https://www.nytimes.com/svc/strands/v2/";
  } else {
    console.log("Unknown Game " + game);

    return;
  }

  // parse the month, year and date

  const monthString = (date_val.getMonth() + 1).toString().padStart(2, "0");
  const dateString = date_val.getDate().toString().padStart(2, "0");
  const year = date_val.getFullYear().toString();

  url += year + "-" + monthString + "-" + dateString + ".json";

  // make a request to the URL

  console.log("Making request to URL: ", url);

  fetch(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (game === "wordle") {
        document.getElementById("answer").innerHTML =
          "The answer to Wordle number " +
          data["days_since_launch"] +
          " is " +
          data["solution"];
      } else if (game === "connections") {
        document.getElementById("answer").innerHTML =
          "The answer to Connections on " + data["print_date"] + " is: ";

        data["categories"].forEach((category) => {
          document.getElementById("answer").innerHTML +=
            "<br />" + category["title"] + ": ";

          category["cards"].forEach((card) => {
            document.getElementById("answer").innerHTML +=
              card["content"] + ", ";
          });
        });
      } else if (game === "strands") {
        let answer = document.getElementById("answer");

        answer.innerHTML =
          "The answers to Strands on " + data["printDate"] + " are:<br />";

        data["themeWords"].forEach((word) => {
          answer.innerHTML += word + ", ";
        });

        answer.innerHTML += "<br />The Spangram was " + data["spangram"];
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
      document.getElementById("answer").innerHTML = "Answer not found";
    });
}

date.addEventListener("change", function (event) {
  update();
});

document.getElementById("game").addEventListener("change", function (event) {
  update();
});

// make sure date is today
let today = new Date().toISOString().split("T")[0];
document.getElementById("date").value = today;

update(); // update on start

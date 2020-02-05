const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const port = 4000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("pages/index", {
        postcodeData: null,
        error: null
    });
});

app.post("/", function(req, res) {
    let postcode = req.body.postcode;
    let url = `https://api.postcodes.io/postcodes/${postcode}`;
    console.log(url);
    request(url, function(err, response, body) {
        if (err) {
            res.render("pages/index", {
                error: "There is an error!"
            });
        } else {
            let postcodeData = JSON.parse(body);
            let enterData;
            console.log(postcodeData);
            if (postcodeData.status === 404) {
                enterData = "Invalid Postcode";
            } else {
                enterData = `You live in the county of ${postcodeData.result.admin_county}`;
            }
            res.render("pages/index", {
                postcodeData: enterData,
                error: null
            });
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

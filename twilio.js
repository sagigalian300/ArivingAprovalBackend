const axios = require("axios");

axios
  .get("https://hooks.zapier.com/hooks/catch/19778207/24wfe0g/")
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

data = new FormData();
data.append('media', fs.createReadStream('/full/path/to/image.jpg'));
data.append('models', 'genai');
data.append('api_user', '1094534803');
data.append('api_secret', 'GfUfd3sr5btfKbwEeXrfjC3H3TgrjqnR');

axios({
  method: 'post',
  url:'https://api.sightengine.com/1.0/check.json',
  data: data,
  headers: data.getHeaders()
})
.then(function (response) {
  // on success: handle response
  console.log(response.data);
})
.catch(function (error) {
  // handle error
  if (error.response) console.log(error.response.data);
  else console.log(error.message);
});

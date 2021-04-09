const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')
const fetch = require('node-fetch')

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  const url = core.getInput('url');
  const filename = core.getInput('filename');

  console.log(`Hello ${nameToGreet}!`);

  const time = (new Date()).toTimeString();

  core.setOutput("time", time);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);


  /* Testing Only [input] */
  try {
    fetch(url)
      .then(response => {
        response.json().then(data => {
          console.log('data', data)

          var str = ''

          Object.keys(data).forEach(key => {
            var val = data[key]
            if(typeof val === 'string') {
              val = `"${val}"`
            }
            str = str.concat(`${key}=${val}\n`)
          })

          fs.writeFile(filename, str, function (err) {
            if(err) throw err
            console.log('Saved!')
          })
        })
      })
  } catch(err) {
    console.log(err)
  }

} catch (error) {
  core.setFailed(error.message);
}
const express = require('express')
require('@google-cloud/trace-agent').start();
const app = express()
const port = 8080


app.get('/', (req, res) => {
  console.log('get req received for validator')
  setTimeout( () =>
      {
          res.send({
              'status':200,
              'valid': true 
          })
      }, 300
  )
})

app.post('/validation', (req, res) => {
    console.log('req received for validator')
    setTimeout( () =>
        {
            res.send({
                'status':200,
                'valid': true 
            })
        }, 300
    )
})
app.listen(port, () => {
  var host = server.address().address
  var port = server.address().port
  console.log("validation app listening atapp listening at http://%s:%s", host, port)
})
//gcloud builds submit --tag gcr.io/shan-scholarship-cfunc-poc/webserver-sample .
//gcloud container clusters create workflow-demo --num-nodes 2 --zone us-east1-b
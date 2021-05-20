const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('root is NOT SUPPORTED!')
})

app.post('/tax', (req, res) => {
    console.log('req received for tax')
    setTimeout( () =>
        {
            res.send({
                'status':200,
                'value': 0.02 
            })
        }, 300
    )
})
app.listen(port, () => {
  console.log(`tax app listening at http://localhost:${port}`)
})
//gcloud builds submit --tag gcr.io/shan-scholarship-cfunc-poc/webserver-sample .
//gcloud container clusters create workflow-demo --num-nodes 2 --zone us-east1-b
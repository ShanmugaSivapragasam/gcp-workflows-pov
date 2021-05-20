const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('root is NOT SUPPORTED!')
})

app.post('/marketing', (req, res) => {
    console.log('req received for marketing')
    setTimeout( () =>
        {
            res.send({
                'status':200,
                'coupon': 'workflow-poc',
                'valid': 'May-29-2021'
            })
        }, 300
    )
})
app.listen(port, () => {
  console.log(`marketing app listening at http://localhost:${port}`)
})
//gcloud builds submit --tag gcr.io/shan-scholarship-cfunc-poc/webserver-sample .
//gcloud container clusters create workflow-demo --num-nodes 2 --zone us-east1-b
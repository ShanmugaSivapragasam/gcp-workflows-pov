require('@google-cloud/trace-agent').start();
const express = require('express')
const app = express()
app.use(express.json())

const port = 8080

app.use(express.json())

app.get('/', (req, res) => {
  res.send('root is NOT SUPPORTED!')
})

app.post('/loyalty', (req, res) => {
    console.log(req )
    setTimeout( () =>
        {
            res.send({
                'status':200,
                'loyaltyUpdate': 'success',
                'totalpoints': '152'
            })
        }, 300
    )
})
app.listen(port, () => {
  console.log(`loyalty app listening at http://localhost:${port}`)
})
//gcloud builds submit --tag gcr.io/shan-scholarship-cfunc-poc/webserver-sample .
//gcloud container clusters create workflow-demo --num-nodes 2 --zone us-east1-b
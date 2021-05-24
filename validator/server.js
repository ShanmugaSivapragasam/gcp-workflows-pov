const express = require('express')
require('@google-cloud/trace-agent').start();
const app = express()
const port = 8080

app.use(express.json())
app.get('/', (req, res) => {
  console.log('Default Endpoint - Please use validate endpoint')
  res.status(200).json({"status":"I am a tea pot"})
})

app.post('/common/validation', (req, res) => {
    console.log('req received for validator  ' + JSON.stringify(req.body))
    setTimeout( () =>
        {
            res.status(202).json({
                'status':202,
                'valid': true 
            })
        }, 300
    )
})

app.listen(port, () => {
  console.log("validation app started and listening in common context path")
})

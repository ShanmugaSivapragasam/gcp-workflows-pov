const express = require('express')
// require('@google-cloud/trace-agent').start();
const app = express()
const port = 8080
const axios = require('axios');
const { request, response } = require('express');
let host = `http://34.117.20.217`
// let host = `http://localhost:8081`
const resInvalid =  { 'status':  400, 'comment': 'validationFailed'}

app.use(express.json())

app.get('/', (req, res) => {
  console.log('get req received for orchestrator')
  res.send({"status":200})
})

app.post('/orders', async (req, res) =>  {
    //call validator
    let validateUrl = `${host}/common/validation`
    console.log(`req received for orchestrator ${JSON.stringify(req.body)} for calling external host ${validateUrl} `)

    const validatorRes = await postData(req, validateUrl)
    console.log(`validation Res -- ${validatorRes.valid}`)
    
    //if valid, apply discount if discount is more than 0 - sample conditional checks
    if(validatorRes.valid == true){
        
        console.log(`validation Res ${validatorRes}`)
        //process payment for the all payment cards till payment amount is met (ex: customer pays with two cards) - sample for iteration
        let payments = req.body.payments
        console.log(req.body.payments)
        const paymentUrl = `${host}/payment`
        let paymentSuccess = []
        payments.forEach(payment => {

            console.log(payment)
            let paymentRes = postData(payment, paymentUrl)
            paymentSuccess.push(paymentRes.status)
        });
        //if payment success add loyalty and call get the marketing contenct (try in parallel)
        if (paymentSuccess.includes(false)){
            return resInvalid
        }
        const loyaltyUrl = `${host}/loyalty`
        const marketingUrl = `${host}/marketing`

        let data = []
        let loyaltyDatum = {}
        let marketingDatum = {}
        loyaltyDatum.url = loyaltyUrl
        loyaltyDatum.req = req.body
        marketingDatum.url = marketingUrl
        marketingDatum.req = req.body

        data.push(loyaltyDatum)
        data.push(marketingDatum)

        let markLoyalRes = await postDataInParallel(data)
        console.log(markLoyalRes)

        //send the response with the marketing content

        return res.json(markLoyalRes[1])

    }
   
    return res.json(resInvalid)
    
})

async function postData(request, url) {
        //console.log(request)
        let response = ''
        console.log(`posting data started`)
        console.log(request)
        try{
            response =  await axios.post(url, request.body)
            console.log(response.data)
        }catch(err){
            console.error(err)
        }
        // let response = null
        return response.data
}
 async function postDataInParallel(data) {
    let promises = []
    data.forEach(datum => {
        console.log(`datum....`)
        console.log(datum.url)
        console.log(datum.req)
        promises.push(axios.post(datum.url, datum.req))
    })
    console.log(`promises`)
    console.log(promises)
    let responses = []

    await Promise.all(promises).then(function(values) {
        console.log(`in parallel processing values ....  `)
        // console.log(values)
        values.forEach(value => {
            responses.push(value.data)
            console.log(`in parallel processing values --  `)
            console.log(value.data)
        })
        console.log(responses)
      })
      return responses

    //   console.log(`[promises done?????]`)

    
}

async function 

app.listen(port, () => {
  console.log(`orchestator app listening at http://localhost:${port}`)
})
//gcloud builds submit --tag gcr.io/shan-scholarship-cfunc-poc/webserver-sample .
//gcloud container clusters create workflow-demo --num-nodes 2 --zone us-east1-b
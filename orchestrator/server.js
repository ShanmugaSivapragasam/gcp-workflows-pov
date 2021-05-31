require('@google-cloud/trace-agent').start();
const express = require('express')
const app = express()
app.use(express.json())

const port = 8080
const axios = require('axios');
let host = `http://34.117.20.217`
// let host = `http://localhost:8081`
const resInvalid =  { 'status':  400, 'comment': 'validationFailed'}

app.get('/', (req, res) => {
  console.log('get req received for orchestrator')
  res.send({"status":200})
})

app.post('/orders', async (req, res) =>  {
    //call validator
    let validateUrl = `${host}/common/validation`

    const validatorRes = await postData(req, validateUrl)
    console.log(`validation Res -- ${validatorRes.valid}`)
    
    if(validatorRes.valid == true){
        
        // console.log(`validation Res ${JSON.stringify(validatorRes)}`)
        //if valid, apply discount if discount is more than 0 - sample conditional checks
        if(req.body.discountCode){          
            let discoutsUrl = `${host}/discounts`
            let discountRes = await axios.get(discoutsUrl)
            let discount = discountRes.data.value 
            if (discount > 0){
                console.log(`discount will be applied in the core service`)
            }
        } else {
            console.log(`discount is NOT available`)
        }
        
        //process payment for the all payment cards till payment amount is met (ex: customer pays with two cards) - sample for iteration
        let payments = req.body.payments
        const paymentUrl = `${host}/payment`
        let paymentSuccess = []
        // payments.forEach(async payment => {

        //     console.log(`payment forEach loop`)
        //     let paymentRes = await postData(payment, paymentUrl) //forEach  run in concurrently 
        //     console.log(paymentRes.status == 200)
        //     paymentSuccess.push(paymentRes.status == 200)
        // });
        for (payment in payments) {
            let paymentRes = await postData(payments[payment], paymentUrl)
            paymentSuccess.push(paymentRes.status == 200)
        }

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

        //send the response with the marketing content

        return res.json(markLoyalRes[1])

    }
   
    return res.json(resInvalid)
    
})

async function postData(request, url) {
        let response = ''

        try{
            response =  await axios.post(url, request.body)
        }catch(err){
            console.error(err)
        }
        // let response = null
        return response.data
}


async function postDataInParallel(data) {
    let promises = []
    data.forEach(datum => {
        promises.push(axios.post(datum.url, datum.req))
    })
    let responses = []

    await Promise.all(promises).then(function(values) {
        values.forEach(value => {
            responses.push(value.data)
        })
      })
      return responses    
}


app.listen(port, () => {
  console.log(`orchestator app listening at http://localhost:${port}`)
})

const express = require('express')
const app = express()
const port = 8000
fs = require('fs');
const axios = require('axios');

app.get('/webhook', (req, res) => {
  //read JSON and send to the /delivery endpoint  
  try{
    fs.readFile('data.json', 'utf8', async function (err,data) {
        if (err) {
            return res.send(err)
        }
        try{
            const request = await axios.post("http://localhost:3100/api/user/deliveryorder",data, { headers: {'Content-Type': 'application/json'} }); 
        }catch(error){
            
        }

        //axios post to deliveryorder endpoint
        return res.send(data)
        
      });
  }catch(error){
    res.send(error)
  }
  
  
})
async function webhookEvent(){
    try{
        await axios.get('http://localhost:8000/webhook').then(result =>{
            console.log(result)
        });
    }catch(error){
        console.log(error)
    }
    
}
app.listen(port, () => {
    webhookEvent();
  console.log(`app listening at http://localhost:${port}`)
})
const path=require('path')
const express = require('express')
const hbs = require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

const app = express()

//Define for express config
const pdirec=path.join(__dirname,'../')
const viewpath=path.join(__dirname,'/templates/views');
const partialspath=path.join(__dirname,'/templates/partials');

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewpath)
hbs.registerPartials(partialspath)

// Setup static directory
app.use(express.static(pdirec))

app.get('',(req,res) =>{
    res.render('index',{
        title:'Weather',
        name:'Jodhpur'
    })
})


app.get('/weather',(req,res) =>{
    if(!req.query.address) {
        return res.send({
             error:'Please provide address '
         })
     }
        geocode(req.query.address , (error, { latitude, longitude, location } = {} ) => {
            if(error){
                return res.send({error})
            }
            forecast(latitude,longitude,(error,forecastData) => {
                if(error){
                    return res.send({error})
                }
                  res.send({
                      forecast:forecastData,
                      location,
                      address:req.query.address
                  })  
            })
        })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title:404,
        name:'siddharth',
        errormessage:'404 error it is'
    })
})

app.listen(3000,()=>{
    console.log('Server is up on 3000')
})
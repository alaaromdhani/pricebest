const request = require("request")
const multer =require('multer')
const {BrandFecher,detailFecher} = require('./CategoryFetcher')
const {spacenetFechers,JumiaFechers,MytekFecher,foireFecher} = require("./utils")
const puppeteer = require('puppeteer')
const Sequelize = require('sequelize');
const fs = require("fs");
const cors = require("cors")
const { hasSubscribers } = require("diagnostics_channel");
const { stringify } = require("querystring");
const { get } = require("https");
const express = require('express');

const app = express();
(async function(){
/*	const browser = await puppeteer.launch({
  		executablePath: '/usr/bin/google-chrome-stable',
		args:['--no-sandbox']

	})
let page = await browser.newPage()

page.setDefaultNavigationTimeout(180000)

MytekFecher.categorieFetcher(fs,async(err,data)=>{
        let categories = JSON.parse(data).slice(150,(JSON.parse(data)).length)
  let products = await MytekFecher.productFecher(browser,page,categories)
   writetoFile("mytek-products2.json",(JSON.stringify(products)))

	



})*/
let all_products =""
fs.readFile('./mytek-products2.json',(e,d)=>{
	 all_products =d.toString('utf8'); 	
	
	//console.log(products.length)
	/*fs.readFile('./mytek-products2.json',(err,data)=>{
		products = products.concat(JSON.parse(data))
		console.log("found "+products.length+" in the other file added")
		fs.writeFile('./mytek-products.json',JSON.stringify(products),(error,dat)=>{
                if(!error){
                console.log('changes were written to file successfully')

                }

        	})
	})*/
	
		

})
function writetoFile(f,somString){

  fs.appendFileSync('./'+f, somString, 'utf8', err => {
      if (err) {
        console.log(`Error writing file: ${err}`)
      } else {
        console.log(`File is written successfully!`)
      }
    })

}	
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.get('/find/product',(req,res)=>{
	
	res.json({peoducts:all_products})

  })	

app.listen(3000, () => console.log('Server running on port 3000'));

})() 

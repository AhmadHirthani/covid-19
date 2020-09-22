//useful express codes
'use strict'
const Country = require('./countryConstructor.js');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const superagent = require('superagent');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
const port = process.env.PORT;
// console.log({ client });



//routes
app.get('/', handleHomePage);
app.get('/allcountries', handleAllCountries);
app.post('/myrecord', handleMyRecord);
app.get('/myrecordpage', handleMyRecordPage);
app.delete('/delete/:id', handleDelete);
app.put('/update/:id', handleDUpdate);



function handleDUpdate(req, res) {
    console.log('handleMyRecord called');
    console.log('req.body>>', req.body);
    let record = req.body;
    let values = [record.Country, record.CountryCode, record.Slug, record.NewConfirmed,
        record.TotalConfirmed, record.NewDeaths, record.TotalDeaths, record.NewRecovered,
        record.TotalRecovered, record.Date, record.Premium, req.params.id
    ]

    let sql = `update  covid19 set country=$1,  countrycode=$2 ,slug=$3, newconfirmed=$4,
    totalconfirmed=$5, newdeaths=$6, totaldeaths=$7, newrecovered=$8,
     totalrecovered=$9, date=$10, premium=$11 where id=$12;`

    client.query(sql, values).then(data => {
        console.log('data: ', data)
        res.redirect('/myrecordpage')
    })

}



function handleDelete(req, res) {
    console.log('handleDelete called');
    console.log('req.body>>', req.body);
    let record = req.body;
    let id = req.params.id;
    console.log(' id >>', id);

    let values = [];
    values[0] = id;
    console.log(' values >>', values);

    let sql = `delete from covid19 where id=${id};`;
    client.query(sql, values).then(data => {
        console.log('data: ', data.rows);

        res.render('myrecordpage', { myrecord: data.rows })
    })
}




function handleMyRecordPage(req, res) {
    console.log('handleMyRecordPage called');
    console.log('req.body>>', req.body);
    let record = req.body;

    let sql = `select * from covid19;`;
    client.query(sql).then(data => {
        console.log('data: ', data.rows);

        res.render('myrecordpage', { myrecord: data.rows })
    })
}


function handleMyRecord(req, res) {
    console.log('handleMyRecord called');
    console.log('req.body>>', req.body);
    let record = req.body;
    let values = [record.Country, record.CountryCode, record.Slug, record.NewConfirmed,
        record.TotalConfirmed, record.NewDeaths, record.TotalDeaths, record.NewRecovered,
        record.TotalRecovered, record.Date, record.Premium
    ]

    let sql = `insert into covid19 (country, countrycode, slug, newconfirmed,
    totalconfirmed, newdeaths, totaldeaths, newrecovered, totalrecovered,
     date, premium) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);`;

    client.query(sql, values).then(data => {
        console.log('data: ', data)
        res.redirect('/myrecordpage')
    })




}



function handleHomePage(req, res) {
    console.log('handleHomePage called');
    // console.log('req.body>>', req.body);
    let url = `https://api.covid19api.com/world/total`;
    superagent.get(url).then(data => {
        console.log('data>>', data);
        res.render('index', { worldTotalStatics: data.body })
    })
}

function handleAllCountries(req, res) {
    // // let countriesArray = [];
    // console.log('handleAllCountries called');
    // // console.log('req.body>>', req.body);
    // let url = `https://api.covid19api.com/summary`;
    // superagent.get(url).then(data => {
    //     data.body.forEach(country => {
    //         let newCountry = new Country(country);
    //         countriesArray.push(newCountry);
    //     })
    //     console.log('data>>', data.body.Countries);

    //     res.render('allcountries', { allcountries: countriesArray })
    // })


    console.log('handleAllCountries called');
    // console.log('req.body>>', req.body);
    let url = `https://api.covid19api.com/summary`;
    superagent.get(url).then(data => {
        console.log('data>>', data.body.Countries);

        res.render('allcountries', { allcountries: data.body.Countries })
    })
}






client.connect().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
});

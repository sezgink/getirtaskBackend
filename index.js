const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const url = 'mongodb://dbUser:dbPassword@ds155428.mlab.com:55428/getir-bitaksi-hackathon';

//Listening /searchRecord route for post requests
app.get('/', (req, res) => {
    res.json({"info":"You need to post to /searchRecord"});
    });

app.post('/searchRecord', (req, res) => {
    console.log(req.body);
    
    const bod = req.body;
    try {
        const rMaxCount = bod.maxCount;
        const rMinCount = bod.minCount;
        const rMaxDate = bod.endDate;
        const rMinDate = bod.startDate;

        console.log(new Date('2015-06-29').toISOString());
        db.db('getir-bitaksi-hackathon').collection('records').aggregate([
            {
                $match : {
                    'createdAt': {
                        $lte: new Date(rMaxDate),
                        $gte: new Date(rMinDate)
                    },
                
                      
                }
            },
            {
              $project: {
                _id : 0 ,
                key: 1,
                createdAt: 1,
                totalCount: { $sum: "$counts"},
            }
        }
         ]).toArray().then(pros=>{
            try {
                var items = [];
                pros.map(ob=>{
                    if(ob.totalCount>=rMinCount&&ob.totalCount<=rMaxCount) {
                        items.push(ob);
                    }
                });
                res.json({'code':0,'msg':'Success','records' : items});
            } catch(err) {
                res.json({'code':-1,'msg':'Fail'});
            }
            //const metadata = {total_count : pros.length};
           // res.json({records: pros});
            
             // res.json({_metadata : metadata, records: pros});
        }).catch(err=>{
            console.log('ERROR:', err);
        });
    } catch(err) {
        res.json({'code':-1,'msg':'Control parameters(minCount,maxCount,startDate,endDate)...'});
        console.log(err);
    }


});


MongoClient.connect(url).then(conn=> { 
    db = conn;
    app.listen(process.env.PORT, ()=>{console.log('App started on port 3000 Haa');
});
}).catch(error => {
    console.log('ERROR:', error);
});

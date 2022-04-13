const { Sequelize, QueryTypes } = require('@sequelize/core');
const cron = require('node-cron');

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres'
    });

sequelize.authenticate().then(()=>{
    console.log("connected successfully");
})

function deleteNonHourlyPoints(sequelize){
    console.log("starting")

    const startTime = new Date(Date.now());
    startTime.setDate(startTime.getDate() - 1);

    const endTime = new Date(Date.now());
    endTime.setDate(endTime.getDate() - 1);

    const promises = [];
    for (let index = 0; index <= 24; index++) {
        startTime.setHours(index, 0, 0, 0);
        endTime.setHours(index+1, 0, 0, 0); 
        promises.push(sequelize.query(`DELETE FROM "node_stats" WHERE "createdAt" > '${startTime.toISOString()}' AND "createdAt" < '${endTime.toISOString()}' `, { type: QueryTypes.SELECT }))
    }

    Promise.all(promises).then((data)=>{
        console.log(data);
    }).catch((err)=> console.error(err));

    return true
}

const job = cron.schedule('0 0 0 * * *', ()=>deleteNonHourlyPoints(sequelize), {scheduled: false});
job.start();
var seeder = require('mongoose-seeder'),
		data = require('./data/data.json');


seeder.seed(data).then(function(dbData) {
    // The database objects are stored in dbData
    console.log('data seeded :');
}).catch(function(err) {
    // handle error
    console.error(err);
});
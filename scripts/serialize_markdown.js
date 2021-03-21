const fs = require('fs');

fs.readFile('edit.md', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(JSON.stringify(data));
});
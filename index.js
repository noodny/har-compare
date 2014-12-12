var fs = require('fs'),
    args = process.argv.splice(2, process.argv.length),
    cwd = process.cwd(),
    _ = require('lodash');

if(args.length < 2) {
    console.error('Missing required parameter.');
    console.log('Usage: node index.js file1 file2 (compares file1 against file2)');
    process.exit();
}

var filename1 = args[0],
    filename2 = args[1],
    file1 = fs.readFileSync(cwd + '/' + filename1, {
        encoding: 'utf-8'
    }),
    file2 = fs.readFileSync(cwd + '/' + filename2, {
        encoding: 'utf-8'
    }),
    diff = [];

try {
    file1 = JSON.parse(file1);
} catch (e) {
    console.error('File ' + filename1 + ' is not a well formatted JSON');
}

try {
    file2 = JSON.parse(file2);
} catch (e) {
    console.error('File ' + filename2 + ' is not a well formatted JSON');
}

function findEntryByRequestUrl(url) {
    for (var i = 0; i < file1.log.entries.length; i++) {
        var entry = file1.log.entries[i];

        if(url.indexOf('?') > -1) {
            url = url.substr(0, url.indexOf('?'));
        }

        if(entry.request.url.indexOf(url) > -1) {
            return entry;
        }
    }
    return false;
}

file2.log.entries.forEach(function (entry) {
    var equiv = findEntryByRequestUrl(entry.request.url)

    if(equiv) {
        if(equiv.response.status !== entry.response.status) {
            console.log('[wrong response] ' + entry.request.url.substr(0, 60) + ' status: ' + equiv.response.status + ' (should be ' + entry.response.status + ')');
            diff.push(entry);
        }
    } else {
        console.log('[missing request] ' + entry.request.url.substr(0, 60));
        diff.push(entry);
    }
});

file1.log.entries = diff;

fs.writeFileSync('./diff.har', JSON.stringify(file1), {
    encoding: 'utf-8'
});

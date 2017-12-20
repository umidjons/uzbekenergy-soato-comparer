const readline = require('readline');
const fs = require('fs');
const _ = require('lodash');

function countBy(entries, field = 'filter') {
    const counts = {};
    for (const entry of entries) {
        if (counts[entry[field]] === undefined) {
            counts[entry[field]] = 0;
        }
        counts[entry[field]]++;
    }
    return counts;
}

function parseLine(line) {
    const re = /(\d+),(.*?),(.*)$/gmi;
    const matches = re.exec(line);
    const entry = {
        value: matches[1],
        title: {
            ru: `${matches[1]} - ${matches[2]}`,
            uz: `${matches[1]} - ${matches[2]}`
        },
        filter: matches[1].substr(0, 2)
    };

    return entry;
}

function parseFile(inFile, outFile) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(inFile, {encoding: 'utf-8'});
        const reader = readline.createInterface({input: stream, output: undefined});
        const entries = [];

        reader.on('line', line => {
            entries.push(parseLine(line));
        });

        reader.on('close', () => {
            const json = JSON.stringify(entries);
            fs.writeFile(outFile, json, 'utf8', () => {
                resolve(entries);
            });
        });
    });
}

function saveToFile(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, 'utf8', (error) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

function diff(left, right) {
    const notInRight = left.filter(x => {
        for (const y of right) {
            if (x.value === y.value) {
                return false;
            }
        }
        return true;
    });
    return notInRight;
}

function diffName(left, right) {
    const result = [];
    for (const a of left) {
        const found = _.find(right, {value: a.value});
        if (found && (found.title.ru !== a.title.ru || found.title.uz !== a.title.uz)) {
            result.push({left: a, right: found});
        }
    }
    return result;
}

module.exports = {countBy, parseLine, parseFile, diff, diffName, saveToFile};
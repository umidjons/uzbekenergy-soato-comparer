const utils = require('./utils');
const Table = require('cli-table2');

const existings = require('./data/existing_soato.json').values;
const FILE_IN = './data/soato_19122017.txt'; // CAUTION: content must be on UTF-8
const FILE_OUT = './out/soato_19122017.json';
const FILE_DELETED = './out/soato_19122017_deleted.json';
const FILE_ADDED = './out/soato_19122017_added.json';
const FILE_DIFF_NAMES = './out/soato_19122017_changed_names.json';

async function main() {
    const entries = await utils.parseFile(FILE_IN, FILE_OUT);
    let table = new Table({head: ['#', 'Entries', 'Count']});
    table.push([1, 'Existing', existings.length]);
    table.push([2, 'Parsed', entries.length]);
    console.log('Total count of entries:');
    console.log(table.toString());

    const count_existing_by_reg = utils.countBy(existings);
    const count_parsed_by_reg = utils.countBy(entries);
    table = new Table({head: ['#', 'Region Code', 'Existing Count', 'Parsed Count']});
    let idx = 1;
    for (const reg in count_existing_by_reg) {
        table.push([idx++, reg, count_existing_by_reg[reg], count_parsed_by_reg[reg]]);
    }
    console.log('Count of existing entries by regions:');
    console.log(table.toString());

    const deletedEntries = utils.diff(existings, entries);
    const addedEntries = utils.diff(entries, existings);

    table = new Table({head: ['#', 'Entry']});
    idx = 1;
    for (const entry of deletedEntries) {
        table.push([idx++, JSON.stringify(entry, null, 4)]);
    }
    console.log('Deleted Entries:');
    console.log(table.toString());

    table = new Table({head: ['#', 'Entry']});
    idx = 1;
    for (const entry of addedEntries) {
        table.push([idx++, JSON.stringify(entry, null, 4)]);
    }
    console.log('Added Entries:');
    console.log(table.toString());

    const changedNames = utils.diffName(existings, entries);
    table = new Table({head: ['#', 'Old', 'New']});
    idx = 1;
    for (const entry of changedNames) {
        table.push([idx++, JSON.stringify(entry.left, null, 4), JSON.stringify(entry.right, null, 4)]);
    }
    console.log('Changed Entries:');
    console.log(table.toString());

    try {
        await utils.saveToFile(FILE_DELETED, JSON.stringify(deletedEntries, null, 4));
        await utils.saveToFile(FILE_ADDED, JSON.stringify(addedEntries, null, 4));
        await utils.saveToFile(FILE_DIFF_NAMES, JSON.stringify(changedNames, null, 4));
    } catch (error) {
        console.log(error);
    }
}

main();

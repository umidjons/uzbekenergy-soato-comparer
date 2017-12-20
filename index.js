const utils = require('./utils');

const existings = require('./data/existing_soato.json').values;
const FILE_IN = './data/soato_19122017.txt'; // CAUTION: content must be on UTF-8
const FILE_OUT = './out/soato_19122017.json';
const FILE_DELETED = './out/soato_19122017_deleted.json';
const FILE_ADDED = './out/soato_19122017_added.json';
const FILE_DIFF_NAMES = './out/soato_19122017_changed_names.json';

async function main() {
    const entries = await utils.parseFile(FILE_IN, FILE_OUT);
    console.log('Count of existing entries:', existings.length);
    console.log('Count of new entries:', entries.length);

    console.log('Count of existing entries by regions:\n', utils.countBy(existings));
    console.log('Count of new entries by regions:     \n', utils.countBy(entries));

    const deletedEntries = utils.diff(existings, entries);
    const addedEntries = utils.diff(entries, existings);

    console.log('Deleted Entries:');
    console.log(deletedEntries, '\n\n\n');

    console.log('Added Entries:');
    console.log(addedEntries, '\n\n\n');

    const changedNames = utils.diffName(existings, entries);
    console.log('Different Names:');
    console.log(changedNames);

    try {
        await utils.saveToFile(FILE_DELETED, JSON.stringify(deletedEntries));
        await utils.saveToFile(FILE_ADDED, JSON.stringify(addedEntries));
        await utils.saveToFile(FILE_DIFF_NAMES, JSON.stringify(changedNames));
    } catch (error) {
        console.log(error);
    }
}

main();

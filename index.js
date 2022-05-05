'use strict'

const fs = require('fs');
const { Client } = require("@opensearch-project/opensearch");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { parse } = require('csv-parse')
const cliProgress = require('cli-progress')

const parser = parse({
    cast: true,
    columns: true,
    cast_date: true
})

const argv = yargs(hideBin(process.argv))
    .usage('Useage: npm start --csv <path_to_file> [options]')
    .options({
        'csv': {
            alias: 'c',
            description: 'path to csv file',
            demandOption: true
        },
        'index': {
            alias: 'i',
            description: 'Index name to upload data to',
            default: 'test'
        },
        'delete': {
            alias: 'd',
            description: 'Delete index',
            type: 'boolean'
        },
        'overwrite': {
            alias: 'o',
            description: 'overwrite data in the index',
            type: 'boolean'
        }
    })
    .argv

const client = new Client({
    node: 'http://localhost:9200',
});

function uploadData(indexName, csvPath) {
    console.info('Reading file and begining upload')

    const stats = fs.statSync(csvPath)
    let sizeRead = 0
    const progressBar = new cliProgress.SingleBar({
        etaBuffer: 100,
        format: '{bar} {percentage}% | {value}/{total}',
    }, cliProgress.Presets.shades_classic);
    progressBar.start(stats.size, 0)

    fs.createReadStream(csvPath)
        .on('data', (buffer) => {
            sizeRead += buffer.length
        })
        .pipe(parser)
        .on('error', error => console.error(error))
        .on('data', async row => {
            await uploadRow(indexName, row)

            // TODO: This progress bar is slightly inaccurate since it indicates the progress of the file read and not the progress of the upload
            // Impliment upload as a Transform Stream
            progressBar.update(sizeRead)
        })
        .on('end', () => {
            progressBar.stop();
            console.log('Ingested data')
        });

}

async function uploadRow(indexName, row) {
    await client.index({
        index: indexName,
        body: row,
    })
}

async function deleteIndex(indexName) {
    const indexExists = await (await client.indices.exists({ index: indexName })).body

    if (!indexExists) {
        console.warn(`Index ${indexName} does not exist`)
        return
    }

    console.info(`Deleting index: ${indexName}`)
    await client.indices.delete({ index: indexName })
}

async function main() {
    const indexName = argv.index
    const csvFilePath = argv.csv

    if (argv.delete || argv.overwrite) {
        await deleteIndex(indexName)

        if (argv.delete) {
            return
        }
    }

    // Upload data
    uploadData(indexName, csvFilePath)
}

main()
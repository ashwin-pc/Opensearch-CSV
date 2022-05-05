# Ingest simple csv into OpenSearch Dashboards

this is a simple package to ingest smple data into your local instance of opensearch

## Installation

```sh
npm install
```

## Useage

```sh
# To ingest a specific file (test file for demo purposes in ./data/test.csv)
npm start -- --csv <path_to_csv>

# To overwirte an index
npm start -- --index <index_name> --csv <path_to_csv> --overwrite
```

e.g.

```sh

```

For more details on how to use the tool, run `npm run help` or `npm start -- --help`

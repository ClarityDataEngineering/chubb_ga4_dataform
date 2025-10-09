declare({
    schema: project_config.SOURCE_DATASET,
    ...(project_config.SOURCE_PROJECT) && {database: project_config.SOURCE_PROJECT},
    name: "events_*",
    description: "This is the table that stores GA4 to BigQuery event exports."
});
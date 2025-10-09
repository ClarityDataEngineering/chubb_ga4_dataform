declare({
    schema: project_config.SEEDS_DATASET,
    ...(project_config.SOURCE_PROJECT) && {database: project_config.SOURCE_PROJECT},
    name: project_config.CAMPAIGN_PROPERTIES_LOOKUP_TABLE,
    description: "This is the lookup table to expand campaign properties naming."
});
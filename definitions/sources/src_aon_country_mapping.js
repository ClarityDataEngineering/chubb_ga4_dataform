declare({
    schema: project_config.SEEDS_DATASET,
    ...(project_config.SOURCE_PROJECT) && {database: project_config.SOURCE_PROJECT},
    name: "country_region_mapping",
    description: "This is the lookup table to expand campaign properties naming."
});
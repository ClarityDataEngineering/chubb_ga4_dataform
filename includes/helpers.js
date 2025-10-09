/**
 * Unnests a column in a SQL query.
 */
function unnestColumn(columnToUnnest, keyToExtract, valueType="string_value") {
    return `(select value.${valueType} from unnest(${columnToUnnest}) where key = '${keyToExtract}')`;
};

/**
 * Build a query that will be used for retrieving source categories.
*/
function selectSourceCategories(){
    let selectStatement = '';
    let i = 0;
    let { sourceCategories } = require("./source_categories.js");
    let sourceCategoriesLength = Object.keys(sourceCategories).length;
    for (row of sourceCategories) {
        i++;
        selectStatement = selectStatement.concat(`select "` + row.source + `" as source, "`+  row.sourceCategory + `" as source_category`);
        if (i < sourceCategoriesLength) {
            selectStatement = selectStatement.concat(` union distinct `)
        }
    }
    return selectStatement;
}

/** 
 * Dynamically calculate the attribution window lookback range for the last-non direct attribution 
 */

function calculateLookbackRange(days) {
  return days * 24 * 60 * 60 * 100000; 
}

/** 
 * Loop through event/user properties defined in the project config and unnest their values 
*/

function unnestUserDefinedProperties(isStruct, properties) {
    return properties.map((prop, index) => {

        // Check if custom column name exists, if not use event_parameter
        const eventName = prop.custom_column_name || prop.event_parameter 

        const column = `${unnestColumn('event_params', prop.event_parameter, prop.value_type)} as ${eventName}`;
        return isStruct ? (index > 0 ? `, ${column}` : column) : `, ${column}`;
    }).join("");
}

/** 
 * Loop through event/user properties defined in the project config and output their values
*/

function userDefinedPropertiesOutput(isStruct, properties, tableAlias = '') {
    return properties.map((prop, index) => {

        // Check if custom column name exists, if not use event_parameter
        const eventName = prop.custom_column_name || prop.event_parameter 

        const column = tableAlias ? `${tableAlias}.${eventName}` : `${eventName}`;
        return isStruct ? (index > 0 ? `, ${column}` : column) : `, ${column}`;
    }).join("");
}

/** 
 * Return any_value for a given user property (useful for aggregation)
*/
function anyValueUnnestUserProperties(properties) {
    return properties.map(prop => {
        // Check if custom column name exists, if not use event_parameter
        const eventName = prop.custom_column_name || prop.event_parameter 

        return `, any_value(${unnestColumn('event_params', prop.event_parameter, prop.valueType)}) as ${eventName}`;
    }).join('');
}

/** 
 * Loop through event/user properties to find the last value in a given partition key
*/

function lastValueUserDefinedValue(properties, partition, orderBy) {
    
    return properties.map(prop => {
        // Check if custom column name exists, if not use event_parameter
        const eventName = prop.custom_column_name || prop.event_parameter 

        return `, last_value(${prop.event_parameter} ignore nulls) over (partition by ${partition} order by ${orderBy} rows between unbounded preceding and current row) as ${eventName}`
    }).join(",")
}

/** 
 * Loop through conversions and output a count for each event 
*/

function conversionCount(isStruct, conversions) {
    return conversions.map((conversion, index) => {
        const column = `countif(event_name = '${conversion}') as ${conversion}_total, ` +
        `count(distinct if(event_name = '${conversion}', event_name, null)) as ${conversion}_unique`
        return isStruct ? (index > 0 ? `, ${column}` : column) : `, ${column}`;
    }).join("");
}

/** 
 * Loop through conversions and output unique and total in final tables in a struct
*/

function conversionOutput(isStruct, tableAlias, conversions) {
    return conversions.map((conversion, index) => {
        const column = `${tableAlias}.${conversion}_total, ` +
        `${tableAlias}.${conversion}_unique`
        return isStruct ? (index > 0 ? `, ${column}` : column) : `, ${column}`;
    }).join("");
}

/** 
 * Loop through campaign name shortcodes and return the long-form value from the lookup table
*/

function campaignPropertyLookupCase(columns) {
    
    const caseSwitch = [];
    columns.forEach(colName => {
        caseSwitch.push(
            `
                (
                    CASE 
                        WHEN params.${colName} = ${colName}_lk.sh_${colName} THEN ${colName}_lk.lg_${colName}
                        ELSE NULL
                    END
                ) AS ${colName}_lookup
            `
        )
    })
    return caseSwitch.join(',')
}

/** 
 * Loop the the campaign properties and join the tables together
*/

function campaignPropertyJoin(columns, lookupTable) {
  const tableJoins = [];

  columns.forEach(colName => {
    tableJoins.push(`
      left join ${lookupTable} as ${colName}_lk on params.${colName} = ${colName}_lk.sh_${colName}
    `)
  })
  return tableJoins.join('\n');
}

/** 
 * Loop through user properties and find the first value over a partition and hydrate all rows with a value
*/

function hydrateUserProperties(isStruct, properties, structName = '', partition, orderBy) {
    return properties.map((prop, index) => {
        const column = `first_value(${structName ? `${structName}.` : ''}${prop.event_parameter} ignore nulls) over (partition by ${partition} order by ${orderBy}) as ${prop.event_parameter}`;
        return isStruct ? (index > 0 ? `, ${column}` : column) : `, ${column}`;
    }).join("");
}

/** 
 * Loop through conversions and output a new column with conversion count - used in final events table
*/

function markEventAsConversion(isStruct, conversions) {
    return conversions.map((conversion, index) => {
        const column = `if(event_name = '${conversion}', 1, 0) as ${conversion}`;
        return isStruct ? (index > 0 ? `, ${column}` : column) : `, ${column}`;
    }).join("");
}

/** 
 * Remove list of domains inputted in the project config
*/

const { DOMAIN_EXCLUSION } = require('./project_config')

function filterOutDomains() {
  // Use template literals for proper string concatenation
  return DOMAIN_EXCLUSION ? `WHERE NOT SAFE.REGEXP_CONTAINS(page_location, r'(?i)${DOMAIN_EXCLUSION}')` : '';
}

module.exports = {
    unnestColumn,
    selectSourceCategories,
    calculateLookbackRange,
    unnestUserDefinedProperties,
    userDefinedPropertiesOutput,
    lastValueUserDefinedValue,
    anyValueUnnestUserProperties,
    conversionCount,
    campaignPropertyLookupCase,
    campaignPropertyJoin,
    hydrateUserProperties,
    markEventAsConversion,
    conversionOutput, 
    filterOutDomains
}
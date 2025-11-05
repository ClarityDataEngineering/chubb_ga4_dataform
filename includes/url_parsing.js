/**
 * Cleans a URL, removing all query strings 
 */
function sanitiseURL(url) {
    return `REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(${url}, r'^(https?:\\/\\/)?(www\\.)?', ''), r'[^a-zA-Z0-9\\-\\/:.\\s].*', ''), r'[^\\x00-\\x7F].*', '')`
};

/**
 * Returns the page path from a URL
 */
function extractPagePath(url) {
    return `REGEXP_EXTRACT(${url}, r'(?:\\w+:)?\\/\\/[^\\/]+([^?#]+)')`
};

/**
 * Extracts a query parameter from a URL, args taken from the project config
 */
function extractQueryParameterValue(url, param) {
    const queries = [];
    param.forEach(paramName => {
        queries.push(
            `
                REGEXP_EXTRACT( ${url}, r'${paramName}=([^&|\?|#]*)'  ) as query_param_${paramName}
            `
        )
    })
    return queries.join(',')
}

/**
 * Removes a query parameter from a URL, args taken from the project config
 */
function removeQueryParameters(url, parameters) {
  // Join parameters into a single regex string
  const paramRegex = parameters.join("|");

  // SQL query generation
  const sqlQuery = `REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(${url}, '(\\\\?|&)(${paramRegex})=[^&]*', '\\\\1'), '\\\\?&+', '?'), '&+', '&'), '\\\\?$|&$', '')`;

  return sqlQuery.trim();
}

/**
 * Extract hostname from URL
*/
function extractURLHostname(url) {
    return `REGEXP_EXTRACT(${url}, r'(?:http[s]?://)?(?:www\\.)?(.*?)(?:(?:/|:)(?:.)*|$)')`
};

/**
 * Extract query string from URL
*/
function extractURLQueryString(url) {
    return `REGEXP_EXTRACT(${url}, r'\\?(.+)')`
};

function siteLocationByURL(url) {
    return `
        CASE
            WHEN REGEXP_CONTAINS(${url}, r'/hu-hu(/|$)') THEN 'hu-hu'
            WHEN REGEXP_CONTAINS(${url}, r'/ie-en(/|$)') THEN 'ie-en'
            WHEN REGEXP_CONTAINS(${url}, r'/nordic-en(/|$)') THEN 'nordic-en'
            WHEN REGEXP_CONTAINS(${url}, r'/es-es(/|$)') THEN 'es-es'
            WHEN REGEXP_CONTAINS(${url}, r'/fr-fr(/|$)') THEN 'fr-fr'
            WHEN REGEXP_CONTAINS(${url}, r'/benelux-en(/|$)') THEN 'benelux-en'
            WHEN REGEXP_CONTAINS(${url}, r'/ch-fr(/|$)') THEN 'ch-fr'
            WHEN REGEXP_CONTAINS(${url}, r'/tr-tr(/|$)') THEN 'tr-tr'
            WHEN REGEXP_CONTAINS(${url}, r'/se-se(/|$)') THEN 'se-se'
            WHEN REGEXP_CONTAINS(${url}, r'/pt-pt(/|$)') THEN 'pt-pt'
            WHEN REGEXP_CONTAINS(${url}, r'/cz-cz(/|$)') THEN 'cz-cz'
            WHEN REGEXP_CONTAINS(${url}, r'/at-de(/|$)') THEN 'at-de'
            WHEN REGEXP_CONTAINS(${url}, r'/uk-en(/|$)') THEN 'uk-en'
            WHEN REGEXP_CONTAINS(${url}, r'/pk-ur(/|$)') THEN 'pk-ur'
            WHEN REGEXP_CONTAINS(${url}, r'/pl-pl(/|$)') THEN 'pl-pl'
            WHEN REGEXP_CONTAINS(${url}, r'/benelux-nl(/|$)') THEN 'benelux-nl'
            WHEN REGEXP_CONTAINS(${url}, r'/fi-fi(/|$)') THEN 'fi-fi'
            WHEN REGEXP_CONTAINS(${url}, r'/ch-de(/|$)') THEN 'ch-de'
            WHEN REGEXP_CONTAINS(${url}, r'/de-de(/|$)') THEN 'de-de'
            WHEN REGEXP_CONTAINS(${url}, r'/it-it(/|$)') THEN 'it-it'
            WHEN REGEXP_CONTAINS(${url}, r'/ua-en(/|$)') THEN 'ua-en'
            WHEN REGEXP_CONTAINS(${url}, r'/za-en(/|$)') THEN 'za-en'
            WHEN REGEXP_CONTAINS(${url}, r'/pk-en(/|$)') THEN 'pk-en'
            WHEN REGEXP_CONTAINS(${url}, r'/sa-ar(/|$)') THEN 'sa-ar'
            WHEN REGEXP_CONTAINS(${url}, r'/sa-en(/|$)') THEN 'sa-en'
            WHEN REGEXP_CONTAINS(${url}, r'/ch-(de|fr)(/|$)') THEN 'ch'
            ELSE 'other'
        END as site_location
    `
}


module.exports = {
    sanitiseURL,
    extractPagePath,
    extractQueryParameterValue,
    removeQueryParameters,
    extractURLHostname,
    extractURLQueryString,
    siteLocationByURL
}
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


module.exports = {
    sanitiseURL,
    extractPagePath,
    extractQueryParameterValue,
    removeQueryParameters,
    extractURLHostname,
    extractURLQueryString
}
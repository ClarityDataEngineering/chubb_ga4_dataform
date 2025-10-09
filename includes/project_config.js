const SOURCE_PROJECT = "chubb-bq-project" // Specify a value here only in case you source data sites in a project other than the default defined in workflow_settings.yaml 
const SOURCE_DATASET = "analytics_431849806" // the database containing the GA4 BigQuery exports 
const SEEDS_DATASET = "raw_input" // the database containing the GA4 BigQuery data mapping seeds such as source categories 
const STAGING_DATASET = "ga4_dataform_staging"
const OUTPUT_DATASET = "ga4_dataform_output"
const START_DATE = 20240101 // Earliest date to load 
const INCLUDE_INTRADAY = false
const STATIC_INCREMENTAL_DAYS = 3 // Number of days to scan and reprocess on each run, default is 3 
const SESSION_ATTRIBUTION_LOOKBACK_WINDOW = 30 // The last non-direct session attribution lookback window

const QUERY_PARAM_EXCLUSION = ["gclid", "fbclid", "_ga", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source"]
const QUERY_PARAM_EXTRACTION = ["gclid"] // Add query parameters to be extracted into columns. Leave array blank if not 

/**
 * Use a regex string below remove any unwanted domains from your data
*/
const DOMAIN_EXCLUSION = ""
/**
 * If the client uses a naming framework add configuration params below
 */
const INCLUDE_CAMPAIGN_PROPERTIES = false
const CAMPAIGN_PROPERTIES_LOOKUP_TABLE = ""
const CAMPAIGN_PROPERTIES_LOOKUP = []

/* Specific event names can be specified as conversions */
const CONVERSIONS = [
    'form_submit', 'video_start'
]


/**
 * Specify an event parameter that should be available on a session basis, the value will be taken from the latest event parameter per session. 

 * Args:
 *   event_parameter: The name of the event parameter to unnest
 *   value_type: The data type of the event parameter value - [string_value|int_value|float_value|double_value]

 */

const DERIVED_SESSION_PROPERTIES = [
    { event_parameter:"custom", value_type:"string_value"}
]

const DERIVED_USER_PROPERTIES = [
    { event_parameter:"form_name", value_type:"string_value"}
]

const DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"page_country", value_type:"string_value"},
    { event_parameter:"page_language", value_type:"string_value"},
    { event_parameter:"page_region", value_type:"string_value"},
    { event_parameter:"page_content_type", value_type:"string_value"},
    { event_parameter:"page_solution_line", value_type:"string_value"},
    { event_parameter:"page_topic", value_type:"string_value"},
    { event_parameter:"page_capability", value_type:"string_value"},
    { event_parameter:"page_sub_topic", value_type:"string_value"},
    { event_parameter:"page_industry", value_type:"string_value"},
    { event_parameter:"page_product_service", value_type:"string_value"},
    { event_parameter:"page_type", value_type:"string_value"},
    { event_parameter:"page_type_group", value_type:"string_value"},
    { event_parameter:"page_business_line", value_type:"string_value"},
    { event_parameter:"form_type", value_type:"string_value"},
    { event_parameter:"video_title", value_type:"string_value"},
    { event_parameter:"video_percent", value_type:"string_value"},
    { event_parameter:"filter_name", value_type:"string_value"},
    { event_parameter:"link_url", value_type:"string_value"},
    { event_parameter:"link_text", value_type:"string_value"},
    { event_parameter:"title", value_type:"string_value"},
    { event_parameter:"file_type", value_type:"string_value"},
    { event_parameter:"file_name", value_type:"string_value"},
    { event_parameter:"position", value_type:"int_value"},
    { event_parameter:"scroll_depth", value_type:"string_value"},
    { event_parameter:"percent_scrolled", value_type:"int_value"},
    { event_parameter:"read_length", value_type:"int_value"},
    { event_parameter:"page_load_time", value_type:"int_value"},
    { event_parameter:"server_response_time", value_type:"int_value"},
    { event_parameter:"dom_interactive_time", value_type:"int_value"},
    { event_parameter:"content_load_time", value_type:"int_value"}
]

const PAGE_VIEW_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"page_country", value_type:"string_value"},
    { event_parameter:"page_language", value_type:"string_value"},
    { event_parameter:"page_region", value_type:"string_value"},
    { event_parameter:"page_content_type", value_type:"string_value"},
    { event_parameter:"page_solution_line", value_type:"string_value"},
    { event_parameter:"page_topic", value_type:"string_value"},
    { event_parameter:"page_capability", value_type:"string_value"},
    { event_parameter:"page_sub_topic", value_type:"string_value"},
    { event_parameter:"page_industry", value_type:"string_value"},
    { event_parameter:"page_product_service", value_type:"string_value"},
    { event_parameter:"page_type", value_type:"string_value"},
    { event_parameter:"page_type_group", value_type:"string_value"},
    { event_parameter:"page_business_line", value_type:"string_value"}
]

module.exports = {
    SOURCE_PROJECT,
    SOURCE_DATASET,
    SEEDS_DATASET,
    STAGING_DATASET,
    OUTPUT_DATASET,
    START_DATE,
    INCLUDE_INTRADAY,
    STATIC_INCREMENTAL_DAYS,
    SESSION_ATTRIBUTION_LOOKBACK_WINDOW,
    QUERY_PARAM_EXCLUSION,
    QUERY_PARAM_EXTRACTION,
    DOMAIN_EXCLUSION,
    INCLUDE_CAMPAIGN_PROPERTIES,
    CAMPAIGN_PROPERTIES_LOOKUP_TABLE,
    CAMPAIGN_PROPERTIES_LOOKUP,
    CONVERSIONS,
    DERIVED_SESSION_PROPERTIES,
    DERIVED_USER_PROPERTIES,
    DERIVED_EVENT_PROPERTIES,
    PAGE_VIEW_DERIVED_EVENT_PROPERTIES
}

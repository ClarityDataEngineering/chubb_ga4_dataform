const SOURCE_PROJECT = "chubb-bq-project" // Specify a value here only in case you source data sites in a project other than the default defined in workflow_settings.yaml 
const SOURCE_DATASET = "analytics_431849806" // the database containing the GA4 BigQuery exports 
const SEEDS_DATASET = "raw_input" // the database containing the GA4 BigQuery data mapping seeds such as source categories 
const STAGING_DATASET = "ga4_dataform_staging"
const OUTPUT_DATASET = "ga4_dataform_output"
const START_DATE = 20250101 // Earliest date to load 
const INCLUDE_INTRADAY = false
const STATIC_INCREMENTAL_DAYS = 3 // Number of days to scan and reprocess on each run, default is 3 
const SESSION_ATTRIBUTION_LOOKBACK_WINDOW = 30 // The last non-direct session attribution lookback window

const QUERY_PARAM_EXCLUSION = ["gclid", "fbclid", "_ga", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source"]
const QUERY_PARAM_EXTRACTION = ["gclid"] // Add query parameters to be extracted into columns. Leave array blank if not 

/**
 * Use a regex string below remove any unwanted domains from your data
*/
const DOMAIN_EXCLUSION = "(chubb-b70a-prod.adobecqms.net|c212.net)"
/**
 * If the client uses a naming framework add configuration params below
 */
const INCLUDE_CAMPAIGN_PROPERTIES = true
const CAMPAIGN_PROPERTIES_LOOKUP_TABLE = "naming_framework_lookup"
const CAMPAIGN_PROPERTIES_LOOKUP = ["business_line", "industry", "product_service", "location", "language", "campaign", "objective"]

/* Specific event names can be specified as conversions -- note if using custom conversions add the outputted names here */
const CONVERSIONS = [
    'form_submit', 'video_start', 'cta_click', 'file_download'
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

const DERIVED_USER_PROPERTIES = []

const DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"}
]

const PAGE_VIEW_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"}
]

const FILE_DOWNLOAD_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"},
    { event_parameter:"link_url", value_type:"string_value"},
    { event_parameter:"link_text", value_type:"string_value"},
    { event_parameter:"file_name", value_type:"string_value"}
]

const FORM_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"},
    { event_parameter:"form_name", value_type:"string_value"},
    { event_parameter:"form_type", value_type:"string_value"},
    { event_parameter:"form_eventname", value_type:"string_value"}
]

const SCROLL_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"},
    { event_parameter:"scroll_depth_percentage", value_type:"string_value"}
]

const VIDEO_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"},
    { event_parameter:"video_title", value_type:"string_value"},
    { event_parameter:"video_provider", value_type:"string_value"},
    { event_parameter:"video_action", value_type:"string_value"},
    { event_parameter:"video_progress", value_type:"string_value"}
]

const CLICK_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"},
    { event_parameter:"event_linktype", value_type:"string_value"},
    { event_parameter:"event_type", value_type:"string_value"},
    { event_parameter:"event_linkurl", value_type:"string_value"},
    { event_parameter:"event_label", value_type:"string_value"},
    { event_parameter:"event_category", value_type:"string_value"},
]

const NAVIGATION_DERIVED_EVENT_PROPERTIES = [
    { event_parameter:"country", value_type:"string_value"},
    { event_parameter:"site_language", value_type:"string_value"},
    { event_parameter:"business", value_type:"string_value"},
    { event_parameter:"event_persona", value_type:"string_value"},
    { event_parameter:"event_linktype", value_type:"string_value"},
    { event_parameter:"event_type", value_type:"string_value"},
    { event_parameter:"event_linkurl", value_type:"string_value"},
    { event_parameter:"event_label", value_type:"string_value"},
    { event_parameter:"event_category", value_type:"string_value"},
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
    PAGE_VIEW_DERIVED_EVENT_PROPERTIES,
    FILE_DOWNLOAD_DERIVED_EVENT_PROPERTIES,
    FORM_DERIVED_EVENT_PROPERTIES,
    SCROLL_DERIVED_EVENT_PROPERTIES,
    VIDEO_DERIVED_EVENT_PROPERTIES,
    CLICK_DERIVED_EVENT_PROPERTIES,
    NAVIGATION_DERIVED_EVENT_PROPERTIES
}

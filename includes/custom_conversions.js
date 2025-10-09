/**
 * Custom conversion logic can be added - as of 11-03-25 the logic to process these conversions in marts and upstream tables
 * they will need swapping out with these accordingly.
 * 
 */
function aonConversionsTotalUnique() {
    return `

    , COUNTIF(event_name = 'file_download') AS file_download_total
    , COUNT(DISTINCT IF(event_name = 'file_download', event_name, NULL)) AS file_download_unique

    , COUNTIF(event_name = 'video_start') AS video_start_total
    , COUNT(DISTINCT IF(event_name = 'video_start', event_name, NULL)) AS video_start_unique

    , COUNTIF(event_name = 'form_submit' AND ((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type') IS NULL OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) <> 'subscribe step 1')) AS form_submit_total 
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND ((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type') IS NULL OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) <> 'subscribe step 1'), event_name, NULL)) AS form_submit_unique

    , COUNTIF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%contact%') AS form_submit_contact_total
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%contact%', event_name, NULL)) AS form_submit_contact_unique

    , COUNTIF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%webinar%') AS form_submit_webinar_total
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%webinar%', event_name, NULL)) AS form_submit_webinar_unique

    , COUNTIF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%seminar%') AS form_submit_seminar_total
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%seminar%', event_name, NULL)) AS form_submit_seminar_unique

    , COUNTIF(event_name = 'form_submit' AND (LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%download%' OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%gated%')) AS form_submit_download_total
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND (LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%download%' OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%gated%'), event_name, NULL)) AS form_submit_download_unique

    , COUNTIF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%newsletter%') AS form_submit_newsletter_total
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%newsletter%', event_name, NULL)) AS form_submit_newsletter_unique

    , COUNTIF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%tool%') AS form_submit_tool_total
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%tool%', event_name, NULL)) AS form_submit_tool_unique

    , COUNTIF(event_name = 'form_submit' AND (REGEXP_CONTAINS(IFNULL((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type'), ''), r'(?i)(other|identity|subscribe|support)') AND LOWER(IFNULL((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type'), '')) <> 'subscribe step 1' OR (SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type') IS NULL)) AS form_submit_other_total
    , COUNT(DISTINCT IF(event_name = 'form_submit' AND (REGEXP_CONTAINS(IFNULL((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type'), ''), r'(?i)(other|identity|subscribe|support)') AND LOWER(IFNULL((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type'), '')) <> 'subscribe step 1' OR (SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type') IS NULL), event_name, NULL)) AS form_submit_other_unique

    `
}

function aonConversionsTotal() {
    return `
        CASE WHEN event_name = 'file_download' THEN 1 ELSE 0 END AS file_download
        , CASE WHEN event_name = 'video_start' THEN 1 ELSE 0 END AS video_start
        , CASE WHEN event_name = 'form_submit' AND ((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type') IS NULL OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) <> 'subscribe step 1') THEN 1 ELSE 0 END AS form_submit
        , CASE WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%contact%" THEN 1 ELSE 0 END AS form_submit_contact
        , CASE WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%webinar%" THEN 1 ELSE 0 END AS form_submit_webinar
        , CASE WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%seminar%" THEN 1 ELSE 0 END AS form_submit_seminar
        , CASE WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%download%" OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%gated%" THEN 1 ELSE 0 END AS form_submit_download
        , CASE WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%newsletter%" THEN 1 ELSE 0 END AS form_submit_newsletter
        , CASE WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%tool%" THEN 1 ELSE 0 END AS form_submit_tool
        , CASE 
            WHEN event_name = 'form_submit' AND REGEXP_CONTAINS(IFNULL((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type"), ''), r'(?i)(other|identity|subscribe|support)') THEN 1
            WHEN event_name = 'form_submit' AND (SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type") IS NULL THEN 1
            ELSE 0
        END as form_submit_other
    `
}

function aonConversionEventDim() {
    return `
        CASE
            WHEN event_name = 'file_download' THEN 'File Download'
            WHEN event_name = 'video_start' THEN 'Video Play'
            WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE '%contact%' THEN 'Form Submit - Contact'
            WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE '%webinar%' THEN 'Form Submit - Webinar'
            WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE '%seminar%' THEN 'Form Submit - Seminar'
            WHEN event_name = 'form_submit' AND (LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE '%download%' OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE '%gated%') THEN 'Form Submit - Download'
            WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE '%newsletter%' THEN 'Form Submit - Newsletter'
            WHEN event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE '%tool%' THEN 'Form Submit - Tool'
            WHEN event_name = 'form_submit' AND REGEXP_CONTAINS(IFNULL((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'form_type'), ''), r'(?i)(other|identity|subscribe|support)')
            AND LOWER((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'form_type')) <> 'subscribe step 1' THEN 'Form Submit - Other'
            WHEN event_name = 'form_submit' AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'form_type') IS NULL THEN 'Form Submit - Other'
            ELSE NULL
        END AS aon_conversion_event
    `
}

function aonIsConversionEvent() {
    return `
        CASE
        WHEN event_name IN (
            'file_download'
            , 'video_start')
            OR (event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%contact%')
            OR (event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%webinar%')
            OR (event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%seminar%')
            OR (event_name = 'form_submit' AND (LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%download%' OR LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%gated%'))
            OR (event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%newsletter%')
            OR (event_name = 'form_submit' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) LIKE '%tool%')
            OR (event_name = 'form_submit' AND (REGEXP_CONTAINS(IFNULL((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type'), ''), r'(?i)(other|identity|support|subscribe)') AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type')) <> 'subscribe step 1' OR (SELECT value.string_value FROM unnest(event_params) WHERE key = 'form_type') IS NULL))
        THEN 1 ELSE 0 END as is_conversion_event
    `
} 

module.exports = {
    aonConversionsTotalUnique,
    aonConversionsTotal,
    aonConversionEventDim, 
    aonIsConversionEvent
}
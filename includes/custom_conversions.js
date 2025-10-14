/**
 * Custom conversion logic can be added - as of 11-03-25 the logic to process these conversions in marts and upstream tables
 * they will need swapping out with these accordingly.
 * 
 */
function chubbConversionsTotalUnique() {
    return `

    , COUNTIF(event_name = 'file_download') AS file_download_total
    , COUNT(DISTINCT IF(event_name = 'file_download', event_name, NULL)) AS file_download_unique

    , COUNTIF(event_name = 'click') AS cta_click_total
    , COUNT(DISTINCT IF(event_name = 'click', event_name, NULL)) AS cta_click_unique

    , COUNTIF(event_name = 'form_submit') AS form_submit_total
    , COUNT(DISTINCT IF(event_name = 'form_submit', event_name, NULL)) AS form_submit_unique

    , COUNTIF(event_name = 'video_all' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'video_action')) LIKE '%start%') AS video_start_total
    , COUNT(DISTINCT IF(event_name = 'video_all' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = 'video_action')) LIKE '%start%', event_name, NULL)) AS video_start_unique

    `
}

function chubbConversionsTotal() {
    return `
        CASE WHEN event_name = 'file_download' THEN 1 ELSE 0 END AS file_download
        , CASE WHEN event_name = 'click' THEN 1 ELSE 0 END AS cta_click
        , CASE WHEN event_name = 'form_submit' THEN 1 ELSE 0 END AS form_submit
        , CASE WHEN event_name = 'video_all' AND LOWER((SELECT value.string_value FROM unnest(event_params) WHERE key = "form_type")) LIKE "%start%" THEN 1 ELSE 0 END AS video_start
    `
}

function chubbConversionEventDim() {
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
        END AS chubb_conversion_event
    `
}

function chubbIsConversionEvent() {
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
    chubbConversionsTotalUnique,
    chubbConversionsTotal,
    chubbConversionEventDim, 
    chubbIsConversionEvent
}
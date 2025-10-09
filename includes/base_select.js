

function baseSelect() {
    return `
    parse_date('%Y%m%d',event_date) as event_date_dt
    , event_timestamp
    , lower(replace(trim(event_name), " ", "_")) as event_name
    , event_params
    , event_previous_timestamp
    , event_value_in_usd
    , event_server_timestamp_offset
    , user_id
    , user_pseudo_id
    , struct (  
        privacy_info.analytics_storage as privacy_info_analytics_storage
        , privacy_info.ads_storage as privacy_info_ads_storage
        , privacy_info.uses_transient_token as privacy_info_uses_transient_token
    ) as privacy_info
    , user_properties
    , user_first_touch_timestamp
    , struct (
        user_ltv.revenue as user_ltv_revenue
        , user_ltv.currency as user_ltv_currency
    ) as user_ltv
    , struct(
        device.category as category
        , device.mobile_brand_name as mobile_brand_name
        , device.mobile_model_name as mobile_model_name
        , device.mobile_marketing_name as mobile_marketing_name
        , device.mobile_os_hardware_model as mobile_os_hardware_model
        , device.operating_system as operating_system
        , device.operating_system_version as operating_system_version
        , device.vendor_id as vendor_id
        , device.advertising_id as advertising_id
        , device.language as language
        , device.is_limited_ad_tracking as is_limited_ad_tracking
        , device.time_zone_offset_seconds as time_zone_offset_seconds
        , device.browser as browser
        , device.browser_version as browser_version
        , device.web_info.browser as web_info_browser
        , device.web_info.browser_version as web_info_browser_version
        , device.web_info.hostname as web_info_hostname     
    ) as device
    , struct (
        geo.continent as continent
        , geo.country as country
        , geo.region as region
        , geo.city as city
        , geo.sub_continent as sub_continent
        , geo.metro as metro
    ) as geo
    , struct (
        app_info.id as id
        , app_info.version as version
        , app_info.install_store as install_store
        , app_info.firebase_app_id as firebase_app_id
        , app_info.install_source as install_source
    ) as app_info
    , traffic_source.name as user_campaign
    , traffic_source.medium as user_medium
    , traffic_source.source as user_source
    , stream_id
    , platform
    , struct (
        ecommerce.total_item_quantity
        , ecommerce.purchase_revenue_in_usd
        , ecommerce.purchase_revenue
        , ecommerce.refund_value_in_usd
        , ecommerce.refund_value
        , ecommerce.shipping_value_in_usd
        , ecommerce.shipping_value
        , ecommerce.tax_value_in_usd
        , ecommerce.tax_value
        , ecommerce.unique_items
        , ecommerce.transaction_id  
    ) as ecommerce
    , (select 
        array_agg(struct(
            unnested_items.item_id
            , unnested_items.item_name
            , unnested_items.item_brand
            , unnested_items.item_variant
            , unnested_items.item_category
            , unnested_items.item_category2
            , unnested_items.item_category3
            , unnested_items.item_category4
            , unnested_items.item_category5
            , unnested_items.price_in_usd
            , unnested_items.price
            , unnested_items.quantity
            , unnested_items.item_revenue_in_usd
            , unnested_items.item_revenue
            , unnested_items.item_refund_in_usd
            , unnested_items.item_refund
            , unnested_items.coupon
            , unnested_items.affiliation
            , unnested_items.location_id
            , unnested_items.item_list_id
            , unnested_items.item_list_name
            , unnested_items.item_list_index
            , unnested_items.promotion_id
            , unnested_items.promotion_name
            , unnested_items.creative_name
            , unnested_items.creative_slot
            , unnested_items.item_params
        )) from unnest(items) as unnested_items 
    ) items
    , struct (
      lower(collected_traffic_source.manual_campaign_id) as manual_campaign_id,
      lower(collected_traffic_source.manual_campaign_name) as manual_campaign_name,
      lower(collected_traffic_source.manual_source) as manual_source,
      lower(collected_traffic_source.manual_medium) as manual_medium,
      lower(collected_traffic_source.manual_content) as manual_content,
      lower(collected_traffic_source.manual_term) as manual_term,
      collected_traffic_source.gclid as gclid,
      collected_traffic_source.dclid as dclid
    ) as collected_traffic_source
    , ${helpers.unnestColumn('event_params', 'ga_session_id', 'int_value')} as ga_session_id
    , ${helpers.unnestColumn('event_params', 'page_location')} as page_location
    , ${helpers.unnestColumn('event_params', 'ga_session_number', 'int_value')} as ga_session_number
    , ${helpers.unnestColumn('event_params', 'custom_timestamp', 'int_value')} as custom_timestamp /* May not always exist */
    , ${helpers.unnestColumn('event_params', 'engagement_time_msec', 'int_value')} as engagement_time_msec
    , ${helpers.unnestColumn('event_params', 'page_title')} as page_title
    , ${helpers.unnestColumn('event_params', 'page_referrer')} as page_referrer
    , coalesce(
      ${helpers.unnestColumn('event_params', 'session_engaged', 'int_value')},
      case 
        when ${helpers.unnestColumn('event_params', 'session_engaged')} = "1" then 1 
      else null 
    end
    ) as session_engaged 
    , case when event_name = 'page_view' then 1 else 0 end as is_page_view
    , case when event_name = 'purchase' then 1 else 0 end as is_purchase
    , case when ${helpers.unnestColumn('event_params', 'entrances', 'int_value')} = 1 and event_name = 'page_view' then 1 else 0 end as is_entrance
    , lower(${helpers.unnestColumn('event_params', 'source')}) as event_source
    , lower(${helpers.unnestColumn('event_params', 'medium')}) as event_medium
    , lower(${helpers.unnestColumn('event_params', 'campaign')}) as event_campaign
    , lower(${helpers.unnestColumn('event_params', 'content')}) as event_content
    , lower(${helpers.unnestColumn('event_params', 'term')}) as event_term
    , ${helpers.unnestColumn('event_params', 'gclid')} as event_gclid
    , ${helpers.unnestColumn('event_params', 'dclid')} as event_dclid
    , ${helpers.unnestColumn('event_params', 'srstlid')} as event_srstlid
    `
}


module.exports = {
    baseSelect
}
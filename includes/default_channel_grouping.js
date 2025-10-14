function channelGrouping(source, medium, sourceCategory, campaign) {
    return `case

                when ${source} is null and ${medium} is null
                    then 'Direct'
                when ${source} = '(direct)'
                    and ${medium} = '(none)' or ${medium} = '(not set)'
                    then 'Direct'

                when REGEXP_CONTAINS(${campaign}, r"cross-network")
                    then 'Cross-network'
                
                when (
                    ${sourceCategory} = 'SOURCE_CATEGORY_SHOPPING'
                    or REGEXP_CONTAINS(${campaign}, r"^(.*(([^a-df-z]|^)shop|shopping).*)$")
                    )
                    and REGEXP_CONTAINS(${medium},r"^(.*cp.*|ppc|retargeting|paid.*)$")
                    then 'Paid Shopping'
                
                when ${sourceCategory} = 'SOURCE_CATEGORY_SEARCH'
                    and REGEXP_CONTAINS(${medium}, r"^(.*cp.*|ppc|retargeting|paid.*)$")
                    then 'Paid Search'
                
                when ${sourceCategory} = 'SOURCE_CATEGORY_SOCIAL'
                    and REGEXP_CONTAINS(${medium}, r"^(.*cp.*|ppc|retargeting|paid.*)$")
                    then 'Paid Social'

                when ${sourceCategory} = 'SOURCE_CATEGORY_VIDEO'
                    and REGEXP_CONTAINS(${medium},r"^(.*cp.*|ppc|retargeting|paid.*)$") 
                    or REGEXP_CONTAINS(${medium},r"^(pre_?roll|video_display|outstream|takeover_display)$") 
                    then 'Paid Video'

                when ${medium} in ('display', 'banner', 'expandable', 'interstitial', 'cpm')
                    then 'Display'
                
                when REGEXP_CONTAINS(${medium}, r"^(.*cp.*|ppc|retargeting|paid.*)$")
                    then 'Paid Other'
                
                when ${sourceCategory} = 'SOURCE_CATEGORY_SHOPPING'
                    or REGEXP_CONTAINS(${campaign}, r"^(.*(([^a-df-z]|^)shop|shopping).*)$")
                    then 'Organic Shopping'
                
                when ${sourceCategory} = 'SOURCE_CATEGORY_SOCIAL'
                    or ${medium} in ("social","social-network","social-media","sm","social network","social media")
                    then 'Organic Social'
                
                when ${sourceCategory} = 'SOURCE_CATEGORY_VIDEO'
                    or REGEXP_CONTAINS(${medium}, r"^(.*video.*)$")
                    then 'Organic Video'
                
                when ${sourceCategory} = 'SOURCE_CATEGORY_SEARCH' or ${medium} = 'organic'
                    then 'Organic Search'
                
                when ${medium} in ("referral", "app", "link")
                    then 'Referral'
                
                when REGEXP_CONTAINS(${source}, r"email|e-mail|e_mail|e mail")
                    or REGEXP_CONTAINS(${medium}, r"email|e-mail|e_mail|e mail")
                    then 'Email'
                
                when ${medium} = 'affiliate'
                    then 'Affiliates'
                
                when ${medium} = 'audio'
                    then 'Audio'
                
                when ${source} = 'sms'
                    or ${medium} = 'sms'
                    then 'SMS'

                when REGEXP_CONTAINS(${medium}, r"push$")
                    or REGEXP_CONTAINS(${medium}, r"mobile|notification")
                    or ${source} = 'firebase'
                    then 'Mobile Push Notifications'

                else 'Unassigned'    

            end`
}

function calculatedTrafficType(defaultChannelGroup) {
    return `
        CASE
            WHEN REGEXP_CONTAINS(${defaultChannelGroup}, r'Organic Email|Direct|Referral|Organic Social|Organic Search|Social|Email|Organic Shopping') THEN 'Organic & Direct'
            WHEN REGEXP_CONTAINS(${defaultChannelGroup}, r'Display|RSS|Paid Search|Content Advertising|Paid Email|Paid Search|Affiliates|Other Advertising|Paid Social|Paid Shopping|Cross-network') THEN 'Paid'
            WHEN REGEXP_CONTAINS(${defaultChannelGroup}, r'Unassigned') THEN 'Other'
            ELSE ${defaultChannelGroup}
        END
    `
}


module.exports = {
    channelGrouping,
    calculatedTrafficType
}
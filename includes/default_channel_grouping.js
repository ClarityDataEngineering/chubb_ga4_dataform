function channelGrouping(source, medium, sourceCategory) {
    return `case

                when ${source} is null and ${medium} is null
                    then 'Direct'
                when ${source} = '(direct)'
                    and ${medium} = '(none)' or ${medium} = '(not set)'
                    then 'Direct'
                
                when
                    REGEXP_CONTAINS(${medium}, r"^paid-(discovery|instream|outstream|infeed|bumper|masthead|video|vod|banner)$")
                    and REGEXP_CONTAINS(${source}, r"^(youtube|xaxis|sky-short-form|sky-advance|sky-sports|sky-news|peacock|ft|economist|ozone|wall-street-journal|new-york-times|bloomberg|bloomberg-green|miq|apple-news|le-point|les-echos|borse-am-sonntag|wiwo|handelsblatt|ariva|frankfurter-allgemeine|het-financieele-dagblad-bnr|faz|finecast)$")
                    then 'Paid Video'

                when ${medium} = 'org-video'
                    and REGEXP_CONTAINS(${source}, r"^(youtube)$")
                    then 'Video'
                
                when ${medium} = 'paid-audio'
                    then 'Paid Audio'
                
                when ${medium} = 'org-audio'
                    then 'Audio'

                when REGEXP_CONTAINS(${medium}, r"^paid-(post|video|tweet|account)$")
                    and REGEXP_CONTAINS(${source}, r"^(linkedin|facebook|instagram|twitter|facebook-instagram)$")
                    then 'Paid Social'
                
                when REGEXP_CONTAINS(${medium}, r"^paid-(print|digital|post)$")
                    then 'Paid Media'
                
                when REGEXP_CONTAINS(${medium}, r"^org-(print|digital)$")
                    then 'Media'
                
                when REGEXP_CONTAINS(${medium}, r"^pdf|ppt|sell-sheet|placemat|infographic|brochure$")
                    then 'Document'
                
                when ${medium} = 'organic'
                    then 'Organic Search'
                
                when REGEXP_CONTAINS(${medium}, r"^(social|social-network|social-media|sm|social network|social media)$")
                    or REGEXP_CONTAINS(${medium}, r"^org-(post|video|tweet)$")
                    then 'Social'
                
                when ${medium} = 'email'
                    or ${medium} = 'newsletter'
                    or ${medium} = 'paid-email'
                    or ${medium} = 'paid-newsletter'
                    or ${source} = "outlook"
                    then 'Email'

                when REGEXP_CONTAINS(${medium}, r"affiliate|affiliates")
                    then 'Affiliates'
                
                when ${medium} = 'referral'
                    then 'Referral'
                
                when REGEXP_CONTAINS(${medium}, r"^(cpc|ppc|paidsearch)$")
                    or REGEXP_CONTAINS(${medium}, r"^paid-(sem)$")
                    then 'Paid Search'
                
                when REGEXP_CONTAINS(${medium}, r"^(display|cpm|banner)$")
                    or REGEXP_CONTAINS(${medium}, r"^paid-(display-banner|display-video|audience|banner|video|overlay|website-banner|display|post)$")
                    then 'Paid Display'

                when REGEXP_CONTAINS(${medium}, r"^(cpv|cpa|cpp|content-text)$")
                    then 'Other Advertising'
                
                when REGEXP_CONTAINS(${source}, r"^virtual-event$")
                    then 'Event'
                
                when ${medium} = 'press-release'
                    then 'PR'
            end`
}

function calculatedTrafficType(defaultChannelGroup) {
    return `
        CASE
            WHEN REGEXP_CONTAINS(${defaultChannelGroup}, r'Organic Search') THEN 'Organic Search'
            WHEN REGEXP_CONTAINS(${defaultChannelGroup}, r'Paid Search|Paid Social|Paid Media|Paid Display|Paid Video|Affiliates|Other Advertising') THEN 'Activated Paid'
            WHEN REGEXP_CONTAINS(${defaultChannelGroup}, r'Social|Email|Event|Audio|Media|Document|Video|PR') THEN 'Activated Organic'
            WHEN REGEXP_CONTAINS(${defaultChannelGroup}, r'Direct') THEN 'Direct'
            ELSE 'Other'
        END
    `
}


module.exports = {
    channelGrouping,
    calculatedTrafficType
}
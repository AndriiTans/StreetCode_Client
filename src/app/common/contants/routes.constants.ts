export const API_ROUTES = {
    BASE: '/',
    FACTS: {
        GET_ALL: 'facts/getFacts',
        GET_BY_ID: 'facts/getFact',
        GET_BY_STREETCODE_ID: 'facts/getFactsByStreetcodeId',
        CREATE: 'facts/createFact',
        UPDATE: 'facts/updateFact',
        DELETE: 'facts/deleteFact',
    },
    PARTNERS: {
        GET_ALL: 'partners/getPartners',
        GET_SPONSORS: 'partners/getSponsors',
        GET_BY_ID: 'fact/getPartner',
        CREATE: 'partners/createFact',
        UPDATE: 'fact/updateFact',
        DELETE: 'fact/deleteFact',
    },
    TAGS: {
        GET_ALL: 'tags/getTags',
        GET_BY_ID: 'tags/getTag',
        GET_BY_TITLE: 'tags/getTagByTitle',
        GET_BY_STREETCODE_ID: 'tags/getTagByStreetcodeId',
        CREATE: 'tags/createTag',
        UPDATE: 'tags/updateTag',
        DELETE: 'tags/deleteTag',
    },
    TERMS: {
        GET_ALL: 'terms/getTerms',
        GET_BY_ID: 'terms/getTerm',
        CREATE: 'terms/createTerm',
        UPDATE: 'terms/updateTerm',
        DELETE: 'terms/deleteTerm',
    },
    TEXTS: {
        GET_ALL: 'partners/getPartners',
        GET_BY_ID: 'fact/getPartner',
        //GET_NEXT: 'partners/createFact',
        UPDATE: 'fact/updateFact',
        DELETE: 'fact/deleteFact',
    },
    TIMELINE: {
        GET_ALL: 'partners/getPartners',
        GET_BY_ID: 'fact/getPartner',
        CREATE: 'partners/createFact',
        UPDATE: 'fact/updateFact',
        DELETE: 'fact/deleteFact',
    },
    TRANSACTION_LINKS: {
        GET_ALL: 'partners/getPartners',
        GET_SPONSORS: 'partners/getSponsors',
        GET_BY_ID: 'fact/getPartner',
        GET_BY_TITLE: 'fact/getPartner',
        CREATE: 'partners/createFact',
        UPDATE: 'fact/updateFact',
        DELETE: 'fact/deleteFact',
    },
    MEDIA: {
        GET_ALL: 'partners/getPartners',
        GET_SPONSORS: 'partners/getSponsors',
        GET_BY_ID: 'fact/getPartner',
        CREATE: 'partners/createFact',
        UPDATE: 'fact/updateFact',
        DELETE: 'fact/deleteFact',
    },
    STREETCODES: {
        GET_ALL: 'streetcode/getStreetcodes',
        GET_EVENTS: 'streetcode/getEvents',
        GET_PERSONS: 'streetcode/getPersons',
        GET_BY_ID: 'streetcode/getStreetcodeById',
        GET_BY_NAME: 'streetcode/getStreetcodeByName',
        GET_BY_TAG_ID: 'streetcode/getStreetcodeByTagId',
        GET_BY_INDEX: 'streetcode/getStreetcodeByIndex',
        CREATE: 'streetcode/createStreetcode',
        UPDATE: 'streetcode/updateStreetcode',
        DELETE: 'streetcode/deleteStreetcode',
    },
    SUBTITLES: {
        GET_ALL: 'subtitle/getSubtitles',
        GET_BY_ID: 'subtitle/getSubtitleById',
        GET_BY_STREETCODE_ID: 'subtitle/getSubtitlesByStreetcodeId',
        CREATE: 'subtitle/createSubtitle',
        UPDATE: 'subtitle/updateSubtitle',
        DELETE: 'subtitle/deleteSubtitle',
    },
}
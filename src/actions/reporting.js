import * as api from '../api/reporting';
import { makeApiActionCreator } from './utils';

export const AGES_FETCH_START = 'REPORTING/AGES_FETCH_START';
export const AGES_FETCH_SUCCESS = 'REPORTING/AGES_FETCH_SUCCESS';
export const AGES_FETCH_ERROR = 'REPORTING/AGES_FETCH_ERROR';

export const EVENTS_FETCH_START = 'REPORTING/EVENTS_FETCH_START';
export const EVENTS_FETCH_SUCCESS = 'REPORTING/EVENTS_FETCH_SUCCESS';
export const EVENTS_FETCH_ERROR = 'REPORTING/EVENTS_FETCH_ERROR';

export const GENDERS_FETCH_START = 'REPORTING/GENDERS_FETCH_START';
export const GENDERS_FETCH_SUCCESS = 'REPORTING/GENDERS_FETCH_SUCCESS';
export const GENDERS_FETCH_ERROR = 'REPORTING/GENDERS_FETCH_ERROR';

export const TIMELINE_DATA_FETCH_START = 'REPORTING/TIMELINE_DATA_FETCH_START';
export const TIMELINE_DATA_FETCH_SUCCESS = 'REPORTING/TIMELINE_DATA_FETCH_SUCCESS';
export const TIMELINE_DATA_FETCH_ERROR = 'REPORTING/TIMELINE_DATA_FETCH_ERROR';

export const AGE_DATA_FETCH_START = 'REPORTING/AGE_DATA_FETCH_START';
export const AGE_DATA_FETCH_SUCCESS = 'REPORTING/AGE_DATA_FETCH_SUCCESS';
export const AGE_DATA_FETCH_ERROR = 'REPORTING/AGE_DATA_FETCH_ERROR';

export const GENDER_DATA_FETCH_START = 'REPORTING/GENDER_DATA_FETCH_START';
export const GENDER_DATA_FETCH_SUCCESS = 'REPORTING/GENDER_DATA_FETCH_SUCCESS';
export const GENDER_DATA_FETCH_ERROR = 'REPORTING/GENDER_DATA_FETCH_ERROR';

export const BRAND_SUBSCRIPTIONS_FETCH_START = 'REPORTING/BRAND_SUBSCRIPTIONS_FETCH_START';
export const BRAND_SUBSCRIPTIONS_FETCH_SUCCESS = 'REPORTING/BRAND_SUBSCRIPTIONS_FETCH_SUCCESS';
export const BRAND_SUBSCRIPTIONS_FETCH_ERROR = 'REPORTING/BRAND_SUBSCRIPTIONS_FETCH_ERROR';

export const CHARACTER_SUBSCRIPTIONS_FETCH_START = 'REPORTING/CHARACTER_SUBSCRIPTIONS_FETCH_START';
export const CHARACTER_SUBSCRIPTIONS_FETCH_SUCCESS = 'REPORTING/CHARACTER_SUBSCRIPTIONS_FETCH_SUCCESS';
export const CHARACTER_SUBSCRIPTIONS_FETCH_ERROR = 'REPORTING/CHARACTER_SUBSCRIPTIONS_FETCH_ERROR';

export const MEDIUM_SUBSCRIPTIONS_FETCH_START = 'REPORTING/MEDIUM_SUBSCRIPTIONS_FETCH_START';
export const MEDIUM_SUBSCRIPTIONS_FETCH_SUCCESS = 'REPORTING/MEDIUM_SUBSCRIPTIONS_FETCH_SUCCESS';
export const MEDIUM_SUBSCRIPTIONS_FETCH_ERROR = 'REPORTING/MEDIUM_SUBSCRIPTIONS_FETCH_ERROR';

export const MEDIUM_SYNCS_FETCH_START = 'REPORTING/MEDIUM_SYNCS_FETCH_START';
export const MEDIUM_SYNCS_FETCH_SUCCESS = 'REPORTING/MEDIUM_SYNCS_FETCH_SUCCESS';
export const MEDIUM_SYNCS_FETCH_ERROR = 'REPORTING/MEDIUM_SYNCS_FETCH_ERROR';

export const PRODUCT_VIEWS_FETCH_START = 'REPORTING/PRODUCT_VIEWS_FETCH_START';
export const PRODUCT_VIEWS_FETCH_SUCCESS = 'REPORTING/PRODUCT_VIEWS_FETCH_SUCCESS';
export const PRODUCT_VIEWS_FETCH_ERROR = 'REPORTING/PRODUCT_VIEWS_FETCH_ERROR';

export const fetchAges = makeApiActionCreator(api.getAges, AGES_FETCH_START, AGES_FETCH_SUCCESS, AGES_FETCH_ERROR);

export const fetchEvents = makeApiActionCreator(api.getActivityReportEvents, EVENTS_FETCH_START, EVENTS_FETCH_SUCCESS, EVENTS_FETCH_ERROR);

export const fetchGenders = makeApiActionCreator(api.getGenders, GENDERS_FETCH_START, GENDERS_FETCH_SUCCESS, GENDERS_FETCH_ERROR);

export const fetchTimelineData = makeApiActionCreator(api.getTimelineData, TIMELINE_DATA_FETCH_START, TIMELINE_DATA_FETCH_SUCCESS, TIMELINE_DATA_FETCH_ERROR);

export const fetchAgeData = makeApiActionCreator(api.getAgeData, AGE_DATA_FETCH_START, AGE_DATA_FETCH_SUCCESS, AGE_DATA_FETCH_ERROR);

export const fetchGenderData = makeApiActionCreator(api.getGenderData, GENDER_DATA_FETCH_START, GENDER_DATA_FETCH_SUCCESS, GENDER_DATA_FETCH_ERROR);

export const fetchBrandSubscriptions = makeApiActionCreator(api.getRankingBrandSubscriptions, BRAND_SUBSCRIPTIONS_FETCH_START, BRAND_SUBSCRIPTIONS_FETCH_SUCCESS, BRAND_SUBSCRIPTIONS_FETCH_ERROR);

export const fetchCharacterSubscriptions = makeApiActionCreator(api.getRankingCharacterSubscriptions, CHARACTER_SUBSCRIPTIONS_FETCH_START, CHARACTER_SUBSCRIPTIONS_FETCH_SUCCESS, CHARACTER_SUBSCRIPTIONS_FETCH_ERROR);

export const fetchMediumSubscriptions = makeApiActionCreator(api.getRankingMediumSubscriptions, MEDIUM_SUBSCRIPTIONS_FETCH_START, MEDIUM_SUBSCRIPTIONS_FETCH_SUCCESS, MEDIUM_SUBSCRIPTIONS_FETCH_ERROR);

export const fetchMediumSyncs = makeApiActionCreator(api.getRankingMediumSyncs, MEDIUM_SYNCS_FETCH_START, MEDIUM_SYNCS_FETCH_SUCCESS, MEDIUM_SYNCS_FETCH_ERROR);

export const fetchProductViews = makeApiActionCreator(api.getRankingProductViews, PRODUCT_VIEWS_FETCH_START, PRODUCT_VIEWS_FETCH_SUCCESS, PRODUCT_VIEWS_FETCH_ERROR);
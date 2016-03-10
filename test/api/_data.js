export const loginData = { username: 'admin', password: 'partyparrot' };
export const videoId = '5a100710-5f3b-4634-8b8f-ed806bc3f77a'; // Thuis
export const unknownVideoId = 'cafebabe-defe-c8ed-dead-beef00000000';
export const serieEpisodeId = '7e506614-8075-41c3-8eda-7f456abf803b'; // Aflevering 1
export const unknownSeriesEpisodeId = 'cafebabe-defe-c8ed-dead-beef11111111';
export const sceneId = '947e935e-2a6c-4d07-8721-fb4361617d6f'; // First scene of Thuis.
export const brandId = 'b9d420e9-59da-4686-9da2-ee7258b5dd0e';

export const scene = {
  hidden: true,
  id: '947e935e-2a6c-4d07-8721-fb4361617d6f',
  imageUrl: 'https://spott-cms-rest-uat.appiness.mobi:443/apptvate/rest/v002/image/images/51ef110b-b8db-44f3-92b8-0ef680d587c6'
};

/*

export const postLoginSuccessRequest = { userName: 'admin', password: 'partyparrot' };
export const postLoginSuccessResponse = {
  userName: 'admin',
  authenticationToken: '2cc14d46-5388-4384-b0ff-24f3f406704e',
  roles: [
    'SYS_ADMIN'
  ]
};

export const postLoginInvalidData = { username: 'fakeuser', password: 'spotshop' };
export const postLoginInvalidResponse = {
  type: 'ERROR',
  httpStatus: 401,
  code: 'SEC-001',
  message: 'User name and/or password incorrect'
};

// GET /media/serieEpisodes/:serieEpisodeId
// ----------------------------------------

export const getSerieEpisodeSuccessId = '7e506614-8075-41c3-8eda-7f456abf803b'; // Aflevering 1
export const getSerieEpisodeSuccessResponse = {
  uuid: '7e506614-8075-41c3-8eda-7f456abf803b',
  localeData: [
    {
      title: 'Aflevering 1'
    }
  ]
};
export const getSerieEpisodeSuccessResult = {
  id: '7e506614-8075-41c3-8eda-7f456abf803b',
  title: 'Aflevering 1'
};

export const getSerieEpisodeNotFoundId = 'does-not-exist';
export const getSerieEpisodeNotFoundResponse = {
  type: 'ERROR',
  httpStatus: 404,
  message: 'episode does not exist',
  cause: 'mobi.appiness.common.data.DataEntityNotFoundException'
};
export const getSerieEpisodeNotFoundResult = new NotFoundError('serieEpisode', {
  body: getSerieEpisodeNotFoundResponse,
  statusCode: 404
});

// GET /video/videos/:videoId
// --------------------------

export const getVideoSuccessResponse = {
  uuid: '5a100710-5f3b-4634-8b8f-ed806bc3f77a',
  totalDurationInSeconds: 1468,
  scenes: [
    {
      uuid: '947e935e-2a6c-4d07-8721-fb4361617d6f',
      hidden: false,
      image: {
        url: 'https://backend-acceptance.appiness.mobi:443/apptvate/rest/v001/image/images/51ef110b-b8db-44f3-92b8-0ef680d587c6'
      }
    }
  ]
};
export const getVideoSuccessResult = {
  id: '5a100710-5f3b-4634-8b8f-ed806bc3f77a',
  scenes: [
    {
      id: '947e935e-2a6c-4d07-8721-fb4361617d6f',
      hidden: false,
      imageUrl: 'https://backend-acceptance.appiness.mobi:443/apptvate/rest/v001/image/images/51ef110b-b8db-44f3-92b8-0ef680d587c6'
    }
  ]
};

export const getVideoNotFoundId = 'does-not-exist';
export const getVideoNotFoundResponse = {
  type: 'ERROR',
  httpStatus: 404,
  message: 'video does not exist',
  cause: 'mobi.appiness.common.data.DataEntityNotFoundException'
};
export const getVideoNotFoundResult = new NotFoundError('video', {
  body: getVideoNotFoundResponse,
  statusCode: 404
});

*/

function stripDomain (url) {
  return url.substring(url.indexOf('/', 9));
}

export function transformUser ({ uuid, userName, profile }) {
  return {
    avatar: profile.avatar ? { id: profile.avatar.uuid, url: profile.avatar.url } : null,
    dateOfBirth: profile.dateOfBirth,
    email: profile.email,
    firstname: profile.firstName,
    followerCount: profile.followerCount,
    followingCount: profile.followingCount,
    id: uuid,
    lastname: profile.lastName,
    picture: profile.picture ? { id: profile.picture.uuid, url: profile.picture.url } : null,
    tagline: profile.tagLine,
    username: userName
  };
}

import skygear from 'skygear';

const userPromiseCache = {};

export function get(userID) {
  if(userCache.hasOwnProperty(userID)) {
    return userPromiseCache[userID];
  } else {
    const userPromise = skygear.publicDB.query(
      new skygear.Query(skygear.UserRecord)
      .equalTo('_id', userID)
    ).then([user] => {
      return user || Promise.reject(`User ID not found: ${userID}`);
    });
    userPromiseCache[userID] = userPromise;
    return userPromise;
  }
}

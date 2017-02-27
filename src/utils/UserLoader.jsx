import skygear from 'skygear';

const UserLoader = {
  _userPromiseCache: {},
  get: function(userID) {
    if(this._userPromiseCache.hasOwnProperty(userID)) {
      return this._userPromiseCache[userID];
    } else {
      const userPromise = skygear.publicDB.query(
        new skygear.Query(skygear.UserRecord)
        .equalTo('_id', userID)
      ).then(([user]) => {
        return user || Promise.reject(`User ID not found: ${userID}`);
      });
      this._userPromiseCache[userID] = userPromise;
      return userPromise;
    }
  }
}

export default UserLoader;


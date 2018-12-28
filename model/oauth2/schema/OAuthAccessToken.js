const mongoose = require('mongoose');
const Schema = mongoose.Schema;;

var OAuthAccessTokenSchema = new Schema({
  accessToken: String,
  expires: Date,
  scope:  String,
  User:  { type : Schema.Types.ObjectId, ref: 'User' },
  OAuthClient: { type : Schema.Types.ObjectId, ref: 'OAuthClient' },
});

module.exports = mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);
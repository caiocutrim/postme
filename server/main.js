import { Meteor } from 'meteor/meteor';
import '../imports/api/models/posts.js';
Meteor.startup(() => {
  
  Accounts.onCreateUser((options, user) => {
    user.profile = options.profile || {};
    user.profile.firstName = options.firstName;
    user.profile.lastName = options.lastName;
    
    user.md5hash = Gravatar.hash(user.emails[0].address)
    return user;
  });
  // user meteor methods
  
});

/**setup all existent users to user gravatar */
function setGravatars() {
  let users = Meteor.users.find( { md5hash: { $exists: false } } );
  users.forEach( ( user ) => {
    Meteor.users.update( { _id: user._id }, { 
      $set: { md5hash: Gravatar.hash( user.emails[0].address ) } 
    });
  });
}
Meteor.startup(() => setGravatars());
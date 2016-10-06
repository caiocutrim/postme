import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import './profile.html';
import './settings.html';

Template.profile.onCreated(function() {
  Meteor.subscribe('users');
})

Template.profile.helpers({
  users() {
    return Meteor.user();
  },
  avatar(size, user) {
    let md5hash;
    if ( user && user.md5hash ) {
      md5hash = user.md5hash;
    } else if ( this.md5hash ) {
      md5hash = this.md5hash;
    }
    md5hash = md5hash || "3eda6fcd3204ef285fa52176c28c4d3e"; 
    return Gravatar.imageUrl( md5hash, { 
      secure: true, 
      size, d: 'mm', 
      rating: 'pg' 
    } );
  }
});

Template.settings.helpers({
  users() {
    return Meteor.user();
  }
})

Template.settings.events({
  'submit .userprofile'(event) {
    event.preventDefault();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    console.log(firstname);
    console.log(lastname);
    Meteor.users.update(Meteor.userId(), {
     $set: {
       profile: {
          firstname,
          lastname 
       }
     } 
    }, (err) => {
      if (err) {
        console.log(err);
        sAlert.err(err.reason);
      } else {
        sAlert.success('Updated');
        $('[name=firstname]').val('');
        $('[name=lastname]').val('');
      }
    });
  }
})
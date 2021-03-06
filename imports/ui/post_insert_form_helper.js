import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Posts } from '../api/models/posts.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';

/*
 * ui dependencies
 */
import './post_insert_form.html';

Template.post_insert_form.events({
  'submit #insert-form'(event) {
    event.preventDefault();
    let target = event.target;
    let title = target.title.value;
    let url = target.url.value;
    Meteor.call('posts.insertPost', title, url, (err) => {
      if (err) {
        console.log(err);
      } else {
        sAlert.info('You did a post');
        target.title.value = '';
        target.url.value = '';
      }
    });
  }
});
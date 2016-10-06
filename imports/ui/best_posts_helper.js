import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Posts} from '../api/models/posts';
import './best_posts.html';
import './commentform.html';
import './comments.html';

Template.best_posts.onCreated(() => {
  Meteor.subscribe('bestposts');
});

Template.best_posts.helpers({
  posts() {
    return Posts.find({private:false}, {
      sort: {
        votes: -1
      }
    })
  }
});

Template.best_posts.events({
   'click .btn-discuss'(event) {
    const id = event.target.id;
    $(`#${id}.comment-form`).toggleClass('display-item');
  },
  'click .upvote'(event) {
    event.preventDefault();
    Meteor.call('posts.upvote', this._id, (err) => {
      if (err) {
        sAlert.error(err.reason);
      } else {
        sAlert.info('You add an vote :)');
      }
    });
  }
});

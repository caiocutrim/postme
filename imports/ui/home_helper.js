import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {ReactiveVar} from 'meteor/reactive-var';
// model
import {Posts} from '../api/models/posts';

import './home.html';

Template.recentPosts.onCreated(function () {
  // subscribe with pagination
  let instance = this;
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(4);

  instance.autorun(function() {
    let limit = instance.limit.get();
    let subscription = instance.subscribe('posts', limit);
    if (subscription.ready()) {
      instance.loaded.set(limit);
      $('.btn-load-more').html('Loading');
    }   
  });

  instance.posts = function() {
    return Posts.find({}, {
      limit: instance.loaded.get()
    });
  };
});


Template.recentPosts.helpers({
  posts () {
    return Template.instance().posts();
  },
  hasMorePosts() {
    return Template.instance().posts().count() >= Template.instance().limit.get();
  }
});

const isUserLogged = Meteor.userId();

Template.recentPosts.events({
  'click .remove-comment'(event) {
    let commentId = event.target.id;
    if (isUserLogged){
      Meteor.call('posts.removeComment', this._id, commentId, (err) => {
        if (err) {
          console.log(err);
          sAlert.error('You can not do this action.');
        }
        else {
          sAlert.info('Your comment has removed.');
        }
      });
    }
    else {
      sAlert.error('You need to be logged to do this action.');
    }
  },
  'click .comment-buttom' (event){
    if (isUserLogged || (isUserLogged != this.owner) || (isUserLogged === this.owner)) {
      const id = event.target.id;
      $(`#${id}.comment-form`).toggleClass('display-item');
    } 
    if (!isUserLogged) {
      console.log('clicked?');
      sAlert.info('You need be logged to comment this post');
      const id = event.target.id;
    }
  },
  'submit .comment-form'(event, instance) {
    event.preventDefault();
    let comment = event.target.comment.value;
    Meteor.call('posts.insertComment', this._id, comment, (err) => {
      if (err) {
        sAlert.error('This is embarasing, an error ocurred');
      } else {
        sAlert.info('Your comment was succesfuly posted');
        event.target.comment.value = '';
      }
    });
  },
  'click .btn-load-more'(event, instance) {
    event.preventDefault();
    let limit = instance.limit.get();
    console.log(limit);
    limit += 4;
    instance.limit.set(limit);
  },
  'click .upvote'(event) {
    event.preventDefault();
    Meteor.call('posts.upvote', this._id, (err) => {
      if (err) {
        sAlert.error(err.reason);
        $('.upvote').prop('title','You already upvoted this post');
      } else {
        sAlert.info('You add an vote :)');
      }
    });
  }
});

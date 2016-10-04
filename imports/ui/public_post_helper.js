import { Template } from 'meteor/templating';
import { Posts } from '../api/models/posts.js';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { sAlert } from 'meteor/juliancwirko:s-alert';

/*
 * ui
 */
import './public_posts.html';
import './post_edit.html';


Template.public_posts.onCreated(function public_posts_oncreated() {
  let instance = this;
  instance.autorun(() => {
    let user = Meteor.user().username;
    instance.subscribe('publicPostsByAuthor', user);
  });
  
});

Template.public_posts.helpers({
  posts() {
    let user = Meteor.user().username;
    return Posts.find({
      author: user,
      private: false
    });
  },
  numberOfComments() {
    if (this.comments === undefined) {
      return 0;
    } else {
      return this.comments.length;
    }
  },
  hasPosts() {
    let user = Meteor.user().username;
    return Posts.find({author: user, private: false}).count() != 0;
  }
});

Template.public_posts.events({
  'click .remove-comment'(event) {
    Meteor.call('posts.removeComment', this._id, this.comments[0]._id, (err) => {
      if (err) {
        console.log(err);
        sAlert.error('You can not do this action.');
      }
      else {
        console.log('removed!');
        sAlert.info('Your comment has removed.');
      }
    });
  },
  'click .btn-discuss'(event) {
    const id = event.target.id;
    console.log(id);
    $(`#${id}.comment-form`).toggleClass('display-item');
  },
  'submit .comment-form'(event, instance) {
    event.preventDefault();
    let comment = event.target.comment.value;
    Meteor.call('posts.insertComment', this._id, comment, (err) => {
      if (err) { console.log(err); }
      else {
        event.target.comment.value = '';
      }
    });
  },
  'click .update'(event) {
    let id = event.target.id;
    $(`.editlist#${id}`).toggleClass('display-item');
  },
  'submit .edit-form'(event) {
    event.preventDefault();
    let target = event.target;
    let site = target.site.value;
    Meteor.call('posts.updatePost', this._id, site, (err) => {
      if (err) {
        console.log(err);
      } else {
        sAlert.info('Post was updated.');
        target.site.value = '';
      }
    });
  },
  'click .private-btn'(event) {
    event.stopPropagation();
    let id = event.target.id;
    $("#"+id).removeClass('clicked-public').prop('title', 'Set as public post');
    $("#"+id).addClass('clicked-private').prop('title', 'Your post is private');
    Meteor.call('posts.setPostToPrivate', this._id, (err) => {
      if (err) { 
        console.log(err);
      } else {
        sAlert.info('Now your post is private!');
      }
    });
  },
  'click .public-btn'(event) {
    event.stopPropagation();
    let id = event.target.id;
    $("#"+id).removeClass('clicked-private').prop('title', 'Set as private post');
    $("#"+id).addClass('clicked-public').prop('title', 'Your post is public');
    Meteor.call('posts.setPostToPublic', this._id, (err) => {
      if (err) {
        console.log(err);
      } else {
        sAlert.info('Now your post is public!');
      }
    });
  },
  'click #remove'() {
    Meteor.call('posts.removePost', this._id, (err) => {
      if (err) {
        console.log(err);
      } else {
        sAlert.info('Post removed');
      }
    });
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

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Comments} from '../api/models/posts';
import './commentform.html';
import './comments.html';

Template.comments.onCreated(function () {
  Meteor.subscribe('comments');
});

Template.comments.helpers({
  isCommentOwner() {
    return this.userId === Meteor.userId();
  },
  comments() {
   return Comments.find({postId:this._id});
  }
});

Template.commentForm.events({
  'submit .comment-form'(event) {
    event.preventDefault();
    let postId = this._id;
    let body = event.target.comment.value;

    let comment = {
      body,
      postId
    };

    Meteor.call('comments.insertComment', comment, (err) => {
      if (err) {
        console.log(err);
        sAlert.error(err.reason);
      } else {
        sAlert.info('Your comment was succesfuly posted');
        event.target.comment.value = '';
      }
    });
  },
});

Template.comments.events({
  'click .remove-comment'(event) {
    Meteor.call('comments.removeComment', this._id, this.postId, (err) => {
      if (err) {
        console.log(err);
        sAlert.error('You can not do this action.');
      }
      else {
        sAlert.info('Your comment has been removed.');
      }
    });
  },
});
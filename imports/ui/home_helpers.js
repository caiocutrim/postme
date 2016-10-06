import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {ReactiveVar} from 'meteor/reactive-var';
// model
import {Posts} from '../api/models/posts';

import './home.html';
import './comments.html';
import './commentform.html';

//subdcriptions and init templates

Template.home.onCreated(function () {
  let instance = this;
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(4);
  
  instance.autorun(function () {
    let limit = instance.limit.get();
    
    console.log('> asking for '+limit+' posts...');
    
    let subscription = instance.subscribe('posts', limit);
    if (subscription.ready()) {
      console.log('> received '+limit+' posts');
      instance.loaded.set(limit);
    } else {
      console.log('> subscriptions is not ready yet. \n\n');
    }
  });
  
  instance.posts = function () {
    return Posts.find({}, {
      limit:instance.loaded.get()
    });
  }
  
});

Template.home.helpers({
  posts() {
    return Template.instance().posts();
  },
  hasMorePosts() {
    return Template.instance().posts().count() >= Template.instance().limit.get(); 
  },
});

const isUserLogged = Meteor.userId();


Template.home.events({
  'click .btn-load-more'(event, instance) {
    event.preventDefault();
    let limit = instance.limit.get();
    console.log(limit);
    limit += 4;
    console.log('now this limit is '+limit);
    instance.limit.set(limit);
  },
});


Template.recentPosts.events({ 
  'click .btn-discuss'(event) {
    const id = event.target.id;
    $(`#${id}.comment-form`).toggleClass('display-item');
  }
});


Template.recentPosts.events({
  'click .upvote'(event) {
    event.preventDefault();
    console.log('clicked');
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

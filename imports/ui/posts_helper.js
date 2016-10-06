import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Posts } from '../api/models/posts.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';

/*
 * ui dependencies
 */
import './message.html';
import './posts.html';
import './post_list.html';


Template.posts.events({
 'click .insertpost'() {
    $('#insert-form').css({'display':'block'});
  },
 'click .cancel'() {
    $('#insert-form').css({'display':'none'});
  }
});

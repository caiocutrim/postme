import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';

import './mainLayout.html';

Template.mainLayout.onCreated(function() {
  document.title = "Post-me: post everywhere"
});
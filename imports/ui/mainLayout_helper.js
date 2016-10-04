import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';

import './mainLayout.html';


Template.layout.helpers({
  pageTitle() {
    return Session.get('pageTitle');
  }
})
import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';


Meteor.startup(() => {
  if (Meteor.isClient) {
    sAlert.config({
        effect: 'bouncyflip',
        position: 'top-right',
        timeout: 3000,
        html: false,
    });
  }
});
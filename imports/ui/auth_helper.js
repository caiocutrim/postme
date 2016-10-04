import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {Template} from 'meteor/templating';
import {Accounts} from 'meteor/accounts-base';
import {FlowRouter} from 'meteor/kadira:flow-router';
/*ui*/
import './login.html';
import './signup.html';
import './alert.html';


Template.signup.events({
  'submit .auth-form' (event) {
    event.preventDefault();
    const target = event.target;
    const username = target.username.value;
    const email = target.email.value;
    const password = target.password.value;
    Accounts.createUser({
      username,
      email,
      password,
    }, function(err) {
        validateProcess(err);
        target.username.value = '';
        target.email.value = '';
        target.password.value = '';
      });
    }
});

function validateProcess (err) {
  if (err) {
    console.log(err);
    sAlert.error({
    }, {
      onClose() {
        console.log('it works?')
        FlowRouter.go('/');
      }
    }); 
    
  } else {
    sAlert.success({
      icon:'heart',
      message:'Created',
    },{
      onClose() {
        FlowRouter.go('/posts/private');
      }
    });
  }
}

Template.login.events({
  'submit .auth-form' (event) {
    $('.submit-buttom').prop('value', 'Please wait...')
    event.preventDefault();
    let target = event.target;
    let user = target.user.value;
    let password = target.password.value;
    Meteor.loginWithPassword(user, password, function(err) {
      if (err) {
        console.log(err)
      } else {
        $('.submit-buttom').prop('value', 'Login');
        FlowRouter.go('/posts/private');
      }
    })
  }
});

Template.navbar.helpers({
  displayUser() {
    return Meteor.user()
  }
})

Template.navbar.events({
  'click .logout'(){
    Meteor.logout(() => {
      console.log('you are out!');
      FlowRouter.go('/');
    });
  }
})
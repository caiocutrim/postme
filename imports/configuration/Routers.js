import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

/**user interface */
import '../ui/navbar.html';
import '../ui/mainLayout.html';
import '../ui/home.html';
import '../ui/login.html';
import '../ui/signup.html';
import '../ui/private_posts.html';
import '../ui/public_posts.html';
import '../ui/post_insert_form.html';
import '../ui/post_edit.html';
import '../ui/post_list.html';
import '../ui/post_edit.html';
import '../ui/best_posts.html';
import '../ui/posts.html';
/**./user-interface */

//our routes
FlowRouter.route('/', {
  name: "home",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"home"
    });
  }
});

FlowRouter.route('/login', {
  name: "login",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"login"
    });
  }
});

FlowRouter.route('/signup', {
  name: "signup",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"signup"
    });
  }
});

FlowRouter.route('/posts/all/:userid', {
  name: "posts",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"posts"
    });
  }
});

FlowRouter.route('/posts/public', {
  name: "public_posts",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"public_posts"
    });
  }
});

FlowRouter.route('/posts/private', {
  name: "private_posts",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"private_posts"
    });
  }
});

FlowRouter.route('/posts/public/best', {
  name: "public_posts_best",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"best_posts"
    });
  }
});

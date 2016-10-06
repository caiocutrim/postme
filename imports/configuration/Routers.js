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
import '../ui/profile.html';
import '../ui/settings.html';
import '../ui/notfound.html';
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

FlowRouter.route('/profile', {
  name: "profile",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"profile"
    });
  }
});

FlowRouter.route('/settings', {
  name: "settings",
  action() {
    BlazeLayout.render('mainLayout', {
      content:"settings"
    });
  }
});


// send 404 if route not defined
if (Meteor.isServer) {
  WebApp.connectHandlers.use("/", function(req, res, next) {
    var isValidRoute = false;
    for(var i=0; i<FlowRouter._routes.length; i++){
      if (req.url == FlowRouter._routes[i].path) {
        isValidRoute = true;
        break;
      }
    }
    if(isValidRoute) {
      next();
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });
}
FlowRouter.notFound = {
  action:function() {
    BlazeLayout.render('mainLayout', {
      content:"notfound"
    });
  }
}
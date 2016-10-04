import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Posts = new Mongo.Collection('posts');
if (Meteor.isServer) {
  if (Posts.find().count() === 0) {
    Posts.insert({
      title: 'Introducing telescope',
      author: 'Sasha Greif',
      url: 'http://sashagreif.com/introducing-telescope',
      // creator: Meteor.user().username,
      // owner: Meteor.userId(),
      private: false, // public post is default
      createdAt: new Date(),
      upvoters: [],
      votes: 0,
    });
    Posts.insert({
      title: 'Meteor',
      author: 'Tom Coleman',
      url: 'http://meteor.com',
      // creator: Meteor.user().username || 'caio',
      // owner: Meteor.userId(),
      private: false, // public post is default
      createdAt: new Date(),
      upvoters: [],
      votes: 0,
    });
    
    Posts.insert({
      title: 'The Meteor Book',
      author: 'Tom Coleman',
      url: 'http://themeteorbook.com',
      // creator: Meteor.user().username,
      // owner: Meteor.userId(),
      private: false, // public post is default
      createdAt: new Date(),
      upvoters: [],
      votes: 0,
    });
  }
  /*
  * just public post
  */
  Meteor.publish('allPosts', () => {
    return Posts.find({}, {
      $sort: {
        createdAt : -1
      }
    });
  });
  
  Meteor.publish('publicPostsByAuthor', (author) => {
    Meteor._sleepForMs(2000); // to test animation
    return Posts.find({
        private: false,
        author,
      });
  });
  
  Meteor.publish('privatePostsByAuthor', (author) => {
    Meteor._sleepForMs(2000); // to test animation
    return Posts.find({
        private: true,
        author
      });
  });
  
  Meteor.publish('postsByAuthor', (author) => {
    Meteor._sleepForMs(2000);
    return Posts.find({author:author});
  });
  Meteor.publish('posts', function (limit) {
    Meteor._sleepForMs(2000);
    return Posts.find({
      $or:[{
        owner: this.userId
      }, {
        private: {
          $ne: true
        }
      }]
    }, {
      limit
    });
  });
}

Meteor.methods({
  'posts.insertPost'(title, url) {
    Posts.insert({
      title,
      url,
      author: Meteor.user().username,
      owner: Meteor.userId(),
      private: false, // public post is default
      createdAt: new Date(),
      upvoters: [],
      votes: 0,
    }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
      }
    });
  },
  'posts.updatePost' (post_id, site) {
    Posts.update({_id: post_id}, {
      $set: {
        site
      }
    }, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  },
  'posts.removePost'(_id){
    Posts.remove({_id});
  },
  'posts.setPostToPublic'(_id) {
    Posts.update({_id}, {
      $set:{
        private: false
      }
    });
  },
  'posts.setPostToPrivate'(_id) {
    Posts.update({_id}, {
      $set:{
        private: true
      }
    });
  },
  'posts.insertComment'(_id, comment) {
    Posts.update({_id}, {
      '$push': {
        comments: {
          _id: new Meteor.Collection.ObjectID()._str,
          text: comment,
          userThatCommented: Meteor.user().username,
          owner: Meteor.userId(),
          comment: 'posted',
          createdAt:new Date()
        }
      }
    });
  },
  'posts.removeComment'(postId, commentId) {
    Posts.update({
      "_id": postId,
      "comments._id": commentId,
      "comments.owner": Meteor.userId(),
      "comments.userThatCommented": Meteor.user().username
    },{
      "$pull": {
        "comments": {"_id": commentId}
      }
    }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      } 
    });
  },
  'posts.upvote'(postId) {
    let user = Meteor.user();
    if (!user) 
    throw new Meteor.Error(401, "You need to login to upvote");
    let post = Posts.findOne(postId);
    if (!post)
      throw new Meteor.Error(422, 'Posts not found');
    if (_.include(post.upvoters, user._id))
      throw new Meteor.Error(422, 'Already upvoted this post');
    Posts.update(post._id, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  }
});

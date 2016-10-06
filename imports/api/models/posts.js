import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Posts = new Mongo.Collection('posts');
export const Comments = new Mongo.Collection('comments');

if (Meteor.isServer) {
  /*
  * just public post
  */
  Meteor.publish('posts', (limit) => {
    Meteor._sleepForMs(500); // to test animation
    return Posts.find({private:false}, {
      $sort: {
        createdAt : -1
      },
      limit:limit
    });
  });
  
  Meteor.publish('bestposts', () => {
    Meteor._sleepForMs(500); // to test animation
    return Posts.find({private:false}, {
      $sort: {
        votes : -1
      }
    });
  });
  Meteor.publish('publicPostsByAuthor', (author) => {
    Meteor._sleepForMs(500); // to test animation
    return Posts.find({
        private: false,
        author,
      });
  });
  
  // comments
  Meteor.publish('comments', function() {
    return Comments.find();
  });
  
  Meteor.publish('privatePostsByAuthor', (author) => {
    Meteor._sleepForMs(500); // to test animation
    return Posts.find({
        private: true,
        author
      });
  });
  
  Meteor.publish('postsByAuthor', (author) => {
    Meteor._sleepForMs(500);
    return Posts.find({author:author});
  });
  
  Meteor.publish('postsWithLimit', function (limit) {
    Meteor._sleepForMs(500);
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
// methods
Meteor.methods({
  'posts.insertPost'(title, url) {
    Posts.insert({
      title,
      url,
      author: Meteor.user().username,
      owner: Meteor.userId(),
      private: false, // public post is default
      createdAt: new Date().getTime(),
      upvoters: [],
      votes: 0,
      commentsCount: 0
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
  'comments.insertComment'(commentProperties) {
    let user = Meteor.user();
    let post = Posts.findOne(commentProperties.postId);
    
    if (!user) {
      throw new Meteor.Error(401, 'You need to login to make comments');
    }
    
    if (!commentProperties.body) {
      throw new Meteor.Error(422, 'please write some content :)');
    }
    
    if (!post) {
      throw new Meteor.Error(422, 'You must comment on a post');
    }
    
    const comment = _.extend(commentProperties, {
      userId: user._id,
      author: user.profile.firstname || user.username, 
      submitted: new Date().getTime(),
    });
    
    Posts.update(comment.postId, {$inc:{
      commentsCount: 1
    }});
    
    comment._id = Comments.insert(comment); 
    
    return comment._id;
    
  },
  'comments.removeComment'(commentId, postId) {
      let user = Meteor.user();
      let post = Posts.findOne({_id:postId});
      if (!user) {
        throw new Meteor.Error(401, 'You need to login to make comments');
      }
      if (!post) {
        throw new Meteor.Error(422, 'You must comment on a post');
      }
      
      Posts.update(postId, {$inc:{
        commentsCount: -1
      }});
      
    return Comments.remove({_id:commentId});
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
      
    Posts.update({
      _id:post._id,
      upvoters:{$ne:user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  }
});

const ownsDocument = function(userId, doc) { 
  return doc && doc.userId === userId
} 

Posts.allow({ 
  update: ownsDocument,
  remove: ownsDocument
});


Posts.deny({
  update(userId, post, fieldNames) {
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
})
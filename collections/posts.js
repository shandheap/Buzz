Posts = new Meteor.Collection('posts');

Posts.allow({
	update: ownsDocument,
	remove: ownsDocument
});

Posts.deny({
	update: function(userId, post, fieldNames) {
		// May only edit the following three fields:
		return (_.without(fieldNames, 'url', 'title').length > 0);
	}
});

Meteor.methods({
	post: function(postAttributes) {
		var user = Meteor.user(),
			postWithSameLink = Posts.findOne({url: postAttributes.url});

		// Ensure user is logged in
		if (!user) 
			throw new Meteor.Error(401, "You need to login to post new articles.");

		// Ensure that the post has a title
		if (!postAttributes.title) 
			throw new Meteor.Error(422, "Please fill in a headline for your article.");

		// Ensure that the post is not a duplicate
		if (postAttributes.url && postWithSameLink) {
			throw new Meteor.Error(302,
				"This link has already been posted.",
				postWithSameLink._id);
		}

		var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime(),
			commentsCount: 0,
			upvoters: [],
			votes: 0
		});

		var postId = Posts.insert(post);

		return postId;	
	},

	upvote: function(postId) {
		var user = Meteor.user();

		// Ensure user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to upvote");

		var post = Posts.findOne(postId);

		// Ensure that the post exists
		if (!post)
			throw new Meteor.Error(422, "Post not found");

		// Check if user is the author of the post
		if (user.username == post.author)
			throw new Meteor.Error(422, "You can't upvote your own post");

		// Check if user has already upvoted the post
		if (_.include(post.upvoters, user._id))
			throw new Meteor.Error(422, "You've already upvoted this post");

		Posts.update(post._id, {
			$addToSet: {upvoters: user._id},
			$inc: {votes: 1}
		});
	}
});
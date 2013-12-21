Posts = new Meteor.Collection('posts');

Posts.allow({
	insert: function(userId, doc) {
		//Only allow positng if user is logged in
		return !! userId;
	}
});
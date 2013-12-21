Posts = new Meteor.Collection('posts');

Posts.allow({
	update: ownsDocument,
	remove: ownsDocument
});

Meteor.methods({
	update: function(userId, post, fieldNames) {
		// May only edit the following three fields:
		return (_.without(fieldNames, 'url', 'title').length > 0);
	}
});
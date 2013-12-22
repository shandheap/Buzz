Template.postEdit.helpers({
	post: function() {
		return Posts.findOne(Session.get('currentPostId'));
	}
});

Template.postEdit.events({
	'submit form': function(e) {
		e.preventDefault();

		var currentPostId = Session.get('currentPostId');

		var postProperties = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		};

		Posts.update(currentPostId, {$set: postProperties}, function(error) {
			if (error) {
				// Display the error to the user
				error.reason = "Access denied: You are not the owner of this post"
				Meteor.Errors.throw(error.reason);
			} else {
				Meteor.Router.to('postPage', currentPostId);
			}
		});
	},

	'click .delete': function(e) {
		e.preventDefault();

		if (confirm("Delete this post?")) {
			var currentPostId = Session.get("currentPostId");
			Posts.remove(currentPostId, function(error) {
				if (error) {
					// Display error to the user
					error.reason = "Access denied: You are not the owner of this post"
					Meteor.Errors.throw(error.reason);
				}
			});
			Meteor.Router.to('postsList');
		};
	}
});
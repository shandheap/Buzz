Template.commentSubmit.events({
	'submit form': function(event, template) {
		event.preventDefault();

		var comment = {
			body: $(event.target).find('[name=body]').val(),
			postId: template.data._id
		};

		// Clean the form input
		$(event.target).find('[name=body]').val("");

		Meteor.call('comment', comment, function(error, commentId) {
			error && Meteor.Errors.throw(error.reason);
		});
	}
});
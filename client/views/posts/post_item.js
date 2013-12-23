Template.postItem.helpers({ 
	ownPost: function() {
		return this.userId == Meteor.userId();
	},

	domain: function() {
		var a = document.createElement('a'); 
		a.href = this.url;
		return a.hostname;
	},

	upvotedClass: function() {
		var userId = Meteor.userId();
		if (userId && !_.include(this.upvoters, userId) && this.userId != userId) {
			return "btn-primary upvoteable";
		} else {
			return "disabled";
		}
	},

	isDiscussion: function() {
		return window.location.pathname.match(/posts/);
	}
});

Template.postItem.rendered = function() {
	// Animate post from previous position to new position
	var instance = this;
	var rank = instance.data._rank;
	var $this = $(this.firstNode);
	var postHeight = 80;
	var newPosition = rank * postHeight;

	// If element has a currentPosition (i.e. it's not the first ever render)
	if (typeof(instance.currentPosition) !== 'undefined') {
		var previousPosition = instance.currentPosition;
		// Calculate the difference between old position and new position
		// and move element accordingly
		var delta = previousPosition - newPosition;
		$this.css("top", delta + "px");
	} else {
		// It's the first ever render, so hide element
		$this.addClass("invisible");
	}

	// Draw element in the old position
	Meteor.defer(function() {
		instance.currentPosition = newPosition;
		// Bring element back to its new original position
		$this.css("top", "0px").removeClass("invisible");
	});
};

Template.postItem.events({
	'click .upvoteable': function(event) {
		event.preventDefault();
		Meteor.call('upvote', this._id, function(error) {
			if (error)
				Meteor.Errors.throw(error.reason);
		});
	}
});
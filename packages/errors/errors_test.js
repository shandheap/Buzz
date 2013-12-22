Tinytest.add("Errors collection works", function(test) {
	test.equal(Meteor.errors.find({}).count(), 0);

	Meteor.Errors.throw("New error for testing");
	test.equal(Meteor.errors.find({}).count(), 1);

	Meteor.errors.remove({});
});

Tinytest.addAsync("Errors template works", function(test, done) {
	Meteor.Errors.throw("New error for testing");
	test.equal(Meteor.errors.find({seen: false}).count(), 1);

	// Render the Errors template
	OnscreenDiv(Spark.render(function() {
		return Template.meteorErrors();
	}));

	// Timeout for a few milliseconds
	Meteor.setTimeout(function() {
		// Check if error seen boolean has been set to true
		test.equal(Meteor.errors.find({seen: false}).count(), 0);
		// Check to see if error still exists
		test.equal(Meteor.errors.find({}).count(), 1);
		Meteor.Errors.clear();

		test.equal(Meteor.errors.find({seen: true}).count(), 0);
		done();
	}, 500);
});
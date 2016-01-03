$(function() {

	var Schedule = Backbone.Model.extend({ });

	var Schedules = Backbone.Collection.extend({
		model: Schedule,
		url: ''
	});

	var SchedulesView = Backbone.View.extend({
		/*
		 * Set up templates
		 */

		template: _.template( $('#schedule-template').html() ),
		todayTemplate: _.template( $('#today-template').html() ),


		/*
		 * Initialize the app.
		 */

		initialize: function() {
			var data = csvToJson.go('data/schedule.csv');

			this.collection = new Schedules();
			this.collection.add(data);

			// Set "today's" date (meaning anything before 4am).
			this.setToday();

			// Render the page.
			this.render();
			this.format();	// initially format the view.

			// Check to see if the formatting needs to be updated every minute.
			var _this = this;
			setInterval(function(){ _this.format(); }, 60000);
		},


		/*
		 * Main render function.
		 */

		render: function() {
			var _this = this;

			// Display "today's" date.
			this.displayDate();

			// Display each of the performers for today.
			_.each(this.collection.models, function(model){
				_this.displayPerformer(model);
			});
			
			return this;
		},


		/*
		 * Set "today's" date, meaning anything from today until 4am tomorrow.
		 */

		setToday: function() {
			this.today = new Date();

			if (this.today.getHours() < 4) {
				this.today.setDate(this.today.getDate() - 1);
			}
		},


		/*
		 * Display "today's" date on the screen.
		 */

		displayDate: function() {
			var html = this.todayTemplate({today: this.today.toDateString()});
			$('.schedule__section--today').append(html);
		},


		/*
		 * Display each performer, if they are playing today.
		 */

		displayPerformer: function(model) {
			var showDate = new Date(model.get('showDate'));

			if (showDate.toDateString() == this.today.toDateString()) {
				var dateObj = new Date(model.get('time'));
				model.set('displayTime', dateObj.toLocaleTimeString().replace(/:\d+ /, ' '));

				var html = this.template({model: model.toJSON()});
				$('.schedule__section').append(html);
			}
		},


		/* 
		 * Format the performer list to highlight the current performer based on current time.
		 */

		format: function() {
			var current = new Date();
			var _this = this;

			_.each(this.collection.models, function(model){
				// Start time is the time specified in the data.
				var start = new Date(model.get('time'));

				// End time assumes 25 minute sets.
				var end = new Date(start.getTime() + 25*60*1000);

				var el = $('#' + model.get('id'));

				// Switch the current performer if the current time falls between start and end time.
				if (current > start && current < end && !el.hasClass('current')) {
					$('.schedule__p').removeClass('current');
					el.addClass('current');
					el.prevAll().addClass('hide');
				}
			});
		}
	});


	var schedulesView = new SchedulesView();	
});
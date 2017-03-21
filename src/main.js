"use strict";

(($, videojs) => {

	const _ = require("underscore");
	const Plugin = videojs.getPlugin('plugin');
	const Annotation = require("./modules/annotation").class;
	
	const BASE_STATE = Object.freeze({
		active: false,					// Is annotation mode active?
		viewing_annotation_index: null,	// Index of currently expanded/visible annotation (null if none)
		annotations: []					// Array of Annotaiton instances
	});

	class Main extends Plugin {

		constructor(player, options) {
	    	super(player, options);

	    	this.player = player;
	    	this.on('statechanged', this.stateChanged);

	    	this.drawUI(player);

	    	// setup initial state after video is loaded
	    	// TODO - use plugin.defaultState? Or is this better as we freeze it and must wait for meta load anyway
	    	var self = this;
	    	player.on("loadedmetadata", () => {
		    	let state = _.clone(BASE_STATE),
		    		duration = player.duration(),
		    		$timeline = $(player.el()).find('.vjs-progress-control');
		    	state.annotations = annotations.map((a) => new Annotation($timeline, a, duration));
		    	self.setState(state);
		    });
	  	}

	  	drawUI() {
	  		this.components = {}; // Component references - TODO is this needed? creates memory-leaking closures

	  		var self = this;
	  		var Component = videojs.getComponent('Component');

	  		// Add button to player
	  		// TODO - clean this shit up - move this & bubble to seperate component module file??
	  		this.components.playerBtn = player.getChild('controlBar').addChild('button', {});
	  		this.components.playerBtn.addClass('vac-player-btn');
		  	this.components.playerBtn.on('click', () => {
	  			self.components.playerBtn.toggleClass('vac-active');
	  			self.toggleAnnotations();
	  		});
	  		this.components.playerBtn.controlText("Toggle Animations");
	  	}

	  	toggleAnnotations() {
	  		var active = !this.state.active;
	  		this.setState({active});
	  		this.player.toggleClass('vac-active'); // Toggle global class to player to toggle display of elements
	  	}

	  	dispose() {
	    	super.dispose();
	    	videojs.log('the advanced plugin is being disposed');
	  	}

	  	updateAnnotationBubble () {
	  		var $el = $(this.components.playerBtn.el()),
	  			$bubble = $el.find(".vac-bubble");
	  		
	  		if(!$bubble.length){
	  			$bubble = $("<b/>");
	  			$el.append($bubble);
	  		}

	  		var num = this.state.annotations.length;
	  		$bubble.text(num);
	  		num > 0 ? $el.addClass('show') : $el.addClass('hide');
	  	}

	  	stateChanged() {
	    	console.log('State updated', this.state);
	    	this.updateAnnotationBubble(); // TODO - only fire if needed
	  	}
	}

	videojs.registerPlugin('annotationComments', Main);

})(jQuery, window.videojs);

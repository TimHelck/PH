import React, { Component } from 'react';
import Gallery from './Gallery';
import 'whatwg-fetch';
import Request from 'superagent';

class DataContainer extends Component {

	constructor(props){
		super(props);
		this.state={ pictureData: {}};	
		this.callbacks = {
			saveModifiedPicture:     this.saveModifiedPicture.bind(this),
			saveGalleryDescription:  this.saveGalleryDescription.bind(this),
			saveAll:                 this.saveAll.bind(this),
			deletePicture:           this.deletePicture.bind(this),
			deleteSubGallery:        this.deleteSubGallery.bind(this),
			deleteGallery:           this.deleteGallery.bind(this),
			cutPicture:              this.cutPicture.bind(this),
			cutGallery:              this.cutGallery.bind(this),
			cutSubGallery:           this.cutSubGallery.bind(this),
			insertPicture:           this.insertPicture.bind(this),
			insertPictureAtTop:      this.insertPictureAtTop.bind(this),
			insertSubGallery:        this.insertSubGallery.bind(this),
			insertGallery:           this.insertGallery.bind(this),
			insertRelatedPictures:   this.insertRelatedPictures.bind(this),
			addNewPicture:           this.addNewPicture.bind(this),
			addNewTopPicture:        this.addNewTopPicture.bind(this),
			addNewRelatedPictures:   this.addNewRelatedPictures.bind(this),
			addNewSubGallery:        this.addNewSubGallery.bind(this),
			addNewGallery:           this.addNewGallery.bind(this),
			showImageSelector:       this.showImageSelector.bind(this),
			setImage:                this.setImage.bind(this)
		};
	}

	// this function compares data AND updates it, so it needs a better name
	hasDataChanged(stateData, inputs) {
		var ret = false;
		for (let input of inputs) {
			if(input.type !== "submit") {
				for (let inputClassName of input.className.split(' ')) {
					if(stateData[inputClassName] != null) {
						if(stateData[inputClassName] !== input.value) {
							stateData[inputClassName] = input.value;
							ret = true;
						}
					}
					else if(input.value !== null) {
						stateData[inputClassName] = input.value;
						ret = true;
					}
				}
			}
		}
		return ret;
	}

	saveModifiedPicture(event){
		var pn  = event.target.parentNode;
		var pnc = pn.children;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		// use pathArray to point node to the part of state.pictureData that has the
		// (possibly) modified fields, then compare with the inputs in the DOM.
		while(pathArray.length && node) {
			node = node[pathArray.shift()];
		}
		var updateFlag = this.hasDataChanged(node, pnc);
		if(updateFlag) {
			this.setState({'pictureData': this.state.pictureData});
			this.saveStateToDisk(false);
		}
	}
	
	saveGalleryDescription(event) {
		var description = event.target.parentNode.children[0].value;
		var pn  = event.target.parentNode.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			var x = pathArray.shift();
			node = node[x];
		}
		node.description = description;
		this.setState({'pictureData': this.state.pictureData});
		this.saveStateToDisk(false);
	}
	
	saveAll() {
		this.setState({'pictureData': this.state.pictureData});
		this.saveStateToDisk(false);
	}

	saveStateToDisk(log){
	    var url = '../../galleryImages/fileApi.php';
		if(document.location.host.match(/localhost/)) {
			url = 'http://127.0.0.1:8125/';
		}
console.log("Line 99: " + url);
/*		.type('application/x-www-form-urlencoded')
		.set('Content-Type', 'application/json')
		
		Original:
		.set('Accept', 'text/plain')
*/
		Request
		.post(url)
		.send(JSON.stringify(this.state.pictureData))
		.set('Accept', 'text/plain')
		.end(function(err, res){
			if (err || !res.ok) {
				console.log('Oh no! error');
			} else {
				console.log('yay got ' + JSON.stringify(res.body));
			}
		});
	}

	deletePicture(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]);
		if(typeof index === 'number') {
			node.splice(index, 1);
			this.setState({'pictureData': this.state.pictureData});
		}
	}
		
	deleteGallery(event){
		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 2 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray.shift(), 10);
		
		if(typeof index === 'number') {
			delete(node[index]);
			this.setState({'pictureData': this.state.pictureData});
		}
	}

	deleteSubGallery(event){
		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = pathArray[0];
		
		if(index === 'relatedPictures' || index === 'pictures') {
			delete(node[index]);
			this.setState({'pictureData': this.state.pictureData});
		}
	}
	
	cutPicture(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]);
		this.state.clipboardPicture = node[index];

		if(typeof index === 'number') {
			node.splice(index, 1);
			this.setState({'pictureData': this.state.pictureData});
		}
	} 
	
	cutGallery(event){
		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 2 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray.shift(), 10);

		this.state.clipboardGallery = node[index];

		if(typeof index === 'number') {
			node.splice(index, 1);
			this.setState({'pictureData': this.state.pictureData});
		}
	} 

	cutSubGallery(event){
		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = pathArray[0];
		this.state.clipboardGallery = node[index];

		if(index === 'relatedPictures' || index === 'pictures') {
			delete(node[index]);
			this.setState({'pictureData': this.state.pictureData});
		}
	} 

	insertPictureAtTop(event){
		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 0 && node) {
			node = node[pathArray.shift()];
		}
		var index = 0;
		if(typeof index === 'number' && this.state.clipboardPicture) {
			node.splice(index, 0, this.state.clipboardPicture);
			delete this.state.clipboardPicture;
			this.setState({'pictureData': this.state.pictureData});
		}
		else {
			console.log("insertPictureNodeAtTop -- unable to insert " + this.state.clipboardPicture.title + " at " + pn.dataset.path + "."); 
		}
	} 

	insertPicture(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]) || 0;
		if(typeof index === 'number' && this.state.clipboardPicture) {
			node.splice(index + 1, 0, this.state.clipboardPicture);
			delete this.state.clipboardPicture;
			this.setState({'pictureData': this.state.pictureData});
		}
		else {
			console.log("insertPictureNode -- unable to insert " + this.state.clipboardPicture.title + " at " + pn.dataset.path + "."); 
		}
	} 
	

	insertSubGallery(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]) || 0;
		if(typeof index === 'number' && this.state.clipboardGallery) {
			node[index].pictures = this.state.clipboardGallery;
			delete this.state.clipboardGallery;
			this.setState({'pictureData': this.state.pictureData});
		}
		
	} 
	
	insertGallery(event){
		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 0 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray[0]) || 0;
		if(typeof index === 'number' && this.state.clipboardGallery) {
			node.splice(index, 0, this.state.clipboardGallery);
			delete this.state.clipboardGallery;
			this.setState({'pictureData': this.state.pictureData});
		}
	} 

	addNewGallery(event){
		// this may not exactly be the React.js way of doing things.
		var newGalleryName = document.getElementById("newGalleryTitle").value;
		if(newGalleryName === '' || newGalleryName === 'REQUIRED FIELD') {
			document.getElementById("newGalleryTitle").value = 'REQUIRED FIELD';
			return;
		}
		document.getElementById("newGalleryTitle").value = '';

		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 0 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray[0]) || 0;
		var newNode = { 
			"title": newGalleryName, 
			"pictures": new Array
		};

		if(typeof index === 'number') {
			node.splice(index, 0, newNode);
			this.setState({'pictureData': this.state.pictureData});
		}
		
	} 

	insertRelatedPictures(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]) || 0;
		if(typeof index === 'number' && this.state.clipboardGallery) {
			node[index].relatedPictures = this.state.clipboardGallery;
			delete this.state.clipboardGallery;
			this.setState({'pictureData': this.state.pictureData});
		}
		else {
			console.log("insertPictureNode -- unable to insert " + this.state.clipboardGallery.title + " at " + pn.dataset.path + "."); 
		}
	} 
	
	addNewPicture(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]);
		if(typeof index === 'number') {
			var newNode = { 
				"imageFile": "imageRequired", 
				"fileSizes":{ "th": 1, "reg": 1, "lg": 0 }, 
				"title": "", 
				"medium": "", 
				"description": "" 
			};
			node.splice(index + 1, 0, newNode);
			this.setState({'pictureData': this.state.pictureData});
		}
	}
	
	addNewTopPicture(event){
		var pn  = event.target.parentNode.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = pathArray[0];
		if(index === 'relatedPictures' || index === 'pictures') {
			var newNode = { 
				"imageFile": "imageRequired", 
				"fileSizes":{ "th": 1, "reg": 1, "lg": 0 }, 
				"title": "", 
				"medium": "", 
				"description": "" 
			};
			node[index].unshift(newNode);
			this.setState({'pictureData': this.state.pictureData});
		}
	}
	
	addNewRelatedPictures(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		var error;
		while(pathArray.length && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(index, 10);
		if(node.pictures) {
			error = "There is already a Sub-gallery. You cannot have a Sub-gallery and a Related Pictures Gallery on the same node.";
		}
		else if(node.relatedPictures) {
			error = "Related Pictures Gallery already exists!!!";
		}
		if(error == null) {
			if(typeof index === 'number') {
				node.relatedPictures = new Array;
				this.setState({'pictureData': this.state.pictureData});
			}
		}	
		else {
			console.log("*** ERROR *** " + error);
		}
	}	
	
	addNewSubGallery(event){
		var pn  = event.target.parentNode;
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		var error;
		while(pathArray.length && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(index, 10);
		if(node.relatedPictures) {
			error = "There is already a Related Pictures Gallery. You cannot have a Sub-gallery and a Related Pictures Gallery on the same node.";
		}
		else if(node.pictures) {
			error = "Sub-gallery already exists!!!";
		}
		if(error == null) {
			if(typeof index === 'number') {
				node.pictures = new Array;
				this.setState({'pictures': this.state.pictureData});
			}
		}
		else {
			console.log("*** ERROR *** " + error);
		}
	}	
	
	showImageSelector(event){
		if(this.notTheFirstTime) {
			this.setImage(event);
			return;
		}
		this.notTheFirstTime = true;
		var n  = event.target;
		if(n.nodeName === "SELECT") {
		let imgData = this.state.imageData || [];
			imgData.map((imageFile, i) => {
				var imageFileDisplay = imageFile.substr(0, imageFile.length-3);
				var sizes = imageFile.substr(imageFile.length-3);
				var newOption = new Option(imageFileDisplay, imageFileDisplay);
				newOption.sizes = sizes;
				n.options[i+1] = newOption;
			});
		}
	}


	setImage(event){
		var t    = event.target;
		if(t.nodeName === "OPTION") {
			var pn   = event.target.parentNode;
			var ppn  = pn.parentNode;
			var pppn  = ppn.parentNode;
			var thumbnail = pppn.getElementsByClassName('thImage')[0];

			var imageData = event.target.value;
		var imgSrc = '../../galleryImages/thumbnail/' + imageFile + '.jpg';
		if(document.location.host.match(/localhost/)) {
			imgSrc = './newImageGallery/thumbnail/' + imageFile + '.jpg';
		}

//			var imgSrc = './galleryImages/th/' + imageData + '_th.jpg';
			thumbnail.src = imgSrc;
			ppn.getElementsByClassName('th')[0].value  = t.sizes[0];
			ppn.getElementsByClassName('reg')[0].value  = t.sizes[1];
			ppn.getElementsByClassName('lg')[0].value  = t.sizes[2];
		}
	}


	loadPictureData() {
	    var url = '../../galleryImages/pictureData.json';
		if(document.location.host.match(/localhost/)) {
			url = './pictureData.json';
		}

 	    //return fetch('./pictureData.json')
 	    return fetch(url)
		.then(response => response.json())
		.then(responseData => this.setState({pictureData: responseData}))
		.catch(error => console.log('Error fetching and parsing data', error));
	}


	// resource: https://www.youtube.com/watch?v=jZDc-o7Mkdc
	// Mar 11 2017 -- changed request type from 'application/json' to 'application/x-www-form-urlencoded'
	getImageFiles() {
	    var url = '../../galleryImages/fileApi.php';
		if(document.location.host.match(/localhost/)) {
			url = 'http://127.0.0.1:8125/';
		}
//console.log("Line 496: " + url);
		Request.get(url)
		.type('application/x-www-form-urlencoded')
		.then((response) => {
		  this.setState({
		  	// I think that this should work, but it doesn't:
			// imageData: response.body
			imageData: JSON.parse(response.req.xhr.response)
		  });
		});



	}

	componentDidMount(){
		this.loadPictureData()
		.then(this.getImageFiles());
	}
	
	
	render() {
		return (<Gallery 
			galleries                       = {this.state.pictureData.galleries} 
			imageFiles                      = {this.state.pictureData.imageFiles} 
			imageData                       = {this.state.imageData} 
			callbacks                       = {this.callbacks}
			clipboardPicture                = {this.state.clipboardPicture} 
			clipboardGallery                = {this.state.clipboardGallery} 
		/> );
		
	}
};

export default DataContainer;

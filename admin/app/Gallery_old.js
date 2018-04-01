import React, { Component } from 'react';
import PictureList from './PictureList';

class Gallery extends Component {
	handleSubmit(e) {

console.log("Line 7");
	}

	handleImageChange(e) {
console.log("Line 10");
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
window.file = file;
console.log(window.file);
	}
/*
		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
		}
		reader.readAsDataURL(file)


var input = document.querySelector('input[type="file"]')
 
var data = new FormData()
data.append('file', input.files[0])
data.append('user', 'hubot')
 
fetch('/avatars', {
  method: 'post',
  body: data
})

	componentDidMount(){
		fetch('./pictureData.json')
		.then(response => response.json())
		.then(responseData => this.setState({pictureData: responseData}))
		.catch(error => console.log('Error fetching and parsing data', error));

	}


*/

	handleSubmit(e) {
console.log("Line 41");
console.log(window.file);
		e.preventDefault();
		fetch('/trystuff/x.html', {
  			method: 'post',
  			body: window.file
		});
//		let reader = new FileReader();
//		let file = e.target.files[0];
//console.log(file);
	}

	render() {

		let x = this.props.galleries || [];
		let  galleries;
		galleries = x.map((gallery, i) => {

			var path = 'galleries.' + i + '.pictures';
			var reactKey = path + gallery.title;
			return <PictureList 
				path         = {path}
				listType     = 'gallery'
				title        = {gallery.title}
				key          = {reactKey}
				description  = {gallery.description}
				gallery      = {gallery.pictures}
				imageFiles   = {this.props.imageFiles}
				callbacks    = {this.props.callbacks}
				galleryLevel = 'top'
			/>
		});
		let className = 'gallery';
		if     (this.props.clipboardPicture) { className += ' clipboardPicture'; }
		else if(this.props.clipboardGallery) { className += ' clipboardGallery'; }
//console.log("Line 29: " + className);
//console.log(this.props.clipboardPicture);
//console.log(this.props.imageFiles);
//console.log(this.props.spareParts);
//console.log(this.props);
//console.log(this.props.clipboardGallery);
		return (
				<div className={className} data-path='galleries'>
				<h1>Peter Helck</h1>
				<div className='buttons'>
					<span className='label'>New Gallery Name</span>
					<input type='text' className='title' id='newGalleryTitle' />
					<button onClick={this.props.callbacks.addNewGallery} className='add galleryNode'>Add New Gallery</button>
					<button onClick={this.props.callbacks.insertGallery} className='insert galleryNode'>Insert Gallery</button>
				</div>
				<div className="previewComponent">
					<form onSubmit={(e)=>this.handleSubmit(e)}>
						<span className='label'>Load New Image</span>
						<input className="fileInput" type="file" onChange={(e)=>this.handleImageChange(e)} />
						<button className="submitButton" type="submit" onClick={(e)=>this.handleSubmit(e)}>Upload Image</button>
					</form>
					<div className="imgPreview">
					</div>
				</div>

				{galleries}
			</div>
		);
	};
}

export default Gallery;

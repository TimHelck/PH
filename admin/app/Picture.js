import React, { Component } from 'react';
import PictureList from './PictureList';

class Picture extends Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event){
		var target = event.target ? event.target : event;
		this.props.onUserSubmit(target);
	}
	
	toggleDetails(e) {
		this.setState({showDetails: !this.state.showDetails});
		e.stopPropagation();
	}
	
	render() {

	    var subPictureList = "";
	    var relatedPictureList = "";
		var className = "picture";
		if(this.props.pictures){

			var title = 'Sub-gallery for "' + this.props.title +'":';
			var path = this.props.path + '.pictures';
//console.log("Line 29 Picture: " + this.props.path + ' -- ' + path);
			className += " hasSubGallery";

			subPictureList = <PictureList 
				path         = {path}
				listType     = 'subGallery'
				title        = {title}
				description  = {this.props.description}
				imageFiles   = {this.props.imageFiles}
				imageData    = {this.props.imageData}
				gallery      = {this.props.pictures}
				callbacks    = {this.props.callbacks}
				galleryLevel = 'subTop'
			/>


		}
		else if(this.props.relatedPictures){
			var title = 'Related Pictures for "' + this.props.title +'":';
			var path = this.props.path + '.relatedPictures';
			var gallery = this.props.relatedPictures || [];
			className += " hasRelatedPictures";

			relatedPictureList = <PictureList 
				path         = {path}
				listType     = 'relatedPictures'
				title        = {title}
				description  = {this.props.description}
				imageFiles   = {this.props.imageFiles}
				imageData    = {this.props.imageData}
				gallery      = {gallery}
				callbacks    = {this.props.callbacks}
				galleryLevel = 'subTop'
			/>

		}
		var imageFile = this.props.imageFile;
		var imgSrc = '../../galleryImages/thumbnail/' + imageFile + '.jpg';
		if(document.location.host.match(/localhost/)) {
			imgSrc = './newImageGallery/thumbnail/' + imageFile + '.jpg';
		}
		let callbacks = this.props.callbacks;
		var options = <option key={imageFile} value={imageFile}>{imageFile}</option>
		return (
			<div className={className}>
				<div className='title'>{this.props.displayTitle} </div>
				<div className='pictureSubSection'>
					<div> <img className='thImage' src={imgSrc} /> </div>
					<div className='pictureData' data-path={this.props.path}>
						<input type='text' className='title' defaultValue={this.props.title} autoCompete='off'/>
						<input type='text' className='medium' defaultValue={this.props.medium} />
						<input type='textarea' className='description' defaultValue={this.props.description} />
						<select className='imageFile' onClick={callbacks.showImageSelector} defaultValue={this.props.imageFile}>{options}</select>
						<input type='hidden' name='th' className='th' defaultValue={this.props.fileSizes.th} />
						<input type='hidden' name='reg' className='reg' defaultValue={this.props.fileSizes.reg} />
						<input type='hidden' name='lg' className='lg' defaultValue={this.props.fileSizes.lg} />
						<button onClick={callbacks.saveModifiedPicture} className='save'>Save</button>
						<button onClick={callbacks.deletePicture} className='delete pictureNode'>Delete</button>
						<button onClick={callbacks.cutPicture} className='cut pictureNode'>Cut Picture</button>
						<button onClick={callbacks.insertPicture} className='insert pictureNode'>Insert Picture</button>
						<button onClick={callbacks.addNewPicture} className='add pictureNode'>Add New Picture</button>
						<button onClick={callbacks.addNewRelatedPictures} className='add galleryNode'>Add Related Pictures</button>
						<button onClick={callbacks.addNewSubGallery} className='add galleryNode'>Add Sub-gallery</button>
						<button onClick={callbacks.insertSubGallery} className='insert galleryNode'>Insert Sub-gallery</button>
						<button onClick={callbacks.insertRelatedPictures} className='insert galleryNode'>Insert Related Pictures</button>
					</div>
					{subPictureList}
					{relatedPictureList}
				</div>

			</div>
		);
	}
}


export default Picture;

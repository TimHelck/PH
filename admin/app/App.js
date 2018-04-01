import React, { Component } from 'react';
import {render} from 'react-dom';
import DataContainer from './DataContainer';
/*
function handleSubmit(event){
console.log(event.target);
console.log(event.target.parentNode);
console.log(event.target.parentNode.children);
	var pnc = event.target.parentNode.children;
	var newTitle       = pnc[0].value;
	var newMedium      = pnc[1].value;
	var newDescription = pnc[2].value;
	this.setState({title:newTitle});
	this.setState({medium:newMedium});
	this.setState({description:newDescription});
console.log("Line 216: " + newTitle);
console.log(this.state);
}
*/
render(<DataContainer />, document.getElementById('root'));



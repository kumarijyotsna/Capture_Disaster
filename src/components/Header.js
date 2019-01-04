import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
class Header extends Component{
	render(){
		return(
		<ul className='ulist'>
			<li className='head'>CAPTURE DISASTER</li>
			<li className='liist'><Link to="/">VICTIMS</Link></li>
			<li className='liist'><Link to="/weather">WEATHER</Link></li>
		</ul>	
	)	
	}
}

export default Header;

import React from 'react';
import PropTypes from 'prop-types';
import base from '../base';

import AddFishForm from './AddFishForm';
class Inventory extends React.Component {
	constructor() {
		super();

		this.renderInventory = this.renderInventory.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.logout = this.logout.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			uid: null,
			owner: null
		};
	}
	componentDidMount() {
		base.onAuth(user => {
			if (user) {
				this.authHandler(null, { user });
			}
		});
	}
	handleChange(e, key) {
		const fish = this.props.fishes[key];
		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		};
		this.props.updateFish(key, updatedFish);
	}

	authenticate(provider) {
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	logout() {
		base.unauth();
		this.setState({ uid: null });
	}

	authHandler(err, authData) {
		if (err) {
			console.error(err);
			return;
		}

		//grab the store info
		const storeRef = base.database().ref(this.props.storeId);

		//query the firebase once for the store data
		storeRef.once('value', snapshot => {
			const data = snapshot.val() || {};

			//claim it as our own if there is no owner already
			if (!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
	}

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your stores inventory</p>
				<button className="github" onClick={() => this.authenticate('github')}>
					Log In With Github
				</button>
				<button
					className="facebook"
					onClick={() => this.authenticate('github')}
				>
					Log In With Facebook
				</button>
				<button className="twitter" onClick={() => this.authenticate('github')}>
					Log In With Twitter
				</button>
			</nav>
		);
	}

	renderInventory(key) {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input
					value={fish.name}
					type="text"
					name="name"
					placeholder="Fish name"
					onChange={e => this.handleChange(e, key)}
				/>
				<input
					value={fish.price}
					type="text"
					name="price"
					placeholder="Fish price"
					onChange={e => this.handleChange(e, key)}
				/>
				<select
					value={fish.status}
					type="text"
					name="status"
					placeholder="Fish status"
					onChange={e => this.handleChange(e, key)}
				>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea
					value={fish.desc}
					type="text"
					name="desc"
					placeholder="Fish desc"
					onChange={e => this.handleChange(e, key)}
				/>
				<input
					value={fish.image}
					type="text"
					name="image"
					placeholder="Fish image"
					onChange={e => this.handleChange(e, key)}
				/>
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		);
	}

	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>;
		//check if they are not logged  in at all
		if (!this.state.uid) {
			return <div>{this.renderLogin()}</div>;
		}

		//check if they are the owner of the current store
		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you arent the owner of this store!</p>
					{logout}
				</div>
			);
		}
		return (
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish} />

				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		);
	}
}

Inventory.propTypes = {
	fishes: PropTypes.object.isRequired,
	updateFish: PropTypes.func.isRequired,
	removeFish: PropTypes.func.isRequired,
	addFish: PropTypes.func.isRequired,
	storeId: PropTypes.string.isRequired,
	loadSamples: PropTypes.func.isRequired
};

export default Inventory;

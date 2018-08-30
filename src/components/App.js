import React from 'react';
import PropTypes from 'prop-types';

import Order from './Order';
import Inventory from './Inventory';
import Header from './Header';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();
		//initialState
		this.state = {
			fishes: {},
			order: {}
		};
		this.addFish = this.addFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
		this.updateFish = this.updateFish.bind(this);
	}

	componentDidMount() {
		//this runs right before the <App> is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});

		//check if there is any order in localstorage
		const localStorageRef = localStorage.getItem(
			`order-${this.props.params.storeId}`
		);

		if (localStorageRef) {
			//update our App component's order state
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentDidUpdate(nextProps, nextState) {
		localStorage.setItem(
			`order-${this.props.params.storeId}`,
			JSON.stringify(nextState.order)
		);
	}

	addFish(fish) {
		//update our state
		const fishes = { ...this.state.fishes };

		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		//set state
		this.setState({ fishes });
	}

	updateFish(key, updatedFish) {
		const fishes = { ...this.state.fishes };
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = { ...this.state.fishes };
		fishes[key] = null;
		this.setState({ fishes });
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key) {
		//take a copy of state
		const order = { ...this.state.order };
		//update or add the number of fish ordered
		order[key] = order[key] + 1 || 1;
		//update our state

		this.setState({ order: order }); // can write only order in ES6
	}

	removeFromOrder(key) {
		const order = { ...this.state.order };
		delete order[key];
		this.setState({ order });
	}
	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fishes">
						{Object.keys(this.state.fishes).map(key => (
							<Fish
								key={key}
								index={key}
								details={this.state.fishes[key]}
								addToOrder={this.addToOrder}
							/>
						))}
					</ul>
				</div>
				<Order
					removeFromOrder={this.removeFromOrder}
					params={this.props.params}
					fishes={this.state.fishes}
					order={this.state.order}
				/>
				<Inventory
					updateFish={this.updateFish}
					removeFish={this.removeFish}
					fishes={this.state.fishes}
					addFish={this.addFish}
					storeId={this.props.params.storeId}
					loadSamples={this.loadSamples}
				/>
			</div>
		);
	}
}
App.propTypes = {
	params: PropTypes.object.isRequired
	// storeId: PropTypes.string.isRequired
};
export default App;

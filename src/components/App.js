import React from 'react';
import Order from './Order';
import Inventory from './Inventory';
import Header from './Header';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';

class App extends React.Component {
	constructor() {
		super();
		//initialState
		this.state = {
			fishes: {},
			order: {}
		};
		this.addFish = this.addFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
	}

	addFish(fish) {
		//update our state
		const fishes = { ...this.state.fishes };

		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		//set state
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
				<Order fishes={this.state.fishes} order={this.state.order} />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
			</div>
		);
	}
}

export default App;

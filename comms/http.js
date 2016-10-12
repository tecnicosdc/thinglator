'use strict';

var commsClass = class HttpComms {
	constructor(interfaceId, config) {
		this.interfaceId = interfaceId;
		this.config = config;
	}

	getType() {
		return 'http';
	}

	connect() {
		return Promise.resolve();
	}

	disconnect() {
		return Promise.resolve();
	}

}

module.exports = commsClass;
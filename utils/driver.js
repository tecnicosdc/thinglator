'use strict';

var fs = require('fs');
var models = require('../models');

class DriverSettings {
	constructor(driverId) {
		this.driverId = driverId;
	}

	get() {
		var self = this;
		return new Promise(function(resolve, reject) {
			models['driver'].Model.findOne({
				_id: self.driverId
			}).exec().then(function(result) {
				resolve(result.settings);
			}).catch(function(e) {
				reject(e);
			});
		})

	}

	set(settings) {
		return models['driver'].Model.update({
			_id: this.driverId
		}, {
			settings: settings
		}, {
			upsert: true,
			setDefaultsOnInsert: true
		}).exec();
	}
};

var utils = {
	getDriverSettingsClass: function() {
		return DriverSettings;
	},

	doesDriverExist: function(driverId, type, drivers) {
		return new Promise(function(resolve, reject) {
			if (!drivers[driverId]) {
				return resolve(false);
			}
			if (drivers[driverId].getType() !== type) {
				return resolve(false);
			}
			resolve(true);
		});
	},
	loadDrivers: function(comms) {
		var driversArr = [];
		fs.readdirSync('./node_modules').forEach(function(file) {
			if (file.match(/thinglator-driver-/) !== null) {
				var name = file.replace('thinglator-driver-', '');
				var Driver = require('thinglator-driver-' + name);


				driversArr[name] = new Driver(new DriverSettings(name), comms);
				driversArr[name].setEventEmitter(models[driversArr[name].getType()].DeviceEventEmitter);

				//get a list of devices for this particular driver
				models['device'].Model.find({
					type: driversArr[name].getType(),
					driver: name
				}).exec(function(err, devices) {
					if (err) {
						throw new Error(err);
					}
					driversArr[name].initDevices(devices);
				});
			}
		});
		return driversArr;
	}
};

module.exports = utils;
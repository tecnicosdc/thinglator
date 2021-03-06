var md5 = require('md5');
var models = require('../models');

var utils = {
  createDevice: function(type, driver, deviceSpecs) {
    var deviceSpecsObj = new models[type].Model(deviceSpecs);

    return deviceSpecsObj.validate()
      .then(function(validationFailed) {
        if (validationFailed) {
          var e = new Error(validationFailed);
          e.type = 'Validation';
          throw e;
        }
        var deviceObj = new models['device'].Model({
          _id: md5(type + driver + deviceSpecsObj.deviceId),
          type: type,
          driver: driver,
          specs: deviceSpecsObj
        });
        return deviceObj.save();
      });
  },

  updateDevice: function(device, specs) {
    var deviceSpecsObj = new models[device.type].Model(specs);
    return deviceSpecsObj.validate()
      .then(function(validationFailed) {
        if (validationFailed) {
          var e = new Error(validationFailed);
          e.type = 'Validation';
          throw e;
        }
        device.specs = specs;
        return device.save();
      });
  }
};

module.exports = utils;
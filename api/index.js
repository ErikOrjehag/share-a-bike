
var router = module.exports = require("express").Router();
var pool = require('../pool');
var Particle = require('particle-api-js');
var particle = new Particle();

router.use(require("./fredrik"));
router.use(require("./erik"));
router.use(require("./route"));
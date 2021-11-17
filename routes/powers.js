const powerRouter = require('express').Router({ mergeParams: true });
const PowerController = require('../controller/powerController');

powerRouter
  .route('/')
  .get(PowerController.getHeroPowers)
  .post(PowerController.addHeroPowers);

powerRouter.delete('/:powerId', PowerController.deletePower);

module.exports = powerRouter;
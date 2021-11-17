const heroRouter = require('express').Router();
const imageRouter = require('./image');
const powerRouter = require('./powers');
const HeroController = require('../controller/heroController');
const { uploadImages } = require('../middlewares/imagesUpload');
const paginate = require('../middlewares/paginate');

// способ создания маршрутов при котором одинаковые пути группируются с помощью метода route
heroRouter
  .route('/')
  .get(paginate, HeroController.getHeroes)
  .post(uploadImages, HeroController.createHero);

heroRouter
  .route('/:id')
  .get(HeroController.getHeroById)
  .put(HeroController.updateHeroById)
  .delete(HeroController.deleteHeroById);

heroRouter.use('/:heroId/images/', imageRouter);
heroRouter.use('/:heroId/powers/', powerRouter);

module.exports = heroRouter;
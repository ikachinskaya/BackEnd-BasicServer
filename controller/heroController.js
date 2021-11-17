const { Superhero, SuperPower, Image } = require('../models');
const createHttpError = require('http-errors');

module.exports.createHero = async (req, res, next) => {
  try {
    const { body, files } = req;

    const hero = await Superhero.create(body);

    if (!hero) {
      return next(createHttpError(400));
    }

    // если у файлов есть дилна то создаем картинки
    if (files?.length) {
      const images = files.map(file => ({
        path: file.filename,
        heroId: hero.id,
      }));

      await Image.bulkCreate(images, {
        returning: true,
      });
    }
    // если есть массив суперсил то создаем их для героя
    if (body?.superPowers?.length) {
      const powers = body.superPowers.map(power => ({
        name: power,
        heroId: hero.id,
      }));

      await SuperPower.bulkCreate(powers, {
        returning: true,
      });
    }
    // находим супергероя и все связанные с ним данные
    const heroWithData = await Superhero.findAll({
      where: {
        id: hero.id,
      },
      include: [
        {
          model: SuperPower,
          attributes: ['id', 'name'],
          as: 'superPowers',
        },
        {
          model: Image,
          attributes: ['id', 'path'],
          as: 'images',
        },
      ],
    });
    // посылаем это все нклиенту в ответе
    res.status(201).send({ data: heroWithData });
  } catch (err) {
    next(err);
  }
};

module.exports.getHeroes = async (req, res, next) => {
  try {
    const { pagination } = req;
    // находим инфу про героев, джойним картинки и суперсилы доставая их айдишники , имена картинок и суперсил
    // делаем с пагинцией чтобы пол БД не отдать в одном запросе 
    const heroes = await Superhero.findAll({
      include: [
        {
          model: SuperPower,
          attributes: ['id', 'name'],
          as: 'superPowers',
        },
        {
          model: Image,
          attributes: ['id', 'path'],
          as: 'images',
        },
      ],
      order: [['updated_at', 'DESC']],
      ...pagination,
    });
    // если герое нету то пошлем ошибку что их там нет
    if (!heroes.length) {
      return next(createHttpError(404));
    }
    res.send({ data: heroes });
  } catch (err) {
    next(err);
  }
};

module.exports.getHeroById = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    // то же самое что и сверху но для конкретного героя
    const hero = await Superhero.findByPk(id, {
      include: [
        {
          model: SuperPower,
          attributes: ['id', 'name'],
          as: 'superPowers',
        },
        {
          model: Image,
          attributes: ['id', 'path'],
          as: 'images',
        },
      ],
    });

    if (!hero) {
      return next(createHttpError(404));
    }
    res.send({ data: hero });
  } catch (err) {
    next(err);
  }
};

module.exports.updateHeroById = async (req, res, next) => {
  try {
    const {
      params: { id },
      body: { files },
      body,
    } = req;
    // обновляем героя
    const [count, [updatedHero]] = await Superhero.update(body, {
      where: { id },
      returning: true,
    });
    // если передали картинки то создаем их для героя
    if (files?.length) {
      const images = files.map(file => ({
        path: file.filename,
        heroId: updatedHero.id,
      }));

      await Image.bulkCreate(images, {
        returning: true,
      });
    }
    // то же но с суперсилами
    if (body.superPowers) {
      const powers = body.superPowers.map(power => ({
        name: power,
        heroId: updatedHero.id,
      }));

      await SuperPower.bulkCreate(powers, {
        returning: true,
      });
    }
    // если ни одного героя не обновили то мы его е нашил и кидаем 404
    if (count === 0) {
      return next(createHttpError(404));
    }
    // отсылаем одновленного героя со всеми его данными
    const heroWithData = await Superhero.findAll({
      where: {
        id: updatedHero.id,
      },
      include: [
        {
          model: SuperPower,
          attributes: ['id', 'name'],
          as: 'superPowers',
        },
        {
          model: Image,
          attributes: ['id', 'path'],
          as: 'images',
        },
      ],
    });

    res.send({ data: heroWithData });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteHeroById = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    // удаляем
    const count = await Superhero.destroy({ where: { id } });
    // если не нашли то кидаемся 404
    if (count === 0) {
      return next(createHttpError(404));
    }
    // при удалении впринципе посылка с 200 статусом клиенту уже скажет что все удалилось нормально
    // можно ничего не слать 
    res.status(200).end();
  } catch (err) {
    next(err);
  }
};
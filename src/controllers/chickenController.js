import ChickenService from '../services/chickenService.js';
import { formatSuccess, formatError } from '../utils/responseFormatter.js';

export const getAllChickens = async (req, res, next) => {
  try {
    const chickens = await ChickenService.getAllChickens();
    res.json(formatSuccess(chickens));
  } catch (error) {
    next(error);
  }
};

export const getChickenByCode = async (req, res, next) => {
  try {
    const { chickenCode } = req.params;
    const chicken = await ChickenService.getChickenByCode(chickenCode);
    if (!chicken) {
      return res.status(404).json(formatError('Chicken not found'));
    }
    res.json(formatSuccess(chicken));
  } catch (error) {
    next(error);
  }
};

export const createChicken = async (req, res, next) => {
  try {
    const result = await ChickenService.createChicken(req.body);
    res.status(201).json(formatSuccess({ id: result }));
  } catch (error) {
    next(error);
  }
};

export const updateChicken = async (req, res, next) => {
  try {
    const { chickenCode } = req.params;
    const result = await ChickenService.updateChicken(chickenCode, req.body);
    res.json(formatSuccess({ affected: result }));
  } catch (error) {
    next(error);
  }
};

export const deleteChicken = async (req, res, next) => {
  try {
    const { chickenCode } = req.params;
    const result = await ChickenService.deleteChicken(chickenCode);
    res.json(formatSuccess({ deleted: result }));
  } catch (error) {
    next(error);
  }
};

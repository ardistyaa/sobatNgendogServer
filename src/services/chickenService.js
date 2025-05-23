import Chicken from '../models/Chicken';

class ChickenService {
  static async getAllChickens() {
    return await Chicken.findAll();
  }

  static async getChickenByCode(chickenCode) {
    return await Chicken.findByCode(chickenCode);
  }

  static async createChicken(chickenData) {
    const chicken = new Chicken(
      chickenData.chicken_code,
      chickenData.quantity,
      chickenData.arrival_date,
      chickenData.arrival_age,
      chickenData.arrival_price,
      chickenData.status || 'DOC'
    );
    return await chicken.save();
  }

  static async updateChicken(chickenCode, updateData) {
    return await Chicken.update(chickenCode, updateData);
  }

  static async deleteChicken(chickenCode) {
    return await Chicken.delete(chickenCode);
  }
}

export default ChickenService;

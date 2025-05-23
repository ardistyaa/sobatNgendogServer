import dbPool from "../config/database";

class Egg{

    static async findEggPrice() {
        try{
            const [rows] = await dbPool.query(`SELECT * FROM egg_price`)
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all egg price : ${error.message}`);
        }
    } 

    static async createEggPrice(eggData) {
        const { price , date } = eggData;

        try {
            const [result] = await dbPool.query(`INSERT INTO egg_price (price, date) VALUES (?, ?)`, [price, date]);
            
            return result
        } catch (error) {
            throw error;
        }
    }
}
import pool from '../config/database.js';
import { calculateCurrentAge, formatDateReadable } from '../utils/dateUtils.js';


class Chicken {

static async findAll() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        IFNULL(SUM(cm.dead_quantity), 0) AS dead_quantity,
        IFNULL(SUM(cr.retired_quantity), 0) AS retired_quantity,
        (c.quantity - IFNULL(SUM(cm.dead_quantity), 0) - IFNULL(SUM(cr.retired_quantity), 0)) AS active_quantity,
        ep_last.last_production,
        CASE 
          WHEN (c.quantity - IFNULL(SUM(cm.dead_quantity), 0) - IFNULL(SUM(cr.retired_quantity), 0)) > 0
          THEN ROUND((ep_last.last_production / (c.quantity - IFNULL(SUM(cm.dead_quantity), 0) - IFNULL(SUM(cr.retired_quantity), 0))) * 100, 2)
          ELSE 0
        END AS production_percentage
      FROM chicken c
      LEFT JOIN chicken_mortality cm ON c.chicken_code = cm.chicken_code
      LEFT JOIN chicken_retired cr ON c.chicken_code = cr.chicken_code
      LEFT JOIN (
        SELECT chicken_code, quantity AS last_production
        FROM egg_productions ep1
        WHERE ep1.date = (
          SELECT MAX(date)
          FROM egg_productions ep2
          WHERE ep2.chicken_code = ep1.chicken_code
        )
      ) ep_last ON c.chicken_code = ep_last.chicken_code
      WHERE c.is_deleted = FALSE
      GROUP BY c.chicken_code, ep_last.last_production
    `);

    return rows.map(row => {
      const ageInfo = calculateCurrentAge(row.arrival_date, row.arrival_age);
      return {
        ...row,
        quantity: Number(row.quantity),
        arrival_price: parseFloat(row.arrival_price),
        arrival_date: formatDateReadable(row.arrival_date),
        dead_quantity: Number(row.dead_quantity),
        retired_quantity: Number(row.retired_quantity),
        active_quantity: Number(row.active_quantity),
        last_production: Number(row.last_production),
        production_percentage: Number(row.production_percentage),
        current_age: {
          days: ageInfo.days,
          weeks: ageInfo.weeks,
          months: ageInfo.months,
        }
      };
    });
  } catch (error) {
    throw new Error(`Error fetching chickens: ${error.message}`);
  }
}

static async findByCode(chickenCode) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        COALESCE(cm.total_mortality, 0) AS total_mortality,
        COALESCE(cr.total_retired, 0) AS total_retired,
        (c.quantity - COALESCE(cm.total_mortality, 0) - COALESCE(cr.total_retired, 0)) AS current_quantity,
        COALESCE(ep_stats.total_eggs, 0) AS total_eggs,
        COALESCE(ep_stats.latest_production, 0) AS latest_production,
        ROUND(
          COALESCE(ep_stats.latest_production, 0) / 
          (c.quantity - COALESCE(cm.total_mortality, 0) - COALESCE(cr.total_retired, 0)) * 100, 
          2
        ) AS latest_percentage
      FROM chicken c
      LEFT JOIN (
        SELECT chicken_code, SUM(dead_quantity) AS total_mortality
        FROM chicken_mortality
        GROUP BY chicken_code
      ) cm ON c.chicken_code = cm.chicken_code
      LEFT JOIN (
        SELECT chicken_code, SUM(retired_quantity) AS total_retired
        FROM chicken_retired
        GROUP BY chicken_code
      ) cr ON c.chicken_code = cr.chicken_code
      LEFT JOIN (
        SELECT 
          chicken_code,
          SUM(quantity) AS total_eggs,
          (SELECT quantity 
           FROM egg_productions ep2 
           WHERE ep2.chicken_code = ep1.chicken_code 
           ORDER BY date DESC LIMIT 1) AS latest_production
        FROM egg_productions ep1
        GROUP BY chicken_code
      ) ep_stats ON c.chicken_code = ep_stats.chicken_code
      WHERE c.chicken_code = ? AND c.is_deleted = FALSE
    `, [chickenCode]);

    if (rows.length === 0) return null;

    const chicken = rows[0];
    const ageInfo = calculateCurrentAge(chicken.arrival_date, chicken.arrival_age);

    return {
      ...chicken,
      quantity: Number(chicken.quantity),
      arrival_price: parseFloat(chicken.arrival_price),
      arrival_date: formatDateReadable(chicken.arrival_date),
      total_mortality: Number(chicken.total_mortality),
      total_retired: Number(chicken.total_retired),
      current_quantity: Number(chicken.current_quantity),
      total_eggs: Number(chicken.total_eggs),
      latest_production: Number(chicken.latest_production),
      latest_percentage: Number(chicken.latest_percentage),
      current_age: {
        days: ageInfo.days,
        weeks: ageInfo.weeks,
        months: ageInfo.months,
      }
    };

  } catch (error) {
    throw new Error(`Error fetching chicken by code: ${error.message}`);
  }
}


  static async create(chickenData) {
    const { chicken_code, quantity, arrival_date, arrival_age, arrival_price, status } = chickenData;
    
    try {
      const [result] = await pool.query(
        'INSERT INTO chicken (chicken_code, quantity, arrival_date, arrival_age, arrival_price, status) VALUES (?, ?, ?, ?, ?, ?)',
        [chicken_code, quantity, arrival_date, arrival_age, arrival_price, status]
      );
      
      return { chicken_code, ...chickenData };
    } catch (error) {
      throw error;
    }
  }

  static async update(chickenCode, chickenData) {
    const { quantity, arrival_date, arrival_age, arrival_price, status } = chickenData;
    
    try {
      const [result] = await pool.query(
        'UPDATE chicken SET quantity = ?, arrival_date = ?, arrival_age = ?, arrival_price = ?, status = ? WHERE chicken_code = ?',
        [quantity, arrival_date, arrival_age, arrival_price, status, chickenCode]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(chickenCode) {
  try {
    const [result] = await pool.query(
      'UPDATE chicken SET is_deleted = TRUE WHERE chicken_code = ?',
      [chickenCode]
    );
    return result.affectedRows;
  } catch (error) {
    throw new Error(`Error soft deleting chicken: ${error.message}`);
  }
}

}

export default Chicken;
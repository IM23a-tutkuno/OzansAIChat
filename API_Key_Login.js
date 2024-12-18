import sequelize from './database.js';
import { DataTypes} from "sequelize";

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Task;
// sequelize model
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,250] //between 1 and 250
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};
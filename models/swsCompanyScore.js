var swsCompany = require('./swsCompany');

module.exports = function(sequelize, Sequelize) {
    var CompanyPriceScoreSchema = sequelize.define("swsCompanyScore", {
        company_id: { 
            type: Sequelize.UUID,
        },
        date_generated: Sequelize.DATE,
        dividend: Sequelize.INTEGER,
        future: Sequelize.INTEGER,
        health: Sequelize.INTEGER,
        past: Sequelize.INTEGER,
        value: Sequelize.INTEGER,
        total: Sequelize.INTEGER,
        sentence: Sequelize.STRING,
    },{
        timestamps: false,
        freezeTableName: true
    });

    CompanyPriceScoreSchema.associate = function(models) {
        CompanyPriceScoreSchema.belongsTo(models.swsCompany, { foreignKey: 'company_id'});
    };

    return CompanyPriceScoreSchema;
}




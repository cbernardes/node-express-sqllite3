var swsCompanyPriceClose = require('./swsCompanyPriceClose');
var swsCompanyScore = require('./swsCompanyScore');

module.exports = function(sequelize, Sequelize) {
    var CompanySchema = sequelize.define("swsCompany", {
        name: Sequelize.STRING,
        ticker_symbol: Sequelize.STRING,
        exchange_symbol: Sequelize.STRING,
        unique_symbol: Sequelize.STRING,
        date_generated: Sequelize.DATE,
        security_name: Sequelize.STRING,
        exchange_country_iso: Sequelize.STRING,
        listing_currency_iso: Sequelize.STRING,
        canonical_url: Sequelize.STRING,
        unique_symbol_slug: Sequelize.STRING,
        score_id: Sequelize.STRING,
    },{
        timestamps: false,
        freezeTableName: true
    });

    CompanySchema.associate = function(models) {
        CompanySchema.hasMany(models.swsCompanyPriceClose, { foreignKey: 'company_id'});  
        CompanySchema.hasOne(models.swsCompanyScore, { foreignKey: 'company_id'});  
    };
    
    return CompanySchema;
}
var swsCompany = require('./swsCompany');

module.exports = function(sequelize, Sequelize) {
    var CompanyPriceCloseSchema = sequelize.define("swsCompanyPriceClose", {
        date: Sequelize.DATE,
        company_id: { 
            type: Sequelize.UUID,
            // references: {
            //     // This is a reference to another model
            //     model: swsCompany,
            //     // This is the column name of the referenced model
            //     key: 'id',
            // }
        },
        price: Sequelize.DECIMAL,
        date_created: Sequelize.DATE,
    },{
        timestamps: false,
        freezeTableName: true
    });

    CompanyPriceCloseSchema.associate = function(models) {
        CompanyPriceCloseSchema.belongsTo(models.swsCompany, { foreignKey: 'company_id'});
    };
    CompanyPriceCloseSchema.removeAttribute('id');
    return CompanyPriceCloseSchema;
}




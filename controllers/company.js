
var Sequelize = require("sequelize");
var { swsCompany, swsCompanyPriceClose, swsCompanyScore } = require('../models');
var { cacheWrapper } = require('./cache');
var path = require("path");
var env = process.env.NODE_ENV || "development"; //make this global;
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const pageLimit = config.pageLimit;

const getAllCompanies = (params) => {
    return new Promise(function (resolve, reject) {
        const { symbol, score, sort_score, sort_fluct, page, id } = params || {};
        let whereCompany = {};
        let sort = [];
        let whereScore = {};
        if (symbol) {
            whereCompany.unique_symbol = symbol;
        }
        if (id) {
            whereCompany.id = id;
        }
        if (score) {
            whereScore = { 'total': score };
        }
        if (sort_score) {
            sort.push([Sequelize.col('swsCompanyScore.total'), sort_score.toLowerCase() === 'desc' ? 'DESC' : 'ASC']);
        }
        const query = {
            attributes: [
                'id', 'name', 'unique_symbol',
                [Sequelize.col('swsCompanyScore.dividend'), 'income'],
                [Sequelize.col('swsCompanyScore.value'), 'value'],
                [Sequelize.col('swsCompanyScore.future'), 'future'],
                [Sequelize.col('swsCompanyScore.past'), 'past'],
                [Sequelize.col('swsCompanyScore.health'), 'health'],
                [Sequelize.col('swsCompanyScore.total'), 'total'],
            ],
            include: [{
                attributes: [],
                model: swsCompanyScore,
                where: whereScore,
            }],
            raw: true,
            where: whereCompany,
            order: sort,
        }
        if (!id){ //no pagination if ids informed
            query.limit = pageLimit;
            query.offset = page - 1 || 0
        }
        swsCompany.findAll(query).then(resolve).catch(reject);
    });
};

const getAllCompaniesCached = cacheWrapper('getAllCompaniesCached', getAllCompanies);

const getMostRecentPrice = (params) => {
    const { id } = params;
    return new Promise(function (resolve, reject) {
        wherePrice = {};
        if (id) {
            wherePrice.company_id = id;
        }

        const query = {
            attributes: [
                'company_id', 'price',
                [Sequelize.fn('max', Sequelize.col('date')), 'date']
            ],
            group: ['company_id'],
            raw: true,
            where: wherePrice,
        };
        swsCompanyPriceClose.findAll(query).then((prices) => {
            const formattedPrices = {};
            prices.forEach((p) => {
                if (p && p.company_id) {
                    formattedPrices[p.company_id] = p;
                }
            });
            resolve(formattedPrices);
        }).catch(reject);
    });
};

const getMostRecentPriceCached = cacheWrapper('getMostRecentPriceCached', getMostRecentPrice);



const getHighestFluctuationByCompany = (params) => {
    let { page, sort_fluct } = params || {};
    return new Promise(function (resolve, reject) {
        try {
            page = page - 1 || 0;
            const d = new Date();
            d.setDate(d.getDate() - 330); //should be from last 90 days;
            swsCompanyPriceClose.findAll({
                attributes: [
                    'company_id', 'price', 'date'
                ],
                where: {
                    date: { $gte: d },
                },
                order: [['company_id', 'asc'], ['date', 'desc']],
                raw: true,
            }).then((prices) => {
                if (!prices || !prices.length) return [];
                let companies = [];
                let highest = -1;
                prices.forEach((p, index) => {
                    if (!prices[index + 1] || p.company_id !== prices[index + 1].company_id) {
                        companies.push({ company_id: p.company_id, highestFluctuation: highest, date: p.date });
                        highest = -1;
                        return;
                    }
                    let fluctuation = parseFloat((p.price - prices[index + 1].price).toFixed(2));
                    if (fluctuation < 0) fluctuation = fluctuation * -1; // regardless the change was negative
                    if (fluctuation > highest) highest = fluctuation;
                });
                companies = companies.sort((a, b) => {
                    if (sort_fluct && sort_fluct.toLowerCase() === 'asc') {
                        return a.highestFluctuation - b.highestFluctuation;
                    }
                    return b.highestFluctuation - a.highestFluctuation;
                });
                companies = companies.slice(page * pageLimit, (page + 1) * pageLimit); // pagination
                resolve(companies);
            }).catch(reject);
        } catch (error) {
            reject(error);
        }
    });
};
const getHighestFluctuationByCompanyCached = cacheWrapper('getHighestFluctuationByCompany', getHighestFluctuationByCompany);


const getCompanyDetails =  (params) => {
    const { sort_fluct } = params
    return new Promise(function (resolve, reject) {
        try {
            let method = (params)=>{ return Promise.resolve()};
            let fluctuationIds;
            if (sort_fluct) {
                method = getHighestFluctuationByCompanyCached;
            }

            method(params).then((companiesByFluctuation) => {
                if (companiesByFluctuation && companiesByFluctuation.length){
                    fluctuationIds = companiesByFluctuation.map((c) => {
                        return c.company_id;
                    });
                    params.id = fluctuationIds;
                }

                Promise.all([getAllCompaniesCached(params), getMostRecentPriceCached(params)]).then(([compList, prices]) => {
                    const companies = [...compList]; //Shallow clonig;
                    //addig most recent price to company object and sort it by fluctuation price
                    const formattedCompanies = fluctuationIds ? fluctuationIds.map((fluctCompId) => {
                        const index = companies.findIndex((comp)=>{
                            return comp.id === fluctCompId;
                        });

                        if (index < 0) return null;;
                        const company = companies[index];
                        if (prices && prices[company.id] && prices[company.id].price) {
                            company.recentPrice = prices[company.id].price
                        }
                        //  return the item and push it to the new list;
                        return companies.splice(index, 1)[0];
                    }) : companies.map((comp)=>{
                        if (prices && prices[comp.id] && prices[comp.id].price) {
                            comp.recentPrice = prices[comp.id].price;
                        };
                        return comp;
                    });
                    resolve(formattedCompanies.filter((c)=>{return c}));
                }).catch(reject);
            }).catch(reject);
        } catch (err) {
            reject(err);
        }
    });
}

// not cached
const getCompanyById = (params) => {
    return new Promise(function (resolve, reject) {
        swsCompany.findById(params.id).then(resolve).catch(reject);
    });
}


module.exports = { getCompanyDetails, getCompanyById };
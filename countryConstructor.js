'use strict'
class Country {
    constructor(country, countrycode, slug, newconfirmed, totalconfirmed,
        newdeaths, totaldeaths, newrecovered, totalrecovered,
        date, premium) {

        this.country = country;
        this.countrycode = countrycode;
        this.slug = slug;
        this.newconfirmed = newconfirmed;
        this.totalconfirmed = totalconfirmed;
        this.newdeaths = newdeaths;
        this.totaldeaths = totaldeaths;
        this.newrecovered = newrecovered;
        this.totalrecovered = totalrecovered;
        this.date = date;
        this.premium = premium;
    }
}
module.exports = Country;
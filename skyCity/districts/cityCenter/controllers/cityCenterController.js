const CityCenterService = require("../services/cityCenterService");

module.exports = {
    async getHomePage(req, res) {
        const data = await CityCenterService.getHomePageData();
        res.json(data);
    },

    async getFeaturedBusinesses(req, res) {
        const businesses = await CityCenterService.getFeaturedBusinesses();
        res.json(businesses);
    },

    async getFeaturedEntertainment(req, res) {
        const entertainment = await CityCenterService.getFeaturedEntertainment();
        res.json(entertainment);
    },

    async getAnnouncements(req, res) {
        const announcements = await CityCenterService.getAnnouncements();
        res.json(announcements);
    },

    async registerConsumer(req, res) {
        const result = await CityCenterService.registerConsumer(req.body);
        res.json(result);
    },

    async registerBusiness(req, res) {
        const result = await CityCenterService.registerBusiness(req.body);
        res.json(result);
    }
};

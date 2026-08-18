module.exports = {
    async getHomePageData() {
        return {
            welcome: "Welcome to Sky City",
            districts: [
                "Business District",
                "Entertainment District",
                "Food & Drink District",
                "Services District",
                "Social District",
                "Infrastructure District"
            ],
            featured: {
                businesses: [],
                entertainment: []
            },
            announcements: []
        };
    },

    async getFeaturedBusinesses() {
        return []; // Replace with DB call
    },

    async getFeaturedEntertainment() {
        return []; // Replace with DB call
    },

    async getAnnouncements() {
        return []; // Replace with DB call
    },

    async registerConsumer(data) {
        return { success: true, message: "Consumer registered", data };
    },

    async registerBusiness(data) {
        return { success: true, message: "Business registered", data };
    }
};

module.exports = {
    async getHomePageData() {
        return {
            welcomeMessage: "Welcome to Sky City",
            districts: [
                "Business District",
                "Entertainment District",
                "Food & Drink District",
                "Services District",
                "Social District",
                "Infrastructure District"
            ],
            featured: {
                businesses: await this.getFeaturedBusinesses(),
                entertainment: await this.getFeaturedEntertainment()
            },
            announcements: await this.getAnnouncements(),
            actions: {
                joinConsumer: "/register/consumer",
                joinBusiness: "/register/business"
            }
        };
    },

    async getFeaturedBusinesses() {
        return []; // Replace with DB call later
    },

    async getFeaturedEntertainment() {
        return []; // Replace with DB call later
    },

    async getAnnouncements() {
        return []; // Replace with DB call later
    },

    async registerConsumer(data) {
        return { success: true, message: "Consumer registered", data };
    },

    async registerBusiness(data) {
        return { success: true, message: "Business registered", data };
    }
};

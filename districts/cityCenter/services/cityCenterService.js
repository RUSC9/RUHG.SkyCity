// districts/cityCenter/services/cityCenterService.js

const Announcement = require("../models/Announcement");
const homeModel = require("../models/homeModel");

class CityCenterService {
  constructor() {
    this.announcements = [];
    this.featuredBusinesses = [];
    this.featuredEntertainment = [];
    this.consumers = [];
    this.businesses = [];
  }

  getHomeData() {
    return homeModel.getHomeData();
  }

  getAnnouncements() {
    return this.announcements;
  }

  addAnnouncement(title, message) {
    const newAnnouncement = new Announcement(
      this.announcements.length + 1,
      title,
      message
    );
    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  getFeaturedBusinesses() {
    return this.featuredBusinesses;
  }

  getFeaturedEntertainment() {
    return this.featuredEntertainment;
  }

  registerConsumer(data) {
    this.consumers.push(data);
    return { success: true, consumer: data };
  }

  registerBusiness(data) {
    this.businesses.push(data);
    return { success: true, business: data };
  }
}

module.exports = new CityCenterService();


// districts/cityCenter/services/cityCenterService.js

const Announcement = require('../models/Announcement');
const homeModel = require('../models/homeModel');

class CityCenterService {
  constructor() {
    this.announcements = [];
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
}

module.exports = new CityCenterService();


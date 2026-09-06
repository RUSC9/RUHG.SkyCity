// districts/cityCenter/models/Announcement.js

class Announcement {
  constructor(id, title, message, createdAt) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Announcement;



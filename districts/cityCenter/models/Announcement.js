// districts/cityCenter/models/Announcement.js

class Announcement {
  constructor(id, title, message, createdAt = new Date()) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.createdAt = createdAt;
  }
}

module.exports = Announcement;



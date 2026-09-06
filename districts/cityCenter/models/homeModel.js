// districts/cityCenter/models/homeModel.js

class HomeModel {
  constructor() {
    this.title = "City Center";
    this.description = "Welcome to the heart of Sky City.";
    this.features = [
      "Business Listings",
      "Entertainment Events",
      "City Services",
      "Community Social Hub"
    ];
  }

  getHomeData() {
    return {
      title: this.title,
      description: this.description,
      features: this.features
    };
  }
}

module.exports = new HomeModel();

const Location = require("../models/LocationSchema");

//TODO : Create a new organization in the network.
//TODO : Create a Unidirectional Channel to Candidate Organization
exports.createLocation = (req, res) => {
  const newLocation = new Location(req.body);
  newLocation.createdBy = req.body.user.id;
  newLocation.updatedBy = req.body.user.id;

  newLocation.save((err, location) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).json(location);
  });
};

//TODO : Create a candidate organization in the network
exports.createCandidateLocation = (req, res) => {
  const newLocation = new Location(req.body);

  newLocation
    .save()
    .populate("createdBy", "name -_id")
    .exec((err, location) => {
      if (err) {
        return res.status(500).send({ message: "Something Went Wrong" });
      }
      return res
        .status(200)
        .json({ location, message: "Location Created Succesfully" });
    });
};

exports.getAllLocations = (req, res) => {
  Location.find({}, "name _id createdBy zip")
    .populate("createdBy", "name -_id")
    .exec((err, locations) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json(locations);
    });
};

exports.getLocationById = (req, res) => {
  Location.findById(req.params.id)
    .populate("createdBy", "name -_id")
    .populate("updatedBy", "name -_id")
    .exec((err, location) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      return res.status(200).json(location);
    });
};

exports.updateLocation = (req, res) => {
  Location.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.body.user.id },
    { new: true }
  )
    .populate("createdBy", "name -_id")
    .populate("updatedBy", "name -_id")
    .exec((err, location) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      return res.status(200).json(location);
    });
};

//TODO : Remove the Organization from the network
exports.deleteLocation = (req, res) => {
  Location.findByIdAndRemove(req.params.id, (err, location) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    return res.status(200).json({ message: "Location deleted successfully" });
  });
};

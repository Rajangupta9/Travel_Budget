const Trip = require("../Model/tripModel");
const cron = require('node-cron');



const createTrip = async (req, res) => {
    try {
      const { tripName, totalBudget, startDate, endDate } = req.body;
      
      // Validate end date is after start date
      if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
      
      const newTrip = new Trip({
        user: req.user.id, // Assuming auth middleware sets req.user
        tripName,
        totalBudget,
        remainingBudget: totalBudget, // Initially set to total budget
        dailyAverage: calculateDailyAverage(totalBudget, startDate, endDate),
        startDate,
        endDate,
        expenses: []
      });
      
      const trip = await newTrip.save();
      res.status(201).json(trip);
    } catch (error) {
      console.error('Error creating trip:', error);
      res.status(500).json({ msg: error.message});
    }
};

const getTrips = async (req, res) => {
    try {
      const trips = await Trip.find({ user: req.user.id }).sort({ startDate: -1 });
      res.json(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

 const getTripById = async (req, res) => {
    try {
        console.log(req.params.id);
      const trip = await Trip.findById(req.params.id).populate('expenses');
      
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      
      // Ensure the trip belongs to the current user
      if (trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to access this trip' });
      }
      
      res.json(trip);
    } catch (error) {
      console.error('Error fetching trip:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

 const updatetriptById = async (req, res) => {
    try {
      const { tripName, totalBudget, startDate, endDate } = req.body;
      
      // Find the trip first
      let trip = await Trip.findById(req.params.id);
      
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      
      // Ensure the trip belongs to the current user
      if (trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this trip' });
      }
      
      // Validate end date is after start date
      if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
      
      // Calculate the new remaining budget if total budget changes
      let newRemainingBudget = trip.remainingBudget;
      if (totalBudget) {
        const difference = totalBudget - trip.totalBudget;
        newRemainingBudget = trip.remainingBudget + difference;
      }
      
      // Calculate new daily average if dates or budget changes
      const newDailyAverage = calculateDailyAverage(
        totalBudget || trip.totalBudget,
        startDate || trip.startDate,
        endDate || trip.endDate
      );
      
      // Update the trip
      trip = await Trip.findByIdAndUpdate(
        req.params.id,
        {
          tripName: tripName || trip.tripName,
          totalBudget: totalBudget || trip.totalBudget,
          remainingBudget: newRemainingBudget,
          dailyAverage: newDailyAverage,
          startDate: startDate || trip.startDate,
          endDate: endDate || trip.endDate
        },
        { new: true }
      );
      
      res.json(trip);
    } catch (error) {
      console.error('Error updating trip:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const deleteTripById = async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
      
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      
      // Ensure the trip belongs to the current user
      if (trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this trip' });
      }
      
      await Trip.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
      console.error('Error deleting trip:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  function calculateDailyAverage(budget, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Ensure at least 1 day to avoid division by zero
    const days = Math.max(1, daysDifference);
    return budget / days;
  }

  cron.schedule('0 * * * *', async () => {
    try {
        const today = new Date();

        // Set upcoming trips
        await Trip.updateMany({ startDate: { $gt: today } }, { $set: { name: 'upcoming' } });

        // Set active trips
        await Trip.updateMany(
            { startDate: { $lte: today }, endDate: { $gte: today } }, 
            { $set: { name: 'active' } }
        );

        // Set deactive trips
        await Trip.updateMany({ endDate: { $lt: today } }, { $set: { name: 'deactive' } });

        console.log('Updated trip statuses.');
    } catch (error) {
        console.error('Error updating trips:', error);
    }
});
  
  module.exports = { createTrip, getTrips, getTripById, updatetriptById, deleteTripById };
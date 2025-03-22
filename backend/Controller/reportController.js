const Report = require('../Model/reportModel');
const Trip = require('../Model/tripModel');
const Expense = require('../Model/expenceModel');

const createReport = async (req, res) => {
    try {
      const { tripId } = req.params;
      
      // Check if trip exists and belongs to current user
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      
      if (trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to generate reports for this trip' });
      }
      
      // Get all expenses for the trip
      const expenses = await Expense.find({ trip: tripId });
      
      // Calculate total spent
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Create category breakdown
      const breakdown = new Map();
      expenses.forEach(expense => {
        const category = expense.category;
        const currentAmount = breakdown.get(category) || 0;
        breakdown.set(category, currentAmount + expense.amount);
      });
      
      // Create new report
      const newReport = new Report({
        trip: tripId,
        totalSpent,
        breakdown: Object.fromEntries(breakdown)
      });
      
      const report = await newReport.save();
      
      res.status(201).json(report);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

    const getReports = async (req, res) => {
        try {
          const { tripId } = req.params;
          
          // Check if trip exists and belongs to current user
          const trip = await Trip.findById(tripId);
          if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
          }
          
          if (trip.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view reports for this trip' });
          }
          
          const reports = await Report.find({ trip: tripId }).sort({ createdAt: -1 });
          res.json(reports);
        } catch (error) {
          console.error('Error fetching reports:', error);
          res.status(500).json({ message: 'Server error' });
        }
      }

      const getReportById = async (req, res) => {
        try {
          const report = await Report.findById(req.params.id).populate('trip');
          
          if (!report) {
            return res.status(404).json({ message: 'Report not found' });
          }
          
          // Check if the report belongs to a trip owned by the current user
          if (report.trip.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this report' });
          }
          
          res.json(report);
        } catch (error) {
          console.error('Error fetching report:', error);
          res.status(500).json({ message: 'Server error' });
        }
      }

        const deleteReportWithId = async (req, res) => {
            try {
              const report = await Report.findById(req.params.id).populate('trip');
              
              if (!report) {
                return res.status(404).json({ message: 'Report not found' });
              }
              
              // Check if the report belongs to a trip owned by the current user
              if (report.trip.user.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to delete this report' });
              }
              
              await Report.findByIdAndDelete(req.params.id);
              res.json({ message: 'Report deleted successfully' });
            } catch (error) {
              console.error('Error deleting report:', error);
              res.status(500).json({ message: 'Server error' });
            }
          }

          const getAllReports = async (req, res) => {
            try {
              // Get all trips owned by the user
              const trips = await Trip.find({ user: req.user.id });
              const tripIds = trips.map(trip => trip._id);
              
              // Get all reports for those trips
              const reports = await Report.find({ trip: { $in: tripIds } })
                .populate('trip', 'tripName')
                .sort({ createdAt: -1 });
              
              res.json(reports);
            } catch (error) {
              console.error('Error fetching user reports:', error);
              res.status(500).json({ message: 'Server error' });
            }
          }

          const compareReports = async (req, res) => {
            try {
              const { tripId1, tripId2 } = req.body;
              
              // Check if trips exist and belong to current user
              const trip1 = await Trip.findById(tripId1);
              const trip2 = await Trip.findById(tripId2);
              
              if (!trip1 || !trip2) {
                return res.status(404).json({ message: 'One or both trips not found' });
              }
              
              if (trip1.user.toString() !== req.user.id || trip2.user.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to compare these trips' });
              }
              
              // Get expenses for both trips
              const expenses1 = await Expense.find({ trip: tripId1 });
              const expenses2 = await Expense.find({ trip: tripId2 });
              
              // Calculate totals
              const totalSpent1 = expenses1.reduce((sum, expense) => sum + expense.amount, 0);
              const totalSpent2 = expenses2.reduce((sum, expense) => sum + expense.amount, 0);
              
              // Create category breakdowns
              const breakdown1 = {};
              expenses1.forEach(expense => {
                breakdown1[expense.category] = (breakdown1[expense.category] || 0) + expense.amount;
              });
              
              const breakdown2 = {};
              expenses2.forEach(expense => {
                breakdown2[expense.category] = (breakdown2[expense.category] || 0) + expense.amount;
              });
              
              // Calculate daily averages
              const days1 = Math.max(1, Math.ceil((new Date(trip1.endDate) - new Date(trip1.startDate)) / (1000 * 60 * 60 * 24)));
              const days2 = Math.max(1, Math.ceil((new Date(trip2.endDate) - new Date(trip2.startDate)) / (1000 * 60 * 60 * 24)));
              
              const dailyAverage1 = totalSpent1 / days1;
              const dailyAverage2 = totalSpent2 / days2;
              
              // Generate comparison report
              const comparison = {
                trip1: {
                  id: trip1._id,
                  name: trip1.tripName,
                  totalSpent: totalSpent1,
                  breakdown: breakdown1,
                  dailyAverage: dailyAverage1,
                  duration: days1
                },
                trip2: {
                  id: trip2._id,
                  name: trip2.tripName,
                  totalSpent: totalSpent2,
                  breakdown: breakdown2,
                  dailyAverage: dailyAverage2,
                  duration: days2
                },
                differences: {
                  totalSpent: totalSpent2 - totalSpent1,
                  dailyAverage: dailyAverage2 - dailyAverage1,
                  percentageDifference: ((totalSpent2 - totalSpent1) / totalSpent1) * 100
                }
              };
              
              res.json(comparison);
            } catch (error) {
              console.error('Error generating comparison report:', error);
              res.status(500).json({ message: 'Server error' });
            }
          }

          module.exports = {
            createReport,
            getReports,
            getReportById,
            deleteReportWithId,
            getAllReports,
            compareReports
          };
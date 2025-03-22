import React from "react";
import { X } from "lucide-react";

const TripModal = ({
  showAddTripModal,
  setShowAddTripModal,
  newTrip,
  setNewTrip,
  handleAddTrip,
}) => {
  if (!showAddTripModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Add New Trip</h2>
          <button onClick={() => setShowAddTripModal(false)} className="p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddTrip}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newTrip.name}
              onChange={(e) =>
                setNewTrip({ ...newTrip, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dates
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newTrip.dates}
              onChange={(e) =>
                setNewTrip({ ...newTrip, dates: e.target.value })
              }
              placeholder="e.g. Apr 10 - Apr 18, 2025"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget ($)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newTrip.budget}
              onChange={(e) =>
                setNewTrip({ ...newTrip, budget: e.target.value })
              }
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddTripModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripModal;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PickupLocations = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    location_name: "",
    transport_fee: "",
  });

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/pickup-location");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Error fetching pickup locations");
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/pickup-location", newLocation);
      toast.success("Pickup location added successfully");
      setLocations([...locations, response.data.location]); // Append the new location to the list
      setNewLocation({
        location_name: "",
        transport_fee: "",
      });
    } catch (error) {
      console.error("Error creating pickup location:", error);
      toast.error("Error creating pickup location");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Pickup Locations</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-6">
        <form onSubmit={handleLocationSubmit}>
          <input
            type="text"
            placeholder="Location Name"
            className="border p-2 w-full mb-4"
            value={newLocation.location_name}
            onChange={(e) => setNewLocation({ ...newLocation, location_name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Transport Fee"
            className="border p-2 w-full mb-4"
            value={newLocation.transport_fee}
            onChange={(e) => setNewLocation({ ...newLocation, transport_fee: e.target.value })}
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Location
          </button>
        </form>
      </div>
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="px-4 py-2">Location Name</th>
            <th className="px-4 py-2">Transport Fee</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td className="border px-4 py-2">{location.location_name}</td>
              <td className="border px-4 py-2">{location.transport_fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PickupLocations;

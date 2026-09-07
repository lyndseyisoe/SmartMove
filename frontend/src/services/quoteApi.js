import api from './api';

const quoteApi = {
  estimate: (payload) =>
    api
      .post('/quotes/', {
        distance_km: payload.distanceKm,
        estimated_hours: payload.estimatedHours,
        item_count: payload.itemCount,
        floor_number: payload.floorNumber,
        has_elevator: payload.hasElevator,
      })
      .then((r) => r.data.quote),
};

export default quoteApi;

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./User/user-slice";
import propertySlice from "./Property/property-slice";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice";
import bookingSlice from "./Booking/booking-slice";
// import accomadationSlice from "./Accomadation/accomadation-slice";
// import paymentSlice from "./Payment/payment-slice";

const store = configureStore({
  reducer: {
    properties: propertySlice.reducer,
    propertydetails: propertyDetailsSlice.reducer,
    user: userSlice.reducer,
    bookings: bookingSlice.reducer,
    // accomadation: accomadationSlice.reducer,
    // payment: paymentSlice.reducer,
  },
});

export default store;
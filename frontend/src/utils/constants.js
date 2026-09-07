export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_META = {
  [BOOKING_STATUS.PENDING]: { label: 'Pending', color: 'pending' },
  [BOOKING_STATUS.CONFIRMED]: { label: 'Confirmed', color: 'confirmed' },
  [BOOKING_STATUS.IN_PROGRESS]: { label: 'In Progress', color: 'progress' },
  [BOOKING_STATUS.COMPLETED]: { label: 'Completed', color: 'completed' },
  [BOOKING_STATUS.CANCELLED]: { label: 'Cancelled', color: 'cancelled' },
};


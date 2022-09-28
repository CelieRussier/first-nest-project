import { Booking } from './booking.entity';

describe('BookingEntity', () => {
  it('should be defined', () => {
    expect(new Booking()).toBeDefined();
  });
});

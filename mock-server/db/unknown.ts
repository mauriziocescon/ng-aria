import { faker } from '@faker-js/faker';

export const getUnknownComponent = (index) => ({
  id: faker.string.uuid(),
  type: 'unknown',
  order: parseInt(index),
  valid: true,
});

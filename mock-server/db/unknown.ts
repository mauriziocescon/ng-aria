import { faker } from '@faker-js/faker';

export const getUnknownComponent = (index) => ({
  id: faker.datatype.uuid(),
  type: 'unknown',
  order: parseInt(index),
  valid: true,
});

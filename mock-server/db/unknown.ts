import { faker } from '@faker-js/faker';

export const getUnknownComponent = (index: number) => ({
  id: faker.string.uuid(),
  type: 'unknown',
  order: index,
  valid: true,
  required: false,
});

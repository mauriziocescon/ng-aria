import { faker } from '@faker-js/faker';

export const getDropdown = (index) => {
  const value = faker.datatype.boolean() ? '1' : undefined;

  return {
    id: faker.string.uuid(),
    type: 'dropdown',
    order: parseInt(index),
    label: 'DROPDOWN.DROPDOWN_LABEL',
    value: value,
    choices: ['1', '2', '3'],
    required: true,
    disabled: false,
    valid: !!value,
  };
};

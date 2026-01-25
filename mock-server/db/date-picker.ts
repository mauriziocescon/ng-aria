import { faker } from '@faker-js/faker';

export const getDatePicker = (index: number) => {
  const value = faker.date.future().toISOString();

  return {
    id: faker.string.uuid(),
    type: 'date-picker',
    order: index,
    label: 'DATE_PICKER.DATE_PICKER_LABEL',
    value: value,
    description: 'DATE_PICKER.DATE_PICKER_DESC',
    required: true,
    disabled: false,
    valid: !!value,
  };
};

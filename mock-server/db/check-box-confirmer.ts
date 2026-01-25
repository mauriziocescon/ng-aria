import { faker } from '@faker-js/faker';

export const getCheckBoxConfirmer = (index: number) => {
  const value = faker.datatype.boolean() ? true : undefined;

  return {
    id: faker.string.uuid(),
    type: 'check-box-confirmer',
    order: index,
    label: 'CHECK_BOX_CONFIRMER.CHECK_BOX_CONFIRMER_LABEL',
    value: value,
    description: 'CHECK_BOX_CONFIRMER.CHECK_BOX_CONFIRMER_DESC',
    required: true,
    disabled: false,
    valid: !!value,
  };
};

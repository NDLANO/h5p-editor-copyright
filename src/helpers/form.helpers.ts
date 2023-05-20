import type {
  H5PCopyright,
  H5PField,
  H5PFieldGroup,
  H5PFieldSelect,
  H5PFieldText,
} from 'h5p-types';
import type { Params } from '../h5p-editor-copyright';
import { H5PEditorDialog } from '../h5p-editor-dialog';
import { H5P, H5PEditor } from 'h5p-utils';

export const emptyCopyright: H5PCopyright = {
  author: '',
  license: '',
  source: '',
  title: '',
  version: '',
  year: '',
};

const createCopyrightButton = (): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('h5p-copyright-button');
  button.innerText = H5PEditor.t('core', 'editCopyright');

  return button;
};

const createCopyrightDialog = (dialogParent: HTMLElement): H5PEditorDialog => {
  const dialog = new H5PEditorDialog(dialogParent);

  return dialog;
};

const createLabel = (id: string, text: string): HTMLLabelElement => {
  const label = document.createElement('label');
  label.classList.add('h5peditor-label-wrapper');
  label.setAttribute('for', id);

  const labelText = document.createElement('span');
  labelText.classList.add('h5peditor-label');
  labelText.innerText = text;

  label.appendChild(labelText);
  return label;
};

const createTextField = (
  id: string,
  name: string,
  value: string | undefined,
  inputListener: (newValue: string) => void
): HTMLInputElement => {
  const textField = document.createElement('input');
  textField.type = 'text';
  textField.id = id;
  textField.classList.add(
    'h5peditor-text',
    `h5peditor-input-field-name-${name}`
  );

  if (value) {
    textField.value = value;
  }

  textField.addEventListener('input', (event) =>
    inputListener((event.target as HTMLInputElement).value)
  );

  return textField;
};

const createSelect = (
  id: string,
  name: string,
  value: string,
  options: Array<{ label: string; value: string }>,
  changeListener?: (newValue: string) => void
): HTMLSelectElement => {
  const selectElement = document.createElement('select');
  selectElement.id = id;
  selectElement.classList.add(
    'h5peditor-select',
    `h5peditor-input-field-name-${name}`
  );

  if (changeListener) {
    selectElement.addEventListener('change', (event) =>
      changeListener((event.target as HTMLSelectElement).value)
    );
  }

  options.forEach(({ label, value: optionValue }) => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.selected = value === optionValue;
    option.innerText = label;

    selectElement.appendChild(option);
  });

  return selectElement;
};

const createFieldWrapper = (name: string, type: string): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('field', `field-name-${name}`, type);

  return wrapper;
};

const appendTextInput = (
  field: H5PFieldText,
  value: string,
  parentElement: HTMLElement,
  inputListener: (newValue: string) => void
): void => {
  const id = `id-${H5P.createUUID()}`;

  const label = createLabel(id, field.label);
  const input = createTextField(id, field.name, value, inputListener);

  const wrapper = createFieldWrapper(field.name, field.type);
  wrapper.appendChild(label);
  wrapper.appendChild(input);

  parentElement.appendChild(wrapper);
};

const appendSelect = (
  field: H5PFieldSelect,
  value: string,
  parentElement: HTMLElement,
  hide: boolean,
  changeListener?: (newValue: string) => void
): void => {
  const id = `id-${H5P.createUUID()}`;

  const label = createLabel(id, field.label);
  const select = createSelect(
    id,
    field.name,
    value,
    // @ts-expect-error field.options is an array of strings
    field.options,
    changeListener
  );

  parentElement.appendChild(label);
  parentElement.appendChild(select);

  const wrapper = createFieldWrapper(field.name, field.type);
  wrapper.appendChild(label);
  wrapper.appendChild(select);

  if (hide) {
    wrapper.setAttribute('hidden', 'true');
  }

  parentElement.appendChild(wrapper);
};

const isCCLicense = (value: string) =>
  [
    'CC BY',
    'CC BY-SA',
    'CC BY-ND',
    'CC BY-NC',
    'CC BY-NC-SA',
    'CC BY-NC-ND',
  ].includes(value);

const isGNULicense = (value: string) => ['GNU GPL'].includes(value);
const isPDLicense = (value: string) => ['PD'].includes(value);

const createCopyrightDialogHTML = (
  fields: Array<H5PField>,
  params: Params,
  setValue: (newValue: Partial<Params>) => void
): HTMLElement => {
  const container = document.createElement('div');

  fields.forEach((field) => {
    const value =
      // @ts-expect-error This is handled
      params && field.name in params ? params[field.name] : undefined;

    if (field.type === 'text') {
      appendTextInput(field, value, container, (newValue) =>
        setValue({ [field.name]: newValue })
      );
    }
    else if (field.type === 'select') {
      if (field.name === 'license') {
        appendSelect(field, value, container, false, (newValue) => {
          const versionFields = Array.from(
            container.querySelectorAll<HTMLSelectElement>(
              '.h5peditor-input-field-name-version'
            )
          );
          const ccVersionField = versionFields.find(
            (field) =>
              field?.querySelector<HTMLOptionElement>('option')?.value === '4.0'
          );
          const gnuVersionField = versionFields.find(
            (field) =>
              field?.querySelector<HTMLOptionElement>('option')?.value === 'v3'
          );
          const pdVersionField = versionFields.find(
            (field) =>
              field?.querySelector<HTMLOptionElement>('option')?.value ===
              'CC0 1.0'
          );

          ccVersionField?.parentElement?.setAttribute('hidden', 'true');
          gnuVersionField?.parentElement?.setAttribute('hidden', 'true');
          pdVersionField?.parentElement?.setAttribute('hidden', 'true');

          if (isCCLicense(value)) {
            ccVersionField?.parentElement?.removeAttribute('hidden');
          }
          else if (isGNULicense(newValue)) {
            gnuVersionField?.parentElement?.removeAttribute('hidden');
          }
          else if (isPDLicense(newValue)) {
            pdVersionField?.parentElement?.removeAttribute('hidden');
          }

          setValue({ license: newValue });
        });
      }
      else {
        const hide = !(
          (field.options[0]?.value === '4.0' &&
            isCCLicense(params?.license ?? '')) ||
          (field.options[0]?.value === 'v3' &&
            isGNULicense(params?.license ?? '')) ||
          (field.options[0]?.value === 'CC0 1.0' &&
            isPDLicense(params?.license ?? ''))
        );

        appendSelect(field, value, container, hide, (newValue: string) => {
          setValue({ version: newValue });
        });
      }
    }
  });

  return container;
};

export const createCopyrightHTML = (
  field: H5PFieldGroup,
  params: Params | undefined,
  dialogParent: HTMLElement,
  setValue: (newParams: Partial<Params>) => void
): HTMLElement => {
  let hasCreatedDialogContent = false;
  const copyrightButton = createCopyrightButton();
  const copyrightDialog = createCopyrightDialog(dialogParent);

  copyrightButton.addEventListener('click', () => {
    if (!hasCreatedDialogContent) {
      const dialogContent = createCopyrightDialogHTML(
        field.fields,
        params ?? { ...emptyCopyright },
        setValue
      );

      window.requestAnimationFrame(() => {
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('h5peditor-button-textual', 'importance-low');
        closeButton.innerText = H5PEditor.t('core', 'close');
        closeButton.addEventListener('click', () => {
          copyrightDialog.close();
        });

        copyrightDialog.getElement().appendChild(dialogContent);
        copyrightDialog.getElement().appendChild(closeButton);
      });

      hasCreatedDialogContent = true;
    }

    copyrightDialog.open();
  });

  return copyrightButton;
};

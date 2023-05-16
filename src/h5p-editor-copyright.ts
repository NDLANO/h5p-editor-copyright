import type { H5PCopyright, H5PFieldGroup, IH5PWidget } from 'h5p-types';
import { H5PWidget, registerWidget } from 'h5p-utils';
import { createCopyrightHTML } from './helpers/form.helpers';

const widgetName = 'copyright';

type Field = H5PFieldGroup;
export type Params = H5PCopyright | undefined;

class CopyrightWidget extends H5PWidget<Field, Params> implements IH5PWidget {
  appendTo($containerElement: JQuery<HTMLDivElement>) {
    const { field, setValue } = this;

    const isGroupField = field.type === 'group';
    if (!isGroupField) {
      console.warn(
        `The field \`${field.name}\` has the widget \`${widgetName}\` set, but is of type \`${field.type}\`, not \`group\``
      );
    }

    const container = $containerElement.get(0);

    if (!container) {
      throw new Error('No container element to append CopyrightWrapper to');
    }

    this.wrapper.appendChild(
      createCopyrightHTML(field, this.params, container, (newParams) => {
        this.params = { ...this.params, ...newParams };
        setValue(field, this.params);
      })
    );
    container.appendChild(this.wrapper);
  }

  validate() {
    return true;
  }

  remove() {}
}

registerWidget('Copyright', widgetName, CopyrightWidget);

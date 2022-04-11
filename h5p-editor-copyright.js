(function(){
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var _a, _b;
const H5P = (_a = window.H5P) != null ? _a : {};
const H5PEditor = (_b = window.H5PEditor) != null ? _b : {};
class H5PWidget extends H5P.EventDispatcher {
  constructor(parent, field, params, setValue) {
    super();
    __publicField(this, "field");
    __publicField(this, "parent");
    __publicField(this, "params");
    __publicField(this, "setValue");
    __publicField(this, "wrapper");
    this.wrapper = H5PWidget.createWrapperElement();
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;
  }
  static createWrapperElement() {
    return document.createElement("div");
  }
}
class H5PEditorDialog {
  constructor(parentElement) {
    this.dialog = document.createElement("div");
    this.dialog.classList.add("h5p-dialog", "h5p-editor-dialog");
    this.dialog.style.padding = "1rem 2rem";
    parentElement.appendChild(this.dialog);
  }
  open() {
    this.dialog.classList.add("h5p-open");
  }
  close() {
    this.dialog.classList.remove("h5p-open");
  }
  getElement() {
    return this.dialog;
  }
}
const emptyCopyright = {
  author: "",
  license: "",
  source: "",
  title: "",
  version: "",
  year: ""
};
const createCopyrightButton = () => {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("h5p-copyright-button");
  button.innerText = H5PEditor.t("core", "editCopyright");
  return button;
};
const createCopyrightDialog = (dialogParent) => {
  const dialog = new H5PEditorDialog(dialogParent);
  return dialog;
};
const createLabel = (id, text) => {
  const label = document.createElement("label");
  label.classList.add("h5peditor-label-wrapper");
  label.setAttribute("for", id);
  const labelText = document.createElement("span");
  labelText.classList.add("h5peditor-label");
  labelText.innerText = text;
  label.appendChild(labelText);
  return label;
};
const createTextField = (id, name, value, inputListener) => {
  const textField = document.createElement("input");
  textField.type = "text";
  textField.id = id;
  textField.classList.add("h5peditor-text", `h5peditor-input-field-name-${name}`);
  if (value) {
    textField.value = value;
  }
  textField.addEventListener("input", (event) => inputListener(event.target.value));
  return textField;
};
const createSelect = (id, name, value, options, changeListener) => {
  const selectElement = document.createElement("select");
  selectElement.id = id;
  selectElement.classList.add("h5peditor-select", `h5peditor-input-field-name-${name}`);
  if (changeListener) {
    selectElement.addEventListener("change", (event) => changeListener(event.target.value));
  }
  options.forEach(({ label, value: optionValue }) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.selected = value === optionValue;
    option.innerText = label;
    selectElement.appendChild(option);
  });
  return selectElement;
};
const createFieldWrapper = (name, type) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("field", `field-name-${name}`, type);
  return wrapper;
};
const appendTextInput = (field, value, parentElement, inputListener) => {
  const id = `id-${H5P.createUUID()}`;
  const label = createLabel(id, field.label);
  const input = createTextField(id, field.name, value, inputListener);
  const wrapper = createFieldWrapper(field.name, field.type);
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  parentElement.appendChild(wrapper);
};
const appendSelect = (field, value, parentElement, hide, changeListener) => {
  const id = `id-${H5P.createUUID()}`;
  const label = createLabel(id, field.label);
  const select = createSelect(id, field.name, value, field.options, changeListener);
  parentElement.appendChild(label);
  parentElement.appendChild(select);
  const wrapper = createFieldWrapper(field.name, field.type);
  wrapper.appendChild(label);
  wrapper.appendChild(select);
  if (hide) {
    wrapper.setAttribute("hidden", "true");
  }
  parentElement.appendChild(wrapper);
};
const isCCLicense = (value) => [
  "CC BY",
  "CC BY-SA",
  "CC BY-ND",
  "CC BY-NC",
  "CC BY-NC-SA",
  "CC BY-NC-ND"
].includes(value);
const isGNULicense = (value) => ["GNU GPL"].includes(value);
const isPDLicense = (value) => ["PD"].includes(value);
const createCopyrightDialogHTML = (fields, params, setValue) => {
  const container = document.createElement("div");
  fields.forEach((field) => {
    var _a2, _b2, _c, _d, _e, _f;
    const value = params && field.name in params ? params[field.name] : void 0;
    if (field.type === "text") {
      appendTextInput(field, value, container, (newValue) => setValue({ [field.name]: newValue }));
    } else if (field.type === "select") {
      if (field.name === "license") {
        appendSelect(field, value, container, false, (newValue) => {
          var _a3, _b3, _c2, _d2, _e2, _f2;
          const versionFields = Array.from(container.querySelectorAll(".h5peditor-input-field-name-version"));
          const ccVersionField = versionFields.find((field2) => {
            var _a4;
            return ((_a4 = field2 == null ? void 0 : field2.querySelector("option")) == null ? void 0 : _a4.value) === "4.0";
          });
          const gnuVersionField = versionFields.find((field2) => {
            var _a4;
            return ((_a4 = field2 == null ? void 0 : field2.querySelector("option")) == null ? void 0 : _a4.value) === "v3";
          });
          const pdVersionField = versionFields.find((field2) => {
            var _a4;
            return ((_a4 = field2 == null ? void 0 : field2.querySelector("option")) == null ? void 0 : _a4.value) === "CC0 1.0";
          });
          (_a3 = ccVersionField == null ? void 0 : ccVersionField.parentElement) == null ? void 0 : _a3.setAttribute("hidden", "true");
          (_b3 = gnuVersionField == null ? void 0 : gnuVersionField.parentElement) == null ? void 0 : _b3.setAttribute("hidden", "true");
          (_c2 = pdVersionField == null ? void 0 : pdVersionField.parentElement) == null ? void 0 : _c2.setAttribute("hidden", "true");
          if (isCCLicense(value)) {
            (_d2 = ccVersionField == null ? void 0 : ccVersionField.parentElement) == null ? void 0 : _d2.removeAttribute("hidden");
          } else if (isGNULicense(newValue)) {
            (_e2 = gnuVersionField == null ? void 0 : gnuVersionField.parentElement) == null ? void 0 : _e2.removeAttribute("hidden");
          } else if (isPDLicense(newValue)) {
            (_f2 = pdVersionField == null ? void 0 : pdVersionField.parentElement) == null ? void 0 : _f2.removeAttribute("hidden");
          }
          setValue({ license: newValue });
        });
      } else {
        const hide = !(((_a2 = field.options[0]) == null ? void 0 : _a2.value) === "4.0" && isCCLicense((_b2 = params == null ? void 0 : params.license) != null ? _b2 : "") || ((_c = field.options[0]) == null ? void 0 : _c.value) === "v3" && isGNULicense((_d = params == null ? void 0 : params.license) != null ? _d : "") || ((_e = field.options[0]) == null ? void 0 : _e.value) === "CC0 1.0" && isPDLicense((_f = params == null ? void 0 : params.license) != null ? _f : ""));
        appendSelect(field, value, container, hide, (newValue) => {
          setValue({ version: newValue });
        });
      }
    }
  });
  return container;
};
const createCopyrightHTML = (field, params, dialogParent, setValue) => {
  let hasCreatedDialogContent = false;
  const copyrightButton = createCopyrightButton();
  const copyrightDialog = createCopyrightDialog(dialogParent);
  copyrightButton.addEventListener("click", () => {
    if (!hasCreatedDialogContent) {
      const dialogContent = createCopyrightDialogHTML(field.fields, params != null ? params : __spreadValues({}, emptyCopyright), setValue);
      window.requestAnimationFrame(() => {
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.classList.add("h5peditor-button-textual", "importance-low");
        closeButton.innerText = H5PEditor.t("core", "close");
        closeButton.addEventListener("click", () => {
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
const widgetName = "copyright";
class CopyrightWidget extends H5PWidget {
  appendTo($containerElement) {
    const { field, setValue } = this;
    const isGroupField = field.type === "group";
    if (!isGroupField) {
      console.warn(`The field \`${field.name}\` has the widget \`${widgetName}\` set, but is of type \`${field.type}\`, not \`group\``);
    }
    const container = $containerElement.get(0);
    if (!container) {
      throw new Error("No container element to append CopyrightWrapper to");
    }
    this.wrapper.appendChild(createCopyrightHTML(field, this.params, container, (newParams) => {
      this.params = __spreadValues(__spreadValues({}, this.params), newParams);
      setValue(field, this.params);
    }));
    container.appendChild(this.wrapper);
  }
  validate() {
    return true;
  }
  remove() {
  }
}
H5PEditor.Copyright = CopyrightWidget;
H5PEditor.widgets[widgetName] = CopyrightWidget;

})()
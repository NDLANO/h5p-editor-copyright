export class H5PEditorDialog {
  private dialog: HTMLElement;

  constructor(parentElement: HTMLElement) {
    this.dialog = document.createElement('div');
    this.dialog.classList.add('h5p-dialog', 'h5p-editor-dialog');
    this.dialog.style.padding = '1rem 2rem';

    parentElement.appendChild(this.dialog);
  }

  open(): void {
    this.dialog.classList.add('h5p-open');
  }

  close(): void {
    this.dialog.classList.remove('h5p-open');
  }

  getElement(): HTMLElement {
    return this.dialog;
  }
}

export interface Dialog extends HTMLDialogElement {
    showModal: () => void;
    show: () => void;
    close: (returnValue?: string) => void;
    returnValue: string
}

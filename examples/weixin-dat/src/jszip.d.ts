declare module 'jszip' {
  const JSZip: any;
  export default JSZip;
}

declare global {
  interface Window {
    JSZip?: any;
  }
}

export {};

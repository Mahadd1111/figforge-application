interface FigmaAPI {
  currentPage: {
    selection: Array<any>;
  };
  on: (eventName: string, callback: () => void) => void;
  off: (eventName: string, callback: () => void) => void;
  // You can expand on this interface as you access more properties and methods of the Figma API
}

interface Window {
  figma: FigmaAPI;
}

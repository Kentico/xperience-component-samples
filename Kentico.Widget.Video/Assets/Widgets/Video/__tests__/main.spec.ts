import { init } from "../main";

describe('video widget', () => {
  
  describe('init', () => {
    const widgetGuid = "290c6509-dbaa-4e18-ab82-b60cbad23c78";

    test('resizes iframe height according parent', () => {
      const outerDiv = document.createElement("div");
      const iframe = document.createElement("iframe");

      jest.spyOn(outerDiv, 'clientWidth', 'get').mockImplementation(() => 100);
      iframe.dataset.widgetGuid = widgetGuid;
      outerDiv.appendChild(iframe);
      document.body.appendChild(outerDiv);
      
      init(widgetGuid);
      const element = document.body.querySelector<HTMLIFrameElement>(`iframe[data-widget-guid='${widgetGuid}']`);
      
      expect(element!.style.height).toBe("56px");
      expect(element!.style.width).toBe(`${outerDiv.clientWidth}px`);
    });
  });
});

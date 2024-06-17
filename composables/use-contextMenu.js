let contextMenu;
const useContextMenu = () => {
  if (!contextMenu) {
    const { x, y } = useMouse();
    const { y: windowY } = useWindowScroll();

    contextMenu = reactive({
      isOpen: false,
      virtualElement: {
        getBoundingClientRect: () => ({}),
      },
      contents: {},
      open: (contents) => {
        contextMenu.contents = contents;

        const top = unref(y) - unref(windowY);
        const left = unref(x);

        contextMenu.virtualElement.getBoundingClientRect = () => ({
          width: 0,
          height: 0,
          top,
          left,
        });

        contextMenu.isOpen = true;
      },
      close: () => {
        contextMenu.isOpen = false;
      },
    });
  }

  return contextMenu;
};

export { useContextMenu };

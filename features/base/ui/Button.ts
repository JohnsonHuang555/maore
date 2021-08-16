const Button = (scene: any, text: string) => {
  return scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangleCanvas(0, 0, 0, 0, 20, 0x333333),
    text: scene.add.text(0, 0, text, {
      fontSize: '24px',
      padding: {
        top: 5,
      },
    }),
    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
  });
};

export default Button;

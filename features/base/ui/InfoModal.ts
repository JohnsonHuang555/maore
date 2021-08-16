import Button from './Button';

type InfoModalProps = {
  scene: any;
  title?: string;
  description: string;
};

const InfoModal = (props: InfoModalProps) => {
  const { scene } = props;
  const { title = '訊息', description } = props;
  const { width, height } = scene.scale;
  return scene.rexUI.add
    .dialog({
      x: width * 0.5,
      y: height * 0.5,

      background: scene.rexUI.add.roundRectangleCanvas(
        0,
        0,
        100,
        100,
        20,
        0x1d1d1d
      ),

      title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangleCanvas(
          0,
          0,
          100,
          40,
          20,
          0x333333
        ),
        text: scene.add.text(0, 0, title, {
          fontSize: '24px',
          padding: {
            top: 5,
          },
        }),
        space: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10,
        },
      }),

      content: scene.add.text(0, 0, description, {
        fontSize: '24px',
        padding: {
          top: 5,
        },
      }),

      actions: [Button(scene, '好')],

      space: {
        title: 25,
        content: 25,
        action: 15,

        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },

      align: {
        actions: 'center', // 'center'|'left'|'right'
      },

      expand: {
        content: false, // Content is a pure text object
      },
    })
    .layout()
    .setDepth(999)
    .popUp(500);
};

export default InfoModal;

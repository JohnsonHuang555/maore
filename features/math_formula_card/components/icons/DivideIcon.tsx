import { SvgIcon, SvgIconProps } from '@mui/material';

type DivideIconProp = SvgIconProps & {
  pathcolor?: string;
};

const DivideIcon = (props: DivideIconProp) => {
  const { pathcolor = '#264653' } = props;
  return (
    <SvgIcon {...props} viewBox="0 0 448 512">
      <path d="M400 224h-352c-17.69 0-32 14.31-32 31.1s14.31 32 32 32h352c17.69 0 32-14.31 32-32S417.7 224 400 224zM224 144c26.47 0 48-21.53 48-48s-21.53-48-48-48s-48 21.53-48 48S197.5 144 224 144zM224 368c-26.47 0-48 21.53-48 48s21.53 48 48 48s48-21.53 48-48S250.5 368 224 368z" />
    </SvgIcon>
  );
};

export default DivideIcon;

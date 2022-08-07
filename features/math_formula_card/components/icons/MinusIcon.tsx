import { SvgIcon, SvgIconProps } from '@mui/material';

type MinusIconProp = SvgIconProps & {
  pathcolor?: string;
};

const MinusIcon = (props: MinusIconProp) => {
  const { pathcolor = '#264653' } = props;
  return (
    <SvgIcon {...props} viewBox="0 0 448 512">
      <path d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z" />
    </SvgIcon>
  );
};

export default MinusIcon;

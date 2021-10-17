import Box from '@mui/material/Box';

type IconProps = {
  title?: string | number;
  children: JSX.Element;
  fontSize?: '14px' | '16px' | '18px' | '22px' | '24px' | '26px';
};

const IconLable = (props: IconProps) => {
  const { title = '', children, fontSize = '20px' } = props;
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {children}
      <Box sx={{ fontSize }}>{title}</Box>
    </Box>
  );
};

export default IconLable;

import { CSSProperties } from 'react';
import styles from 'styles/components/icon.module.scss';

type IconProps = {
  title?: string | number;
  children: JSX.Element;
  customStyles?: CSSProperties;
  fontSize?: '14px' | '16px' | '18px' | '22px' | '24px' | '26px';
};

const Icon = (props: IconProps) => {
  const { title = '', children, customStyles, fontSize = '20px' } = props;
  return (
    <div className={styles.icon} style={customStyles}>
      {children}
      <span className={styles.title} style={{ fontSize: fontSize }}>
        {title}
      </span>
    </div>
  );
};

export default Icon;

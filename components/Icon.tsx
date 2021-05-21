import { CSSProperties } from 'react';
import styles from 'styles/components/icon.module.scss';

type IconProps = {
  title?: string | number;
  children: JSX.Element;
  customStyles?: CSSProperties;
};

const Icon = (props: IconProps) => {
  const { title = '', children, customStyles } = props;
  return (
    <div className={styles.icon} style={customStyles}>
      {children}
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default Icon;

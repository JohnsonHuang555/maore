import styles from 'styles/components/footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.slogan}>
        Game makes us happy and crazy. Keep your curiosity forever.
      </div>
      <div className={styles.copyright}>
        The website is created at 2020 by Johnson Huang
      </div>
    </div>
  );
};

export default Footer;

import { Box } from '@mui/material';
import styles from '@styles/components/footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <Box
        className={styles.slogan}
        sx={{
          fontSize: {
            xs: '14px',
            sm: '16px',
          },
        }}
      >
        目前為 beta 版本，若遇到 bug 請等待修復，沒有一個 bug 是重新整理修不好的
      </Box>
      <div className={styles.copyright}>
        The website is created at 2022 by{' '}
        <a href="https://github.com/JohnsonHuang555/maore" target="_blank">
          Johnson Huang
        </a>
        {'.'} <span>請用 chrome 瀏覽器遊玩，電腦、平板支援度較佳</span>
        {/* TODO: 版號自動化 */}
        {'.'} <b>beta v0.3.7</b>
      </div>
    </div>
  );
};

export default Footer;

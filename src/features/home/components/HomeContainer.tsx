'use client';

import styles from './HomeContainer.module.scss';
import RecentProjects from './RecentProjects';

export default function HomeContainer() {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.visual}>
          <span className={styles.text1}>FRONT END & Web Publisher</span>
          <span className={styles.text2}>
            PORTFOLI
            <br />
            WEB DEVELOPER
          </span>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <div className={styles.text}>
              저의 포트폴리오에 방문해 주셔서 감사합니다.
              <br />
              더욱 전문성 있는 프론트엔드 개발자로 성장하고자 합니다.
              <br />
              새로운 기술을 학습하며, 익숙해지는 것에 전념하고 있습니다.
            </div>
            <div className={styles.buttonAction}>
              <button>About Me</button>
              <button>Project</button>
            </div>
          </div>
          <RecentProjects />
        </div>
      </div>
    </div>
  );
}

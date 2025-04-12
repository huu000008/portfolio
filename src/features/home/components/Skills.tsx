import React from 'react';
import styles from './Skills.module.scss';
import classNames from 'clsx';
import { InViewMotion } from '@/components/ui/InViewMotion';

interface DirectionProps {
  x: number;
  y: number;
}

interface Skill {
  name: string;
}

interface SkillCategory {
  category: string;
  className: string;
  direction: string;
  skills: Skill[];
}

const Skills = () => {
  const skillCategories: SkillCategory[] = [
    {
      category: '프론트엔드',
      className: styles.frontend,
      direction: 'left-to-right',
      skills: [
        { name: 'React' },
        { name: 'Next.js' },
        { name: 'Vue.js' },
        { name: 'Nuxt.js' },
        { name: 'TypeScript' },
      ],
    },
    {
      category: '스타일링',
      className: styles.styling,
      direction: 'right-to-left',
      skills: [{ name: 'SCSS Modules' }, { name: 'Radix UI' }, { name: 'Responsive Design' }],
    },
    {
      category: '상태 관리',
      className: styles.state,
      direction: 'left-to-right',
      skills: [
        { name: 'TanStack Query' },
        { name: 'Zustand' },
        { name: 'Vuex' },
        { name: 'Pinia' },
        { name: 'Immer' },
      ],
    },
    {
      category: '기타',
      className: styles.etc,
      direction: 'right-to-left',
      skills: [
        { name: 'Supabase' },
        { name: 'Zod' },
        { name: 'React Hook Form' },
        { name: 'Vercel' },
      ],
    },
  ];

  return (
    <div className={styles.skillsContainer}>
      <InViewMotion>
        <h2 className={styles.skillsTitle}>기술 스택</h2>
      </InViewMotion>

      <div className={styles.skillsGrid}>
        {skillCategories.map((category, categoryIndex) => (
          <InViewMotion
            key={category.category}
            className={classNames(styles.categoryCard, category.className)}
            direction={category.direction as any}
            delay={categoryIndex * 0.2}
          >
            <h3 className={styles.categoryTitle}>{category.category}</h3>
            <ul className={styles.skillsList}>
              {category.skills.map((skill, skillIndex) => (
                <li key={skill.name} className={styles.skillItem}>
                  <InViewMotion
                    direction="bottom-to-top"
                    delay={0.3 + skillIndex * 0.1}
                    distance={10}
                  >
                    <span className={styles.skillName}>{skill.name}</span>
                  </InViewMotion>
                </li>
              ))}
            </ul>
          </InViewMotion>
        ))}
      </div>
    </div>
  );
};

export default Skills;

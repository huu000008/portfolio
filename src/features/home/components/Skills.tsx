import React from 'react';
import styles from './Skills.module.scss';
import classNames from 'clsx';
import { InViewMotion, Direction } from '@/components/ui/InViewMotion';

interface Skill {
  name: string;
}

interface SkillCategory {
  category: string;
  className: string;
  direction: Direction;
  skills: Skill[];
}

// SkillItem 컴포넌트 분리 및 React.memo 적용
interface SkillItemProps {
  skill: Skill;
  index: number;
}

const SkillItem = React.memo(({ skill, index }: SkillItemProps) => {
  return (
    <li className={styles.skillItem}>
      <InViewMotion direction="bottom-to-top" delay={0.3 + index * 0.1} distance={10}>
        <span className={styles.skillName}>{skill.name}</span>
      </InViewMotion>
    </li>
  );
});

SkillItem.displayName = 'SkillItem'; // React DevTools에서 컴포넌트 이름 표시

// SkillCategoryCard 컴포넌트 분리 및 React.memo 적용
interface SkillCategoryCardProps {
  category: SkillCategory;
  index: number;
}

const SkillCategoryCard = React.memo(({ category, index }: SkillCategoryCardProps) => {
  return (
    <InViewMotion
      key={category.category} // key는 map 내부에서 사용되므로 여기서는 제거해도 무방하나, 명시적으로 남겨둠
      className={classNames(styles.categoryCard, category.className)}
      direction={category.direction}
      delay={index * 0.2}
    >
      <h3 className={styles.categoryTitle}>{category.category}</h3>
      <ul className={styles.skillsList}>
        {category.skills.map((skill, skillIndex) => (
          <SkillItem key={skill.name} skill={skill} index={skillIndex} />
        ))}
      </ul>
    </InViewMotion>
  );
});

SkillCategoryCard.displayName = 'SkillCategoryCard'; // React DevTools에서 컴포넌트 이름 표시

// Skills 컴포넌트: 데이터 정의 및 SkillCategoryCard 렌더링
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
        <h2 className={styles.skillsTitle}>Skills</h2>
      </InViewMotion>

      <div className={styles.skillsGrid}>
        {skillCategories.map((category, categoryIndex) => (
          // 분리된 SkillCategoryCard 컴포넌트 사용
          <SkillCategoryCard key={category.category} category={category} index={categoryIndex} />
        ))}
      </div>
    </div>
  );
};

export default Skills;

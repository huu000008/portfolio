import React from 'react';
import { InViewMotion, Direction } from '@/components/ui/InViewMotion';
import styles from './Skills.module.scss';

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
      <InViewMotion
        direction="bottom-to-top"
        delay={0.3 + index * 0.1}
        distance={10}
        className={styles.skillPill}
      >
        <span>{skill.name}</span>
      </InViewMotion>
    </li>
  );
});

SkillItem.displayName = 'SkillItem';

// SkillCategoryCard 컴포넌트 분리 및 React.memo 적용
interface SkillCategoryCardProps {
  category: SkillCategory;
  index: number;
}

const SkillCategoryCard = React.memo(({ category, index }: SkillCategoryCardProps) => {
  // categoryCard와 카테고리별 클래스 동시 적용
  const cardClass = [styles.categoryCard, styles[category.className] || ''].join(' ');

  return (
    <InViewMotion
      key={category.category}
      className={cardClass}
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

SkillCategoryCard.displayName = 'SkillCategoryCard';

const Skills = () => {
  const skillCategories: SkillCategory[] = [
    {
      category: '프론트엔드',
      className: 'frontend',
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
      className: 'styling',
      direction: 'right-to-left',
      skills: [{ name: 'SCSS Modules' }, { name: 'Radix UI' }, { name: 'Responsive Design' }],
    },
    {
      category: '상태 관리',
      className: 'state',
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
      className: 'etc',
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
    <div className={styles.skillsRoot}>
      <InViewMotion>
        <h2 className={styles.skillsTitle}>Skills</h2>
      </InViewMotion>
      <div className={styles.skillsGrid}>
        {skillCategories.map((category, categoryIndex) => (
          <SkillCategoryCard key={category.category} category={category} index={categoryIndex} />
        ))}
      </div>
    </div>
  );
};

export default Skills;

import { Project } from '../../../types/project';
import styles from './ProjectItem.module.scss';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  project: Project;
};

export const ProjectItem = ({ project }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <TransitionLink className={styles.wrap} href={`/projects/${project.id}`}>
        <div className={styles.thumbnail}>
          <Image
            src={project.thumbnail_url || 'https://dummyimage.com/600x400'}
            alt={`${project.title} 썸네일`}
            width={600}
            height={400}
            priority
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.description && <p className={styles.description}>{project.description}</p>}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className={styles.techStack}>
              {project.tech_stack.map((tech, index) => (
                <span key={index} className={styles.techItem}>
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </TransitionLink>
    </motion.div>
  );
};

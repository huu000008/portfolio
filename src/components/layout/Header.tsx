import Link from 'next/link';
import { InViewMotion } from '../ui/InViewMotion';

export default function Header() {
  return (
    <>
      <header>
        <InViewMotion direction="left-to-right">
          <Link href="/" aria-label="홈페이지로 이동">
            <h1>
              <span>johyukrae</span>
            </h1>
          </Link>
        </InViewMotion>
      </header>
    </>
  );
}

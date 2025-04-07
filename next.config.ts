import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  /* config options here */
  images: {
    domains: ['mpivilzknwtgopfeqmkb.supabase.co'],
  },
};

export default withVanillaExtract(nextConfig);

import type { LOCALES } from '@/constants';
import { meta_ja } from './meta_ja';
import { meta_zh } from './meta_zh';
import type { MetaCommon } from './type';

const meta: Record<LOCALES, Record<string, MetaCommon>> = {
  zh: meta_zh,
  ja: meta_ja,
};

export default meta;

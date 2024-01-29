import type { LOCALES } from "@/constants";
import { about_ja } from "./test_ja";
import { about_zh } from "./test_zh";
import type { About } from "./type";

const test:Record<LOCALES,About> = {
  zh: about_zh,
  ja: about_ja
}

export default test
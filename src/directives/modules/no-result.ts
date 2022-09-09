import noResult from '@/components/base/no-result/no-result.vue';
import directiveFactory from '@/assets/ts/directive-factory'

const noResultDirective = directiveFactory(noResult, 'no-result');

export default noResultDirective
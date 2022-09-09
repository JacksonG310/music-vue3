import Loading from '@/components/base/loading/loading.vue';
import directiveFactory from '@/assets/ts/directive-factory'

const loadingDirective = directiveFactory(Loading, 'loading');

export default loadingDirective
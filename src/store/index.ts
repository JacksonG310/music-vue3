import { createStore, createLogger } from 'vuex'
import state from './state';
import mutations from './mutations';
import * as actions from './actions'
import * as getters from './getters';

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
